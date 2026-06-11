import React from "react";

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "SnapFreeTools",
    "url": "https://snapfreetools.com",
    "description": "Free online productivity tools - word counter, image compressor, and more.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://snapfreetools.com/?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };
}

export function getSoftwareApplicationSchema(toolKey) {
  const toolSchemas = {
    "image-compressor": {
      "name": "SnapFree Image Compressor & Converter",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Compress and convert JPG, PNG, WEBP, and AVIF images online free without losing quality using browser-side processing."
    },
    "gpa-calculator": {
      "name": "SnapFree GPA Calculator",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Calculate your college or school GPA based on grades and credit hours easily with our free online GPA calculator."
    },
    "word-counter": {
      "name": "SnapFree Word Counter",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Instantly count words, characters, and sentences in your text with reading time estimation."
    },
    "pdf-to-word": {
      "name": "SnapFree PDF to Word Converter",
      "applicationCategory": "UtilitiesApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Convert your PDF documents into editable Microsoft Word files with perfect formatting."
    }
  };

  const schema = toolSchemas[toolKey];
  if (!schema) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    ...schema
  };
}

export function getFAQSchema(faqs) {
  if (!faqs || faqs.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

export function JsonLd({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
