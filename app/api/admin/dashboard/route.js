import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const token = req.headers.get("authorization");

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token." },
        { status: 401 }
      );
    }

    const backendUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/dashboard/`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: token,
      },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";

    let data;
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = {
        error: "Backend did not return JSON.",
        details: text,
      };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to load admin dashboard.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}