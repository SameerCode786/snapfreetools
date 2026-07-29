import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import WordToPDFFeature from "@/features/word-to-pdf";

export function generateMetadata() {
  return generatePageMetadata("word-to-pdf");
}

const FAQS_DATA = [
  {
    question: "Are my Word files uploaded to a server?",
    answer: "No. Conversion happens 100% locally in your browser using client-side JavaScript. Your DOCX documents are never uploaded to any remote server or cloud database."
  },
  {
    question: "Is this Word to PDF converter free?",
    answer: "Yes, our Word to PDF converter is 100% free with no signup, no daily limits, no subscription, and no watermarks."
  },
  {
    question: "Does it support old .doc files?",
    answer: "Currently, only modern Microsoft Word (.docx) files are supported. If you have an older .doc file, open it in Word or Google Docs and save it as .docx before converting."
  },
  {
    question: "Will the PDF look exactly like my Word document?",
    answer: "For standard documents containing headings, paragraphs, lists, inline images, and simple tables, formatting is rendered accurately. Complex floating vector shapes or custom proprietary fonts may vary slightly."
  },
  {
    question: "What is the maximum file size and page limit?",
    answer: "The maximum file size is 10MB. To ensure smooth browser performance and prevent memory crashes, documents are limited to 20 pages on desktop and 15 pages on mobile."
  },
  {
    question: "Can I use this tool on my mobile phone?",
    answer: "Yes, the converter works on mobile browsers like Android Chrome and iOS Safari. For large multi-page files, converting on a desktop computer provides the fastest performance."
  },
  {
    question: "Why do some custom fonts look different?",
    answer: "If your Word document uses custom fonts not available on your device or browser, standard web-safe fallback fonts (such as Arial or Calibri) will be used to ensure legibility."
  },
  {
    question: "Are my files stored anywhere on SnapFreeTools?",
    answer: "No. SnapFreeTools does not store, collect, or log your document contents. All processed data is cleared automatically when you close or reset the tool."
  }
];

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/word-to-pdf/#webpage",
        "url": "https://www.snapfreetools.com/word-to-pdf",
        "name": "Word to PDF Converter – Free & Private Online Tool",
        "description": "Convert DOCX files to PDF directly in your browser. Free, private, fast, and no file upload required.",
        "isPartOf": {
          "@id": "https://www.snapfreetools.com/#website"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/word-to-pdf/#breadcrumb",
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
            "name": "PDF Tools",
            "item": "https://www.snapfreetools.com/pdf-tools"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Word to PDF",
            "item": "https://www.snapfreetools.com/word-to-pdf"
          }
        ]
      }
    ]
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <WordToPDFFeature faqs={FAQS_DATA} />
    </>
  );
}
