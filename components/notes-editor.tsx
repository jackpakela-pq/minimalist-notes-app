"use client"

import type React from "react"
import { BackgroundCustomizer } from "./background-customizer"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import type { Note } from "@/types/note"
import { useAutoSave } from "@/hooks/use-auto-save"

const Bold = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
)

const Italic = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="19" y1="4" x2="10" y2="4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="14" y1="20" x2="5" y2="20" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="15" y1="4" x2="9" y2="20" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Underline = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
    <line x1="4" y1="21" x2="20" y2="21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Strikethrough = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16a6 6 0 0 0 10.3 1.1" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.21 4.56a6 6 0 0 1 10.36 6.75" />
    <line x1="2" y1="12" x2="22" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const List = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="8" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="8" y1="12" x2="21" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="8" y1="18" x2="21" y2="18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="3" y1="6" x2="3.01" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="3" y1="12" x2="3.01" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="3" y1="18" x2="3.01" y2="18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const ListOrdered = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="10" y1="6" x2="21" y2="6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="10" y1="12" x2="21" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="10" y1="18" x2="21" y2="18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h1v4" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 10h2" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />
  </svg>
)

const Quote = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"
    />
  </svg>
)

const Code = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="16,18 22,12 16,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline points="8,6 2,12 8,18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Heading1 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12M6 6v12M18 6v12" />
  </svg>
)

const Heading2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h8m-8-6v12m8-6v6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1l2-2c2 1.5 2 2.5 0 4"
    />
  </svg>
)

const Heading3 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h7m-7-6v12m7-6v6" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 18c.5-.4.8-.8.8-1.5 0-1.5-2-2.5-4-1l2-2c2 1.5 2 2.5 0 4"
    />
  </svg>
)

const Save = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
    />
    <polyline points="17,21 17,13 7,13 7,21" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline points="7,3 7,8 15,8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

interface NotesEditorProps {
  note?: Note
  onNoteUpdate: (id: string, updates: Partial<Note>) => void
  backgroundVariant: string
  onBackgroundChange: (variant: string) => void
}

