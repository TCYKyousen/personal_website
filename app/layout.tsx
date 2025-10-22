import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import localFont from "next/font/local"

const miSansLatin = localFont({
  src: "../public/fonts/MiSans-Latin-VF.ttf",
  variable: "--font-misans",
  display: "swap",
})

const harmonyOSBlack = localFont({
  src: "../public/fonts/HarmonyOS-Sans-Black.ttf",
  variable: "--font-harmonyos-black",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Kyousen's Personal Page",
  description: "Personal profile dashboard",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`${miSansLatin.variable} ${harmonyOSBlack.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
