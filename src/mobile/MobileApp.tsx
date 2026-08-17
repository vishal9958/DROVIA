import { useState, useEffect, useRef } from "react"
import { App as CapApp } from "@capacitor/app"
import MobileHome from "./MobileHome"
import MobileSend from "./MobileSend"
import MobilePin from "./MobilePin"
import MobileReceive from "./MobileReceive"
import MobileConnecting from "./MobileConnecting"
import MobileQrScanner from "./MobileQrScanner"
import MobileIncoming from "./MobileIncoming"
import MobileProgress from "./MobileProgress"
import MobileSuccess from "./MobileSuccess"
import MobileTransfers from "./MobileTransfers"
import MobileSettings from "./MobileSettings"
import MobileNotificationBanner, { type MobileNotification } from "./MobileNotificationBanner"
import type { ToastData } from "../components/Toast"
import { registerTransfer, fetchSessionFromServer, updateTransferStatus, type FileInfo, type TransferSession } from "../services/transferStore"

export type MobileScreen =
  | "home"
  | "send"
  | "send-files"
  | "pin"
  | "receive"
  | "connecting"
  | "qr-scanner"
  | "incoming"
  | "progress"
  | "success"
  | "transfers"
  | "settings"

interface MobileAppProps {
  addToast: (msg: string, type: ToastData["type"]) => void
}

const NAV = [
  {
    id: "home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill={active ? "#818cf8" : "none"} stroke={active ? "#818cf8" : "var(--text-muted)"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "transfers",
    label: "Transfers",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "var(--text-muted)"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="12 8 12 12 14 14" />
        <path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "#818cf8" : "var(--text-muted)"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
]

const navScreens = ["home", "transfers", "settings"]

export default function MobileApp({ addToast }: MobileAppProps) {
  const [screen, setScreen] = useState<MobileScreen>("home")
  const screenRef = useRef<MobileScreen>("home")
  const [files, setFiles] = useState<FileInfo[]>([])
  const [pin, setPin] = useState("482 913")
  const [enteredPin, setEnteredPin] = useState("")
  const [activeSession, setActiveSession] = useState<TransferSession | null>(null)
  const [userRole, setUserRole] = useState<"sender" | "receiver">("sender")
  const [activeNotification, setActiveNotification] = useState<MobileNotification | null>(null)

  const activeNav = navScreens.includes(screen) ? screen : "home"

  const navigate = (s: MobileScreen) => {
    screenRef.current = s
    setScreen(s)
  }

  const showNav = !["qr-scanner"].includes(screen)

  // Hardware Back Button Handler
  useEffect(() => {
    let sub: any = null
    const bindBack = async () => {
      try {
        sub = await CapApp.addListener("backButton", () => {
          if (screenRef.current !== "home") {
            navigate("home")
          } else {
            CapApp.exitApp()
          }
        })
      } catch (err) {}
    }
    bindBack()
    return () => {
      if (sub?.remove) sub.remove()
    }
  }, [])

  const triggerLiveNotification = (title: string, body: string, type: MobileNotification["type"] = "incoming") => {
    setActiveNotification({
      id: Math.random().toString(36).slice(2),
      title,
      body,
      type,
    })
  }

  const handleFilesSelected = (f: FileInfo[]) => {
    setUserRole("sender")
    setFiles(f)
    const session = registerTransfer(f)
    setPin(session.pin)
    setActiveSession(session)
    triggerLiveNotification("Transfer PIN Generated", `Share PIN ${session.pin} to connect`, "incoming")
  }

  const handlePin = async (p: string) => {
    setUserRole("receiver")
    setEnteredPin(p)
    triggerLiveNotification("Connecting Device...", "Retrieving transfer session metadata", "progress")
    const session = await fetchSessionFromServer(p)
    if (session && session.files && session.files.length > 0) {
      updateTransferStatus(p, "connecting")
      setActiveSession(session)
      setFiles(session.files)
    }
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "var(--bg-color)",
        transition: "background 0.3s ease",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Live Notification Banner */}
      <MobileNotificationBanner
        notification={activeNotification}
        onDismiss={() => setActiveNotification(null)}
      />

      {/* Screen content */}
      <div style={{ flex: 1, overflow: "hidden auto", position: "relative" }}>
        {screen === "home" && <MobileHome onNavigate={navigate} />}
        {screen === "send" && <MobileSend onNavigate={navigate} onFilesSelected={handleFilesSelected} />}
        {screen === "send-files" && <MobileSend onNavigate={navigate} onFilesSelected={handleFilesSelected} />}
        {screen === "pin" && <MobilePin onNavigate={navigate} addToast={addToast} files={files} pin={pin} />}
        {screen === "receive" && <MobileReceive onNavigate={navigate} onPin={handlePin} />}
        {screen === "connecting" && <MobileConnecting onNavigate={navigate} pin={enteredPin || pin} />}
        {screen === "qr-scanner" && <MobileQrScanner onNavigate={navigate} onPin={handlePin} />}
        {screen === "incoming" && <MobileIncoming onNavigate={navigate} files={files.length ? files : (activeSession?.files || [])} senderDevice={activeSession?.senderDevice} pin={enteredPin || pin} role={userRole} />}
        {screen === "progress" && <MobileProgress onNavigate={navigate} files={files.length ? files : (activeSession?.files || [])} />}
        {screen === "success" && <MobileSuccess onNavigate={navigate} addToast={addToast} files={files.length ? files : (activeSession?.files || [])} role={userRole} />}
        {screen === "transfers" && <MobileTransfers />}
        {screen === "settings" && <MobileSettings />}
      </div>

      {/* Bottom navigation bar */}
      {showNav && (
        <div
          style={{
            background: "var(--header-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderTop: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            padding: "8px 16px 14px",
            flexShrink: 0,
          }}
        >
          {NAV.map((item) => {
            const isActive = activeNav === item.id
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id as MobileScreen)}
                style={{
                  flex: 1,
                  maxWidth: 110,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 3,
                  padding: "6px 12px",
                  borderRadius: 14,
                  background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(255,255,255,0.7)" : "1px solid transparent",
                  boxShadow: isActive ? "0 0 12px rgba(99,102,241,0.25)" : "none",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {item.icon(isActive)}
                <span
                  style={{
                    fontSize: "0.68rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "#818cf8" : "var(--text-muted)",
                    transition: "color 0.15s",
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
