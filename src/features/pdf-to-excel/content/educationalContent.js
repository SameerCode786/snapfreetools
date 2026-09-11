import React from "react";
import Link from "next/link";
import { FileSpreadsheet, ShieldCheck, Zap, Layers, CheckCircle2, Lock } from "lucide-react";

export default function PdfToExcelEducationalContent() {
  return (
    <section className="space-y-12 text-slate-700 leading-relaxed text-base max-w-4xl mx-auto">
      {/* Direct AEO Overview */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <FileSpreadsheet className="text-emerald-600" size={24} />
          What is SnapFreeTools PDF to Excel Converter?
        </h2>
        <p className="text-slate-600">
          SnapFreeTools PDF to Excel is a free, privacy-first online converter that extracts tabular data from PDF documents and generates genuine editable Microsoft Excel spreadsheets (<code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800 text-xs font-mono">.xlsx</code>). Everything operates 100% in your web browser—your document data is never transmitted to any external server.
        </p>
      </div>

      {/* How to Convert */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Convert PDF to Excel Online Free
        </h2>
        <p>
          Converting financial reports, invoices, bank statements, or tabular data from PDF into Microsoft Excel is fast and simple:
        </p>
        <ol className="list-decimal pl-6 space-y-2 font-medium text-slate-600">
          <li><strong>Upload PDF:</strong> Select or drag & drop your PDF file into the converter workspace.</li>
          <li><strong>Analyze & Detect Tables:</strong> Our engine scans document pages for structured rows and column boundaries.</li>
          <li><strong>Review Preview:</strong> Inspect detected tables, select target pages, and rename worksheet tabs if desired.</li>
          <li><strong>Download Excel File:</strong> Click <em>Generate Excel Workbook</em> to download your editable <code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">converted-to-excel.xlsx</code> spreadsheet.</li>
        </ol>
      </div>

      {/* How Table Extraction Works */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How PDF Table Extraction Works
        </h2>
        <p>
          Unlike native spreadsheet files, PDF documents do not store explicit grid lines or cell formulas. Instead, PDFs render text using absolute 2D coordinate positions (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">X, Y</code>).
        </p>
        <p>
          Our converter analyzes spatial text relationships across every page:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-medium text-slate-600">
          <li><strong>Row Proximity Grouping:</strong> Text fragments sharing identical vertical Y-coordinates are grouped into logical rows.</li>
          <li><strong>Column Boundary Alignment:</strong> Horizontal X-coordinates across consecutive rows are clustered to establish column grids.</li>
          <li><strong>Cell Data Typing:</strong> Numbers, percentages, and currencies are formatted as numeric data types so you can immediately perform sums and formulas in Excel.</li>
        </ul>
      </div>

      {/* PDFs That Work Best */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          PDFs That Work Best for Excel Conversion
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
            <h3 className="font-extrabold text-emerald-900 flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" />
              Ideal Documents
            </h3>
            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              Digital PDFs created directly from Excel, Word, QuickBooks, SAP, Google Sheets, or accounting software with selectable text layers.
            </p>
          </div>
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 space-y-2">
            <h3 className="font-extrabold text-amber-900 flex items-center gap-2">
              <Layers size={18} className="text-amber-600" />
              Scanned / Image PDFs
            </h3>
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              Scanned paper documents or image-only PDFs without text vectors require OCR pre-processing for accurate table extraction.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy and Client-Side Processing */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={26} />
          100% Client-Side Privacy & Security
        </h2>
        <p>
          Most online converters upload your sensitive financial statements and private documents to third-party cloud servers. SnapFreeTools processes your files 100% locally in your browser memory:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-medium text-slate-600">
          <li>Zero server uploads or remote data processing</li>
          <li>Your financial figures and document contents remain on your computer</li>
          <li>No email registration or personal information required</li>
        </ul>
      </div>

      {/* Related Tools */}
      <div className="pt-6 border-t border-slate-200/80 space-y-4">
        <h3 className="text-lg font-black text-slate-900">Explore Related PDF Tools</h3>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link href="/pdf-to-word" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            PDF to Word Converter
          </Link>
          <Link href="/merge-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Merge PDF
          </Link>
          <Link href="/compress-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Compress PDF
          </Link>
          <Link href="/unlock-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Unlock PDF
          </Link>
        </div>
      </div>
    </section>
  );
}
