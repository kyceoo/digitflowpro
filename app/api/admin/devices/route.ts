import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/mysql/db"

interface Device {
  id: number
  access_key: string
  device_fingerprint: string
  device_name: string
  first_used_at: string
  last_used_at: string
  is_active: boolean
}

// GET - Fetch all devices for an access key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const accessKeyId = searchParams.get("accessKeyId")

    if (!accessKeyId) {
      return NextResponse.json({ error: "Access key ID required" }, { status: 400 })
    }

    const devices = await query<Device>(
      `SELECT d.*, ak.access_key 
       FROM access_key_devices d
       JOIN access_keys ak ON d.access_key_id = ak.id
       WHERE d.access_key_id = ?
       ORDER BY d.last_used_at DESC`,
      [accessKeyId],
    )

    return NextResponse.json({ devices })
  } catch (error) {
    console.error("Error fetching devices:", error)
    return NextResponse.json({ error: "Failed to fetch devices" }, { status: 500 })
  }
}

// DELETE - Remove a device
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const deviceId = searchParams.get("id")

    if (!deviceId) {
      return NextResponse.json({ error: "Device ID required" }, { status: 400 })
    }

    await query("DELETE FROM access_key_devices WHERE id = ?", [deviceId])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting device:", error)
    return NextResponse.json({ error: "Failed to delete device" }, { status: 500 })
  }
}
