"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseMouseShakeProps {
  onShake: () => void
  enabled?: boolean
  threshold?: number
  timeout?: number
}

export function useMouseShake({
  onShake,
  enabled = true,
  threshold = 5, // Reversals needed
  timeout = 500, // Time window in ms
}: UseMouseShakeProps) {
  const historyRef = useRef<{ x: number; time: number }[]>([])
  const directionRef = useRef<"left" | "right" | null>(null)
  const reversalsRef = useRef(0)
  const lastShakeTimeRef = useRef(0)

  useEffect(() => {
    if (!enabled) return

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now()
      const x = e.clientX

      // Add to history
      historyRef.current.push({ x, time: now })

      // Keep history short
      if (historyRef.current.length > 2) {
        const prev = historyRef.current[historyRef.current.length - 2]
        const curr = historyRef.current[historyRef.current.length - 1]
        
        const diff = curr.x - prev.x
        const minMovement = 50 // Minimum pixels to count as movement

        if (Math.abs(diff) > minMovement) {
          const currentDirection = diff > 0 ? "right" : "left"

          if (directionRef.current && directionRef.current !== currentDirection) {
            // Reversal detected
            reversalsRef.current++
            
            // Check if threshold met within timeout
            if (reversalsRef.current >= threshold) {
              // Debounce shake event
              if (now - lastShakeTimeRef.current > 1000) {
                onShake()
                lastShakeTimeRef.current = now
                reversalsRef.current = 0
                directionRef.current = null
              }
            }
          } else {
            // Reset if too much time passed between movements
            if (now - prev.time > 150) { // Reset if movement stops briefly
               // Don't reset completely, just don't count this as a reversal yet
            }
          }
          
          directionRef.current = currentDirection
        }
      }

      // Cleanup old history
      const cutoff = now - timeout
      historyRef.current = historyRef.current.filter(p => p.time > cutoff)
      
      // Reset reversals if history gets empty (timeout passed)
      if (historyRef.current.length === 0) {
        reversalsRef.current = 0
        directionRef.current = null
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [enabled, onShake, threshold, timeout])
}
