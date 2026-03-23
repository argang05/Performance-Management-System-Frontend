import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    const body = await request.json();

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/self-questionnaire/save/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to save questionnaire draft.", error: error.message },
      { status: 500 }
    );
  }
}