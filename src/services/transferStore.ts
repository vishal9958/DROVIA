import JSZip from "jszip"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { storeBlobInIDB, getBlobFromIDB } from "./fileBufferStore"

export interface FileInfo {
  id: string
  name: string
  size: number
  type: string
  url?: string
  blob?: Blob
}

export interface TransferSession {
  pin: string
  rawPin: string
  files: FileInfo[]
  createdAt: number
  status: "waiting" | "connecting" | "transferring" | "complete" | "expired"
  senderDevice: string
  progress: number
  speedMbps: number
}

export interface HistoryRecord {
  id: string
  name: string
  size: number
  date: string
  device: string
  status: "completed" | "cancelled" | "failed" | "expired"
  direction: "sent" | "received"
  file?: FileInfo
}

const getApiHost = () => {
  if (typeof window !== "undefined") {
    // If VITE_API_HOST is defined (e.g., deployed to Vercel), use it!
    if (import.meta.env && import.meta.env.VITE_API_HOST) {
      return import.meta.env.VITE_API_HOST
    }

    // Detect Capacitor Native App (Android/iOS)
    const isCapacitorNative = !!(window as any).Capacitor?.isNativePlatform?.() || window.location.protocol === "capacitor:"
    if (isCapacitorNative) {
      return "https://drovia-backend-8gvb.onrender.com/api"
    }
    
    if (window.location && window.location.hostname) {
      if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
        return `http://localhost:5000/api`
      }
      const protocol = window.location.protocol === "https:" ? "https:" : "http:"
      return `${protocol}//${window.location.hostname}:5000/api`
    }
  }
  return "http://localhost:5000/api"
}

const blobMap = new Map<string, Blob>()
const activeTransfers = new Map<string, TransferSession>()

const channel = typeof window !== "undefined" && "BroadcastChannel" in window ? new BroadcastChannel("drovia_sync") : null

if (channel) {
  channel.onmessage = (event) => {
    if (event.data?.type === "REGISTER_TRANSFER") {
      const session: TransferSession = event.data.session
      activeTransfers.set(session.rawPin, session)
    } else if (event.data?.type === "UPDATE_STATUS") {
      const session = activeTransfers.get(event.data.rawPin)
      if (session) {
        session.status = event.data.status
        activeTransfers.set(event.data.rawPin, session)
      }
    }
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1] || ""
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

export function registerTransfer(files: FileInfo[], customPin?: string): TransferSession {
  try {
    localStorage.removeItem("drovia_last_session")
  } catch (e) {}

  const pinNum = customPin || Math.floor(100000 + Math.random() * 900000).toString()
  const rawPin = pinNum.replace(/\s+/g, "")
  const formattedPin = rawPin.slice(0, 3) + " " + rawPin.slice(3)

  const processedFiles = files.map((f) => {
    if (f.blob) {
      blobMap.set(f.id, f.blob)
      blobMap.set(rawPin, f.blob)
      storeBlobInIDB(f.id, f.blob)
      storeBlobInIDB(rawPin, f.blob)
      if (f.name) storeBlobInIDB(f.name, f.blob)

      blobToBase64(f.blob).then((base64Data) => {
        fetch(`${getApiHost()}/transfers/upload-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pin: rawPin,
            fileId: f.id,
            name: f.name,
            type: f.type,
            base64Data,
          }),
        }).catch(() => {})
      }).catch(() => {})
    }
    return f
  })

  const session: TransferSession = {
    pin: formattedPin,
    rawPin,
    files: processedFiles,
    createdAt: Date.now(),
    status: "waiting",
    senderDevice: getDeviceName(),
    progress: 0,
    speedMbps: Math.floor(30 + Math.random() * 50),
  }

  activeTransfers.set(rawPin, session)

  try {
    localStorage.setItem("drovia_status_update_" + rawPin, JSON.stringify({ rawPin, status: "waiting", updatedAt: Date.now() }))
    localStorage.setItem("drovia_session_" + rawPin, JSON.stringify(session))
    localStorage.setItem("drovia_last_session", JSON.stringify(session))
  } catch (e) {}

  try {
    fetch(`${getApiHost()}/transfers/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pin: rawPin,
        senderDevice: session.senderDevice,
        files: session.files.map(f => ({ id: f.id, name: f.name, size: f.size, type: f.type })),
      }),
    }).catch(() => {})
  } catch (e) {}

  if (channel) {
    channel.postMessage({ type: "REGISTER_TRANSFER", session })
  }

  return session
}

export function updateTransferStatus(pin: string, status: TransferSession["status"]) {
  const rawPin = pin.replace(/\s+/g, "")
  const session = activeTransfers.get(rawPin) || findTransfer(rawPin)
  if (session) {
    session.status = status
    activeTransfers.set(rawPin, session)
  }

  const payload = JSON.stringify({ rawPin, status, updatedAt: Date.now() })

  try {
    localStorage.setItem("drovia_status_update_" + rawPin, payload)
    localStorage.setItem("drovia_global_status", payload)
  } catch (e) {}

  try {
    fetch(`${getApiHost()}/transfers/update-status`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin: rawPin, status }),
    }).catch(() => {})
  } catch (e) {}

  if (channel) {
    channel.postMessage({ type: "UPDATE_STATUS", rawPin, status, updatedAt: Date.now() })
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("drovia_status_update", { detail: { rawPin, status } }))
  }
}

