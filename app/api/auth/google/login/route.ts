import { NextRequest, NextResponse } from "next/server";
import { getGoogleAuthUrl } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  try {
    const origin = request.nextUrl.origin;
    const authUrl = getGoogleAuthUrl(origin);
    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to initialize Google login" },
      { status: 500 }
    );
  }
}
