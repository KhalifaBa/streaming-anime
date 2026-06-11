import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const server = req.nextUrl.searchParams.get("server") || "vidstreaming";
  const category = req.nextUrl.searchParams.get("category") || "sub";

  if (!id) {
    return NextResponse.json({ error: "Missing id parameter" }, { status: 400 });
  }
  try {
    const res = await fetch(
      `https://api-blush-nine-20.vercel.app/anime/zoro/watch?id=${encodeURIComponent(id)}&server=${encodeURIComponent(server)}&category=${encodeURIComponent(category)}`,
      {
        headers: { "User-Agent": "Mozilla/5.0" },
        signal: AbortSignal.timeout(15000),
      }
    );
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=120, stale-while-revalidate=30" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Proxy fetch failed", details: String(e) }, { status: 502 });
  }
}
