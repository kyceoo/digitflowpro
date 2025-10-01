"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { generateDeviceFingerprint, getDeviceId, setDeviceId } from "@/lib/device-fingerprint"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Phone, Key, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showPhone, setShowPhone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    const session = localStorage.getItem("dfp_session")
    if (session) {
      router.push("/")
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Generate device fingerprint
      const deviceFingerprint = generateDeviceFingerprint()
      let deviceId = getDeviceId()

      // Verify access key
      const { data: keyData, error: keyError } = await supabase
        .from("access_keys")
        .select("*")
        .eq("access_key", accessKey.trim())
        .single()

      if (keyError || !keyData) {
        throw new Error("Invalid access key")
      }

      if (!keyData.is_active) {
        throw new Error("This access key has been deactivated")
      }

      if (keyData.expires_at && new Date(keyData.expires_at) < new Date()) {
        throw new Error("This access key has expired")
      }

      // Check if key is already bound to a device
      if (keyData.device_id && keyData.device_id !== deviceId) {
        throw new Error("This access key is already in use on another device")
      }

      // If not bound, bind to this device
      if (!keyData.device_id) {
        deviceId = crypto.randomUUID()
        setDeviceId(deviceId)

        const { error: updateError } = await supabase
          .from("access_keys")
          .update({
            device_id: deviceId,
            device_fingerprint: deviceFingerprint,
            last_used_at: new Date().toISOString(),
          })
          .eq("access_key", accessKey.trim())

        if (updateError) {
          throw new Error("Failed to bind access key to device")
        }
      } else {
        // Update last used
        await supabase
          .from("access_keys")
          .update({
            last_used_at: new Date().toISOString(),
          })
          .eq("access_key", accessKey.trim())
      }

      // Create session
      const session = {
        accessKey: accessKey.trim(),
        deviceId,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("dfp_session", JSON.stringify(session))
      document.cookie = `dfp_session=${JSON.stringify(session)}; path=/; max-age=2592000` // 30 days

      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-blue-500/20 p-4">
              <Key className="h-12 w-12 text-blue-400" />
            </div>
          </div>
          <h1 className="mb-2 text-4xl font-bold text-white">Digit Flow Pro</h1>
          <p className="text-blue-200">Professional Market Analysis Tool</p>
        </div>

        <Card className="border-blue-500/20 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Access Login</CardTitle>
            <CardDescription className="text-slate-300">Enter your access key to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="accessKey" className="text-slate-200">
                    Access Key
                  </Label>
                  <Input
                    id="accessKey"
                    type="text"
                    placeholder="DFP-2024-XXXX-XXX"
                    required
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    className="border-slate-600 bg-slate-700/50 text-white placeholder:text-slate-400"
                  />
                </div>

                {error && (
                  <Alert variant="destructive" className="border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Login"}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Need an access key?</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 hover:text-blue-200"
                  onClick={() => setShowPhone(!showPhone)}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Get Access Key
                </Button>

                {showPhone && (
                  <Alert className="border-blue-500/50 bg-blue-500/10">
                    <Phone className="h-4 w-4 text-blue-400" />
                    <AlertDescription className="text-blue-200">
                      Contact us to get your access key:
                      <br />
                      <a
                        href="tel:+17633577737"
                        className="mt-2 inline-block font-semibold text-blue-300 hover:text-blue-200"
                      >
                        +1 (763) 357-7737
                      </a>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-slate-400">One access key per device • Secure authentication</p>
      </div>
    </div>
  )
}