export function NotesEditor({ note, onNoteUpdate, backgroundVariant, onBackgroundChange }: NotesEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const editorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setLastSaved(note.updatedAt)

      // Set the editor content
      if (editorRef.current) {
        editorRef.current.innerHTML = note.content || ""
      }
    } else {
      setTitle("")
      setContent("")
      setLastSaved(null)
      if (editorRef.current) {
        editorRef.current.innerHTML = ""
      }
    }
  }, [note])

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle)
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      const newContent = editorRef.current.innerHTML
      setContent(newContent)
    }
  }

  useAutoSave(title, {
    delay: 2000,
    onSave: () => {
      if (note && title !== note.title) {
        setIsSaving(true)
        onNoteUpdate(note.id, { title })
        setLastSaved(new Date())
        setTimeout(() => setIsSaving(false), 500)
      }
    },
  })

  useAutoSave(content, {
    delay: 2000,
    onSave: () => {
      if (note && content !== note.content) {
        setIsSaving(true)
        onNoteUpdate(note.id, { content })
        setLastSaved(new Date())
        setTimeout(() => setIsSaving(false), 500)
      }
    },
  })

  const saveSelection = () => {
    console.log("[v0] Saving selection...")
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      console.log("[v0] Selection saved:", {
        startContainer: range.startContainer,
        startOffset: range.startOffset,
        endContainer: range.endContainer,
        endOffset: range.endOffset,
        selectedText: selection.toString(),
      })
      return range.cloneRange()
    }
    console.log("[v0] No selection to save")
    return null
  }

  const restoreSelection = (range: Range | null) => {
    if (range) {
      console.log("[v0] Restoring selection...")
      try {
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
          console.log("[v0] Selection restored successfully")
        }
      } catch (error) {
        console.log("[v0] Error restoring selection:", error)
      }
    } else {
      console.log("[v0] No range to restore")
    }
  }

  const applyFormat = (command: string, value?: string) => {
    console.log("[v0] Applying format:", command)
    const savedRange = saveSelection()

    // Focus the editor first to ensure proper context
    editorRef.current?.focus()

    document.execCommand(command, false, value)
    handleContentChange()

    // Use requestAnimationFrame to ensure DOM updates are complete
    requestAnimationFrame(() => {
      restoreSelection(savedRange)
      editorRef.current?.focus()
    })
  }

  const applyHeading = (tag: string) => {
    console.log("[v0] Applying heading:", tag)
    const savedRange = saveSelection()

    editorRef.current?.focus()
    document.execCommand("formatBlock", false, tag)
    handleContentChange()

    requestAnimationFrame(() => {
      restoreSelection(savedRange)
      editorRef.current?.focus()
    })
  }

  const insertBulletList = () => {
    console.log("[v0] Inserting bullet list")
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString()
      const savedRange = saveSelection()

      editorRef.current?.focus()

      if (selectedText) {
        const lines = selectedText.split("\n")
        const convertedLines = lines.map((line) => {
          const numberedMatch = line.match(/^(\s*)(\d+)\.\s*(.*)$/)
          if (numberedMatch) {
            const [, indent, , content] = numberedMatch
            return `${indent}• ${content}`
          }
          const bulletMatch = line.match(/^(\s*)[•*]\s*(.*)$/)
          if (bulletMatch) {
            const [, indent, content] = bulletMatch
            return `${indent}• ${content}`
          }
          const indentMatch = line.match(/^(\s*)(.*)$/)
          const indent = indentMatch ? indentMatch[1] : ""
          const content = indentMatch ? indentMatch[2] : line
          return content.trim() ? `${indent}• ${content}` : line
        })
        const htmlContent = convertedLines.join("<br>")
        document.execCommand("insertHTML", false, htmlContent)
        handleContentChange()

        // Use longer timeout for complex DOM operations
        setTimeout(() => {
          restoreSelection(savedRange)
          editorRef.current?.focus()
        }, 10)
      } else {
        document.execCommand("insertHTML", false, "• ")
        handleContentChange()
        editorRef.current?.focus()
      }
    }
  }

  const insertNumberedList = () => {
    console.log("[v0] Inserting numbered list")
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString()
      const savedRange = saveSelection()

      editorRef.current?.focus()

      if (selectedText) {
        const lines = selectedText.split("\n")
        const convertedLines: string[] = []
        const numberStack: number[] = [0]

        lines.forEach((line) => {
          const bulletMatch = line.match(/^(\s*)[•*]\s*(.*)$/)
          if (bulletMatch) {
            const [, indent, content] = bulletMatch
            const indentLevel = Math.floor(indent.length / 4)

            while (numberStack.length <= indentLevel) {
              numberStack.push(0)
            }

            numberStack[indentLevel]++
            for (let i = indentLevel + 1; i < numberStack.length; i++) {
              numberStack[i] = 0
            }

            convertedLines.push(`${indent}${numberStack[indentLevel]}. ${content}`)
            return
          }

          const numberedMatch = line.match(/^(\s*)(\d+)\.\s*(.*)$/)
          if (numberedMatch) {
            const [, indent, , content] = numberedMatch
            const indentLevel = Math.floor(indent.length / 4)

            while (numberStack.length <= indentLevel) {
              numberStack.push(0)
            }

            numberStack[indentLevel]++
            for (let i = indentLevel + 1; i < numberStack.length; i++) {
              numberStack[i] = 0
            }

            convertedLines.push(`${indent}${numberStack[indentLevel]}. ${content}`)
            return
          }

          const indentMatch = line.match(/^(\s*)(.*)$/)
          const indent = indentMatch ? indentMatch[1] : ""
          const content = indentMatch ? indentMatch[2] : line

          if (content.trim()) {
            const indentLevel = Math.floor(indent.length / 4)

            while (numberStack.length <= indentLevel) {
              numberStack.push(0)
            }

            numberStack[indentLevel]++
            for (let i = indentLevel + 1; i < numberStack.length; i++) {
              numberStack[i] = 0
            }

            convertedLines.push(`${indent}${numberStack[indentLevel]}. ${content}`)
          } else {
            convertedLines.push(line)
          }
        })

        const htmlContent = convertedLines.join("<br>")
        document.execCommand("insertHTML", false, htmlContent)
        handleContentChange()

        // Use longer timeout for complex DOM operations
        setTimeout(() => {
          restoreSelection(savedRange)
          editorRef.current?.focus()
        }, 10)
      } else {
        document.execCommand("insertHTML", false, "1. ")
        handleContentChange()
        editorRef.current?.focus()
      }
    }
  }

  const getListHierarchy = (line: string) => {
    const indentMatch = line.match(/^(\s*)/)
    const indentLevel = indentMatch ? Math.floor(indentMatch[1].length / 2) : 0
    return indentLevel
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault()
          applyFormat("bold")
          break
        case "i":
          e.preventDefault()
          applyFormat("italic")
          break
        case "u":
          e.preventDefault()
          applyFormat("underline")
          break
        case "s":
          e.preventDefault()
          // Manual save
          break
      }
    }

    if (e.key === "Enter") {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.startContainer
        const textContent = container.textContent || ""
        const cursorPosition = range.startOffset

        const beforeCursor = textContent.substring(0, cursorPosition)
        const lines = beforeCursor.split("\n")
        const currentLine = lines[lines.length - 1]

        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s+(.+)$/)
        if (numberedMatch) {
          e.preventDefault()
          const [, indent, number, content] = numberedMatch

          if (content.trim() === "") {
            document.execCommand("insertHTML", false, "<br>")
          } else {
            const nextNumber = Number.parseInt(number) + 1
            document.execCommand("insertHTML", false, `<br>${indent}${nextNumber}. `)
          }
          return
        }

        const bulletMatch = currentLine.match(/^(\s*)([*])\s+(.+)$/)
        if (bulletMatch) {
          e.preventDefault()
          const [, indent, , content] = bulletMatch

          if (content.trim() === "") {
            document.execCommand("insertHTML", false, "<br>")
          } else {
            const lineStart = textContent.lastIndexOf("\n", cursorPosition - 1) + 1
            const lineEnd = textContent.indexOf("\n", cursorPosition)
            const actualLineEnd = lineEnd === -1 ? textContent.length : lineEnd

            const newRange = document.createRange()
            newRange.setStart(container, lineStart)
            newRange.setEnd(container, actualLineEnd)
            selection.removeAllRanges()
            selection.addRange(newRange)

            document.execCommand("insertText", false, `${indent}• ${content}`)

            document.execCommand("insertHTML", false, `<br>${indent}• `)
          }
          return
        }

        const existingBulletMatch = currentLine.match(/^(\s*)(•)\s+(.+)$/)
        if (existingBulletMatch) {
          e.preventDefault()
          const [, indent, , content] = existingBulletMatch

          if (content.trim() === "") {
            document.execCommand("insertHTML", false, "<br>")
          } else {
            document.execCommand("insertHTML", false, `<br>${indent}• `)
          }
          return
        }
      }
    }

    if (e.key === "Tab") {
      e.preventDefault()
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const container = range.startContainer
        const textContent = container.textContent || ""
        const cursorPosition = range.startOffset

        const beforeCursor = textContent.substring(0, cursorPosition)
        const lines = beforeCursor.split("\n")
        const currentLineIndex = lines.length - 1
        const currentLine = lines[currentLineIndex]

        const numberedMatch = currentLine.match(/^(\s*)(\d+)\.\s*(.*)$/)
        if (numberedMatch) {
          const [, currentIndent, , content] = numberedMatch
          const newIndent = e.shiftKey ? currentIndent.substring(4) : currentIndent + "    "

          let newNumber = "1"
          if (e.shiftKey) {
            const parentLevel = Math.max(0, Math.floor(newIndent.length / 4))
            let parentNumber = 1
            for (let i = currentLineIndex - 1; i >= 0; i--) {
              const prevLine = lines[i]
              const prevMatch = prevLine.match(/^(\s*)(\d+)\.\s*(.*)$/)
              if (prevMatch) {
                const prevIndentLevel = Math.floor(prevMatch[1].length / 4)
                if (prevIndentLevel === parentLevel) {
                  parentNumber = Number.parseInt(prevMatch[2]) + 1
                  break
                }
              }
            }
            newNumber = parentNumber.toString()
          }

          const newLine = `${newIndent}${newNumber}. ${content}`

          const lineStart = textContent.lastIndexOf("\n", cursorPosition - 1) + 1
          const lineEnd = textContent.indexOf("\n", cursorPosition)
          const actualLineEnd = lineEnd === -1 ? textContent.length : lineEnd

          const newRange = document.createRange()
          newRange.setStart(container, lineStart)
          newRange.setEnd(container, actualLineEnd)
          selection.removeAllRanges()
          selection.addRange(newRange)

          document.execCommand("insertText", false, newLine)
          return
        }

        const bulletMatch = currentLine.match(/^(\s*)(•)\s*(.*)$/)
        if (bulletMatch) {
          const [, currentIndent, , content] = bulletMatch
          const newIndent = e.shiftKey ? currentIndent.substring(4) : currentIndent + "    "

          const newLine = `${newIndent}• ${content}`

          const lineStart = textContent.lastIndexOf("\n", cursorPosition - 1) + 1
          const lineEnd = textContent.indexOf("\n", cursorPosition)
          const actualLineEnd = lineEnd === -1 ? textContent.length : lineEnd

          const newRange = document.createRange()
          newRange.setStart(container, lineStart)
          newRange.setEnd(container, actualLineEnd)
          selection.removeAllRanges()
          selection.addRange(newRange)

          document.execCommand("insertText", false, newLine)
          return
        } else {
          document.execCommand("insertText", false, e.shiftKey ? "" : "    ")
        }
      }
    }
  }

  const formatButtons = [
    { label: "H1", action: () => applyHeading("h1"), tooltip: "Heading 1" },
    { label: "H2", action: () => applyHeading("h2"), tooltip: "Heading 2" },
    { label: "H3", action: () => applyHeading("h3"), tooltip: "Heading 3" },
    { label: "P", action: () => applyHeading("p"), tooltip: "Paragraph" },
    { icon: Bold, action: () => applyFormat("bold"), tooltip: "Bold", shortcut: "Ctrl+B" },
    { icon: Italic, action: () => applyFormat("italic"), tooltip: "Italic", shortcut: "Ctrl+I" },
    { icon: Underline, action: () => applyFormat("underline"), tooltip: "Underline", shortcut: "Ctrl+U" },
    { icon: Strikethrough, action: () => applyFormat("strikeThrough"), tooltip: "Strikethrough" },
    { icon: List, action: insertBulletList, tooltip: "Bullet List" },
    { icon: ListOrdered, action: insertNumberedList, tooltip: "Numbered List" },
  ]

  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = (now.getTime() - date.getTime()) / 1000

    if (diffInSeconds < 60) {
      return "Saved just now"
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `Saved ${minutes}m ago`
    } else {
      return `Saved at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
    }
  }

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center text-muted-foreground glass-strong p-8 rounded-xl border border-border/30">
          <h2 className="text-2xl font-light mb-2 text-foreground drop-shadow-sm">Select a note to start writing</h2>
          <p className="text-sm">Create a new note or choose from your existing notes</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="glass-ultra border-b border-border/30 p-4">
        <div className="flex items-center gap-4">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Note title..."
            className="text-2xl font-light glass border-border/50 px-4 py-2 focus-visible:ring-primary/50 focus-visible:glass-strong placeholder:text-muted-foreground/60 flex-1 transition-all duration-200"
          />
          <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
            {isSaving ? (
              <div className="flex items-center gap-2 glass px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Saving...</span>
              </div>
            ) : lastSaved ? (
              <span className="glass px-3 py-1 rounded-full">{formatLastSaved(lastSaved)}</span>
            ) : null}
            <BackgroundCustomizer currentVariant={backgroundVariant} onVariantChange={onBackgroundChange} />
          </div>
        </div>
      </div>

      <div className="glass-ultra border-b border-border/30 p-3">
        <TooltipProvider>
          <div className="flex items-center gap-1 flex-wrap">
            {formatButtons.map((button, index) => (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={button.action}
                    className={`glass h-8 ${button.label ? "px-3 min-w-[32px]" : "w-8 p-0"} hover:glass-strong hover:text-accent-foreground transition-all duration-200`}
                  >
                    {button.label ? (
                      <span className="text-xs font-semibold">{button.label}</span>
                    ) : (
                      <button.icon className="h-4 w-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="glass-strong">
                  <p className="text-sm">
                    {button.tooltip}
                    {button.shortcut && <span className="ml-2 text-xs text-muted-foreground">{button.shortcut}</span>}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </div>

      <div className="flex-1 p-4 glass relative">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          className="w-full h-full bg-transparent border-none outline-none resize-none text-foreground leading-relaxed font-light focus:outline-none rich-text-editor"
          style={{ fontFamily: "var(--font-sans)" }}
          suppressContentEditableWarning={true}
        />
        {!content && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
            Start writing your note...
          </div>
        )}
      </div>
    </div>
  )
}
