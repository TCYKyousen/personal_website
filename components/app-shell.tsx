"use client"

import React from "react"
import { LockScreen } from "@/components/lock-screen"
import { cn } from "@/lib/utils"
import { useLock } from "@/components/lock-provider"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { isLocked } = useLock()

  return (
    <>
      <div
        className={cn(
          "min-h-screen transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
          isLocked ? "scale-95 blur-sm brightness-50 pointer-events-none" : ""
        )}
      >
        {children}
      </div>

      <LockScreen />
    </>
  )
}