"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Shield } from "lucide-react"

const avatarOptions = [
  "/placeholder.svg?height=60&width=60&text=A1",
  "/placeholder.svg?height=60&width=60&text=A2",
  "/placeholder.svg?height=60&width=60&text=A3",
  "/placeholder.svg?height=60&width=60&text=A4",
  "/placeholder.svg?height=60&width=60&text=A5",
  "/placeholder.svg?height=60&width=60&text=A6",
  "/placeholder.svg?height=60&width=60&text=A7",
  "/placeholder.svg?height=60&width=60&text=A8",
]

interface UserSetupModalProps {
  onComplete: (userData: any) => void
}

export function UserSetupModal({ onComplete }: UserSetupModalProps) {
  const [displayName, setDisplayName] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0])

  const handleSubmit = () => {
    if (displayName.trim()) {
      onComplete({
        displayName: displayName.trim(),
        avatar: selectedAvatar,
        createdAt: new Date().toISOString(),
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-dark via-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-10 w-10 text-aegis-primary" />
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground">Aegis Arc</h1>
              <p className="text-sm text-muted-foreground">Constellation Time Flow</p>
            </div>
          </div>
          <p className="text-muted-foreground">Welcome to your futuristic time management experience</p>
        </div>

        <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 space-y-6">
          <div>
            <Label htmlFor="displayName" className="text-foreground font-medium">
              Display Name
            </Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="mt-2 bg-background border-border/50"
            />
          </div>

          <div>
            <Label className="text-foreground font-medium">Choose Avatar</Label>
            <div className="grid grid-cols-4 gap-3 mt-3">
              {avatarOptions.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(avatar)}
                  className={`p-2 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar
                      ? "border-aegis-primary bg-aegis-primary/10"
                      : "border-border/50 hover:border-border"
                  }`}
                >
                  <Avatar className="w-12 h-12 mx-auto">
                    <AvatarImage src={avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-aegis-primary text-white">{index + 1}</AvatarFallback>
                  </Avatar>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!displayName.trim()}
            className="w-full bg-aegis-secondary hover:bg-aegis-secondary/80 font-heading font-semibold"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  )
}
