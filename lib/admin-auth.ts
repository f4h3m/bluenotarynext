import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "bn_admin_session";
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "bluenotary2026";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === "authenticated";
}

export async function loginAdmin(password: string): Promise<boolean> {
  if (password === DEFAULT_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return true;
  }
  return false;
}

export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
}
