import React from "react";
import Link from "next/link";
import {
  FileText,
  Sliders,
  Sparkles,
  Layers,
  HelpCircle,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export const FAQS_DATA = [
  {
    question: "What is PDF metadata?",
    answer:
      "PDF metadata consists of document information properties embedded inside the PDF header—such as the document title, author name, subject description, keywords, creator application, producer engine, and creation/modification timestamps.",
  },
  {
    question: "How do I edit PDF metadata online for free?",
    answer:
      "Upload your PDF document to SnapFreeTools' Edit PDF Metadata tool. Modify the supported document properties (Title, Author, Subject, Keywords, Creator) directly in the editor, click 'Apply Metadata Changes', and download your updated PDF file.",
  },
  {
    question: "Are my PDF files uploaded to a server when editing metadata?",
    answer:
      "No. All PDF metadata parsing, editing, and document saving occur 100% locally inside your web browser. Your document binary data is never transmitted to cloud servers.",
  },
  {
    question: "Can I change the author of a PDF document?",
    answer:
      "Yes. You can edit or replace the Author field of any PDF file using our online metadata editor.",
  },
  {
    question: "Can I change the title of a PDF file?",
    answer:
      "Yes. Updating the PDF Title metadata changes how PDF readers, web browsers, and document indexing tools display the document title.",
  },
  {
    question: "Can I remove or clear PDF metadata?",
    answer:
      "Yes. Click the 'Clear All Metadata' button to wipe supported document metadata fields (title, author, subject, keywords, creator) from the document.",
  },
  {
    question: "Does editing PDF metadata change the visible PDF pages?",
    answer:
      "No. Metadata editing updates only internal document header properties. Your page layout, text formatting, images, forms, and vector graphics remain untouched.",
  },
  {
    question: "What is the difference between Edit PDF Metadata and PDF to Word?",
    answer:
      "Edit PDF Metadata changes document properties (like title and author) without altering document layout or page text. PDF to Word converts full PDF documents into editable Microsoft Word (.docx) files.",
  },
  {
    question: "Does the tool support password-protected PDFs?",
    answer:
      "If a PDF is password-protected, you must first unlock the file using SnapFreeTools Unlock PDF before editing its document metadata.",
  },
  {
    question: "Can I edit PDF creation and modification dates?",
    answer:
      "Yes. You can update or standardize document creation and modification timestamps.",
  },
  {
    question: "Is XMP schema metadata modified by this tool?",
    answer:
      "Standard PDF document info dictionary properties (Title, Author, Subject, Keywords, Creator, Producer, Dates) are updated. Custom third-party XMP streams are preserved without alteration.",
  },
  {
    question: "Can I add multiple keywords to a PDF?",
    answer:
      "Yes. Enter comma-separated keywords or tags to index your document for search engines and digital asset management systems.",
  },
  {
    question: "Is there a file size limit for editing metadata?",
    answer:
      "The tool operates directly in browser memory without artificial server file size limits.",
  },
  {
    question: "Does the tool work on mobile phones?",
    answer:
      "Yes. Edit PDF Metadata is fully responsive and operates on smartphones, tablets, laptops, and desktop computers.",
  },
  {
    question: "Why does my browser display a different title than the filename?",
    answer:
      "Web browsers display the internal PDF Title metadata in the window tab rather than the file name. Updating the PDF Title metadata fixes this behavior.",
  },
  {
    question: "Is this PDF metadata editor completely free?",
    answer:
      "Yes. SnapFreeTools provides free, private, browser-local PDF utilities with no registration or subscriptions.",
  },
];

export function EDUCATIONAL_CONTENT() {
  return (
    <div className="space-y-16 border-t border-slate-100 pt-12 text-slate-700">
      {/* Quick Specifications */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} />
          <h2 className="text-lg font-extrabold text-slate-800">
            SnapFreeTools Edit PDF Metadata Specifications
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Tool Name
            </span>
            <span className="font-extrabold text-slate-800">Edit PDF Metadata</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Processing
            </span>
            <span className="font-extrabold text-slate-800">In-Browser JS</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Privacy
            </span>
            <span className="font-extrabold text-slate-800">100% Local Device</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Supported Fields
            </span>
            <span className="font-extrabold text-slate-800">Title, Author, Subject</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              More Fields
            </span>
            <span className="font-extrabold text-slate-800">Keywords, Creator</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Output Format
            </span>
            <span className="font-extrabold text-slate-800">Standard PDF</span>
          </div>
        </div>
      </section>

      {/* 1. What Is PDF Metadata? */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <FileText className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            What Is PDF Metadata?
          </h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          PDF metadata refers to administrative document information embedded inside the PDF file dictionary header. It includes attributes such as the document Title, Author, Subject description, Keywords, Creator application, Producer engine, and Creation/Modification timestamps.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Web browsers, PDF readers (like Adobe Acrobat or Chrome), search engines, and document management systems use metadata to index, categorize, and display PDF files.
        </p>
      </section>

      {/* 2. How to Edit PDF Metadata */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            How to Edit PDF Metadata in 3 Easy Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Upload Your PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag and drop your PDF into the editor or choose a file from your device.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Update Document Fields</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Edit Title, Author, Subject, Keywords, Creator, and timestamps in the form.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Apply & Download</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click 'Apply Metadata Changes' and save your updated PDF file instantly.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Tool Differentiation */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            Edit PDF Metadata vs Other PDF Tools: Which Tool Do You Need?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
              <Sliders size={18} /> Edit PDF Metadata (Document Info Editing)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Updates hidden document info dictionary headers (Title, Author, Subject, Keywords) without altering visible page content or document layout.
            </p>
            <div className="text-xs text-slate-500 font-bold">
              Best for: Standardizing titles, changing authors, clearing document properties.
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
              <FileText size={18} className="text-slate-500" /> PDF to Word (Text & Layout Editing)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Converts PDF documents into editable Microsoft Word (.docx) files so you can change body text, paragraphs, and formatting.
            </p>
            <div className="text-xs text-slate-500 font-bold">
              Best for: Rewriting document text and restructuring pages.
            </div>
            <Link
              href="/pdf-to-word"
              className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold text-xs hover:underline pt-1"
            >
              Go to PDF to Word <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Supported vs Unsupported Metadata Fields */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" /> Supported Standard Metadata Fields
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Title:</strong> Main document title displayed by PDF viewers.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Author:</strong> Person or organization that created the document.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Subject:</strong> Concise summary or topic description.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Keywords:</strong> Search indexing tags and keywords.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Creator & Producer:</strong> Application and generator engine names.
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <XCircle size={18} className="text-red-400" /> What Is Not Modified?
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Visible Page Text:</strong> Body text inside pages is not altered.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Embedded Images & Graphics:</strong> Embedded photo streams remain original.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Third-Party XMP Schemas:</strong> Custom XML metadata streams are preserved intact.
            </li>
          </ul>
        </div>
      </section>

      {/* 5. AEO / GEO Direct Answer Blocks */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            Direct Answers (AEO & AI Search Snippets)
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              How do I edit PDF metadata online for free?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your PDF file to SnapFreeTools' Edit PDF Metadata tool, update standard document info fields like Title, Author, Subject, and Keywords, then click 'Apply Metadata Changes' to download your updated PDF file without server uploads.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Can I change the author of a PDF without Adobe Acrobat?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. You can edit the Author metadata field directly in your browser using SnapFreeTools' free client-side PDF metadata editor.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Is my PDF uploaded to a server when editing metadata?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. All metadata reading, editing, and document generation take place locally in your web browser. Your document is never uploaded to remote servers.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Does changing PDF metadata alter page contents?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No. Metadata editing updates only header document info fields. Your page layout, images, and text fonts remain unchanged.
            </p>
          </div>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            Frequently Asked Questions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQS_DATA.map((faq, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-2"
            >
              <h3 className="font-bold text-slate-800 text-xs flex items-start gap-2">
                <span className="text-amber-500 font-extrabold">Q.</span>
                {faq.question}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed pl-5">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Contextual Internal Tools Cross-Links */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-slate-800 text-base">
          Related PDF Tools on SnapFreeTools
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Need additional document utilities? Explore our complete suite of free in-browser PDF tools:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href="/pdf-to-word"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            PDF to Word
          </Link>
          <Link
            href="/pdf-to-jpg"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            PDF to JPG
          </Link>
          <Link
            href="/pdf-to-text"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            PDF to Text
          </Link>
          <Link
            href="/compress-pdf"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            Compress PDF
          </Link>
          <Link
            href="/unlock-pdf"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            Unlock PDF
          </Link>
          <Link
            href="/merge-pdf"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            Merge PDF
          </Link>
        </div>
      </section>
    </div>
  );
}

export default EDUCATIONAL_CONTENT;
