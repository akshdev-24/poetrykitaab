import fs from 'node:fs';
import path from 'node:path';
import type { Post } from '../types/content';
import { siteConfig } from '../config/siteConfig';

const CONTENT_DIR = path.resolve(process.cwd(), 'content/posts');

/**
 * Validates and normalizes raw JSON data into a valid Post object.
 * Returns null if the post is invalid beyond recovery.
 */
export function validateAndNormalizePost(data: any, fileName: string): Post | null {
  if (!data || typeof data !== 'object') {
    console.warn(`[Content Loader] Skipping malformed JSON file: ${fileName}`);
    return null;
  }

  const rawSlug = data.slug || path.basename(fileName, '.json');
  const slug = String(rawSlug)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-');

  if (!slug) {
    console.warn(`[Content Loader] Post in ${fileName} has no valid slug. Skipping.`);
    return null;
  }

  const text = String(data.text || data.quote || data.content || '').trim();
  if (!text) {
    console.warn(`[Content Loader] Post '${slug}' has no text/quote content.`);
  }

  const title = String(data.title || text.slice(0, 60) || 'Untitled').trim();
  const description = String(
    data.description || 
    (text ? `${text.slice(0, 150)}... Read and download quote.` : 'Explore meaningful quotes and status.')
  ).trim();

  // Normalize category to lowercase matching configured categories if possible
  const rawCat = String(data.category || 'quotes').trim().toLowerCase();
  const matchedCategory = siteConfig.categories.find(
    c => c.id.toLowerCase() === rawCat || c.slug.toLowerCase() === rawCat
  );
  const category = matchedCategory ? matchedCategory.id : (rawCat || 'quotes');
  const categoryName = matchedCategory ? matchedCategory.name : category.charAt(0).toUpperCase() + category.slice(1);

  // Normalize tags
  let tags: string[] = [];
  if (Array.isArray(data.tags)) {
    tags = data.tags.map((t: any) => String(t).trim().toLowerCase()).filter(Boolean);
  } else if (typeof data.tags === 'string') {
    tags = data.tags.split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
  }
  if (!tags.includes(category)) {
    tags.unshift(category);
  }

  // Image path normalization
  let imagePath = String(data.image_path || data.image || '').trim();
  if (!imagePath) {
    imagePath = '/fallback-quote.jpg';
  } else if (!imagePath.startsWith('/') && !imagePath.startsWith('http')) {
    imagePath = `/${imagePath}`;
  }

  // Created at date
  let createdAt = String(data.created_at || data.date || new Date().toISOString());
  let formattedDate = 'Recently published';
  try {
    const d = new Date(createdAt);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch {
    formattedDate = 'Recently published';
  }

  return {
    id: String(data.id || slug),
    slug,
    category,
    categoryName,
    text,
    title,
    description,
    tags: Array.from(new Set(tags)),
    image_path: imagePath,
    source_image_id: data.source_image_id || undefined,
    source_url: data.source_url || undefined,
    license: data.license || 'Free for personal use with attribution',
    attribution: data.attribution || 'Editorial Curation',
    created_at: createdAt,
    formattedDate,
    readingTime: '1 min read'
  };
}

/**
 * Loads and caches all posts from the filesystem `content/posts/*.json`.
 */
let cachedPosts: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cachedPosts !== null && process.env.NODE_ENV === 'production') {
    return cachedPosts;
  }

  if (!fs.existsSync(CONTENT_DIR)) {
    try {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    } catch {
      // Directory creation error fallback
    }
    return [];
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.json'));
  const postsMap = new Map<string, Post>();

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const json = JSON.parse(content);
      const post = validateAndNormalizePost(json, file);
      if (post) {
        // Prevent duplicate slugs
        if (!postsMap.has(post.slug)) {
          postsMap.set(post.slug, post);
        } else {
          console.warn(`[Content Loader] Duplicate slug detected: '${post.slug}' in ${file}. Kept original.`);
        }
      }
    } catch (err) {
      console.error(`[Content Loader] Error reading file ${file}:`, err);
    }
  }

  // Sort posts by created_at descending (newest first)
  const posts = Array.from(postsMap.values()).sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    if (isNaN(dateA) || isNaN(dateB)) return 0;
    return dateB - dateA;
  });

  cachedPosts = posts;
  return posts;
}

/**
 * Get post by slug
 */
export function getPostBySlug(slug: string): Post | undefined {
  const posts = getAllPosts();
  return posts.find(p => p.slug === slug);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(categorySlug: string): Post[] {
  const posts = getAllPosts();
  const normalizedCat = categorySlug.toLowerCase();
  return posts.filter(p => p.category.toLowerCase() === normalizedCat);
}

/**
 * Get related posts based on matching category and shared tags
 */
export function getRelatedPosts(currentPost: Post, limit = 4): Post[] {
  const allPosts = getAllPosts().filter(p => p.slug !== currentPost.slug);

  // Score posts: same category (+5), matching tags (+2 each)
  const scored = allPosts.map(post => {
    let score = 0;
    if (post.category === currentPost.category) {
      score += 5;
    }
    const sharedTags = post.tags.filter(t => currentPost.tags.includes(t));
    score += sharedTags.length * 2;
    return { post, score };
  });

  // Sort by highest score first, fallback to newest
  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map(s => s.post);
}

/**
 * Search posts by query across title, text, category, and tags
 */
export function searchPosts(query: string): Post[] {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase().trim();
  const posts = getAllPosts();

  return posts.filter(post => {
    return (
      post.title.toLowerCase().includes(q) ||
      post.text.toLowerCase().includes(q) ||
      post.category.toLowerCase().includes(q) ||
      post.tags.some(tag => tag.toLowerCase().includes(q))
    );
  });
}
