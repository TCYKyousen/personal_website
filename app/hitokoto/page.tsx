"use client"

import { useEffect, useState, Suspense } from "react"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { ArrowLeft, Globe, RefreshCw } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Hitokoto {
  id: number
  uuid: string
  hitokoto: string
  type: string
  from: string
  from_who: string | null
  creator: string
  creator_uid: number
  reviewer: number
  commit_from: string
  created_at: string
  length: number
}

type Language = "zh" | "ja"

const translations = {
  zh: {
    title: "一言详情",
    back: "返回",
    refresh: "换一条",
    source: "来源",
    author: "作者",
    type: "类型",
    length: "长度",
    created: "创建时间",
    uuid: "UUID",
    typeMap: {
      a: "动画",
      b: "漫画",
      c: "游戏",
      d: "文学",
      e: "原创",
      f: "来自网络",
      g: "其他",
      h: "影视",
      i: "诗词",
      j: "网易云",
      k: "哲学",
      l: "抖机灵",
    },
  },
  ja: {
    title: "一言詳細",
    back: "戻る",
    refresh: "更新",
    source: "出典",
    author: "著者",
    type: "タイプ",
    length: "長さ",
    created: "作成日時",
    uuid: "UUID",
    typeMap: {
      a: "アニメ",
      b: "漫画",
      c: "ゲーム",
      d: "文学",
      e: "オリジナル",
      f: "ネットから",
      g: "その他",
      h: "映像",
      i: "詩詞",
      j: "NetEase Cloud",
      k: "哲学",
      l: "ウィット",
    },
  },
}

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

function HitokotoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [language, setLanguage] = useState<Language>("zh")
  const [hitokoto, setHitokoto] = useState<Hitokoto | null>(null)
  const [backgroundImage, setBackgroundImage] = useState("/background.jpg")
  const [isLoading, setIsLoading] = useState(false)

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

  const fetchHitokoto = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("https://v1.hitokoto.cn/?encode=json")
      const data = await response.json()
      setHitokoto(data)
    } catch (error) {
      console.error("[v0] Failed to fetch hitokoto:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const initialData = searchParams.get("data")
    if (initialData) {
      try {
        setHitokoto(JSON.parse(decodeURIComponent(initialData)))
      } catch {
        fetchHitokoto()
      }
    } else {
      fetchHitokoto()
    }
  }, [searchParams])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString(language === "zh" ? "zh-CN" : "ja-JP")
  }

  if (!hitokoto) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

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
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.back}</span>
          </button>
          <button
            onClick={fetchHitokoto}
            disabled={isLoading}
            className="px-4 py-2 bg-card/30 backdrop-blur-xl border border-border/50 rounded-none hover:bg-accent/50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t.refresh}</span>
          </button>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-8 lg:px-16 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="bg-card/30 backdrop-blur-xl border-border/50 p-8 rounded-none shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-center">{t.title}</h1>

              <div className="text-center space-y-4 py-8 border-y border-border/30">
                <p className="text-2xl leading-relaxed">
                  "{language === "ja" ? toJapaneseNewForm(hitokoto.hitokoto) : hitokoto.hitokoto}"
                </p>
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <p className="text-lg">
                    ——《{language === "ja" ? toJapaneseNewForm(hitokoto.from) : hitokoto.from}》
                  </p>
                  {hitokoto.from_who && (
                    <p className="text-base">
                      {language === "ja" ? toJapaneseNewForm(hitokoto.from_who) : hitokoto.from_who}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t.type}</p>
                  <p className="text-base">
                    {t.typeMap[hitokoto.type as keyof typeof t.typeMap] || hitokoto.type}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t.length}</p>
                  <p className="text-base">{hitokoto.length}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t.created}</p>
                  <p className="text-base">{formatDate(hitokoto.created_at)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t.uuid}</p>
                  <p className="text-base font-mono text-xs break-all">{hitokoto.uuid}</p>
                </div>
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

export default function HitokotoPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HitokotoContent />
    </Suspense>
  )
}
