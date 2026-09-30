export const FLATTEN_PDF_FAQS = [
  {
    question: "What is a flattened PDF?",
    answer:
      "A flattened PDF is a document where interactive elements—such as fillable form text fields, checkboxes, dropdown menus, and radio buttons—have been converted into static, permanent page content. Once flattened, these fields are baked into the PDF drawing layer and can no longer be edited or filled interactively."
  },
  {
    question: "Why should I flatten a PDF document?",
    answer:
      "Flattening a PDF is essential for finalizing completed form documents before sharing, printing, or archiving. It prevents unauthorized users from altering form responses, fixes rendering inconsistencies across different PDF viewers, and ensures that signatures and form values display identically on mobile devices and desktop readers."
  },
  {
    question: "Does flattening a PDF alter my original file?",
    answer:
      "No. Processing takes place entirely in your browser memory. Your original uploaded PDF remains completely untouched on your device. You receive a newly generated, flattened PDF file to download."
  },
  {
    question: "Can I flatten PDF form fields online for free?",
    answer:
      "Yes! SnapFreeTools' Flatten PDF tool is 100% free to use with no hidden fees, subscriptions, file limits, or watermarks. All operations run directly inside your web browser."
  },
  {
    question: "Can I flatten PDF annotations and signatures?",
    answer:
      "Yes. Supported AcroForm widget annotations, interactive fields, and digital form markings are converted into permanent page vector graphics during the flattening process."
  },
  {
    question: "Are my PDF files uploaded to a remote server?",
    answer:
      "No. SnapFreeTools operates under a strict privacy-first architecture. All PDF parsing, form baking, and flattening operations execute locally in your web browser using WebAssembly and JavaScript memory. Your files are never uploaded to our servers or any third-party service."
  }
];

export default FLATTEN_PDF_FAQS;
