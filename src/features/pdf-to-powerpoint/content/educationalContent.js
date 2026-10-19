import React from "react";
import Link from "next/link";
import {
  Presentation,
  FileText,
  Sparkles,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle,
  HelpCircle,
  Maximize2,
  FileCheck,
  Settings,
  ArrowRight,
  Eye,
  Type
} from "lucide-react";

export default function EducationalContent() {
  return (
    <div className="space-y-16 text-slate-700">
      {/* Informational Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-5 flex gap-4">
          <Sparkles size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
              Dual Conversion Modes
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium mt-1">
              Choose <strong>Editable Content</strong> to reconstruct selectable text, headings, and paragraphs into native PowerPoint text boxes, or <strong>High Fidelity</strong> for pixel-exact presentation slides.
            </p>
          </div>
        </div>

        <div className="bg-blue-50/60 border border-blue-200/70 rounded-2xl p-5 flex gap-4">
          <ShieldCheck size={24} className="text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-blue-950 uppercase tracking-wider">
              100% Client-Side Privacy
            </h4>
            <p className="text-xs text-blue-900 leading-relaxed font-medium mt-1">
              Your confidential PDFs are never uploaded to remote servers. All text extraction and PowerPoint slide packaging execute locally within your browser sandbox.
            </p>
          </div>
        </div>
      </div>

      {/* Answer-First Section (AEO Target) */}
      <section className="space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Quick Reference & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How PDF to PowerPoint Conversion Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Upload & Local Analysis
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Select or drop your PDF document. The engine analyzes page dimensions, orientation, selectable text streams, and image densities in client memory without server transmission.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Reconstruction & Sizing
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Configure your conversion mode (Editable vs High Fidelity), select your slide aspect ratio (Match PDF, 16:9, 4:3, A4, Letter), and pick your target page range.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Instant PPTX Download
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Our presentation engine compiles the slides into an industry-standard Office Open XML (.pptx) file ready to open in Microsoft PowerPoint, Google Slides, or Apple Keynote.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Technical Overview: PDF vs PowerPoint Document Architectures (GEO Target) */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 space-y-8 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Cpu size={16} />
            <span>Document Model Mechanics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Understanding the Shift from Fixed PDF Pages to PowerPoint Slides
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            Converting a PDF document into a PowerPoint presentation requires bridging two fundamentally different document paradigms. Understanding these architectural differences helps you choose the optimal conversion mode for your project.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <FileText className="text-red-500" size={20} />
              <h3>The PDF Coordinate Model</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Adobe PDF (Portable Document Format) is built on a <em>fixed-coordinate graphics model</em> derived from PostScript. Text characters, curves, and images are placed at exact absolute coordinates (measured in points from the bottom-left origin). PDF files have no inherent concept of paragraphs, flowing text frames, or responsive slide containers. Words can be fragmented across individual character operators.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 pt-2 border-t border-slate-200">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Origin:</strong> Bottom-left coordinate grid (x, y points).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Structure:</strong> Paint-order rendering instructions without semantic blocks.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span><strong>Primary Goal:</strong> Universal printing and visual consistency across screens.</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-amber-50/40 border border-amber-200/70 rounded-2xl p-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
              <Presentation className="text-amber-600" size={20} />
              <h3>The PowerPoint Shape Model</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Microsoft PowerPoint (.pptx) uses the Office Open XML PresentationML standard. Content is organized into distinct <em>shapes, text frames, and slide masters</em>. Slide dimensions are specified in inches or English Metric Units (EMUs). Text exists within bounding boxes that support word wrapping, font auto-fitting, list indentations, and interactive typing.
            </p>
            <ul className="text-xs space-y-2 text-slate-600 pt-2 border-t border-amber-200/70">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Origin:</strong> Top-left coordinate layout measured in inches.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Structure:</strong> Semantic text boxes, headings, and vector shape hierarchies.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Primary Goal:</strong> Dynamic editing, presenting, animation, and collaborative authoring.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Comparison Table */}
        <div className="space-y-4 pt-4">
          <h3 className="font-bold text-slate-900 text-lg">
            Comparison: Editable Content Mode vs High Fidelity Mode
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100/80 text-slate-800 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Feature</th>
                  <th className="p-3">Editable Content Mode</th>
                  <th className="p-3">High Fidelity Mode</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Text Editability</td>
                  <td className="p-3 text-emerald-700 font-semibold">Reconstructs detected PDF text into editable PowerPoint text boxes</td>
                  <td className="p-3 text-slate-500">Static slide image (non-editable text)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Visual Similarity</td>
                  <td className="p-3">Approximate layout & typography matching</td>
                  <td className="p-3 text-emerald-700 font-semibold">Preserves original visual layout with high fidelity</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Complex Charts & Diagrams</td>
                  <td className="p-3">Reconstructs text; complex art falls back to image</td>
                  <td className="p-3 text-emerald-700 font-semibold">Full preservation of vector art and graphs</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Font Handling</td>
                  <td className="p-3">Standard PPT fonts (Calibri, Arial, Times New Roman)</td>
                  <td className="p-3">Preserves exact embedded font shapes via canvas</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Scanned PDFs</td>
                  <td className="p-3">Preserved as images with informative alert</td>
                  <td className="p-3">Preserved as crisp high-resolution slides</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Ideal Use Case</td>
                  <td className="p-3">Slide decks, reports, text briefs, lectures</td>
                  <td className="p-3">Brochures, posters, architectural drawings, infographics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Slide Aspect Ratio Guide */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 space-y-6 shadow-xs">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
            <Maximize2 size={16} />
            <span>Slide Sizing Strategy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Selecting the Right Presentation Slide Size
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Most PDF documents are created in portrait formats like A4 (8.27" × 11.69") or US Letter (8.5" × 11.0"), whereas PowerPoint presentations are traditionally designed in landscape formats like 16:9 widescreen. Our converter provides smart sizing presets to handle this transition cleanly:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
            <div className="font-bold text-slate-900 text-sm">Match PDF</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Maintains the exact width and height of the original PDF page. Ideal for portrait presentations or reading documents like slides.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
            <div className="font-bold text-slate-900 text-sm">16:9 Widescreen</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              The modern standard for laptops, boardroom projectors, and TV monitors (13.33" × 7.5"). Content is scaled and centered without distortion.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
            <div className="font-bold text-slate-900 text-sm">4:3 Standard</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Classic presentation format (10" × 7.5") commonly used for academic papers, print handouts, and legacy projectors.
            </p>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
            <div className="font-bold text-slate-900 text-sm">A4 / Letter</div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Standard paper dimensions formatted for print distribution and booklet-style PowerPoint presentation templates.
            </p>
          </div>
        </div>
      </section>

      {/* Scanned vs Digital Document Clarification */}
      <section className="bg-amber-50/40 border border-amber-200/80 rounded-3xl p-8 sm:p-10 space-y-4">
        <h3 className="text-xl font-bold text-slate-900">
          How Scanned Documents Are Handled
        </h3>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Some PDF files originate from flatbed scanners, mobile phone camera scans, or image exports. These files contain pictures of text rather than selectable character streams. Unlike text-based PDFs where characters have digital coordinate metadata, scanned pages contain only pixel grids.
        </p>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          Our converter automatically detects image-only pages. Instead of generating empty text boxes or broken text fragments, the engine gracefully preserves those pages as high-fidelity visual slides. If your goal is extracting editable text from a scanned document using Optical Character Recognition (OCR), check out our specialized <Link href="/pdf-to-word" className="text-amber-700 underline font-semibold">PDF to Word Converter with OCR</Link> or <Link href="/pdf-to-text" className="text-amber-700 underline font-semibold">PDF to Text</Link> tool.
        </p>
      </section>

      {/* Internal Links & Workflow Hub */}
      <section className="space-y-6 pt-4">
        <div className="space-y-1">
          <h3 className="text-xl font-black text-slate-900">
            Related PDF & Document Utilities
          </h3>
          <p className="text-xs text-slate-500">
            Combine our suite of free client-side tools for a complete presentation workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/pdf-to-word"
            className="p-5 bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-sm transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <FileText size={18} />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
              PDF to Word
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Convert PDF files into editable Microsoft Word (.docx) documents with free in-browser OCR.
            </p>
          </Link>

          <Link
            href="/pdf-to-png"
            className="p-5 bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-sm transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Eye size={18} />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
              PDF to PNG
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Extract high-resolution PNG images from PDF pages for slide insertion or web sharing.
            </p>
          </Link>

          <Link
            href="/organize-pdf"
            className="p-5 bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-sm transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Layers size={18} />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
              Organize PDF
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Rearrange, sort, rotate, or delete PDF pages prior to converting them into PowerPoint slides.
            </p>
          </Link>

          <Link
            href="/compress-pdf"
            className="p-5 bg-white border border-slate-200/80 hover:border-amber-400 rounded-2xl shadow-2xs hover:shadow-sm transition-all group space-y-2"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <Maximize2 size={18} />
            </div>
            <div className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
              Compress PDF
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Reduce PDF file size without losing text sharpness or presentation layout quality.
            </p>
          </Link>
        </div>
      </section>
    </div>
  );
}
