import { useState, useEffect } from "react"
import type { MobileScreen } from "./MobileApp"
import { getHistoryRecords, type HistoryRecord } from "../services/transferStore"
import { DroviaLogo } from "../components/Logo"

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

function getGreeting(): string {
  const hr = new Date().getHours()
  if (hr < 12) return "Good morning"
  if (hr < 18) return "Good afternoon"
  return "Good evening"
}

const mockNotifications = [
  { id: "1", title: "Direct Sharing Active", body: "Encrypted direct file transfer service is online and ready.", time: "Just now", type: "system" },
  { id: "2", title: "Storage Ready", body: "High-speed stream buffering is ready on this device.", time: "5m ago", type: "info" },
  { id: "3", title: "Welcome to Drovia", body: "No file size limits. Transfer files anywhere instantly.", time: "1h ago", type: "welcome" },
]

export default function MobileHome({ onNavigate }: { onNavigate: (s: MobileScreen) => void }) {
  const [transfers, setTransfers] = useState<HistoryRecord[]>([])
  const [showNotifSheet, setShowNotifSheet] = useState(false)
  const [unreadCount, setUnreadCount] = useState(3)

  useEffect(() => {
    setTransfers(getHistoryRecords().slice(0, 4))
  }, [])

  const handleOpenNotif = () => {
    setShowNotifSheet(true)
    setUnreadCount(0)
  }

  return (
    <div style={{ padding: "20px 20px 0", minHeight: "100%", background: "var(--bg-color)", position: "relative" }}>
      {/* Header Logo & Notification Bell */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <DroviaLogo size="small" />

        {/* Notification Bell Button */}
        <button
          onClick={handleOpenNotif}
          aria-label="Open notifications"
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            cursor: "pointer",
            color: "var(--text-color)",
            transition: "all 0.2s ease",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: 7,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#ef4444",
                boxShadow: "0 0 8px rgba(239,68,68,0.8)",
              }}
            />
          )}
        </button>
      </div>

      {/* Dynamic Greeting matching Image 2 */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>
          {getGreeting()}
        </p>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2.1rem", color: "var(--text-color)", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
          Ready to<br />transfer?
        </h1>
      </div>

      {/* Action cards matching Image 2 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
        {/* Send card */}
        <button
          onClick={() => onNavigate("send")}
          style={{
            width: "100%",
            padding: "20px 18px",
            borderRadius: 22,
            background: "rgba(30, 31, 48, 0.6)",
            border: "1px solid rgba(99,102,241,0.25)",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transition: "transform 0.15s ease, background 0.15s ease",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(99,102,241,0.18)",
              border: "1px solid rgba(99,102,241,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)", marginBottom: 2 }}>
              Send
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Choose files and create a transfer
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        {/* Receive card */}
        <button
          onClick={() => onNavigate("receive")}
          style={{
            width: "100%",
            padding: "20px 18px",
            borderRadius: 22,
            background: "rgba(18, 41, 48, 0.4)",
            border: "1px solid rgba(34,211,238,0.25)",
            cursor: "pointer",
            textAlign: "left",
            display: "flex",
            alignItems: "center",
            gap: 16,
            transition: "transform 0.15s ease, background 0.15s ease",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: "rgba(34,211,238,0.15)",
              border: "1px solid rgba(34,211,238,0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 12 21 16 17" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)", marginBottom: 2 }}>
              Receive
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.82rem", color: "var(--text-muted)" }}>
              Enter a PIN or scan QR
            </div>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

      {/* Recent Transfers */}
      <div>
        <p style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Recent Transfers
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {transfers.length > 0 ? (
            transfers.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--border-color)",
                  borderRadius: 16,
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 12,
                    background: "rgba(99,102,241,0.12)",
                    border: "1px solid rgba(99,102,241,0.25)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#818cf8",
                    flexShrink: 0,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  {t.name.split(".").pop()?.toUpperCase() || "FILE"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "var(--text-color)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>
                    {typeof t.size === "number" ? formatBytes(t.size) : t.size} · {t.device}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)", fontSize: "0.82rem", fontFamily: "'Inter', sans-serif" }}>
              No recent transfers yet
            </div>
          )}
        </div>
      </div>

      {/* Notifications Bottom Sheet Modal */}
      {showNotifSheet && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
          onClick={() => setShowNotifSheet(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface-color)",
              borderTop: "1px solid var(--border-color)",
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: "20px 20px 32px",
              maxHeight: "75vh",
              overflowY: "auto",
              boxShadow: "0 -10px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Sheet Handle Bar */}
            <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--border-color)", margin: "0 auto 16px" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)", margin: 0 }}>
                  Notifications
                </h3>
              </div>
              <button
                onClick={() => setShowNotifSheet(false)}
                style={{ background: "none", border: "none", color: "var(--text-muted)", fontSize: "1.2rem", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            {/* Notification List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mockNotifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    background: "var(--glass-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 16,
                    padding: "14px 16px",
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "rgba(99,102,241,0.15)",
                      border: "1px solid rgba(99,102,241,0.3)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#818cf8",
                      flexShrink: 0,
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-color)" }}>
                        {n.title}
                      </span>
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.68rem", color: "var(--text-muted)" }}>
                        {n.time}
                      </span>
                    </div>
                    <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.4 }}>
                      {n.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
