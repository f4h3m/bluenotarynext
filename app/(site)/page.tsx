import BlogHeroSection from "@/components/blog/BlogHeroSection";
import CategorySection from "@/components/blog/CategorySection";
import {
  getFeaturedPost,
  getRecentPosts,
  getAllPosts,
  BLOG_CATEGORIES,
} from "@/lib/keystatic";

export default async function Home() {
  const [featuredPost, recentPosts, allPosts] = await Promise.all([
    getFeaturedPost(),
    getRecentPosts(4),
    getAllPosts(),
  ]);

  return (
    <main className="flex-1 flex flex-col bg-[#fffcf1] px-6 sm:px-10 md:px-14 lg:px-16">
      {/* Top 60/40 Blog Hero Section */}
      <BlogHeroSection
        featuredPost={featuredPost}
        recentPosts={recentPosts}
        allPosts={allPosts}
      />

      {/* Interactive Category Tabs & 3-Card Grid Section */}
      <CategorySection
        categories={BLOG_CATEGORIES}
        posts={allPosts}
        defaultCategory="All"
      />
    </main>
  );
}
