import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
    const supabase = await createClient()

    const { data: keys, error } = await supabase
      .from("access_keys")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

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
    const supabase = await createClient()

    const accessKey = generateAccessKey()
    const expiresAt = new Date()
    expiresAt.setMonth(expiresAt.getMonth() + expiryMonths)

    const { data, error } = await supabase
      .from("access_keys")
      .insert({
        access_key: accessKey,
        is_active: true,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single()

    if (error) throw error

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
    const supabase = await createClient()

    const { error } = await supabase.from("access_keys").update({ is_active: isActive }).eq("id", id)

    if (error) throw error

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

    const supabase = await createClient()

    const { error } = await supabase.from("access_keys").delete().eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting access key:", error)
    return NextResponse.json({ error: "Failed to delete access key" }, { status: 500 })
  }
}
