export async function GET() {
  try {
    const response = await fetch("https://v1.hitokoto.cn/")
    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Failed to fetch hitokoto:", error)
    return Response.json(
      { hitokoto: "The journey of a thousand miles begins with a single step", from: "Lao Tzu", from_who: null },
      { status: 500 },
    )
  }
}
