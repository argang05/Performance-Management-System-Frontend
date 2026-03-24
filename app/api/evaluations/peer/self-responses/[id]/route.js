import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const token = req.headers.get("authorization");
    const { id } = await context.params;

    if (!id || id === "undefined") {
      return NextResponse.json(
        { error: "Invalid questionnaire id." },
        { status: 400 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/evaluations/peer/self-responses/${id}/`,
      {
        headers: {
          Authorization: token,
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load self responses", details: error.message },
      { status: 500 }
    );
  }
}