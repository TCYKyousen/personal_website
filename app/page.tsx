"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import {
  Globe,
  Heart,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
  Wind,
} from "lucide-react"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

type Language = "zh" | "ja" | "zh-TW" | "en"

const translations = {
  zh: {
    developer: "DEVELOPER & DESIGNER",
    greeting: "你好，我是镜芊，很高兴认识你！",
    introduction:
      "我目前是SmartTeachCN的成员之一，正在参与开发拾块云集CogniBlock，同时正在钻研CJK字体的简体中文字形相关增补工作",
    nightGreeting: "夜深了，今天过的怎么样？",
    githubRecord: "这是我的",
    record: "记录",
    friendLinks: "友情链接",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year} 年 ${month} 月 ${day} 日 星期${weekday}`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
    weather: "天气",
    loading: "加载中...",
    unknown: "未知",
  },
  ja: {
    developer: "開発者 & デザイナー",
    greeting: "こんにちは、私は鏡芊です。よろしくお願いします！",
    introduction:
      "私は現在、SmartTeachCNのメンバーの一人として、CogniBlockの開発に参加しており、同時にCJKフォントの簡体字字形に関する補完作業を研究しています",
    nightGreeting: "夜が更けました、今日はどうでしたか？",
    githubRecord: "これは私の",
    record: "記録",
    friendLinks: "友情リンク",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year}年${month}月${day}日 ${weekday}曜日`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
    weather: "天気",
    loading: "読み込み中...",
    unknown: "不明",
  },
  "zh-TW": {
    developer: "DEVELOPER & DESIGNER",
    greeting: "你好，我是鏡芊，很高興認識你！",
    introduction:
      "我目前是SmartTeachCN的成員之一，正在參與開發拾塊雲集CogniBlock，同時正在鑽研CJK字體的簡體中文字形相關增補工作",
    nightGreeting: "夜深了，今天過的怎麼樣？",
    githubRecord: "這是我的",
    record: "記錄",
    friendLinks: "友情連結",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year} 年 ${month} 月 ${day} 日 星期${weekday}`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
    weather: "天氣",
    loading: "加載中...",
    unknown: "未知",
  },
  en: {
    developer: "DEVELOPER & DESIGNER",
    greeting: "Hello, I'm Kyousen, nice to meet you!",
    introduction:
      "I am currently a member of SmartTeachCN, participating in the development of CogniBlock, and researching supplementary work on Simplified Chinese character forms for CJK fonts",
    nightGreeting: "It's late, how was your day?",
    githubRecord: "This is my",
    record: "record",
    friendLinks: "Friend Links",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dateFormat: (year: number, month: number, day: number, weekday: string) => `${weekday}, ${month}/${day}/${year}`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by v0.dev & TRAE.ai",
    weather: "Weather",
    loading: "Loading...",
    unknown: "Unknown",
  },
}

const languageFlags = {
  zh: "🇨🇳",
  ja: "🇯🇵",
  "zh-TW": "🇹🇼",
  en: "🇺🇸",
}

const languageNames = {
  zh: "简体中文",
  ja: "日本語",
  "zh-TW": "繁體中文",
  en: "English",
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

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [avatarAnimating, setAvatarAnimating] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hitokoto, setHitokoto] = useState<Hitokoto>({
    hitokoto: "加載中...",
    from: "",
    from_who: null,
  })
  const [countdown, setCountdown] = useState(5)
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg")
  const [hasKana, setHasKana] = useState(false)
  const [language, setLanguage] = useState<Language>("zh")
  const [heartCount, setHeartCount] = useState(0)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [weatherData, setWeatherData] = useState<{ temp: number; code: number; city: string } | null>(null)

  const t = translations[language]

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        setAvatarAnimating(false)
      }, 100)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

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
        const response = await fetch("/api/hitokoto")
        const data = await response.json()
        setHitokoto(data)
        setCountdown(5)
        const kanaRegex = /[\u3040-\u309F\u30A0-\u30FF]/
        setHasKana(kanaRegex.test(data.hitokoto))
      } catch (error) {
        console.error("[v0] Failed to fetch hitokoto:", error)
        setHitokoto({
          hitokoto: "事物的发展是前进性与曲折性的统一",
          from: "Jane",
          from_who: null,
        })
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

  useEffect(() => {
    const savedCount = localStorage.getItem("heartCount")
    if (savedCount) {
      setHeartCount(Number.parseInt(savedCount, 10))
    }
  }, [])

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Try to get location from ipapi.co
        const geoRes = await fetch("https://ipapi.co/json/")
        if (!geoRes.ok) throw new Error("Geo fetch failed")
        const geoData = await geoRes.json()
        const { latitude, longitude, city } = geoData

        // Get weather from Open-Meteo
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        )
        if (!weatherRes.ok) throw new Error("Weather fetch failed")
        const weatherData = await weatherRes.json()

        setWeatherData({
          temp: weatherData.current_weather.temperature,
          code: weatherData.current_weather.weathercode,
          city: city,
        })
      } catch (error) {
        console.error("[v0] Weather fetch error:", error)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 1800000) // Refresh every 30 mins

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
    {
      name: "智教联盟",
      nameJa: (
        <>
          <Ruby base="智" text="ち" />
          <Ruby base="教" text="きょう" />
          <Ruby base="連" text="れん" />
          <Ruby base="盟" text="めい" />
        </>
      ),
      nameTW: "智教聯盟",
      nameEn: "SmartTeachCN",
      url: "https://forum.smart-teach.cn/",
    },
    {
      name: "Class Widgets",
      nameJa: "Class Widgets",
      nameTW: "Class Widgets",
      nameEn: "Class Widgets",
      url: "https://classwidgets.rinlit.cn/",
    },
    {
      name: "ATCraft Network",
      nameJa: "ATCraft Network",
      nameTW: "ATCraft Network",
      nameEn: "ATCraft Network",
      url: "https://atcraftmc.cn/",
    },
    {
      name: "星轨旅行奇想社",
      nameJa: (
        <>
          <Ruby base="星" text="せい" />
          <Ruby base="軌" text="き" />
          <Ruby base="旅" text="りょ" />
          <Ruby base="行" text="こう" />
          <Ruby base="奇" text="き" />
          <Ruby base="想" text="そう" />
          <Ruby base="社" text="しゃ" />
        </>
      ),
      nameTW: "星軌旅行奇想社",
      nameEn: "Star Rail Travel Society",
      url: "https://next.tics.top/",
    },
  ]

  const getFriendLinkName = (link: (typeof friendLinks)[0]) => {
    if (language === "ja") return link.nameJa
    if (language === "zh-TW") return link.nameTW
    if (language === "en") return link.nameEn
    return link.name
  }

  const handleHeartClick = () => {
    const newCount = heartCount + 1
    setHeartCount(newCount)
    localStorage.setItem("heartCount", newCount.toString())
    setIsHeartAnimating(true)
    setTimeout(() => setIsHeartAnimating(false), 300)
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-8 h-8 text-yellow-500" />
    if (code === 2 || code === 3) return <Cloud className="w-8 h-8 text-gray-400" />
    if (code >= 45 && code <= 48) return <CloudFog className="w-8 h-8 text-gray-400" />
    if (code >= 51 && code <= 67) return <CloudDrizzle className="w-8 h-8 text-blue-400" />
    if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-white" />
    if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-500" />
    if (code >= 85 && code <= 86) return <CloudSnow className="w-8 h-8 text-white" />
    if (code >= 95 && code <= 99) return <CloudLightning className="w-8 h-8 text-yellow-400" />
    return <Sun className="w-8 h-8 text-yellow-500" />
  }

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
          <div className="relative">
            <div className="relative w-32 h-32 rounded-3xl overflow-hidden">
              <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-40 h-40 border-4 border-primary/30 border-t-primary rounded-full animate-spin"
                style={{ animationDuration: "1s" }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen bg-background text-foreground relative overflow-x-hidden pb-20 transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"}`}
      >
        <div className="fixed top-8 right-8 z-30">
          <button
            onClick={handleHeartClick}
            className={`flex items-center gap-2 px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-lg hover:bg-accent/50 transition-all ${
              isHeartAnimating ? "scale-125" : "scale-100"
            }`}
          >
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="text-sm font-black">{heartCount}</span>
          </button>
        </div>

        <div className="fixed inset-0 z-0">
          <Image
            src={backgroundImage || "/placeholder.svg"}
            alt="Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>

        <div className="relative z-10 container mx-auto px-8 lg:px-16 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="flex flex-col items-start space-y-6 lg:pr-8">
              <div
                className={`relative w-32 h-32 rounded-3xl overflow-hidden transition-all duration-1000 ease-out ${
                  avatarAnimating ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50" : "relative"
                }`}
              >
                <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
              </div>

              <div className={`transition-opacity duration-700 ${avatarAnimating ? "opacity-0" : "opacity-100"}`}>
                <div className="text-left">
                  <h1 className="text-4xl font-black">{language === "ja" ? toJapaneseNewForm("镜芊") : "镜芊"}</h1>
                  <p className="text-sm text-muted-foreground mt-2 font-extralight" lang={language}>
                    {t.developer}
                  </p>
                </div>

                <div className="w-full max-w-xs bg-muted/40 backdrop-blur-sm p-3 font-mono text-sm border border-border/30 rounded-lg mt-6 font-black">
                  <code className="text-muted-foreground font-mono text-base">print("Hello, World!")</code>
                </div>

                <p className="text-left text-foreground/90 max-w-xs mt-6 font-medium" lang={language}>
                  {t.greeting}
                </p>

                <p
                  className="text-left text-foreground/80 text-sm max-w-xs mt-4 leading-relaxed opacity-[0.51]"
                  lang={language}
                >
                  {t.introduction}
                </p>

                <div className="flex items-center gap-4 mt-6">
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
                  <a
                    href="https://x.com/kyousenk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 transition-opacity duration-700 delay-300 ${
                avatarAnimating ? "opacity-0" : "opacity-100"
              }`}
            >
              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl">
                <div className="text-center space-y-2">
                  <p className="text-muted-foreground text-sm font-semibold text-left" lang={language}>
                    {formatDate(currentTime)}
                  </p>
                  <p className="text-5xl font-bold font-harmonyos-black tracking-wider text-left">
                    {formatTime(currentTime)}
                  </p>
                  <p className="text-muted-foreground text-sm font-light text-right" lang={language}>
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

              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-muted-foreground text-sm font-semibold" lang={language}>
                      {t.weather}
                    </p>
                    <p className="text-3xl font-bold font-harmonyos-black mt-2">
                      {weatherData ? `${weatherData.temp}°C` : t.loading}
                    </p>
                  </div>
                  {weatherData ? (
                    getWeatherIcon(weatherData.code)
                  ) : (
                    <Wind className="w-8 h-8 text-gray-400 animate-pulse" />
                  )}
                </div>
                <div className="text-right mt-4">
                  <p className="text-muted-foreground text-sm font-medium">
                    {weatherData ? weatherData.city : t.unknown}
                  </p>
                </div>
              </Card>

              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl md:col-span-2 relative overflow-hidden">
                <div
                  className={`text-center space-y-2 animate-in fade-in duration-500 ${hasKana ? "font-yugothic" : ""}`}
                  key={hitokoto.hitokoto}
                  lang={hasKana ? "ja" : language}
                >
                  <p className="text-lg text-balance font-black text-left">
                    "{language === "ja" ? toJapaneseNewForm(hitokoto.hitokoto) : hitokoto.hitokoto}"
                  </p>
                  <p className="text-sm text-muted-foreground font-bold text-right">
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

              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl md:col-span-2">
                <h2 className="text-xl font-black mb-[-15px] text-center" lang={language}>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {friendLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-3 px-4 bg-muted/40 backdrop-blur-sm hover:bg-accent/50 transition-colors border border-border/50 rounded-lg font-semibold"
                    >
                      {getFriendLinkName(link)}
                    </a>
                  ))}
                </div>
              </Card>

              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl md:col-span-2">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground text-center" lang={language}>
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
                          className="text-primary hover:underline font-bold"
                        >
                          GitHub
                        </a>{" "}
                        {t.record}
                      </>
                    )}
                  </p>
                  <div className="w-full overflow-hidden rounded-lg">
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

        <footer className="fixed bottom-0 left-0 right-0 z-20 bg-card/30 backdrop-blur-xl border-t border-border/50">
          <div className="container mx-auto px-8 lg:px-16 py-3">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-center text-sm text-muted-foreground font-bold">
                {t.footer.split("v0.dev")[0]}
                <a
                  href="https://v0.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  v0.dev
                </a>
                {" & "}
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
                <DropdownMenuTrigger className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-lg hover:bg-accent/50 transition-colors text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-black">
                    {languageFlags[language]} {languageNames[language]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card/95 backdrop-blur-xl border-border/50 rounded-lg">
                  <DropdownMenuItem onClick={() => setLanguage("zh")} className="cursor-pointer">
                    {languageFlags.zh} {languageNames.zh}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("zh-TW")} className="cursor-pointer">
                    {languageFlags["zh-TW"]} {languageNames["zh-TW"]}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("ja")} className="cursor-pointer">
                    {languageFlags.ja} {languageNames.ja}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("en")} className="cursor-pointer">
                    {languageFlags.en} {languageNames.en}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
