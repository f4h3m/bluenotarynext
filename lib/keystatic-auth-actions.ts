"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || "bluenotary2026";

export async function isKeystaticAuthenticated(): Promise<boolean> {
  if (process.env.NODE_ENV !== "production") {
    return true;
  }
  const cookieStore = await cookies();
  const token = cookieStore.get("keystatic-gh-access-token");
  return Boolean(token?.value);
}

export async function loginKeystaticAction(password: string) {
  if (password !== DEFAULT_PASSWORD) {
    return { error: "Invalid password. Please try again." };
  }

  const githubToken =
    process.env.GITHUB_TOKEN ||
    process.env.KEYSTATIC_GITHUB_TOKEN ||
    process.env.KEYSTATIC_SECRET;

  if (!githubToken) {
    return {
      error:
        "GITHUB_TOKEN is not configured in environment variables. Please add your GitHub Personal Access Token in Vercel settings.",
    };
  }

  const cookieStore = await cookies();

  // Keystatic's browser client reads this cookie to authenticate GitHub API requests
  cookieStore.set("keystatic-gh-access-token", githubToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });

  revalidatePath("/keystatic");
  return { success: true };
}

export async function logoutKeystaticAction() {
  const cookieStore = await cookies();
  cookieStore.delete("keystatic-gh-access-token");
  revalidatePath("/keystatic");
}
