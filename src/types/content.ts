export interface Post {
  id: string;
  slug: string;
  category: string;
  text: string;
  title: string;
  description: string;
  tags: string[];
  image_path: string;
  source_image_id?: string;
  source_url?: string;
  license?: string;
  attribution?: string;
  created_at: string;
  // Computed fields
  readingTime?: string;
  formattedDate?: string;
  categoryName?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface SiteMeta {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  keywords?: string[];
  noindex?: boolean;
}
