"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Save } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface BlockTemplate {
  id: string
  name: string
  type: "work" | "study" | "life"
  duration: number
  color: string
  note?: string
}

interface BlockTemplatesProps {
  onCreateBlock: (template: BlockTemplate) => void
}

export function BlockTemplates({ onCreateBlock }: BlockTemplatesProps) {
  const [templates, setTemplates] = useState<BlockTemplate[]>([
    { id: "work-30", name: "Quick Work", type: "work", duration: 2, color: "bg-blue-900/20 border-l-blue-600" },
    { id: "work-60", name: "Deep Work", type: "work", duration: 4, color: "bg-blue-900/20 border-l-blue-600" },
    { id: "study-45", name: "Study Session", type: "study", duration: 3, color: "bg-green-900/20 border-l-green-500" },
    { id: "life-gym", name: "Gym", type: "life", duration: 6, color: "bg-gray-700/20 border-l-gray-500" },
    { id: "life-meal", name: "Meal", type: "life", duration: 2, color: "bg-gray-700/20 border-l-gray-500" },
  ])

  const [showNewTemplate, setShowNewTemplate] = useState(false)
  const [newTemplate, setNewTemplate] = useState<Partial<BlockTemplate>>({
    name: "",
    type: "work",
    duration: 2,
  })

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.type && newTemplate.duration) {
      const color =
        newTemplate.type === "work"
          ? "bg-blue-900/20 border-l-blue-600"
          : newTemplate.type === "study"
            ? "bg-green-900/20 border-l-green-500"
            : "bg-gray-700/20 border-l-gray-500"

      const template: BlockTemplate = {
        id: `${newTemplate.type}-${Date.now()}`,
        name: newTemplate.name,
        type: newTemplate.type as "work" | "study" | "life",
        duration: newTemplate.duration,
        color,
        note: newTemplate.note,
      }

      setTemplates([...templates, template])
      setShowNewTemplate(false)
      setNewTemplate({ name: "", type: "work", duration: 2 })
    }
  }

  const formatDuration = (slots: number) => {
    const minutes = slots * 15
    return minutes >= 60 ? `${minutes / 60}h` : `${minutes}m`
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-heading text-lg text-foreground">Block Templates</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNewTemplate(true)}
            className="border-border/50 hover:bg-muted/50"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="p-3 rounded-lg border border-border/50 hover:border-border cursor-pointer transition-all"
              onClick={() => onCreateBlock(template)}
            >
              <div
                className={`h-3 rounded-sm mb-2 ${
                  template.type === "work" ? "bg-blue-600" : template.type === "study" ? "bg-green-500" : "bg-gray-500"
                }`}
              />
              <div className="text-sm font-medium text-foreground truncate">{template.name}</div>
              <div className="text-xs text-muted-foreground flex justify-between mt-1">
                <span className="capitalize">{template.type}</span>
                <span>{formatDuration(template.duration)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      {/* New Template Dialog */}
      <Dialog open={showNewTemplate} onOpenChange={setShowNewTemplate}>
        <DialogContent className="bg-card border-border/50 max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-foreground">Create Block Template</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="template-name" className="text-foreground">
                Template Name
              </Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="e.g., Deep Work, Gym, Reading"
                className="bg-background border-border/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-type" className="text-foreground">
                Activity Type
              </Label>
              <Select
                value={newTemplate.type}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value as "work" | "study" | "life" })}
              >
                <SelectTrigger id="template-type" className="bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="study">Study</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-duration" className="text-foreground">
                Duration
              </Label>
              <Select
                value={newTemplate.duration?.toString()}
                onValueChange={(value) => setNewTemplate({ ...newTemplate, duration: Number(value) })}
              >
                <SelectTrigger id="template-duration" className="bg-background border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((slots) => (
                    <SelectItem key={slots} value={slots.toString()}>
                      {formatDuration(slots)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template-note" className="text-foreground">
                Note (Optional)
              </Label>
              <Input
                id="template-note"
                value={newTemplate.note || ""}
                onChange={(e) => setNewTemplate({ ...newTemplate, note: e.target.value })}
                placeholder="Add a note..."
                className="bg-background border-border/50"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTemplate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTemplate} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-1" />
              Save Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
