# Antigravity Quotes & Status Content Platform

A fast, SEO-first, mobile-first editorial website built with **Astro + TypeScript + Tailwind CSS** designed specifically for quotes, statuses, shayari, and reflections. It is completely decoupled and ready to consume automated content and posters from a Python automation pipeline.

---

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build optimized static production bundle
npm run build

# 4. Preview production build locally
npm run preview
```

---

## 🌐 1. Central Domain Configuration

When your custom production domain is ready, update **ONE** central configuration variable in [`src/config/siteConfig.ts`](file:///c:/Users/akk/Desktop/website%20automation/src/config/siteConfig.ts):

```typescript
export const SITE_URL = "https://yourdomain.com"; // <-- Replace with your real domain
```

Changing this single value automatically updates:
* ✅ Canonical URLs across all pages
* ✅ Open Graph (`og:url`, `og:image`) & Twitter/X meta cards
* ✅ JSON-LD structured data (`WebSite`, `Organization`, `BreadcrumbList`, `Article`)
* ✅ Dynamic XML sitemap (`/sitemap.xml`)
* ✅ Robots crawler configuration (`/robots.txt`)
* ✅ Social share links (WhatsApp, Pinterest, Web Share API)

---

## 📂 2. Automated Python Content Ingestion

The frontend is designed to consume data directly from the Git repository:

### Where generated JSON posts go:
```
content/posts/*.json
```

**Post JSON Schema:**
```json
{
  "id": "post-unique-id",
  "slug": "your-seo-friendly-slug",
  "category": "motivational",
  "text": "Dream it. Plan it. Do it.",
  "title": "Dream it. Plan it. Do it - Actionable Quote",
  "description": "Big dreams come true when you take small, consistent steps...",
  "tags": ["motivation", "success", "goals"],
  "image_path": "/generated/mountain-sunset.svg",
  "source_image_id": "img_001",
  "source_url": "https://unsplash.com",
  "license": "Unsplash Commercial Free License",
  "attribution": "Editorial Curation",
  "created_at": "2026-04-24T10:00:00Z"
}
```

### Where generated images go:
```
public/generated/*
```
Any image placed in `public/generated/image-name.jpg` is instantly accessible at `/generated/image-name.jpg`.

---

## 🏗️ Architecture & Features

* **Static Site Generation (SSG)**: Zero-JS default rendering for blazing fast page loads and Core Web Vitals.
* **Granular SEO & Structured Data**: Built-in JSON-LD schemas for `WebSite`, `Organization`, `BreadcrumbList`, and `Article`.
* **Client-Side Search**: Real-time filtering by keyword, tag, or category with URL synchronization (`/search/?q=...`).
* **Interactive Actions**:
  * **Download Image**: Downloads high-res poster directly to device.
  * **Copy Text**: Copies exact quote with non-intrusive `Copied ✓` feedback.
  * **Copy Link**: Copies canonical page URL with `Link copied ✓` feedback.
  * **Social Sharing**: WhatsApp, Pinterest, and native Web Share API.
* **Dark / Light Mode**: Instant, flicker-free theme switcher with local storage persistence.
* **Defensive Content Loader**: Gracefully validates malformed JSON, skips duplicate slugs, and provides empty state fallbacks.

---

## 📁 Project Structure

```
├── content/
│   └── posts/                     # Automated JSON quotes
├── public/
│   ├── generated/                 # Automated image posters (WebP/SVG/JPG)
│   ├── favicon.svg                # Brand icon
│   ├── og-image.svg               # Social graph fallback image
│   └── fallback-quote.svg         # Missing image placeholder
├── src/
│   ├── components/                # Reusable UI components
│   │   ├── Breadcrumbs.astro
│   │   ├── CategoryPills.astro
│   │   ├── EmptyState.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Icons.astro
│   │   ├── PostCard.astro
│   │   └── ShareButtons.astro
│   ├── config/
│   │   └── siteConfig.ts          # Central SITE_URL and site metadata
│   ├── layouts/
│   │   └── BaseLayout.astro       # Base HTML, SEO meta, JSON-LD, Fonts
│   ├── pages/
│   │   ├── [category]/
│   │   │   ├── [slug].astro       # Individual Post Page
│   │   │   └── index.astro        # Category Archive Page
│   │   ├── about/index.astro      # About Us Page
│   │   ├── contact/index.astro    # Contact Page
│   │   ├── disclaimer/index.astro # Content & Image Disclaimer
│   │   ├── privacy-policy/index.astro # Privacy Policy
│   │   ├── search/index.astro     # Search Page
│   │   ├── terms/index.astro      # Terms of Service
│   │   ├── 404.astro              # Custom 404 Page
│   │   ├── index.astro            # Homepage
│   │   ├── robots.txt.ts          # Dynamic robots.txt
│   │   └── sitemap.xml.ts         # Dynamic sitemap.xml
│   ├── styles/
│   │   └── global.css             # Tailwind base and theme variables
│   ├── types/
│   │   └── content.ts             # TypeScript definitions
│   └── utils/
│       ├── contentLoader.ts       # Defensive JSON loader & recommendation engine
│       └── seo.ts                 # Canonical URLs & JSON-LD helpers
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```
