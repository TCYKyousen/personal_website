import { NextResponse } from "next/server"

export async function GET() {
  try {
    const res = await fetch("https://v1.hitokoto.cn/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (v0-app)",
      },
      cache: "no-store",
    })
    if (!res.ok) throw new Error("Failed to fetch")
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Hitokoto proxy error:", error)
    return NextResponse.json(
      {
        hitokoto: "事物的发展是前进性与曲折性的统一",
        from: "Jane",
        from_who: null,
      },
      { status: 500 },
    )
  }
}
