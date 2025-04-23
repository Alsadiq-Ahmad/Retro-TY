"use client"

import { useState } from "react"
import EnhancedBoardCreationForm from "@/components/enhanced-board-creation-form"
import IdeaBoard from "@/components/idea-board"
import type { Board, Note } from "@/types"

export default function Home() {
  const [step, setStep] = useState<"board-details" | "board-view">("board-details")
  const [board, setBoard] = useState<Board>({
    name: "",
    description: "",
    sectionCount: 2,
    sections: [],
  })
  const [notes, setNotes] = useState<Note[]>([])

  const handleBoardCreation = (newBoard: Board) => {
    setBoard(newBoard)
    setStep("board-view")
  }

  const handleAddNote = (sectionId: string, content: string, color: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      content,
      sectionId,
      color,
      votes: 0,
    }
    setNotes((prevNotes) => [...prevNotes, newNote])
  }

  const handleMoveNote = (noteId: string, destinationSectionId: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === noteId ? { ...note, sectionId: destinationSectionId } : note)),
    )
  }

  const handleVoteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === noteId ? { ...note, votes: note.votes + 1 } : note)))
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId))
  }

  const handleResetBoard = () => {
    setStep("board-details")
    setNotes([])
  }

  const handleEditNote = (noteId: string, newContent: string) => {
    setNotes((prevNotes) => prevNotes.map((note) => (note.id === noteId ? { ...note, content: newContent } : note)))
  }

  return (
    <main className="container mx-auto p-4 max-w-6xl h-screen flex flex-col bg-background">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
        <span className="text-primary">Retro</span> App
      </h1>

      {step === "board-details" && <EnhancedBoardCreationForm onSubmit={handleBoardCreation} />}

      {step === "board-view" && (
        <div className="flex-1 flex flex-col min-h-0">
          <IdeaBoard
            board={board}
            notes={notes}
            onAddNote={handleAddNote}
            onMoveNote={handleMoveNote}
            onVoteNote={handleVoteNote}
            onDeleteNote={handleDeleteNote}
            onEditNote={handleEditNote}
            onResetBoard={handleResetBoard}
          />
        </div>
      )}
    </main>
  )
}
