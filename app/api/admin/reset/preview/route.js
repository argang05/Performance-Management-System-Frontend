import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const employeeNumber = searchParams.get("employee_number");
    const reviewCycleId = searchParams.get("review_cycle_id");
    const scope = searchParams.get("scope");

    const token = req.headers.get("authorization");

    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL;

    if (!backendBaseUrl) {
      return NextResponse.json(
        {
          error: "Proxy configuration error.",
          details: "NEXT_PUBLIC_API_BASE_URL or NEXT_PUBLIC_BACKEND_URL is not set.",
        },
        { status: 500 }
      );
    }

    const backendQuery = new URLSearchParams();
    if (employeeNumber) backendQuery.set("employee_number", employeeNumber);
    if (reviewCycleId) backendQuery.set("review_cycle_id", reviewCycleId);
    if (scope) backendQuery.set("scope", scope);

    const backendUrl = `${backendBaseUrl}/api/admin/reset/preview/?${backendQuery.toString()}`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: {
        ...(token ? { Authorization: token } : {}),
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
        details: text?.slice(0, 500) || "Unknown backend response",
      };
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Proxy error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}