/**
 * FAQ Data for PDF to PowerPoint Converter
 * SnapFreeTools.com
 *
 * 12 factual, high-quality FAQs aligned with the exact capabilities of the client-side PPTX converter.
 */

export const FAQS_DATA = [
  {
    question: "What is a PDF to PowerPoint converter?",
    answer: "A PDF to PowerPoint converter is a specialized document conversion tool that transforms Adobe PDF pages into Microsoft PowerPoint presentation slides (.pptx). It reads document layout, text streams, and visual assets from the source PDF and translates them into presentation slides that can be opened, presented, and edited in software like Microsoft PowerPoint, Google Slides, Apple Keynote, and LibreOffice Impress."
  },
  {
    question: "Can I convert a PDF to PowerPoint for free?",
    answer: "Yes. SnapFreeTools provides a completely free PDF to PowerPoint converter without subscriptions, daily quotas, file watermarks, or account registration. The conversion engine runs directly inside your web browser using client-side WebAssembly and JavaScript, eliminating server hosting overhead."
  },
  {
    question: "Can PDF files be converted into editable PowerPoint slides?",
    answer: "Yes, when selecting 'Editable Content' mode, the converter extracts selectable text characters, headings, and paragraphs from digital PDF documents and reconstructs them into native PowerPoint text boxes. You can then highlight, edit, reformat, and restyle the text inside Microsoft PowerPoint."
  },
  {
    question: "What is the difference between editable and high-fidelity conversion?",
    answer: "Editable Content mode parses the text stream and reconstructs detected PDF text into editable PowerPoint text boxes. High Fidelity mode renders each PDF page into a high-resolution visual slide, preserving the original visual layout with high fidelity for complex graphic layouts, charts, unique vector shapes, and specialized branding where visual precision takes priority over text editing."
  },
  {
    question: "Will the formatting of my PDF be preserved?",
    answer: "In High Fidelity mode, visual formatting, margins, vector graphics, and embedded styles are preserved with high fidelity. In Editable Content mode, headings, paragraph groupings, line breaks, and relative positioning are reconstructed into PowerPoint objects; however, slight typographic variations may occur depending on system fonts and complex multi-column layouts."
  },
  {
    question: "Can I convert only selected PDF pages?",
    answer: "Yes. You can choose 'Custom Range' in the conversion settings to specify exact pages or page intervals (for example, '1-3, 5, 8-10'). Only the requested pages are processed and compiled into the final PowerPoint presentation file, saving time and memory."
  },
  {
    question: "Can I convert a scanned PDF to PowerPoint?",
    answer: "Yes. When a scanned or image-only PDF is uploaded, the converter detects that no selectable text stream is present and automatically preserves those pages as crisp, high-fidelity slides. This ensures your presentation contains the full visual content of the scanned document without producing garbled or blank text boxes."
  },
  {
    question: "Will images in my PDF be preserved?",
    answer: "Yes. In High Fidelity mode, all graphics, diagrams, and photos are captured at high resolution (150+ DPI). In Editable Content mode, pages with image-dominant layouts or scanned backdrops are rendered to preserve visual clarity alongside reconstructed text elements."
  },
  {
    question: "Will my PDF fonts remain the same?",
    answer: "Standard fonts (such as Arial, Times New Roman, Calibri, Verdana, and Georgia) are directly mapped to their PowerPoint equivalents. If your PDF contains proprietary or custom embedded fonts not installed on your system, the converter applies clean, professional fallback typefaces to ensure smooth rendering in PowerPoint without display errors."
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer: "No. SnapFreeTools operates on a strict 100% client-side privacy architecture. Your PDF file is processed entirely within your local web browser's memory using JavaScript and Web Workers. No file data, text, or slide content is ever transmitted to or stored on external cloud servers."
  },
  {
    question: "Can I convert large PDF files?",
    answer: "Our converter comfortably handles standard documents up to 50MB and up to 100 pages directly in the browser. For exceptionally large files, we recommend converting in page batches (e.g., pages 1-25, 26-50) using the built-in Page Range selector to optimize device memory usage."
  },
  {
    question: "Can I open the generated PPTX in Microsoft PowerPoint?",
    answer: "Yes. The output is a standard Office Open XML presentation file (.pptx), which is natively compatible with Microsoft PowerPoint (2007 through Office 365), Google Slides, Apple Keynote, LibreOffice Impress, WPS Office, and PowerPoint Mobile on iOS and Android."
  }
];
