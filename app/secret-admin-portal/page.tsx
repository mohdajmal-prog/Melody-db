"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Lock, Sprout } from "lucide-react"

export default function SecretAdminPortal() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleAdminLogin = async () => {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (username === "admin" && password === "melody@2025") {
      localStorage.setItem(
        "melody_admin_session",
        JSON.stringify({
          username: "admin",
          role: "admin",
          loginTime: new Date().toISOString(),
        }),
      )
      router.push("/admin")
    } else {
      alert("Invalid credentials")
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url(/images/corn-field-sunset.jpeg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 w-full max-w-md">
        <Card className="shadow-2xl border-2 border-foreground/20">
          <CardHeader className="space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="bg-foreground/10 p-3 rounded-xl">
                <ShieldCheck className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <Sprout className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold">Melody</span>
              </div>
            </div>

            <div className="text-center">
              <CardTitle className="text-2xl mb-2">Admin Portal</CardTitle>
              <CardDescription>Secure access for authorized administrators only</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter admin username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter admin password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <Button
              onClick={handleAdminLogin}
              disabled={isLoading || !username || !password}
              className="w-full"
              size="lg"
            >
              {isLoading ? "Authenticating..." : "Admin Login"}
            </Button>

            <div className="flex items-center justify-center gap-2 pt-4 border-t">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <span className="text-xs text-muted-foreground">Secure Admin Access</span>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4 bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <p className="text-sm text-center text-red-800">
              <strong>Demo Credentials:</strong> username: admin | password: melody@2025
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
