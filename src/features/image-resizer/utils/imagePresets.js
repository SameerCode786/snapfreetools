/**
 * Preset Dimensions & Configs for Image Resizer
 */

export const PRESETS = [
  { id: "custom", name: "Custom Dimensions", group: "Custom" },
  
  // Social Media Presets
  { id: "insta-square", name: "Instagram Square (1080 × 1080)", width: 1080, height: 1080, group: "Social Media" },
  { id: "insta-portrait", name: "Instagram Portrait (1080 × 1350)", width: 1080, height: 1350, group: "Social Media" },
  { id: "insta-landscape", name: "Instagram Landscape (1080 × 566)", width: 1080, height: 566, group: "Social Media" },
  { id: "fb-cover", name: "Facebook Cover (820 × 312)", width: 820, height: 312, group: "Social Media" },
  { id: "yt-thumbnail", name: "YouTube Thumbnail (1280 × 720)", width: 1280, height: 720, group: "Social Media" },
  { id: "linkedin-post", name: "LinkedIn Post (1200 × 627)", width: 1200, height: 627, group: "Social Media" },

  // Common Display Presets
  { id: "fhd", name: "1920 × 1080 (Full HD)", width: 1920, height: 1080, group: "Common" },
  { id: "hd", name: "1280 × 720 (HD)", width: 1280, height: 720, group: "Common" },
  { id: "xga", name: "1024 × 768 (XGA)", width: 1024, height: 768, group: "Common" },
  { id: "svga", name: "800 × 600 (SVGA)", width: 800, height: 600, group: "Common" },
  { id: "vga", name: "640 × 480 (VGA)", width: 640, height: 480, group: "Common" },

  // Web Presets
  { id: "web-large", name: "1200 × 800 (Web Banner)", width: 1200, height: 800, group: "Web" },
  { id: "web-medium", name: "1200 × 630 (OG / Social Card)", width: 1200, height: 630, group: "Web" },
  { id: "web-square", name: "800 × 800 (Product Card)", width: 800, height: 800, group: "Web" }
];

export const FORMAT_OPTIONS = [
  { id: "original", name: "Same as Original", mime: "" },
  { id: "jpeg", name: "JPG / JPEG", mime: "image/jpeg", extension: "jpg" },
  { id: "png", name: "PNG (Lossless)", mime: "image/png", extension: "png" },
  { id: "webp", name: "WebP (Modern)", mime: "image/webp", extension: "webp" }
];
