import { useState, useEffect } from "react"
import type { MobileScreen } from "./MobileApp"
import type { ToastData } from "../components/Toast"
import { findTransfer, fetchServerStatus, updateTransferStatus, type FileInfo } from "../services/transferStore"

import { QRCodeSVG } from "qrcode.react"

function QRMini({ pin }: { pin: string }) {
  const raw = pin.replace(/\s+/g, "")
  return (
    <div style={{ width: 150, height: 150, background: "white", borderRadius: 14, padding: 10, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(99,102,241,0.2)" }}>
      <QRCodeSVG value={raw} size={130} level="M" marginSize={0} fgColor="#0d0e14" bgColor="#ffffff" />
    </div>
  )
}

interface Props {
  onNavigate: (s: MobileScreen) => void
  addToast: (msg: string, type: ToastData["type"]) => void
  files?: FileInfo[]
  pin?: string
}

export default function MobilePin({ onNavigate, addToast, files, pin: passedPin }: Props) {
  const activePin = passedPin || "482 913"
  const rawPin = activePin.replace(/\s+/g, "")
  const [showQr, setShowQr] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      const statusPayload = localStorage.getItem("drovia_status_update_" + rawPin)
      if (statusPayload) {
        try {
          const parsed = JSON.parse(statusPayload)
          if (parsed && parsed.rawPin === rawPin && (parsed.status === "transferring" || parsed.status === "complete")) {
            onNavigate("progress")
            return
          }
        } catch (e) {}
      }

      const session = findTransfer(rawPin)
      if (session && session.rawPin === rawPin && (session.status === "transferring" || session.status === "complete")) {
        onNavigate("progress")
        return
      }

      const serverStatus = await fetchServerStatus(rawPin)
      if (serverStatus === "connecting") {
        updateTransferStatus(rawPin, serverStatus)
        onNavigate("connecting")
      } else if (serverStatus === "transferring" || serverStatus === "complete") {
        updateTransferStatus(rawPin, serverStatus)
        onNavigate("progress")
      }
    }

    // 1. Polling interval 300ms
    const interval = setInterval(checkStatus, 300)

    // 2. Storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "drovia_status_update_" + rawPin) {
        checkStatus()
      }
    }
    window.addEventListener("storage", handleStorage)

    // 3. Custom event
    const handleCustom = (e: any) => {
      if (e.detail?.rawPin === rawPin) checkStatus()
    }
    window.addEventListener("drovia_status_update", handleCustom)

    // 4. BroadcastChannel
    let channel: BroadcastChannel | null = null
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("drovia_sync")
      channel.onmessage = (e) => {
        if (e.data?.rawPin === rawPin) checkStatus()
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("drovia_status_update", handleCustom)
      if (channel) channel.close()
    }
  }, [rawPin, onNavigate])

  const handleCopy = () => {
    navigator.clipboard.writeText(rawPin).catch(() => {})
    setCopied(true)
    addToast("PIN copied to clipboard", "success")
    setTimeout(() => setCopied(false), 2000)
  }

  const pinDigits = [rawPin.slice(0, 3), rawPin.slice(3)]

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", transition: "background 0.3s ease" }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
        <button
          onClick={() => onNavigate("send")}
          style={{ width: 36, height: 36, borderRadius: 10, background: "var(--glass-bg)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)" }}>Share this PIN</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        {/* Card */}
        <div
          className="glass-strong"
          style={{
            borderRadius: 20,
            padding: "28px 20px",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.825rem", color: "var(--text-muted)", marginBottom: 20 }}>
            {showQr ? "Scan with receiver camera" : "Enter this 6-digit PIN on receiver device"}
          </p>

          {!showQr ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "0.08em", color: "var(--text-color)", lineHeight: 1 }}>
                {pinDigits[0]}
              </span>
              <span style={{ color: "#6366f1", fontSize: "1.8rem", fontWeight: 700 }}>-</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "2.8rem", fontWeight: 800, letterSpacing: "0.08em", color: "var(--text-color)", lineHeight: 1 }}>
                {pinDigits[1]}
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <QRMini pin={rawPin} />
            </div>
          )}

          <button
            onClick={handleCopy}
            className="btn-ghost"
            style={{
              width: "100%", padding: "11px",
              borderRadius: 12,
              fontSize: "0.875rem", fontWeight: 600, fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            {copied ? "✓ Copied!" : "📋 Copy PIN"}
          </button>
        </div>

        {/* Toggle QR/PIN */}
        <button
          onClick={() => setShowQr(!showQr)}
          className="btn-ghost"
          style={{
            width: "100%", padding: "13px",
            borderRadius: 14,
            fontSize: "0.875rem", fontWeight: 500, fontFamily: "'Inter', sans-serif",
            cursor: "pointer",
          }}
        >
          {showQr ? "Show PIN instead" : "📱 Show QR Code"}
        </button>
      </div>
    </div>
  )
}
