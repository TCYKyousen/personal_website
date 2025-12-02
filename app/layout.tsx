import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { Ma_Shan_Zheng, ZCOOL_KuaiLe, Noto_Sans_JP, Noto_Sans_KR, Zen_Kurenaido, Nanum_Pen_Script } from "next/font/google"
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

const maShanZheng = Ma_Shan_Zheng({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-ma-shan-zheng",
  display: "swap",
})

const zcoolKuaiLe = ZCOOL_KuaiLe({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zcool-kuaile",
  display: "swap",
})

const notoSansJP = Noto_Sans_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
})

const notoSansKR = Noto_Sans_KR({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-kr",
  display: "swap",
})

const zenKurenaido = Zen_Kurenaido({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-kurenaido",
  display: "swap",
})

const nanumPenScript = Nanum_Pen_Script({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-nanum-pen-script",
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
      <body
        className={`${miSansLatin.variable} ${harmonyOSBlack.variable} ${maShanZheng.variable} ${zcoolKuaiLe.variable} ${notoSansJP.variable} ${notoSansKR.variable} ${zenKurenaido.variable} ${nanumPenScript.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
