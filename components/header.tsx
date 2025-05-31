"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Settings, Shield } from "lucide-react"
import { SettingsModal } from "@/components/settings-modal"

interface HeaderProps {
  user: any
}

export function Header({ user }: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">Aegis Arc</h1>
              <p className="text-xs text-muted-foreground font-body">Constellation Time Flow</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-foreground">{user.displayName}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.displayName} />
                <AvatarFallback className="bg-blue-900 text-white">{user.displayName?.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <SettingsModal open={showSettings} onOpenChange={setShowSettings} />
    </header>
  )
}
