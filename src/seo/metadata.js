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
  "calculators": {
    title: "Student Calculator Hub - GPA, CGPA & Academic Tools Online",
    description: "Access our comprehensive suite of student calculators. Calculate GPA, SGPA, CGPA, percentage conversions, required grades, and merit scores instantly.",
    keywords: "student calculators, gpa tools, cgpa calculator, grade point average, merit aggregate, academic calculators",
    path: "/calculators"
  },
  "gpa-calculator": {
    title: "GPA Calculator - Calculate GPA Online Free",
    description: "Calculate GPA instantly using our free GPA Calculator. Supports semester GPA, cumulative GPA, grade points and credit hours.",
    keywords: "gpa calculator, calculate gpa, semester gpa, high school gpa, college gpa, free gpa tool",
    path: "/gpa-calculator"
  },
  "cgpa-calculator": {
    title: "CGPA Calculator - Calculate Cumulative GPA Online",
    description: "Calculate your Cumulative Grade Point Average (CGPA) quickly. Input past semester grades and credit hours to find your total CGPA.",
    keywords: "cgpa calculator, cumulative gpa, calculate cgpa, cgpa formula, cgpa converter",
    path: "/cgpa-calculator"
  },
  "sgpa-calculator": {
    title: "SGPA Calculator - Calculate Semester GPA Online",
    description: "Easily calculate your Semester Grade Point Average (SGPA) for free. Input course names, credits, and grades to get your SGPA instantly.",
    keywords: "sgpa calculator, semester gpa, calculate sgpa, sgpa formula, sgpa to cgpa",
    path: "/sgpa-calculator"
  },
  "gpa-to-percentage": {
    title: "GPA to Percentage Calculator",
    description: "Convert your GPA score to academic percentages instantly. Supports 4.0 and custom scales conversion online.",
    keywords: "gpa to percentage, convert gpa to percent, 4.0 gpa in percent, gpa conversion",
    path: "/gpa-to-percentage"
  },
  "percentage-to-gpa": {
    title: "Percentage to GPA Calculator",
    description: "Convert academic percentage scores to a 4.0 scale GPA. Ideal for international admission conversions.",
    keywords: "percentage to gpa, convert percent to gpa, percentage to 4.0 scale, cgpa converter",
    path: "/percentage-to-gpa"
  },
  "required-gpa-calculator": {
    title: "Required GPA Calculator - Target GPA Goal Planner",
    description: "Find out exactly what GPA you must earn in future semesters to reach your target GPA. Perfect for graduation and scholarship planning.",
    keywords: "required gpa calculator, raise my gpa, target gpa planner, gpa needed to graduate",
    path: "/required-gpa-calculator"
  },
  "final-grade-calculator": {
    title: "Final Grade Calculator - Find Required Exam Score",
    description: "Calculate the exact grade you need on your final exam to pass your class or earn an A. Quick, customizable grading weights.",
    keywords: "final grade calculator, what do i need on my final, final exam grade calculator, class grade calculator",
    path: "/final-grade-calculator"
  },
  "merit-calculator": {
    title: "Merit Calculator - Calculate University Admission Merit",
    description: "Calculate your admission merit score online. Supports major universities and entry tests with customizable weights (matric, FSc, entry test).",
    keywords: "merit calculator, aggregate calculator, admission merit formula, engineering merit calculator",
    path: "/merit-calculator"
  },
  "word-counter": {
    title: "Free Word Counter Tool – Count Words, Characters & Reading Time",
    description: "Count words, characters, sentences, paragraphs, reading time, and keyword density instantly. Free online word counter tool with advanced text analysis.",
    keywords: "word counter, free word counter, online word counter, word count tool, character counter, sentence counter, paragraph counter, reading time calculator, keyword density checker, text analyzer, word counter with character count, free online word counter, word counter for essays, word counter for students, word counter for blogs, SEO word counter, word count checker, online text analyzer",
    path: "/word-counter"
  },
  "pdf-to-word": {
    title: "PDF to Word Converter – Convert PDF to Word Online Free",
    description: "Convert PDF to Word online free. Convert your PDF documents into editable Microsoft Word (DOCX) files without signup, watermark, or losing formatting.",
    keywords: "pdf to word, pdf to word converter, convert pdf to word, pdf to docx, pdf to word online, pdf to word free, pdf to word ocr, pdf to editable word, pdf to word without losing formatting, pdf to word converter online free, pdf to word no signup, pdf to word no watermark",
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
