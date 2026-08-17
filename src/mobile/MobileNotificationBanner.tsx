import { useEffect, useState } from "react"

export interface MobileNotification {
  id: string
  title: string
  body: string
  type?: "incoming" | "progress" | "complete"
}

interface Props {
  notification: MobileNotification | null
  onDismiss: () => void
  onTap?: () => void
}

export default function MobileNotificationBanner({ notification, onDismiss, onTap }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (notification) {
      setVisible(true)
      const timer = setTimeout(() => {
        setVisible(false)
        setTimeout(onDismiss, 300)
      }, 4500)
      return () => clearTimeout(timer)
    }
  }, [notification, onDismiss])

  if (!notification) return null

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: 12,
        right: 12,
        zIndex: 9999,
        transform: visible ? "translateY(0)" : "translateY(-120%)",
        opacity: visible ? 1 : 0,
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <div
        onClick={onTap}
        style={{
          background: "rgba(19, 20, 31, 0.94)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          borderRadius: 16,
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35), 0 0 20px rgba(99, 102, 241, 0.2)",
          cursor: "pointer",
        }}
      >
        {/* App Badge Icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6366f1, #22d3ee)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Notification Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "0.85rem", color: "#f1f2f7" }}>
              {notification.title}
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.65rem", color: "rgba(241, 242, 247, 0.4)" }}>
              now
            </span>
          </div>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.78rem",
              color: "rgba(241, 242, 247, 0.7)",
              margin: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {notification.body}
          </p>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setVisible(false)
            setTimeout(onDismiss, 300)
          }}
          style={{
            background: "none",
            border: "none",
            color: "rgba(241, 242, 247, 0.4)",
            cursor: "pointer",
            padding: 4,
            display: "flex",
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
