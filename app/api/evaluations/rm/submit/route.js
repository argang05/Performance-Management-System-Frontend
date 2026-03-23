import { NextResponse } from "next/server";

export async function POST(req) {
  const token = req.headers.get("authorization");
  const body = await req.json();

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/rm/submit/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return NextResponse.json(data, { status: res.status });
}