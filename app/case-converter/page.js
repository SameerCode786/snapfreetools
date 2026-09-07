import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import CaseConverterFeature from "@/features/case-converter";

export function generateMetadata() {
  return generatePageMetadata("case-converter");
}

const FAQS_DATA = [
  {
    question: "What is a case converter?",
    answer: "A case converter is a free online tool that transforms written text between different letter case formats such as UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case instantly."
  },
  {
    question: "Is this online case converter free to use?",
    answer: "Yes, SnapFreeTools Case Converter is 100% free with no hidden fees, subscriptions, or text length restrictions."
  },
  {
    question: "Does the tool upload or store my text on a server?",
    answer: "No. Your privacy is our highest priority. All text case transformations occur locally inside your web browser RAM using JavaScript. Your text is never uploaded to any cloud server or recorded anywhere."
  },
  {
    question: "Can I convert text to camelCase or PascalCase for programming?",
    answer: "Yes! Our advanced case selector includes developer formats like camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, dot.case, path/case, and Header-Case."
  },
  {
    question: "How does smart Title Case work?",
    answer: "Our smart Title Case algorithm capitalizes the first and last words of your text as well as all major nouns and verbs, while automatically keeping minor articles and prepositions (such as a, an, the, and, of, in) in lowercase."
  },
  {
    question: "How does Sentence Case format text?",
    answer: "Sentence case intelligently identifies sentence boundaries (periods, exclamation marks, and question marks) and capitalizes only the starting character of each sentence."
  },
  {
    question: "Does this case converter support non-English and Unicode characters?",
    answer: "Yes. The tool safely handles Unicode text, accented Latin characters (French, Spanish, German), Urdu, Arabic, Turkish, emojis, and symbols without corrupting special characters."
  },
  {
    question: "Can I download converted text as a file?",
    answer: "Yes. You can click the 'Download .txt' button to download your transformed text directly as a UTF-8 formatted text file."
  },
  {
    question: "Does this tool work on mobile phones and tablets?",
    answer: "Yes. SnapFreeTools is fully responsive and optimized for mobile devices, tablets, and desktop viewports alike."
  }
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree Case Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case and more online for free."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/case-converter/#webpage",
        "url": "https://www.snapfreetools.com/case-converter",
        "name": "Case Converter Online - Convert Text to Uppercase, Lowercase & More",
        "description": "Convert text to uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case and more. Free online case converter with advanced text tools. 100% client-side and private.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/case-converter/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/case-converter/#breadcrumb",
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
            "name": "Case Converter",
            "item": "https://www.snapfreetools.com/case-converter"
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
      <CaseConverterFeature faqs={FAQS_DATA} />
    </>
  );
}
