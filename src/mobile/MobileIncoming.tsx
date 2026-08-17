import { useEffect } from "react"
import type { MobileScreen } from "./MobileApp"
import { updateTransferStatus, fetchServerStatus, type FileInfo } from "../services/transferStore"
import { notificationService } from "../services/notificationService"

interface Props {
  onNavigate: (s: MobileScreen) => void
  files?: FileInfo[]
  senderDevice?: string
  pin?: string
  role?: "sender" | "receiver"
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export default function MobileIncoming({ onNavigate, files = [], senderDevice, pin, role }: Props) {
  const fileList: FileInfo[] = files.length > 0 ? files : [
    { id: "m_inc1", name: "Transferred File", size: 1024, type: "application/octet-stream" }
  ]
  const deviceName = senderDevice || "Connected Device"
  const totalSize = fileList.reduce((acc, f) => acc + (f.size || 0), 0)

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
    notificationService.notifyTransferStarted(fileList[0].name)
    onNavigate("progress")
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", padding: "20px", transition: "background 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => onNavigate("receive")}
          style={{ width: 36, height: 36, borderRadius: 10, background: "var(--glass-bg)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)", margin: 0 }}>
            {fileList.length > 1 ? `Incoming ${fileList.length} files` : "Incoming transfer"}
          </h1>
          <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
            Total: {formatBytes(totalSize)}
          </span>
        </div>
      </div>

      {/* Sender */}
      <div
        className="glass"
        style={{
          borderRadius: 16,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 40, height: 40, borderRadius: 11,
            background: "rgba(99,102,241,0.12)",
            border: "1px solid rgba(99,102,241,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            color: "#6366f1",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </div>
        <div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)" }}>From device</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.925rem", color: "var(--text-color)", marginTop: 1 }}>{deviceName}</div>
        </div>
      </div>

      {/* File info card list */}
      <div
        style={{
          background: "rgba(99,102,241,0.06)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 18,
          padding: "16px",
          marginBottom: 20,
          maxHeight: 220,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fileList.map((file) => {
            const ext = file.name.includes(".") ? file.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE"
            return (
              <div key={file.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: "rgba(99,102,241,0.15)",
                    color: "#6366f1",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: "0.65rem",
                    flexShrink: 0,
                  }}
                >
                  {ext}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
        className="glass"
        style={{
          borderRadius: 14,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}>
          🛡️ Direct Device Stream · End-to-End Encrypted
        </span>
      </div>

      {/* Buttons */}
      {role === "sender" ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 18, height: 18, border: "2px solid rgba(99,102,241,0.3)", borderTopColor: "#6366f1", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            </div>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "var(--text-color)", fontWeight: 500 }}>
            Waiting for Receiver to accept...
          </p>
          <button
            onClick={() => onNavigate("home")}
            style={{
              width: "100%", padding: "14px", marginTop: 12,
              background: "transparent", border: "none",
              color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: 500, fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
            }}
          >
            Cancel Transfer
          </button>
        </div>
      ) : (
        <>
          <button
            onClick={handleAccept}
            className="btn-primary"
            style={{
              width: "100%", padding: "15px", marginBottom: 10,
              borderRadius: 14,
              fontSize: "1rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
            }}
          >
            Accept Transfer ({fileList.length} {fileList.length === 1 ? "File" : "Files"})
          </button>
          <button
            onClick={() => onNavigate("receive")}
            style={{
              width: "100%", padding: "15px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: 14,
              color: "#ef4444", fontSize: "1rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
            }}
          >
            Decline
          </button>
        </>
      )}
    </div>
  )
}
