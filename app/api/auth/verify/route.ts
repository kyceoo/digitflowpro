import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/mysql/db"

interface AccessKey {
  id: number
  access_key: string
  device_limit: number
  is_active: boolean
  expires_at: string | null
  last_used_at: string | null
}

interface DeviceCount {
  device_count: number
}

export async function POST(request: NextRequest) {
  try {
    const { accessKey, deviceFingerprint } = await request.json()

    if (!accessKey || !deviceFingerprint) {
      return NextResponse.json({ error: "Access key and device fingerprint required" }, { status: 400 })
    }

    const key = await queryOne<AccessKey>("SELECT * FROM access_keys WHERE access_key = ? AND is_active = TRUE", [
      accessKey,
    ])

    if (!key) {
      return NextResponse.json({ error: "Invalid or inactive access key" }, { status: 401 })
    }

    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return NextResponse.json({ error: "Access key has expired" }, { status: 401 })
    }

    const existingDevice = await queryOne(
      "SELECT * FROM access_key_devices WHERE access_key_id = ? AND device_fingerprint = ?",
      [key.id, deviceFingerprint],
    )

    if (existingDevice) {
      // Device already registered, update last used
      await query(
        "UPDATE access_key_devices SET last_used_at = NOW() WHERE access_key_id = ? AND device_fingerprint = ?",
        [key.id, deviceFingerprint],
      )
      await query("UPDATE access_keys SET last_used_at = NOW() WHERE id = ?", [key.id])

      return NextResponse.json({
        success: true,
        accessKey: key.access_key,
        expiresAt: key.expires_at,
      })
    }

    const deviceCountResult = await queryOne<DeviceCount>(
      "SELECT COUNT(*) as device_count FROM access_key_devices WHERE access_key_id = ? AND is_active = TRUE",
      [key.id],
    )

    const deviceCount = deviceCountResult?.device_count || 0

    if (deviceCount >= key.device_limit) {
      return NextResponse.json(
        { error: `Device limit reached. This access key supports up to ${key.device_limit} devices.` },
        { status: 403 },
      )
    }

    await query("INSERT INTO access_key_devices (access_key_id, device_fingerprint, device_name) VALUES (?, ?, ?)", [
      key.id,
      deviceFingerprint,
      `Device ${deviceCount + 1}`,
    ])

    await query("UPDATE access_keys SET last_used_at = NOW() WHERE id = ?", [key.id])

    return NextResponse.json({
      success: true,
      accessKey: key.access_key,
      expiresAt: key.expires_at,
      devicesUsed: deviceCount + 1,
      devicesLimit: key.device_limit,
    })
  } catch (error) {
    console.error("Error verifying access key:", error)
    return NextResponse.json({ error: "Failed to verify access key" }, { status: 500 })
  }
}
