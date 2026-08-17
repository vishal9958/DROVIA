import { useState, useRef, useCallback } from "react"
import { IconUpload, IconFile, IconImage, IconVideo, IconZip, IconX, IconPdf } from "../components/Icons"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface SendFileProps {
  onNavigate: (screen: Screen) => void
  onFilesSelected: (files: FileInfo[]) => void
}

export interface FileInfo {
  name: string
  size: number
  type: string
  id: string
  blob?: Blob
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext || "")) return <IconImage size={20} />
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext || "")) return <IconVideo size={20} />
  if (["zip", "rar", "tar", "gz", "7z"].includes(ext || "")) return <IconZip size={20} />
  if (ext === "pdf") return <IconPdf size={20} />
  return <IconFile size={20} />
}

export default function SendFile({ onNavigate, onFilesSelected }: SendFileProps) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((newFiles: File[]) => {
    const infos: FileInfo[] = newFiles.map((f) => ({
      name: f.name,
      size: f.size,
      type: f.type || "application/octet-stream",
      id: Math.random().toString(36).slice(2),
      blob: f,
    }))
    setFiles((prev) => [...prev, ...infos])
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = Array.from(e.dataTransfer.files)
      if (dropped.length) addFiles(dropped)
    },
    [addFiles]
  )

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(Array.from(e.target.files))
  }

  const removeFile = (id: string) => setFiles((prev) => prev.filter((f) => f.id !== id))

  const handleCreateTransfer = () => {
    if (!files.length) return
    onFilesSelected(files)
    onNavigate("transfer-ready")
  }

  const totalSize = files.reduce((a, f) => a + f.size, 0)

  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 56,
        background: "var(--bg-color)",
        transition: "background 0.3s ease",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 680, padding: "48px 24px" }}>
        <div className="animate-fade-up">
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: "1.75rem",
              color: "var(--text-color)",
              marginBottom: 6,
            }}
          >
            Send a file
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", marginBottom: 32 }}>
            Select or drop files to transfer directly to any device.
          </p>

          {/* Dropzone */}
          <div
            className={`glass rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging ? "dropzone-active" : ""}`}
            style={{
              minHeight: 240,
              border: "2px dashed var(--border-color)",
              padding: 40,
              marginBottom: 24,
              transition: "all 0.2s",
            }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input ref={inputRef} type="file" multiple className="hidden" onChange={handleInput} />
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 18,
                background: isDragging ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.1)",
                border: "1px solid rgba(99,102,241,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 20,
                color: isDragging ? "#818cf8" : "#6366f1",
                transition: "all 0.2s",
              }}
            >
              <IconUpload size={26} />
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "var(--text-color)", marginBottom: 6 }}>
              {isDragging ? "Drop your files here" : "Drag & drop files here"}
            </p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", marginBottom: 16 }}>
              or click to browse from your computer
            </p>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
              className="btn-ghost"
              style={{
                padding: "8px 20px",
                borderRadius: 10,
                fontSize: "0.85rem",
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Choose Files
            </button>
          </div>

          {/* Selected Files List */}
          {files.length > 0 ? (
            <div className="glass rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: "1px solid var(--border-color)" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-color)" }}>
                  Selected Files ({files.length})
                </span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "#6366f1", fontWeight: 600 }}>
                  Total: {formatBytes(totalSize)}
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 rounded-xl"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)" }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 9,
                          background: "rgba(99,102,241,0.12)",
                          color: "#818cf8",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {getFileIcon(file.name)}
                      </div>
                      <div className="min-w-0">
                        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: "0.875rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {file.name}
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                          {formatBytes(file.size)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(file.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: 6,
                        display: "flex",
                      }}
                    >
                      <IconX size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Action button */}
          <button
            onClick={handleCreateTransfer}
            disabled={!files.length}
            className="btn-primary w-full py-4 rounded-xl text-base font-semibold"
            style={{
              opacity: files.length ? 1 : 0.5,
              cursor: files.length ? "pointer" : "not-allowed",
            }}
          >
            {files.length > 1 ? `Send ${files.length} Files` : "Send File"}
          </button>
        </div>
      </div>
    </div>
  )
}
