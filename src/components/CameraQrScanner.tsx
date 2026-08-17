import { useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import { IconCamera } from "./Icons"

interface CameraQrScannerProps {
  onScanSuccess: (pin: string) => void
  onCancel: () => void
}

export function CameraQrScanner({ onScanSuccess, onCancel }: CameraQrScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [streamStatus, setStreamStatus] = useState<"requesting" | "active" | "error">("requesting")
  const [errorMessage, setErrorMessage] = useState("")
  const [detectedPin, setDetectedPin] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    let isMounted = true
    let scanInterval: any = null

    async function startCamera() {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error("Camera API is not supported in this browser environment.")
        }

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
        })

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => {})
        }

        setStreamStatus("active")

        // Start jsQR scanning loop at 15fps
        scanInterval = setInterval(() => {
          if (!isMounted || !videoRef.current || videoRef.current.readyState !== 4) return
          const video = videoRef.current
          const width = video.videoWidth
          const height = video.videoHeight
          if (!width || !height) return

          let canvas = canvasRef.current
          if (!canvas) {
            canvas = document.createElement("canvas")
            canvasRef.current = canvas
          }
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext("2d", { willReadFrequently: true })
          if (!ctx) return

          ctx.drawImage(video, 0, 0, width, height)
          const imageData = ctx.getImageData(0, 0, width, height)
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          })

          if (code && code.data) {
            const rawValue = code.data
            const match = rawValue.match(/\b\d{6}\b/) || rawValue.match(/\b\d{3}\s?\d{3}\b/)
            if (match) {
              const pin = match[0].replace(/\s+/g, "")
              handlePinFound(pin)
            }
          }
        }, 150)
      } catch (err: any) {
        if (!isMounted) return
        setStreamStatus("error")
        setErrorMessage(err.message || "Camera access permission was denied or unavailable.")
      }
    }

    startCamera()

    return () => {
      isMounted = false
      if (scanInterval) clearInterval(scanInterval)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [])

  const handlePinFound = (pin: string) => {
    if (detectedPin) return
    setDetectedPin(pin)
    if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
    }
    setTimeout(() => {
      onScanSuccess(pin)
    }, 400)
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Live Video Camera Box */}
      <div
        className="glass rounded-2xl overflow-hidden relative flex items-center justify-center"
        style={{
          width: "100%",
          maxWidth: 320,
          height: 320,
          background: "#000000",
          border: detectedPin ? "2px solid #10b981" : "2px solid rgba(99,102,241,0.4)",
          boxShadow: detectedPin ? "0 0 30px rgba(16,185,129,0.4)" : "0 0 30px rgba(99,102,241,0.2)",
        }}
      >
        {/* Real Live Video Stream */}
        <video
          ref={videoRef}
          playsInline
          muted
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: streamStatus === "active" ? "block" : "none",
          }}
        />

        {/* Status Overlay when requesting or error */}
        {streamStatus === "requesting" && (
          <div className="flex flex-col items-center gap-3 text-center p-6" style={{ color: "white" }}>
            <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #6366f1", borderTopColor: "transparent", animation: "spin-slow 1s linear infinite" }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.85rem", opacity: 0.8 }}>Starting camera stream...</span>
          </div>
        )}

        {streamStatus === "error" && (
          <div className="flex flex-col items-center gap-3 text-center p-6 text-red-400">
            <IconCamera size={32} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.8rem", color: "#ef4444" }}>
              {errorMessage || "Camera access required"}
            </span>
          </div>
        )}

        {/* Active QR Frame Overlay */}
        {streamStatus === "active" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Corner brackets */}
            <div style={{ width: 220, height: 220, position: "relative" }}>
              {[
                { top: 0, left: 0, borderRight: "none", borderBottom: "none" },
                { top: 0, right: 0, borderLeft: "none", borderBottom: "none" },
                { bottom: 0, left: 0, borderRight: "none", borderTop: "none" },
                { bottom: 0, right: 0, borderLeft: "none", borderTop: "none" },
              ].map((pos, i) => (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    width: 24,
                    height: 24,
                    borderColor: detectedPin ? "#10b981" : "#6366f1",
                    borderStyle: "solid",
                    borderWidth: 3,
                    borderRadius: 4,
                    ...pos,
                  }}
                />
              ))}

              {/* Animated Scan Line */}
              {!detectedPin && (
                <div
                  style={{
                    position: "absolute",
                    left: 8,
                    right: 8,
                    height: 2,
                    background: "linear-gradient(90deg, transparent, #6366f1, #22d3ee, transparent)",
                    top: "50%",
                    borderRadius: 1,
                    animation: "float 2s ease-in-out infinite",
                    boxShadow: "0 0 10px rgba(99,102,241,0.8)",
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* Success Banner when PIN detected */}
        {detectedPin && (
          <div className="absolute inset-0 bg-emerald-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
            <span className="text-3xl mb-2">✓</span>
            <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#10b981" }}>
              PIN Scanned: {detectedPin}
            </span>
          </div>
        )}
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "0.825rem", color: "var(--text-muted)", marginTop: 16, textAlign: "center" }}>
        {streamStatus === "active" ? "Point camera at the sender's QR code" : "Camera status: " + streamStatus}
      </p>

      <button
        onClick={onCancel}
        className="btn-ghost w-full py-3 rounded-xl text-sm font-medium mt-6"
      >
        Enter PIN manually
      </button>
    </div>
  )
}
