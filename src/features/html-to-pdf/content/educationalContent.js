import React from "react";
import Link from "next/link";
import { Info, Shield, Zap, Sliders, AlertTriangle } from "lucide-react";

export default function EducationalContent() {
  return (
    <div className="space-y-12">
      {/* H2: What is HTML to PDF conversion? */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          What is HTML to PDF conversion?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          HTML to PDF conversion is the process of rendering structured HTML web documents, CSS stylesheets, and public web page URLs into a standardized PDF document format. Converting HTML into PDF ensures consistent formatting across desktop and mobile devices, preserves printable page layouts, and enables offline document distribution.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          SnapFreeTools provides an online HTML to PDF converter supporting three input modes: converting live public website URLs, pasting raw HTML markup directly, or uploading local <code className="bg-slate-100 text-amber-800 px-1.5 py-0.5 rounded text-[11px] font-mono">.html</code> files.
        </p>
      </section>

      {/* H2: How to convert a webpage to PDF */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          How to convert a webpage URL to PDF
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          To convert a live website URL into a PDF document, follow these four simple steps:
        </p>
        <ol className="text-xs sm:text-sm text-slate-600 space-y-2 list-decimal pl-5 leading-relaxed font-medium">
          <li>Select the <strong>Website URL</strong> tab in the converter panel.</li>
          <li>Enter the public web page address starting with <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">http://</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">https://</code> (e.g. <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">https://example.com/article</code>).</li>
          <li>Optionally open the <strong>PDF Formatting & Options</strong> accordion to customize page size (A4, Letter), orientation, margins, or background colors.</li>
          <li>Click <strong>Convert HTML to PDF</strong> to render the webpage and download your PDF file.</li>
        </ol>
      </section>

      {/* H2: How to convert HTML code or uploaded files to PDF */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
          How to convert HTML code or HTML files to PDF
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          If you have raw HTML markup or an HTML file saved on your computer, you can convert it without entering a web URL:
        </p>
        <ul className="text-xs sm:text-sm text-slate-600 space-y-2 list-disc pl-5 leading-relaxed">
          <li>
            <strong>Paste HTML Mode:</strong> Click the <em>Paste HTML</em> tab, paste your code into the editor area, adjust formatting options, and convert.
          </li>
          <li>
            <strong>Upload HTML File Mode:</strong> Click the <em>Upload HTML File</em> tab, drag & drop your <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">.html</code> or <code className="bg-slate-100 px-1 py-0.5 rounded text-[11px]">.htm</code> file (up to 10MB), and convert.
          </li>
        </ul>
      </section>

      {/* H2: HTML to PDF formatting options */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <Sliders size={20} className="text-amber-600" />
          HTML to PDF formatting controls & settings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Page Geometry</h3>
            <p className="leading-relaxed">Choose standard paper dimensions including A4, Letter, Legal, and A3 in Portrait or Landscape orientation.</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Margin Controls</h3>
            <p className="leading-relaxed">Set custom Top, Right, Bottom, and Left margin offsets in millimeters, centimeters, inches, or pixels (e.g. <code className="bg-slate-200 px-1 py-0.5 rounded">10mm</code>).</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Media Emulation</h3>
            <p className="leading-relaxed">Switch between <strong>Print CSS Styles</strong> (@media print rules) and <strong>Screen CSS Styles</strong> (as seen in standard browser viewports).</p>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">Backgrounds & Footers</h3>
            <p className="leading-relaxed">Include or omit background graphics and colors, and optionally enable page numbering footers (<code className="bg-slate-200 px-1 py-0.5 rounded">Page X of Y</code>).</p>
          </div>
        </div>
      </section>

      {/* H2: HTML to PDF capabilities & security limitations */}
      <section className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-600" />
          Capabilities & technical security limitations
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          To maintain server security and prevent abuse, our HTML to PDF converter operates within strict technical boundary rules:
        </p>
        <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5 leading-relaxed">
          <li><strong>Restricted Destinations (SSRF Protection):</strong> Requests to local IP addresses (<code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">127.0.0.1</code>), private subnets (<code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">10.0.0.0/8</code>, <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">192.168.0.0/16</code>), and AWS cloud metadata endpoints are strictly blocked.</li>
          <li><strong>JavaScript Policy:</strong> For pasted or uploaded HTML, JavaScript execution is disabled and dangerous script tags are sanitized before rendering.</li>
          <li><strong>Redirect Limit:</strong> Webpage URL mode enforces a strict limit of maximum 3 HTTP redirects per request.</li>
          <li><strong>Supported Files:</strong> Upload mode supports individual <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">.html</code> and <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded">.htm</code> files up to 10MB. ZIP archives with local subfolders are not supported.</li>
        </ul>
      </section>

      {/* H2: Related PDF Management & Conversion Tools */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
          Related PDF conversion & management tools
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Need to process or convert other document formats? Explore our free companion PDF tools:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          <Link
            href="/jpg-to-pdf"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            JPG to PDF
          </Link>
          <Link
            href="/png-to-pdf"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            PNG to PDF
          </Link>
          <Link
            href="/pdf-to-png"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            PDF to PNG
          </Link>
          <Link
            href="/resize-pdf"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            Resize PDF
          </Link>
          <Link
            href="/organize-pdf"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            Organize PDF
          </Link>
          <Link
            href="/compress-pdf"
            className="p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-2xl text-xs font-bold text-slate-800 hover:text-amber-700 transition-colors text-center block"
          >
            Compress PDF
          </Link>
        </div>
      </section>
    </div>
  );
}
