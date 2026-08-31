import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import { getAllPosts, BLOG_CATEGORIES } from "@/lib/keystatic";
import AdminPostList from "@/components/admin/AdminPostList";

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const posts = await getAllPosts();
  const featuredCount = posts.filter((p) => p.featured).length;

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D2D0C7]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232222] tracking-tight">
            Article Management
          </h1>
          <p className="text-xs sm:text-sm text-[#7A7873] mt-1">
            Create, edit, and publish blog articles directly to the website.
          </p>
        </div>

        <Link
          href="/admin/new"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#3B40D5] hover:bg-[#3035b8] rounded-xl transition-all shadow-md cursor-pointer shrink-0"
        >
          <span>+ Create New Post</span>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A7873]">
            Total Published Articles
          </p>
          <p className="text-3xl font-bold text-[#232222] mt-2">
            {posts.length}
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A7873]">
            Active Categories
          </p>
          <p className="text-3xl font-bold text-[#3B40D5] mt-2">
            {BLOG_CATEGORIES.length - 1}
          </p>
        </div>

        <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-5 shadow-xs">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7A7873]">
            Featured Spotlight
          </p>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {featuredCount}
          </p>
        </div>
      </div>

      {/* Interactive Post List with Search & Filtering */}
      <AdminPostList posts={posts} />
    </div>
  );
}
