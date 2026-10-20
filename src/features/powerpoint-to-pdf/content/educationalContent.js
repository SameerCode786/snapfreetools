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
        <div className="bg-amber-50/60 border border-amber-200/70 rounded-2xl p-5 flex gap-4 text-left">
          <Sparkles size={24} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-amber-950 uppercase tracking-wider">
              Exact Slide Aspect Ratios
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed font-medium mt-1">
              Supports modern 16:9 widescreen, classic 4:3 presentation decks, and standard international A4 or US Letter formats without stretching or distorting slide content.
            </p>
          </div>
        </div>

        <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-5 flex gap-4 text-left">
          <ShieldCheck size={24} className="text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider">
              100% In-Browser Confidentiality
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium mt-1">
              Your confidential pitch decks, corporate slides, and academic lectures are never uploaded to remote servers. All parsing and PDF assembly happen inside your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Answer-First Section (AEO Target) */}
      <section className="space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Quick Reference & Answers
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How PowerPoint to PDF Conversion Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              How do I convert PowerPoint to PDF?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Drag and drop your <code>.pptx</code> file into SnapFreeTools. The engine detects slide count and proportions. Choose all slides or a custom range, then click <strong>Convert to PDF</strong> to generate and download your document.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Can I convert PPTX to PDF online for free?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Yes. SnapFreeTools PowerPoint to PDF converter is 100% free with no account creation, no watermarks, and no subscription barriers.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Will my slide formatting and shapes be preserved?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              The converter renders slide backgrounds, text formatting, vector shapes, lines, tables, and embedded images according to OpenXML specifications to match your original presentation as closely as the browser engine allows.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Can I convert only selected slides?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              Yes. You can select <strong>Custom Slide Range</strong> and enter specific slide numbers (e.g. <code>1-5, 8, 12</code>) to compile only the exact slides you need into the output PDF.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Are PowerPoint animations preserved in PDF?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              No. PDF is a static document format. Dynamic PowerPoint features such as entrance animations, slide transitions, audio, and video cannot execute in a static PDF and are rendered as fixed final slides.
            </p>
          </div>

          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2 shadow-2xs">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-500" />
              Are my presentations uploaded to any server?
            </h3>
            <p className="text-xs leading-relaxed text-slate-600">
              No. All PowerPoint unzipping, slide parsing, and PDF document synthesis occur 100% locally on your computer inside your browser's client-side sandbox.
            </p>
          </div>
        </div>
      </section>

      {/* Deep Dive Section: PresentationML Architecture */}
      <section className="space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Technical Architecture
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Inside the PowerPoint to PDF Conversion Pipeline
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Understanding how modern Microsoft PowerPoint (.pptx) documents are transformed into universally viewable PDF pages.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                OpenXML Package Inspection
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                A modern <code>.pptx</code> file is an Open Packaging Convention (OPC) ZIP archive. The engine decompresses <code>ppt/presentation.xml</code> to identify slide IDs, presentation dimensions (in English Metric Units), and relationship mappings.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                PresentationML Slide Rendering
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Each selected slide XML (<code>ppt/slides/slideN.xml</code>) is parsed. Shapes (<code>p:sp</code>), text runs (<code>a:r</code>), embedded images (<code>p:pic</code>), and tables are sequentially rendered at high resolution.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 font-bold text-sm flex items-center justify-center">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">
                PDF Page Compilation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Using <code>pdf-lib</code>, individual pages are created matching the exact slide dimensions (e.g. 16:9 widescreen: 13.33" × 7.5"). Rendered slide data is packaged into a fully standards-compliant PDF file.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Aspect Ratio & Page Sizing Guide */}
      <section className="space-y-6 text-left">
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
            Slide Dimensions & Standards
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Widescreen 16:9 vs Standard 4:3 vs Document Sizing
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-200 rounded-2xl bg-white shadow-2xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-800 font-bold">
                <th className="p-3">Presentation Format</th>
                <th className="p-3">Aspect Ratio</th>
                <th className="p-3">Dimensions (Inches)</th>
                <th className="p-3">Dimensions (Points)</th>
                <th className="p-3">Recommended PDF Setting</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600 font-medium">
              <tr>
                <td className="p-3 font-bold text-slate-900">Modern PowerPoint</td>
                <td className="p-3">16:9 Widescreen</td>
                <td className="p-3">13.33" × 7.50"</td>
                <td className="p-3">960 × 540 pt</td>
                <td className="p-3 text-amber-700 font-bold">Match Presentation</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Classic PowerPoint</td>
                <td className="p-3">4:3 Standard</td>
                <td className="p-3">10.00" × 7.50"</td>
                <td className="p-3">720 × 540 pt</td>
                <td className="p-3 text-amber-700 font-bold">Match Presentation</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">A4 Print Slides</td>
                <td className="p-3">1:1.414</td>
                <td className="p-3">11.69" × 8.27"</td>
                <td className="p-3">841.9 × 595.3 pt</td>
                <td className="p-3">A4 Document</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">US Letter Slides</td>
                <td className="p-3">1:1.294</td>
                <td className="p-3">11.00" × 8.50"</td>
                <td className="p-3">792 × 612 pt</td>
                <td className="p-3">US Letter</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contextual Internal Linking */}
      <section className="space-y-4 border-t border-slate-200/80 pt-10 text-left">
        <h3 className="text-lg font-black text-slate-900">
          Related Productivity Tools
        </h3>
        <p className="text-xs text-slate-500">
          Explore complementary tools to manage, convert, and protect your digital documents:
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link
            href="/pdf-to-powerpoint"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-amber-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Presentation size={14} className="text-amber-600" />
            <span>PDF to PowerPoint</span>
          </Link>
          <Link
            href="/word-to-pdf"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            <FileText size={14} className="text-blue-600" />
            <span>Word to PDF</span>
          </Link>
          <Link
            href="/compress-pdf"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Sparkles size={14} className="text-emerald-600" />
            <span>Compress PDF</span>
          </Link>
          <Link
            href="/organize-pdf"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-purple-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Layers size={14} className="text-purple-600" />
            <span>Organize PDF</span>
          </Link>
          <Link
            href="/pdf-to-png"
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:text-rose-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Eye size={14} className="text-rose-600" />
            <span>PDF to PNG</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
