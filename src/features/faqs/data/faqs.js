export const FAQ_CATEGORIES = [
  { id: "all", name: "All Questions" },
  { id: "general", name: "General" },
  { id: "privacy", name: "Privacy & Security" },
  { id: "pdf", name: "PDF Tools" },
  { id: "images", name: "Image Tools" },
  { id: "converters", name: "Converters" },
  { id: "troubleshooting", name: "Troubleshooting" }
];

export const FAQS_DATA = [
  // GENERAL
  {
    id: "what-is-snapfreetools",
    question: "What is SnapFreeTools?",
    answer: "SnapFreeTools is a privacy-focused suite of online utility tools designed for everyday tasks including PDF management, image processing, text formatting, and academic calculators. Most tools process files directly inside your web browser using HTML5 and JavaScript APIs, eliminating the need to upload sensitive documents to remote servers.",
    category: "general",
    keywords: ["what", "snapfreetools", "overview", "platform", "suite", "about"],
    popular: true,
    relatedTool: "All Tools",
    relatedToolRoute: "/calculators",
    order: 1
  },
  {
    id: "are-tools-free",
    question: "Are SnapFreeTools tools completely free?",
    answer: "Yes, 100% free! All tools on SnapFreeTools can be used without any payment, subscriptions, credit cards, or hidden fees. There are no daily usage limits or artificial restrictions.",
    category: "general",
    keywords: ["free", "cost", "price", "subscription", "pricing", "pay"],
    popular: true,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 2
  },
  {
    id: "do-i-need-account",
    question: "Do I need to create an account to use the tools?",
    answer: "No registration or account creation is required. You can access and use every tool instantly from any browser without sharing your email address or personal details.",
    category: "general",
    keywords: ["account", "signup", "login", "register", "email", "no signup"],
    popular: false,
    relatedTool: "Word Counter",
    relatedToolRoute: "/word-counter",
    order: 3
  },
  {
    id: "supported-browsers",
    question: "Which web browsers are supported?",
    answer: "SnapFreeTools works on all modern, standards-compliant web browsers including Google Chrome, Mozilla Firefox, Apple Safari, Microsoft Edge, Opera, and Brave. For optimal client-side processing performance, we recommend keeping your browser updated to the latest version.",
    category: "general",
    keywords: ["browser", "chrome", "firefox", "safari", "edge", "compatibility", "support"],
    popular: true,
    relatedTool: "Case Converter",
    relatedToolRoute: "/case-converter",
    order: 4
  },
  {
    id: "mobile-support",
    question: "Can I use SnapFreeTools on mobile devices?",
    answer: "Yes. SnapFreeTools is fully responsive and optimized for touch devices including iPhone, iPad, Android smartphones, and tablets. You can resize images, convert text, and view calculations seamlessly on mobile screens.",
    category: "general",
    keywords: ["mobile", "phone", "android", "iphone", "tablet", "responsive"],
    popular: false,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 5
  },

  // PRIVACY & SECURITY
  {
    id: "are-files-uploaded",
    question: "Are my files uploaded to a server?",
    answer: "No. Client-side tools on SnapFreeTools (such as Image Resizer, Protect PDF, Unlock PDF, and Case Converter) process your files entirely in local browser memory (WebAssembly, HTML5 Canvas, JavaScript). Your files never leave your device and are never sent over the internet to our or any third-party servers.",
    category: "privacy",
    keywords: ["upload", "server", "local", "browser", "privacy", "security", "data"],
    popular: true,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 6
  },
  {
    id: "are-files-stored",
    question: "Are my files stored anywhere?",
    answer: "Because file processing occurs locally on your machine, SnapFreeTools does not store, archive, or cache any of your input files, transformed images, or documents. Once you close or refresh your browser tab, memory used during processing is automatically freed by your web browser.",
    category: "privacy",
    keywords: ["stored", "storage", "cached", "retention", "delete", "saved"],
    popular: false,
    relatedTool: "Unlock PDF",
    relatedToolRoute: "/unlock-pdf",
    order: 7
  },
  {
    id: "does-snapfreetools-see-files",
    question: "Does SnapFreeTools see or inspect my files?",
    answer: "No. Because zero file data is transmitted to our servers, we have no access to inspect, view, read, or analyze your personal documents, photos, or text input.",
    category: "privacy",
    keywords: ["see", "view", "inspect", "read", "private", "confidential"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 8
  },
  {
    id: "how-client-side-processing-works",
    question: "How does local browser-based processing work?",
    answer: "Modern web browsers are powerful application platforms. Using technologies like HTML5 Canvas, WebAssembly (WASM), and the File Web API, your computer's CPU renders, resizes, encrypts, or converts files locally without needing server-side computation.",
    category: "privacy",
    keywords: ["client-side", "browser", "how it works", "wasm", "canvas", "javascript"],
    popular: true,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 9
  },
  {
    id: "passwords-sent-to-server",
    question: "Are passwords sent to a server when using Protect PDF or Unlock PDF?",
    answer: "Never. PDF password validation and encryption (such as AES-256) are computed completely inside your browser using JavaScript cryptography modules. Passwords are never transmitted across the network.",
    category: "privacy",
    keywords: ["passwords", "encrypt", "protect pdf", "security", "network", "safety"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 10
  },
  {
    id: "what-happens-after-finish",
    question: "What happens to my files after I finish downloading?",
    answer: "Downloaded files are saved directly into your device's local Downloads folder. In-browser previews and Blob URLs are revoked and cleaned up to prevent memory leaks.",
    category: "privacy",
    keywords: ["download", "after", "cleanup", "blob", "memory"],
    popular: false,
    relatedTool: "Image Compressor",
    relatedToolRoute: "/image-compressor",
    order: 11
  },
  {
    id: "safe-for-private-documents",
    question: "Is SnapFreeTools safe for confidential or sensitive documents?",
    answer: "Yes. Since processing happens locally on your device without server transmission, SnapFreeTools provides maximum privacy for sensitive legal, financial, or personal documents.",
    category: "privacy",
    keywords: ["confidential", "sensitive", "legal", "financial", "safe", "security"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 12
  },

  // PDF TOOLS
  {
    id: "how-protect-pdf-works",
    question: "How does Protect PDF work?",
    answer: "Protect PDF allows you to set an owner password or user open password on your document. It uses standard PDF encryption algorithms (such as 128-bit or 256-bit AES) right inside your web browser.",
    category: "pdf",
    keywords: ["protect pdf", "encryption", "password", "security", "pdf lock"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 13
  },
  {
    id: "protect-pdf-real-encryption",
    question: "Does Protect PDF add real standard PDF encryption?",
    answer: "Yes. Protect PDF applies standard specification compliant PDF encryption. The output PDF files can be opened and authenticated with any standard PDF reader like Adobe Acrobat, Chrome PDF Viewer, or Apple Preview.",
    category: "pdf",
    keywords: ["real encryption", "adobe acrobat", "standard", "aes", "compliance"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 14
  },
  {
    id: "open-in-adobe-acrobat",
    question: "Can protected PDFs created here be opened in Adobe Acrobat?",
    answer: "Absolutely. Standard PDF readers like Adobe Acrobat, Foxit Reader, macOS Preview, and PDF browser extensions will prompt for the exact password you set.",
    category: "pdf",
    keywords: ["adobe acrobat", "foxit", "mac preview", "pdf viewer"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 15
  },
  {
    id: "pdf-formats-supported",
    question: "What PDF versions and formats are supported?",
    answer: "Our PDF tools support standard PDF versions 1.3 through 1.7 and PDF 2.0 documents, including single-page and multi-page PDFs created by scanner apps, Word, or graphic software.",
    category: "pdf",
    keywords: ["pdf formats", "pdf version", "versions", "scanned pdf"],
    popular: false,
    relatedTool: "PDF Tools",
    relatedToolRoute: "/pdf-tools",
    order: 16
  },
  {
    id: "forgot-pdf-password",
    question: "What happens if I forget my PDF password?",
    answer: "Because we do not store passwords or maintain backdoors for client-side encrypted files, lost passwords cannot be recovered by us. Always keep a copy of your original unencrypted document or store your password in a safe password manager.",
    category: "pdf",
    keywords: ["forgot password", "lost password", "recovery", "unlock"],
    popular: false,
    relatedTool: "Unlock PDF",
    relatedToolRoute: "/unlock-pdf",
    order: 17
  },

  // IMAGE TOOLS
  {
    id: "image-formats-supported",
    question: "What image formats are supported by Image Resizer and Compressor?",
    answer: "Our image tools support standard web image formats including JPG/JPEG, PNG, WebP, GIF, and SVG. Output files can be exported as JPG, PNG, or WebP depending on your quality and transparency preferences.",
    category: "images",
    keywords: ["jpg", "png", "webp", "gif", "svg", "image formats", "supported formats"],
    popular: true,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 18
  },
  {
    id: "resize-jpg-png-webp",
    question: "Can I resize JPG, PNG, and WebP images?",
    answer: "Yes. You can resize images by exact pixel dimensions (width x height), scale percentages, or preset social media aspect ratios (Instagram square, YouTube thumbnail, Facebook cover, etc.).",
    category: "images",
    keywords: ["resize", "dimensions", "pixels", "scale", "presets", "aspect ratio"],
    popular: false,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 19
  },
  {
    id: "resize-multiple-images",
    question: "Can I resize multiple images at once (batch resize)?",
    answer: "Yes! Our Image Resizer supports batch upload and processing. You can select multiple images, apply your desired dimensions or scaling percentage, and process them all in one go.",
    category: "images",
    keywords: ["batch", "multiple images", "bulk", "batch resize", "many photos"],
    popular: false,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 20
  },
  {
    id: "preserve-png-transparency",
    question: "Can I preserve PNG transparency when resizing or converting?",
    answer: "Yes. When exporting to PNG or WebP, transparent backgrounds (alpha channels) are fully preserved. If converting to JPG, transparent areas will automatically render on a solid white background since JPG does not support alpha channel transparency.",
    category: "images",
    keywords: ["png transparency", "transparent", "alpha channel", "background"],
    popular: false,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 21
  },
  {
    id: "output-image-larger",
    question: "Why can an output image sometimes become larger in file size?",
    answer: "If you convert a highly compressed JPG into an uncompressed PNG, or re-encode an image at a higher quality compression setting (e.g. 100% quality), the resulting file size may exceed the original. To reduce file size, export as WebP or lower the quality slider.",
    category: "images",
    keywords: ["larger file size", "file size increased", "big file", "quality slider", "compression"],
    popular: false,
    relatedTool: "Image Compressor",
    relatedToolRoute: "/image-compressor",
    order: 22
  },

  // CONVERTERS
  {
    id: "what-is-case-converter",
    question: "What is Case Converter?",
    answer: "Case Converter is an advanced text transformation tool that converts text into 16 popular formats, including UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, and URL slugs.",
    category: "converters",
    keywords: ["case converter", "uppercase", "lowercase", "title case", "camelcase", "slug"],
    popular: false,
    relatedTool: "Case Converter",
    relatedToolRoute: "/case-converter",
    order: 23
  },
  {
    id: "case-converter-privacy",
    question: "Does Case Converter send text to a server?",
    answer: "No. All text formatting, character counting, and transformation logic run entirely inside your browser JavaScript runtime. Your input text is never saved or sent to any server.",
    category: "converters",
    keywords: ["case converter server", "text privacy", "local text", "private text"],
    popular: false,
    relatedTool: "Case Converter",
    relatedToolRoute: "/case-converter",
    order: 24
  },
  {
    id: "convert-large-amounts-of-text",
    question: "Can I convert large amounts of text or documents?",
    answer: "Yes. Case Converter easily handles thousands of lines of text or code without lag, thanks to efficient regex matching and optimized memory allocation.",
    category: "converters",
    keywords: ["large text", "long document", "code conversion", "performance"],
    popular: false,
    relatedTool: "Case Converter",
    relatedToolRoute: "/case-converter",
    order: 25
  },

  // TROUBLESHOOTING
  {
    id: "why-isnt-file-uploading",
    question: "Why isn't my file loading or uploading?",
    answer: "If a file fails to load, ensure that your file format is supported and that your browser has sufficient free RAM. Extremely large files (e.g. over 200MB) may exceed browser memory allocations on older mobile devices.",
    category: "troubleshooting",
    keywords: ["file not loading", "upload error", "failed", "memory limit", "corrupt file"],
    popular: false,
    relatedTool: "Image Resizer",
    relatedToolRoute: "/image-resizer",
    order: 26
  },
  {
    id: "cant-download-output",
    question: "Why can't I download the output file?",
    answer: "If clicking download does nothing, verify that pop-up blockers or ad-blockers are not blocking blob object URL downloads. Additionally, ensure your browser has permission to save files to your device.",
    category: "troubleshooting",
    keywords: ["cannot download", "download button not working", "blob error", "popup blocker"],
    popular: false,
    relatedTool: "Image Compressor",
    relatedToolRoute: "/image-compressor",
    order: 27
  },
  {
    id: "browser-feature-unavailable",
    question: "Why is a browser feature or tool button unavailable?",
    answer: "Some advanced features (like WebAssembly acceleration or modern Canvas filters) require an up-to-date web browser. If a button appears disabled, try updating Chrome, Firefox, Safari, or Edge to the latest version.",
    category: "troubleshooting",
    keywords: ["unavailable", "disabled button", "browser update", "outdated browser"],
    popular: false,
    relatedTool: "Protect PDF",
    relatedToolRoute: "/protect-pdf",
    order: 28
  }
];

export const POPULAR_FAQS = FAQS_DATA.filter((faq) => faq.popular);
