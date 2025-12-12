"use client"

import { useEffect, useState } from "react"
import { useLock } from "@/components/lock-provider"
import { motion, AnimatePresence } from "framer-motion"

function NumberColumn({ digit }: { digit: number }) {
  return (
    <div className="relative h-[1em] w-[0.6em] overflow-hidden">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={digit}
          initial={{ y: "100%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {digit}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function RollingClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, "0")
  const minutes = time.getMinutes().toString().padStart(2, "0")
  const seconds = time.getSeconds().toString().padStart(2, "0")

  return (
    <div className="flex items-center text-8xl font-bold tracking-tighter font-[family-name:var(--font-harmonyos-black)] text-shadow-lg">
      <div className="flex">
        <NumberColumn digit={parseInt(hours[0])} />
        <NumberColumn digit={parseInt(hours[1])} />
      </div>
      <span className="pb-4">:</span>
      <div className="flex">
        <NumberColumn digit={parseInt(minutes[0])} />
        <NumberColumn digit={parseInt(minutes[1])} />
      </div>
      <span className="pb-4 text-4xl self-end mb-4 text-white/50">:</span>
      <div className="flex text-4xl self-end mb-4 text-white/50">
        <NumberColumn digit={parseInt(seconds[0])} />
        <NumberColumn digit={parseInt(seconds[1])} />
      </div>
    </div>
  )
}

export function LockScreen() {
  const { isLocked, unlock } = useLock()
  const [date, setDate] = useState("")
  const [hitokoto, setHitokoto] = useState<{ hitokoto: string; from: string } | null>(null)
  const [isChinese, setIsChinese] = useState(false)

  useEffect(() => {
    // Check browser language
    const lang = navigator.language.toLowerCase()
    const isZh = lang.startsWith('zh')
    setIsChinese(isZh)

    if (isZh) {
      const controller = new AbortController()
      const fetchHitokoto = async () => {
        try {
          const res = await fetch("/api/hitokoto", { signal: controller.signal })
          const data = await res.json()
          setHitokoto(data)
        } catch (e) {
          if (e instanceof Error && e.name === 'AbortError') return
          setHitokoto({ hitokoto: "The journey of a thousand miles begins with a single step", from: "Lao Tzu" })
        }
      }
      fetchHitokoto()
      return () => controller.abort()
    } else {
      setHitokoto(null)
    }
  }, [])

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }))
  }, [])

  return (
    <AnimatePresence>
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-between py-20 bg-black text-white overflow-hidden select-none"
          onClick={unlock}
        >
          {/* Top Status Area */}
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="flex flex-col items-center"
            >
              <RollingClock />
              <p className="text-2xl font-light opacity-90 mt-4">
                {date}
              </p>
            </motion.div>
          </div>

          {/* Bottom Area: Quote & Unlock Hint */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="flex flex-col items-center space-y-8 max-w-2xl px-8 text-center"
          >
            {hitokoto && isChinese && (
              <div className="space-y-2">
                <p className="text-xl md:text-2xl font-serif italic leading-relaxed text-shadow-sm">
                  「{hitokoto.hitokoto}」
                </p>
                <p className="text-sm opacity-60">
                  — {hitokoto.from}
                </p>
              </div>
            )}

            <div className="flex flex-col items-center gap-2 opacity-50 animate-pulse">
              <span className="text-sm font-medium tracking-widest uppercase">
                Click to Unlock
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
