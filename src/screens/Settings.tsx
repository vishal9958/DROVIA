import { useState, useEffect } from "react"

interface SettingsProps {}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        background: checked ? "#6366f1" : "rgba(255,255,255,0.1)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
        boxShadow: checked ? "0 0 12px rgba(99,102,241,0.4)" : "none",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          position: "absolute",
          top: 3,
          left: checked ? 23 : 3,
          transition: "left 0.2s",
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}
      />
    </button>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <h2
      style={{
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 600,
        fontSize: "0.95rem",
        marginBottom: 10,
        marginTop: 4,
        paddingLeft: 4,
      }}
    >
      {title}
    </h2>
  )
}

interface RowProps {
  label: string
  desc?: string
  children: React.ReactNode
}
function Row({ label, desc, children }: RowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500 }}>{label}</div>
        {desc && <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.75rem", opacity: 0.6, marginTop: 2 }}>{desc}</div>}
      </div>
      {children}
    </div>
  )
}

export function applyTheme(t: "dark" | "light" | "system") {
  localStorage.setItem("drovia_theme", t)
  let activeTheme = t
  if (t === "system") {
    activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  document.documentElement.setAttribute("data-theme", activeTheme)
}

export default function Settings({}: SettingsProps) {
  const [autoAccept, setAutoAccept] = useState(false)
  const [autoDelete, setAutoDelete] = useState(true)
  const [pinSecurity, setPinSecurity] = useState(true)
  const [theme, setTheme] = useState<"dark" | "light" | "system">("dark")
  const [deviceName, setDeviceName] = useState("My Laptop Device")
  const [expiry, setExpiry] = useState("10")
  const [maxSize, setMaxSize] = useState("unlimited")
  const [savedMsg, setSavedMsg] = useState(false)

  // Load settings on mount
  useEffect(() => {
    try {
      const storedName = localStorage.getItem("drovia_device_name") || "My Laptop Device"
      setDeviceName(storedName)

      const storedExp = localStorage.getItem("drovia_pin_expiry") || "10"
      setExpiry(storedExp)

      const storedAutoAcc = localStorage.getItem("drovia_auto_accept")
      if (storedAutoAcc !== null) setAutoAccept(JSON.parse(storedAutoAcc))

      const storedAutoDel = localStorage.getItem("drovia_auto_delete")
      if (storedAutoDel !== null) setAutoDelete(JSON.parse(storedAutoDel))

      const storedPinSec = localStorage.getItem("drovia_pin_security")
      if (storedPinSec !== null) setPinSecurity(JSON.parse(storedPinSec))

      const storedTheme = (localStorage.getItem("drovia_theme") as "dark" | "light" | "system") || "dark"
      setTheme(storedTheme)
      applyTheme(storedTheme)

      const storedMaxSize = localStorage.getItem("drovia_max_size") || "unlimited"
      setMaxSize(storedMaxSize)
    } catch (e) {
      // ignore
    }
  }, [])

  const handleThemeChange = (t: "dark" | "light" | "system") => {
    setTheme(t)
    applyTheme(t)
  }

  const handleSaveSettings = () => {
    try {
      localStorage.setItem("drovia_device_name", deviceName)
      localStorage.setItem("drovia_pin_expiry", expiry)
      localStorage.setItem("drovia_auto_accept", JSON.stringify(autoAccept))
      localStorage.setItem("drovia_auto_delete", JSON.stringify(autoDelete))
      localStorage.setItem("drovia_pin_security", JSON.stringify(pinSecurity))
      localStorage.setItem("drovia_max_size", maxSize)
      applyTheme(theme)

      setSavedMsg(true)
      setTimeout(() => setSavedMsg(false), 2500)
    } catch (e) {
      // ignore
    }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 8,
    padding: "6px 12px",
    fontSize: "0.85rem",
    fontFamily: "'Inter', sans-serif",
    outline: "none",
    width: 180,
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: 56, background: "var(--bg-color)", transition: "background 0.3s ease" }}>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }} className="animate-fade-up">
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.75rem", marginBottom: 6 }}>Settings</h1>
        <p style={{ opacity: 0.6, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: 32 }}>Manage your transfer preferences and privacy</p>

        {/* Transfer Settings */}
        <div className="glass rounded-2xl px-6 mb-5">
          <div className="pt-5 pb-2">
            <SectionHeader title="Transfer Settings" />
          </div>
          <Row label="Auto accept transfers" desc="Automatically accept incoming transfers from any device">
            <Toggle checked={autoAccept} onChange={(v) => { setAutoAccept(v); localStorage.setItem("drovia_auto_accept", JSON.stringify(v)) }} />
          </Row>
          <Row label="Maximum transfer size" desc="Limit the size of files you can receive">
            <select
              value={maxSize}
              onChange={(e) => { setMaxSize(e.target.value); localStorage.setItem("drovia_max_size", e.target.value) }}
              style={{ ...inputStyle, width: "auto" }}
            >
              {["unlimited", "1 GB", "5 GB", "10 GB"].map((v) => (
                <option key={v} value={v} style={{ background: "#13141f", color: "#f1f2f7" }}>{v === "unlimited" ? "Unlimited" : v}</option>
              ))}
            </select>
          </Row>
          <Row label="Auto-delete expired transfers" desc="Remove transfers after PIN expires">
            <Toggle checked={autoDelete} onChange={(v) => { setAutoDelete(v); localStorage.setItem("drovia_auto_delete", JSON.stringify(v)) }} />
          </Row>
        </div>

        {/* Privacy & Device Identity */}
        <div className="glass rounded-2xl px-6 mb-5">
          <div className="pt-5 pb-2">
            <SectionHeader title="Privacy & Device Identity" />
          </div>
          <Row label="Device name" desc="How your device appears to receivers">
            <input
              type="text"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              style={inputStyle}
            />
          </Row>
          <Row label="Transfer PIN expiry" desc="Minutes before unused PINs expire">
            <select
              value={expiry}
              onChange={(e) => { setExpiry(e.target.value); localStorage.setItem("drovia_pin_expiry", e.target.value) }}
              style={{ ...inputStyle, width: "auto" }}
            >
              {["5", "10", "15", "30", "60"].map((v) => (
                <option key={v} value={v} style={{ background: "#13141f", color: "#f1f2f7" }}>{v} min</option>
              ))}
            </select>
          </Row>
          <Row label="PIN security" desc="Require PIN confirmation before accepting">
            <Toggle checked={pinSecurity} onChange={(v) => { setPinSecurity(v); localStorage.setItem("drovia_pin_security", JSON.stringify(v)) }} />
          </Row>
        </div>

        {/* Appearance Theme */}
        <div className="glass rounded-2xl px-6 mb-5">
          <div className="pt-5 pb-2">
            <SectionHeader title="Appearance" />
          </div>
          <div className="py-5">
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", fontWeight: 500, marginBottom: 12 }}>Theme</p>
            <div className="flex gap-2 flex-wrap">
              {(["dark", "light", "system"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleThemeChange(t)}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 12,
                    fontSize: "0.88rem",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600,
                    border: "1px solid",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    background: theme === t ? "linear-gradient(135deg, #6366f1, #818cf8)" : "rgba(255,255,255,0.05)",
                    borderColor: theme === t ? "#6366f1" : "rgba(255,255,255,0.1)",
                    color: theme === t ? "white" : "inherit",
                    boxShadow: theme === t ? "0 4px 14px rgba(99,102,241,0.4)" : "none",
                  }}
                >
                  {t === "dark" ? "🌙 Dark" : t === "light" ? "☀️ Light" : "⚙️ System"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSaveSettings}
          className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold transition-all"
        >
          {savedMsg ? "✓ Settings Saved Successfully!" : "Save Settings"}
        </button>
      </div>
    </div>
  )
}
