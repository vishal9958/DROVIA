import { useState, useEffect } from "react"
import { IconPause, IconX, IconVideo, IconFile, IconImage, IconZip, IconPdf } from "../components/Icons"
import type { FileInfo } from "../services/transferStore"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface ProgressProps {
  onNavigate: (screen: Screen) => void
  files?: FileInfo[]
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) return <IconImage size={18} />
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext || "")) return <IconVideo size={18} />
  if (["zip", "rar", "tar", "gz", "7z"].includes(ext || "")) return <IconZip size={18} />
  if (ext === "pdf") return <IconPdf size={18} />
  return <IconFile size={18} />
}

export default function Progress({ onNavigate, files = [] }: ProgressProps) {
  const fileList: FileInfo[] = files.length > 0 ? files : [
    { id: "pf1", name: "Shared File", size: 1024 * 1024, type: "application/octet-stream" }
  ]
  const total = fileList.reduce((acc, f) => acc + f.size, 0) || 1024 * 1024
  const [transferred, setTransferred] = useState(0)
  const [paused, setPaused] = useState(false)
  const [speed] = useState(14.2 * 1024 * 1024)

  useEffect(() => {
    if (paused) return
    const interval = setInterval(() => {
      setTransferred((prev) => {
        const step = total / 16
        const next = prev + step
        if (next >= total) {
          clearInterval(interval)
          setTimeout(() => onNavigate("complete"), 600)
          return total
        }
        return next
      })
    }, 450)
    return () => clearInterval(interval)
  }, [paused, onNavigate, total])

  const pct = Math.min(100, Math.round((transferred / total) * 100))
  const remaining = Math.max(0, Math.round((total - transferred) / speed))

  const circumference = 2 * Math.PI * 56
  const offset = circumference - (pct / 100) * circumference

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
      <div style={{ width: "100%", maxWidth: 500, padding: "48px 24px", textAlign: "center" }} className="animate-fade-up">
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
              padding: "4px 12px",
              fontSize: "0.72rem",
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 16,
              letterSpacing: "0.05em",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%", background: paused ? "#f59e0b" : "#6366f1",
                animation: paused ? "none" : "connection-pulse 1s ease-in-out infinite",
                display: "inline-block",
              }}
            />
            {paused ? "PAUSED" : "TRANSFERRING"}
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.6rem", color: "var(--text-color)", marginBottom: 6 }}>
            {paused ? "Transfer paused" : `Transferring ${fileList.length} ${fileList.length === 1 ? "file" : "files"}`}
          </h1>
        </div>

        {/* Circular progress */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
          <div style={{ position: "relative", width: 160, height: 160 }}>
            <svg width="160" height="160" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="80" cy="80" r="56" fill="none" stroke="var(--border-color)" strokeWidth="10" />
              <circle
                cx="80" cy="80" r="56" fill="none" stroke="url(#gradient)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 0.5s ease" }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-color)", lineHeight: 1 }}>{pct}%</span>
              <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 4 }}>
                {remaining > 0 ? `${remaining}s left` : "Done"}
              </span>
            </div>
          </div>
        </div>

        {/* File Progress Card List */}
        <div className="glass rounded-xl p-4 mb-6 text-left" style={{ maxHeight: 200, overflowY: "auto" }}>
          <div className="flex justify-between items-center pb-2 mb-2" style={{ borderBottom: "1px solid var(--border-color)" }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)" }}>
              Files Stream: {fileList.length} items
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "#6366f1", fontWeight: 600 }}>
              {formatBytes(transferred)} / {formatBytes(total)}
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {fileList.map((file) => (
              <div key={file.id} className="flex items-center gap-3 py-1">
                <div style={{ color: "#6366f1", flexShrink: 0 }}>
                  {getFileIcon(file.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.82rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {formatBytes(file.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setPaused(!paused)}
            className="btn-ghost px-5 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
          >
            <IconPause size={16} />
            {paused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={() => onNavigate("landing")}
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: "0.875rem",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <IconX size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
