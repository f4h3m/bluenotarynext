"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/keystatic.config";
import { deletePostAction } from "@/lib/admin-actions";

interface AdminPostListProps {
  posts: BlogPost[];
}

export default function AdminPostList({ posts }: AdminPostListProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.author.name.toLowerCase().includes(search.toLowerCase()) ||
        post.slug.toLowerCase().includes(search.toLowerCase());

      const matchesCat =
        selectedCategory === "All" || post.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [posts, search, selectedCategory]);

  const handleDelete = async (slugClean: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingSlug(slugClean);
    try {
      await deletePostAction(slugClean);
      router.refresh();
    } catch (err: any) {
      alert(`Failed to delete post: ${err.message}`);
    } finally {
      setDeletingSlug(null);
    }
  };

  return (
    <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl overflow-hidden shadow-xs">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-[#D2D0C7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles by title or author..."
            className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#2C2B2B] placeholder-[#8C8A85] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-xs font-bold uppercase tracking-wider text-[#7A7873] shrink-0">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3 py-2 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25"
          >
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#D2D0C7] bg-[#EDECE6]/40 text-[11px] font-bold uppercase tracking-wider text-[#6B6A66]">
              <th className="py-3.5 px-5">Article</th>
              <th className="py-3.5 px-4 hidden md:table-cell">Category</th>
              <th className="py-3.5 px-4 hidden sm:table-cell">Date</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D2D0C7]/60">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const rawSlug = post.slug.replace(/^\/blog\//, "");
                return (
                  <tr
                    key={post.id}
                    className="hover:bg-[#EDECE6]/30 transition-colors group"
                  >
                    {/* Article Thumbnail & Title */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#E5E3DB] shrink-0 border border-[#D2D0C7]/60">
                          <Image
                            src={post.imageUrl}
                            alt={post.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#232222] group-hover:text-[#3B40D5] line-clamp-1 transition-colors">
                              {post.title}
                            </span>
                            {post.featured && (
                              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-sm">
                                Featured
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#7A7873] block truncate">
                            /blog/{rawSlug}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      {post.category ? (
                        <span className="bg-[#EDECE6] text-[#4A4944] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#D2D0C7]/60 whitespace-nowrap">
                          {post.category}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 hidden sm:table-cell text-xs text-[#6B6A66] whitespace-nowrap">
                      {post.date}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link
                          href={`/admin/edit/${rawSlug}`}
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#3B40D5] hover:bg-[#3B40D5]/10 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <Link
                          href={post.slug}
                          target="_blank"
                          className="px-2.5 py-1.5 text-xs font-medium text-[#575651] hover:bg-black/5 rounded-lg transition-colors hidden lg:inline-block"
                        >
                          View ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(rawSlug, post.title)}
                          disabled={deletingSlug === rawSlug}
                          className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {deletingSlug === rawSlug ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-12 text-center text-xs sm:text-sm text-[#7A7873]">
                  No articles found matching your filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
