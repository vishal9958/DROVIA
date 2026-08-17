import { useState, useEffect } from "react"
import { IconCopy, IconQr, IconLink, IconCheck } from "../components/Icons"
import { findTransfer, fetchServerStatus, updateTransferStatus } from "../services/transferStore"
import type { FileInfo } from "./SendFile"

type Screen = "landing" | "send" | "transfer-ready" | "receive" | "connecting" | "incoming" | "progress" | "complete" | "history" | "settings"

interface TransferReadyProps {
  onNavigate: (screen: Screen) => void
  files: FileInfo[]
  pin: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB"
}

import { QRCodeSVG } from "qrcode.react"

function QRDisplay({ pin }: { pin: string }) {
  const raw = pin.replace(/\s+/g, "")
  return (
    <div
      style={{
        width: 180,
        height: 180,
        background: "white",
        borderRadius: 14,
        padding: 12,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 0 20px rgba(99,102,241,0.2)",
      }}
    >
      <QRCodeSVG value={raw} size={156} level="M" marginSize={0} fgColor="#0d0e14" bgColor="#ffffff" />
    </div>
  )
}

export default function TransferReady({ onNavigate, files, pin }: TransferReadyProps) {
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)

  const displayPin = pin || "482 913"
  const raw = displayPin.replace(/\s+/g, "")
  const pinParts = [raw.slice(0, 3), raw.slice(3)]

  useEffect(() => {
    // Robust multi-channel status checker — checks both local storage and backend API server across origins/devices
    const checkConnection = async () => {
      const statusPayload = localStorage.getItem("drovia_status_update_" + raw)
      if (statusPayload) {
        try {
          const parsed = JSON.parse(statusPayload)
          if (parsed && parsed.rawPin === raw && (parsed.status === "transferring" || parsed.status === "complete")) {
            onNavigate("progress")
            return
          }
        } catch (e) {}
      }

      const session = findTransfer(raw)
      if (session && session.rawPin === raw && (session.status === "transferring" || session.status === "complete")) {
        onNavigate("progress")
        return
      }

      // Check backend server across different origins/IP addresses!
      const serverStatus = await fetchServerStatus(raw)
      if (serverStatus === "connecting") {
        updateTransferStatus(raw, serverStatus)
        onNavigate("connecting")
      } else if (serverStatus === "transferring" || serverStatus === "complete") {
        updateTransferStatus(raw, serverStatus)
        onNavigate("progress")
      }
    }

    // 1. Polling interval every 300ms
    const interval = setInterval(checkConnection, 300)

    // 2. Browser native cross-tab storage event
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "drovia_status_update_" + raw) {
        checkConnection()
      }
    }
    window.addEventListener("storage", handleStorage)

    // 3. Custom event
    const handleCustom = (e: any) => {
      if (e.detail?.rawPin === raw) checkConnection()
    }
    window.addEventListener("drovia_status_update", handleCustom)

    // 4. BroadcastChannel
    let channel: BroadcastChannel | null = null
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      channel = new BroadcastChannel("drovia_sync")
      channel.onmessage = (e) => {
        if (e.data?.rawPin === raw) checkConnection()
      }
    }

    return () => {
      clearInterval(interval)
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("drovia_status_update", handleCustom)
      if (channel) channel.close()
    }
  }, [raw, onNavigate])

  const handleCopy = () => {
    navigator.clipboard.writeText(raw).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const totalFiles = files.length || 1
  const totalSize = files.reduce((a, f) => a + f.size, 0) || 1.8 * 1024 * 1024 * 1024

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
      <div style={{ width: "100%", maxWidth: 560, padding: "48px 24px" }} className="animate-fade-up">
        <div className="text-center mb-8">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
              color: "#10b981",
              borderRadius: 999,
              padding: "4px 14px",
              fontSize: "0.75rem",
              fontWeight: 600,
              fontFamily: "'JetBrains Mono', monospace",
              marginBottom: 16,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981", display: "inline-block", animation: "connection-pulse 1.5s infinite" }} />
            Transfer ready
          </div>
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: "1.75rem", marginBottom: 6 }}>Your transfer is ready</h1>
          <p style={{ opacity: 0.6, fontSize: "0.9rem", fontFamily: "'Inter', sans-serif" }}>Share this PIN with the receiver</p>
        </div>

        {/* Transfer card */}
        <div
          className="glass-strong rounded-2xl p-8 text-center"
          style={{ borderColor: "rgba(99,102,241,0.2)" }}
        >
          {/* File summary */}
          <div
            className="glass rounded-xl px-4 py-3 flex items-center justify-between mb-8"
            style={{ fontSize: "0.85rem" }}
          >
            <span style={{ opacity: 0.7, fontFamily: "'Inter', sans-serif" }}>
              {totalFiles} file{totalFiles !== 1 ? "s" : ""}
            </span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
              {formatBytes(totalSize)}
            </span>
          </div>

          {/* PIN */}
          {!showQr ? (
            <>
              <p style={{ fontSize: "0.72rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, fontFamily: "'JetBrains Mono', monospace", marginBottom: 16 }}>Transfer PIN</p>
              <div className="flex items-center justify-center gap-4 mb-2">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "var(--text-color)",
                    lineHeight: 1,
                  }}
                >
                  {pinParts[0]}
                </span>
                <span style={{ color: "#6366f1", fontSize: "2rem", fontWeight: 700 }}>-</span>
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "3.5rem",
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: "var(--text-color)",
                    lineHeight: 1,
                  }}
                >
                  {pinParts[1]}
                </span>
              </div>
            </>
          ) : (
            <div className="flex justify-center mb-4">
              <QRDisplay pin={raw} />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mt-8">
            <button
              onClick={handleCopy}
              className="btn-ghost py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
              {copied ? "Copied to clipboard!" : "Copy PIN"}
            </button>
            <button
              onClick={() => setShowQr(!showQr)}
              className="btn-ghost py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              <IconQr size={16} />
              {showQr ? "Show PIN" : "Show QR Code"}
            </button>
          </div>

          {/* Connection status indicator */}
          <div className="mt-8 flex items-center justify-center gap-2">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#6366f1",
                animation: "pulse-ring 2s infinite",
              }}
            />
            <span style={{ opacity: 0.5, fontSize: "0.875rem", fontFamily: "'Inter', sans-serif" }}>
              Waiting for receiver...
            </span>
          </div>
        </div>

        {/* Cancel button */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => onNavigate("send")}
            className="btn-ghost w-full py-3 rounded-xl text-sm font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Cancel Transfer
          </button>
        </div>
      </div>
    </div>
  )
}
