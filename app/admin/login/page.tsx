"use client";

import React, { useState } from "react";
import { loginAction } from "@/lib/admin-actions";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginAction(password);
      if (res?.error) {
        setError(res.error);
        setLoading(false);
      }
    } catch {
      // Redirect throws an error in Next.js which is normal
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-8 sm:p-10 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#3B40D5] text-white text-xl font-bold mb-4 shadow-sm">
            BN
          </div>
          <h1 className="text-2xl font-bold text-[#232222] tracking-tight">
            BlueNotary Admin
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7873] mt-1.5">
            Enter the admin passcode to manage and publish blog posts.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-xs font-bold uppercase tracking-wider text-[#4A4944] mb-2"
            >
              Admin Passcode
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode (default: bluenotary2026)"
              required
              className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-4 py-3 text-sm text-[#2C2B2B] placeholder-[#8C8A85] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3B40D5] hover:bg-[#3035b8] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Enter Admin Portal →"}
          </button>
        </form>
      </div>
    </div>
  );
}
