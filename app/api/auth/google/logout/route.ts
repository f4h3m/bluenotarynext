import { NextRequest, NextResponse } from "next/server";
import { logoutGoogleAdmin } from "@/lib/google-auth";

export async function GET(request: NextRequest) {
  await logoutGoogleAdmin();
  const origin = request.nextUrl.origin;
  return NextResponse.redirect(`${origin}/keystatic`);
}
