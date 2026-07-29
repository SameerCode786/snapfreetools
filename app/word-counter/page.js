import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import WordCounterFeature from "@/features/word-counter";

export function generateMetadata() {
  return generatePageMetadata("word-counter");
}

const FAQS_DATA = [
  {
    question: "What is a word counter?",
    answer: "A word counter is a free online utility designed to count words, characters, sentences, and paragraphs in your text instantly. Writers, students, bloggers, and copywriters use it to keep track of content length and readability."
  },
  {
    question: "How accurate is this online word counter?",
    answer: "Our online word counter is highly accurate. It utilizes precise JavaScript regular expression patterns to count words, symbols, and characters in real time as you type or paste content."
  },
  {
    question: "Does this tool count characters with spaces or without spaces?",
    answer: "Yes, it displays both. You can view the raw Character Count (which includes spaces and punctuation) and the Character Count Without Spaces simultaneously in the metrics panel."
  },
  {
    question: "How is reading time calculated?",
    answer: "Reading time is calculated based on an average adult reading speed of 275 words per minute (WPM). The formula divides the total word count by 275 and rounds to the nearest second to estimate the overall reading duration."
  },
  {
    question: "How is speaking time estimated?",
    answer: "Speaking time is estimated based on an average speaking speed of 180 words per minute (WPM). The formula divides the total word count by 180 and rounds to the nearest second to estimate the overall speaking duration."
  },
  {
    question: "Can I use this word counter for essays?",
    answer: "Absolutely. This tool is ideal for academic writing, helping you match word-limit parameters for personal statements, assignments, essays, and theses."
  },
  {
    question: "What is the ideal word count for a college essay?",
    answer: "College essays generally range from 1,000 to 2,500 words, depending on course requirements. Admissions essays (like the Common App personal statement) typically have a strict limit of 650 words."
  },
  {
    question: "How many words should a blog post contain for SEO?",
    answer: "For search engine optimization (SEO), the ideal blog post length is typically between 1,500 and 2,500 words. Long-form content allows for deeper topical coverage, increasing rank likelihood."
  },
  {
    question: "What is keyword density and why does it matter?",
    answer: "Keyword density represents the percentage of times a specific word appears in your text relative to the total word count. It matters because search engines analyze it to verify topical relevance."
  },
  {
    question: "What is the ideal keyword density for search engines?",
    answer: "The ideal keyword density is generally between 1% and 2%. Exceeding 2.5% can look spammy and lead search engines to flag your page for keyword stuffing."
  },
  {
    question: "How do I avoid keyword stuffing?",
    answer: "Avoid keyword stuffing by writing naturally, using synonyms, and focusing on user intent. Use our built-in density checker to verify that no target keyword exceeds 2% density."
  },
  {
    question: "Is this text analyzer safe for confidential documents?",
    answer: "Yes. Security is our absolute priority. This tool operates 100% inside your web browser client-side; no text is sent to any servers, ensuring total privacy for your drafts."
  },
  {
    question: "Can this tool count paragraphs and sentences?",
    answer: "Yes, the platform parses punctuation like periods, exclamation marks, and line breaks to provide real-time sentence count and paragraph count metrics."
  },
  {
    question: "What are the character limits for Twitter, Facebook, and Instagram?",
    answer: "Twitter allows 280 characters. Facebook posts have a 63,206-character limit, but 100-250 characters perform best. Instagram captions allow up to 2,200 characters but truncate after 125."
  },
  {
    question: "Does the tool support copy-pasting from Microsoft Word or Google Docs?",
    answer: "Yes. You can copy text directly from Microsoft Word, Google Docs, PDFs, or Scrivener, and paste it into our editor without losing layout calculations."
  },
  {
    question: "How does average word length impact readability?",
    answer: "Average word length is a primary input for readability indexes. Shorter average word lengths (4-5 characters) represent readable, accessible text, while longer lengths indicate complex terminology."
  },
  {
    question: "What is generative engine optimization (GEO) in writing?",
    answer: "Generative Engine Optimization (GEO) involves writing clear, structured, and informative text (using definitions and summaries) that search engines and AI assistants can quickly parse."
  },
  {
    question: "How can bloggers improve search rankings using this tool?",
    answer: "Bloggers can optimize blog content length, analyze density metrics to avoid keyword spam, review estimated reading times, and structure articles with logical formatting."
  },
  {
    question: "Does this online word checker work on mobile devices?",
    answer: "Yes, SnapFreeTools is completely responsive and optimized for mobile screens, tablets, and desktops, running smoothly in any web browser."
  },
  {
    question: "Is this word counter 100% free with no limits?",
    answer: "Yes, our word counter is 100% free. There are no fees, no registrations, no subscription models, and no text length limitations."
  }
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree Word Counter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. Free online word counter tool with advanced text analysis."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/word-counter/#webpage",
        "url": "https://www.snapfreetools.com/word-counter",
        "name": "Free Word Counter Tool – Count Words, Characters & Reading Time",
        "description": "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. Free online word counter tool with advanced text analysis.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/word-counter/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/word-counter/#breadcrumb",
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
            "name": "Word Counter",
            "item": "https://www.snapfreetools.com/word-counter"
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
      <WordCounterFeature faqs={FAQS_DATA} />
    </>
  );
}
