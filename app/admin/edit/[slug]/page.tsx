import React from "react";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import { getPostBySlug } from "@/lib/keystatic";
import PostEditor from "@/components/admin/PostEditor";

interface EditPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const initialData = {
    title: post.title,
    slug: post.slug,
    originalSlug: post.slug,
    category: post.category || "Online Notarization",
    author: post.author.name,
    date: post.date,
    imageUrl: post.imageUrl,
    imageAlt: post.imageAlt,
    featured: Boolean(post.featured),
    excerpt: post.excerpt || "",
    tags: post.tags ? [...post.tags] : [],
    content: post.content || "",
  };

  return <PostEditor initialData={initialData} isEditing={true} />;
}
