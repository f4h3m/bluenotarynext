"use client";

import React, { useState, useMemo } from "react";
import { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/keystatic.config";
import CategoryTabs from "./CategoryTabs";
import BlogCard from "./BlogCard";

export interface CategorySectionProps {
  categories?: readonly string[] | string[];
  posts?: BlogPost[];
  defaultCategory?: string;
  className?: string;
}

export default function CategorySection({
  categories = BLOG_CATEGORIES,
  posts = [],
  defaultCategory = "All",
  className = "",
}: CategorySectionProps) {
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  // Filter posts based on active category, limited to 3 cards
  const filteredPosts = useMemo(() => {
    if (activeCategory === "All") {
      return posts.slice(0, 3);
    }
    return posts
      .filter((post) => post.category === activeCategory)
      .slice(0, 3);
  }, [posts, activeCategory]);

  return (
    <section
      aria-label="Category Filtered Articles"
      className={`w-full max-w-[1440px] mx-auto py-8 sm:py-12 md:py-14 ${className}`}
    >
      {/* Category Pills Bar */}
      <div className="w-full mb-8 sm:mb-10">
        <CategoryTabs
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </div>

      {/* 3-Card Grid or Empty State */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-6 sm:py-8">
          <p className="text-sm sm:text-base text-[#2C2B2B] font-normal">
            No articles available in this category.
          </p>
        </div>
      )}
    </section>
  );
}
