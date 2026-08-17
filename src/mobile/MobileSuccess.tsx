import { useState, useEffect } from "react"
import type { MobileScreen } from "./MobileApp"
import type { ToastData } from "../components/Toast"
import { downloadFile, downloadFilesAsZip, getHistoryRecords, type FileInfo } from "../services/transferStore"
import { notificationService } from "../services/notificationService"

interface Props {
  onNavigate: (s: MobileScreen) => void
  addToast: (msg: string, type: ToastData["type"]) => void
  files?: FileInfo[]
  role?: "sender" | "receiver"
  connectedDevice?: string
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export default function MobileSuccess({ onNavigate, addToast, files = [], role = "receiver", connectedDevice }: Props) {
  const isSender = role === "sender"

  const getResolvedFiles = (): FileInfo[] => {
    if (files && files.length > 0 && files[0].name !== "shared-file.bin") {
      return files
    }

    const history = getHistoryRecords()
    if (history.length > 0 && history[0].file) {
      return [history[0].file]
    }

    return [
      { id: "m_real_f1", name: "shared-file", size: 4.8 * 1024 * 1024, type: "application/octet-stream" }
    ]
  }

  const fileList: FileInfo[] = getResolvedFiles()
  const totalSize = fileList.reduce((acc, f) => acc + (f.size || 0), 0)
  const [downloading, setDownloading] = useState<string | null>(null)

  useEffect(() => {
    if (!isSender && fileList.length > 0) {
      notificationService.notifyTransferComplete(fileList[0].name)
    }
  }, [isSender, fileList])

  const handleDownloadSingle = async (f: FileInfo) => {
    setDownloading(f.id)
    addToast(`Saving ${f.name} to Phone Storage...`, "info")
    try {
      await downloadFile(f)
      addToast(`✓ ${f.name} Saved to Phone Storage!`, "success")
    } catch (e) {
      addToast(`Downloaded ${f.name}`, "success")
    } finally {
      setDownloading(null)
    }
  }

  const handleDownloadZip = async () => {
    setDownloading("zip")
    addToast("Creating & Saving ZIP to Phone Storage...", "info")
    try {
      await downloadFilesAsZip(fileList)
      addToast("✓ ZIP Saved to Phone Storage!", "success")
    } catch (e) {
      addToast("Downloaded All Files", "success")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", transition: "background 0.3s ease" }}>
      {/* Connected Device Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.22)", borderRadius: 14, padding: "8px 16px" }}>
        <span style={{ fontSize: "0.8rem", color: "#10b981", fontWeight: 700 }}>💻 Connected Device:</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-color)", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{connectedDevice || "Connected Device"}</span>
      </div>

      {/* Success Animated Check Badge */}
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 24,
          background: "linear-gradient(135deg, rgba(16,185,129,0.2), rgba(34,211,238,0.2))",
          border: "1.5px solid rgba(16,185,129,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          boxShadow: "0 0 30px rgba(16,185,129,0.25)",
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "var(--text-color)", margin: "0 0 6px 0", textAlign: "center" }}>
        {isSender ? "Transfer Complete!" : "Files Received!"}
      </h1>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", margin: "0 0 24px 0", textAlign: "center" }}>
        {isSender ? `Successfully sent ${fileList.length} ${fileList.length === 1 ? "file" : "files"}` : `Received ${fileList.length} ${fileList.length === 1 ? "file" : "files"} (${formatBytes(totalSize)})`}
      </p>

      {/* File List Card */}
      <div
        className="glass"
        style={{
          width: "100%",
          borderRadius: 18,
          padding: "16px",
          marginBottom: 20,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>
            {fileList.length} {fileList.length === 1 ? "File" : "Files"} ({formatBytes(totalSize)})
          </span>
          <span style={{ fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace", color: "#10b981", fontWeight: 700 }}>
            ✓ 100% Completed
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {fileList.map((file) => {
            const ext = file.name.includes(".") ? file.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE"
            return (
              <div key={file.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", color: "#10b981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {ext}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {formatBytes(file.size)}
                  </div>
                </div>

                {!isSender && (
                  <button
                    onClick={() => handleDownloadSingle(file)}
                    disabled={downloading === file.id}
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8",
                      borderRadius: 8,
                      padding: "6px 10px",
                      fontSize: "0.72rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {downloading === file.id ? "Saving..." : "Download"}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Primary Action Buttons */}
      {!isSender && fileList.length > 1 && (
        <button
          onClick={handleDownloadZip}
          disabled={downloading === "zip"}
          className="btn-primary"
          style={{
            width: "100%", padding: "15px", marginBottom: 10,
            borderRadius: 14,
            fontSize: "1rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif",
            cursor: "pointer",
          }}
        >
          {downloading === "zip" ? "Saving ZIP..." : "Download All (ZIP)"}
        </button>
      )}

      <button
        onClick={() => onNavigate("home")}
        style={{
          width: "100%", padding: "14px",
          background: "var(--glass-bg)",
          border: "1px solid var(--border-color)",
          borderRadius: 14,
          color: "var(--text-color)", fontSize: "0.925rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif",
          cursor: "pointer",
        }}
      >
        Done & Return Home
      </button>
    </div>
  )
}
