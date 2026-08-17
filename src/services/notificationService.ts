export interface NotificationPayload {
  title: string
  body: string
  icon?: string
  tag?: string
}

class NotificationService {
  private permission: NotificationPermission = "default"

  constructor() {
    if (typeof window !== "undefined" && "Notification" in window) {
      this.permission = Notification.permission
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false
    }

    try {
      const res = await Notification.requestPermission()
      this.permission = res
      return res === "granted"
    } catch (e) {
      return false
    }
  }

  public isSupported(): boolean {
    return typeof window !== "undefined" && "Notification" in window
  }

  public isGranted(): boolean {
    return this.permission === "granted"
  }

  public sendNotification(payload: NotificationPayload) {
    // 1. Device Vibration Haptic Feedback if supported
    if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
      try {
        navigator.vibrate([100, 50, 100])
      } catch (e) {}
    }

    // 2. Browser Native Notification
    if (this.isGranted()) {
      try {
        const notif = new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || "/favicon.ico",
          tag: payload.tag || "drovia_notification",
        })

        notif.onclick = () => {
          window.focus()
          notif.close()
        }
      } catch (e) {
        // Ignore background restrictions
      }
    }
  }

  // Pre-configured notification triggers
  public notifyIncomingFile(fileName: string, senderDevice: string) {
    this.sendNotification({
      title: "📲 Incoming File Transfer",
      body: `${senderDevice} wants to send you "${fileName}". Tap to accept.`,
      tag: "incoming_file",
    })
  }

  public notifyTransferStarted(fileName: string) {
    this.sendNotification({
      title: "⚡ Transfer Started",
      body: `Streaming "${fileName}" directly between your devices...`,
      tag: "transfer_started",
    })
  }

  public notifyTransferComplete(fileName: string) {
    this.sendNotification({
      title: "✅ Transfer Complete!",
      body: `"${fileName}" was successfully received and saved to your device.`,
      tag: "transfer_complete",
    })
  }
}

export const notificationService = new NotificationService()
