import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export const COMPARISON_CATEGORIES = [
  { id: "all", name: "All Tools" },
  { id: "image", name: "Image Tools" },
  { id: "pdf", name: "PDF Tools" },
  { id: "text", name: "Text Tools" },
  { id: "calculators", name: "Calculators" }
];

// Rich tool metadata map keyed by tool slug
export const TOOL_COMPARISON_METADATA = {
  "image-resizer": {
    slug: "image-resizer",
    name: "Image Resizer",
    group: "Image Tools",
    category: "image",
    icon: "Scaling",
    description: "Resize JPG, PNG, and WebP images to custom dimensions, percentages, or social media presets.",
    bestFor: "Resizing image dimensions, changing aspect ratios, fitting social media sizes (Instagram, YouTube, etc.).",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "JPG, JPEG, PNG, WebP, GIF, SVG",
    outputFormats: "JPG, PNG, WebP",
    batchProcessing: "Yes (Batch Upload & Process)",
    customControls: "Width/Height, Lock Aspect Ratio, Quality Slider",
    presets: "Instagram (Square/Portrait/Landscape), Facebook, YouTube, LinkedIn, Full HD, HD",
    qualitySlider: "Yes (1-100%)",
    maxFileSize: "No hard limit (Browser memory bound)",
    keyFeatures: [
      "Custom pixel & percentage resizing",
      "Social media preset dimensions",
      "Aspect ratio lock / unlock",
      "Batch multi-image processing",
      "Format conversion (JPG, PNG, WebP)"
    ],
    strengths: [
      "Ideal when you need specific pixel dimensions for web, print, or social media.",
      "Supports preserving PNG transparency or setting background color.",
      "100% in-browser canvas rendering with zero server delay."
    ]
  },
  "image-compressor": {
    slug: "image-compressor",
    name: "Image Compressor",
    group: "Image Tools",
    category: "image",
    icon: "Image",
    description: "Compress JPG, PNG, and WebP images up to 80% without noticeable visual quality loss.",
    bestFor: "Reducing image file sizes for faster websites, email attachments, and storage savings.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "JPG, JPEG, PNG, WebP, AVIF",
    outputFormats: "JPG, PNG, WebP",
    batchProcessing: "Yes (Bulk Compression)",
    customControls: "Target Compression Level, Quality Slider",
    presets: "Balanced, Maximum Savings, High Quality",
    qualitySlider: "Yes (1-100%)",
    maxFileSize: "No hard limit (Browser memory bound)",
    keyFeatures: [
      "Advanced browser canvas compression",
      "Side-by-side original vs compressed file size preview",
      "Batch bulk image compression",
      "PNG alpha channel transparency preservation",
      "Format conversion to optimized WebP"
    ],
    strengths: [
      "Focuses purely on file size optimization while preserving original dimensions.",
      "Shows exact kilobytes saved before downloading.",
      "Zero network latency because re-encoding is done locally."
    ]
  },
  "protect-pdf": {
    slug: "protect-pdf",
    name: "Protect PDF",
    slug: "protect-pdf",
    group: "PDF Tools",
    category: "pdf",
    icon: "Lock",
    description: "Encrypt PDF documents with standard AES password protection.",
    bestFor: "Securing confidential PDF documents with passwords before sending over email or cloud storage.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (v1.3 - v2.0)",
    outputFormats: "Encrypted PDF (.pdf)",
    batchProcessing: "Single document encryption",
    customControls: "User Password, Owner Password, Restrictions",
    presets: "Standard AES PDF Encryption",
    qualitySlider: "N/A (Document Encryption)",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "AES-256 standard PDF password encryption",
      "Compatible with Adobe Acrobat & standard PDF viewers",
      "Restricts unauthorized viewing & printing",
      "100% local JavaScript crypto execution",
      "Zero server log or password transmission"
    ],
    strengths: [
      "Maximum security for legal, financial, or personal documents.",
      "Passwords are computed locally in your browser memory.",
      "No account or subscription required."
    ]
  },
  "unlock-pdf": {
    slug: "unlock-pdf",
    name: "Unlock PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "Unlock",
    description: "Remove passwords and editing restrictions from PDF files.",
    bestFor: "Removing password protection or printing restrictions from PDFs when authorized.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Protected PDF (.pdf)",
    outputFormats: "Unprotected PDF (.pdf)",
    batchProcessing: "Single document decryption",
    customControls: "Password Input & Permission Removal",
    presets: "Instant Decryption",
    qualitySlider: "N/A",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "Removes user open passwords with valid credential",
      "Removes printing & copying restriction flags",
      "Preserves original document formatting & vector graphics",
      "100% browser-based PDF parsing",
      "Zero server file retention"
    ],
    strengths: [
      "Quickly removes password locks when you own or have credentials for a PDF.",
      "Generates clean unlocked PDFs instantly in your browser download folder."
    ]
  },
  "pdf-to-word": {
    slug: "pdf-to-word",
    name: "PDF to Word",
    group: "PDF Tools",
    category: "pdf",
    icon: "FileType",
    description: "Convert PDF files into editable Microsoft Word (.docx) documents.",
    bestFor: "Extracting text, tables, and layouts from PDFs into editable Word files.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (.pdf)",
    outputFormats: "Microsoft Word (.docx)",
    batchProcessing: "Single file conversion",
    customControls: "Layout retention options",
    presets: "Standard DOCX Export",
    qualitySlider: "N/A",
    maxFileSize: "Browser memory limit",
    keyFeatures: [
      "Converts PDF text & headings into editable Word elements",
      "Preserves paragraphs & page structures",
      "No watermark added to output",
      "Local browser conversion pipeline",
      "Zero file retention on servers"
    ],
    strengths: [
      "Perfect for editing contracts, resumes, or reports originally saved as PDF.",
      "Outputs clean native DOCX files compatible with MS Word, Google Docs, and LibreOffice."
    ]
  },
  "word-to-pdf": {
    slug: "word-to-pdf",
    name: "Word to PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "FileCode",
    description: "Convert Word (.docx) documents into universal PDF files.",
    bestFor: "Converting editable Word documents into read-only PDF files for distribution.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Microsoft Word (.docx, .doc)",
    outputFormats: "PDF (.pdf)",
    batchProcessing: "Single file conversion",
    customControls: "Page layout options",
    presets: "Standard PDF Export",
    qualitySlider: "N/A",
    maxFileSize: "Browser memory limit",
    keyFeatures: [
      "Converts Word text, fonts, and images into PDF",
      "Creates portable PDF documents",
      "Preserves original page margins",
      "Runs locally in client browser",
      "100% free with no watermark"
    ],
    strengths: [
      "Ensures documents render identically across all computers and mobile phones.",
      "Prevents recipient editing."
    ]
  },
  "merge-pdf": {
    slug: "merge-pdf",
    name: "Merge PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "Combine",
    description: "Combine multiple PDF documents into a single organized PDF file.",
    bestFor: "Combining multiple document scans, chapters, or PDF reports into one file.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (.pdf)",
    outputFormats: "Merged PDF (.pdf)",
    batchProcessing: "Yes (Multi-file combine)",
    customControls: "Page reordering & file ordering",
    presets: "Sequential Merge",
    qualitySlider: "N/A",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "Combines unlimited PDF files in custom order",
      "Drag-and-drop page/file arrangement",
      "Preserves embedded fonts & bookmarks",
      "100% local WASM PDF stitching",
      "Fast instant download"
    ],
    strengths: [
      "Great for assembling portfolios, tax filings, or assignment submissions.",
      "Allows re-arranging file order before final assembly."
    ]
  },
  "split-pdf": {
    slug: "split-pdf",
    name: "Split PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "Scissors",
    description: "Extract specific pages or page ranges from a large PDF document.",
    bestFor: "Extracting individual pages, chapters, or specific sections from large PDFs.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (.pdf)",
    outputFormats: "Split PDF files (.pdf)",
    batchProcessing: "Yes (Extract multiple ranges)",
    customControls: "Select Page Range (e.g. 1-3, 5, 8-10)",
    presets: "Single Pages, Custom Range",
    qualitySlider: "N/A",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "Custom page range extraction",
      "Split all pages into separate PDFs",
      "Visual page thumbnail preview",
      "Local in-browser splitting",
      "Preserves original vector quality"
    ],
    strengths: [
      "Ideal for extracting a 2-page invoice from a 50-page statement.",
      "Instant processing without uploading large PDF files."
    ]
  },
  "compress-pdf": {
    slug: "compress-pdf",
    name: "Compress PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "FileDown",
    description: "Reduce PDF document file size while preserving text sharpness and readable visuals.",
    bestFor: "Shrinking PDF file size to pass email attachment limits or web upload limits.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (.pdf)",
    outputFormats: "Compressed PDF (.pdf)",
    batchProcessing: "Single file compression",
    customControls: "Compression Strength Level",
    presets: "Standard Compression, High Compression",
    qualitySlider: "Yes (Resolution scaling)",
    maxFileSize: "Browser memory limit",
    keyFeatures: [
      "Optimizes internal PDF streams & image assets",
      "Reduces megabytes to kilobytes",
      "Keeps selectable text readable",
      "100% local browser execution",
      "Shows exact size reduction percentage"
    ],
    strengths: [
      "Essential for job applications and portal uploads with strict file size caps."
    ]
  },
  "jpg-to-pdf": {
    slug: "jpg-to-pdf",
    name: "JPG to PDF",
    group: "PDF Tools",
    category: "pdf",
    icon: "Image",
    description: "Convert JPG, PNG, and WebP images into a clean single PDF file.",
    bestFor: "Converting photo scans, receipts, or document pictures into a standard PDF document.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "JPG, JPEG, PNG, WebP",
    outputFormats: "PDF (.pdf)",
    batchProcessing: "Yes (Multi-image to PDF)",
    customControls: "Page Orientation (Portrait/Landscape), Margins",
    presets: "Fit Page, Original Size, A4 Preset",
    qualitySlider: "N/A",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "Combines multiple images into a multi-page PDF",
      "Adjustable page margins & orientation",
      "Preserves image resolution & colors",
      "100% client-side compilation",
      "Instant PDF download"
    ],
    strengths: [
      "Turn mobile photo receipts or homework pages into one official PDF file."
    ]
  },
  "pdf-to-jpg": {
    slug: "pdf-to-jpg",
    name: "PDF to JPG",
    group: "PDF Tools",
    category: "pdf",
    icon: "FileImage",
    description: "Extract PDF document pages into high-resolution JPG or PNG images.",
    bestFor: "Converting PDF pages into image formats for social media, presentations, or websites.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "PDF (.pdf)",
    outputFormats: "JPG, PNG",
    batchProcessing: "Extract all pages as images",
    customControls: "DPI Resolution (150 DPI, 300 DPI)",
    presets: "High Quality JPG, PNG Transparency",
    qualitySlider: "Yes (Image DPI)",
    maxFileSize: "No hard limit",
    keyFeatures: [
      "Extracts each PDF page into a high-res image",
      "Custom DPI rendering for high sharpness",
      "Downloads individual images or ZIP archive",
      "100% in-browser Canvas rendering",
      "Zero server transmission"
    ],
    strengths: [
      "Great for inserting PDF slides or flyers directly into PowerPoint or Instagram."
    ]
  },
  "case-converter": {
    slug: "case-converter",
    name: "Case Converter",
    group: "Text Tools",
    category: "text",
    icon: "CaseSensitive",
    description: "Convert text between 16 popular letter case formats including UPPERCASE, lowercase, Title Case, camelCase, and snake_case.",
    bestFor: "Code formatting, title capitalization, URL slug creation, and text cleanup.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Plain Text, Code, Markdown",
    outputFormats: "Transformed Text",
    batchProcessing: "Instant bulk text processing",
    customControls: "16 Case Toggle Buttons & Copy Controls",
    presets: "Sentence, Title, UPPER, lower, camel, snake, kebab, Pascal, CONSTANT, Slug",
    qualitySlider: "N/A",
    maxFileSize: "Unlimited text length",
    keyFeatures: [
      "16 case conversion modes",
      "Instant live text preview as you type",
      "One-click copy to clipboard",
      "Character, word, and line metrics",
      "100% client-side JavaScript regex"
    ],
    strengths: [
      "Essential for developers, writers, and students standardizing text format.",
      "Handles thousands of lines of text without lag."
    ]
  },
  "word-counter": {
    slug: "word-counter",
    name: "Word Counter",
    group: "Text Tools",
    category: "text",
    icon: "FileText",
    description: "Count words, characters, sentences, paragraphs, reading time, and keyword density in real time.",
    bestFor: "Writing essays, articles, social posts, and keeping within strict word count limits.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Plain Text, Markdown, HTML",
    outputFormats: "Text Metrics & Analysis Report",
    batchProcessing: "Real-time stream counting",
    customControls: "Reading speed selector, keyword density filters",
    presets: "Essay, Twitter/X Limit, Meta Description Limit",
    qualitySlider: "N/A",
    maxFileSize: "Unlimited text length",
    keyFeatures: [
      "Real-time word & character counter",
      "Reading time & speaking time estimation",
      "Top keyword density analysis",
      "Sentence & paragraph counting",
      "100% private in-browser text analysis"
    ],
    strengths: [
      "Helps writers, students, and SEO marketers hit exact word count targets.",
      "Zero server logging of user writing."
    ]
  },
  "gpa-calculator": {
    slug: "gpa-calculator",
    name: "GPA Calculator",
    group: "Calculators",
    category: "calculators",
    icon: "GraduationCap",
    description: "Calculate college or high school semester Grade Point Average (GPA) instantly.",
    bestFor: "Calculating term GPA, course grade points, and semester credit honors.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Courses, Letter Grades, Credit Hours",
    outputFormats: "GPA Score & Summary",
    batchProcessing: "Multi-course semester calculation",
    customControls: "Custom Grade Scale (4.0, 5.0, Percentage)",
    presets: "Standard 4.0 Scale, Honors Scale",
    qualitySlider: "N/A",
    maxFileSize: "N/A",
    keyFeatures: [
      "Weighted & unweighted GPA calculation",
      "Supports letter grades (A+, A, B, etc.)",
      "Custom credit hour weightings",
      "Instant real-time math execution",
      "Local storage grade save option"
    ],
    strengths: [
      "Designed specifically for high school and university students tracking term grades."
    ]
  },
  "cgpa-calculator": {
    slug: "cgpa-calculator",
    name: "CGPA Calculator",
    group: "Calculators",
    category: "calculators",
    icon: "Calculator",
    description: "Calculate Cumulative Grade Point Average (CGPA) across all academic semesters.",
    bestFor: "Tracking multi-semester cumulative degree progress and graduation GPA.",
    clientSide: true,
    serverUpload: false,
    privacyLevel: "100% Local (Zero Upload)",
    inputFormats: "Past Semester GPAs & Total Credits",
    outputFormats: "Cumulative CGPA",
    batchProcessing: "Multi-semester tracking",
    customControls: "Semester weights & credit inputs",
    presets: "Degree Cumulative Scale",
    qualitySlider: "N/A",
    maxFileSize: "N/A",
    keyFeatures: [
      "Multi-semester CGPA aggregation",
      "Weighted credit hour total",
      "Target CGPA projection",
      "100% client-side computation",
      "Clean printable summary"
    ],
    strengths: [
      "Provides long-term academic tracking from freshman to senior year."
    ]
  }
};

