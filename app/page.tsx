"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface Hitokoto {
  hitokoto: string
  from: string
  from_who: string | null
}

export default function ProfilePage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hitokoto, setHitokoto] = useState<Hitokoto>({
    hitokoto: "加载中...",
    from: "",
    from_who: null,
  })

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  // Fetch hitokoto every 5 seconds
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
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"]
    const weekday = weekdays[date.getDay()]
    return `${year} 年 ${month} 月 ${day} 日 星期${weekday}`
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
    <div className="min-h-screen bg-[#0d1117] text-white relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/background.jpg" alt="Background" fill className="object-cover opacity-20" priority />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-3">
            <Card className="bg-[#161b22]/80 backdrop-blur-sm border-[#30363d] p-6">
              <div className="flex flex-col items-center space-y-4">
                {/* Avatar */}
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden">
                  <Image src="/avatar.jpg" alt="Avatar" fill className="object-cover" />
                </div>

                {/* Name */}
                <div className="text-center">
                  <h1 className="text-2xl font-bold">镜芊</h1>
                  <p className="text-sm text-gray-400 mt-1">DEVELOPER & DESIGNER</p>
                </div>

                {/* Code Snippet */}
                <div className="w-full bg-[#0d1117] rounded-lg p-3 font-mono text-sm">
                  <code className="text-gray-300">print("Hello, World!")</code>
                </div>

                {/* Introduction */}
                <p className="text-center text-gray-300">你好，我是镜芊，很高兴认识你！</p>

                {/* GitHub Icon */}
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
            </Card>
          </div>

          {/* Center Content */}
          <div className="lg:col-span-6 space-y-6">
            {/* Time Card */}
            <Card className="bg-[#161b22]/80 backdrop-blur-sm border-[#30363d] p-6">
              <div className="text-center space-y-2">
                <p className="text-gray-400 text-sm">{formatDate(currentTime)}</p>
                <p className="text-5xl font-bold font-mono tracking-wider">{formatTime(currentTime)}</p>
                <p className="text-gray-400 text-sm">夜深了，今天过的怎么样？</p>
              </div>
            </Card>

            {/* Hitokoto Card */}
            <Card className="bg-[#161b22]/80 backdrop-blur-sm border-[#30363d] p-6">
              <div className="text-center space-y-2">
                <p className="text-lg text-balance">"{hitokoto.hitokoto}"</p>
                <p className="text-sm text-gray-400">
                  ——《{hitokoto.from}》{hitokoto.from_who && ` · ${hitokoto.from_who}`}
                </p>
              </div>
            </Card>

            {/* GitHub Activity Graph */}
            <Card className="bg-[#161b22]/80 backdrop-blur-sm border-[#30363d] p-6">
              <div className="space-y-4">
                <p className="text-sm text-gray-400">
                  这是我的{" "}
                  <a
                    href="https://github.com/TCYKyousen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline"
                  >
                    GitHub
                  </a>{" "}
                  记录
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

          {/* Right Sidebar - Friend Links */}
          <div className="lg:col-span-3">
            <Card className="bg-[#161b22]/80 backdrop-blur-sm border-[#30363d] p-6">
              <h2 className="text-xl font-bold mb-4 text-center">友情链接</h2>
              <div className="space-y-3">
                {friendLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center py-3 px-4 bg-[#0d1117] hover:bg-[#1c2128] rounded-lg transition-colors border border-[#30363d]"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
