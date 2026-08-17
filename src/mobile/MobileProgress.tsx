import { useState, useEffect } from "react"
import type { MobileScreen } from "./MobileApp"
import type { FileInfo } from "../services/transferStore"

interface Props {
  onNavigate: (s: MobileScreen) => void
  files?: FileInfo[]
  connectedDevice?: string
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export default function MobileProgress({ onNavigate, files = [], connectedDevice }: Props) {
  const fileList: FileInfo[] = files.length > 0 ? files : [
    { id: "mpf1", name: "Shared File", size: 14.8 * 1024 * 1024, type: "application/octet-stream" }
  ]

  const total = fileList.reduce((acc, f) => acc + (f.size || 0), 0) || 14.8 * 1024 * 1024
  const [transferred, setTransferred] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTransferred((prev) => {
        const step = total / 15
        const next = prev + step
        if (next >= total) {
          clearInterval(interval)
          setTimeout(() => onNavigate("success"), 600)
          return total
        }
        return next
      })
    }, 400)
    return () => clearInterval(interval)
  }, [total, onNavigate])

  const pct = Math.min(100, Math.round((transferred / total) * 100))

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", transition: "background 0.3s ease" }}>
      {/* Connected Device Card */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.22)", borderRadius: 14, padding: "8px 16px", marginTop: 4 }}>
        <span style={{ fontSize: "0.8rem", color: "#818cf8", fontWeight: 700 }}>📱 Direct Link:</span>
        <span style={{ fontSize: "0.8rem", color: "var(--text-color)", fontWeight: 700, fontFamily: "'Outfit', sans-serif" }}>{connectedDevice || "Connected Device"}</span>
      </div>

      {/* Title */}
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)", marginBottom: 24, margin: 0 }}>
        Transfer in progress ({fileList.length} {fileList.length === 1 ? "file" : "files"})
      </h1>

      {/* Progress ring */}
      <div style={{ position: "relative", width: 140, height: 140, marginBottom: 24 }}>
        <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
          <circle cx="70" cy="70" r="50" fill="none" stroke="var(--border-color)" strokeWidth="8" />
          <circle
            cx="70" cy="70" r="50" fill="none" stroke="url(#mGrad)" strokeWidth="8"
            strokeLinecap="round" strokeDasharray={2 * Math.PI * 50} strokeDashoffset={(2 * Math.PI * 50) - (pct / 100) * (2 * Math.PI * 50)}
            style={{ transition: "stroke-dashoffset 0.4s ease" }}
          />
          <defs>
            <linearGradient id="mGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
          </defs>
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "var(--text-color)", lineHeight: 1 }}>{pct}%</span>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: 4 }}>42.8 MB/s</span>
        </div>
      </div>

      {/* File List card */}
      <div
        className="glass"
        style={{
          width: "100%",
          borderRadius: 16,
          padding: "14px",
          marginBottom: 20,
          maxHeight: 180,
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 6, borderBottom: "1px solid var(--border-color)" }}>
          <span style={{ fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace", color: "var(--text-muted)" }}>
            Files ({fileList.length})
          </span>
          <span style={{ fontSize: "0.68rem", fontFamily: "'JetBrains Mono', monospace", color: "#6366f1", fontWeight: 600 }}>
            {formatBytes(transferred)} / {formatBytes(total)}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {fileList.map((file) => {
            const ext = file.name.includes(".") ? file.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE"
            return (
              <div key={file.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.15)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                  {ext}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.8rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {file.name}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: 1 }}>
                    {formatBytes(file.size)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
