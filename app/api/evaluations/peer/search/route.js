import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/peer/search/?q=${encodeURIComponent(q)}`,
      {
        headers: { Authorization: token },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Search failed", details: error.message },
      { status: 500 }
    );
  }
}