"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { FlowCalendarView } from "@/components/flow-calendar-view"
import { TeamView } from "@/components/team-view"
import { TimeTracker } from "@/components/time-tracker"
import { UserSetupModal } from "@/components/user-setup-modal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ConstellationTimeFlow() {
  const [activeTab, setActiveTab] = useState("flow")
  const [user, setUser] = useState<any>(null)
  const [showSetup, setShowSetup] = useState(false)

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem("constellation-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    } else {
      setShowSetup(true)
    }
  }, [])

  const handleUserSetup = (userData: any) => {
    setUser(userData)
    localStorage.setItem("constellation-user", JSON.stringify(userData))
    setShowSetup(false)
  }

  if (showSetup) {
    return <UserSetupModal onComplete={handleUserSetup} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aegis-dark via-slate-900 to-slate-800">
      <Header user={user} />

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-card/50 backdrop-blur-sm">
            <TabsTrigger
              value="flow"
              className="font-heading font-semibold data-[state=active]:bg-aegis-primary data-[state=active]:text-white"
            >
              Flow & Calendar
            </TabsTrigger>
            <TabsTrigger
              value="team"
              className="font-heading font-semibold data-[state=active]:bg-aegis-primary data-[state=active]:text-white"
            >
              Team
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flow" className="space-y-6">
            <FlowCalendarView />
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <TeamView />
          </TabsContent>
        </Tabs>
      </main>

      <TimeTracker />
    </div>
  )
}
