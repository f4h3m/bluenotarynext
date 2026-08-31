import React from "react";
import Link from "next/link";
import { isAuthenticated } from "@/lib/admin-auth";
import { logoutAction } from "@/lib/admin-actions";

export const metadata = {
  title: "BlueNotary Admin Portal",
  description: "Manage and publish BlueNotary articles without GitHub accounts.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authed = await isAuthenticated();

  return (
    <div className="min-h-screen bg-[#fffcf1] text-[#2C2B2B] flex flex-col font-sans">
      {/* Admin Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5] border-b border-[#D2D0C7] shadow-xs">
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="flex items-center gap-2 text-lg font-bold tracking-tight text-[#232222] hover:text-[#3B40D5] transition-colors"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#3B40D5]" />
              <span>BlueNotary</span>
              <span className="bg-[#EDECE6] text-[#4A4944] text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md border border-[#D2D0C7]/60">
                Admin
              </span>
            </Link>

            {authed && (
              <nav className="hidden sm:flex items-center gap-4 text-xs font-semibold uppercase tracking-wider">
                <Link
                  href="/admin"
                  className="text-[#2C2B2B] hover:text-[#3B40D5] transition-colors"
                >
                  All Posts
                </Link>
                <Link
                  href="/admin/new"
                  className="text-[#3B40D5] hover:text-[#3035b8] transition-colors"
                >
                  + New Post
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs font-semibold text-[#575651] hover:text-[#232222] flex items-center gap-1 border border-[#D2D0C7] rounded-full px-3.5 py-1.5 hover:bg-black/5 transition-colors"
            >
              <span>View Site</span>
              <span className="text-[10px]">↗</span>
            </Link>

            {authed && (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 rounded-full px-3.5 py-1.5 transition-colors cursor-pointer"
                >
                  Log Out
                </button>
              </form>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
