"use client";

import React from "react";

interface CategoryTabsProps {
  categories: readonly string[] | string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  onSelectCategory,
  className = "",
}: CategoryTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Blog categories"
      className={`flex flex-wrap items-center gap-2 sm:gap-2.5 md:gap-3 ${className}`}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category;
        return (
          <button
            key={category}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onSelectCategory(category)}
            className={`rounded-full px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B40D5] ${
              isActive
                ? "bg-black text-white shadow-md shadow-black/25 scale-[1.02]"
                : "bg-[#EDECE6] text-[#2C2B2B] hover:bg-[#E3E1D9] hover:text-black"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
