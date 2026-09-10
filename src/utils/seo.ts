import { SITE_URL, siteConfig } from '../config/siteConfig';
import type { Post, BreadcrumbItem, SiteMeta } from '../types/content';

/**
 * Ensures an absolute URL using the centralized SITE_URL.
 */
export function getAbsoluteUrl(path: string = ''): string {
  const base = SITE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

/**
 * Generate SEO titles with consistent branding hierarchy
 */
export function formatTitle(pageTitle?: string): string {
  if (!pageTitle) return `${siteConfig.name} - ${siteConfig.tagline}`;
  if (pageTitle.includes(siteConfig.name)) return pageTitle;
  return `${pageTitle} | ${siteConfig.name}`;
}

/**
 * Builds JSON-LD for WebSite and Organization
 */
export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': siteConfig.name,
    'url': getAbsoluteUrl('/'),
    'logo': {
      '@type': 'ImageObject',
      'url': getAbsoluteUrl('/logo.png')
    },
    'sameAs': Object.values(siteConfig.social).filter(Boolean)
  };
}

export function getWebsiteSchema(pageLanguage: string = 'en-US') {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${getAbsoluteUrl('/')}#website`,
        'url': getAbsoluteUrl('/'),
        'name': siteConfig.name,
        'description': siteConfig.description,
        'publisher': {
          '@id': `${getAbsoluteUrl('/')}#organization`
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${getAbsoluteUrl('/search')}?q={search_term_string}`
          },
          'query-input': 'required name=search_term_string'
        },
        'inLanguage': pageLanguage
      },
      {
        '@type': 'Organization',
        '@id': `${getAbsoluteUrl('/')}#organization`,
        'name': siteConfig.name,
        'url': getAbsoluteUrl('/'),
        'logo': {
          '@type': 'ImageObject',
          'url': getAbsoluteUrl('/favicon.svg')
        },
        'sameAs': Object.values(siteConfig.social).filter(Boolean)
      }
    ]
  };
}


/**
 * Builds JSON-LD for BreadcrumbList
 */
export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': getAbsoluteUrl(item.url)
    }))
  };
}

/**
 * Builds JSON-LD for individual Post (Quotation / Article)
 */
export function getPostSchema(post: Post) {
  const postUrl = getAbsoluteUrl(`/${post.category}/${post.slug}`);
  const imageUrl = post.image_path.startsWith('http') 
    ? post.image_path 
    : getAbsoluteUrl(post.image_path);

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${postUrl}#article`,
    'headline': post.title,
    'description': post.description,
    'articleBody': post.text,
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': postUrl
    },
    'url': postUrl,
    'image': [imageUrl],
    'datePublished': post.created_at,
    'dateModified': post.created_at,
    'author': {
      '@type': 'Organization',
      'name': siteConfig.author,
      'url': getAbsoluteUrl('/')
    },
    'publisher': {
      '@type': 'Organization',
      'name': siteConfig.name,
      'url': getAbsoluteUrl('/')
    },
    'keywords': post.tags.join(', ')
  };
}
