import type { MobileScreen } from "./MobileApp"
import { CameraQrScanner } from "../components/CameraQrScanner"

interface Props {
  onNavigate: (s: MobileScreen) => void
  onPin?: (pin: string) => void
}

export default function MobileQrScanner({ onNavigate, onPin }: Props) {
  const handleScanSuccess = (pin: string) => {
    if (onPin) {
      onPin(pin)
      onNavigate("connecting")
    } else {
      onNavigate("connecting")
    }
  }

  return (
    <div style={{ height: "100%", background: "var(--bg-color)", position: "relative", display: "flex", flexDirection: "column", padding: "16px" }}>
      {/* Top bar */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
        }}
      >
        <button
          onClick={() => onNavigate("receive")}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--glass-bg)",
            border: "1px solid var(--border-color)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "var(--text-color)",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-color)" }}>Scan Transfer QR</h1>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CameraQrScanner onScanSuccess={handleScanSuccess} onCancel={() => onNavigate("receive")} />
      </div>
    </div>
  )
}