// Curated Popular Comparison Presets
export const POPULAR_COMPARISONS = [
  {
    id: "resizer-vs-compressor",
    tool1: "image-resizer",
    tool2: "image-compressor",
    title: "Image Resizer vs Image Compressor",
    badge: "Image Optimization",
    summary: "Choose Resizer when you need specific pixel dimensions (1080x1080). Choose Compressor when you want smaller kilobytes without changing dimensions."
  },
  {
    id: "pdf-word-vs-word-pdf",
    tool1: "pdf-to-word",
    tool2: "word-to-pdf",
    title: "PDF to Word vs Word to PDF",
    badge: "Document Conversion",
    summary: "Use PDF to Word to extract text into an editable document. Use Word to PDF to convert editable files into a permanent read-only format."
  },
  {
    id: "protect-vs-unlock-pdf",
    tool1: "protect-pdf",
    tool2: "unlock-pdf",
    title: "Protect PDF vs Unlock PDF",
    badge: "PDF Security",
    summary: "Protect PDF locks documents with AES password encryption. Unlock PDF removes permissions & passwords when authorized."
  },
  {
    id: "merge-vs-split-pdf",
    tool1: "merge-pdf",
    tool2: "split-pdf",
    title: "Merge PDF vs Split PDF",
    badge: "PDF Management",
    summary: "Merge PDF combines multiple separate files into one. Split PDF extracts specific pages or breaks large PDFs into smaller files."
  },
  {
    id: "case-vs-word-counter",
    tool1: "case-converter",
    tool2: "word-counter",
    title: "Case Converter vs Word Counter",
    badge: "Text Utilities",
    summary: "Case Converter changes letter casing (UPPER, camelCase, slug). Word Counter measures text length, reading time, and keyword density."
  },
  {
    id: "gpa-vs-cgpa",
    tool1: "gpa-calculator",
    tool2: "cgpa-calculator",
    title: "GPA Calculator vs CGPA Calculator",
    badge: "Academic Tools",
    summary: "GPA Calculator computes single-term semester grade point average. CGPA Calculator aggregates all semesters into a cumulative score."
  }
];

