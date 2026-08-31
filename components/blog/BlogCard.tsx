import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types/blog";

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

export default function BlogCard({ post, className = "" }: BlogCardProps) {
  return (
    <article className={`flex flex-col group ${className}`}>
      {/* Thumbnail */}
      <Link
        href={post.slug}
        className="block relative w-full aspect-[16/10] overflow-hidden rounded-xl bg-[#E5E3DB] shadow-xs"
      >
        <Image
          src={post.imageUrl}
          alt={post.imageAlt || post.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </Link>

      {/* Metadata */}
      <div className="mt-2.5 text-[11px] sm:text-xs text-[#6B6A66] font-medium flex items-center gap-1">
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

      {/* Title */}
      <h3 className="mt-1.5 text-sm sm:text-[15px] font-bold text-[#232222] leading-snug tracking-tight">
        <Link
          href={post.slug}
          className="hover:text-[#3B40D5] transition-colors duration-150 line-clamp-3"
        >
          {post.title}
        </Link>
      </h3>
    </article>
  );
}
