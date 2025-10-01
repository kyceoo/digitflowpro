import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/mysql/db"

interface AccessKey {
  id: number
  access_key: string
  device_fingerprint: string | null
  is_active: boolean
  expires_at: string | null
  last_used_at: string | null
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

    // Check if key has expired
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return NextResponse.json({ error: "Access key has expired" }, { status: 401 })
    }

    // Check device binding
    if (key.device_fingerprint && key.device_fingerprint !== deviceFingerprint) {
      return NextResponse.json({ error: "This access key is already in use on another device" }, { status: 403 })
    }

    // Bind device if not already bound
    if (!key.device_fingerprint) {
      await query("UPDATE access_keys SET device_fingerprint = ?, last_used_at = NOW() WHERE id = ?", [
        deviceFingerprint,
        key.id,
      ])
    } else {
      // Update last used timestamp
      await query("UPDATE access_keys SET last_used_at = NOW() WHERE id = ?", [key.id])
    }

    return NextResponse.json({
      success: true,
      accessKey: key.access_key,
      expiresAt: key.expires_at,
    })
  } catch (error) {
    console.error("Error verifying access key:", error)
    return NextResponse.json({ error: "Failed to verify access key" }, { status: 500 })
  }
}
