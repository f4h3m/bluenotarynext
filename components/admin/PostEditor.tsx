"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BLOG_CATEGORIES } from "@/keystatic.config";
import { PostFormData, savePostAction } from "@/lib/admin-actions";
import MdxContentRenderer from "@/components/blog/MdxContentRenderer";

interface PostEditorProps {
  initialData?: Partial<PostFormData>;
  isEditing?: boolean;
}

export default function PostEditor({
  initialData,
  isEditing = false,
}: PostEditorProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(
    initialData?.category || "Online Notarization"
  );
  const [author, setAuthor] = useState(initialData?.author || "Om Rathod");
  const [date, setDate] = useState(
    initialData?.date ||
      new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
  );
  const [imageUrl, setImageUrl] = useState(
    initialData?.imageUrl ||
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80"
  );
  const [imageAlt, setImageAlt] = useState(
    initialData?.imageAlt || "Notary document illustration"
  );
  const [featured, setFeatured] = useState(Boolean(initialData?.featured));
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(", ") : "Online Notarization, Guide"
  );
  const [content, setContent] = useState(
    initialData?.content ||
      `## Overview\n\nEnter your article introduction here.\n\n## Key Requirements\n\n- Requirement 1\n- Requirement 2\n\n## Frequently Asked Questions\n\n### How does this work?\nProvide clear guidance for readers.`
  );

  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auto-slugify when title changes on new posts
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isEditing) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  };

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("post-content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || "text";
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 10);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) {
      setStatusMessage({ type: "error", text: "Title and slug are required." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: PostFormData = {
      title: title.trim(),
      slug: slug.trim(),
      originalSlug: initialData?.originalSlug || (isEditing ? slug.trim() : undefined),
      category,
      author: author.trim(),
      date: date.trim(),
      imageUrl: imageUrl.trim(),
      imageAlt: imageAlt.trim(),
      featured,
      excerpt: excerpt.trim(),
      tags,
      content,
    };

    try {
      const res = await savePostAction(payload);
      if (res?.error) {
        setStatusMessage({ type: "error", text: res.error });
        setIsSubmitting(false);
      } else {
        setStatusMessage({
          type: "success",
          text: isEditing ? "Post updated successfully!" : "Post published successfully!",
        });
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 800);
      }
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.message || "Failed to save post.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D2D0C7]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#7A7873] uppercase tracking-wider mb-1">
            <Link href="/admin" className="hover:text-[#3B40D5]">
              ← All Posts
            </Link>
            <span>/</span>
            <span>{isEditing ? "Edit Article" : "New Article"}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#232222] tracking-tight">
            {isEditing ? `Edit: ${title || "Untitled"}` : "Create New Blog Post"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#575651] bg-[#FAF9F5] border border-[#D2D0C7] rounded-xl hover:bg-black/5 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-[#3B40D5] hover:bg-[#3035b8] rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            {isSubmitting ? (
              <span>Saving...</span>
            ) : (
              <>
                <span>{isEditing ? "Update Post" : "Publish Post"}</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs sm:text-sm font-semibold border ${
            statusMessage.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Main Grid: Left Settings & Details, Right Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Metadata) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Post Settings Card */}
          <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#232222]">
              Post Metadata
            </h2>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              >
                {BLOG_CATEGORIES.filter((c) => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Publish Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>

            {/* Featured Post Toggle */}
            <div className="pt-2 flex items-center justify-between border-t border-[#D2D0C7]/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#232222] block">
                  Featured Spotlight
                </span>
                <span className="text-[11px] text-[#7A7873]">
                  Highlight as main top article
                </span>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-[#3B40D5] rounded-md focus:ring-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Cover Image Card */}
          <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#232222]">
              Cover Image
            </h2>

            {/* Preview */}
            <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#E5E3DB] border border-[#D2D0C7]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={imageAlt || "Cover Preview"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-xs text-[#7A7873]">
                  No image URL
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Image URL (Unsplash or Local)
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>
          </div>

          {/* Tags Card */}
          <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-6 space-y-3 shadow-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#232222]">
              Tags (Comma separated)
            </h2>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Online Notarization, Compliance, Legal"
              className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
            />
          </div>
        </div>

        {/* Right Column (Title, Slug, Excerpt, Body) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Title & Slug */}
          <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl p-6 space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A4944] mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="Enter article headline..."
                required
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-[#232222] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                URL Slug: <span className="text-[#3B40D5] lowercase">/blog/{slug || "your-slug"}</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="custom-url-slug"
                required
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#575651] mb-1.5">
                Excerpt (Summary for Search & Social Cards)
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                placeholder="Brief summary of the article..."
                className="w-full bg-[#EDECE6] border border-[#D2D0C7] rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-[#2C2B2B] focus:outline-none focus:ring-2 focus:ring-[#3B40D5]/25 focus:border-[#3B40D5]"
              />
            </div>
          </div>

          {/* Article Body Editor with Live Markdown Preview */}
          <div className="bg-[#FAF9F5] border border-[#D2D0C7] rounded-2xl overflow-hidden shadow-xs">
            {/* Editor Header Bar with Formatting Tools */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 border-b border-[#D2D0C7] bg-[#EDECE6]/70">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => insertMarkdown("## ")}
                  className="px-2.5 py-1 text-xs font-bold text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("### ")}
                  className="px-2.5 py-1 text-xs font-bold text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  H3
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("**", "**")}
                  className="px-2.5 py-1 text-xs font-bold text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("*", "*")}
                  className="px-2.5 py-1 text-xs italic text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("[Link text](", ")")}
                  className="px-2.5 py-1 text-xs font-medium text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  Link
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("- ")}
                  className="px-2.5 py-1 text-xs font-medium text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  List
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown("> ")}
                  className="px-2.5 py-1 text-xs font-medium text-[#4A4944] hover:bg-black/10 rounded-md transition-colors cursor-pointer"
                >
                  Quote
                </button>
              </div>

              {/* Write vs Preview Tabs */}
              <div className="flex items-center bg-[#D2D0C7]/60 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveTab("write")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === "write"
                      ? "bg-white text-[#232222] shadow-2xs"
                      : "text-[#575651] hover:text-[#232222]"
                  }`}
                >
                  Write Markdown
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-white text-[#232222] shadow-2xs"
                      : "text-[#575651] hover:text-[#232222]"
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="p-6">
              {activeTab === "write" ? (
                <textarea
                  id="post-content-textarea"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={18}
                  placeholder="Write your article in Markdown/MDX..."
                  className="w-full bg-transparent text-[#2C2B2B] text-sm sm:text-base font-mono leading-relaxed focus:outline-none resize-y"
                />
              ) : (
                <div className="min-h-[400px]">
                  <MdxContentRenderer content={content} showToc={true} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
