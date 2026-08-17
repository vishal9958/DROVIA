import { useState, useRef } from "react"
import type { MobileScreen } from "./MobileApp"

interface Props {
  onNavigate: (s: MobileScreen) => void
  onPin?: (pin: string) => void
}

export default function MobileReceive({ onNavigate, onPin }: Props) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [error, setError] = useState("")
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const setDigit = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[i] = val
    setDigits(next)
    setError("")
    if (val && i < 5) refs.current[i + 1]?.focus()
  }

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus()
  }

  const handleConnect = () => {
    const full = digits.join("")
    if (full.length < 6) { setError("Enter all 6 digits"); return }
    if (onPin) onPin(full)
    onNavigate("connecting")
  }

  return (
    <div style={{ minHeight: "100%", background: "var(--bg-color)", transition: "background 0.3s ease" }}>
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
        <button
          onClick={() => onNavigate("home")}
          style={{ width: 36, height: 36, borderRadius: 10, background: "var(--glass-bg)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-color)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-color)" }}>Receive files</h1>
      </div>

      <div style={{ padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 60, height: 60, borderRadius: 18,
              background: "rgba(34,211,238,0.1)",
              border: "1px solid rgba(34,211,238,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 16px", color: "#22d3ee",
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 12 21 16 17" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
            </svg>
          </div>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Enter the 6-digit PIN shared by the sender
          </p>
        </div>

        {/* PIN input */}
        <div
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: 20,
            padding: "28px 20px",
            textAlign: "center",
            marginBottom: 16,
          }}
        >
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", marginBottom: 20 }}>Transfer PIN</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 6 }}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { refs.current[i] = el }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => setDigit(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                style={{
                  width: 42,
                  height: 56,
                  borderRadius: 10,
                  background: d ? "rgba(99,102,241,0.12)" : "var(--glass-bg)",
                  border: d ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border-color)",
                  color: "var(--text-color)",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  fontFamily: "'JetBrains Mono', monospace",
                  textAlign: "center",
                  outline: "none",
                  marginLeft: i === 3 ? 10 : 0,
                  transition: "all 0.15s",
                }}
              />
            ))}
          </div>
          {error && <p style={{ color: "#ef4444", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginTop: 8 }}>{error}</p>}
        </div>

        <button
          onClick={handleConnect}
          style={{
            width: "100%", padding: "15px",
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            border: "none", borderRadius: 14,
            color: "white", fontSize: "1rem", fontWeight: 700, fontFamily: "'Outfit', sans-serif",
            cursor: "pointer", marginBottom: 12,
            boxShadow: "0 0 24px rgba(99,102,241,0.3)",
          }}
        >
          Connect
        </button>

        <button
          onClick={() => onNavigate("qr-scanner")}
          style={{
            width: "100%", padding: "15px",
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            borderRadius: 14,
            color: "var(--text-color)",
            fontSize: "1rem", fontWeight: 600, fontFamily: "'Outfit', sans-serif",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="3" height="3" /><line x1="14" y1="20" x2="17" y2="20" /><line x1="20" y1="14" x2="20" y2="17" />
          </svg>
          Scan QR Code
        </button>
      </div>
    </div>
  )
}
