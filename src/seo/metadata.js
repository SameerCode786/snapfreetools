const SITE_URL = "https://www.snapfreetools.com";

const METADATA_CONFIG = {
  home: {
    title: "Free Online Tools for PDF, Calculators, Images & Text | SnapFreeTools",
    description: "Use free online tools to convert PDFs, calculate GPA, compress images, count words, and complete everyday tasks quickly with SnapFreeTools.",
    keywords: "online tools, free tools, productivity tools, image compressor, word counter, gpa calculator, pdf to word",
    path: ""
  },
  about: {
    title: "About SnapFreeTools | Free Online Productivity Tools",
    description: "Learn why SnapFreeTools was created and how our free online PDF, calculator, image, and text tools make everyday digital tasks easier.",
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
    description: "Read how SnapFreeTools handles browser-based tool data, contact information, cookies, analytics, advertising technologies, security, retention, and user privacy choices.",
    keywords: "privacy policy, data safety, client-side tools, private converter",
    path: "/privacy-policy"
  },
  "terms": {
    title: "Terms of Use | SnapFreeTools",
    description: "Read the Terms of Use for SnapFreeTools. Understand permitted use, browser-side processing, file responsibility, intellectual property, and service limitations.",
    keywords: "terms of use, terms and conditions, legal terms, snapfreetools rules",
    path: "/terms"
  },
  "cookie-policy": {
    title: "Cookie Policy | SnapFreeTools",
    description: "Learn how SnapFreeTools uses browser storage, cookies, preferences, and how analytics, advertising, Google AdSense, and consent controls may be used in the future.",
    keywords: "cookie policy, local storage, browser cache, tracking disclosure",
    path: "/cookie-policy"
  },
  "disclaimer": {
    title: "Disclaimer | SnapFreeTools",
    description: "Read the SnapFreeTools Disclaimer covering calculator estimates, PDF and OCR limitations, image processing, user responsibility, and important result verification.",
    keywords: "disclaimer, legal notice, tool limitations, snapfreetools disclaimer",
    path: "/disclaimer"
  },
  "advertising-disclosure": {
    title: "Advertising Disclosure | SnapFreeTools",
    description: "Learn about advertising transparency on SnapFreeTools. Read about planned Google AdSense integration, editorial independence, and user privacy choices.",
    keywords: "advertising disclosure, adsense transparency, editorial independence, snapfreetools ads",
    path: "/advertising-disclosure"
  },
  "dmca": {
    title: "DMCA Copyright Policy | SnapFreeTools",
    description: "Read the SnapFreeTools DMCA Copyright Policy. Learn how we handle copyright complaints, intellectual property notices, and review processes.",
    keywords: "dmca policy, copyright notice, report infringement, intellectual property, snapfreetools copyright",
    path: "/dmca"
  },
  "accessibility": {
    title: "Accessibility Statement | SnapFreeTools",
    description: "Read how SnapFreeTools approaches keyboard access, readable content, responsive design, assistive technology support, known limitations, and accessibility feedback.",
    keywords: "accessibility statement, keyboard friendly, screen reader support, inclusive design",
    path: "/accessibility"
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
  },
  "word-to-pdf": {
    title: "Word to PDF Converter – Free & Private Online Tool | SnapFreeTools",
    description: "Convert DOCX files to PDF directly in your browser. Free, private, fast, and no file upload required.",
    keywords: "word to pdf, docx to pdf, convert word to pdf online, free word to pdf converter, client side word to pdf, private pdf converter",
    path: "/word-to-pdf"
  },
  "scholarship-calculator": {
    title: "Scholarship Calculator – Estimate Tuition Savings",
    description: "Calculate scholarship amounts, tuition after scholarship, annual savings, and total program costs using a percentage or fixed award.",
    keywords: "scholarship calculator, tuition savings, financial aid calculator, university fee calculator, fee after scholarship, student discount",
    path: "/scholarship-calculator"
  },
  "grade-calculator": {
    title: "Grade Calculator | Calculate Percentage & Weighted Grades Free",
    description: "Calculate your grades, percentages, and weighted scores instantly online. Includes multiple subject and what-if simulators.",
    keywords: "grade calculator, calculate grade from percentage, percentage to grade calculator, marks to grade calculator, letter grade calculator, student grade calculator, weighted grade calculator",
    path: "/grade-calculator"
  },
  "attendance-calculator": {
    title: "Attendance Calculator – Required Classes & Safe Absences",
    description: "Calculate attendance percentage, classes needed to reach your target, safe absences, and future attendance projections instantly.",
    keywords: "attendance calculator, attendance percentage calculator, classes required for 75 attendance, how many classes can I miss, attendance shortage calculator, required attendance calculator, bunk calculator, college attendance calculator, school attendance calculator",
    path: "/attendance-calculator"
  },
  "credit-hour-calculator": {
    title: "Credit Hour Calculator | Degree Progress & Semester Workload",
    description: "Calculate total college credit hours, semester workload, and track your degree progress instantly. Use our what-if simulator to plan your graduation.",
    keywords: "credit hour calculator, college credit hour calculator, university credit hour calculator, semester credit hours calculator, degree credit hour calculator, credit hours per semester, calculate credit hours, how many credit hours do i need",
    path: "/credit-hour-calculator"
  },
  "admission-calculator": {
    title: "Admission Calculator | Predict Merit & Aggregate Percentage",
    description: "Calculate your university admission aggregate and merit percentage instantly. Plan target scores with our what-if simulator for entry tests.",
    keywords: "admission calculator, university admission calculator, merit calculator, admission aggregate calculator, aggregate calculator, merit percentage calculator, entry test required marks calculator",
    path: "/admission-calculator"
  },
  "loan-calculator": {
    title: "Loan Calculator & Analysis Suite | Monthly Payment & Amortization",
    description: "Calculate loan payments, explore affordability, compare loans, and see your amortization schedule. Free, secure, and accurate loan analysis tool.",
    keywords: "loan calculator, monthly payment calculator, amortization schedule, extra payment calculator, loan affordability calculator, reverse loan calculator, loan comparison, calculate interest",
    path: "/loan-calculator"
  },
  "emi-calculator": {
    title: "EMI Calculator & Loan Repayment Analysis Suite",
    description: "Calculate Equated Monthly Installments (EMI), view detailed amortization schedules, and compare loans with our free advanced EMI calculator.",
    keywords: "emi calculator, emi calculator online, loan emi calculator, monthly emi calculator, calculate emi, loan payment calculator, emi interest calculator, amortization calculator, loan repayment calculator",
    path: "/emi-calculator"
  },
  "investment-calculator": {
    title: "Investment Calculator & Growth Analysis Suite | SnapFreeTools",
    description: "Calculate compound interest, future value, and monthly investment growth. Our premium investment calculator includes inflation analysis and goal planning.",
    keywords: "investment calculator, investment growth calculator, compound interest calculator, investment return calculator, future value calculator, monthly investment calculator",
    path: "/investment-calculator"
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
    icons: {
      icon: "/brand/icon.svg",
      shortcut: "/brand/icon.svg",
      apple: "/brand/icon.svg"
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
