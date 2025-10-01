import { type NextRequest, NextResponse } from "next/server"
import { queryOne } from "@/lib/mysql/db"

interface AccessKey {
  id: number
  access_key: string
  device_fingerprint: string | null
  is_active: boolean
  expires_at: string | null
}

export async function POST(request: NextRequest) {
  try {
    const { accessKey, deviceFingerprint } = await request.json()

    if (!accessKey || !deviceFingerprint) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    const key = await queryOne<AccessKey>(
      "SELECT * FROM access_keys WHERE access_key = ? AND device_fingerprint = ? AND is_active = TRUE",
      [accessKey, deviceFingerprint],
    )

    if (!key) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    // Check if key has expired
    if (key.expires_at && new Date(key.expires_at) < new Date()) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("Error checking authentication:", error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
}
