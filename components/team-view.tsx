"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"

// Mock team data
const mockTeamMembers = [
  {
    id: 1,
    name: "Alex Chen",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
    role: "Designer",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "busy",
    role: "Developer",
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
    role: "Manager",
  },
]

const mockTeamSchedule = [
  { memberId: 1, day: 0, timeSlot: 8, duration: 4, type: "work", note: "Design Review" },
  { memberId: 1, day: 0, timeSlot: 16, duration: 2, type: "study", note: "UX Research" },
  { memberId: 2, day: 0, timeSlot: 8, duration: 6, type: "work", note: "Development Sprint" },
  { memberId: 2, day: 1, timeSlot: 10, duration: 3, type: "work", note: "Code Review" },
  { memberId: 3, day: 0, timeSlot: 12, duration: 2, type: "work", note: "Team Meeting" },
  { memberId: 3, day: 1, timeSlot: 8, duration: 4, type: "work", note: "Planning Session" },
]

export function TeamView() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-aegis-secondary"
      case "busy":
        return "bg-aegis-accent"
      case "away":
        return "bg-aegis-life"
      default:
        return "bg-muted"
    }
  }

  const findOverlaps = () => {
    const overlaps: any[] = []

    mockTeamSchedule.forEach((block1, i) => {
      mockTeamSchedule.slice(i + 1).forEach((block2) => {
        if (
          block1.day === block2.day &&
          block1.type === block2.type &&
          block1.timeSlot < block2.timeSlot + block2.duration &&
          block2.timeSlot < block1.timeSlot + block1.duration
        ) {
          overlaps.push({
            day: block1.day,
            startSlot: Math.max(block1.timeSlot, block2.timeSlot),
            endSlot: Math.min(block1.timeSlot + block1.duration, block2.timeSlot + block2.duration),
            type: block1.type,
            members: [block1.memberId, block2.memberId],
          })
        }
      })
    })

    return overlaps
  }

  const overlaps = findOverlaps()

  return (
    <div className="space-y-6">
      {/* Team Roster */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-foreground flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Team Members</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockTeamMembers.map((member) => (
              <div
                key={member.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedMember === member.id
                    ? "border-aegis-primary bg-aegis-primary/10"
                    : "border-border/50 hover:border-border"
                }`}
                onClick={() => setSelectedMember(selectedMember === member.id ? null : member.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                      <AvatarFallback className="bg-aegis-primary text-white">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(member.status)}`}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaboration Opportunities */}
      {overlaps.length > 0 && (
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="font-heading text-xl text-foreground flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Collaboration Opportunities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overlaps.map((overlap, index) => (
                <div key={index} className="p-3 rounded-lg bg-aegis-secondary/10 border border-aegis-secondary/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2">
                        {overlap.type.charAt(0).toUpperCase() + overlap.type.slice(1)} Session
                      </Badge>
                      <p className="text-sm text-foreground">
                        {overlap.members
                          .map((id: number) => mockTeamMembers.find((m) => m.id === id)?.name)
                          .join(" & ")}{" "}
                        have overlapping {overlap.type} time
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-aegis-secondary">
                        {Math.floor(overlap.startSlot / 4) + 6}:00 - {Math.floor(overlap.endSlot / 4) + 6}:00
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][overlap.day]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Schedule Overview */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="font-heading text-xl text-foreground">Team Schedule Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Team calendar grid will be displayed here</p>
            <p className="text-sm">Similar to personal calendar but showing all team members</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
