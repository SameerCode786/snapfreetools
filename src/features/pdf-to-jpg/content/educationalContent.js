import React from "react";
import Link from "next/link";
import { FileImage, FileText, ShieldCheck, Cpu, Star, Layers, HelpCircle, ArrowRight } from "lucide-react";

export function EDUCATIONAL_CONTENT() {
  return (
    <div className="space-y-16 border-t border-slate-100 pt-12">
      
      {/* 1. How to Convert PDF to JPG */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">How to Convert PDF to JPG</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">1</div>
            <h3 className="font-bold text-slate-800 text-sm">Upload PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Drag and drop your PDF file or click to choose from your device.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">2</div>
            <h3 className="font-bold text-slate-800 text-sm">Select Pages & Settings</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Choose specific pages, set custom page ranges, or convert all pages. Adjust quality or DPI.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">3</div>
            <h3 className="font-bold text-slate-800 text-sm">Convert instantly</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Click 'Convert to JPG'. The rendering processor extracts images directly inside your browser.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">4</div>
            <h3 className="font-bold text-slate-800 text-sm">Download JPGs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Download JPG pages individually, or download all pages zipped together in one click.</p>
          </div>
        </div>
      </section>

      {/* 2. What is a PDF to JPG Converter? */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <FileImage className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">What is a PDF to JPG Converter?</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          A PDF to JPG Converter is a utility designed to translate the vector layout pages of a PDF document into static raster image files (JPEG format). This allows you to extract visual graphics, charts, and text pages from a PDF to view, share, or embed them as standard images without requiring PDF reader applications.
        </p>
      </section>

      {/* 3. PDF to JPG Features */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Star className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Key Features</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">100% Free & Limitless</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Convert as many files as you need without hidden subscriptions, registrations, or watermarks.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">Flexible Page Selection</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Select all pages, specify numeric ranges (e.g. 2-5), or check individual thumbnail pages manually.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">Quality & DPI Scaling</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Configure output image resolutions (72 DPI, 150 DPI, 300 DPI) and JPEG compression thresholds.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">Local Browser Processing</h4>
            <p className="text-xs text-slate-500 leading-relaxed">File parsing and layout rendering occur entirely client-side. No files are uploaded to our servers.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">Bulk Packaging (ZIP)</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Instantly compile all extracted pages into a single high-speed zipped package download.</p>
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-850 text-sm">Responsive Mobile Preview</h4>
            <p className="text-xs text-slate-500 leading-relaxed">Review layout ratios, dimensions, and image file sizes directly on desktops, tablets, and phones.</p>
          </div>
        </div>
      </section>

      {/* 4. JPG Quality / DPI Guide */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">JPG Quality & DPI Guide</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          DPI (Dots Per Inch) determines how many pixels are rendered per PDF point. Choosing the right resolution optimizes text sharpness and keeps download sizes minimal:
        </p>
        <ul className="list-disc pl-5 text-slate-600 text-xs space-y-2">
          <li><strong>72 DPI (Standard Quality)</strong>: Best for web sharing, fast previews, and keeping file sizes very small. Matches the default 1x scale of PDF page structures.</li>
          <li><strong>150 DPI (High Quality)</strong>: Standard for everyday reading, presentations, and general document sharing. Delivers a clean balance of sharpness and file size.</li>
          <li><strong>300 DPI (Maximum Quality)</strong>: Essential for high-resolution prints, scanning fine text, and maximum readability. Renders details crisp, but produces larger image sizes.</li>
        </ul>
      </section>

      {/* 5. PDF to JPG vs PDF to PNG */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">PDF to JPG vs PDF to PNG</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          While PNG format is better for transparent backgrounds and lossless vector shapes, <strong>JPG is preferred for general documents</strong>. JPG utilizes lossy compression algorithms to achieve dramatically smaller file sizes while preserving readable text and photographic colors, making it much easier to email, upload, and embed.
        </p>
      </section>

      {/* 6. Privacy & Security */}
      <section className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="text-amber-500" size={20} />
          <h2 className="text-xl font-extrabold text-slate-800">Privacy & Security</h2>
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          At SnapFreeTools, we prioritize your security. This PDF to JPG Converter is built on a <strong>100% client-side rendering architecture</strong>. When you select a PDF, the file is read as local binary data in your browser and processed using WebAssembly. Your documents are never uploaded to our servers, keeping your files safe on your local machine.
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
            <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
              <FileImage size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                JPG to PDF
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Combine JPG or PNG images into a PDF file.
              </p>
            </div>
          </Link>
          <Link
            href="/pdf-to-word"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
              <FileImage size={18} />
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
          <Link
            href="/pdf-to-text"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
              <FileText size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                PDF to Text
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Extract plain text (.txt) from PDF files online.
              </p>
            </div>
          </Link>
          <Link
            href="/image-compressor"
            className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
              <FileImage size={18} />
            </div>
            <div className="space-y-1 py-0.5 min-w-0 flex-1">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors truncate">
                Image Compressor
              </h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed truncate">
                Compress JPG, PNG and WebP images.
              </p>
            </div>
          </Link>
        </div>
      </section>

    </div>
  );
}
