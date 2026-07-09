import { generatePageMetadata } from "@/seo/metadata";
import { JsonLd } from "@/seo/structured-data";

import PDFToWordFeature from "@/features/pdf-to-word";

export function generateMetadata() {
  return generatePageMetadata("pdf-to-word");
}

const FAQS_DATA = [
  {
    question: "How do I convert PDF to Word?",
    answer: "Upload your PDF file by dragging and dropping it into the upload box or clicking the 'Browse File' button. Click 'Convert to Word' to initiate the conversion. Once the process completes, click 'Download Word File' to save your editable DOCX document."
  },
  {
    question: "Is PDF to Word free?",
    answer: "Yes, our PDF to Word converter is 100% free with no signup required, no trial limits, no daily restrictions, and no watermarks."
  },
  {
    question: "Will formatting stay the same?",
    answer: "Our converter works to preserve your original layout, margins, fonts, tables, and paragraphs as closely as possible so you can edit without losing formatting."
  },
  {
    question: "Can I convert scanned PDF to Word?",
    answer: "Yes. Our converter supports scanned PDFs. For image-only files, OCR technology is applied to identify text shapes and convert them into fully editable text blocks."
  },
  {
    question: "What is OCR?",
    answer: "OCR stands for Optical Character Recognition. It is a technology that scans and parses images of text (such as scanned papers or screenshots) and translates them into actual editable text characters."
  },
  {
    question: "Is the converted file editable?",
    answer: "Absolutely. The output is a standard Word-compatible document (.docx) that you can edit, format, or type directly in Microsoft Word, Google Docs, WPS Office, or Pages."
  },
  {
    question: "What is the difference between DOC and DOCX?",
    answer: "DOC is the older binary file format used by Microsoft Word up to 2003. DOCX is the XML-based open standard format introduced in Word 2007, which is much smaller, secure, and compatible."
  },
  {
    question: "Can I open the file without Microsoft Word?",
    answer: "Yes, you can edit the converted file using any compatible software such as Google Docs, LibreOffice, Apple Pages, WPS Office, or Apache OpenOffice."
  },
  {
    question: "Is my PDF secure?",
    answer: "Yes, user privacy is our top priority. We do not store, copy, or read your PDF files. All processed files are permanently deleted automatically after conversion."
  },
  {
    question: "Does this tool add watermark?",
    answer: "No. SnapFreeTools converts your documents cleanly without adding any watermarks, branding stamps, or watermark logos to the final files."
  }
];

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "SnapFree PDF to Word Converter",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "description": "Convert PDF files into editable Word (DOCX) documents online. Fast, secure, and free PDF to Word converter without losing formatting, signup, or watermarks."
      },
      {
        "@type": "WebPage",
        "@id": "https://snapfreetools.com/pdf-to-word/#webpage",
        "url": "https://snapfreetools.com/pdf-to-word",
        "name": "PDF to Word Converter – Convert PDF to Word Online Free",
        "description": "Convert PDF to Word online free. Convert your PDF documents into editable Microsoft Word (DOCX) files without signup, watermark, or losing formatting.",
        "breadcrumb": {
          "@id": "https://snapfreetools.com/pdf-to-word/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://snapfreetools.com/pdf-to-word/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PDF to Word Converter",
            "item": "https://snapfreetools.com/pdf-to-word"
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
      <PDFToWordFeature faqs={FAQS_DATA} />
    </>
  );
}
