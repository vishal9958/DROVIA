export function DroviaLogo({ size = "normal" }: { size?: "small" | "normal" | "large" }) {
  const boxSize = size === "small" ? 28 : size === "large" ? 40 : 32
  const fontSize = size === "small" ? "0.95rem" : size === "large" ? "1.3rem" : "1.05rem"
  const subFontSize = size === "small" ? "0.52rem" : size === "large" ? "0.65rem" : "0.58rem"

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      {/* Icon Badge */}
      <div
        style={{
          width: boxSize,
          height: boxSize,
          borderRadius: size === "small" ? 8 : 10,
          background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          flexShrink: 0,
        }}
      >
        <svg width={boxSize * 0.5} height={boxSize * 0.5} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {/* Brand Text */}
      <div style={{ display: "flex", flexDirection: "column", textAlign: "left" }}>
        <span
          className="brand-title"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize,
            letterSpacing: "0.06em",
            lineHeight: 1.1,
          }}
        >
          DROVIA
        </span>
        <span
          style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 600,
            fontSize: subFontSize,
            color: "#22d3ee",
            letterSpacing: "0.04em",
          }}
        >
          Transfer. Anywhere.
        </span>
      </div>
    </div>
  )
}
