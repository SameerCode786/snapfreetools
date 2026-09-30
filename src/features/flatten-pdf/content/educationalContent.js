import React from "react";
import Link from "next/link";
import { Layers, ShieldCheck, CheckCircle2, Lock, ArrowRight, Zap, FileCheck } from "lucide-react";

export default function FlattenPdfEducationalContent() {
  return (
    <div className="space-y-12 text-slate-700">
      
      {/* 3-Step Process Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How to Flatten a PDF Document in 3 Simple Steps
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Bake fillable forms and annotations into non-editable PDF content in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Upload PDF File</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Select or drag & drop your PDF file containing interactive form fields or annotations into the browser uploader.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Flatten Interactive Fields</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Click &quot;Flatten PDF&quot; to convert form text fields, checkboxes, and widget annotations into static document graphics.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Download Flattened PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Save your finalized, locked PDF file immediately. All form values are permanently set and non-interactive.
            </p>
          </div>
        </div>
      </section>

      {/* Deep-Dive Article Sections */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 shadow-xs">
        
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="text-amber-500 shrink-0" size={22} />
            What Does Flattening a PDF Mean?
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            Standard interactive PDF files contain two distinct structural layers: a **page content layer** (which holds static text, images, lines, and page graphics) and an **interactive annotation layer** (which holds fillable text boxes, checkbox widgets, drop-down menus, radio buttons, and digital form data).
          </p>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            When you **flatten a PDF**, the engine reads all filled values and interactive widget objects from the annotation layer and merges them directly into the underlying page content graphics layer. Once flattened, the interactive fields are removed from the PDF object hierarchy. The visible text and graphics remain identical, but users can no longer edit or alter the form entries.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Key Benefits of Flattening Your PDF Files
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Prevent Form Modification</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Lock completed contracts, invoices, application forms, and tax worksheets so recipient devices cannot change filled fields.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Ensure Uniform Rendering</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Eliminate rendering glitches on mobile PDF readers, web browsers, and printers that don&apos;t display interactive AcroForms properly.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Preserve Vector Quality</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Form field text is converted into crisp vector operators without rasterizing page images or degrading document clarity.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Faster Printing & Archiving</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Flattened PDFs print significantly faster on commercial printers because hardware memory doesn&apos;t need to parse form widgets.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Specifications Table */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            Flatten PDF Tool Technical Specifications
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="py-2.5 px-3 font-extrabold text-slate-700">Feature</th>
                  <th className="py-2.5 px-3 font-extrabold text-slate-700">Specification Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Processing Environment</td>
                  <td className="py-2.5 px-3 text-slate-600">100% Client-Side WebBrowser JavaScript Memory</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Form Flattening Support</td>
                  <td className="py-2.5 px-3 text-slate-600">AcroForm Text Inputs, Checkboxes, Dropdowns, Radio Buttons, Signature Fields</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Page Quality & Geometry</td>
                  <td className="py-2.5 px-3 text-slate-600">100% Vector Preservation (No rasterization or image blur)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Server File Uploads</td>
                  <td className="py-2.5 px-3 text-slate-600">None (Files remain strictly on your local device)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">File Output Format</td>
                  <td className="py-2.5 px-3 text-slate-600">Flattened PDF Document (.pdf)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Privacy Highlight */}
        <div className="border-t border-slate-100 pt-6 flex items-start gap-4 bg-amber-50/50 p-5 rounded-2xl border border-amber-100">
          <ShieldCheck className="text-amber-600 shrink-0 mt-0.5" size={24} />
          <div className="space-y-1">
            <h4 className="font-extrabold text-xs text-slate-900">Privacy & Security Guaranteed</h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
              Your sensitive documents never leave your computer. Processing occurs locally inside your web browser session. No data is stored, logged, or uploaded to external servers.
            </p>
          </div>
        </div>

      </section>

      {/* Internal Tool Cross-Links */}
      <section className="space-y-4">
        <h3 className="text-base font-black text-slate-900 tracking-tight">
          Explore Related PDF Tools
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/protect-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Protect PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Add strong password encryption to confidential documents.</p>
            </div>
          </Link>

          <Link
            href="/unlock-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Unlock PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Remove password protection and editing restrictions.</p>
            </div>
          </Link>

          <Link
            href="/sign-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Sign PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Draw, type, or upload electronic signatures onto PDF pages.</p>
            </div>
          </Link>

          <Link
            href="/edit-pdf-metadata"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Edit PDF Metadata
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Modify PDF title, author, keywords, and document properties.</p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
