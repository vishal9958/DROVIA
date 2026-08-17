import { useState, useRef } from "react"
import type { MobileScreen } from "./MobileApp"
import { registerTransfer, type FileInfo } from "../services/transferStore"

interface Props {
  onNavigate: (s: MobileScreen) => void
  onFilesSelected?: (files: FileInfo[]) => void
}

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

export default function MobileSend({ onNavigate, onFilesSelected }: Props) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const newFiles = Array.from(e.target.files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      blob: f,
    }))
    setFiles((prev) => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const handleCreateTransfer = () => {
    if (!files.length) return
    registerTransfer(files)
    if (onFilesSelected) onFilesSelected(files)
    onNavigate("pin")
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", display: "flex", flexDirection: "column", transition: "background 0.3s ease" }}>
      <input ref={fileInputRef} type="file" multiple onChange={handleFileChange} style={{ display: "none" }} />

      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <button
          onClick={() => onNavigate("home")}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-color)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)" }}>Select files</h1>
      </div>

      <div style={{ flex: 1, padding: "0 20px", display: "flex", flexDirection: "column" }}>
        {/* Dropzone / Upload action */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="glass"
          style={{
            borderRadius: 20,
            padding: "32px 20px",
            textAlign: "center",
            marginBottom: 20,
            cursor: "pointer",
            border: "2px dashed var(--border-color)",
          }}
        >
          <div
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 16 12 12 8 16" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
            </svg>
          </div>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1rem", color: "var(--text-color)", marginBottom: 16 }}>
            Tap to select files from device
          </p>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}
            className="btn-ghost"
            style={{
              borderRadius: 12,
              padding: "12px 24px",
              fontSize: "0.9rem",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Choose Files
          </button>
        </div>

        {/* Selected File List */}
        {files.length > 0 && (
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Selected files ({files.length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
              {files.map((f) => (
                <div key={f.id} className="glass" style={{ borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", fontSize: "0.6rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", flexShrink: 0 }}>
                    {f.name.includes(".") ? f.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>{formatBytes(f.size)}</div>
                  </div>
                  <button onClick={() => removeFile(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Create Transfer Button */}
      {files.length > 0 && (
        <div style={{ padding: "12px 20px 16px", background: "var(--header-bg)", backdropFilter: "blur(12px)", borderTop: "1px solid var(--border-color)" }}>
          <button
            onClick={handleCreateTransfer}
            className="btn-primary"
            style={{
              width: "100%",
              borderRadius: 14,
              padding: "15px",
              fontSize: "1rem",
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {files.length > 1 ? `Send ${files.length} Files` : "Send File"}
          </button>
        </div>
      )}
    </div>
  )
}
