"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  Github,
} from "lucide-react"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

type Language = "ja" | "en" // Removed "zh" and "zh-TW"

const translations = {
  ja: {
    developer: "開発者 & デザイナー",
    greeting: "こんにちは、私はKyousenです。よろしくお願いします！",
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
    worldClock: {
      title: "世界時計",
      description: "世界各地の現在時刻を確認",
      beijing: "北京",
      tokyo: "東京",
      london: "ロンドン",
      newYork: "ニューヨーク",
      losAngeles: "ロサンゼルス",
      sydney: "シドニー",
    },
    weatherDetail: {
      title: "天気詳細",
      description: "詳細な天気情報",
      current: "現在の気温",
      high: "最高気温",
      low: "最低気温",
      wind: "風速",
      forecast: "7日間予報",
    },
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
    worldClock: {
      title: "World Clock",
      description: "View current time around the world",
      beijing: "Beijing",
      tokyo: "Tokyo",
      london: "London",
      newYork: "New York",
      losAngeles: "Los Angeles",
      sydney: "Sydney",
    },
    weatherDetail: {
      title: "Weather Details",
      description: "Detailed weather information",
      current: "Current",
      high: "High",
      low: "Low",
      wind: "Wind",
      forecast: "7-Day Forecast",
    },
  },
} // Removed zh and zh-TW translations

const languageFlags = {
  ja: "🇯🇵",
  en: "🇺🇸",
} // Removed Chinese language flags

