"use client";

import React from "react";
import Link from "next/link";
import {
  Scaling,
  Maximize2,
  ShieldCheck,
  FileCheck,
  Sliders,
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function ResizePdfEducationalContent() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8 border-t border-slate-200/80">
      {/* Privacy Guarantee Reassurance Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <ShieldCheck size={18} />
            <span>100% Private Client-Side Processing</span>
          </div>
          <h3 className="text-xl font-black">
            Your PDF Files Remain Completely Private
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            SnapFreeTools processes PDF page resizing locally in your web browser memory using JavaScript. Your PDF file contents are never uploaded to our servers, API endpoints, or third-party cloud services.
          </p>
        </div>
      </div>

      {/* AEO Section: How to Resize PDF Pages */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <FileCheck className="text-amber-500" size={24} />
            <span>How to Resize PDF Pages Online</span>
          </h2>
          <p className="text-sm font-semibold text-slate-600">
            Follow these quick steps to convert PDF paper sizes or apply custom dimensions:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            {
              step: "01",
              title: "Upload PDF File",
              desc: "Select or drag & drop your PDF file into the dropzone. The tool parses document metadata instantly."
            },
            {
              step: "02",
              title: "Select Target Size",
              desc: "Choose a standard preset (A4, Letter, Legal, A3, etc.) or enter custom dimensions in mm, inches, or pt."
            },
            {
              step: "03",
              title: "Choose Orientation",
              desc: "Select Portrait or Landscape mode to automatically adjust target width and height."
            },
            {
              step: "04",
              title: "Choose Content Mode",
              desc: "Select Fit Content to lock aspect ratio, Keep Content Size to preserve 1:1 scale, or Stretch Content."
            },
            {
              step: "05",
              title: "Select Target Pages",
              desc: "Apply page resizing to all pages or enter a custom page range (such as 1-3, 5)."
            },
            {
              step: "06",
              title: "Resize & Download",
              desc: "Click Resize PDF to transform pages and download your resized PDF document immediately."
            }
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-2 hover:border-amber-300 transition-all shadow-2xs"
            >
              <div className="text-amber-500 font-black text-xs uppercase tracking-wider">
                Step {item.step}
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Scaling Modes Breakdown */}
      <section className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Maximize2 className="text-amber-500" size={24} />
            <span>Understanding Content Scaling Modes</span>
          </h2>
          <p className="text-sm font-semibold text-slate-600">
            Choose how original text, vector graphics, and images fit onto your target page size:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-black text-slate-900 text-base">Fit Content (Recommended)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Scales original content proportionally to fit inside target page boundaries while strictly preserving aspect ratio. Content is automatically centered with equal margin spacing, avoiding clipping or visual distortion.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-black text-slate-900 text-base">Keep Original Content Size</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Retains original 1:1 content scale and centers it on the new page canvas. Enlarging a page adds clean outer margin whitespace, while reducing page size clips content edges if target dimensions are smaller.
            </p>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-black text-slate-900 text-base">Stretch Content (Fill Page)</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Scales horizontal and vertical dimensions independently to stretch content to every edge of the target page canvas. Useful for full-bleed graphics, but may distort aspect ratios if width-to-height proportions change.
            </p>
          </div>
        </div>
      </section>

      {/* Technical Overview: How PDF Page Resizing Works */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Sliders className="text-amber-500" size={22} />
          <span>How PDF Page Resizing Works Under the Hood</span>
        </h2>
        <div className="space-y-3 text-xs text-slate-600 font-medium leading-relaxed">
          <p>
            PDF pages define physical page boundaries using standard bounding box dictionaries, primarily the <strong className="text-slate-900">MediaBox</strong>. In PDF specifications, page measurements are expressed in PDF Points (where 1 inch = 72 points = 25.4 mm).
          </p>
          <p>
            SnapFreeTools transforms PDF vector pages directly using WebAssembly/JavaScript graphics matrix operations. Instead of converting pages into rasterized images (which causes pixelation and destroys text selection), our engine updates MediaBox coordinates and appends coordinate transformation operators (<code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200 text-slate-900">cm</code>) to current content streams.
          </p>
          <p>
            This vector transformation process ensures that selectable text fonts, line drawings, vector shapes, and embedded photographic images remain at 100% crisp visual resolution.
          </p>
        </div>
      </section>

      {/* Related PDF Tools Internal Navigation */}
      <section className="space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={20} />
          <span>Related Free PDF Tools</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            {
              name: "PDF to PNG",
              href: "/pdf-to-png",
              desc: "Convert PDF pages into high-resolution PNG images."
            },
            {
              name: "Rotate PDF",
              href: "/rotate-pdf",
              desc: "Rotate sideways PDF pages permanently."
            },
            {
              name: "Organize PDF",
              href: "/organize-pdf",
              desc: "Visually reorder and arrange PDF page sequence."
            },
            {
              name: "Compress PDF",
              href: "/compress-pdf",
              desc: "Reduce PDF document file size for easy sharing."
            },
            {
              name: "Delete PDF Pages",
              href: "/delete-pdf-pages",
              desc: "Remove unwanted pages from PDF documents."
            },
            {
              name: "PDF Page Sorter",
              href: "/pdf-page-sorter",
              desc: "Sort PDF pages with interactive drag and drop."
            }
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-amber-400 hover:shadow-xs transition-all flex flex-col justify-between gap-2 group"
            >
              <div>
                <div className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors flex items-center justify-between">
                  <span>{tool.name}</span>
                  <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {tool.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
