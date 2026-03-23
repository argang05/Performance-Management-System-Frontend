import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accounts/login/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      {
        detail: "Unable to connect to backend login service.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}