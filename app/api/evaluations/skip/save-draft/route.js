import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/skip/save-draft/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(body),
      }
    );

    const contentType = res.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
      const text = await res.text();
      return NextResponse.json(
        {
          error: "Backend returned non-JSON response.",
          details: text.slice(0, 200),
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to save skip draft.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}