import { useState, useEffect } from "react"
import { getHistoryRecords, type HistoryRecord, downloadFile } from "../services/transferStore"

function formatBytes(bytes: number): string {
  if (!bytes) return "0 B"
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

const statusColors = {
  completed: { color: "#10b981", bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)" },
  cancelled: { color: "#9ca3af", bg: "rgba(156,163,175,0.12)", border: "rgba(156,163,175,0.2)" },
  failed: { color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)" },
  expired: { color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)" },
}

export default function MobileTransfers() {
  const [tab, setTab] = useState<"all" | "sent" | "received">("all")
  const [records, setRecords] = useState<HistoryRecord[]>([])

  useEffect(() => {
    setRecords(getHistoryRecords())
  }, [])

  const filtered = records.filter((t) => {
    if (tab === "all") return true
    return t.direction === tab
  })

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", padding: "20px", transition: "background 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: "var(--text-color)", margin: 0 }}>Transfer History</h1>
        <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace" }}>
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)", borderRadius: 14, padding: 4, display: "flex", marginBottom: 20 }}>
        {(["all", "sent", "received"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: "8px",
              borderRadius: 10, border: "none", cursor: "pointer",
              background: tab === t ? "rgba(99,102,241,0.2)" : "transparent",
              color: tab === t ? "#818cf8" : "var(--text-muted)",
              fontSize: "0.8rem", fontWeight: tab === t ? 600 : 500, fontFamily: "'Inter', sans-serif",
              transition: "all 0.15s",
              textTransform: "capitalize",
            }}
          >
            {t === "sent" ? "Sent ↑" : t === "received" ? "Received ↓" : "All"}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: "2.2rem", marginBottom: 12 }}>📂</div>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "var(--text-muted)" }}>No {tab} transfer records yet</p>
          </div>
        )}
        {filtered.map((t) => {
          const sc = statusColors[t.status as keyof typeof statusColors] || statusColors.completed
          const isSent = t.direction === "sent"
          const ext = t.name.includes(".") ? t.name.split(".").pop()?.toUpperCase() || "FILE" : "FILE"

          return (
            <div
              key={t.id}
              className="glass"
              style={{
                borderRadius: 16,
                padding: "14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <div
                style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: isSent ? "rgba(99,102,241,0.12)" : "rgba(34,211,238,0.12)",
                  border: isSent ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(34,211,238,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: isSent ? "#818cf8" : "#22d3ee",
                  fontSize: "0.62rem", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                  flexShrink: 0,
                }}
              >
                {ext}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: "0.7rem", color: isSent ? "#818cf8" : "#22d3ee", fontWeight: 700 }}>
                    {isSent ? "↑ Sent" : "↓ Received"}
                  </span>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>· {t.date}</span>
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {t.name}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.7rem", color: "var(--text-muted)", marginTop: 2 }}>
                  {formatBytes(t.size)} · {t.device}
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, fontSize: "0.62rem", fontWeight: 600, padding: "3px 8px", borderRadius: 6, fontFamily: "'JetBrains Mono', monospace" }}>
                  {t.status.toUpperCase()}
                </span>
                {t.file && (
                  <button
                    onClick={() => downloadFile(t.file!)}
                    style={{
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      color: "#818cf8",
                      borderRadius: 8,
                      padding: "4px 8px",
                      fontSize: "0.68rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    Download
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
