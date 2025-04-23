"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useDraggable } from "@dnd-kit/core"
import type { Note } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ThumbsUp, Trash2, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface NoteCardProps {
  note: Note
  onVote: () => void
  onDelete: () => void
  onEdit: (noteId: string, newContent: string) => void
}

export default function NoteCard({ note, onVote, onDelete, onEdit }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(note.content)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: note.id,
    disabled: isEditing,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 10 : 1,
      }
    : undefined

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(editedContent.length, editedContent.length)
    }
  }, [isEditing, editedContent])

  const handleTextClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleVote = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onVote()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    onDelete()
  }

  const handleSaveEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (editedContent.trim()) {
      onEdit(note.id, editedContent)
      setIsEditing(false)
    }
  }

  // Handle clicking outside to save
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node) && isEditing) {
        if (editedContent.trim()) {
          onEdit(note.id, editedContent)
          setIsEditing(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isEditing, editedContent, note.id, onEdit])

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`
        enhanced-note
        ${!isEditing ? "cursor-grab active:cursor-grabbing" : ""} 
        relative
        rounded-lg
        overflow-hidden
        animate-fade-in
      `}
      {...(isEditing ? {} : { ...listeners, ...attributes })}
    >
      <div className="p-3">
        {isEditing ? (
          <Textarea
            ref={textareaRef}
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="min-h-[80px] bg-transparent border-none focus-visible:ring-0 p-0 text-base resize-none"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p className="whitespace-pre-wrap break-words text-foreground cursor-text" onClick={handleTextClick}>
            {note.content}
          </p>
        )}
      </div>
      <div className="p-2 pt-0 flex justify-between items-center border-t border-border">
        {isEditing ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs gap-1 rounded-full hover:bg-primary/10 text-primary"
            onClick={handleSaveEdit}
          >
            <Check className="h-3 w-3" />
            <span>Save</span>
          </Button>
        ) : (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs gap-1 rounded-full btn-hover-effect"
              onClick={handleVote}
              type="button"
            >
              <ThumbsUp className="h-3 w-3" />
              <span>{note.votes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 rounded-full btn-hover-effect hover:text-destructive"
              onClick={handleDelete}
              type="button"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        )}
      </div>
    </Card>
  )
}
