import React from "react";
import Link from "next/link";
import {
  FileImage,
  Layers,
  Star,
  ShieldCheck,
  Cpu,
  HelpCircle,
  ArrowRight,
  Info,
  CheckCircle2,
  XCircle,
  Lock,
  Sparkles,
} from "lucide-react";

export const FAQS_DATA = [
  {
    question: "What is a PDF image extractor?",
    answer:
      "A PDF image extractor is a utility designed to inspect the internal object streams of a PDF document and extract standalone embedded raster image objects (such as photographs, logos, and figures) into individual image files (JPG or PNG) without rasterizing the entire document page.",
  },
  {
    question: "How do I extract images from a PDF online for free?",
    answer:
      "Upload your PDF document to SnapFreeTools' Extract PDF Images tool. The engine automatically scans the document streams for supported embedded images and allows you to preview and download individual images or export all visible images in a single ZIP archive.",
  },
  {
    question: "Can I extract embedded images from a PDF?",
    answer:
      "Yes. The tool inspects PDF XObject resource dictionaries to retrieve embedded photos, logos, charts, and graphics stored inside the document.",
  },
  {
    question: "What is the difference between Extract PDF Images and PDF to JPG?",
    answer:
      "Extract PDF Images retrieves embedded standalone image objects (photos, logos, figures) stored inside the PDF internals. PDF to JPG converts complete PDF pages—including text, layout, and background elements—into full-page image snapshots.",
  },
  {
    question: "Can I extract JPG images from a PDF?",
    answer:
      "Yes. Embedded images compressed with DCT (JPEG) stream filters are recovered directly in their original JPEG format without re-compression.",
  },
  {
    question: "Can I extract PNG images from a PDF?",
    answer:
      "Yes. Images stored as Flate-encoded or uncompressed pixel arrays are reconstructed as lossless PNG files matching their natural dimensions.",
  },
  {
    question: "Does the tool preserve original image quality?",
    answer:
      "For embedded JPEG streams, the original stream bytes are preserved without quality loss. For decoded raster streams, images are reconstructed as crisp, lossless PNG representations.",
  },
  {
    question: "Are my PDF files uploaded to a server?",
    answer:
      "No. All PDF stream parsing, image extraction, and ZIP creation occur locally inside your web browser. Your document is never uploaded to cloud servers.",
  },
  {
    question: "Can I extract images from a scanned PDF?",
    answer:
      "Yes. Scanned PDF pages are usually stored as full-page raster image XObjects, which can be extracted by this tool.",
  },
  {
    question: "Why does my PDF show no embedded images?",
    answer:
      "If a PDF contains only text or vector path drawings (such as PDF shapes, lines, or font paths), there are no embedded raster image objects to extract. In such cases, use PDF to JPG to render page snapshots.",
  },
  {
    question: "Can vector graphics be extracted as images?",
    answer:
      "Vector drawing instructions (lines, curves, fill paths) are not stored as raster image objects. To capture vector graphics, use PDF to JPG to render the visual page as an image.",
  },
  {
    question: "Can I download all extracted images at once?",
    answer:
      "Yes. Click the 'Download All as ZIP' button in the results grid to download all visible extracted images archived inside a single ZIP file.",
  },
  {
    question: "Can I download extracted images individually?",
    answer:
      "Yes. Each extracted image card and preview lightbox features an individual download button to save specific images directly.",
  },
  {
    question: "Does the tool support password-protected PDFs?",
    answer:
      "If a PDF is password-protected, you must first unlock the document using SnapFreeTools Unlock PDF before extracting its images.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "The tool operates directly in browser memory without artificial server size limits. Processing speed depends on your device's memory capacity.",
  },
  {
    question: "Does the tool work on mobile devices?",
    answer:
      "Yes. Extract PDF Images is fully responsive and operates on smartphones, tablets, and desktop browsers.",
  },
];

