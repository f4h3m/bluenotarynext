"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/types/blog";
import FeaturedPost from "./FeaturedPost";
import BlogCard from "./BlogCard";
import BlogSearch from "./BlogSearch";

export interface BlogHeroSectionProps {
  featuredPost: BlogPost;
  recentPosts: BlogPost[];
  allPosts?: BlogPost[];
  onSearch?: (query: string) => void;
  className?: string;
}

export default function BlogHeroSection({
  featuredPost,
  recentPosts,
  allPosts,
  onSearch,
  className = "",
}: BlogHeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  const displayedRecentPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return recentPosts.slice(0, 4);
    }
    const q = searchQuery.toLowerCase();
    const filtered = recentPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q)
    );
    return filtered.slice(0, 4);
  }, [recentPosts, searchQuery]);

  return (
    <section
      aria-label="Featured Articles"
      className={`w-full max-w-[1440px] mx-auto py-6 sm:py-8 md:py-12 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 xl:gap-12 items-start">
        {/* Left Column (60%): Spotlight Featured Post */}
        <div className="lg:col-span-3">
          <FeaturedPost post={featuredPost} />
        </div>

        {/* Right Column (40%): Search + 2x2 Grid of Recent Posts */}
        <div className="lg:col-span-2 flex flex-col">
          {/* Search Bar with Live Dropdown */}
          <div className="w-full mb-6 sm:mb-8">
            <BlogSearch
              posts={allPosts || recentPosts}
              onSearch={handleSearch}
            />
          </div>

          {/* 2x2 Posts Grid */}
          {displayedRecentPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-7 sm:gap-y-8">
              {displayedRecentPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-xs sm:text-sm text-[#7A7873]">
              No articles found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
