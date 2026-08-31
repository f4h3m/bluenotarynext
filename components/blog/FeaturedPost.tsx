import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface FeaturedPostProps {
  post: BlogPost;
  className?: string;
}

export default function FeaturedPost({
  post,
  className = "",
}: FeaturedPostProps) {
  return (
    <article className={`flex flex-col group ${className}`}>
      {/* Featured Thumbnail */}
      <Link
        href={post.slug}
        className="block relative w-full aspect-[16/10] overflow-hidden rounded-xl md:rounded-2xl bg-[#E5E3DB] shadow-xs"
      >
        <Image
          src={post.imageUrl}
          alt={post.imageAlt || post.title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>

      {/* Author & Date Metadata */}
      <div className="mt-3.5 sm:mt-4 text-xs sm:text-[13px] text-[#6B6A66] font-medium flex items-center gap-1.5">
        <span>By</span>
        <Link
          href={post.author.url || "#"}
          className="text-[#3B40D5] font-semibold hover:underline"
        >
          {post.author.name}
        </Link>
        <span>|</span>
        <time dateTime={post.date}>{post.date}</time>
      </div>

      {/* Main Headline */}
      <h2 className="mt-2 text-2xl sm:text-3xl md:text-[32px] lg:text-[36px] font-bold text-[#232222] tracking-tight leading-[1.18]">
        <Link
          href={post.slug}
          className="hover:text-[#3B40D5] transition-colors duration-150"
        >
          {post.title}
        </Link>
      </h2>
    </article>
  );
}
