import { useEffect } from "react"
import type { FileInfo } from "../services/transferStore"
import { updateTransferStatus, fetchServerStatus } from "../services/transferStore"
import { notificationService } from "../services/notificationService"
import { IconShield } from "../components/Icons"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface IncomingFileProps {
  onNavigate: (screen: Screen) => void
  files: FileInfo[]
  senderDevice?: string
  pin?: string
  role?: "sender" | "receiver"
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export default function IncomingFile({ onNavigate, files = [], senderDevice, pin, role }: IncomingFileProps) {
  const fileList: FileInfo[] = files.length > 0 ? files : [
    { name: "Transferred File", size: 0, type: "application/octet-stream", id: "inc_1" }
  ]
  const deviceName = senderDevice || "Connected Device"
  const totalSize = fileList.reduce((acc, f) => acc + f.size, 0)

  useEffect(() => {
    notificationService.requestPermission()
    notificationService.notifyIncomingFile(fileList[0].name, deviceName)
  }, [fileList, deviceName])

  useEffect(() => {
    if (role !== "sender" || !pin) return

    let interval: NodeJS.Timeout
    const checkStatus = async () => {
      const raw = pin.replace(/\s+/g, "")
      const serverStatus = await fetchServerStatus(raw)
      if (serverStatus === "transferring" || serverStatus === "complete") {
        onNavigate("progress")
      }
    }
    
    interval = setInterval(checkStatus, 500)
    return () => clearInterval(interval)
  }, [role, pin, onNavigate])

  const handleAccept = () => {
    updateTransferStatus(pin || "482913", "transferring")
    onNavigate("progress")
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 56,
        background: "var(--bg-color)",
        transition: "background 0.3s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 520, padding: "48px 24px" }} className="animate-fade-up">
        <div className="text-center mb-8">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.25)",
              color: "#6366f1",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6366f1", display: "inline-block", animation: "connection-pulse 1.5s infinite" }} />
            Incoming transfer request
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "var(--text-color)", marginBottom: 6 }}>
            {fileList.length > 1 ? `Incoming ${fileList.length} files` : "Incoming file"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
            {deviceName} wants to send you {fileList.length} {fileList.length === 1 ? "file" : "files"} ({formatBytes(totalSize)})
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          {/* Sender info */}
          <div
            className="glass rounded-xl p-3.5 flex items-center gap-3 mb-5"
            style={{ fontSize: "0.85rem" }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "rgba(99,102,241,0.12)",
                color: "#6366f1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem", fontFamily: "'Inter', sans-serif" }}>From</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: "var(--text-color)", fontSize: "0.9rem" }}>
                {deviceName}
              </div>
            </div>
          </div>

          {/* Files List Card */}
          <div
            className="rounded-xl p-4 mb-5 text-left"
            style={{
              background: "rgba(99,102,241,0.06)",
              border: "1px solid rgba(99,102,241,0.2)",
              maxHeight: 220,
              overflowY: "auto",
            }}
          >
            <div className="flex flex-col gap-2.5">
              {fileList.map((file) => {
                const ext = file.name.split(".").pop()?.toUpperCase() || "FILE"
                return (
                  <div key={file.id} className="flex items-center gap-3">
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 10,
                        background: "rgba(99,102,241,0.15)",
                        color: "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 700,
                        fontSize: "0.68rem",
                      }}
                    >
                      {ext}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 1 }}>
                        {formatBytes(file.size)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Security badge */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg mb-5"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)" }}
          >
            <IconShield size={16} />
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
              Direct Device Stream · End-to-End Encrypted
            </span>
          </div>

          {/* Actions */}
          {role === "sender" ? (
            <div className="flex flex-col gap-4 text-center mt-6">
              <div className="flex justify-center">
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 20, height: 20, border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                </div>
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "var(--text-color)", fontWeight: 500 }}>
                Waiting for Receiver to accept...
              </p>
              <button
                onClick={() => onNavigate("transfer-ready")}
                className="btn-ghost w-full py-3 rounded-xl text-sm font-medium"
                style={{ color: "var(--text-muted)", marginTop: 8 }}
              >
                Cancel Transfer
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleAccept}
                className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold"
              >
                Accept Transfer ({fileList.length} {fileList.length === 1 ? "File" : "Files"})
              </button>
              <button
                onClick={() => onNavigate("receive")}
                className="btn-ghost w-full py-3.5 rounded-xl text-base font-semibold"
                style={{ color: "#ef4444" }}
              >
                Decline
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
