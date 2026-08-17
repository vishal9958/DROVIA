import { useState, useEffect } from "react"
import { IconLaptop, IconPhone, IconFile, IconImage, IconVideo, IconZip, IconPdf, IconShield } from "../components/Icons"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface LandingProps {
  onNavigate: (screen: Screen) => void
}

const faqs = [
  { q: "Does Drovia store my files?", a: "No. Files stream directly between connected devices. Nothing is stored or uploaded to external servers." },
  { q: "What's the maximum file size?", a: "There's no enforced limit. Practical limits depend on your available memory and network speed." },
  { q: "How long does the PIN stay valid?", a: "PINs expire after 10 minutes of inactivity or once the transfer completes." },
  { q: "Does both devices need to be on the same network?", a: "No. Drovia establishes a direct secure stream so it works across different networks anywhere in the world." },
]

const floatingFiles = [
  { icon: <IconPdf size={18} />, label: "report.pdf", color: "#ef4444", x: "6%", y: "8%", delay: "0s" },
  { icon: <IconImage size={18} />, label: "photo.jpg", color: "#6366f1", x: "78%", y: "8%", delay: "0.8s" },
  { icon: <IconVideo size={18} />, label: "video.mp4", color: "#22d3ee", x: "6%", y: "76%", delay: "1.6s" },
  { icon: <IconZip size={18} />, label: "archive.zip", color: "#f59e0b", x: "78%", y: "76%", delay: "0.4s" },
]

