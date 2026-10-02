export const EXTRACT_PDF_FAQS = [
  {
    question: "How do I extract selected pages from a PDF document?",
    answer:
      "Upload your PDF to SnapFreeTools' Extract PDF Pages tool, select the specific pages or page ranges you wish to keep (e.g. 1-3, 5, 8), and click 'Extract PDF'. The tool generates a new PDF containing only your selected pages in your requested order, available for instant download."
  },
  {
    question: "Can I extract non-consecutive pages or page ranges?",
    answer:
      "Yes. You can select pages visually by clicking thumbnails or by typing custom ranges into the selection box (e.g., '1-5, 8, 12-15'). Non-consecutive and arbitrary page combinations are fully supported."
  },
  {
    question: "Does extracting PDF pages reduce document quality?",
    answer:
      "No. Extraction is performed via native PDF object stream copying without rasterization. All original vector text, embedded fonts, high-res images, layout dimensions, and links remain 100% original and sharp."
  },
  {
    question: "Are my uploaded PDF files stored or sent to a server?",
    answer:
      "No. SnapFreeTools operates under a strict 100% client-side privacy architecture. All page parsing, range calculation, and PDF assembly take place directly inside your web browser. Your PDF is never uploaded to any external server."
  },
  {
    question: "How does browser-based PDF page extraction work?",
    answer:
      "Our tool utilizes client-side WebAssembly and JavaScript libraries (pdf-lib and PDF.js) to read the internal PDF page structure directly in your browser memory and construct a new, clean PDF document instantly without external processing."
  },
  {
    question: "Can I extract pages from a password-protected PDF?",
    answer:
      "If your PDF is protected with an owner or user password, you must first unlock the file using our Unlock PDF tool before extracting its pages."
  },
  {
    question: "Is the Extract PDF Pages tool completely free?",
    answer:
      "Yes! SnapFreeTools is 100% free with no registration, no file size limits, no daily caps, and no added watermarks."
  }
];

export default EXTRACT_PDF_FAQS;
