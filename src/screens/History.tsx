import { useState, useEffect } from "react"
import { IconSearch, IconFile, IconImage, IconVideo, IconZip, IconPdf, IconDownload } from "../components/Icons"
import { getHistoryRecords, clearHistoryRecords, downloadFile, type HistoryRecord } from "../services/transferStore"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface HistoryProps {
  onNavigate: (screen: Screen) => void
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

function getFileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase()
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext || "")) return <IconImage size={18} />
  if (["mp4", "mov", "avi", "mkv"].includes(ext || "")) return <IconVideo size={18} />
  if (["zip", "rar", "tar", "gz"].includes(ext || "")) return <IconZip size={18} />
  if (ext === "pdf") return <IconPdf size={18} />
  return <IconFile size={18} />
}

const statusConfig = {
  completed: { label: "Completed", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "rgba(107,114,128,0.1)", border: "rgba(107,114,128,0.2)" },
  failed: { label: "Failed", color: "#ef4444", bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.2)" },
  expired: { label: "Expired", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
}

export default function History({ onNavigate }: HistoryProps) {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [tab, setTab] = useState<"sent" | "received">("sent")
  const [search, setSearch] = useState("")

  useEffect(() => {
    setRecords(getHistoryRecords())
  }, [])

  const handleClearHistory = () => {
    clearHistoryRecords()
    setRecords([])
  }

  const filtered = records.filter((t) => {
    const matchTab = t.direction === tab
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.device.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div style={{ minHeight: "100vh", paddingTop: 56, background: "var(--bg-color)", transition: "background 0.3s ease" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px" }} className="animate-fade-up">
        <div className="flex items-center justify-between mb-2">
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "#f1f2f7" }}>Transfers</h1>
          {records.length > 0 && (
            <button
              onClick={handleClearHistory}
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#ef4444",
                fontSize: "0.78rem",
                padding: "5px 12px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Clear History
            </button>
          )}
        </div>
        <p style={{ color: "rgba(241,242,247,0.4)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: 28 }}>Your live transfer history and activity</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6" style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 4, display: "inline-flex" }}>
          {(["sent", "received"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 20px",
                borderRadius: 8,
                fontSize: "0.875rem",
                fontWeight: 500,
                fontFamily: "'Inter', sans-serif",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
                color: tab === t ? "#a5b4fc" : "rgba(241,242,247,0.4)",
              }}
            >
              {t === "sent" ? "Sent" : "Received"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by file name or device..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f1f2f7",
                outline: "none",
                fontFamily: "'Inter', sans-serif",
              }}
            />
            <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "rgba(241,242,247,0.3)" }}>
              <IconSearch size={16} />
            </div>
          </div>
        </div>

        {/* List */}
        {filtered.length > 0 ? (
          <div className="flex flex-col gap-2.5">
            {filtered.map((t) => {
              const cfg = statusConfig[t.status] || statusConfig.completed
              return (
                <div
                  key={t.id}
                  className="glass rounded-xl p-4 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 11,
                        background: "rgba(99,102,241,0.12)",
                        color: "#818cf8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {getFileIcon(t.name)}
                    </div>
                    <div className="min-w-0">
                      <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.92rem", color: "#f1f2f7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.name}
                      </div>
                      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", color: "rgba(241,242,247,0.35)", marginTop: 2 }}>
                        {typeof t.size === "number" ? formatBytes(t.size) : t.size} · {t.device} · {t.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      style={{
                        background: cfg.bg,
                        border: `1px solid ${cfg.border}`,
                        color: cfg.color,
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        padding: "3px 9px",
                        borderRadius: 6,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {cfg.label}
                    </span>

                    {t.file && (
                      <button
                        onClick={() => downloadFile(t.file!)}
                        style={{
                          background: "rgba(99,102,241,0.12)",
                          border: "1px solid rgba(99,102,241,0.25)",
                          color: "#818cf8",
                          borderRadius: 8,
                          padding: "6px 10px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.75rem",
                          fontFamily: "'Inter', sans-serif",
                        }}
                      >
                        <IconDownload size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.1rem", color: "#f1f2f7", marginBottom: 6 }}>
              No transfers found
            </p>
            <p style={{ color: "rgba(241,242,247,0.4)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", marginBottom: 20 }}>
              Files you send or receive will appear here.
            </p>
            <button onClick={() => onNavigate("send")} className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold">
              Send a file now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
