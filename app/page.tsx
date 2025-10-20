"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Menu } from "lucide-react"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

type Language = "zh" | "ja"

const translations = {
  zh: {
    developer: "DEVELOPER & DESIGNER",
    greeting: "你好，我是镜芊，很高兴认识你！",
    nightGreeting: "夜深了，今天过的怎么样？",
    githubRecord: "这是我的",
    record: "记录",
    friendLinks: "友情链接",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year} 年 ${month} 月 ${day} 日 星期${weekday}`,
    footer: "2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
  },
  ja: {
    developer: "開発者 & デザイナー",
    greeting: "こんにちは、私は鏡芊です。よろしくお願いします！",
    nightGreeting: "夜が更けました、今日はどうでしたか？",
    githubRecord: "これは私の",
    record: "記録",
    friendLinks: "友情リンク",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year}年${month}月${day}日 ${weekday}曜日`,
    footer: "2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
  },
}

export default function ProfilePage() {
  const [language, setLanguage] = useState<Language>("zh")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hitokoto, setHitokoto] = useState<Hitokoto>({
    hitokoto: "加載中...",
    from: "",
    from_who: null,
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const t = translations[language]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const fetchHitokoto = async () => {
      try {
        const response = await fetch("https://v1.hitokoto.cn/")
        const data = await response.json()
        setHitokoto(data)
      } catch (error) {
        console.error("[v0] Failed to fetch hitokoto:", error)
      }
    }

    fetchHitokoto()
    const interval = setInterval(fetchHitokoto, 5000)

    return () => clearInterval(interval)
  }, [])

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const weekday = t.weekdays[date.getDay()]
    return t.dateFormat(year, month, day, weekday)
  }

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    const seconds = String(date.getSeconds()).padStart(2, "0")
    return `${hours}:${minutes}:${seconds}`
  }

  const friendLinks = [
    { name: "智教联盟", url: "https://forum.smart-teach.cn/" },
    { name: "Class Widgets", url: "https://classwidgets.rinlit.cn/" },
    { name: "ATCraft Network", url: "https://atcraftmc.cn/" },
    { name: "星轨旅行奇想社", url: "https://next.tics.top/" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0">
        <Image src="/background.jpg" alt="Background" fill className="object-cover opacity-30" priority />
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-4">
        <div className="flex justify-between items-center lg:justify-end">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLanguage(language === "zh" ? "ja" : "zh")}
            className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors text-sm"
          >
            {language === "zh" ? "日本語" : "中文"}
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-4 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl mx-auto">
          <div className="flex flex-col items-start space-y-6 lg:pr-8">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden">
              <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
            </div>

            <div className="text-left">
              <h1 className="text-4xl font-bold">镜芊</h1>
              <p className="text-sm text-muted-foreground mt-2" lang={language}>
                {t.developer}
              </p>
            </div>

            <div className="w-full max-w-xs bg-muted/40 backdrop-blur-sm p-3 font-mono text-sm border border-border/30">
              <code className="text-muted-foreground">print("Hello, World!")</code>
            </div>

            <p className="text-left text-foreground/90 max-w-xs" lang={language}>
              {t.greeting}
            </p>

            <a
              href="https://github.com/TCYKyousen"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>

          <div className={`space-y-6 ${mobileMenuOpen ? "block" : "hidden lg:block"}`}>
            <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground text-sm" lang={language}>
                  {formatDate(currentTime)}
                </p>
                <p className="text-5xl font-bold font-mono tracking-wider">{formatTime(currentTime)}</p>
                <p className="text-muted-foreground text-sm" lang={language}>
                  {t.nightGreeting}
                </p>
              </div>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
              <div className="text-center space-y-2">
                <p className="text-lg text-balance">"{hitokoto.hitokoto}"</p>
                <p className="text-sm text-muted-foreground">
                  ——《{hitokoto.from}》{hitokoto.from_who && ` · ${hitokoto.from_who}`}
                </p>
              </div>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
              <h2 className="text-xl font-bold mb-4 text-center" lang={language}>
                {t.friendLinks}
              </h2>
              <div className="space-y-3">
                {friendLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 px-4 bg-muted/40 backdrop-blur-sm hover:bg-accent/50 transition-colors border border-border/50 rounded-none"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </Card>

            <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground" lang={language}>
                  {t.githubRecord}{" "}
                  <a
                    href="https://github.com/TCYKyousen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>{" "}
                  {t.record}
                </p>
                <div className="w-full overflow-hidden">
                  <Image
                    src="https://github-readme-activity-graph.vercel.app/graph?username=TCYKyousen&theme=github-compact&hide_border=true&bg_color=161b22"
                    alt="GitHub Activity Graph"
                    width={800}
                    height={400}
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <footer className="relative z-10 py-4 mt-8">
        <div className="container mx-auto px-4">
          <div className="bg-card/30 backdrop-blur-xl border-t border-border/50 py-4">
            <p className="text-center text-sm text-muted-foreground">{t.footer}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
