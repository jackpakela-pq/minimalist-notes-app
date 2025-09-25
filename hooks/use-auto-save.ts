"use client"

import { useEffect, useRef } from "react"

interface UseAutoSaveOptions {
  delay?: number
  onSave: () => void
}

export function useAutoSave(value: string, { delay = 2000, onSave }: UseAutoSaveOptions) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const previousValueRef = useRef<string>(value)

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Only set timeout if value has changed
    if (value !== previousValueRef.current) {
      timeoutRef.current = setTimeout(() => {
        onSave()
        previousValueRef.current = value
      }, delay)
    }

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delay, onSave])

  // Update previous value ref when value changes externally (e.g., switching notes)
  useEffect(() => {
    previousValueRef.current = value
  }, [value])
}
