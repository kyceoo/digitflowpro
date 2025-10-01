"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Copy, Plus, Trash2, RefreshCw, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AccessKey {
  id: string
  access_key: string
  is_active: boolean
  device_id: string | null
  last_used_at: string | null
  created_at: string
  expires_at: string | null
}

export default function AdminPage() {
  const [accessKeys, setAccessKeys] = useState<AccessKey[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [expiryMonths, setExpiryMonths] = useState("12")
  const { toast } = useToast()

  useEffect(() => {
    fetchAccessKeys()
  }, [])

  const fetchAccessKeys = async () => {
    try {
      const response = await fetch("/api/admin/access-keys")
      if (response.ok) {
        const data = await response.json()
        setAccessKeys(data.keys)
      }
    } catch (error) {
      console.error("Failed to fetch access keys:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateAccessKey = async () => {
    setGenerating(true)
    try {
      const response = await fetch("/api/admin/access-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expiryMonths: Number.parseInt(expiryMonths) }),
      })

      if (response.ok) {
        const data = await response.json()
        toast({
          title: "Access Key Generated",
          description: `New key: ${data.accessKey}`,
        })
        fetchAccessKeys()
      } else {
        throw new Error("Failed to generate key")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate access key",
        variant: "destructive",
      })
    } finally {
      setGenerating(false)
    }
  }

  const copyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({
      title: "Copied",
      description: "Access key copied to clipboard",
    })
  }

  const toggleKeyStatus = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/admin/access-keys", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      })

      if (response.ok) {
        toast({
          title: "Status Updated",
          description: `Key ${!currentStatus ? "activated" : "deactivated"}`,
        })
        fetchAccessKeys()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update key status",
        variant: "destructive",
      })
    }
  }

  const deleteKey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this access key?")) return

    try {
      const response = await fetch(`/api/admin/access-keys?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Key Deleted",
          description: "Access key has been removed",
        })
        fetchAccessKeys()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete key",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Digit Flow Pro - Admin Panel</h1>
          <p className="text-slate-300">Manage access keys and user permissions</p>
        </div>

        {/* Generate New Key Card */}
        <Card className="mb-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5" />
              Generate New Access Key
            </CardTitle>
            <CardDescription className="text-slate-400">
              Create a new access key for a user. Each key can only be used on one device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="expiry" className="text-slate-300">
                  Expiry (months)
                </Label>
                <Input
                  id="expiry"
                  type="number"
                  min="1"
                  max="24"
                  value={expiryMonths}
                  onChange={(e) => setExpiryMonths(e.target.value)}
                  className="bg-slate-900 border-slate-700 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={generateAccessKey}
                  disabled={generating}
                  className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Generate Key
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Keys List */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Access Keys</CardTitle>
            <CardDescription className="text-slate-400">Total: {accessKeys.length} keys</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-slate-400">Loading...</div>
            ) : accessKeys.length === 0 ? (
              <div className="text-center py-8 text-slate-400">No access keys yet. Generate one to get started.</div>
            ) : (
              <div className="space-y-3">
                {accessKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <code className="text-sm font-mono text-purple-400 break-all">{key.access_key}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(key.access_key)}
                          className="shrink-0 h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                        <Badge variant={key.is_active ? "default" : "secondary"}>
                          {key.is_active ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant={key.device_id ? "outline" : "secondary"}>
                          {key.device_id ? "Device Bound" : "Not Used"}
                        </Badge>
                        {key.expires_at && <span>Expires: {new Date(key.expires_at).toLocaleDateString()}</span>}
                        {key.last_used_at && <span>Last used: {new Date(key.last_used_at).toLocaleDateString()}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleKeyStatus(key.id, key.is_active)}
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        {key.is_active ? "Deactivate" : "Activate"}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteKey(key.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="mt-6 bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-2 text-sm">
            <p>1. Click "Generate Key" to create a new access key</p>
            <p>2. Copy the generated key and share it with the user</p>
            <p>3. The user enters the key on the login page</p>
            <p>4. Once used, the key is bound to that device only</p>
            <p>5. You can deactivate or delete keys at any time</p>
            <p className="text-purple-400 font-semibold mt-4">Contact: +1 (763) 357-7737 for access key requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
