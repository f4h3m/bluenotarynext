import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPostBySlug,
  getAllPosts,
  getSidebarRecentPosts,
  getReadNextPosts,
} from "@/lib/keystatic";
import MdxContentRenderer from "@/components/blog/MdxContentRenderer";
import BlogSidebar from "@/components/blog/BlogSidebar";
import ReadNextSection from "@/components/blog/ReadNextSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug.replace(/^\/blog\//, ""),
  }));
}

export default async function SingleBlogPage({ params }: PageProps) {
  const { slug } = await params;

  // Retrieve post from Keystatic
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const [sidebarRecentPosts, readNextPosts] = await Promise.all([
    getSidebarRecentPosts(4),
    getReadNextPosts(3),
  ]);

  return (
    <div className="w-full bg-[#fffcf1] px-6 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-10 md:py-12">
      <div className="max-w-[1440px] mx-auto">
        {/* Top Hero Banner with Gradient Overlay & Inset Headline */}
        <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] min-h-[300px] sm:min-h-[380px] md:min-h-[440px] rounded-xl sm:rounded-2xl overflow-hidden mb-10 md:mb-14 shadow-md bg-[#E5E3DB]">
          <Image
            src={post.imageUrl}
            alt={post.imageAlt || post.title}
            fill
            priority
            className="object-cover"
          />
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-6 sm:p-10 md:p-12">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl leading-tight tracking-tight drop-shadow-md">
              {post.title}
            </h1>
            <div className="mt-4 text-xs sm:text-sm text-neutral-200 font-medium flex items-center gap-2">
              <span>By</span>
              <span className="text-white font-semibold">{post.author.name}</span>
              <span>|</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </div>
        </div>

        {/* Main 2-Column Article Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-start">
          {/* Left Column: Editorial Article Body from Keystatic MDX */}
          <article className="lg:col-span-8 text-[#2C2B2B] leading-relaxed text-sm sm:text-base">
            <MdxContentRenderer content={post.content} showToc={true} />

            {/* Category Tag & Tags */}
            <div className="pt-8 mt-6 border-t border-[#D2D0C7]/60 flex flex-wrap items-center gap-2">
              {post.category && (
                <span className="bg-[#EDECE6] text-[#4A4944] text-xs font-semibold px-3.5 py-1.5 rounded-full border border-[#D2D0C7]">
                  #{post.category.replace(/\s+/g, "")}
                </span>
              )}
              {post.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#FAF9F5] text-[#575651] text-xs font-medium px-3 py-1 rounded-full border border-[#D2D0C7]/70"
                >
                  #{tag.replace(/\s+/g, "")}
                </span>
              ))}
            </div>
          </article>

          {/* Right Column: Sticky Sidebar with Recent Posts & Dark CTA */}
          <div className="lg:col-span-4 sticky top-24">
            <BlogSidebar recentPosts={sidebarRecentPosts} />
          </div>
        </div>

        {/* Read Next Recommendation Cards */}
        <ReadNextSection posts={readNextPosts} />
      </div>
    </div>
  );
}
