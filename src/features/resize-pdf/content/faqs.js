export const RESIZE_PDF_FAQS = [
  {
    question: "What does resizing a PDF page do?",
    answer: "Resizing a PDF page changes its physical media box dimensions (such as converting from Letter to A4 size or setting custom millimeter dimensions) while transforming existing page content according to your chosen scaling mode."
  },
  {
    question: "Can I resize a PDF to standard A4 size?",
    answer: "Yes. Simply select the A4 preset (210 × 297 mm / 595.28 × 841.89 pt) and choose Portrait or Landscape orientation to resize all or selected PDF pages to standard ISO A4 size."
  },
  {
    question: "Can I convert a PDF from A4 to Letter size?",
    answer: "Yes. Select the Letter preset (8.5 × 11 in / 612 × 792 pt) and set your preferred scaling mode (such as Fit Content) to convert A4 pages to US Letter size."
  },
  {
    question: "Will resizing make my PDF text blurry or reduce quality?",
    answer: "No. The tool modifies PDF vector page structures directly in browser memory without rasterizing text or images. Selectable text remains text-based, and vector graphics remain sharp."
  },
  {
    question: "Can I specify custom page dimensions in millimeters, inches, or points?",
    answer: "Yes. Select the Custom dimension option to enter exact width and height values in mm, inches, or PDF points within the application's supported safety range (72 pt to 14,400 pt)."
  },
  {
    question: "What is the difference between Fit Content, Keep Content Size, and Stretch Content?",
    answer: "Fit Content scales content proportionally to fit the new page size without distortion. Keep Content Size retains the 1:1 original content scale and centers it on the target page canvas. Stretch Content scales X and Y independently to fill the entire page, which may distort aspect ratios."
  },
  {
    question: "Can I resize only specific pages in a PDF document?",
    answer: "Yes. Select Custom Page Range and enter specific pages or page ranges (such as 1-3, 5) to resize only those pages while keeping the remaining pages unchanged."
  },
  {
    question: "How do I change page orientation from Portrait to Landscape?",
    answer: "Click the Landscape button in the target page size settings. The tool automatically swaps width and height dimensions for the selected paper preset or custom values."
  },
  {
    question: "Are my PDF files uploaded to any external server?",
    answer: "No. All PDF inspection and page resizing calculations are performed 100% locally inside your web browser. Your file contents are never uploaded to our servers or third-party services."
  },
  {
    question: "Is the PDF Page Resizer tool free to use?",
    answer: "Yes. SnapFreeTools PDF Page Resizer is completely free to use with no account registration, subscriptions, or watermarks."
  },
  {
    question: "What is the maximum page size supported by the resizer?",
    answer: "The application supports custom dimensions up to 14,400 × 14,400 PDF points (200 × 200 inches / 5.08 × 5.08 meters), matching standard PDF specification limits."
  },
  {
    question: "Why should I resize PDF pages before printing?",
    answer: "Resizing PDF pages ensures your document matches the physical paper size in your printer (such as scaling Letter documents for A4 paper trays), preventing unexpected page clipping or unwanted margins."
  }
];
