"use client"

import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import type { Section, Note } from "@/types"
import NoteCard from "@/components/note-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, X } from "lucide-react"

interface BoardSectionProps {
  section: Section
  notes: Note[]
  onAddNote: (content: string, color: string) => void
  onVoteNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  onEditNote: (noteId: string, newContent: string) => void
}

export default function BoardSection({
  section,
  notes,
  onAddNote,
  onVoteNote,
  onDeleteNote,
  onEditNote,
}: BoardSectionProps) {
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [newNoteContent, setNewNoteContent] = useState("")

  const { setNodeRef } = useDroppable({
    id: section.id,
  })

  const handleAddNote = () => {
    if (newNoteContent.trim()) {
      // Use a standard style for all notes (no color selection)
      onAddNote(newNoteContent, "enhanced-note")
      setNewNoteContent("")
      setIsAddingNote(false)
    }
  }

  return (
    <Card className="h-full flex flex-col rounded-xl shadow-sm border-border">
      <CardHeader className="pb-2 section-header rounded-t-xl">
        <CardTitle className="flex justify-between items-center text-foreground">
          <span>{section.title}</span>
          <span className="text-sm font-normal text-muted-foreground">{notes.length} notes</span>
        </CardTitle>
      </CardHeader>
      <CardContent
        ref={setNodeRef}
        className="flex-1 flex flex-col gap-3 p-3 enhanced-section-bg rounded-b-xl overflow-y-auto"
        style={{ minHeight: 0 }} // This is important for proper scrolling in a flex container
      >
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onVote={() => onVoteNote(note.id)}
            onDelete={() => onDeleteNote(note.id)}
            onEdit={onEditNote}
          />
        ))}

        {isAddingNote ? (
          <div className="space-y-3 mt-2 p-4 rounded-xl bg-white border border-border shadow-sm animate-fade-in">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-foreground">Add New Note</h4>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full hover:bg-secondary"
                onClick={() => {
                  setIsAddingNote(false)
                  setNewNoteContent("")
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Input
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Enter note content..."
              className="enhanced-input"
              autoFocus
            />

            <Button
              size="sm"
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
              onClick={handleAddNote}
            >
              Add Note
            </Button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full flex items-center justify-center rounded-full border-border text-muted-foreground hover:bg-white hover:text-primary hover:border-primary"
            onClick={() => setIsAddingNote(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Note
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
