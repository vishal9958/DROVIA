import { useState, useCallback, useEffect } from "react"
import { ToastContainer, type ToastData } from "./components/Toast"
import Header from "./components/Header"
import ErrorState from "./screens/ErrorStates"
import Landing from "./screens/Landing"
import SendFile, { type FileInfo } from "./screens/SendFile"
import TransferReady from "./screens/TransferReady"
import Receive from "./screens/Receive"
import Connecting from "./screens/Connecting"
import IncomingFile from "./screens/IncomingFile"
import Progress from "./screens/Progress"
import Complete from "./screens/Complete"
import History from "./screens/History"
import Settings, { applyTheme } from "./screens/Settings"
import MobileApp from "./mobile/MobileApp"
import { registerTransfer, fetchSessionFromServer, updateTransferStatus, type TransferSession } from "./services/transferStore"

type Screen =
  | "landing"
  | "send"
  | "transfer-ready"
  | "receive"
  | "connecting"
  | "incoming"
  | "progress"
  | "complete"
  | "history"
  | "settings"
  | "error-failed"
  | "error-expired"
  | "error-invalid"
  | "error-offline"

export default function App() {
  const [screen, setScreen] = useState<Screen>("landing")
  const [files, setFiles] = useState<FileInfo[]>([])
  const [pin, setPin] = useState("482 913")
  const [enteredPin, setEnteredPin] = useState("")
  const [activeSession, setActiveSession] = useState<TransferSession | null>(null)
  const [userRole, setUserRole] = useState<"sender" | "receiver">("sender")
  const [toasts, setToasts] = useState<ToastData[]>([])

  // Dynamic mobile screen detection for native mobile APK / mobile widths
  const [isMobileScreen, setIsMobileScreen] = useState(() => {
    if (typeof window === "undefined") return false
    const isCapacitorNative = !!(window as any).Capacitor?.isNativePlatform?.() || window.location.protocol === "file:" || window.location.protocol === "capacitor:"
    const isSmallScreen = window.innerWidth <= 768
    return isCapacitorNative || isSmallScreen
  })

  useEffect(() => {
    const storedTheme = (localStorage.getItem("drovia_theme") as "dark" | "light" | "system") || "dark"
    applyTheme(storedTheme)

    const handleResize = () => {
      const isCapacitorNative = !!(window as any).Capacitor?.isNativePlatform?.() || window.location.protocol === "file:" || window.location.protocol === "capacitor:"
      const isSmallScreen = window.innerWidth <= 768
      setIsMobileScreen(isCapacitorNative || isSmallScreen)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const addToast = useCallback((message: string, type: ToastData["type"] = "info") => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleFilesSelected = (f: FileInfo[]) => {
    setUserRole("sender")
    setFiles(f)
    const session = registerTransfer(f)
    setPin(session.pin)
    setActiveSession(session)
  }

  const handlePin = async (p: string) => {
    setUserRole("receiver")
    setEnteredPin(p)
    const session = await fetchSessionFromServer(p)
    if (session) {
      updateTransferStatus(p, "connecting")
      setActiveSession(session)
      setFiles(session.files)
    }
  }

  const navigate = (s: Screen) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    setScreen(s)
  }

  // If running inside Android Native APK or Mobile width (<=768px), render Mobile App
  if (isMobileScreen) {
    return (
      <div style={{ width: "100vw", height: "100vh", background: "var(--bg-color)", overflow: "hidden", position: "relative" }}>
        <MobileApp addToast={addToast} />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    )
  }

  // Desktop Web App
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-color)", transition: "background 0.3s ease", position: "relative" }}>
      {/* Clean Global Web Navigation Bar */}
      <Header activeScreen={screen} onNavigate={navigate} />

      {/* Web Application Screens */}
      <div>
        {screen === "landing" && <Landing onNavigate={navigate} />}
        {screen === "send" && <SendFile onNavigate={navigate} onFilesSelected={handleFilesSelected} />}
        {screen === "transfer-ready" && <TransferReady onNavigate={navigate} files={files} pin={pin} />}
        {screen === "receive" && <Receive onNavigate={navigate} onPin={handlePin} />}
        {screen === "connecting" && <Connecting onNavigate={navigate} pin={enteredPin} />}
        {screen === "incoming" && <IncomingFile onNavigate={navigate} files={files.length ? files : (activeSession?.files || [])} senderDevice={activeSession?.senderDevice} pin={enteredPin || pin} role={userRole} />}
        {screen === "progress" && <Progress onNavigate={navigate} files={files.length ? files : (activeSession?.files || [])} />}
        {screen === "complete" && <Complete onNavigate={navigate} files={files.length ? files : (activeSession?.files || [])} role={userRole} />}
        {screen === "history" && <History onNavigate={navigate} />}
        {screen === "settings" && <Settings />}
        {screen === "error-failed" && <ErrorState variant="failed" onNavigate={navigate} />}
        {screen === "error-expired" && <ErrorState variant="expired" onNavigate={navigate} />}
        {screen === "error-invalid" && <ErrorState variant="invalid-pin" onNavigate={navigate} />}
        {screen === "error-offline" && <ErrorState variant="offline" onNavigate={navigate} />}
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
