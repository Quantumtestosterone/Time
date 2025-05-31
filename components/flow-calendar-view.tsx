"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { WeeklyFlowBar } from "@/components/weekly-flow-bar"
import { CalendarGrid } from "@/components/calendar-grid"
import { BlockEditModal } from "@/components/block-edit-modal"
import { BlockTemplates, type BlockTemplate } from "@/components/block-templates"
import { Badge } from "@/components/ui/badge"

export function FlowCalendarView() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [timeBlocks, setTimeBlocks] = useState<any[]>([])
  const [selectedBlock, setSelectedBlock] = useState<any>(null)
  const [showBlockModal, setShowBlockModal] = useState(false)
  const [activeBlock, setActiveBlock] = useState<BlockTemplate | null>(null)
  const [completeDays, setCompleteDays] = useState<number[]>([])

  // Calculate week range
  const getWeekRange = (date: Date) => {
    const start = new Date(date)
    start.setDate(date.getDate() - date.getDay() + 1) // Monday
    const end = new Date(start)
    end.setDate(start.getDate() + 6) // Sunday
    return { start, end }
  }

  const { start: weekStart, end: weekEnd } = getWeekRange(currentWeek)

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const formatWeekRange = () => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
    return `${weekStart.toLocaleDateString("en-US", options)} - ${weekEnd.toLocaleDateString("en-US", options)}, ${weekEnd.getFullYear()}`
  }

  const handleBlockCreate = (day: number, timeSlot: number) => {
    if (activeBlock) {
      // Check for collisions with existing blocks
      const collidingBlocks = timeBlocks.filter(
        (block) =>
          block.day === day &&
          ((timeSlot >= block.timeSlot && timeSlot < block.timeSlot + block.duration) ||
            (timeSlot + activeBlock.duration > block.timeSlot && timeSlot < block.timeSlot + block.duration)),
      )

      // Handle collisions
      if (collidingBlocks.length > 0) {
        // Create a new array of blocks with collisions resolved
        let updatedBlocks = [...timeBlocks]

        collidingBlocks.forEach((block) => {
          // If the new block starts before the existing block
          if (timeSlot < block.timeSlot) {
            // Adjust the existing block's start and duration
            const overlap = timeSlot + activeBlock.duration - block.timeSlot
            if (overlap >= block.duration) {
              // The existing block is completely covered, remove it
              updatedBlocks = updatedBlocks.filter((b) => b.id !== block.id)
            } else {
              // Adjust the existing block
              updatedBlocks = updatedBlocks.map((b) =>
                b.id === block.id
                  ? {
                      ...b,
                      timeSlot: block.timeSlot + overlap,
                      duration: block.duration - overlap,
                    }
                  : b,
              )
            }
          }
          // If the new block starts within the existing block
          else {
            // Split or trim the existing block
            const overlapStart = timeSlot
            const overlapEnd = Math.min(timeSlot + activeBlock.duration, block.timeSlot + block.duration)
            const overlap = overlapEnd - overlapStart

            if (overlapStart === block.timeSlot) {
              // The new block starts at the same position as the existing block
              updatedBlocks = updatedBlocks.map((b) =>
                b.id === block.id
                  ? {
                      ...b,
                      timeSlot: timeSlot + activeBlock.duration,
                      duration: block.duration - overlap,
                    }
                  : b,
              )
            } else {
              // The new block is in the middle of the existing block, split it
              const firstPart = {
                ...block,
                duration: overlapStart - block.timeSlot,
              }

              const secondPart = {
                ...block,
                id: block.id + "-split",
                timeSlot: overlapEnd,
                duration: block.timeSlot + block.duration - overlapEnd,
              }

              // Remove the original block and add the two parts if they have valid durations
              updatedBlocks = updatedBlocks.filter((b) => b.id !== block.id)
              if (firstPart.duration > 0) updatedBlocks.push(firstPart)
              if (secondPart.duration > 0) updatedBlocks.push(secondPart)
            }
          }
        })

        // Add the new block
        const newBlock = {
          id: Date.now(),
          day,
          timeSlot,
          duration: activeBlock.duration,
          type: activeBlock.type,
          note: activeBlock.note || activeBlock.name,
        }

        setTimeBlocks([...updatedBlocks, newBlock])
      } else {
        // No collisions, simply add the new block
        const newBlock = {
          id: Date.now(),
          day,
          timeSlot,
          duration: activeBlock.duration,
          type: activeBlock.type,
          note: activeBlock.note || activeBlock.name,
        }

        setTimeBlocks([...timeBlocks, newBlock])
      }

      // Check if the day is now complete
      checkDayCompletion(day)
    } else {
      // Default behavior when no template is selected
      const newBlock = {
        id: Date.now(),
        day,
        timeSlot,
        duration: 1, // 15 minutes
        type: "unassigned",
        note: "",
      }
      setTimeBlocks([...timeBlocks, newBlock])
      setSelectedBlock(newBlock)
      setShowBlockModal(true)
    }
  }

  const handleBlockUpdate = (updatedBlock: any) => {
    setTimeBlocks((blocks) => blocks.map((block) => (block.id === updatedBlock.id ? updatedBlock : block)))
    setShowBlockModal(false)
    setSelectedBlock(null)
    checkDayCompletion(updatedBlock.day)
  }

  const handleBlockDelete = (blockId: number) => {
    const blockToDelete = timeBlocks.find((block) => block.id === blockId)
    if (blockToDelete) {
      setTimeBlocks((blocks) => blocks.filter((block) => block.id !== blockId))
      checkDayCompletion(blockToDelete.day)
    }
    setShowBlockModal(false)
    setSelectedBlock(null)
  }

  const handleTemplateSelect = (template: BlockTemplate) => {
    setActiveBlock(activeBlock?.id === template.id ? null : template)
  }

  // Check if a day is completely allocated
  const checkDayCompletion = (day: number) => {
    // Get all blocks for this day
    const dayBlocks = timeBlocks.filter((block) => block.day === day && block.type !== "unassigned")

    // Create an array to track allocated slots (6 AM to 12 AM = 18 hours * 4 slots = 72 slots)
    const allocatedSlots = Array(72).fill(false)

    // Mark all slots that have blocks
    dayBlocks.forEach((block) => {
      for (let i = block.timeSlot; i < block.timeSlot + block.duration; i++) {
        if (i < allocatedSlots.length) {
          allocatedSlots[i] = true
        }
      }
    })

    // Check if all slots from 8 AM to 10 PM are allocated (8 AM = slot 8, 10 PM = slot 64)
    const coreSlots = allocatedSlots.slice(8, 64)
    const isComplete = coreSlots.every((slot) => slot)

    // Update the completeDays state
    if (isComplete && !completeDays.includes(day)) {
      setCompleteDays([...completeDays, day])
    } else if (!isComplete && completeDays.includes(day)) {
      setCompleteDays(completeDays.filter((d) => d !== day))
    }
  }

  return (
    <div className="space-y-6">
      {/* Block Templates */}
      <BlockTemplates onCreateBlock={handleTemplateSelect} />

      {/* Weekly Flow Bar */}
      <WeeklyFlowBar timeBlocks={timeBlocks} />

      {/* Date Navigator */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-heading text-xl text-foreground">Weekly Schedule</CardTitle>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("prev")}
                className="border-border/50 hover:bg-muted/50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-heading font-semibold text-foreground min-w-[200px] text-center">
                {formatWeekRange()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateWeek("next")}
                className="border-border/50 hover:bg-muted/50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Active Block Indicator */}
          {activeBlock && (
            <div className="mt-4 flex items-center justify-between bg-card/80 p-3 rounded-lg border border-border/50">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-sm ${
                    activeBlock.type === "work"
                      ? "bg-blue-600"
                      : activeBlock.type === "study"
                        ? "bg-green-500"
                        : "bg-gray-500"
                  }`}
                />
                <div>
                  <div className="text-sm font-medium text-foreground">{activeBlock.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {activeBlock.duration * 15} minutes • Click on calendar to place
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveBlock(null)}
                className="border-border/50 hover:bg-muted/50"
              >
                Cancel
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="text-sm text-muted-foreground">Day Status:</div>
            {Array.from({ length: 7 }).map((_, index) => (
              <Badge
                key={index}
                variant={completeDays.includes(index) ? "default" : "outline"}
                className={
                  completeDays.includes(index)
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "border-border/50 text-muted-foreground"
                }
              >
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                {completeDays.includes(index) && <CheckCircle className="ml-1 h-3 w-3" />}
              </Badge>
            ))}
          </div>

          <CalendarGrid
            weekStart={weekStart}
            timeBlocks={timeBlocks}
            onBlockCreate={handleBlockCreate}
            onBlockSelect={(block) => {
              setSelectedBlock(block)
              setShowBlockModal(true)
            }}
            onBlockUpdate={setTimeBlocks}
            activeBlock={activeBlock}
            completeDays={completeDays}
          />
        </CardContent>
      </Card>

      {/* Block Edit Modal */}
      {showBlockModal && selectedBlock && (
        <BlockEditModal
          block={selectedBlock}
          onUpdate={handleBlockUpdate}
          onDelete={handleBlockDelete}
          onClose={() => {
            setShowBlockModal(false)
            setSelectedBlock(null)
          }}
        />
      )}
    </div>
  )
}
