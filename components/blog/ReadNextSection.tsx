import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ReadNextPost } from "@/types/blog";

interface ReadNextSectionProps {
  posts: ReadNextPost[];
  className?: string;
}

export default function ReadNextSection({
  posts,
  className = "",
}: ReadNextSectionProps) {
  return (
    <section
      aria-label="Read Next Articles"
      className={`w-full max-w-[1440px] mx-auto pt-14 pb-8 ${className}`}
    >
      <h3 className="text-2xl sm:text-3xl font-bold text-[#232222] mb-8 tracking-tight">
        Read Next
      </h3>

      {/* 3 Horizontal Recommendation Cards */}
      <div className="flex flex-col space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="flex flex-col md:flex-row gap-6 p-5 sm:p-6 bg-[#FAF9F5] border border-[#D2D0C7] rounded-xl hover:border-[#3B40D5]/40 transition-all duration-200 group shadow-2xs"
          >
            {/* Left Image Thumbnail */}
            <Link
              href={post.slug}
              className="relative w-full md:w-72 h-48 md:h-auto shrink-0 rounded-lg overflow-hidden bg-[#E5E3DB]"
            >
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
            </Link>

            {/* Right Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {/* Metadata */}
                <div className="text-xs text-[#6B6A66] font-medium flex items-center gap-1.5 mb-1.5">
                  <span>By</span>
                  <span className="text-[#3B40D5] font-semibold">
                    {post.author}
                  </span>
                  <span>|</span>
                  <span>{post.date}</span>
                </div>

                {/* Title */}
                <h4 className="text-lg sm:text-xl font-bold text-[#232222] group-hover:text-[#3B40D5] leading-snug tracking-tight mb-2.5 transition-colors">
                  <Link href={post.slug}>{post.title}</Link>
                </h4>

                {/* Excerpt */}
                <p className="text-xs sm:text-[13px] text-[#61605C] leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 pt-4 mt-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#EDECE6] text-[#4A4944] text-[11px] font-medium px-3 py-1 rounded-full border border-[#D2D0C7]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Legal Disclaimer Box */}
      <div className="mt-12 p-5 bg-[#FAF9F5] border border-[#D2D0C7] rounded-lg text-xs text-[#7A7873] leading-relaxed">
        <p>
          <strong className="text-[#4A4944]">Disclaimer:</strong> The
          information provided on this website does not, and is not intended to,
          constitute legal advice; instead, all information, content, and
          materials available on this site are for general informational
          purposes only.
        </p>
      </div>
    </section>
  );
}
