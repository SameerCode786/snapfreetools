import React from "react";
import Link from "next/link";
import { FileSpreadsheet, ShieldCheck, Zap, Layers, CheckCircle2, Sparkles, AlertTriangle, Eye, HelpCircle } from "lucide-react";

export default function PdfToExcelEducationalContent() {
  return (
    <section className="space-y-12 text-slate-700 leading-relaxed text-base max-w-4xl mx-auto">
      {/* Direct Overview */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <FileSpreadsheet className="text-emerald-600" size={24} />
          Convert PDF to Excel Online for Free
        </h2>
        <p className="text-slate-600">
          SnapFreeTools PDF to Excel Converter is a free, privacy-first online tool that extracts structured tables, financial reports, invoices, and bank statements from PDF documents and generates genuine editable Microsoft Excel spreadsheets (<code className="bg-slate-200/70 px-1.5 py-0.5 rounded text-slate-800 text-xs font-mono">.xlsx</code>). Everything runs 100% locally in your web browser—your data is never uploaded to any remote server.
        </p>
      </div>

      {/* Convert Scanned PDF to Excel with Free OCR */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Sparkles className="text-emerald-600" size={24} />
          Convert Scanned PDF to Excel with Free OCR
        </h2>
        <p>
          Need to convert a scanned document, receipt, or image-only PDF into Excel? Traditional PDF converters fail on image PDFs because there are no selectable text layers. Our <strong>Free OCR PDF to Excel converter</strong> uses high-speed browser-based Optical Character Recognition (OCR) to detect letters, numbers, and grid alignment directly from scanned pages without requiring any paid subscriptions or API keys.
        </p>
      </div>

      {/* How PDF to Excel OCR Works */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How PDF to Excel OCR Works
        </h2>
        <p>
          Our client-side engine reconstructs tabular data through a multi-step spatial pipeline:
        </p>
        <ol className="list-decimal pl-6 space-y-2 font-medium text-slate-600">
          <li><strong>High-Resolution Rendering:</strong> Scanned PDF pages are rendered off-screen at high resolution to maximize optical clarity.</li>
          <li><strong>Word-Level Bounding Box Detection:</strong> The local OCR worker recognizes words alongside their exact spatial coordinates (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">x0, y0, x1, y1</code>) and confidence scores.</li>
          <li><strong>Row & Column Spatial Clustering:</strong> Word bounding boxes are clustered vertically into rows and aligned horizontally into columns to infer true table boundaries.</li>
          <li><strong>OpenXML Spreadsheet Generation:</strong> Extracted cells are mapped into an authentic Microsoft Excel workbook (<code className="text-xs bg-slate-100 px-1 py-0.5 rounded font-mono">.xlsx</code>) with preserved numbers and formatted text.</li>
        </ol>
      </div>

      {/* How to Convert a Scanned PDF to Excel */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Convert a Scanned PDF to Excel
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">1</span>
            <h3 className="font-extrabold text-sm text-slate-900">Upload & Select Free OCR</h3>
            <p className="text-xs text-slate-500 font-medium">Select your scanned PDF and choose <em>Free OCR</em> in the processing mode options.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">2</span>
            <h3 className="font-extrabold text-sm text-slate-900">Preview Extracted Tables</h3>
            <p className="text-xs text-slate-500 font-medium">Inspect detected tables in the interactive grid, check OCR confidence, and rename sheets.</p>
          </div>
          <div className="p-5 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <span className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 font-black text-xs flex items-center justify-center">3</span>
            <h3 className="font-extrabold text-sm text-slate-900">Download .XLSX</h3>
            <p className="text-xs text-slate-500 font-medium">Click <em>Generate Excel Workbook</em> to download your editable spreadsheet instantly.</p>
          </div>
        </div>
      </div>

      {/* PDF to Excel Without OCR vs Free OCR */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          PDF to Excel Without OCR vs Free OCR
        </h2>
        <div className="border border-slate-200/80 rounded-2xl overflow-x-auto">
          <table className="w-full text-left text-xs font-semibold">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-800">
              <tr>
                <th className="p-3">Feature</th>
                <th className="p-3">Standard Mode (No OCR)</th>
                <th className="p-3">Free OCR Mode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-bold text-slate-900">Best For</td>
                <td className="p-3 text-slate-600">Digital PDFs with selectable text (QuickBooks, SAP, Sheets)</td>
                <td className="p-3 text-slate-600">Scanned documents, photos, receipts, paper records</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Processing Speed</td>
                <td className="p-3 text-slate-600">Near-instant (under 2 seconds)</td>
                <td className="p-3 text-slate-600">A few seconds per page (high-accuracy OCR)</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Accuracy</td>
                <td className="p-3 text-slate-600">100% digital character precision</td>
                <td className="p-3 text-slate-600">Optical character estimation based on scan quality</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-slate-900">Privacy</td>
                <td className="p-3 text-emerald-700 font-bold">100% Client-Side In Browser</td>
                <td className="p-3 text-emerald-700 font-bold">100% Client-Side In Browser</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Extract Tables from Scanned PDFs */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Extract Tables from Scanned PDFs
        </h2>
        <p>
          When dealing with multi-page documents containing mixed pages (some with digital text and others with scanned images), our converter automatically handles both. Digital pages are parsed with vector precision, while scanned pages are processed through OCR bounding-box detection, providing a seamless multi-sheet Excel file.
        </p>
      </div>

      {/* Is the PDF OCR Really Free? & Does OCR Upload My PDF? */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
          <h3 className="font-extrabold text-emerald-900 flex items-center gap-2 text-sm">
            <CheckCircle2 size={18} className="text-emerald-600" />
            Is the PDF OCR Really Free?
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed font-medium">
            Yes, 100% free. There are no hidden fees, page limits, paywalls, or credit card requirements. We use open-source WebAssembly technology that runs directly on your computer's CPU.
          </p>
        </div>
        <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 space-y-2">
          <h3 className="font-extrabold text-emerald-900 flex items-center gap-2 text-sm">
            <ShieldCheck size={18} className="text-emerald-600" />
            Does OCR Upload My PDF?
          </h3>
          <p className="text-xs text-emerald-800 leading-relaxed font-medium">
            No. Unlike other converter tools, your PDF files, financial tables, and scanned pages are never sent to external cloud servers. All OCR computations happen locally in your browser memory.
          </p>
        </div>
      </div>

      {/* How Accurate Is Scanned PDF to Excel Conversion? & Why You Should Review OCR Results */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How Accurate Is Scanned PDF to Excel Conversion?
        </h2>
        <p>
          OCR accuracy depends directly on scan resolution, lighting, contrast, and font clarity. High-resolution (300 DPI) printed documents typically yield over 90% accuracy.
        </p>
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs font-semibold">
          <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
          <div>
            <h3 className="font-extrabold text-sm text-amber-950">Why You Should Review OCR Results</h3>
            <p className="mt-0.5 leading-relaxed text-amber-800 font-medium">
              Because OCR involves optical character estimation, characters like 0 (zero) vs O (letter O), or 1 (one) vs l (lowercase L) can occasionally be misread if document quality is low. Always review extracted formulas, sums, and numbers before making critical financial decisions.
            </p>
          </div>
        </div>
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
