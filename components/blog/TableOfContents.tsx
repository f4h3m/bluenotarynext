import React from "react";

interface TOCItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export default function TableOfContents({
  items,
  className = "",
}: TableOfContentsProps) {
  return (
    <nav
      aria-label="Table of Contents"
      className={`border border-[#D2D0C7] bg-[#FAF9F5] rounded-lg p-5 sm:p-6 my-6 max-w-lg ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#D2D0C7]">
        <h3 className="text-sm sm:text-[15px] font-bold tracking-wide text-[#2C2B2B]">
          Table of Contents
        </h3>
        <svg
          className="w-4 h-4 text-[#61605C]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h7"
          />
        </svg>
      </div>

      <ol className="space-y-2 text-xs sm:text-[13px] text-[#4A4944] font-medium list-decimal list-inside">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="text-[#2C2B2B] hover:text-[#3B40D5] hover:underline transition-colors ml-1"
            >
              {item.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
