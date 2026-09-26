import { NextResponse } from "next/server";
import { authStatusForRequest } from "@/lib/server-auth-role";
import { readRuntimeProviderConfig } from "@/lib/runtime-provider-config";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await authStatusForRequest(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { configured: false, status: "ok", detail: "Unauthorized" },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  }
  try {
    return NextResponse.json(readRuntimeProviderConfig(), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    });
  } catch {
    return NextResponse.json(
      { configured: false, config: {} },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
        },
      }
    );
  }
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
