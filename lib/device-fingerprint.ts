// Generate a unique device fingerprint
export function generateDeviceFingerprint(): string {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (ctx) {
    ctx.textBaseline = "top"
    ctx.font = "14px Arial"
    ctx.fillText("Device Fingerprint", 2, 2)
  }

  const fingerprint = {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    screenResolution: `${screen.width}x${screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    canvasFingerprint: canvas.toDataURL(),
  }

  return btoa(JSON.stringify(fingerprint))
}

export function getDeviceId(): string | null {
  return localStorage.getItem("dfp_device_id")
}

export function setDeviceId(deviceId: string): void {
  localStorage.setItem("dfp_device_id", deviceId)
}