export function EDUCATIONAL_CONTENT() {
  return (
    <div className="space-y-16 border-t border-slate-100 pt-12 text-slate-700">
      {/* Quick Tool Specifications */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} />
          <h2 className="text-lg font-extrabold text-slate-800">
            SnapFreeTools PDF Image Extractor Specifications
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-xs">
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Tool Name
            </span>
            <span className="font-extrabold text-slate-800">PDF Image Extractor</span>
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
              Supported Input
            </span>
            <span className="font-extrabold text-slate-800">PDF (.pdf)</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Outputs
            </span>
            <span className="font-extrabold text-slate-800">JPG, PNG, ZIP</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
              Deduplication
            </span>
            <span className="font-extrabold text-slate-800">Indirect Object Ref</span>
          </div>
        </div>
      </section>

      {/* 1. What Is a PDF Image Extractor? */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <FileImage className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            What Is a PDF Image Extractor?
          </h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          A PDF image extractor is a specialized utility that parses the object stream data of a PDF document to isolate and extract embedded raster image objects—such as photos, figures, diagrams, and corporate logos—stored inside document XObject resource dictionaries.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          Unlike full-page converters that re-render entire PDF layouts into single image snapshots, an embedded image extractor pulls out standalone visual objects while discarding surrounding text lines, margins, and page backgrounds.
        </p>
      </section>

      {/* 2. How to Extract Images from a PDF */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            How to Extract Images from a PDF in 3 Easy Steps
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Upload Your PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Drag and drop your PDF file into the upload zone or choose a file from your device.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Automatic Stream Scanning</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The browser engine scans PDF page resources to find embedded JPEG and PNG image objects.
            </p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Preview & Download</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Preview images in high-res lightbox, filter by dimension, and save images individually or as a ZIP.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Extract PDF Images vs PDF to JPG */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">
            Extract PDF Images vs PDF to JPG: Which Tool Do You Need?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-800 font-extrabold text-sm">
              <FileImage size={18} /> Extract PDF Images (Object Extraction)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pulls individual photo files, logos, and graphics embedded inside the PDF object streams. Preserves original JPEG stream bytes without re-compression.
            </p>
            <div className="text-xs text-slate-500 font-bold">
              Best for: Extracting photos from reports, saving logos, recovering research figures.
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-extrabold text-sm">
              <Layers size={18} className="text-slate-500" /> PDF to JPG (Full Page Render)
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Renders entire document pages into image snapshots including text formatting, layout, and background colors.
            </p>
            <div className="text-xs text-slate-500 font-bold">
              Best for: Converting document pages to viewable image snapshots.
            </div>
            <Link
              href="/pdf-to-jpg"
              className="inline-flex items-center gap-1.5 text-amber-600 font-extrabold text-xs hover:underline pt-1"
            >
              Go to PDF to JPG <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. What Can & Cannot Be Extracted */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <CheckCircle2 size={18} className="text-emerald-500" /> What Can Be Extracted?
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Embedded JPEG Photos:</strong> Recovered directly from DCTDecode streams.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>PNG Raster Graphics:</strong> Reconstructed as lossless PNG files.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Logos & Product Pictures:</strong> Standalone image objects inside catalogs.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">•</span>
              <strong>Scanned PDF Pages:</strong> Scanned pages encoded as XObject images.
            </li>
          </ul>
        </div>

        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-3">
          <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2">
            <XCircle size={18} className="text-red-400" /> What Cannot Be Extracted as Images?
          </h3>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Vector Paths & Shapes:</strong> Lines and curves are drawing instructions, not images.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Selectable PDF Text:</strong> Text lines require{" "}
              <Link href="/pdf-to-text" className="text-amber-600 font-bold underline">
                PDF to Text
              </Link>.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 font-bold">•</span>
              <strong>Unsupported Custom Encodings:</strong> Encrypted PDF streams require unlocking first.
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
              How do I extract images from a PDF online for free?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload your PDF to SnapFreeTools' Extract PDF Images tool. The browser scans the PDF for supported embedded raster images and lets you preview and download individual images or export them as a ZIP without sending the document to a cloud extraction server.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Is extracting PDF images different from converting PDF to JPG?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. Extract PDF Images retrieves supported embedded raster image objects from the PDF, while PDF to JPG renders complete PDF pages into image files.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Can I extract images from a PDF without uploading it?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              With SnapFreeTools, PDF image extraction is performed locally in your web browser, so the selected PDF does not need to be uploaded to a remote extraction server.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              Does the tool extract the original JPEG?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes. Embedded JPEG streams using DCTDecode filters are extracted in their original byte-exact JPEG format without re-compression.
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
          Need additional file management capabilities? Try our full suite of free in-browser PDF tools:
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
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
            href="/pdf-to-word"
            className="px-3.5 py-2 bg-slate-100 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-700 text-xs font-bold rounded-xl transition-all"
          >
            PDF to Word
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
