import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");
    const body = await req.json();

    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendBaseUrl) {
      return NextResponse.json(
        {
          error: "Proxy configuration error.",
          details: "NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_BACKEND_URL is not set.",
        },
        { status: 500 }
      );
    }

    const res = await fetch(`${backendBaseUrl}/api/admin/reset/execute/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const contentType = res.headers.get("content-type") || "";
    let data;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        error: "Backend did not return JSON.",
        details: text?.slice(0, 500) || "Unknown backend response",
      };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}