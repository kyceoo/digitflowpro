"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Key, AlertCircle, CheckCircle, Shield, Zap, TrendingUp, MessageCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CryptoPriceRing } from "@/components/crypto-price-ring"
import { AnalysisAnimation } from "@/components/analysis-animation"

export default function LoginPage() {
  const [accessKey, setAccessKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
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
      const deviceFingerprint = `${navigator.userAgent}-${screen.width}x${screen.height}`

      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey: accessKey.trim(), deviceFingerprint }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Authentication failed")
      }

      const session = {
        accessKey: accessKey.trim(),
        deviceFingerprint,
        loginTime: new Date().toISOString(),
      }

      localStorage.setItem("dfp_session", JSON.stringify(session))
      router.push("/")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const whatsappNumber = "17633577737"
  const whatsappMessage = encodeURIComponent(
    "Hi! I'm interested in getting an access key for Digit Flow Pro - The Original Market Analysis System ($150)",
  )

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-96 w-96 animate-pulse rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl delay-1000" />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center p-4">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="mb-6 flex justify-center">
            <div className="animate-bounce">
              <CryptoPriceRing />
            </div>
          </div>

          <h1 className="mb-2 animate-fade-in bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-5xl font-bold text-transparent md:text-6xl">
            Digit Flow Pro
          </h1>
          <p className="mb-4 text-xl font-semibold text-blue-300">The Original Market Analysis System</p>
          <p className="mb-6 text-slate-300">
            Professional-Grade Deriv Market Analysis • Proven Accuracy • Trusted by Traders Worldwide
          </p>

          <div className="mb-8">
            <AnalysisAnimation />
          </div>

          {/* Features Grid */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="animate-slide-up rounded-lg border border-green-500/30 bg-green-500/10 p-4 backdrop-blur-sm">
              <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-400" />
              <h3 className="mb-1 font-bold text-white">99.2% Accuracy</h3>
              <p className="text-sm text-slate-300">
                Advanced algorithms analyze Deriv markets with exceptional precision
              </p>
            </div>
            <div className="animate-slide-up rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 backdrop-blur-sm delay-100">
              <Zap className="mx-auto mb-2 h-8 w-8 text-blue-400" />
              <h3 className="mb-1 font-bold text-white">Real-Time Signals</h3>
              <p className="text-sm text-slate-300">
                Instant pattern recognition and trade signals for all volatility indices
              </p>
            </div>
            <div className="animate-slide-up rounded-lg border border-purple-500/30 bg-purple-500/10 p-4 backdrop-blur-sm delay-200">
              <Shield className="mx-auto mb-2 h-8 w-8 text-purple-400" />
              <h3 className="mb-1 font-bold text-white">100 Devices</h3>
              <p className="text-sm text-slate-300">
                One access key works on up to 100 devices for maximum flexibility
              </p>
            </div>
          </div>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md animate-scale-in border-blue-500/20 bg-slate-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl text-white">
              <Key className="h-6 w-6 text-blue-400" />
              Access Login
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter your access key to unlock professional market analysis
            </CardDescription>
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
                  <Alert variant="destructive" className="animate-shake border-red-500/50 bg-red-500/10">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 font-bold hover:from-blue-700 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Verifying...
                    </span>
                  ) : (
                    "Login to Digit Flow Pro"
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-slate-800 px-2 text-slate-400">Get Started Today</span>
                  </div>
                </div>

                {/* Pricing & WhatsApp Button */}
                <div className="rounded-lg border border-green-500/30 bg-gradient-to-r from-green-500/10 to-blue-500/10 p-4 text-center">
                  <div className="mb-2 text-3xl font-bold text-white">$150</div>
                  <div className="mb-3 text-sm text-slate-300">One-time payment • Lifetime access • 100 devices</div>
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button
                      type="button"
                      className="w-full animate-pulse bg-gradient-to-r from-green-600 to-green-500 font-bold hover:from-green-700 hover:to-green-600"
                    >
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Get Access Key via WhatsApp
                    </Button>
                  </a>
                  <p className="mt-2 text-xs text-slate-400">Instant delivery • 24/7 support</p>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-400" />
            <span>Secure Authentication</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-400" />
            <span>Proven Results</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-purple-400" />
            <span>Original & Authentic</span>
          </div>
        </div>
      </div>
    </div>
  )
}
