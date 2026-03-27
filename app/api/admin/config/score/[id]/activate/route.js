import { NextResponse } from "next/server";

export async function PUT(req, context) {
  try {
    const token = req.headers.get("authorization");
    const { id } = await context.params;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/config/score/${id}/activate/`,
      {
        method: "PUT",
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
        error: "Failed to activate score configuration.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}