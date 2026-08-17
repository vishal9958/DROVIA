import { useEffect, useState } from "react"
import { IconLaptop, IconPhone } from "../components/Icons"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface ConnectingProps {
  onNavigate: (screen: Screen) => void
  pin: string
}

const stages = [
  { label: "Finding transfer", duration: 1200 },
  { label: "Establishing secure connection", duration: 1600 },
  { label: "Preparing file transfer", duration: 1200 },
]

export default function Connecting({ onNavigate, pin }: ConnectingProps) {
  const [stage, setStage] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    let current = 0
    const advance = () => {
      if (current < stages.length - 1) {
        current++
        setStage(current)
        setTimeout(advance, stages[current].duration)
      } else {
        setTimeout(() => {
          setDone(true)
          setTimeout(() => onNavigate("incoming"), 600)
        }, 800)
      }
    }
    const t = setTimeout(advance, stages[0].duration)
    return () => clearTimeout(t)
  }, [onNavigate])

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
      <div style={{ width: "100%", maxWidth: 480, padding: "48px 24px", textAlign: "center" }} className="animate-fade-up">
        <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-muted)", fontFamily: "'JetBrains Mono', monospace", marginBottom: 32 }}>
          PIN · {pin || "482913"}
        </p>

        {/* Connection animation */}
        <div className="flex items-center justify-center gap-6 mb-12">
          {/* Sender device */}
          <div
            className="glass rounded-2xl flex flex-col items-center justify-center gap-2"
            style={{ width: 90, height: 80, fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}
          >
            <IconLaptop size={24} />
            Sender
          </div>

          {/* Animated connection */}
          <div style={{ flex: 1, position: "relative", height: 32, display: "flex", alignItems: "center" }}>
            <div style={{ width: "100%", height: 2, background: "rgba(99,102,241,0.2)", borderRadius: 1, position: "relative", overflow: "hidden" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent 0%, #6366f1 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                  animation: done ? "none" : "shimmer 1.2s linear infinite",
                  opacity: done ? 0 : 1,
                  transition: "opacity 0.4s",
                }}
              />
              {done && (
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #6366f1, #22d3ee)", borderRadius: 1 }} />
              )}
            </div>
          </div>

          {/* Receiver device */}
          <div
            className="glass rounded-2xl flex flex-col items-center justify-center gap-2"
            style={{ width: 80, height: 80, fontSize: "0.65rem", color: "var(--text-muted)", fontFamily: "'Inter', sans-serif" }}
          >
            <IconPhone size={20} />
            Receiver
          </div>
        </div>

        <h1
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: "1.75rem",
            color: "var(--text-color)",
            marginBottom: 8,
          }}
        >
          {done ? "Connected!" : "Connecting securely..."}
        </h1>

        {!done && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", marginBottom: 40 }}>
            Establishing a direct encrypted connection
          </p>
        )}

        {/* Progress stages */}
        {!done && (
          <div className="text-left glass rounded-2xl p-6 flex flex-col gap-4">
            {stages.map((s, i) => {
              const isActive = i === stage
              const isDone = i < stage
              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: isDone
                        ? "rgba(16,185,129,0.15)"
                        : isActive
                        ? "rgba(99,102,241,0.15)"
                        : "rgba(255,255,255,0.05)",
                      border: isDone
                        ? "1px solid rgba(16,185,129,0.4)"
                        : isActive
                        ? "1px solid rgba(99,102,241,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "all 0.3s",
                    }}
                  >
                    {isDone ? (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    ) : isActive ? (
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "#6366f1",
                          animation: "connection-pulse 1s ease-in-out infinite",
                        }}
                      />
                    ) : (
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
                    )}
                  </div>
                  <span
                    style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: "0.875rem",
                      color: isDone ? "#10b981" : isActive ? "var(--text-color)" : "var(--text-muted)",
                      transition: "color 0.3s",
                    }}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
