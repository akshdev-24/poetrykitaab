/**
 * Central Website Configuration for PoetryKitaab
 * 
 * Update `SITE_URL` when your custom production domain is ready.
 */
export const SITE_URL = "https://poetrykitaab.pages.dev"; // <-- REPLACE WITH YOUR FINAL DOMAIN

export const siteConfig = {
  name: "PoetryKitaab",
  brandName: "PoetryKitaab",
  tagline: "Words for the feelings you can't explain.",
  description: "A digital poetry journal and literary archive. Curating soulful shayari, heartfelt nazms, timeless quotes, and reflections for quiet nights, love, heartache, and life.",
  url: SITE_URL,
  author: "PoetryKitaab Editorial Board",
  contactEmail: "editor@poetrykitaab.com",
  defaultOgImage: "/og-image.svg",
  locale: "en_US",
  themeColor: "#883025",
  
  // Primary genres / content categories
  categories: [
    {
      id: "poetry",
      name: "Poetry",
      slug: "poetry",
      hindi: "कविता",
      icon: "feather",
      description: "Modern & classic verses exploring human vulnerability, love, longing, and quiet reflections.",
      accent: "burgundy"
    },
    {
      id: "shayari",
      name: "Shayari",
      slug: "shayari",
      hindi: "शायरी",
      icon: "quote",
      description: "Soulful Hindi & Urdu couplets and nazms that give voice to unsaid emotions.",
      accent: "terracotta"
    },
    {
      id: "quotes",
      name: "Quotes",
      slug: "quotes",
      hindi: "सुविचार",
      icon: "book-open",
      description: "Carefully chosen words from philosophers, writers, and voices across generations.",
      accent: "olive"
    },
    {
      id: "love",
      name: "Love & Ishq",
      slug: "love",
      hindi: "इश्क़",
      icon: "heart",
      description: "Tender verses, intimate confessions, and the quiet beauty of being in love.",
      accent: "rose"
    },
    {
      id: "sad",
      name: "Sad & Dard",
      slug: "sad",
      hindi: "दर्द",
      icon: "cloud-rain",
      description: "Comforting lines for days when feelings weigh heavy and solitude is solace.",
      accent: "slate"
    },
    {
      id: "heartbreak",
      name: "Heartbreak",
      slug: "heartbreak",
      hindi: "अलविदा",
      icon: "heart-crack",
      description: "Poetry on letting go, closure, moving on, and healing wounded hearts.",
      accent: "zinc"
    },
    {
      id: "life",
      name: "Life & Zindagi",
      slug: "life",
      hindi: "ज़िंदगी",
      icon: "compass",
      description: "Reflections on time, growing up, resilience, destiny, and the human journey.",
      accent: "emerald"
    },
    {
      id: "motivation",
      name: "Ambition & Himmat",
      slug: "motivation",
      hindi: "हिम्मत",
      icon: "flame",
      description: "Inspiring words to spark courage, discipline, and perseverance in your craft.",
      accent: "amber"
    },
    {
      id: "attitude",
      name: "Attitude & Self",
      slug: "attitude",
      hindi: "स्वाभिमान",
      icon: "zap",
      description: "Unapologetic verses on self-worth, dignity, quiet grind, and individuality.",
      accent: "orange"
    },
    {
      id: "status",
      name: "Daily Lines",
      slug: "status",
      hindi: "पंक्तियाँ",
      icon: "sparkles",
      description: "Short, poignant status lines crafted for thoughtful sharing and stories.",
      accent: "warm"
    }
  ],

  // Mood-based pathways ("Explore by Feeling")
  moods: [
    {
      title: "For quiet nights",
      subtitle: "Lines to read when the world is asleep",
      slug: "sad",
      tag: "quiet-nights"
    },
    {
      title: "For when you miss someone",
      subtitle: "Unspoken feelings and distant memories",
      slug: "shayari",
      tag: "longing"
    },
    {
      title: "For falling in love",
      subtitle: "The tender warmth of gentle beginnings",
      slug: "love",
      tag: "romance"
    },
    {
      title: "For broken hearts",
      subtitle: "Words to sit with your pain until it heals",
      slug: "heartbreak",
      tag: "healing"
    },
    {
      title: "For finding yourself",
      subtitle: "Reflections on solitude and inner peace",
      slug: "life",
      tag: "solitude"
    },
    {
      title: "For quiet courage",
      subtitle: "Gentle strength when you feel like quitting",
      slug: "motivation",
      tag: "courage"
    }
  ],

  social: {
    twitter: "https://twitter.com/poetrykitaab",
    instagram: "https://instagram.com/poetrykitaab",
    pinterest: "https://pinterest.com/poetrykitaab"
  }
};

export type Category = (typeof siteConfig.categories)[number];
