"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Square, Clock } from "lucide-react"

export function TimeTracker() {
  const [isTracking, setIsTracking] = useState(false)
  const [trackingType, setTrackingType] = useState<string>("")
  const [elapsedTime, setElapsedTime] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isTracking && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTracking, startTime])

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStart = () => {
    if (trackingType) {
      setIsTracking(true)
      setStartTime(Date.now())
      setElapsedTime(0)
    }
  }

  const handleStop = () => {
    setIsTracking(false)
    setStartTime(null)
    setElapsedTime(0)
    setTrackingType("")
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="bg-card/90 backdrop-blur-sm border-border/50 shadow-lg">
        <CardContent className="p-4">
          {!isTracking ? (
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <Select value={trackingType} onValueChange={setTrackingType}>
                <SelectTrigger className="w-32 bg-background border-border/50">
                  <SelectValue placeholder="Activity" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleStart}
                disabled={!trackingType}
                className="bg-aegis-secondary hover:bg-aegis-secondary/80"
              >
                <Play className="h-4 w-4 mr-1" />
                Start
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-aegis-secondary rounded-full animate-pulse-glow" />
                <span className="text-sm font-medium text-foreground">
                  {trackingType.charAt(0).toUpperCase() + trackingType.slice(1)}
                </span>
              </div>
              <div className="font-mono text-sm text-foreground">{formatTime(elapsedTime)}</div>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleStop}
                className="bg-aegis-accent hover:bg-aegis-accent/80"
              >
                <Square className="h-4 w-4 mr-1" />
                Stop
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
