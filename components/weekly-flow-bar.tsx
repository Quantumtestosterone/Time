"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeeklyFlowBarProps {
  timeBlocks: any[]
}

export function WeeklyFlowBar({ timeBlocks }: WeeklyFlowBarProps) {
  const calculateHours = () => {
    const totals = { work: 0, study: 0, life: 0 }

    timeBlocks.forEach((block) => {
      if (block.type in totals) {
        totals[block.type as keyof typeof totals] += block.duration * 0.25 // 15 min = 0.25 hours
      }
    })

    return totals
  }

  const { work, study, life } = calculateHours()
  const total = work + study + life

  const getPercentage = (value: number) => (total > 0 ? (value / total) * 100 : 0)

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <CardTitle className="font-heading text-lg text-foreground">Weekly Flow Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Flow Bar */}
          <div className="h-8 bg-muted/30 rounded-lg overflow-hidden flex">
            <div
              className="bg-aegis-work transition-all duration-500 ease-out"
              style={{ width: `${getPercentage(work)}%` }}
            />
            <div
              className="bg-aegis-secondary transition-all duration-500 ease-out"
              style={{ width: `${getPercentage(study)}%` }}
            />
            <div
              className="bg-aegis-life transition-all duration-500 ease-out"
              style={{ width: `${getPercentage(life)}%` }}
            />
          </div>

          {/* Legend */}
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-aegis-work rounded-sm"></div>
              <span className="text-blue-200">Work: {work.toFixed(1)}h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-aegis-secondary rounded-sm"></div>
              <span className="text-green-200">Study: {study.toFixed(1)}h</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-aegis-life rounded-sm"></div>
              <span className="text-gray-200">Life: {life.toFixed(1)}h</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
