"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2 } from "lucide-react"

interface BlockEditModalProps {
  block: any
  onUpdate: (block: any) => void
  onDelete: (blockId: number) => void
  onClose: () => void
}

export function BlockEditModal({ block, onUpdate, onDelete, onClose }: BlockEditModalProps) {
  const [type, setType] = useState(block.type)
  const [note, setNote] = useState(block.note || "")
  const [duration, setDuration] = useState(block.duration)

  const handleSave = () => {
    onUpdate({
      ...block,
      type,
      note,
      duration,
    })
  }

  const formatDuration = (slots: number) => {
    const hours = Math.floor(slots / 4)
    const minutes = (slots % 4) * 15
    if (hours > 0) {
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
    return `${minutes}m`
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border/50 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-foreground">Edit Time Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="type" className="text-foreground">
              Activity Type
            </Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="study">Study</SelectItem>
                <SelectItem value="life">Life</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration" className="text-foreground">
              Duration
            </Label>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(Number.parseInt(value))}>
              <SelectTrigger className="bg-background border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border/50">
                {Array.from({ length: 16 }, (_, i) => i + 1).map((slots) => (
                  <SelectItem key={slots} value={slots.toString()}>
                    {formatDuration(slots)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="note" className="text-foreground">
              Note (Optional)
            </Label>
            <Input
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="bg-background border-border/50"
            />
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(block.id)}
              className="flex items-center space-x-2"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </Button>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-aegis-secondary hover:bg-aegis-secondary/80">
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
