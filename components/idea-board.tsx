"use client"

import { DndContext, type DragEndEvent, closestCenter } from "@dnd-kit/core"
import type { Board, Note } from "@/types"
import BoardSection from "@/components/board-section"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import { useWindowSize } from "@/hooks/use-window-size"

interface IdeaBoardProps {
  board: Board
  notes: Note[]
  onAddNote: (sectionId: string, content: string, color: string) => void
  onMoveNote: (noteId: string, destinationSectionId: string) => void
  onVoteNote: (noteId: string) => void
  onDeleteNote: (noteId: string) => void
  onEditNote: (noteId: string, newContent: string) => void
  onResetBoard: () => void
}

export default function IdeaBoard({
  board,
  notes,
  onAddNote,
  onMoveNote,
  onVoteNote,
  onDeleteNote,
  onEditNote,
  onResetBoard,
}: IdeaBoardProps) {
  const { width } = useWindowSize()
  const isMobile = width ? width < 768 : false

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const noteId = active.id as string
      const destinationSectionId = over.id as string

      onMoveNote(noteId, destinationSectionId)
    }
  }

  // Sort notes by votes (highest first)
  const getSortedNotes = (section: { id: string }) => {
    return [...notes.filter((note) => note.sectionId === section.id)].sort((a, b) => b.votes - a.votes)
  }

  // Determine grid layout based on section count and screen size
  const getGridStyle = () => {
    if (isMobile) {
      return {
        gridTemplateColumns: "1fr",
        gridTemplateRows: `repeat(${board.sectionCount}, 1fr)`,
      }
    }

    switch (board.sectionCount) {
      case 1:
        return {
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr",
        }
      case 2:
        return {
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr",
        }
      case 3:
        return {
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "1fr",
        }
      case 4:
        return {
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "1fr 1fr",
        }
      default:
        return {
          gridTemplateColumns: "1fr",
          gridTemplateRows: "1fr",
        }
    }
  }

  return (
    <div className="space-y-6 flex flex-col h-full">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetBoard}
          className="rounded-full border-border text-foreground hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Form
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground">{board.name}</h2>
        <p className="text-muted-foreground mt-2">{board.description}</p>
      </div>

      <div className="flex-1 min-h-0">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="grid gap-4 flex-1" style={getGridStyle()}>
            {board.sections.map((section) => (
              <BoardSection
                key={section.id}
                section={section}
                notes={notes.filter((note) => note.sectionId === section.id).sort((a, b) => b.votes - a.votes)}
                onAddNote={(content, color) => onAddNote(section.id, content, color)}
                onVoteNote={onVoteNote}
                onDeleteNote={onDeleteNote}
                onEditNote={onEditNote}
              />
            ))}
          </div>
        </DndContext>
      </div>
    </div>
  )
}