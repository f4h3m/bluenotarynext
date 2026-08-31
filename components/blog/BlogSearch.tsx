"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogSearchProps {
  placeholder?: string;
  posts?: BlogPost[];
  onSearch?: (query: string) => void;
  className?: string;
}

export default function BlogSearch({
  placeholder = "Search blog...",
  posts = [],
  onSearch,
  className = "",
}: BlogSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live filter results based on query
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return posts.filter((post) => {
      const titleMatch = post.title.toLowerCase().includes(trimmed);
      const categoryMatch = post.category?.toLowerCase().includes(trimmed);
      const excerptMatch = post.excerpt?.toLowerCase().includes(trimmed);
      const tagMatch = post.tags?.some((t) => t.toLowerCase().includes(trimmed));
      return titleMatch || categoryMatch || excerptMatch || tagMatch;
    });
  }, [query, posts]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setIsOpen(Boolean(val.trim()));
    if (onSearch) {
      onSearch(val);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    if (onSearch) {
      onSearch("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(query.trim());
    }
    if (query.trim()) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Bar */}
      <form
        onSubmit={handleSubmit}
        role="search"
        className="w-full flex items-center bg-[#EDECE6] border border-[#D2D0C7]/60 rounded-full pl-5 pr-1.5 py-1.5 transition-all focus-within:ring-2 focus-within:ring-[#3B40D5]/25 focus-within:border-[#3B40D5]/50 focus-within:bg-[#FAF9F5]"
      >
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          placeholder={placeholder}
          aria-label="Search blog posts"
          className="w-full bg-transparent text-[#2C2B2B] placeholder-[#8C8A85] text-sm md:text-[15px] focus:outline-none pr-3"
        />

        {/* Clear 'X' Button */}
        {query.trim() && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search"
            className="p-1.5 mr-1.5 text-[#7A7873] hover:text-[#2C2B2B] hover:bg-black/5 rounded-full transition-colors cursor-pointer shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* Search Submit Button */}
        <button
          type="submit"
          className="bg-black hover:bg-[#2C2B2B] text-white text-xs md:text-sm font-semibold px-5 sm:px-6 py-2.5 rounded-full transition-colors cursor-pointer shrink-0"
        >
          Search
        </button>
      </form>

      {/* Live Search Dropdown Menu */}
      {isOpen && query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl shadow-2xl overflow-hidden max-h-[380px] overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {searchResults.length > 0 ? (
            <div className="py-2 divide-y divide-[#D2D0C7]/40">
              <div className="px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-[#7A7873]">
                Matching Articles ({searchResults.length})
              </div>
              {searchResults.map((post) => (
                <Link
                  key={post.id}
                  href={post.slug}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3.5 px-4 py-3 hover:bg-[#EBE9E1] transition-colors group cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#E5E3DB] shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.imageAlt || post.title}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-[13px] font-bold text-[#232222] group-hover:text-[#3B40D5] line-clamp-1 leading-snug transition-colors">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#7A7873]">
                      {post.category && (
                        <span className="font-semibold text-[#3B40D5]">
                          {post.category}
                        </span>
                      )}
                      {post.category && <span>•</span>}
                      <span>{post.date}</span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <span className="text-[#8C8A85] group-hover:text-[#3B40D5] group-hover:translate-x-0.5 transition-all text-xs shrink-0">
                    →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-xs sm:text-sm text-[#7A7873]">
              No articles found matching &ldquo;<span className="font-medium text-[#2C2B2B]">{query}</span>&rdquo;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
