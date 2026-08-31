import { cookies } from "next/headers";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo";

export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  picture?: string;
}

export function getGoogleAuthUrl(origin: string): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID environment variable is missing.");
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

export async function exchangeGoogleCode(
  code: string,
  origin: string
): Promise<GoogleUserProfile> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth client ID or secret is not configured.");
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  // Exchange authorization code for tokens
  const tokenRes = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    const errorBody = await tokenRes.text();
    throw new Error(`Failed to exchange Google OAuth code: ${errorBody}`);
  }

  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // Fetch user profile from Google
  const profileRes = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!profileRes.ok) {
    throw new Error("Failed to fetch user profile from Google.");
  }

  const profile: GoogleUserProfile = await profileRes.json();
  return profile;
}

export function isEmailAuthorized(email: string): boolean {
  const allowedEmailsRaw = process.env.ALLOWED_EMAILS;
  const allowedDomain = process.env.ALLOWED_DOMAIN;

  // If no whitelist is specified, allow any authenticated Google user
  if (!allowedEmailsRaw && !allowedDomain) {
    return true;
  }

  const lowerEmail = email.toLowerCase().trim();

  // Check domain whitelist (e.g. ALLOWED_DOMAIN=bluenotary.us)
  if (allowedDomain) {
    const domain = allowedDomain.toLowerCase().replace(/^@/, "");
    if (lowerEmail.endsWith(`@${domain}`)) {
      return true;
    }
  }

  // Check individual email whitelist
  if (allowedEmailsRaw) {
    const allowedList = allowedEmailsRaw
      .split(",")
      .map((e) => e.toLowerCase().trim())
      .filter(Boolean);

    if (allowedList.includes(lowerEmail) || allowedList.includes("*")) {
      return true;
    }
  }

  return false;
}

export async function createGoogleAdminSession(profile: GoogleUserProfile) {
  const cookieStore = await cookies();
  const githubToken =
    process.env.GITHUB_TOKEN ||
    process.env.KEYSTATIC_GITHUB_TOKEN ||
    process.env.KEYSTATIC_SECRET;

  if (!githubToken) {
    throw new Error(
      "GITHUB_TOKEN is missing in environment variables. Please add your GitHub Personal Access Token."
    );
  }

  // 1. Session identity cookie (30 days)
  cookieStore.set("keystatic_user_session", JSON.stringify({
    email: profile.email,
    name: profile.name,
    picture: profile.picture,
    authenticatedAt: Date.now(),
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  // 2. Keystatic GitHub API token cookie (read by Keystatic client UI)
  cookieStore.set("keystatic-gh-access-token", githubToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function isGoogleAdminAuthenticated(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("keystatic-gh-access-token");
  const session = cookieStore.get("keystatic_user_session");
  return Boolean(token?.value && session?.value);
}

export async function logoutGoogleAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("keystatic-gh-access-token");
  cookieStore.delete("keystatic_user_session");
}
