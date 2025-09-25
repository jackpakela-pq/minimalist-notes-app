"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { Note } from "@/types/note"
import { cn } from "@/lib/utils"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const Plus = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Search = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35" />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
    />
    <polyline points="14,2 14,8 20,8" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <polyline points="10,9 9,9 8,9" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const Trash2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="3,6 5,6 21,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    />
    <line x1="10" y1="11" x2="10" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <line x1="14" y1="11" x2="14" y2="17" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const ChevronLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="15,18 9,12 15,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const ChevronRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="9,18 15,12 9,6" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

const MoreVertical = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="12" cy="5" r="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="12" cy="19" r="1" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

interface NotesSidebarProps {
  notes: Note[]
  activeNoteId: string | null
  onNoteSelect: (id: string) => void
  onNoteCreate: () => void
  onNoteDelete: (id: string) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

export function NotesSidebar({
  notes,
  activeNoteId,
  onNoteSelect,
  onNoteCreate,
  onNoteDelete,
  collapsed,
  onToggleCollapse,
}: NotesSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (date: Date) => {
    const now = new Date()
    const noteDate = new Date(date)
    const diffInHours = (now.getTime() - noteDate.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return noteDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24 * 7) {
      return noteDate.toLocaleDateString([], { weekday: "short" })
    } else {
      return noteDate.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const getPreview = (content: string) => {
    // First strip HTML tags completely
    const withoutHtml = content.replace(/<[^>]*>/g, "")
    const withoutEntities = withoutHtml
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&[a-zA-Z0-9#]+;/g, "") // Remove any other HTML entities
    // Strip markdown formatting characters
    const withoutMarkdown = withoutEntities
      .replace(/[#*`~_[\]]/g, "")
      .replace(/^>\s*/gm, "")
      .replace(/^\s*[-*+]\s+/gm, "")
      .replace(/^\s*\d+\.\s+/gm, "")
    // Clean up extra whitespace and normalize
    const cleaned = withoutMarkdown.replace(/\s+/g, " ").trim()
    return cleaned.substring(0, 60) + (cleaned.length > 60 ? "..." : "")
  }

  return (
    <div
      className={cn(
        "glass-ultra border-r border-border/30 flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-80",
      )}
    >
      {/* Header */}
      <div className="p-4 border-border/30 py-2 border-b-0">
        <div className="flex items-center justify-between">
          {!collapsed && <h1 className="text-xl font-light text-foreground drop-shadow-sm">Notes</h1>}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onNoteCreate}
                    className="glass h-8 w-8 p-0 hover:glass-strong transition-all duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="glass-strong">
                  <p>New Note</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {!collapsed && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onToggleCollapse}
                      className="glass h-8 w-8 p-0 hover:glass-strong transition-all duration-200"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="glass-strong">
                    <p>Collapse</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        {/* Search */}
        {!collapsed && (
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass border-border/50 focus-visible:ring-primary/50 focus-visible:glass-strong transition-all duration-200"
            />
          </div>
        )}
      </div>

      {collapsed && (
        <div className="p-2 flex justify-center py-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="glass h-8 w-8 p-0 hover:glass-strong transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="glass-strong">
                <p>Expand</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* Notes List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {collapsed ? (
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              ) : (
                <>
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">{searchQuery ? "No notes found" : "No notes yet"}</p>
                  {!searchQuery && <p className="text-xs mt-1">Create your first note to get started</p>}
                </>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className={cn(
                    "group relative rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-accent/30",
                    activeNoteId === note.id && "bg-accent/50 ring-1 ring-primary/30",
                    collapsed && "p-2",
                  )}
                  onClick={() => onNoteSelect(note.id)}
                >
                  {collapsed ? (
                    <div className="flex items-center justify-center">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm text-foreground truncate">{note.title || "Untitled"}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {getPreview(note.content) || "No content"}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-xs text-muted-foreground">{formatDate(note.updatedAt)}</span>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="glass h-6 w-6 p-0 hover:glass-strong transition-all duration-200"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="glass-strong">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onNoteDelete(note.id)
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-border/30">
          <div className="text-xs text-muted-foreground text-center">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </div>
        </div>
      )}
    </div>
  )
}