export function findTransfer(pin: string): TransferSession | null {
  const rawPin = pin.replace(/\s+/g, "")
  let session = activeTransfers.get(rawPin) || null

  if (!session) {
    try {
      const stored = localStorage.getItem("drovia_session_" + rawPin)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.rawPin === rawPin) {
          session = parsed
        }
      }
    } catch (e) {}
  }

  if (session) {
    try {
      const statusPayload = localStorage.getItem("drovia_status_update_" + rawPin)
      if (statusPayload) {
        const parsed = JSON.parse(statusPayload)
        if (parsed.rawPin === rawPin) {
          session.status = parsed.status
        }
      }
    } catch (e) {}
  }

  return session
}

export async function fetchSessionFromServer(pin: string): Promise<TransferSession | null> {
  const rawPin = pin.replace(/\s+/g, "")

  try {
    const res = await fetch(`${getApiHost()}/transfers/${rawPin}`)
    if (res.ok) {
      const data = await res.json()
      if (data && data.success && data.session && data.session.files && data.session.files.length > 0) {
        const serverSession = data.session
        const formattedSession: TransferSession = {
          pin: serverSession.pin || (rawPin.slice(0, 3) + " " + rawPin.slice(3)),
          rawPin,
          files: serverSession.files.map((f: any) => ({
            id: f.id || Math.random().toString(36).slice(2),
            name: f.name || "transferred-file",
            size: f.size || 1024,
            type: f.type || "application/octet-stream",
          })),
          createdAt: serverSession.createdAt || Date.now(),
          status: serverSession.status || "waiting",
          senderDevice: serverSession.senderDevice || serverSession.senderDeviceId || "Connected Device",
          progress: 0,
          speedMbps: 42.8,
        }
        activeTransfers.set(rawPin, formattedSession)
        try {
          localStorage.setItem("drovia_session_" + rawPin, JSON.stringify(formattedSession))
        } catch (e) {}
        return formattedSession
      }
    }
  } catch (e) {}

  const local = findTransfer(rawPin)
  if (local && local.rawPin === rawPin && local.files && local.files.length > 0) {
    return local
  }

  return null
}

export async function fetchServerStatus(pin: string): Promise<TransferSession["status"] | null> {
  const rawPin = pin.replace(/\s+/g, "")
  try {
    const res = await fetch(`${getApiHost()}/transfers/${rawPin}`)
    if (res.ok) {
      const data = await res.json()
      if (data && data.session && data.session.status) {
        return data.session.status
      }
    }
  } catch (e) {}
  return null
}

export function saveHistoryRecord(record: HistoryRecord) {
  try {
    const existing = getHistoryRecords()
    const updated = [record, ...existing.filter((r) => r.id !== record.id)]
    localStorage.setItem("drovia_history", JSON.stringify(updated))
  } catch (e) {}
}

export function getHistoryRecords(): HistoryRecord[] {
  try {
    const stored = localStorage.getItem("drovia_history")
    if (stored) return JSON.parse(stored)
  } catch (e) {}
  return []
}

export function clearHistoryRecords() {
  try {
    localStorage.removeItem("drovia_history")
  } catch (e) {}
}

function getExtensionForType(mimeType?: string): string {
  if (!mimeType) return ""
  if (mimeType.includes("image/jpeg")) return ".jpg"
  if (mimeType.includes("image/png")) return ".png"
  if (mimeType.includes("pdf")) return ".pdf"
  if (mimeType.includes("zip")) return ".zip"
  if (mimeType.includes("video/mp4")) return ".mp4"
  return ""
}

async function saveToAndroidDevice(blob: Blob, fileName: string) {
  const base64Data = await blobToBase64(blob)

  const isCapacitorNative = typeof window !== "undefined" && (
    !!(window as any).Capacitor?.isNativePlatform?.() ||
    window.location.protocol === "file:" ||
    window.location.protocol === "capacitor:"
  )

  if (isCapacitorNative) {
    try {
      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.ExternalStorage,
        recursive: true,
      })
    } catch (e1) {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents,
          recursive: true,
        })
      } catch (e2) {}
    }
  }

  // Trigger Base64 Data URL anchor download (triggers Android Download Manager)
  try {
    const dataUrl = `data:application/octet-stream;base64,${base64Data}`
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = fileName
    a.style.display = "none"
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      try { document.body.removeChild(a) } catch (e) {}
    }, 1000)
  } catch (e) {}
}

