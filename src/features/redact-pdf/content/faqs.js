export const REDACT_PDF_FAQS = [
  {
    question: "What is PDF redaction?",
    answer:
      "PDF redaction is the process of permanently removing and blacking out sensitive, confidential, or private information—such as Social Security Numbers, names, financial account numbers, addresses, and passwords—from a PDF document."
  },
  {
    question: "Is redaction permanent in the generated PDF?",
    answer:
      "Yes! Unlike simply placing a black rectangle shape in an editable PDF reader, SnapFreeTools' Redact PDF engine permanently sanitizes content streams and bakes opaque solid boxes over target regions. The underlying text data is purged from the PDF binary so it cannot be copied, highlighted, or searched."
  },
  {
    question: "Does redacting a PDF alter my original file?",
    answer:
      "No. Processing takes place entirely in your web browser memory. Your original uploaded PDF remains untouched on your computer. You download a newly generated, sanitized PDF file."
  },
  {
    question: "Can I redact PDF files online for free?",
    answer:
      "Yes! SnapFreeTools' Redact PDF tool is 100% free with no hidden fees, subscriptions, file size limits, or watermarks. All operations run locally inside your browser."
  },
  {
    question: "Are my confidential files uploaded to a server?",
    answer:
      "No. SnapFreeTools operates under a strict 100% client-side privacy architecture. PDF parsing, content stream sanitization, and redaction box rendering execute locally in your web browser session. Your documents are never transmitted to our servers or any third-party service."
  },
  {
    question: "Can I choose custom redaction box colors?",
    answer:
      "Yes. While classic redaction uses solid black blocks (#000000), you can select solid white or custom highlight colors to obscure sensitive information according to your organizational standards."
  }
];

export default REDACT_PDF_FAQS;
