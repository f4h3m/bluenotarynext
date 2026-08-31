"use client";

import React from "react";
import { useSearchParams } from "next/navigation";

export default function KeystaticGoogleGate() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-[#fffcf1] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-8 sm:p-10 shadow-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B40D5] text-white text-xl font-bold mb-4 shadow-sm">
            BN
          </div>
          <h1 className="text-2xl font-bold text-[#232222] tracking-tight">
            Keystatic Admin Portal
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7873] mt-2 leading-relaxed">
            Sign in with your authorized Google account to manage and publish blog posts.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 leading-relaxed">
            <div className="font-bold mb-0.5">Authentication Issue</div>
            <div>{error}</div>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-4">
          <a
            href="/api/auth/google/login"
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-neutral-50 text-[#2C2B2B] border border-[#D2D0C7] rounded-xl py-3.5 px-4 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xs hover:shadow-sm cursor-pointer"
          >
            {/* Official Google 'G' Logo SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>

          <div className="text-center text-[11px] text-[#8C8A85] pt-1">
            Zero GitHub accounts needed. Zero passwords to remember.
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-[#D2D0C7]/60 text-center">
          <a
            href="/"
            className="text-xs text-[#7A7873] hover:text-[#232222] transition-colors"
          >
            ← Back to BlueNotary
          </a>
        </div>
      </div>
    </div>
  );
}
