import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);

    const queryString = searchParams.toString();
    const targetUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/questions/${
      queryString ? `?${queryString}` : ""
    }`;

    const res = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Authorization: token,
      },
      cache: "no-store",
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load questions.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/questions/`,
      {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create question.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}