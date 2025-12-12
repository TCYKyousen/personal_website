"use client"

import React, { createContext, useContext, useState, useCallback, useRef } from "react"

interface LockContextType {
  isLocked: boolean
  lock: () => void
  unlock: () => void
}

const LockContext = createContext<LockContextType | null>(null)

export function useLock() {
  const context = useContext(LockContext)
  if (!context) {
    throw new Error("useLock must be used within a LockProvider")
  }
  return context
}

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false)
  
  const lockAudioRef = useRef<HTMLAudioElement | null>(null)
  const unlockAudioRef = useRef<HTMLAudioElement | null>(null)

  React.useEffect(() => {
    lockAudioRef.current = new Audio("/Lock.ogg")
    unlockAudioRef.current = new Audio("/Unlock.ogg")
  }, [])

  // Prevent scrolling when locked
  React.useEffect(() => {
    if (isLocked) {
      // Calculate scrollbar width to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.paddingRight = `${scrollbarWidth}px`
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.paddingRight = ""
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.paddingRight = ""
      document.body.style.overflow = ""
    }
  }, [isLocked])

  const lock = useCallback(() => {
    if (isLocked) return
    setIsLocked(true)
    lockAudioRef.current?.play().catch((e) => console.error("Audio play failed", e))
  }, [isLocked])

  const unlock = useCallback(() => {
    setIsLocked(false)
    unlockAudioRef.current?.play().catch((e) => console.error("Audio play failed", e))
  }, [])

  return (
    <LockContext.Provider value={{ isLocked, lock, unlock }}>
      {children}
    </LockContext.Provider>
  )
}
