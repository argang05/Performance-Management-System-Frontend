import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Authorization token missing." },
        { status: 401 }
      );
    }

    const formData = await req.formData();

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/employees/me/jd/upload/`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      }
    );

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to upload JD file.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}