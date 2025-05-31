"use client"

import type React from "react"
import { useState } from "react"
import type { BlockTemplate } from "@/components/block-templates"

interface CalendarGridProps {
  weekStart: Date
  timeBlocks: any[]
  onBlockCreate: (day: number, timeSlot: number) => void
  onBlockSelect: (block: any) => void
  onBlockUpdate: (blocks: any[]) => void
  activeBlock: BlockTemplate | null
  completeDays: number[]
}

export function CalendarGrid({
  weekStart,
  timeBlocks,
  onBlockCreate,
  onBlockSelect,
  onBlockUpdate,
  activeBlock,
  completeDays,
}: CalendarGridProps) {
  const [draggedBlock, setDraggedBlock] = useState<any>(null)
  const [resizing, setResizing] = useState<any>(null)

  // Generate time slots (6 AM to 12 AM = 18 hours * 4 slots = 72 slots)
  const timeSlots = Array.from({ length: 72 }, (_, i) => {
    const hour = Math.floor(i / 4) + 6
    const minute = (i % 4) * 15
    return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`
  })

  // Generate days of the week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return {
      date,
      dayName: date.toLocaleDateString("en-US", { weekday: "short" }),
      dayNumber: date.getDate(),
      isComplete: completeDays.includes(i),
    }
  })

  const getBlocksForSlot = (day: number, timeSlot: number) => {
    return timeBlocks.filter(
      (block) => block.day === day && timeSlot >= block.timeSlot && timeSlot < block.timeSlot + block.duration,
    )
  }

  const handleSlotClick = (day: number, timeSlot: number) => {
    const existingBlocks = getBlocksForSlot(day, timeSlot)
    if (existingBlocks.length === 0 || activeBlock) {
      onBlockCreate(day, timeSlot)
    }
  }

  const handleBlockClick = (block: any, e: React.MouseEvent) => {
    e.stopPropagation()
    onBlockSelect(block)
  }

  const handleBlockResize = (block: any, newDuration: number) => {
    const updatedBlocks = timeBlocks.map((b) => (b.id === block.id ? { ...b, duration: Math.max(1, newDuration) } : b))
    onBlockUpdate(updatedBlocks)
  }

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 gap-px bg-border/30 rounded-t-lg overflow-hidden">
          <div className="bg-card p-3 text-center">
            <span className="text-sm font-medium text-muted-foreground">Time</span>
          </div>
          {weekDays.map((day, index) => (
            <div
              key={index}
              className={`bg-card p-3 text-center ${
                day.isComplete ? "bg-green-900/10 border-l-2 border-l-green-600" : ""
              }`}
            >
              <div className="text-sm font-medium text-foreground">{day.dayName}</div>
              <div className="text-xs text-muted-foreground">{day.dayNumber}</div>
            </div>
          ))}
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-8 gap-px bg-border/30">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="contents">
              {/* Time Label */}
              <div className="bg-card p-2 text-xs text-muted-foreground text-center border-r border-border/30">
                {timeIndex % 4 === 0 ? time : ""}
              </div>

              {/* Day Slots */}
              {weekDays.map((_, dayIndex) => {
                const blocks = getBlocksForSlot(dayIndex, timeIndex)
                const isFirstSlotOfBlock = blocks.some((block) => block.timeSlot === timeIndex)
                const isComplete = completeDays.includes(dayIndex)

                return (
                  <div
                    key={`${dayIndex}-${timeIndex}`}
                    className={`time-slot relative ${
                      activeBlock ? "hover:bg-blue-900/20 cursor-cell" : ""
                    } ${isComplete ? "bg-green-900/5" : ""}`}
                    onClick={() => handleSlotClick(dayIndex, timeIndex)}
                  >
                    {isFirstSlotOfBlock &&
                      blocks.map((block) => (
                        <div
                          key={block.id}
                          className={`time-block ${block.type}`}
                          style={{
                            height: `${block.duration * 20}px`,
                            zIndex: 10,
                          }}
                          onClick={(e) => handleBlockClick(block, e)}
                        >
                          <div className="truncate font-medium">
                            {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                          </div>
                          {block.note && <div className="truncate text-xs opacity-75">{block.note}</div>}

                          {/* Resize Handle */}
                          <div
                            className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 cursor-ns-resize opacity-0 hover:opacity-100 transition-opacity"
                            onMouseDown={(e) => {
                              e.stopPropagation()
                              setResizing({ block, startY: e.clientY, startDuration: block.duration })
                            }}
                          />
                        </div>
                      ))}

                    {/* Preview of active block on hover */}
                    {activeBlock && !blocks.length && (
                      <div
                        className="absolute inset-0 bg-blue-500/10 border border-blue-500/30 opacity-0 hover:opacity-100 transition-opacity"
                        style={{ height: `${activeBlock.duration * 20}px` }}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
