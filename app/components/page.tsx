"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ArrowLeft, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

type Language = "zh" | "ja"

const translations = {
  zh: {
    nightGreeting: "夜深了，今天过的怎么样？",
    githubRecord: "这是我的",
    record: "记录",
    friendLinks: "友情链接",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year} 年 ${month} 月 ${day} 日 星期${weekday}`,
    back: "返回",
  },
  ja: {
    nightGreeting: "夜が更けました、今日はどうでしたか？",
    githubRecord: "これは私の",
    record: "記録",
    friendLinks: "友情リンク",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year}年${month}月${day}日 ${weekday}曜日`,
    back: "戻る",
  },
}

const Ruby = ({ base, text }: { base: string; text: string }) => (
  <ruby>
    {base}
    <rp>(</rp>
    <rt className="text-[0.5em]">{text}</rt>
    <rp>)</rp>
  </ruby>
)

const toJapaneseNewForm = (text: string): string => {
  const conversionMap: { [key: string]: string } = {
    学: "学",
    国: "国",
    会: "会",
    実: "実",
    体: "体",
    図: "図",
    応: "応",
    画: "画",
    気: "気",
    経: "経",
    芸: "芸",
    済: "済",
    歯: "歯",
    写: "写",
    社: "社",
    者: "者",
    証: "証",
    数: "数",
    声: "声",
    戦: "戦",
    単: "単",
    鉄: "鉄",
    転: "転",
    当: "当",
    党: "党",
    独: "独",
    読: "読",
    売: "売",
    発: "発",
    万: "万",
    来: "来",
    両: "両",
    暦: "暦",
    録: "録",
    湾: "湾",
  }

  return text
    .split("")
    .map((char) => conversionMap[char] || char)
    .join("")
}

export default function ComponentsPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("zh")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hitokoto, setHitokoto] = useState<Hitokoto>({
    hitokoto: "加載中...",
    from: "",
    from_who: null,
  })
  const [countdown, setCountdown] = useState(5)
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg")

  const t = translations[language]

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
        setCountdown(5)
      } catch (error) {
        console.error("[v0] Failed to fetch hitokoto:", error)
      }
    }

    fetchHitokoto()
    const interval = setInterval(fetchHitokoto, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 5))
    }, 1000)

    return () => clearInterval(timer)
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
    {
      name: "智教联盟",
      nameJa: (
        <>
          <Ruby base="智" text="ち" />
          <Ruby base="教" text="きょう" />
          <Ruby base="联" text="れん" />
          <Ruby base="盟" text="めい" />
        </>
      ),
      url: "https://forum.smart-teach.cn/",
    },
    { name: "Class Widgets", nameJa: "Class Widgets", url: "https://classwidgets.rinlit.cn/" },
    { name: "ATCraft Network", nameJa: "ATCraft Network", url: "https://atcraftmc.cn/" },
    {
      name: "星轨旅行奇想社",
      nameJa: (
        <>
          <Ruby base="星" text="せい" />
          <Ruby base="轨" text="き" />
          <Ruby base="旅" text="りょ" />
          <Ruby base="行" text="こう" />
          <Ruby base="奇" text="き" />
          <Ruby base="想" text="そう" />
          <Ruby base="社" text="しゃ" />
        </>
      ),
      url: "https://next.tics.top/",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-x-hidden pb-20">
      <div className="fixed inset-0 z-0">
        <Image
          src={backgroundImage || "/placeholder.svg"}
          alt="Background"
          fill
          className="object-cover opacity-30"
          priority
        />
      </div>

      <div className="relative z-10 container mx-auto px-8 lg:px-16 pt-8">
        <div className="flex justify-start items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.back}</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 gap-6 max-w-3xl mx-auto">
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground text-sm" lang={language}>
                {formatDate(currentTime)}
              </p>
              <p className="text-5xl font-bold font-harmonyos-black tracking-wider">{formatTime(currentTime)}</p>
              <p className="text-muted-foreground text-sm" lang={language}>
                {language === "ja" ? (
                  <>
                    <Ruby base="夜" text="よる" />が<Ruby base="更" text="ふ" />
                    けました、
                    <Ruby base="今日" text="きょう" />
                    はどうでしたか？
                  </>
                ) : (
                  t.nightGreeting
                )}
              </p>
            </div>
          </Card>

          <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl relative overflow-hidden">
            <div className="text-center space-y-2 animate-in fade-in duration-500" key={hitokoto.hitokoto}>
              <p className="text-lg text-balance">
                "{language === "ja" ? toJapaneseNewForm(hitokoto.hitokoto) : hitokoto.hitokoto}"
              </p>
              <p className="text-sm text-muted-foreground">
                ——《{language === "ja" ? toJapaneseNewForm(hitokoto.from) : hitokoto.from}》
                {hitokoto.from_who &&
                  ` · ${language === "ja" ? toJapaneseNewForm(hitokoto.from_who) : hitokoto.from_who}`}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/20">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center" lang={language}>
              {language === "ja" ? (
                <>
                  <Ruby base="友" text="ゆう" />
                  <Ruby base="情" text="じょう" />
                  リンク
                </>
              ) : (
                t.friendLinks
              )}
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {friendLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 px-4 bg-muted/40 backdrop-blur-sm hover:bg-accent/50 transition-colors border border-border/50 rounded-none"
                >
                  {language === "ja" ? link.nameJa : link.name}
                </a>
              ))}
            </div>
          </Card>

          <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-none shadow-2xl">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground" lang={language}>
                {language === "ja" ? (
                  <>
                    これは
                    <Ruby base="私" text="わたし" />の{" "}
                    <a
                      href="https://github.com/TCYKyousen"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      GitHub
                    </a>{" "}
                    <Ruby base="記" text="き" />
                    <Ruby base="録" text="ろく" />
                  </>
                ) : (
                  <>
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
                  </>
                )}
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

      <footer className="fixed bottom-0 left-0 right-0 z-20 bg-card/30 backdrop-blur-xl border-t border-border/50">
        <div className="container mx-auto px-8 lg:px-16 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-center text-sm text-muted-foreground">
              2023-2025 Kyousen's Personal Page Co-Created by{" "}
              <a
                href="https://v0.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                v0.dev
              </a>{" "}
              &{" "}
              <a
                href="https://trae.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                TRAE.ai
              </a>
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors text-sm flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {language === "zh" ? "中文" : "日本語"}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-none">
                <DropdownMenuItem onClick={() => setLanguage("zh")} className="cursor-pointer">
                  中文
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ja")} className="cursor-pointer">
                  日本語
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </footer>
    </div>
  )
}
