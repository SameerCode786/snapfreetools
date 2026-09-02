import React from "react";
import Link from "next/link";
import { Combine, ShieldCheck, Cpu, Star, Layers, HelpCircle, ArrowRight, FileText, Image as ImageIcon } from "lucide-react";

export function EDUCATIONAL_CONTENT() {
  return (
    <div className="space-y-16 border-t border-slate-100 pt-12">
      
      {/* 1. How to Merge PDF Files */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">How to Merge PDF Files</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="font-bold text-slate-800 text-sm">Upload PDFs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Drag and drop two or more PDF files or click browse to select documents from your device.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">2</div>
            <h3 className="font-bold text-slate-800 text-sm">Reorder Documents</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Use the 'Move Up' and 'Move Down' buttons or drag cards to arrange the exact page sequence.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">3</div>
            <h3 className="font-bold text-slate-800 text-sm">Merge PDFs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Enter an optional output filename and click 'Merge PDFs'. Pages are combined locally inside your browser.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">4</div>
            <h3 className="font-bold text-slate-800 text-sm">Download Merged PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Save your combined single PDF document to your computer or mobile phone immediately.</p>
          </div>
        </div>
      </section>

      {/* 2. What is a Merge PDF Tool? */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <Combine className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">What is a Merge PDF Tool?</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          A Merge PDF tool is a document utility designed to join separate PDF files into a single unified PDF document. Instead of sending multiple attachments or printing documents individually, merging allows you to concatenate multiple reports, chapters, receipts, or forms into one organized file while maintaining page sequence and formatting.
        </p>
      </section>

      {/* 3. Key Features */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">100% Free & Unlimited</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Combine as many PDF files as you need without hidden fees, subscriptions, or watermarks.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">Native Vector Precision</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Uses native PDF object copying. Vector shapes, text crispness, and embedded fonts remain intact.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">Mixed Orientations & Sizes</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Seamlessly merge A4, Letter, Legal, portrait, and landscape pages inside a single output file.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">Local Browser Processing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Files stay on your local device. Operations execute client-side via WebAssembly for complete privacy.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">Interactive Card Workspace</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Visual 1st-page thumbnail cards allow you to reorder, add, or remove documents before merging.</p>
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-850 text-sm">Custom Output Filenames</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Specify custom document names for your final combined file with automatic extension handling.</p>
          </div>
        </div>
      </section>

      {/* 4. Why PDF File Ordering Matters */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Why PDF File Ordering Matters</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          When compiling multi-part documents such as academic applications, legal briefs, or monthly financial statements, the sequence of pages dictates how reader viewers navigate your work. Our workspace displays explicit order numbers (#1, #2, #3) and visual thumbnails so you can verify and adjust file order prior to building the combined document.
        </p>
      </section>

      {/* 5. Does Merging PDFs Reduce Quality? */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Does Merging PDFs Reduce Quality?</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          <strong>No.</strong> SnapFreeTools utilizes pure vector object stream copying. Unlike basic converters that convert pages to lossy image formats, our merging engine copies internal PDF page trees directly. This ensures that text remains selectable, vector artwork stays sharp at any zoom level, and file sizes remain compact.
        </p>
      </section>

      {/* 6. Privacy & Security */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Privacy & Security</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          Your documents contain confidential information. That is why our Merge PDF tool is engineered with a <strong>100% browser-based client-side architecture</strong>. Your PDF files are read into local browser RAM, processed using client-side JavaScript, and compiled directly on your machine. No file is ever transmitted to remote servers.
        </p>
      </section>

      {/* 7. Explore Related Tools */}
      <section className="border-t border-slate-100 pt-10 space-y-6">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-amber-500 fill-amber-500" />
          <h3 className="font-extrabold text-slate-800 text-base">Explore Related Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/jpg-to-pdf"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Combine size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                JPG to PDF
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Convert JPG or PNG images into a PDF file.
              </p>
            </div>
          </Link>
          <Link
            href="/pdf-to-jpg"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <ImageIcon size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                PDF to JPG
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Extract PDF pages into JPG images free.
              </p>
            </div>
          </Link>
          <Link
            href="/pdf-to-word"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                PDF to Word
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Convert PDF to editable Word docx files.
              </p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
