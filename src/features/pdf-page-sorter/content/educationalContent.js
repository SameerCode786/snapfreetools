"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutList,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  RotateCw,
  Trash2,
  ArrowUpDown,
  Move,
  FileCheck
} from "lucide-react";

export default function PdfPageSorterEducationalContent() {
  const steps = [
    {
      num: "01",
      title: "1. Upload Your PDF",
      desc: "Drag and drop your PDF file into the dropzone or select a document from your computer, phone, or tablet."
    },
    {
      num: "02",
      title: "2. Visually Drag & Sort Pages",
      desc: "Drag thumbnails into your custom page sequence, use move controls, rotate pages, or click Reverse Order."
    },
    {
      num: "03",
      title: "3. Export & Download PDF",
      desc: "Click Export PDF to compile your reordered pages into a fresh PDF file and download it instantly."
    }
  ];

  const featuresList = [
    {
      icon: Move,
      title: "Visual Drag & Drop Grid",
      desc: "Rearrange pages effortlessly using drag-and-drop or directional action buttons on desktop and mobile screens."
    },
    {
      icon: ArrowUpDown,
      title: "1-Click Reverse Order",
      desc: "Instantly flip your document's page sequence from back-to-front with a single click."
    },
    {
      icon: RotateCw,
      title: "Page Rotation & Delete",
      desc: "Fix upside-down pages by rotating them 90, 180, or 270 degrees, or delete unwanted pages before exporting."
    },
    {
      icon: ShieldCheck,
      title: "100% Private Client-Side",
      desc: "Files are processed locally in your browser memory using PDF.js and pdf-lib. Zero server uploads."
    },
    {
      icon: Sparkles,
      title: "Zero Quality Loss",
      desc: "Structural page pointers are updated without re-compressing images or flattening text fonts."
    }
  ];

  const relatedTools = [
    {
      href: "/organize-pdf",
      title: "Organize PDF Pages",
      desc: "Visually reorder, swap, and arrange PDF page thumbnails."
    },
    {
      href: "/reverse-pdf-pages",
      title: "Reverse PDF Pages",
      desc: "Reverse the page order of any PDF document in one click."
    },
    {
      href: "/delete-pdf-pages",
      title: "Delete PDF Pages",
      desc: "Remove blank, duplicate, or unneeded pages from PDF files."
    },
    {
      href: "/rotate-pdf",
      title: "Rotate PDF Pages",
      desc: "Rotate PDF pages permanently by 90, 180, or 270 degrees."
    },
    {
      href: "/extract-pdf-pages",
      title: "Extract PDF Pages",
      desc: "Save specific page ranges as a new standalone PDF document."
    },
    {
      href: "/merge-pdf",
      title: "Merge PDF Files",
      desc: "Combine multiple PDF documents into a single consolidated file."
    },
    {
      href: "/compress-pdf",
      title: "Compress PDF Size",
      desc: "Reduce PDF document file size while preserving quality."
    }
  ];

  return (
    <div className="space-y-16 text-slate-700 leading-relaxed max-w-5xl mx-auto">
      {/* H2 Section: How to Sort PDF Pages Online */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Sort PDF Pages Online
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Reorder and arrange your PDF pages in 3 simple steps directly inside your web browser.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
            >
              <span className="text-4xl font-black text-amber-500/20 group-hover:text-amber-500/30 transition-colors absolute top-4 right-5">
                {step.num}
              </span>
              <div className="space-y-3 relative z-10">
                <h3 className="text-base font-bold text-slate-800">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* H2 Section: Why Use a PDF Page Sorter? */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Why Sort PDF Pages Online?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <p className="text-slate-600 leading-relaxed">
            When scanning paper documents, combining presentations, or drafting contracts, PDF pages often end up out of order. Manually printing pages to organize them by hand is slow and wasteful.
          </p>
          <p className="text-slate-600 leading-relaxed">
            SnapFreeTools PDF Page Sorter provides a fast visual grid where you can drag page thumbnails, shift page order, rotate crooked pages, and download your updated PDF file without installing software.
          </p>
        </div>
      </section>

      {/* H2 Section: Key Features */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supported PDF Sorting Features
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Enjoy full control over your document structure with flexible sorting tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 p-6 bg-white border border-slate-200/80 rounded-3xl shadow-sm hover:border-amber-300 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                  <Icon size={22} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">{item.title}</h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* H2 Sections: Technical Mechanics & Security */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            Structural PDF Page Reordering
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our engine uses <code className="bg-slate-100 px-1 py-0.5 rounded text-amber-700 font-mono">pdf-lib</code> to copy structural page streams into your requested page sequence without recompressing page content.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            100% In-Browser Privacy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your PDF is processed locally inside your web browser. File bytes are never sent to external servers or backend databases.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            Preserves Original Resolution
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Original selectable text, embedded typography, vector illustrations, and high-resolution images remain completely untouched.
          </p>
        </div>
      </section>

      {/* H2 Section: Mobile & Touch Support */}
      <section className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Sort PDF Pages on Mobile & Touch Devices
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Reorder pages on iPhones, Android phones, iPads, and touch laptops.
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The workspace supports HTML5 Pointer Events and touch interactions, letting you drag page cards with a finger or tap directional controls (Move Left, Move Right, Move First, Move Last) seamlessly on any mobile browser.
        </p>
      </section>

      {/* Internal Linking Section to Related PDF Tools */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-extrabold text-slate-800">
            Explore Related PDF Tools
          </h3>
          <Link
            href="/pdf-tools"
            className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
          >
            <span>View all PDF tools</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:border-amber-300 hover:shadow-md transition-all group"
            >
              <h4 className="font-bold text-slate-800 text-xs group-hover:text-amber-600 transition-colors">
                {tool.title}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                {tool.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
