import { NextResponse } from "next/server";

export async function POST(req, context) {
  try {
    const token = req.headers.get("authorization");
    const { id } = await context.params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scoring/calculate/${id}/`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to calculate score.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}