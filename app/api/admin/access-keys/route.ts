import { type NextRequest, NextResponse } from "next/server"
import { query, queryOne } from "@/lib/mysql/db"

interface AccessKey {
  id: number
  access_key: string
  device_fingerprint: string | null
  is_active: boolean
  expires_at: string | null
  last_used_at: string | null
  created_at: string
  updated_at: string
}

// Generate a random access key
function generateAccessKey(): string {
  const prefix = "DFP"
  const year = new Date().getFullYear()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return `${prefix}-${year}-${random}-${timestamp}`
}

// GET - Fetch all access keys
export async function GET() {
  try {
    const keys = await query<AccessKey>("SELECT * FROM access_keys ORDER BY created_at DESC")

    return NextResponse.json({ keys })
  } catch (error) {
    console.error("Error fetching access keys:", error)
    return NextResponse.json({ error: "Failed to fetch access keys" }, { status: 500 })
  }
}

// POST - Generate new access key
export async function POST(request: NextRequest) {
  try {
    const { expiryMonths = 12 } = await request.json()

    const accessKey = generateAccessKey()
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

    await query("INSERT INTO access_keys (access_key, is_active, expires_at) VALUES (?, TRUE, ?)", [
      accessKey,
      expiresAt.toISOString().slice(0, 19).replace("T", " "),
    ])

    const data = await queryOne<AccessKey>("SELECT * FROM access_keys WHERE access_key = ?", [accessKey])

    return NextResponse.json({ accessKey, data })
  } catch (error) {
    console.error("Error generating access key:", error)
    return NextResponse.json({ error: "Failed to generate access key" }, { status: 500 })
  }
}

// PATCH - Update access key status
export async function PATCH(request: NextRequest) {
  try {
    const { id, isActive } = await request.json()

    await query("UPDATE access_keys SET is_active = ? WHERE id = ?", [isActive, id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating access key:", error)
    return NextResponse.json({ error: "Failed to update access key" }, { status: 500 })
  }
}

// DELETE - Remove access key
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Access key ID required" }, { status: 400 })
    }

    await query("DELETE FROM access_keys WHERE id = ?", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting access key:", error)
    return NextResponse.json({ error: "Failed to delete access key" }, { status: 500 })
  }
}
