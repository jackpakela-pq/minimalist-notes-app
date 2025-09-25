"use client"

import { useState, useEffect } from "react"
import { NotesSidebar } from "./notes-sidebar"
import { NotesEditor } from "./notes-editor"
import type { Note } from "@/types/note"

export function NotesApp() {
  const [notes, setNotes] = useState<Note[]>([])
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [backgroundVariant, setBackgroundVariant] = useState<string>("default")

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    const savedBackground = localStorage.getItem("backgroundVariant")

    if (savedBackground) {
      setBackgroundVariant(savedBackground)
    }

    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes)
      const notesWithDates = parsedNotes.map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }))
      setNotes(notesWithDates)
      if (notesWithDates.length > 0) {
        setActiveNoteId(notesWithDates[0].id)
      }
    } else {
      const welcomeNote: Note = {
        id: Date.now().toString(),
        title: "Welcome to Your Notes App",
        content: `# Welcome to Your Minimalistic Notes App! 

This is your first note. Here are some things you can do:

## Formatting Options
- **Bold text** (Ctrl+B)
- *Italic text* (Ctrl+I)
- <u>Underlined text</u> (Ctrl+U)
- ~~Strikethrough text~~ (Ctrl+K)
- \`Inline code\` (Ctrl+\`)

## Lists
- Bullet points
- Another point

1. Numbered lists
2. Work great too

> Quotes look elegant

### Features
- Auto-save every 2 seconds after editing
- Glassmorphic design with beautiful blur effects
- Customizable backgrounds
- Keyboard shortcuts for everything
- Organized sidebar

Start writing your thoughts and ideas. Your notes are automatically saved!`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setNotes([welcomeNote])
      setActiveNoteId(welcomeNote.id)
    }
  }, [])

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
    localStorage.setItem("backgroundVariant", backgroundVariant)

    // Remove all existing background classes
    document.body.classList.remove("bg-default", "bg-light", "bg-ocean", "bg-aurora", "bg-sunset")

    // Apply new background class (only if not default)
    if (backgroundVariant !== "default") {
      document.body.classList.add(`bg-${backgroundVariant}`)
    }
  }, [backgroundVariant])

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setNotes((prev) => [newNote, ...prev])
    setActiveNoteId(newNote.id)
  }

  const updateNote = (id: string, updates: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note)))
  }

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id))
    if (activeNoteId === id) {
      const remainingNotes = notes.filter((note) => note.id !== id)
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null)
    }
  }

  const activeNote = notes.find((note) => note.id === activeNoteId)

  return (
    <div className="flex h-screen overflow-hidden relative">
      <NotesSidebar
        notes={notes}
        activeNoteId={activeNoteId}
        onNoteSelect={setActiveNoteId}
        onNoteCreate={createNote}
        onNoteDelete={deleteNote}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <div className="flex-1 flex flex-col">
        <NotesEditor
          note={activeNote}
          onNoteUpdate={updateNote}
          backgroundVariant={backgroundVariant}
          onBackgroundChange={setBackgroundVariant}
        />
      </div>
    </div>
  )
}
