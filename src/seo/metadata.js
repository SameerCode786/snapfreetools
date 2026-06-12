const SITE_URL = "https://snapfreetools.com";

const METADATA_CONFIG = {
  home: {
    title: "SnapFreeTools - Free Online Productivity Tools",
    description: "SnapFreeTools provides a collection of clean, fast, and secure tools to help you get your work done faster. Word counter, image compressor, and more.",
    keywords: "online tools, free tools, productivity tools, image compressor, word counter, gpa calculator, pdf to word",
    path: ""
  },
  about: {
    title: "About Us | SnapFreeTools",
    description: "Learn about SnapFreeTools' mission to provide fast, secure, and free online productivity tools without subscriptions.",
    keywords: "about snapfreetools, free online tools mission, no signup tools",
    path: "/about"
  },
  contact: {
    title: "Contact Us | SnapFreeTools",
    description: "Get in touch with SnapFreeTools. Suggest new tools, report bugs, or give us feedback.",
    keywords: "contact snapfreetools, tool suggestions, bug report, feedback",
    path: "/contact"
  },
  "privacy-policy": {
    title: "Privacy Policy | SnapFreeTools",
    description: "Read our privacy policy. We process data client-side inside your browser. Your files never touch our servers.",
    keywords: "privacy policy, data safety, client-side tools, private converter",
    path: "/privacy-policy"
  },
  "image-compressor": {
    title: "Image Compressor & Converter – Compress and Convert Images Online Free | SnapFreeTools",
    description: "Compress and convert JPG, PNG, WEBP, and AVIF images online free without losing quality. Professional tool with client-side browser processing.",
    keywords: "image compressor, convert png to jpg, jpg to webp converter, compress image online free, avif converter",
    path: "/image-compressor"
  },
  "gpa-calculator": {
    title: "GPA Calculator – Calculate GPA Easily | SnapFreeTools",
    description: "Calculate your college or high school GPA based on grades and credit hours easily with our free online GPA calculator.",
    keywords: "gpa calculator, calculate gpa, gpa calculator 4.0 scale, high school gpa calculator",
    path: "/gpa-calculator"
  },
  "word-counter": {
    title: "Free Word Counter Tool – Count Words, Characters & Reading Time",
    description: "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. Free online word counter tool with advanced text analysis.",
    keywords: "word counter, free word counter, online word counter, word count tool, character counter, sentence counter, paragraph counter, reading time calculator, keyword density checker, text analyzer, word counter with character count, free online word counter, word counter for essays, word counter for students, word counter for blogs, SEO word counter, word count checker, online text analyzer",
    path: "/word-counter"
  },
  "pdf-to-word": {
    title: "PDF to Word Converter – Coming Soon | SnapFreeTools",
    description: "Convert your PDF documents into editable Microsoft Word files with perfect formatting. Fast, secure, and free converter coming soon.",
    keywords: "pdf to word, pdf to docx converter, online pdf converter free",
    path: "/pdf-to-word"
  }
};

export function generatePageMetadata(key) {
  const seo = METADATA_CONFIG[key] || METADATA_CONFIG.home;
  const canonicalUrl = `${SITE_URL}${seo.path}`;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalUrl,
      siteName: "SnapFreeTools",
      type: "website",
      locale: "en_US",
      images: [
        {
          url: "/brand/og-image.png",
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: ["/brand/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
