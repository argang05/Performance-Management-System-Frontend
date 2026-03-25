import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    const token = req.headers.get("authorization");
    const { id } = await context.params;
    const body = await req.json();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scoring/override/${id}/`,
      {
        method: "PUT",
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
        error: "Failed to override score.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}