import { createReader } from "@keystatic/core/reader";
import keystaticConfig, { BLOG_CATEGORIES } from "@/keystatic.config";
import { BlogPost, SidebarRecentPost, ReadNextPost } from "@/types/blog";

export const reader = createReader(process.cwd(), keystaticConfig);
export { BLOG_CATEGORIES };

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const rawPosts = await reader.collections.posts.all();
    return rawPosts.map((p) => ({
      id: p.slug,
      slug: `/blog/${p.slug}`,
      title: p.entry.title,
      category: p.entry.category,
      author: {
        name: p.entry.author || "Om Rathod",
        url: `/authors/${(p.entry.author || "om-rathod")
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
      date: p.entry.date,
      imageUrl:
        p.entry.imageUrl ||
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80",
      imageAlt: p.entry.imageAlt || p.entry.title,
      excerpt: p.entry.excerpt,
      featured: Boolean(p.entry.featured),
      tags: p.entry.tags || [],
    }));
  } catch (error) {
    console.error("Error reading Keystatic posts:", error);
    return [];
  }
}

export async function getFeaturedPost(): Promise<BlogPost> {
  const posts = await getAllPosts();
  const featured = posts.find((p) => p.featured);
  return (
    featured ||
    posts[0] || {
      id: "featured-default",
      slug: "/blog/how-long-is-your-ron-recording-kept",
      title: "How Long Is Your RON Recording Kept And Who Can See It?",
      category: "Online Notarization",
      author: { name: "Om Rathod", url: "/authors/om-rathod" },
      date: "August 6, 2026",
      imageUrl:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Notary public stamping legal document",
      featured: true,
    }
  );
}

export async function getRecentPosts(limit = 4): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const nonFeatured = posts.filter((p) => !p.featured);
  return (nonFeatured.length > 0 ? nonFeatured : posts).slice(0, limit);
}

export async function getSidebarRecentPosts(limit = 4): Promise<SidebarRecentPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    date: p.date,
    imageUrl: p.imageUrl,
  }));
}

export async function getReadNextPosts(limit = 3): Promise<ReadNextPost[]> {
  const posts = await getAllPosts();
  return posts.slice(0, limit).map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    author: p.author.name,
    date: p.date,
    excerpt:
      p.excerpt ||
      "Step-by-step guide to remote online notarization laws, certifications, and compliance.",
    imageUrl: p.imageUrl,
    tags: p.tags ? [...p.tags] : ["Online Notarization"],
  }));
}

export async function getPostBySlug(slug: string) {
  try {
    const rawPost = await reader.collections.posts.read(slug);
    if (!rawPost) return null;

    const contentString =
      typeof rawPost.content === "function" ? await rawPost.content() : "";

    return {
      slug,
      title: rawPost.title,
      category: rawPost.category,
      author: {
        name: rawPost.author || "Om Rathod",
        url: `/authors/${(rawPost.author || "om-rathod")
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      },
      date: rawPost.date,
      imageUrl:
        rawPost.imageUrl ||
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
      imageAlt: rawPost.imageAlt || rawPost.title,
      excerpt: rawPost.excerpt,
      featured: Boolean(rawPost.featured),
      tags: rawPost.tags || [],
      content: contentString,
    };
  } catch (error) {
    console.error(`Error reading post with slug ${slug}:`, error);
    return null;
  }
}