export default function Landing({ onNavigate }: LandingProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [, forceUpdate] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => forceUpdate(1), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ background: "var(--bg-color)", minHeight: "100vh", paddingTop: 56, transition: "background 0.3s ease" }}>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden" style={{ minHeight: "88vh", display: "flex", alignItems: "center" }}>
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 80% 60% at 50% -20%, rgba(99,102,241,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at center, rgba(99,102,241,0.06) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            pointerEvents: "none",
          }}
        />

        <div className="max-w-6xl mx-auto px-6 w-full py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Column */}
            <div className="flex-1 text-center lg:text-left">
              <div
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6"
                style={{
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.25)",
                  color: "#818cf8",
                  fontSize: "0.82rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 500,
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d3ee" }} />
                Instant Direct Transfer · End-to-End Encrypted
              </div>

              <h1
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--text-color)",
                  marginBottom: 20,
                }}
              >
                Share Files Anywhere, <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #6366f1 0%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Instantly.
                </span>
              </h1>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "clamp(1rem, 2vw, 1.15rem)",
                  lineHeight: 1.6,
                  fontFamily: "'Inter', sans-serif",
                  maxWidth: 520,
                  margin: "0 auto 32px",
                }}
                className="lg:mx-0"
              >
                Send files directly between your devices with instant encrypted streaming. No cables. No file size limits.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <button
                  onClick={() => onNavigate("send")}
                  className="btn-primary flex items-center justify-center gap-2 py-4 px-8 text-base font-semibold"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Send a File
                </button>

                <button
                  onClick={() => onNavigate("receive")}
                  className="btn-ghost flex items-center justify-center gap-2 py-4 px-8 text-base font-semibold"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Receive a File
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center lg:justify-start gap-6 text-xs text-muted font-mono">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#6366f1" }}>NO ACCOUNT</span> required
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#22d3ee" }}>NO FILE</span> stored
                </div>
                <span>·</span>
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#10b981" }}>END-TO-END</span> encrypted
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="flex-1 relative flex items-center justify-center" style={{ minHeight: 360 }}>
              {/* Laptop */}
              <div
                className="animate-float glass-strong rounded-2xl flex flex-col items-center justify-center"
                style={{
                  width: 150,
                  height: 96,
                  position: "absolute",
                  left: "8%",
                  top: "22%",
                  animationDelay: "0s",
                  padding: "12px",
                  gap: 6,
                  border: "1px solid rgba(99,102,241,0.3)",
                }}
              >
                <IconLaptop size={30} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-color)", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Sender</span>
              </div>

              {/* Center Connection Circle */}
              <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)" }}>
                <div
                  style={{
                    width: 90,
                    height: 90,
                    borderRadius: "50%",
                    border: "1px solid rgba(99,102,241,0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                  }}
                >
                  <div
                    className="animate-pulse-ring"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: "1px solid rgba(99,102,241,0.4)",
                    }}
                  />
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.25))",
                      border: "1px solid rgba(99,102,241,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                      <path d="M8.53 16.11a6 16 0 0 1 6.95 0" />
                      <line x1="12" y1="20" x2="12.01" y2="20" />
                    </svg>
                  </div>
                </div>

                {/* Connection Line */}
                <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 280, height: 2, pointerEvents: "none" }}>
                  <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), transparent)" }} />
                </div>
              </div>

              {/* Phone */}
              <div
                className="animate-float glass-strong rounded-2xl flex flex-col items-center justify-center"
                style={{
                  width: 120,
                  height: 96,
                  position: "absolute",
                  right: "8%",
                  top: "22%",
                  animationDelay: "1.5s",
                  padding: "12px",
                  gap: 6,
                  border: "1px solid rgba(34,211,238,0.3)",
                }}
              >
                <IconPhone size={26} />
                <span style={{ fontSize: "0.68rem", color: "var(--text-color)", fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Receiver</span>
              </div>

              {/* Floating file icons */}
              {floatingFiles.map((f) => (
                <div
                  key={f.label}
                  className="animate-float glass rounded-xl flex items-center gap-2 px-3 py-1.5"
                  style={{
                    position: "absolute",
                    left: f.x,
                    top: f.y,
                    animationDelay: f.delay,
                    fontSize: "0.7rem",
                    color: f.color,
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "nowrap",
                    border: `1px solid ${f.color}30`,
                  }}
                >
                  {f.icon}
                  <span style={{ color: "var(--text-color)", fontSize: "0.65rem", fontWeight: 600 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section style={{ padding: "70px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p style={{ color: "#6366f1", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>How it works</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-color)" }}>
              Direct File Transfer in 3 Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", title: "Select your files", desc: "Drag & drop or pick files from your device. Any format, any size." },
              { num: "02", title: "Share the PIN", desc: "A unique 6-digit code is generated. Share it or show the QR code." },
              { num: "03", title: "Connect & transfer", desc: "Receiver enters the 6-digit PIN. Instant encrypted connection streams the file directly." },
            ].map((s) => (
              <div key={s.num} className="glass rounded-2xl p-6 relative">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "1.8rem", fontWeight: 800, color: "rgba(99,102,241,0.35)", marginBottom: 12 }}>
                  {s.num}
                </div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.15rem", color: "var(--text-color)", marginBottom: 8 }}>
                  {s.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURES GRID */}
      <section style={{ padding: "70px 24px", background: "rgba(0,0,0,0.15)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p style={{ color: "#22d3ee", fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'JetBrains Mono', monospace", marginBottom: 10 }}>Features</p>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-color)" }}>
              Built for Speed & Privacy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Direct Device Transfer", desc: "Data flows straight from sender to receiver instantly without stopping on cloud servers." },
              { title: "End-to-End Encrypted", desc: "Transfers are protected with browser WebRTC encryption so only you and the receiver have access." },
              { title: "Zero Configuration", desc: "No registration, no accounts, no app downloads required. Works in any modern browser." },
              { title: "Cross-Platform", desc: "Share seamlessly between Windows, macOS, Android, iOS, and Linux." },
            ].map((f, i) => (
              <div key={i} className="glass rounded-2xl p-6 flex gap-4">
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.12)", color: "#6366f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconShield size={22} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-color)", marginBottom: 6 }}>
                    {f.title}
                  </h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", fontFamily: "'Inter', sans-serif", lineHeight: 1.5 }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FAQ ACCORDION */}
      <section style={{ padding: "70px 24px" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "2rem", color: "var(--text-color)" }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="glass rounded-2xl overflow-hidden transition-all"
                  style={{ border: isOpen ? "1px solid rgba(99,102,241,0.4)" : "1px solid var(--border-color)" }}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex justify-between items-center cursor-pointer"
                  >
                    <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: "1.05rem", color: "var(--text-color)" }}>
                      {faq.q}
                    </span>
                    <span style={{ color: "#6366f1", fontSize: "1.2rem", transform: isOpen ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5" style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontFamily: "'Inter', sans-serif", lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer style={{ borderTop: "1px solid var(--border-color)", padding: "32px 24px" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.1rem", color: "var(--text-color)" }}>
            DROVIA
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontFamily: "'Inter', sans-serif" }}>
            © 2025 DROVIA. Transfer. Anywhere. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  )
}
