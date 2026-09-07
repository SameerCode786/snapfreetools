import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import ImageResizerFeature from "@/features/image-resizer";

export function generateMetadata() {
  return generatePageMetadata("image-resizer");
}

const FAQS_DATA = [
  {
    question: "How do I resize an image online for free?",
    answer: "Upload your image using drag and drop or browse, specify your desired width and height in pixels or percentage, and click 'Download Resized Image'. The entire process happens in seconds inside your browser."
  },
  {
    question: "Does the image resizer upload my photos to any server?",
    answer: "No. SnapFreeTools processes all images 100% client-side using browser HTML5 Canvas. Your photos never leave your device and are never uploaded or saved to any cloud server."
  },
  {
    question: "How do I resize an image without losing aspect ratio?",
    answer: "Keep the 'Aspect Ratio Locked' toggle enabled. When aspect ratio is locked, changing the width automatically calculates the proportional height (and vice versa) to prevent image stretching or distortion."
  },
  {
    question: "Can I resize JPG, PNG, and WebP images?",
    answer: "Yes. Our tool supports JPG/JPEG, PNG, WebP, GIF, and BMP images. You can also convert formats during resizing (e.g. PNG to JPG or JPG to WebP)."
  },
  {
    question: "Can I resize images for social media platforms like Instagram or YouTube?",
    answer: "Yes! We provide built-in presets for Instagram Square (1080x1080), Instagram Portrait (1080x1350), Facebook Cover (820x312), YouTube Thumbnails (1280x720), and LinkedIn Posts."
  },
  {
    question: "What happens to image quality when resizing?",
    answer: "Our resizing engine uses high-quality bicubic canvas interpolation (`imageSmoothingQuality = 'high'`). For lossy formats like JPG and WebP, you can also adjust the output compression quality slider (10% - 100%)."
  },
  {
    question: "Can I resize multiple images at the same time?",
    answer: "Yes! You can select multiple images at once to activate Batch Mode. All images in the batch will be resized simultaneously using your chosen settings."
  },
  {
    question: "How does transparent PNG background conversion work when saving as JPG?",
    answer: "Since JPG format does not support transparency, our resizer lets you select a background fill color (White, Black, or custom color) to ensure transparent PNG backgrounds render cleanly without dark artifacts."
  }
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree Image Resizer",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Resize JPG, PNG, WebP and other images online free. Custom dimensions, aspect ratio lock, presets, quality control, and client-side privacy."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/image-resizer/#webpage",
        "url": "https://www.snapfreetools.com/image-resizer",
        "name": "Image Resizer Online - Resize Images Free",
        "description": "Resize JPG, PNG, WebP and other images online for free. Set custom dimensions, preserve aspect ratio, change image quality and download resized images directly in your browser.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/image-resizer/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/image-resizer/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Image Resizer",
            "item": "https://www.snapfreetools.com/image-resizer"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": FAQS_DATA.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
          }
        }))
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <ImageResizerFeature faqs={FAQS_DATA} />
    </>
  );
}
