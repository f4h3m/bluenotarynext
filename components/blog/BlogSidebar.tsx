import React from "react";
import Image from "next/image";
import Link from "next/link";
import { SidebarRecentPost } from "@/types/blog";

interface BlogSidebarProps {
  recentPosts: SidebarRecentPost[];
  className?: string;
}

export default function BlogSidebar({
  recentPosts,
  className = "",
}: BlogSidebarProps) {
  return (
    <aside className={`flex flex-col space-y-8 ${className}`}>
      {/* Recent Posts Widget */}
      <div className="flex flex-col">
        <h3 className="text-base sm:text-lg font-bold text-[#232222] mb-5 tracking-tight">
          Recent Posts
        </h3>

        <div className="flex flex-col space-y-4 divide-y divide-[#D2D0C7]/50">
          {recentPosts.map((post) => (
            <div key={post.id} className="pt-4 first:pt-0 flex items-center gap-3.5 group">
              {/* Thumbnail */}
              <Link
                href={post.slug}
                className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden bg-[#E5E3DB]"
              >
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  sizes="64px"
                  className="object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </Link>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  href={post.slug}
                  className="text-xs sm:text-[13px] font-bold text-[#232222] group-hover:text-[#3B40D5] line-clamp-2 leading-snug transition-colors"
                >
                  {post.title}
                </Link>
                <p className="text-[11px] text-[#7A7873] mt-1 font-medium">
                  {post.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dark Call to Action Box */}
      <div className="bg-black text-white rounded-xl p-6 sm:p-7 text-center flex flex-col items-center justify-center space-y-3 shadow-lg">
        <h4 className="text-lg sm:text-xl font-bold tracking-tight text-white">
          Notarize your document online.
        </h4>
        <p className="text-xs sm:text-[13px] text-neutral-300 leading-relaxed max-w-xs">
          Fast, secure, and legally binding across 50 states.
        </p>
        <Link
          href="/notarize"
          className="inline-block mt-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-colors cursor-pointer shadow-xs"
        >
          NOTARIZE NOW
        </Link>
      </div>
    </aside>
  );
}
