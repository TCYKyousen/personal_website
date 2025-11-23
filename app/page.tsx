"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import {
  Globe,
  Heart,
  Cloud,
  CloudRain,
  CloudSnow,
  Sun,
  Settings,
  Download,
  Eye,
  Moon,
  Palette,
  Clock,
} from "lucide-react"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

type Language = "ja" | "en" | "zh-TW"

const translations = {
  ja: {
    developer: "バイブコーダー",
    greeting: "こんにちは、私はKyousenです。よろしくお願いします！",
    introduction:
      "私は現在、SmartTeachCNのメンバーの一人として、CogniBlockの開発に参加しており、同時にCJKフォントの簡体字字形に関する補完作業を研究しています",
    nightGreeting: "夜が更けました、今日はどうでしたか?",
    morningGreeting: "おはようございます！",
    afternoonGreeting: "こんにちは！",
    eveningGreeting: "こんばんは！",
    githubRecord: "これは私の",
    record: "記録",
    friendLinks: "友情リンク",
    weekdays: ["日", "月", "火", "水", "木", "金", "土"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year}年${month}月${day}日 ${weekday}曜日`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by",
    weather: "天気",
    loading: "読み込み中...",
    worldClock: "世界時計",
    localTime: "現地時間",
    weatherDetails: "天気詳細",
    currentTemp: "現在の温度",
    maxTemp: "最高気温",
    minTemp: "最低気温",
    windSpeed: "風速",
    forecast: "7日間予報",
  },
  en: {
    developer: "VIBE CODER",
    greeting: "Hello, I'm Kyousen, nice to meet you!",
    introduction:
      "I am currently a member of SmartTeachCN, participating in the development of CogniBlock, and researching supplementary work on Simplified Chinese character forms for CJK fonts",
    nightGreeting: "It's late, how was your day?",
    morningGreeting: "Good morning!",
    afternoonGreeting: "Good afternoon!",
    eveningGreeting: "Good evening!",
    githubRecord: "This is my",
    record: "record",
    friendLinks: "Friend Links",
    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dateFormat: (year: number, month: number, day: number, weekday: string) => `${weekday}, ${month}/${day}/${year}`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by",
    weather: "Weather",
    loading: "Loading...",
    worldClock: "World Clock",
    localTime: "Local Time",
    weatherDetails: "Weather Details",
    currentTemp: "Current",
    maxTemp: "High",
    minTemp: "Low",
    windSpeed: "Wind",
    forecast: "7-Day Forecast",
  },
  "zh-TW": {
    developer: "氛圍程式設計師",
    greeting: "你好，我是Kyousen，很高興認識你！",
    introduction:
      "我目前是SmartTeachCN的成員之一，正在參與開發CogniBlock，同時正在鑽研CJK字型的簡體中文字形相關增補工作",
    nightGreeting: "夜深了，今天過得怎麼樣？",
    morningGreeting: "早安！",
    afternoonGreeting: "午安！",
    eveningGreeting: "晚上好！",
    githubRecord: "這是我的",
    record: "記錄",
    friendLinks: "友情連結",
    weekdays: ["日", "一", "二", "三", "四", "五", "六"],
    dateFormat: (year: number, month: number, day: number, weekday: string) =>
      `${year}年${month}月${day}日 星期${weekday}`,
    footer: "© 2023-2025 Kyousen's Personal Page Co-Created by",
    weather: "天氣",
    loading: "載入中...",
    worldClock: "世界時鐘",
    localTime: "當地時間",
    weatherDetails: "天氣詳情",
    currentTemp: "當前溫度",
    maxTemp: "最高溫",
    minTemp: "最低溫",
    windSpeed: "風速",
    forecast: "7日預報",
  },
}

const languageFlags = {
  ja: "🇯🇵",
  en: "🇺🇸",
  "zh-TW": "🇨🇳",
}

const languageNames = {
  ja: "日本語",
  en: "English",
  "zh-TW": "繁體中文",
}

interface WeatherData {
  temperature: number
  weatherCode: number
  city: string
  maxTemp: number
  minTemp: number
  windSpeed: number
  daily: {
    time: string[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    weathercode: number[]
  }
}

interface AppSettings {
  fontFamily: "default" | "serif" | "mono" | "sans-serif" | "custom"
  customFont: string
  eyeProtection: boolean
  cursor: "system" | "dot"
  theme: "dark" | "light"
  showBackground: boolean
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

const getWeatherIcon = (code: number) => {
  if (code === 0) return <Sun className="w-8 h-8 text-yellow-400" />
  if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-gray-400" />
  if (code >= 61 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />
  if (code >= 71 && code <= 77) return <CloudSnow className="w-8 h-8 text-blue-200" />
  return <Cloud className="w-8 h-8 text-gray-400" />
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [loadingBright, setLoadingBright] = useState(true)
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
  const [language, setLanguage] = useState<Language>("ja")
  const [heartCount, setHeartCount] = useState(0)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState(true)
  const [settings, setSettings] = useState<AppSettings>({
    fontFamily: "default",
    customFont: "",
    eyeProtection: false,
    cursor: "system",
    theme: "dark",
    showBackground: true,
  })
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [customCursor, setCustomCursor] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const t = translations[language]

  useEffect(() => {
    const brightInterval = setInterval(() => {
      setLoadingBright((prev) => !prev)
    }, 250)

    const timer = setTimeout(() => {
      clearInterval(brightInterval)
      setIsLoading(false)
      setTimeout(() => {
        setAvatarAnimating(false)
      }, 100)
    }, 2000)

    return () => {
      clearInterval(brightInterval)
      clearTimeout(timer)
    }
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
        let latitude: number
        let longitude: number

        // Try to get precise location from browser geolocation API first
        if ("geolocation" in navigator) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 5000,
              })
            })
            latitude = position.coords.latitude
            longitude = position.coords.longitude
          } catch {
            // Fallback to IP-based geolocation
            const ipResponse = await fetch("https://ipapi.co/json/")
            const ipData = await ipResponse.json()
            latitude = ipData.latitude
            longitude = ipData.longitude
          }
        } else {
          // Fallback to IP-based geolocation
          const ipResponse = await fetch("https://ipapi.co/json/")
          const ipData = await ipResponse.json()
          latitude = ipData.latitude
          longitude = ipData.longitude
        }

        // Get city name with localization from Nominatim
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${language}`,
        )
        const geoData = await geoResponse.json()
        const city =
          geoData.address?.city ||
          geoData.address?.town ||
          geoData.address?.village ||
          geoData.address?.county ||
          "Unknown"

        // Get weather from Open-Meteo
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=7`,
        )
        const weatherData = await weatherResponse.json()

        setWeather({
          temperature: Math.round(weatherData.current.temperature_2m),
          weatherCode: weatherData.current.weathercode,
          city,
          maxTemp: Math.round(weatherData.daily.temperature_2m_max[0]),
          minTemp: Math.round(weatherData.daily.temperature_2m_min[0]),
          windSpeed: Math.round(weatherData.current.windspeed_10m),
          daily: {
            time: weatherData.daily.time,
            temperature_2m_max: weatherData.daily.temperature_2m_max,
            temperature_2m_min: weatherData.daily.temperature_2m_min,
            weathercode: weatherData.daily.weathercode,
          },
        })
        setWeatherLoading(false)
      } catch (error) {
        console.error("[v0] Failed to fetch weather:", error)
        setWeatherLoading(false)
      }
    }

    fetchWeather()
    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 1800000)

    return () => clearInterval(interval)
  }, [language])

  useEffect(() => {
    const savedSettings = localStorage.getItem("appSettings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("appSettings", JSON.stringify(settings))

    // Apply font family
    const root = document.documentElement
    if (settings.fontFamily === "custom" && settings.customFont) {
      root.style.setProperty("--user-font", settings.customFont)
      document.body.style.fontFamily = settings.customFont
    } else {
      const fontMap = {
        default: 'var(--font-misans), "Microsoft Yahei", "Yu Gothic UI", system-ui, sans-serif',
        serif: "Georgia, serif",
        mono: "monospace",
        "sans-serif": "Arial, sans-serif",
        custom: settings.customFont || "system-ui",
      }
      document.body.style.fontFamily = fontMap[settings.fontFamily]
    }

    // Apply eye protection filter
    if (settings.eyeProtection) {
      root.style.filter = "sepia(0.1) brightness(0.95)"
    } else {
      root.style.filter = "none"
    }

    // Apply theme
    if (settings.theme === "light") {
      document.documentElement.classList.remove("dark")
    } else {
      document.documentElement.classList.add("dark")
    }
  }, [settings])

  useEffect(() => {
    if (settings.cursor === "dot") {
      const handleMouseMove = (e: MouseEvent) => {
        setCustomCursor({ x: e.clientX, y: e.clientY })
      }
      window.addEventListener("mousemove", handleMouseMove)
      return () => window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [settings.cursor])

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
      nameEn: "SmartTeachCN",
      url: "https://forum.smart-teach.cn/",
    },
    {
      name: "Class Widgets",
      nameJa: "Class Widgets",
      nameEn: "Class Widgets",
      url: "https://classwidgets.rinlit.cn/",
    },
    {
      name: "ATCraft Network",
      nameJa: "ATCraft Network",
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
      nameEn: "Star Rail Travel Society",
      url: "https://next.tics.top/",
    },
  ]

  const getFriendLinkName = (link: (typeof friendLinks)[0]) => {
    if (language === "ja") return link.nameJa
    return link.nameEn
  }

  const handleHeartClick = () => {
    const newCount = heartCount + 1
    setHeartCount(newCount)
    localStorage.setItem("heartCount", newCount.toString())
    setIsHeartAnimating(true)
    setTimeout(() => setIsHeartAnimating(false), 300)
  }

  const getWorldClockTime = (timezone: string) => {
    return new Date().toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    })
  }

  const worldClocks = [
    { city: language === "ja" ? "北京" : "Beijing", timezone: "Asia/Shanghai" },
    { city: language === "ja" ? "東京" : "Tokyo", timezone: "Asia/Tokyo" },
    { city: language === "ja" ? "ロンドン" : "London", timezone: "Europe/London" },
    { city: language === "ja" ? "ニューヨーク" : "New York", timezone: "America/New_York" },
    { city: language === "ja" ? "ロサンゼルス" : "Los Angeles", timezone: "America/Los_Angeles" },
    { city: language === "ja" ? "シドニー" : "Sydney", timezone: "Australia/Sydney" },
  ]

  const downloadBackground = async () => {
    try {
      const response = await fetch(backgroundImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "background.jpg"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Failed to download background:", error)
    }
  }

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours()
    if (hour >= 5 && hour < 12) return t.morningGreeting
    if (hour >= 12 && hour < 18) return t.afternoonGreeting
    if (hour >= 18 && hour < 22) return t.eveningGreeting
    return t.nightGreeting
  }

  return (
    <>
      {settings.cursor === "dot" && (
        <div
          className="fixed pointer-events-none z-[9999] w-4 h-4 bg-primary rounded-full transition-transform mix-blend-difference"
          style={{
            left: `${customCursor.x}px`,
            top: `${customCursor.y}px`,
            transform: "translate(-50%, -50%)",
          }}
        />
      )}

      {isLoading && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-colors duration-250 ${
            loadingBright ? "bg-background" : "bg-background/80"
          }`}
        >
          <div className="relative">
            <div
              className={`relative w-32 h-32 rounded-3xl overflow-hidden transition-all duration-250 ${
                loadingBright ? "opacity-100 scale-100" : "opacity-80 scale-95"
              }`}
            >
              <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" priority />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-40 h-40 border-4 rounded-full animate-spin transition-colors duration-250 ${
                  loadingBright ? "border-primary/30 border-t-primary" : "border-primary/20 border-t-primary/70"
                }`}
                style={{ animationDuration: "1s" }}
              />
            </div>
          </div>
        </div>
      )}

      <div
        className={`min-h-screen bg-background text-foreground relative overflow-x-hidden pb-20 transition-opacity duration-700 ${isLoading ? "opacity-0" : "opacity-100"} ${settings.cursor === "dot" ? "cursor-none" : ""}`}
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

        {settings.showBackground && (
          <div className="fixed inset-0 z-0">
            <Image
              src={backgroundImage || "/placeholder.svg"}
              alt="Background"
              fill
              className="object-cover opacity-30"
              priority
            />
          </div>
        )}

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
                <div className="text-left relative">
                  <h1 className="text-4xl font-black">Kyousen</h1>
                  <p className="text-[10px] text-muted-foreground/60 font-light mt-1">ALSO CALLED SEIRAI HARAGUCHI</p>
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
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl cursor-pointer hover:bg-card/40 transition-all">
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground text-sm font-semibold text-left" lang={language}>
                        {formatDate(currentTime)}
                      </p>
                      <p className="text-5xl font-bold font-harmonyos-black tracking-wider text-left">
                        {formatTime(currentTime)}
                      </p>
                      <p className="text-muted-foreground text-sm font-light text-right" lang={language}>
                        {getTimeBasedGreeting()}
                      </p>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Clock className="w-6 h-6" />
                      {t.worldClock}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {worldClocks.map((clock) => (
                      <div key={clock.timezone} className="bg-muted/40 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">{clock.city}</p>
                        <p className="text-2xl font-bold font-harmonyos-black">{getWorldClockTime(clock.timezone)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t.localTime}</p>
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl cursor-pointer hover:bg-card/40 transition-all">
                    <div className="text-center space-y-2">
                      {weatherLoading ? (
                        <p className="text-muted-foreground text-sm">{t.loading}</p>
                      ) : weather ? (
                        <>
                          <p className="text-muted-foreground text-sm font-semibold text-left">{weather.city}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-left">
                              <p className="text-5xl font-bold font-harmonyos-black">{weather.temperature}°C</p>
                            </div>
                            {getWeatherIcon(weather.weatherCode)}
                          </div>
                          <p className="text-muted-foreground text-sm font-light text-right">
                            {weather.maxTemp}° / {weather.minTemp}°
                          </p>
                        </>
                      ) : null}
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl bg-card/95 backdrop-blur-xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{t.weatherDetails}</DialogTitle>
                  </DialogHeader>
                  {weather && (
                    <div className="space-y-6 mt-4">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-muted/40 p-4 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-2">{t.currentTemp}</p>
                          <p className="text-3xl font-bold">{weather.temperature}°C</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-2">{t.maxTemp}</p>
                          <p className="text-3xl font-bold">{weather.maxTemp}°C</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-2">{t.minTemp}</p>
                          <p className="text-3xl font-bold">{weather.minTemp}°C</p>
                        </div>
                        <div className="bg-muted/40 p-4 rounded-lg text-center">
                          <p className="text-xs text-muted-foreground mb-2">{t.windSpeed}</p>
                          <p className="text-3xl font-bold">{weather.windSpeed}</p>
                          <p className="text-xs">km/h</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold mb-3">{t.forecast}</h3>
                        <div className="grid grid-cols-7 gap-2">
                          {weather.daily.time.map((date, index) => (
                            <div key={date} className="bg-muted/40 p-2 rounded-lg text-center">
                              <p className="text-xs text-muted-foreground mb-2">
                                {new Date(date).toLocaleDateString(language === "ja" ? "ja-JP" : "en-US", {
                                  weekday: "short",
                                })}
                              </p>
                              <div className="flex justify-center mb-2">
                                {getWeatherIcon(weather.daily.weathercode[index])}
                              </div>
                              <p className="text-xs font-bold">
                                {Math.round(weather.daily.temperature_2m_max[index])}°
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(weather.daily.temperature_2m_min[index])}°
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-6 rounded-lg shadow-2xl relative overflow-hidden">
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
                <h2 className="text-xl font-black mb-4 text-center" lang={language}>
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
                {t.footer}{" "}
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

              <div className="flex items-center gap-2">
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 backdrop-blur-sm hover:bg-accent/50 transition-colors border border-border/50 rounded-lg">
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-semibold hidden sm:inline">
                        {language === "ja" ? "設定" : "Settings"}
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md bg-card/95 backdrop-blur-xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl">
                        {language === "ja" ? "パーソナライズ設定" : "Personalization"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      {/* Font Settings */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Palette className="w-4 h-4" />
                          {language === "ja" ? "フォント設定" : "Font Settings"}
                        </label>
                        <select
                          value={settings.fontFamily}
                          onChange={(e) =>
                            setSettings({
                              ...settings,
                              fontFamily: e.target.value as AppSettings["fontFamily"],
                            })
                          }
                          className="w-full px-3 py-2 bg-muted/40 border border-border/50 rounded-lg text-sm"
                        >
                          <option value="default">{language === "ja" ? "デフォルト" : "Default"}</option>
                          <option value="serif">{language === "ja" ? "セリフ" : "Serif"}</option>
                          <option value="sans-serif">{language === "ja" ? "サンセリフ" : "Sans Serif"}</option>
                          <option value="mono">{language === "ja" ? "等幅" : "Monospace"}</option>
                          <option value="custom">{language === "ja" ? "カスタム" : "Custom"}</option>
                        </select>
                        {settings.fontFamily === "custom" && (
                          <input
                            type="text"
                            placeholder="e.g., 'Arial', 'Comic Sans MS'"
                            value={settings.customFont}
                            onChange={(e) => setSettings({ ...settings, customFont: e.target.value })}
                            className="w-full px-3 py-2 bg-muted/40 border border-border/50 rounded-lg text-sm"
                          />
                        )}
                      </div>

                      {/* Eye Protection Mode */}
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          {language === "ja" ? "目の保護モード" : "Eye Protection"}
                        </label>
                        <button
                          onClick={() => setSettings({ ...settings, eyeProtection: !settings.eyeProtection })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.eyeProtection ? "bg-primary" : "bg-muted"
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                              settings.eyeProtection ? "translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>

                      {/* Cursor Style */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold">{language === "ja" ? "カーソル" : "Cursor"}</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSettings({ ...settings, cursor: "system" })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                              settings.cursor === "system"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/40 border-border/50"
                            }`}
                          >
                            {language === "ja" ? "システム" : "System"}
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, cursor: "dot" })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                              settings.cursor === "dot"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/40 border-border/50"
                            }`}
                          >
                            {language === "ja" ? "ドット" : "Dot"}
                          </button>
                        </div>
                      </div>

                      {/* Theme */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold flex items-center gap-2">
                          <Moon className="w-4 h-4" />
                          {language === "ja" ? "テーマ" : "Theme"}
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSettings({ ...settings, theme: "dark" })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                              settings.theme === "dark"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/40 border-border/50"
                            }`}
                          >
                            {language === "ja" ? "ダーク" : "Dark"}
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, theme: "light" })}
                            className={`flex-1 px-3 py-2 rounded-lg text-sm border ${
                              settings.theme === "light"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/40 border-border/50"
                            }`}
                          >
                            {language === "ja" ? "ライト" : "Light"}
                          </button>
                        </div>
                      </div>

                      {/* Background Controls */}
                      <div className="space-y-3">
                        <label className="text-sm font-semibold">
                          {language === "ja" ? "背景画像" : "Background Image"}
                        </label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => window.open(backgroundImage, "_blank")}
                            className="flex-1 px-3 py-2 bg-muted/40 hover:bg-accent/50 border border-border/50 rounded-lg text-sm transition-colors"
                          >
                            {language === "ja" ? "表示" : "View"}
                          </button>
                          <button
                            onClick={downloadBackground}
                            className="flex-1 px-3 py-2 bg-muted/40 hover:bg-accent/50 border border-border/50 rounded-lg text-sm transition-colors flex items-center justify-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            {language === "ja" ? "保存" : "Download"}
                          </button>
                          <button
                            onClick={() => setSettings({ ...settings, showBackground: !settings.showBackground })}
                            className={`px-3 py-2 rounded-lg text-sm border ${
                              settings.showBackground
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-muted/40 border-border/50"
                            }`}
                          >
                            {settings.showBackground
                              ? language === "ja"
                                ? "表示"
                                : "ON"
                              : language === "ja"
                                ? "非表示"
                                : "OFF"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-muted/40 backdrop-blur-sm hover:bg-accent/50 transition-colors border border-border/50 rounded-lg">
                      <Globe className="w-4 h-4" />
                      <span className="text-sm font-semibold">
                        {languageFlags[language]} {languageNames[language]}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                    {(Object.keys(translations) as Language[]).map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className="cursor-pointer hover:bg-accent/50"
                      >
                        <span className="mr-2">{languageFlags[lang]}</span>
                        {languageNames[lang]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
