import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://api-blush-nine-20.vercel.app/anime/zoro/top-airing", {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=60" },
    });
  } catch (e) {
    return NextResponse.json({ error: "Proxy fetch failed", details: String(e) }, { status: 502 });
  }
}
