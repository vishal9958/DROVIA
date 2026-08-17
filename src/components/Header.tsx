import { useState } from "react"
import { DroviaLogo } from "./Logo"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface HeaderProps {
  activeScreen: Screen
  onNavigate: (screen: Screen) => void
}

export default function Header({ activeScreen, onNavigate }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { label: string; screen: Screen }[] = [
    { label: "Send", screen: "send" },
    { label: "Receive", screen: "receive" },
    { label: "Transfers", screen: "history" },
  ]

  const handleNav = (s: Screen) => {
    onNavigate(s)
    setMobileMenuOpen(false)
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: "var(--header-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav("landing")}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
        >
          <DroviaLogo />
        </button>

        {/* Desktop Navigation Links with Spacing */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map(({ label, screen }) => {
            const isActive = activeScreen === screen || (screen === "send" && activeScreen === "transfer-ready") || (screen === "receive" && (activeScreen === "connecting" || activeScreen === "incoming" || activeScreen === "progress"))
            return (
              <button
                key={screen}
                onClick={() => handleNav(screen)}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "6px 16px",
                  borderRadius: 10,
                  color: isActive ? "#6366f1" : "var(--text-muted)",
                  background: isActive ? "rgba(99,102,241,0.12)" : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            )
          })}
        </nav>

        {/* Settings & Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNav("settings")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              borderRadius: 10,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: "0.9rem",
              color: activeScreen === "settings" ? "#6366f1" : "var(--text-muted)",
              background: activeScreen === "settings" ? "rgba(99,102,241,0.12)" : "transparent",
              border: activeScreen === "settings" ? "1px solid rgba(99,102,241,0.25)" : "1px solid transparent",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid var(--border-color)",
              color: "var(--text-color)",
              cursor: "pointer",
            }}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden animate-fade-down"
          style={{
            background: "var(--bg-color)",
            borderBottom: "1px solid var(--border-color)",
            padding: "16px 20px",
          }}
        >
          <div className="flex flex-col gap-2">
            {[
              { label: "Home", screen: "landing" },
              { label: "Send File", screen: "send" },
              { label: "Receive File", screen: "receive" },
              { label: "Transfers History", screen: "history" },
              { label: "Settings", screen: "settings" },
            ].map(({ label, screen }) => (
              <button
                key={screen}
                onClick={() => handleNav(screen as Screen)}
                className="w-full text-left p-3 rounded-xl transition-all"
                style={{
                  background: activeScreen === screen ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.03)",
                  border: activeScreen === screen ? "1px solid rgba(99,102,241,0.3)" : "1px solid var(--border-color)",
                  color: activeScreen === screen ? "#6366f1" : "var(--text-color)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  cursor: "pointer",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
