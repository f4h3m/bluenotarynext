export interface BlogAuthor {
  name: string;
  url?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category?: string;
  author: BlogAuthor;
  date: string;
  imageUrl: string;
  imageAlt: string;
  excerpt?: string;
  featured?: boolean;
  tags?: readonly string[];
}

export interface SidebarRecentPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  imageUrl: string;
}

export interface ReadNextPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  date: string;
  excerpt: string;
  imageUrl: string;
  tags: string[];
}

export interface BlogHeroSectionProps {
  featuredPost: BlogPost;
  recentPosts: BlogPost[];
  onSearch?: (query: string) => void;
  className?: string;
}

export interface CategorySectionProps {
  categories?: readonly string[];
  posts?: BlogPost[];
  defaultCategory?: string;
  className?: string;
}
