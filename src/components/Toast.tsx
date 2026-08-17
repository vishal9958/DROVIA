import { useEffect, useState } from "react"
import { IconCheck, IconX } from "./Icons"

export interface ToastData {
  id: string
  message: string
  type: "success" | "error" | "info"
}

interface ToastProps {
  toast: ToastData
  onRemove: (id: string) => void
}

function Toast({ toast, onRemove }: ToastProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    const t = setTimeout(() => {
      setVisible(false)
      setTimeout(() => onRemove(toast.id), 300)
    }, 3000)
    return () => clearTimeout(t)
  }, [toast.id, onRemove])

  const colors = {
    success: { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", icon: "#10b981" },
    error: { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", icon: "#ef4444" },
    info: { bg: "rgba(99,102,241,0.12)", border: "rgba(99,102,241,0.25)", icon: "#818cf8" },
  }
  const c = colors[toast.type]

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        background: c.bg,
        border: `1px solid ${c.border}`,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        maxWidth: 320,
        width: "max-content",
      }}
    >
      <div style={{ color: c.icon, flexShrink: 0 }}>
        {toast.type === "success" ? <IconCheck size={16} /> : toast.type === "error" ? <IconX size={16} /> : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        )}
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", color: "#f1f2f7" }}>{toast.message}</span>
    </div>
  )
}

export function ToastContainer({ toasts, onRemove }: { toasts: ToastData[]; onRemove: (id: string) => void }) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        alignItems: "flex-end",
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "all" }}>
          <Toast toast={t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}
