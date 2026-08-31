import { NextRequest, NextResponse } from "next/server";
import {
  exchangeGoogleCode,
  isEmailAuthorized,
  createGoogleAdminSession,
} from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const origin = request.nextUrl.origin;

  if (error || !code) {
    return NextResponse.redirect(
      `${origin}/keystatic?error=${encodeURIComponent(
        error || "Google login was cancelled or failed."
      )}`
    );
  }

  try {
    const profile = await exchangeGoogleCode(code, origin);

    // Whitelist check
    if (!isEmailAuthorized(profile.email)) {
      return NextResponse.redirect(
        `${origin}/keystatic?error=${encodeURIComponent(
          `Access denied: ${profile.email} is not in the authorized admin list.`
        )}`
      );
    }

    // Set authenticated session & GitHub PAT cookie
    await createGoogleAdminSession(profile);

    return NextResponse.redirect(`${origin}/keystatic`);
  } catch (err: any) {
    console.error("Google Auth callback error:", err);
    return NextResponse.redirect(
      `${origin}/keystatic?error=${encodeURIComponent(
        err.message || "Failed to authenticate with Google."
      )}`
    );
  }
}