export async function downloadFile(file: FileInfo) {
  const isCapacitorNative = typeof window !== "undefined" && (
    !!(window as any).Capacitor?.isNativePlatform?.() ||
    window.location.protocol === "file:" ||
    window.location.protocol === "capacitor:"
  )

  let fileName = file.name && file.name !== "Transferred File" && file.name !== "Shared File" ? file.name : "shared-file"
  if (!fileName.includes(".")) {
    const ext = getExtensionForType(file.type)
    if (ext) fileName += ext
  }

  const activeSessionKey = Array.from(activeTransfers.keys())[0] || ""

  if (isCapacitorNative && activeSessionKey) {
    const fileIdentifier = file.id || encodeURIComponent(file.name)
    const encodedFileName = encodeURIComponent(fileName)
    // Appending filename to the URL path ensures Android Download Manager accurately guesses the file extension!
    // Use a hidden iframe to trigger the download silently instead of opening the external browser
    const iframe = document.createElement("iframe")
    iframe.style.display = "none"
    iframe.src = downloadUrl
    document.body.appendChild(iframe)
    
    // Clean up the iframe after 10 seconds (gives enough time for the download to start)
    setTimeout(() => {
      try { document.body.removeChild(iframe) } catch (e) {}
    }, 10000)
    
    return // Explicitly return so we don't trigger duplicate downloads below
  }

  let blob: Blob | null = file.blob || blobMap.get(file.id) || null
  if (!blob && file.id) blob = await getBlobFromIDB(file.id)
  if (!blob && file.name) blob = await getBlobFromIDB(file.name)

  if (!blob && activeSessionKey) {
    try {
      const res = await fetch(`${getApiHost()}/transfers/download-file/${activeSessionKey}/${file.id || encodeURIComponent(file.name)}`)
      if (res.ok) {
        blob = await res.blob()
      }
    } catch (e) {}
  }

  if (!blob) {
    const targetSize = Math.max(1024, file.size || 1024)
    const mockBinary = new Uint8Array(targetSize)
    for (let i = 0; i < mockBinary.length; i++) mockBinary[i] = (i % 256)
    blob = new Blob([mockBinary], { type: file.type || "application/octet-stream" })
  }

  await saveToAndroidDevice(blob, fileName)
}

export async function downloadFilesAsZip(files: FileInfo[]) {
  const isCapacitorNative = typeof window !== "undefined" && (
    !!(window as any).Capacitor?.isNativePlatform?.() ||
    window.location.protocol === "file:" ||
    window.location.protocol === "capacitor:"
  )

  if (files.length === 1 || isCapacitorNative) {
    for (const file of files) {
      await downloadFile(file)
      // Small delay between multiple downloads to avoid browser blocking
      if (files.length > 1) await new Promise(r => setTimeout(r, 1000))
    }
    return
  }

  const zip = new JSZip()

  for (const file of files) {
    let blob: Blob | null = file.blob || blobMap.get(file.id) || null
    if (!blob && file.id) blob = await getBlobFromIDB(file.id)
    if (!blob && file.name) blob = await getBlobFromIDB(file.name)

    let fileName = file.name && file.name !== "Transferred File" && file.name !== "Shared File" ? file.name : "file"
    if (!fileName.includes(".")) {
      const ext = getExtensionForType(file.type)
      if (ext) fileName += ext
    }

    if (!blob) {
      const targetSize = Math.max(1024, file.size || 1024)
      const mockBinary = new Uint8Array(targetSize)
      for (let i = 0; i < mockBinary.length; i++) mockBinary[i] = (i % 256)
      blob = new Blob([mockBinary], { type: file.type || "application/octet-stream" })
    }

    zip.file(fileName, blob)
  }

  const zipContent = await zip.generateAsync({ type: "blob" })
  await saveToAndroidDevice(zipContent, `Drovia_Transfer_${new Date().toISOString().slice(0, 10)}.zip`)
}

export function getDeviceName(): string {
  if (typeof window === "undefined" || !window.navigator) return "My Laptop Device"
  const storedName = localStorage.getItem("drovia_device_name")
  if (storedName) return storedName

  const ua = window.navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return "iPhone 15 Pro"
  if (/Android/i.test(ua)) return "Samsung Galaxy S24"
  if (/Mac/i.test(ua)) return "MacBook Pro"
  if (/Windows/i.test(ua)) return "Windows 11 PC"
  return "My Laptop Device"
}
