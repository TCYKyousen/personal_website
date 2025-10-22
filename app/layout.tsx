"use client"

import { ThemeProvider } from "@/components/theme-provider"
import { useState, useEffect } from "react"
import Image from "next/image"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg")

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch("https://api-images.kanochan.net/api.php?album=Genshin-Impact")
        if (response.ok) {
          setBackgroundImage(response.url)
        }
      } catch (error) {
        console.error("[v0] Failed to fetch background:", error)
      }
    }

    fetchBackground()
  }, [])

  return (
    <html lang="zh" suppressHydrationWarning>
      <head />
      <body>
        <div className="fixed inset-0 z-0">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="relative z-10">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
