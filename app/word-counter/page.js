import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import WordCounterFeature from "@/features/word-counter";

export function generateMetadata() {
  return generatePageMetadata("word-counter");
}

const FAQS_DATA = [
  {
    question: "What is a word counter?",
    answer: "A word counter is a free online tool that measures the number of words, characters, sentences, and paragraphs in a piece of text. It helps writers, students, and content creators meet specific length requirements."
  },
  {
    question: "How accurate is this word counter?",
    answer: "Our word counter is highly accurate, providing real-time calculations as you type. It splits text using standard whitespace and punctuation rules to count words and characters instantly and precisely."
  },
  {
    question: "Does this tool count characters?",
    answer: "Yes! It tracks the total character count both including spaces and excluding spaces, allowing you to monitor exact constraints for social media posts, SEO metadata, or essays."
  },
  {
    question: "Can I use it for essays?",
    answer: "Absolutely. This tool is ideal for essay writing, helping students track paragraph count, sentence count, word counts, and average length parameters to align with academic guidelines."
  },
  {
    question: "Can bloggers use it for SEO?",
    answer: "Yes, bloggers and SEO writers can use it to analyze content length, check keyword density to avoid keyword stuffing, and calculate reading time to enhance reader engagement."
  },
  {
    question: "Is this word counter free?",
    answer: "Yes, the SnapFreeTools Word Counter is 100% free to use. There are no hidden fees, no subscriptions, no registration required, and no limits on word counts."
  },
  {
    question: "Is my text safe and private?",
    answer: "Yes. Privacy is our top priority. Your text is processed entirely inside your web browser. It is never uploaded to any servers or saved database-side, ensuring complete data security."
  },
  {
    question: "What is keyword density in writing?",
    answer: "Keyword density refers to the percentage of times a specific word appears in your text compared to the total word count. Our checker calculates density to help optimize for search engines."
  },
  {
    question: "How does reading time calculator work?",
    answer: "It estimates the time required to read the text based on an average adult reading speed of 200 words per minute (WPM), helping you optimize content length for target audiences."
  },
  {
    question: "How does speaking time calculator work?",
    answer: "Speaking time calculates the time needed to present or read the text aloud, calculated at a conversational speaking rate of 130 words per minute (WPM), perfect for speech preparation."
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
        "@id": "https://snapfreetools.com/word-counter/#webpage",
        "url": "https://snapfreetools.com/word-counter",
        "name": "Free Word Counter Tool – Count Words, Characters & Reading Time",
        "description": "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. Free online word counter tool with advanced text analysis.",
        "breadcrumb": {
          "@id": "https://snapfreetools.com/word-counter/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://snapfreetools.com/word-counter/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Word Counter",
            "item": "https://snapfreetools.com/word-counter"
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
      <WordCounterFeature />
    </>
  );
}
