import { useState, useEffect } from "react"
import { applyTheme } from "../screens/Settings"

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} style={{ width: 42, height: 22, borderRadius: 11, background: checked ? "#6366f1" : "var(--glass-bg)", border: "none", cursor: "pointer", position: "relative", flexShrink: 0, transition: "background 0.2s", boxShadow: checked ? "0 0 10px rgba(99,102,241,0.4)" : "none" }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: checked ? 22 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.3)" }} />
    </button>
  )
}

export default function MobileSettings() {
  const [notifications, setNotifications] = useState(true)
  const [autoAccept, setAutoAccept] = useState(false)
  const [autoDelete, setAutoDelete] = useState(true)
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")

  useEffect(() => {
    const saved = (localStorage.getItem("drovia_theme") as "dark" | "light" | "system") || "dark"
    setTheme(saved)
  }, [])

  const handleThemeChange = (t: "dark" | "light" | "system") => {
    setTheme(t)
    applyTheme(t)
  }

  const handleNotificationsToggle = (val: boolean) => {
    setNotifications(val)
    if (val && "Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission()
    }
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-muted)", marginBottom: 8, paddingLeft: 2 }}>{title}</p>
      <div className="glass" style={{ borderRadius: 16 }}>{children}</div>
    </div>
  )

  const Row = ({ label, desc, children, last }: { label: string; desc?: string; children: React.ReactNode; last?: boolean }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "14px 16px", borderBottom: last ? "none" : "1px solid var(--border-color)" }}>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, color: "var(--text-color)" }}>{label}</div>
        {desc && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.72rem", color: "var(--text-muted)", marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", padding: "20px", transition: "background 0.3s ease" }}>
      <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.4rem", color: "var(--text-color)", marginBottom: 24 }}>Settings</h1>

      <Section title="Notifications">
        <Row label="Push notifications" desc="Alert when file arrives or transfer completes" last>
          <Toggle checked={notifications} onChange={handleNotificationsToggle} />
        </Row>
      </Section>

      <Section title="Transfer">
        <Row label="Auto accept" desc="Accept transfers automatically"><Toggle checked={autoAccept} onChange={setAutoAccept} /></Row>
        <Row label="Auto-delete expired" desc="Remove expired transfers" last><Toggle checked={autoDelete} onChange={setAutoDelete} /></Row>
      </Section>

      <Section title="Privacy">
        <Row label="Device name"><input defaultValue="Android Phone" style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "5px 10px", color: "var(--text-color)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", outline: "none", width: 130 }} /></Row>
        <Row label="PIN expiry" last>
          <select style={{ background: "var(--glass-bg)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "5px 10px", color: "var(--text-color)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", outline: "none" }}>
            <option style={{ background: "var(--surface-color)", color: "var(--text-color)" }}>10 min</option>
            <option style={{ background: "var(--surface-color)", color: "var(--text-color)" }}>15 min</option>
          </select>
        </Row>
      </Section>

      <Section title="Appearance">
        <div style={{ padding: "14px 16px" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(["dark", "light", "system"] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                style={{
                  flex: 1, padding: "9px 6px",
                  borderRadius: 10, border: "1px solid",
                  cursor: "pointer", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  background: theme === t ? "rgba(99,102,241,0.15)" : "var(--glass-bg)",
                  borderColor: theme === t ? "rgba(99,102,241,0.4)" : "var(--border-color)",
                  color: theme === t ? "#6366f1" : "var(--text-muted)",
                  transition: "all 0.15s",
                }}
              >
                {t === "dark" ? "🌙" : t === "light" ? "☀️" : "⚙️"}<br />{t}
              </button>
            ))}
          </div>
        </div>
      </Section>

      <Section title="About">
        <Row label="Version"><span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.8rem", color: "var(--text-muted)" }}>v1.0.0-beta</span></Row>
        <Row label="Terms of Service"><a href="#" style={{ color: "#6366f1", fontSize: "0.85rem", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>View →</a></Row>
        <Row label="Privacy Policy" last><a href="#" style={{ color: "#6366f1", fontSize: "0.85rem", textDecoration: "none", fontFamily: "'Inter', sans-serif" }}>View →</a></Row>
      </Section>

      <div style={{ height: 20 }} />
    </div>
  )
}
