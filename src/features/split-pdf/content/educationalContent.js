import React from "react";
import Link from "next/link";
import { Scissors, ShieldCheck, Zap, Lock, FileText, CheckCircle, ArrowRight, Layers, Sparkles } from "lucide-react";

export default function SplitPdfEducationalContent() {
  return (
    <article className="space-y-12 text-slate-700 leading-relaxed text-sm max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
      
      {/* 1. What Is a Split PDF Tool? */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Scissors className="text-amber-500 shrink-0" size={24} />
          What Is a Split PDF Tool?
        </h2>
        <p className="text-slate-600 leading-relaxed font-medium">
          A <strong>Split PDF tool</strong> is an online utility designed to separate a multi-page PDF document into smaller individual PDF files or extract specific pages into a new document. Whether you need to pull a single page from a 100-page report, separate invoices from a bulk monthly file, or divide a long ebook into smaller chapter files, a PDF splitter lets you reorganize document pages effortlessly.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Unlike traditional desktop software that requires costly paid licenses or complex installation processes, SnapFreeTools provides a web-based PDF page splitter that runs 100% locally in your web browser.
        </p>
      </section>

      {/* 2. How to Split a PDF Online (Step-by-Step) */}
      <section className="space-y-4 bg-slate-50/80 p-6 md:p-8 rounded-3xl border border-slate-200/80">
        <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
          <CheckCircle className="text-emerald-500 shrink-0" size={22} />
          How to Split a PDF Online (Step-by-Step Guide)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-7 h-7 bg-amber-500 text-white rounded-lg text-xs font-black flex items-center justify-center">1</span>
            <h3 className="font-bold text-slate-900 text-xs">Upload Document</h3>
            <p className="text-xs text-slate-500 leading-normal">Drag and drop your PDF or click browse to select a file from your computer.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-7 h-7 bg-amber-500 text-white rounded-lg text-xs font-black flex items-center justify-center">2</span>
            <h3 className="font-bold text-slate-900 text-xs">Select Split Mode</h3>
            <p className="text-xs text-slate-500 leading-normal">Choose from Extract Pages, Split Every Page, Custom Ranges, Every N Pages, or Visual Selection.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-7 h-7 bg-amber-500 text-white rounded-lg text-xs font-black flex items-center justify-center">3</span>
            <h3 className="font-bold text-slate-900 text-xs">Configure Ranges</h3>
            <p className="text-xs text-slate-500 leading-normal">Enter desired page numbers or visually click thumbnails to select exact pages.</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="w-7 h-7 bg-amber-500 text-white rounded-lg text-xs font-black flex items-center justify-center">4</span>
            <h3 className="font-bold text-slate-900 text-xs">Download Results</h3>
            <p className="text-xs text-slate-500 leading-normal">Click 'Split PDF' to immediately download your split PDFs individually or in a single ZIP file.</p>
          </div>
        </div>
      </section>

      {/* 3. 5 Different Ways to Split a PDF */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Layers className="text-blue-500 shrink-0" size={24} />
          5 Flexible Modes for Splitting Your PDF
        </h2>
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-sm">1. Extract Specific Pages</h3>
            <p className="text-xs text-slate-600">Enter comma-separated page numbers or ranges (e.g. <code>1, 3, 5-10</code>) to extract specific sections into one clean merged PDF file.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-sm">2. Split Every Page</h3>
            <p className="text-xs text-slate-600">Convert a multi-page PDF into single-page PDF files. Ideal when every page represents a standalone document like receipts or tax certificates.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-sm">3. Split by Custom Ranges</h3>
            <p className="text-xs text-slate-600">Define custom page groupings (e.g., Range 1: Pages 1–5, Range 2: Pages 6–12). Each group is exported as a separate PDF document.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-sm">4. Split Every N Pages</h3>
            <p className="text-xs text-slate-600">Split documents at equal intervals (e.g., every 2 pages or every 5 pages). Perfect for standardized multi-page booklets and application forms.</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-1.5">
            <h3 className="font-extrabold text-slate-900 text-sm">5. Visual Page Selection</h3>
            <p className="text-xs text-slate-600">Browse page thumbnails and click to visually choose which pages to keep. Includes 'Select All' and 'Clear Selection' controls.</p>
          </div>
        </div>
      </section>

      {/* 4. Does Splitting a PDF Reduce Quality? */}
      <section className="space-y-4">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Zap className="text-emerald-500 shrink-0" size={24} />
          Does Splitting a PDF Reduce Document Quality?
        </h2>
        <p className="text-slate-600 leading-relaxed font-medium">
          <strong>No, splitting a PDF with SnapFreeTools does not reduce quality.</strong> Our splitting engine copies native vector objects directly from your original file using WebAssembly and <code>pdf-lib</code>.
        </p>
        <p className="text-slate-600 leading-relaxed">
          Unlike inferior converters that turn PDF pages into compressed JPG images before re-saving them, our tool preserves embedded fonts, sharp vector text, high-resolution graphic elements, form fields, page sizes (A4, Letter, Custom), and page orientations (portrait or landscape).
        </p>
      </section>

      {/* 5. Privacy & Browser-Based Security */}
      <section className="bg-amber-500/10 border border-amber-500/20 p-6 md:p-8 rounded-3xl space-y-4">
        <h2 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-2">
          <Lock className="text-amber-600 shrink-0" size={22} />
          100% Browser-Based Privacy Protection
        </h2>
        <p className="text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
          Most online PDF splitters require you to upload your sensitive contracts, bank statements, or confidential documents to third-party web servers. SnapFreeTools operates differently:
        </p>
        <ul className="text-xs md:text-sm text-slate-700 space-y-2 font-semibold">
          <li className="flex items-center gap-2">✔ Files never leave your computer or device.</li>
          <li className="flex items-center gap-2">✔ Processing happens inside your browser's local memory.</li>
          <li className="flex items-center gap-2">✔ Zero risk of data leaks or server storage.</li>
          <li className="flex items-center gap-2">✔ Works fast even without high-speed internet uploading.</li>
        </ul>
      </section>

      {/* 6. Related PDF Tools Section */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <h3 className="font-extrabold text-slate-900 text-sm">Explore Related PDF Tools:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/merge-pdf" 
            className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition-all space-y-1 block group"
          >
            <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-600 flex items-center justify-between">
              Merge PDF <ArrowRight size={14} />
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Combine multiple PDF files into one document.</p>
          </Link>

          <Link 
            href="/pdf-to-jpg" 
            className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition-all space-y-1 block group"
          >
            <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-600 flex items-center justify-between">
              PDF to JPG <ArrowRight size={14} />
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Convert PDF pages into high-res JPG images.</p>
          </Link>

          <Link 
            href="/pdf-to-word" 
            className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition-all space-y-1 block group"
          >
            <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-600 flex items-center justify-between">
              PDF to Word <ArrowRight size={14} />
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Convert PDF files into editable DOCX format.</p>
          </Link>

          <Link 
            href="/pdf-to-text" 
            className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-2xl transition-all space-y-1 block group"
          >
            <h4 className="font-bold text-slate-900 text-xs group-hover:text-amber-600 flex items-center justify-between">
              PDF to Text <ArrowRight size={14} />
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Extract plain text (.txt) from PDF files instantly.</p>
          </Link>
        </div>
      </section>

    </article>
  );
}
