import { useState, useRef } from "react"
import { IconCamera } from "../components/Icons"
import { CameraQrScanner } from "../components/CameraQrScanner"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface ReceiveProps {
  onNavigate: (screen: Screen) => void
  onPin: (pin: string) => void
}

export default function Receive({ onNavigate, onPin }: ReceiveProps) {
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const [showScanner, setShowScanner] = useState(false)
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
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (text.length) {
      const next = text.split("").concat(["", "", "", "", "", ""]).slice(0, 6)
      setDigits(next)
      refs.current[Math.min(text.length, 5)]?.focus()
    }
  }

  const fullPin = digits.join("")

  const handleConnect = () => {
    if (fullPin.length < 6) {
      setError("Please enter all 6 digits")
      return
    }
    onPin(fullPin)
    onNavigate("connecting")
  }

  const handleScanSuccess = (pin: string) => {
    onPin(pin)
    onNavigate("connecting")
  }

  if (showScanner) {
    return (
      <div style={{ minHeight: "100vh", paddingTop: 56, background: "var(--bg-color)", transition: "background 0.3s ease" }}>
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 480,
            margin: "0 auto",
            padding: "32px 24px",
          }}
          className="animate-fade-up"
        >
          <button
            onClick={() => setShowScanner(false)}
            className="btn-ghost px-4 py-2 rounded-lg text-sm flex items-center gap-2 mb-6"
          >
            ← Back
          </button>

          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "var(--text-color)", marginBottom: 6 }}>Scan Transfer QR</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>Point your camera at the sender's QR code</p>

          <CameraQrScanner onScanSuccess={handleScanSuccess} onCancel={() => setShowScanner(false)} />
        </div>
      </div>
    )
  }

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
      <div style={{ width: "100%", maxWidth: 440, padding: "48px 24px" }} className="animate-fade-up">
        <div className="text-center mb-10">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "rgba(99,102,241,0.12)",
              border: "1px solid rgba(99,102,241,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              color: "#818cf8",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="8 17 12 21 16 17" />
              <line x1="12" y1="12" x2="12" y2="21" />
              <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
            </svg>
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.75rem", color: "var(--text-color)", marginBottom: 8 }}>Receive a file</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>
            Enter the 6-digit PIN shared by the sender.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-8">
          <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 16, textAlign: "center" }}>
            Transfer PIN
          </label>

          {/* PIN inputs */}
          <div className="flex items-center justify-center gap-2 mb-2" onPaste={handlePaste}>
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
                className="pin-digit"
                style={{ marginLeft: i === 3 ? 12 : 0 }}
              />
            ))}
          </div>

          {error && (
            <p style={{ textAlign: "center", color: "#ef4444", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginBottom: 8 }}>{error}</p>
          )}

          <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>
            3 + 3 digits separated
          </p>

          <button
            onClick={handleConnect}
            className="btn-primary w-full py-3.5 rounded-xl text-base font-semibold mb-3"
          >
            Connect
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "'Inter', sans-serif" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "var(--border-color)" }} />
          </div>

          <button
            onClick={() => setShowScanner(true)}
            className="btn-ghost w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
          >
            <IconCamera size={16} />
            Scan QR Code
          </button>
        </div>

        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif", marginTop: 20 }}>
          Don't have a PIN? Ask the sender to share their transfer code.
        </p>
      </div>
    </div>
  )
}
