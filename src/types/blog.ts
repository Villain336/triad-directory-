export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  coverImage?: string;
  tags: string[];
  citySlug?: string;
  categorySlug?: string;
  metaTitle?: string;
  metaDescription?: string;
}
