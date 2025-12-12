"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useLock } from "@/components/lock-provider"

interface BackgroundSlideshowProps {
  images: string[]
  interval?: number
}

export function BackgroundSlideshow({ images, interval = 10000 }: BackgroundSlideshowProps) {
  const [index, setIndex] = useState(0)
  const { isLocked } = useLock()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (images.length <= 1) return

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length)
    }, interval)

    return () => clearInterval(timer)
  }, [images.length, interval])

  if (!mounted) return null

  // Preload the next image
  const nextIndex = (index + 1) % images.length
  const nextImage = images[nextIndex]

  return createPortal(
    <div className={cn(
      "fixed inset-0 z-[-1] overflow-hidden bg-black transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]",
      // Only slightly dim the background when locked, keep it immersive
      isLocked ? "brightness-75" : ""
    )}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.div
          key={images[index] || "default"}
          className="absolute inset-0 w-full h-full"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-20%" }} 
          transition={{
            x: { type: "tween", duration: 1.2, ease: [0.32, 0.72, 0, 1] },
            opacity: { duration: 0.5 }
          }}
        >
          <Image
            src={images[index] || "/placeholder.svg"}
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Hidden preloader for the next image */}
      {images.length > 1 && (
        <div className="hidden">
           <Image src={nextImage} alt="preload" width={1} height={1} priority />
        </div>
      )}
    </div>,
    document.body
  )
}