// Best use case guide recommendations
export const USE_CASE_GUIDES = [
  {
    goal: "Need exact pixel dimensions for Instagram or YouTube?",
    toolSlug: "image-resizer",
    toolName: "Image Resizer",
    reason: "Includes social media presets and custom pixel input fields."
  },
  {
    goal: "Need a smaller image file size for email or web upload?",
    toolSlug: "image-compressor",
    toolName: "Image Compressor",
    reason: "Reduces kilobytes by up to 80% while leaving dimensions unchanged."
  },
  {
    goal: "Need to edit text inside a PDF contract or resume?",
    toolSlug: "pdf-to-word",
    toolName: "PDF to Word",
    reason: "Converts PDF layout elements into editable Microsoft Word (.docx) files."
  },
  {
    goal: "Need to password protect a confidential file?",
    toolSlug: "protect-pdf",
    toolName: "Protect PDF",
    reason: "Applies standard AES encryption right inside your browser memory."
  },
  {
    goal: "Need to combine multiple scans into one file?",
    toolSlug: "merge-pdf",
    toolName: "Merge PDF",
    reason: "Stitches multiple PDFs together in custom drag-and-drop order."
  },
  {
    goal: "Need to convert text to camelCase or UPPERCASE?",
    toolSlug: "case-converter",
    toolName: "Case Converter",
    reason: "Instantly transforms text between 16 popular letter casing modes."
  }
];

