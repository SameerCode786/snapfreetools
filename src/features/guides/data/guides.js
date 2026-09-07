/**
 * Centralized Guides & Resources Data Registry for SnapFreeTools
 */

export const GUIDE_CATEGORIES = [
  { id: "all", name: "All Guides" },
  { id: "images", name: "Images" },
  { id: "pdfs", name: "PDFs" },
  { id: "documents", name: "Documents" },
  { id: "productivity", name: "Productivity" },
  { id: "file-tools", name: "File Tools" },
  { id: "tips", name: "Tips & Tricks" }
];

export const GUIDES_DATA = [
  {
    id: "1",
    slug: "how-to-resize-images-without-losing-quality",
    title: "How to Resize Images Without Losing Quality",
    description: "Learn how image scaling algorithms work, how to preserve aspect ratio, and how to maintain sharpness when resizing photos for web and social media.",
    category: "images",
    categoryLabel: "Images",
    readingTime: "4 min read",
    updatedAt: "Sept 2026",
    featured: true,
    icon: "Scaling",
    toolRoute: "/image-resizer",
    toolName: "Image Resizer",
    status: "published"
  },
  {
    id: "2",
    slug: "jpg-vs-png-vs-webp-which-format-should-you-use",
    title: "JPG vs PNG vs WebP: Which Format Should You Use?",
    description: "A comprehensive breakdown of lossy vs lossless image formats, alpha transparency support, and when to pick WebP for 30%+ smaller web files.",
    category: "images",
    categoryLabel: "Images",
    readingTime: "5 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Image",
    toolRoute: "/image-compressor",
    toolName: "Image Compressor",
    status: "published"
  },
  {
    id: "3",
    slug: "how-to-reduce-pdf-file-size",
    title: "How to Reduce PDF File Size for Email and Portals",
    description: "Step-by-step techniques to shrink large PDF documents without sacrificing text readability or vector graphic sharpness.",
    category: "pdfs",
    categoryLabel: "PDFs",
    readingTime: "3 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "FileDown",
    toolRoute: "/compress-pdf",
    toolName: "Compress PDF",
    status: "published"
  },
  {
    id: "4",
    slug: "how-to-protect-a-pdf-with-a-password",
    title: "How to Protect a PDF With a Password in Your Browser",
    description: "Discover AES-256 PDF encryption, owner vs user passwords, and how to secure confidential files 100% locally without uploading files.",
    category: "pdfs",
    categoryLabel: "PDFs",
    readingTime: "4 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Lock",
    toolRoute: "/protect-pdf",
    toolName: "Protect PDF",
    status: "published"
  },
  {
    id: "5",
    slug: "how-to-unlock-a-password-protected-pdf",
    title: "How to Unlock a Password-Protected PDF File",
    description: "Learn how browser-based WebAssembly PDF decryption removes passwords and restrictions from your owner-encrypted documents safely.",
    category: "pdfs",
    categoryLabel: "PDFs",
    readingTime: "3 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Unlock",
    toolRoute: "/unlock-pdf",
    toolName: "Unlock PDF",
    status: "published"
  },
  {
    id: "6",
    slug: "how-to-convert-images-for-social-media",
    title: "How to Convert Images for Social Media Profiles and Posts",
    description: "Exact dimensions and aspect ratio guides for Instagram, Facebook Covers, YouTube Thumbnails, and LinkedIn posts.",
    category: "images",
    categoryLabel: "Images",
    readingTime: "4 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Maximize",
    toolRoute: "/image-resizer",
    toolName: "Image Resizer",
    status: "published"
  },
  {
    id: "7",
    slug: "how-to-optimize-images-for-websites",
    title: "How to Optimize Images for Web Performance & SEO",
    description: "Improve Core Web Vitals and website page speed by combining modern WebP conversion, proper pixel dimensions, and browser caching.",
    category: "productivity",
    categoryLabel: "Productivity",
    readingTime: "6 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Zap",
    toolRoute: "/image-compressor",
    toolName: "Image Compressor",
    status: "published"
  },
  {
    id: "8",
    slug: "understanding-image-dimensions-and-aspect-ratios",
    title: "Understanding Image Dimensions, Pixels, and Aspect Ratios",
    description: "Demystifying 16:9, 4:3, and 1:1 aspect ratios, pixel density (DPI/PPI), and how to calculate custom resolutions for displays.",
    category: "file-tools",
    categoryLabel: "File Tools",
    readingTime: "5 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Sliders",
    toolRoute: "/image-resizer",
    toolName: "Image Resizer",
    status: "published"
  },
  {
    id: "9",
    slug: "how-to-format-text-case-for-code-and-content",
    title: "How to Format Text Cases for Developers and Copywriters",
    description: "A complete guide to camelCase, PascalCase, snake_case, kebab-case, Title Case, and URL slug conversion formats.",
    category: "documents",
    categoryLabel: "Documents",
    readingTime: "4 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "Type",
    toolRoute: "/case-converter",
    toolName: "Case Converter",
    status: "published"
  },
  {
    id: "10",
    slug: "common-pdf-problems-and-how-to-fix-them",
    title: "Common PDF Problems and How to Fix Them Online",
    description: "Fix corrupt PDF streams, uneditable scans, oversized file attachments, and locked editing permissions directly in your browser.",
    category: "tips",
    categoryLabel: "Tips & Tricks",
    readingTime: "5 min read",
    updatedAt: "Sept 2026",
    featured: false,
    icon: "HelpCircle",
    toolRoute: "/pdf-to-word",
    toolName: "PDF to Word",
    status: "published"
  }
];

export const POPULAR_GUIDES_QUICK = [
  { title: "Image Resizing", route: "/image-resizer", desc: "Custom dimensions & presets" },
  { title: "PDF Compression", route: "/compress-pdf", desc: "Shrink PDFs client-side" },
  { title: "PDF Protection", route: "/protect-pdf", desc: "AES-256 encryption" },
  { title: "Text Case Conversion", route: "/case-converter", desc: "16 case modes" },
  { title: "Word Counting", route: "/word-counter", desc: "Real-time metrics" }
];
