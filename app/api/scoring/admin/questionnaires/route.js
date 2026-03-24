import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/scoring/admin/questionnaires/`,
      {
        method: "GET",
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
      {
        error: "Failed to load scoring questionnaires.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}