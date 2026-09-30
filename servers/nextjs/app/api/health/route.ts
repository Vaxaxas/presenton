import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const fastApiUrl =
    process.env.FAST_API_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_FAST_API ||
    "http://127.0.0.1:5001";

  let backendReady = false;
  try {
    const res = await fetch(`${fastApiUrl}/api/v1/auth/status`, {
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    backendReady = res.ok;
  } catch {
    backendReady = false;
  }

  if (!backendReady) {
    return NextResponse.json(
      { status: "waiting_backend", service: "presenton" },
      {
        status: 503,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Cache-Control": "no-store",
        },
      }
    );
  }

  return NextResponse.json(
    { status: "ok", service: "presenton" },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
    },
  });
}
