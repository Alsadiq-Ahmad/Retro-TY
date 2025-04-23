"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Board } from "@/types"

interface EnhancedBoardCreationFormProps {
  onSubmit: (board: Board) => void
}

export default function EnhancedBoardCreationForm({ onSubmit }: EnhancedBoardCreationFormProps) {
  const [boardName, setBoardName] = useState("")
  const [description, setDescription] = useState("")
  const [sectionCount, setSectionCount] = useState(2)
  const [sectionTitles, setSectionTitles] = useState<string[]>(Array(2).fill(""))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSectionCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = Number.parseInt(e.target.value, 10)
    setSectionCount(count)

    // Update section titles array when count changes
    setSectionTitles((prev) => {
      if (count > prev.length) {
        return [...prev, ...Array(count - prev.length).fill("")]
      } else if (count < prev.length) {
        return prev.slice(0, count)
      }
      return prev
    })

    // Clear error
    if (errors.sectionCount) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.sectionCount
        return newErrors
      })
    }
  }

  const handleSectionTitleChange = (index: number, value: string) => {
    setSectionTitles((prev) => {
      const newTitles = [...prev]
      newTitles[index] = value
      return newTitles
    })

    // Clear error
    if (errors[`section-${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[`section-${index}`]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!boardName.trim()) {
      newErrors.boardName = "Board name is required"
    }

    if (!description.trim()) {
      newErrors.description = "Description is required"
    }

    if (sectionCount < 1 || sectionCount > 4) {
      newErrors.sectionCount = "Section count must be between 1 and 4"
    }

    sectionTitles.forEach((title, index) => {
      if (!title.trim()) {
        newErrors[`section-${index}`] = "Section title is required"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      const sections = sectionTitles.map((title, index) => ({
        id: `section-${index}`,
        title,
      }))

      onSubmit({
        name: boardName,
        description,
        sectionCount,
        sections,
      })
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-md rounded-xl border-border animate-fade-in">
      <CardHeader className="section-header rounded-t-xl">
        <CardTitle className="text-foreground text-xl">Create a New Board</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="boardName" className="text-foreground font-medium">
                Board Name
              </Label>
              <Input
                id="boardName"
                value={boardName}
                onChange={(e) => {
                  setBoardName(e.target.value)
                  if (errors.boardName) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.boardName
                      return newErrors
                    })
                  }
                }}
                placeholder="My Awesome Idea Board"
                className={`enhanced-input ${errors.boardName ? "border-red-500" : ""}`}
              />
              {errors.boardName && <p className="text-red-500 text-sm">{errors.boardName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  if (errors.description) {
                    setErrors((prev) => {
                      const newErrors = { ...prev }
                      delete newErrors.description
                      return newErrors
                    })
                  }
                }}
                placeholder="What is this board for?"
                className={`enhanced-input min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionCount" className="text-foreground font-medium">
                Number of Sections (1-4)
              </Label>
              <Input
                id="sectionCount"
                type="number"
                min={1}
                max={4}
                value={sectionCount}
                onChange={handleSectionCountChange}
                className={`enhanced-input ${errors.sectionCount ? "border-red-500" : ""}`}
              />
              {errors.sectionCount && <p className="text-red-500 text-sm">{errors.sectionCount}</p>}
            </div>
          </div>

          <div className="space-y-4 border-t border-border pt-4">
            <h3 className="font-medium text-lg text-foreground">Section Titles</h3>
            <div className="grid gap-4 md:grid-cols-2">
              {sectionTitles.map((title, index) => (
                <div key={index} className="space-y-2">
                  <Label htmlFor={`section-${index}`} className="text-foreground font-medium">
                    Section {index + 1}
                  </Label>
                  <Input
                    id={`section-${index}`}
                    value={title}
                    onChange={(e) => handleSectionTitleChange(index, e.target.value)}
                    placeholder={`Section ${index + 1} Title`}
                    className={`enhanced-input ${errors[`section-${index}`] ? "border-red-500" : ""}`}
                  />
                  {errors[`section-${index}`] && <p className="text-red-500 text-sm">{errors[`section-${index}`]}</p>}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-border pt-4">
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full h-11">
            Create Board
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
