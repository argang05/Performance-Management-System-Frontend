import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization");

    const backendResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/self-questionnaire/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader ? { Authorization: authHeader } : {}),
        },
        cache: "no-store",
      }
    );

    const data = await backendResponse.json();

    return NextResponse.json(data, { status: backendResponse.status });
  } catch (error) {
    return NextResponse.json(
      { detail: "Failed to fetch questionnaire.", error: error.message },
      { status: 500 }
    );
  }
}