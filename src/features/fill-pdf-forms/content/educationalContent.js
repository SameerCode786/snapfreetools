import React from "react";
import Link from "next/link";
import { CheckSquare, ShieldCheck, CheckCircle2, Lock, ArrowRight, FileText, AlertCircle, HelpCircle } from "lucide-react";

export default function FillPdfEducationalContent() {
  return (
    <div className="space-y-12 text-slate-700">
      
      {/* 3-Step Process Overview */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            How to Fill Out PDF Forms Online in 3 Simple Steps
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Complete fillable PDF text fields, checkboxes, dropdowns, and radio buttons in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              1
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Upload Fillable PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Select or drag & drop your PDF file into the browser uploader to detect interactive form fields.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              2
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Fill & Edit Form Fields</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Type your answers in text inputs, check required boxes, and select dropdown options in our clean form interface.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-black text-sm">
              3
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm">Download Completed PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Click &quot;Generate Filled PDF&quot; to save your completed document directly to your device with zero quality loss.
            </p>
          </div>
        </div>
      </section>

      {/* Deep-Dive Article Sections */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 shadow-xs">
        
        <div className="space-y-4">
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckSquare className="text-amber-500 shrink-0" size={22} />
            Understanding Fillable PDF Forms vs. Scanned Documents
          </h2>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            Not all PDF documents are created equal. An **interactive fillable PDF form** contains electronic **AcroForm** data fields (such as text boxes, checkable boxes, radio groups, and drop-down lists) built into the PDF file structure. When you open an interactive form, field boundaries light up and allow digital typing and selection.
          </p>
          <p className="text-xs leading-relaxed text-slate-600 font-medium">
            In contrast, **scanned or flat PDFs** are static page images or text pages that do not possess embedded electronic form field tags. If your PDF is a scanned paper document or a non-interactive PDF, our Fill PDF Forms tool will inform you that no interactive fields were detected. For scanned documents, you can use our <Link href="/flatten-pdf" className="text-amber-600 font-bold underline">Flatten PDF</Link> or <Link href="/sign-pdf" className="text-amber-600 font-bold underline">Sign PDF</Link> tools to add signatures or manual text overlays.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            Supported Interactive Form Field Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Single & Multi-line Text Fields</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Fill out names, addresses, job titles, descriptions, and notes in standard PDF text fields.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Checkboxes & Toggle Switches</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Check or uncheck boolean agreement boxes, terms confirmations, and multi-select options.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Select Dropdown Menus</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Select valid choices from pre-configured country, state, category, or numerical drop-down lists.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="font-extrabold text-xs text-slate-900">Radio Button Groups</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                  Pick single mutually-exclusive options such as Yes/No, Gender, or Account Type.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div className="border-t border-slate-100 pt-6 space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">
            Fill PDF Forms Tool Technical Specifications
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
                  <td className="py-2.5 px-3 font-semibold text-slate-900">AcroForm Field Support</td>
                  <td className="py-2.5 px-3 text-slate-600">PDFTextField, PDFCheckBox, PDFDropdown, PDFOptionList, PDFRadioGroup</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Appearance Stream Generation</td>
                  <td className="py-2.5 px-3 text-slate-600">Automatic PDF appearance stream update on saving</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">Server File Uploads</td>
                  <td className="py-2.5 px-3 text-slate-600">None (Files remain strictly on your local device)</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">File Output Format</td>
                  <td className="py-2.5 px-3 text-slate-600">Completed PDF Form Document (.pdf)</td>
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
              Your sensitive personal and financial form data never leaves your web browser. All parsing and field writing execute locally in your computer&apos;s memory session.
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
            href="/flatten-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Flatten PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Bake filled form fields permanently into static page graphics.</p>
            </div>
          </Link>

          <Link
            href="/redact-pdf"
            className="bg-white border border-slate-200/80 hover:border-amber-400 p-4 rounded-2xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-1">
              <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-amber-600 transition-colors flex items-center justify-between">
                Redact PDF
                <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">Permanently black out and remove confidential text and numbers.</p>
            </div>
          </Link>

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
