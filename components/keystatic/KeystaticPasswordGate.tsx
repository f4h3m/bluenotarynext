"use client";

import React, { useState } from "react";
import { loginKeystaticAction } from "@/lib/keystatic-auth-actions";

export default function KeystaticPasswordGate() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginKeystaticAction(password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.success) {
        window.location.reload();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffcf1] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B40D5] text-white text-xl font-bold mb-4 shadow-sm">
            BN
          </div>
          <h1 className="text-2xl font-bold text-[#232222] tracking-tight">
            Keystatic Admin Access
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7873] mt-1.5 leading-relaxed">
            Enter the password to access the Keystatic editor and publish directly to GitHub.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="keystatic-password"
              className="block text-xs font-bold uppercase tracking-wider text-[#4A4944] mb-2"
            >
              Password
            </label>
            <input
              id="keystatic-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password (default: bluenotary2026)"
              required
              className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-4 py-3 text-sm text-[#2C2B2B] placeholder-[#8C8A85] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
            />
          </div>

          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs font-medium text-red-700 leading-relaxed">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B40D5] hover:bg-[#3035b8] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Enter Keystatic Admin →"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#D2D0C7]/60 text-center">
          <a
            href="/"
            className="text-xs text-[#7A7873] hover:text-[#232222] transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}
