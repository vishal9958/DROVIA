type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface Props {
  variant: "failed" | "expired" | "invalid-pin" | "offline"
  onNavigate: (s: Screen) => void
}

const configs = {
  "failed": {
    emoji: "⚡",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    title: "Transfer interrupted",
    desc: "The connection was lost before the transfer completed. This can happen due to network instability.",
    cta: "Retry Transfer",
    ctaScreen: "send" as Screen,
    secondary: "Back to Home",
    secondaryScreen: "landing" as Screen,
  },
  "expired": {
    emoji: "⏰",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.2)",
    title: "This transfer has expired",
    desc: "The PIN was not used within the 10-minute window. Create a new transfer to try again.",
    cta: "Create New Transfer",
    ctaScreen: "send" as Screen,
    secondary: "Back to Home",
    secondaryScreen: "landing" as Screen,
  },
  "invalid-pin": {
    emoji: "🔑",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.2)",
    title: "Invalid transfer code",
    desc: "The PIN you entered doesn't match any active transfer. Check the code and try again.",
    cta: "Try Again",
    ctaScreen: "receive" as Screen,
    secondary: "Back to Home",
    secondaryScreen: "landing" as Screen,
  },
  "offline": {
    emoji: "📡",
    color: "#6b7280",
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.2)",
    title: "Receiver could not be reached",
    desc: "The receiver may have gone offline or their device is unavailable. Ask them to stay on the receive screen.",
    cta: "Try Again",
    ctaScreen: "send" as Screen,
    secondary: "Back to Home",
    secondaryScreen: "landing" as Screen,
  },
}

export default function ErrorState({ variant, onNavigate }: Props) {
  const c = configs[variant]
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }} className="animate-fade-up">
        <div
          style={{
            width: 80, height: 80, borderRadius: "50%",
            background: c.bg,
            border: `1.5px solid ${c.border}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            fontSize: "2rem",
          }}
        >
          {c.emoji}
        </div>
        <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.5rem", color: "#f1f2f7", marginBottom: 10 }}>{c.title}</h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.875rem", color: "rgba(241,242,247,0.4)", lineHeight: 1.6, marginBottom: 28 }}>{c.desc}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            onClick={() => onNavigate(c.ctaScreen)}
            className="btn-primary py-3 rounded-xl text-sm font-semibold"
          >
            {c.cta}
          </button>
          <button
            onClick={() => onNavigate(c.secondaryScreen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(241,242,247,0.3)", fontSize: "0.85rem", fontFamily: "'Inter', sans-serif", padding: "8px" }}
          >
            {c.secondary}
          </button>
        </div>
      </div>
    </div>
  )
}
