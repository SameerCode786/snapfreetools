import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import PDFToWordFeature from "@/features/pdf-to-word";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-word");
}

const FAQS_DATA = [
  {
    question: "How do I convert a PDF or scanned PDF to Word?",
    answer: "Drag and drop a PDF file (up to 25MB) into the upload box or click to browse from your device. For native digital PDFs, click 'Convert to Word (.docx)'. If scanned or image-based pages are detected, pick the document language, click 'Convert with Free OCR', and download your generated DOCX file."
  },
  {
    question: "Is this PDF to Word converter with OCR free?",
    answer: "Yes. Both native-text extraction and in-browser OCR are free to use with no signup, email requirement, or watermarks. Scanned OCR is limited to 10 pages per PDF, while all uploads are subject to the 25MB file size limit."
  },
  {
    question: "Will original formatting, tables, fonts, and layouts stay the same?",
    answer: "No. This converter extracts readable text, detected headings, bullet lists, numbered lists, and paragraphs into standard Word formatting with page breaks. Complex tables, multi-column layouts, embedded images, and original fonts are not recreated and may need manual editing in Word."
  },
  {
    question: "Can I convert a scanned PDF to editable Word?",
    answer: "Yes, up to 10 pages per document. When uploaded pages have little or no selectable text, the converter offers in-browser OCR to recognize text from page images and output an editable DOCX document. Recognition accuracy depends on the resolution and clarity of the scan."
  },
  {
    question: "What is OCR and what affects its accuracy?",
    answer: "OCR (Optical Character Recognition) renders scanned PDF pages onto a browser canvas and uses Tesseract.js WebAssembly to convert image characters into editable text. Output quality depends on scan clarity: crisp printed text converts well, while low-resolution, skewed, shadowed, or handwritten scans can produce errors and require manual review. Select the language that matches your document. Accented characters can still be misread, so please review the output."
  },
  {
    question: "Is the converted file editable?",
    answer: "Yes. The download is a standard Word document (.docx) formatted with extracted headings, lists, and paragraphs that you can edit in Microsoft Word, Google Docs, LibreOffice Writer, WPS Office, or Apple Pages."
  },
  {
    question: "Which OCR languages are supported?",
    answer: "The OCR engine supports six languages: English, Spanish, French, German, Italian, and Portuguese. English language data is bundled directly with the tool, while Spanish, French, German, Italian, and Portuguese download their language data from a third-party CDN on first use and require an active internet connection."
  },
  {
    question: "What are the page and file size limits?",
    answer: "All uploaded PDFs have a 25MB maximum file size limit. Documents processed with OCR are capped at 10 pages per run to keep browser memory usage stable. Purely native-text PDFs converted without OCR have no hard page cap and are bounded by the 25MB file limit and your device's browser memory."
  },
  {
    question: "Are my PDF files private, uploaded, or stored on a server?",
    answer: "Your PDF never leaves your browser. All PDF inspection, page rendering, OCR recognition, and DOCX generation happen locally inside browser memory, so files are never uploaded to or stored on SnapFreeTools servers. Note that loading the converter still fetches the pdf.js worker script from Cloudflare CDN, and choosing non-English OCR languages downloads language data on first use."
  },
  {
    question: "Does this tool add watermarks or branding to the DOCX?",
    answer: "No. The exported .docx file contains only the extracted text, headings, lists, and paragraphs from your PDF with no watermarks or branding added."
  },
  {
    question: "Why did standard conversion say no selectable text was found?",
    answer: "Some PDFs are scans, camera photos, or image-only exports with no embedded digital text layer. Standard conversion extracts existing selectable text only; when none is present, switch to 'Convert with Free OCR' (up to 10 pages) to recognize text from the page images."
  },
  {
    question: "Can I open the converted DOCX file without Microsoft Word?",
    answer: "Yes. Because .docx is an open XML document format, you can open and edit it in Google Docs, LibreOffice Writer, Apple Pages, WPS Office, or Apache OpenOffice without Microsoft Word installed."
  }
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "name": "SnapFree Scanned PDF to Word Converter",
        "url": "https://www.snapfreetools.com/pdf-to-word",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "browserRequirements": "Requires JavaScript and WebAssembly support",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Convert native or scanned PDFs to editable Word (DOCX) online free. In-browser OCR keeps files on your device. Scanned PDFs up to 10 pages."
      },
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/pdf-to-word#webpage",
        "url": "https://www.snapfreetools.com/pdf-to-word",
        "name": "Scanned PDF to Word Converter with OCR Free | SnapFreeTools",
        "description": "Convert native or scanned PDFs to editable Word (DOCX) online free. In-browser OCR keeps files on your device. Scanned PDFs up to 10 pages.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-to-word#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-to-word#breadcrumb",
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
            "name": "PDF to Word Converter",
            "item": "https://www.snapfreetools.com/pdf-to-word"
          }
        ]
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <PDFToWordFeature faqs={FAQS_DATA} />
    </>
  );
}