// Comparison FAQs
export const COMPARISON_FAQS = [
  {
    question: "What are SnapFreeTools tool comparisons?",
    answer: "SnapFreeTools tool comparisons allow you to evaluate any two tools side by side based on processing speed, privacy, supported formats, batch handling, and best use cases. This helps you select the exact tool needed for your task."
  },
  {
    question: "How do I compare two tools?",
    answer: "Select Tool A and Tool B from the interactive drop-down selectors or pick one of our Popular Comparisons. The detailed comparison matrix, privacy spotlight, and recommendation will update instantly."
  },
  {
    question: "Are all compared tools private and browser-based?",
    answer: "Most tools on SnapFreeTools (including Image Resizer, Image Compressor, Protect PDF, Unlock PDF, Case Converter, Word Counter, and PDF tools) process files 100% locally inside your web browser without uploading files to remote servers."
  },
  {
    question: "Do my files get uploaded during a comparison?",
    answer: "No. The comparison page only evaluates tool metadata and feature capabilities. No files are uploaded during comparisons or when using our client-side tools."
  },
  {
    question: "Can I share a comparison with others?",
    answer: "Yes! Every comparison generates a unique URL (e.g. /comparisons?tool1=image-resizer&tool2=image-compressor). You can copy the link or use the built-in share options to send it directly to colleagues or friends."
  },
  {
    question: "What if both tools seem suitable for my workflow?",
    answer: "If two tools serve complementary needs (for example, Image Resizer and Image Compressor), you can use both in sequence! First resize to target dimensions, then compress for maximum file size savings."
  }
];