const languageNames = {
  ja: "日本語",
  en: "English",
} // Removed Chinese language names

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
    单: "単",
    鉄: "鉄",
    转: "転",
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
    hitokoto: "加载中...",
    from: "",
    from_who: null,
  })
  const [countdown, setCountdown] = useState(5)
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg")
  const [hasKana, setHasKana] = useState(false)
  const [language, setLanguage] = useState<Language>("ja") // Default to Japanese

  const [heartCount, setHeartCount] = useState(0)
  const [isHeartAnimating, setIsHeartAnimating] = useState(false)
  const [weatherData, setWeatherData] = useState<{ temp: number; code: number; city: string } | null>(null)
  const [isClockDialogOpen, setIsClockDialogOpen] = useState(false)
  const [isWeatherDialogOpen, setIsWeatherDialogOpen] = useState(false)
  const [worldClocks, setWorldClocks] = useState<{ city: string; timezone: string; time: string }[]>([])
  const [detailedWeather, setDetailedWeather] = useState<any>(null)

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
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords

              const langCode = language === "ja" ? "ja" : "en"
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=${langCode}`,
                {
                  headers: {
                    "User-Agent": "KyousenPersonalPage/1.0",
                  },
                },
              )
              const geoData = await geoRes.json()
              const city =
                geoData.address?.city ||
                geoData.address?.town ||
                geoData.address?.village ||
                geoData.address?.county ||
                t.unknown

              // Get weather from Open-Meteo
              const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
              )
              const weatherData = await weatherRes.json()

              setWeatherData({
                temp: weatherData.current_weather.temperature,
                code: weatherData.current_weather.weathercode,
                city: city,
              })
            },
            async (error) => {
              console.error("[v0] Geolocation error:", error)
              // Fallback to IP-based location
              const geoRes = await fetch("https://ipapi.co/json/")
              const geoData = await geoRes.json()
              const { latitude, longitude, city } = geoData

              const weatherRes = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
              )
              const weatherData = await weatherRes.json()

              setWeatherData({
                temp: weatherData.current_weather.temperature,
                code: weatherData.current_weather.weathercode,
                city: city,
              })
            },
          )
        } else {
          // Fallback to IP-based location
          const geoRes = await fetch("https://ipapi.co/json/")
          const geoData = await geoRes.json()
          const { latitude, longitude, city } = geoData

          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
          )
          const weatherData = await weatherRes.json()

          setWeatherData({
            temp: weatherData.current_weather.temperature,
            code: weatherData.current_weather.weathercode,
            city: city,
          })
        }
      } catch (error) {
        console.error("[v0] Weather fetch error:", error)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 1800000) // Refresh every 30 mins

    return () => clearInterval(interval)
  }, [language, t.unknown])

  useEffect(() => {
    if (!isClockDialogOpen) return

    const timezones = [
      { city: t.worldClock?.beijing || "北京", timezone: "Asia/Shanghai" },
      { city: t.worldClock?.tokyo || "东京", timezone: "Asia/Tokyo" },
      { city: t.worldClock?.london || "伦敦", timezone: "Europe/London" },
      { city: t.worldClock?.newYork || "纽约", timezone: "America/New_York" },
      { city: t.worldClock?.losAngeles || "洛杉矶", timezone: "America/Los_Angeles" },
      { city: t.worldClock?.sydney || "悉尼", timezone: "Australia/Sydney" },
    ]

    const updateWorldClocks = () => {
      const clocks = timezones.map((tz) => {
        const time = new Date().toLocaleTimeString("zh-CN", {
          timeZone: tz.timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        return { ...tz, time }
      })
      setWorldClocks(clocks)
    }

    updateWorldClocks()
    const interval = setInterval(updateWorldClocks, 1000)

    return () => clearInterval(interval)
  }, [isClockDialogOpen, language])

  useEffect(() => {
    if (!isWeatherDialogOpen || !weatherData) return

    const fetchDetailedWeather = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords
              const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
              )
              const data = await res.json()
              setDetailedWeather(data)
            },
            async () => {
              const geoRes = await fetch("https://ipapi.co/json/")
              const geoData = await geoRes.json()
              const { latitude, longitude } = geoData
              const res = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation_probability,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`,
              )
              const data = await res.json()
              setDetailedWeather(data)
            },
          )
        }
      } catch (error) {
        console.error("[v0] Detailed weather fetch error:", error)
      }
    }

    fetchDetailedWeather()
  }, [isWeatherDialogOpen, weatherData])

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
      nameJa: "Class Widgets",
      nameEn: "Class Widgets",
      url: "https://classwidgets.rinlit.cn/",
    },
    {
      nameJa: "ATCraft Network",
      nameEn: "ATCraft Network",
      url: "https://atcraftmc.cn/",
    },
    {
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
  ] // Removed name, nameTW properties

  const getFriendLinkName = (link: (typeof friendLinks)[0]) => {
    return language === "ja" ? link.nameJa : link.nameEn
  } // Simplified to only ja and en

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
                  <h1 className="text-4xl font-black">Kyousen</h1>
                  <p className="text-xs text-muted-foreground/60 mt-1 font-light tracking-wide">
                    ALSO CALLED SEIRAI HARAGUCHI
                  </p>
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
                    <Github className="w-8 h-8" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 auto-rows-fr">
              {/* Time Card */}
              <Dialog open={isClockDialogOpen} onOpenChange={setIsClockDialogOpen}>
                <DialogTrigger asChild>
                  <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/50 rounded-lg hover:bg-accent/50 transition-all cursor-pointer h-full min-h-[180px] flex flex-col justify-center">
                    <div className="text-sm text-muted-foreground mb-2">{formatDate(currentTime)}</div>
                    <div className="text-5xl font-harmonyos-black mb-4">{formatTime(currentTime)}</div>
                    <div className="text-sm text-muted-foreground">
                      {currentTime.getHours() >= 22 || currentTime.getHours() < 6 ? t.nightGreeting : t.greeting}
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-xl border-border max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" lang={language}>
                      {t.worldClock?.title || "世界时钟"}
                    </DialogTitle>
                    <DialogDescription lang={language}>
                      {t.worldClock?.description || "查看全球各地的当前时间"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {worldClocks.map((clock) => (
                      <Card key={clock.timezone} className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
                        <p className="text-muted-foreground text-sm mb-1">{clock.city}</p>
                        <p className="text-2xl font-bold font-harmonyos-black">{clock.time}</p>
                      </Card>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Weather Card */}
              <Dialog open={isWeatherDialogOpen} onOpenChange={setIsWeatherDialogOpen}>
                <DialogTrigger asChild>
                  <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/50 rounded-lg hover:bg-accent/50 transition-all cursor-pointer h-full min-h-[180px] flex flex-col justify-center">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {weatherData ? getWeatherIcon(weatherData.code) : <Sun className="w-8 h-8 text-gray-400" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-muted-foreground mb-1">{t.weather}</div>
                        <div className="text-3xl font-harmonyos-black">
                          {weatherData ? `${Math.round(weatherData.temp)}°C` : t.loading}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 truncate">
                          {weatherData ? weatherData.city : "..."}
                        </div>
                      </div>
                    </div>
                  </Card>
                </DialogTrigger>
                <DialogContent className="bg-card/95 backdrop-blur-xl border-border max-w-3xl">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-bold" lang={language}>
                      {t.weatherDetail?.title || "天气详情"}
                    </DialogTitle>
                    <DialogDescription lang={language}>
                      {weatherData?.city} - {t.weatherDetail?.description || "详细天气信息"}
                    </DialogDescription>
                  </DialogHeader>
                  {detailedWeather && (
                    <div className="space-y-6 mt-4">
                      {/* Current Weather */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">{t.weatherDetail?.current || "当前温度"}</p>
                          <p className="text-5xl font-bold font-harmonyos-black">
                            {detailedWeather.current_weather.temperature}°C
                          </p>
                        </div>
                        {getWeatherIcon(detailedWeather.current_weather.weathercode)}
                      </div>

                      {/* Today's High/Low */}
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
                          <p className="text-muted-foreground text-sm">{t.weatherDetail?.high || "最高温"}</p>
                          <p className="text-2xl font-bold">{detailedWeather.daily.temperature_2m_max[0]}°C</p>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
                          <p className="text-muted-foreground text-sm">{t.weatherDetail?.low || "最低温"}</p>
                          <p className="text-2xl font-bold">{detailedWeather.daily.temperature_2m_min[0]}°C</p>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4">
                          <p className="text-muted-foreground text-sm">{t.weatherDetail?.wind || "风速"}</p>
                          <p className="text-2xl font-bold">{detailedWeather.current_weather.windspeed} km/h</p>
                        </Card>
                      </div>

                      {/* 7-Day Forecast */}
                      <div>
                        <p className="text-muted-foreground text-sm mb-3">{t.weatherDetail?.forecast || "未来7天"}</p>
                        <div className="grid grid-cols-7 gap-2">
                          {detailedWeather.daily.temperature_2m_max.slice(0, 7).map((temp: number, i: number) => (
                            <Card key={i} className="bg-card/50 backdrop-blur-sm border-border/50 p-2 text-center">
                              <p className="text-xs text-muted-foreground mb-1">
                                {new Date(detailedWeather.daily.time[i]).toLocaleDateString(
                                  language === "ja"
                                    ? "ja-JP"
                                    : language === "zh-TW"
                                      ? "zh-TW"
                                      : language === "en"
                                        ? "en-US"
                                        : "zh-CN",
                                  { weekday: "short" },
                                )}
                              </p>
                              <p className="text-lg font-bold">{Math.round(temp)}°</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(detailedWeather.daily.temperature_2m_min[i])}°
                              </p>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Hitokoto Card */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/50 rounded-lg md:col-span-2 relative overflow-hidden h-full min-h-[150px] flex flex-col justify-center">
                <div
                  className={`text-lg mb-2 transition-all duration-300 ${hasKana ? "font-yugothic" : ""} ${
                    language === "ja" ? toJapaneseNewForm(hitokoto.hitokoto) : hitokoto.hitokoto
                  }`}
                >
                  {language === "ja" ? `"${toJapaneseNewForm(hitokoto.hitokoto)}"` : `"${hitokoto.hitokoto}"`}
                </div>
                <div className="text-sm text-muted-foreground">
                  —— {language === "ja" ? `《${toJapaneseNewForm(hitokoto.from)}》` : `《${hitokoto.from}》`}
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 bg-primary/30 transition-all duration-1000"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </Card>

              {/* Friend Links */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/50 rounded-lg md:col-span-2 h-full min-h-[120px]">
                <h3 className="text-lg font-bold mb-4">
                  {language === "ja" ? (
                    <>
                      <Ruby base="友" text="ゆう" />
                      <Ruby base="情" text="じょう" />
                      リンク
                    </>
                  ) : (
                    t.friendLinks
                  )}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {friendLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-background/50 hover:bg-accent border border-border/50 rounded-lg text-center text-sm transition-all hover:scale-105"
                    >
                      {getFriendLinkName(link)}
                    </a>
                  ))}
                </div>
              </Card>

              {/* GitHub Activity */}
              <Card className="p-6 bg-card/30 backdrop-blur-xl border-border/50 rounded-lg md:col-span-2 h-full min-h-[300px]">
                <div className="text-sm text-muted-foreground mb-4">
                  {t.githubRecord}{" "}
                  {language === "ja" ? (
                    <>
                      <Ruby base="GitHub" text="ギットハブ" />
                    </>
                  ) : (
                    "GitHub"
                  )}{" "}
                  {t.record}
                </div>
                <div className="relative w-full h-[250px] overflow-hidden rounded-lg">
                  <Image
                    src="https://github-readme-activity-graph.vercel.app/graph?username=TCYKyousen&theme=github-dark-dimmed&hide_border=true&bg_color=00000000&color=58a6ff&line=1f6feb&point=58a6ff"
                    alt="GitHub Activity Graph"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-20 bg-card/30 backdrop-blur-xl border-t border-border/50 py-3 px-8">
          <div className="container mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t.footer.split("v0.dev").map((part, i) =>
                i === 0 ? (
                  <span key={i}>{part}</span>
                ) : (
                  <span key={i}>
                    <a
                      href="https://v0.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      v0.dev
                    </a>
                    {part.split("TRAE.ai").map((p, j) =>
                      j === 0 ? (
                        <span key={j}>{p}</span>
                      ) : (
                        <span key={j}>
                          <a
                            href="https://trae.ai"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition-colors"
                          >
                            TRAE.ai
                          </a>
                          {p}
                        </span>
                      ),
                    )}
                  </span>
                ),
              )}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-3 py-1.5 bg-background/50 hover:bg-accent border border-border/50 rounded-lg text-sm transition-all">
                  <Globe className="w-4 h-4" />
                  <span>
                    {languageFlags[language]} {languageNames[language]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                {(Object.keys(translations) as Language[]).map((lang) => (
                  <DropdownMenuItem
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className="cursor-pointer hover:bg-accent"
                  >
                    <span className="mr-2">{languageFlags[lang]}</span>
                    {languageNames[lang]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </footer>
      </div>
    </>
  )
}
