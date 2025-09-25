"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Palette = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="13.5" cy="6.5" r=".5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="17.5" cy="10.5" r=".5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="8.5" cy="7.5" r=".5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <circle cx="6.5" cy="12.5" r=".5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"
    />
  </svg>
)

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20,6 9,17 4,12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
  </svg>
)

interface BackgroundCustomizerProps {
  currentVariant: string
  onVariantChange: (variant: string) => void
}

export function BackgroundCustomizer({ currentVariant, onVariantChange }: BackgroundCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false)

  const backgroundOptions = [
    { id: "default", name: "Deep Blue", description: "Classic dark blue with subtle gradients" },
    { id: "light", name: "Light Blue", description: "Bright and airy light blue theme" },
    { id: "ocean", name: "Ocean Depths", description: "Deeper blues with aqua highlights" },
    { id: "aurora", name: "Aurora Borealis", description: "Purple and green northern lights" },
    { id: "sunset", name: "Warm Sunset", description: "Orange and pink evening glow" },
  ]

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="glass-ultra h-8 w-8 p-0 hover:bg-accent/50"
            >
              <Palette className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="glass-strong">
            <p className="text-sm">Customize Background</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div className="absolute top-10 right-0 w-64 glass-ultra rounded-lg p-4 border border-border/30 z-50">
          <h3 className="text-sm font-medium mb-3 text-foreground">Background Theme</h3>
          <div className="space-y-2">
            {backgroundOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onVariantChange(option.id)
                  setIsOpen(false)
                }}
                className="w-full text-left p-3 rounded-lg glass hover:glass-strong transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {option.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{option.description}</div>
                  </div>
                  {currentVariant === option.id && <Check className="h-4 w-4 text-primary" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
