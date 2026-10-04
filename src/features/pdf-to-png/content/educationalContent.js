"use client";

import React from "react";
import Link from "next/link";
import {
  FileImage,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Layers,
  Smartphone,
  Download,
  Sliders,
  Archive,
  Image as ImageIcon
} from "lucide-react";

export default function PdfToPngEducationalContent() {
  const steps = [
    {
      num: "01",
      title: "1. Upload Your PDF",
      desc: "Drag and drop your PDF file into the dropzone or select a document from your computer, phone, or tablet."
    },
    {
      num: "02",
      title: "2. Choose Resolution & Pages",
      desc: "Select 72 DPI (Web), 150 DPI (High Quality), or 300 DPI (Print Quality), and specify all pages or custom page ranges."
    },
    {
      num: "03",
      title: "3. Export & Download PNG",
      desc: "Click Convert PDF to PNG to generate high-resolution PNG images. Download individual pages or all images in a ZIP file."
    }
  ];

  const featuresList = [
    {
      icon: Sliders,
      title: "Configurable DPI Resolution",
      desc: "Choose between 72 DPI, 150 DPI, or 300 DPI to control output image pixel density, file size, and text sharpness."
    },
    {
      icon: Archive,
      title: "Batch ZIP Download",
      desc: "Download all converted PNG page images in a single compressed ZIP archive with predictable filenames."
    },
    {
      icon: Layers,
      title: "Custom Page Selection",
      desc: "Convert all pages or enter specific page numbers and ranges (e.g., 1-3, 5) to export only the pages you need."
    },
    {
      icon: ShieldCheck,
      title: "100% Private Client-Side",
      desc: "Files are rendered locally in your browser memory using PDF.js and HTML5 Canvas. Zero server uploads."
    },
    {
      icon: Sparkles,
      title: "Lossless Graphic Clarity",
      desc: "PNG format delivers sharp typography, fine lines, diagrams, and illustrations without JPEG compression artifacts."
    }
  ];

  const relatedTools = [
    {
      href: "/pdf-to-jpg",
      title: "PDF to JPG Converter",
      desc: "Convert PDF pages into JPG images for photos and smaller file sizes."
    },
    {
      href: "/pdf-to-text",
      title: "PDF to Text Extractor",
      desc: "Extract plain text (.txt) from PDF files instantly in your browser."
    },
    {
      href: "/pdf-to-word",
      title: "PDF to Word Converter",
      desc: "Convert PDF documents into editable Microsoft Word (.docx) files."
    },
    {
      href: "/extract-pdf-images",
      title: "Extract PDF Images",
      desc: "Extract embedded photos and illustrations from PDF files."
    },
    {
      href: "/pdf-page-sorter",
      title: "PDF Page Sorter",
      desc: "Visually drag, drop, and rearrange PDF page order online."
    },
    {
      href: "/organize-pdf",
      title: "Organize PDF Pages",
      desc: "Sort, swap, and organize page thumbnails in PDF files."
    },
    {
      href: "/compress-pdf",
      title: "Compress PDF Size",
      desc: "Reduce PDF document file size while preserving readability."
    }
  ];

  return (
    <div className="space-y-16 text-slate-700 leading-relaxed max-w-5xl mx-auto">
      {/* H2 Section: How to Convert PDF to PNG Online */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Convert PDF to PNG Online
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Convert your PDF pages into high-quality PNG images in 3 simple steps directly inside your web browser.
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

      {/* H2 Section: Why Choose PNG for PDF Page Extraction? */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Why Choose PNG for PDF Page Extraction?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <p className="text-slate-600 leading-relaxed">
            Portable Network Graphics (PNG) is a lossless image format. Unlike lossy formats like JPG, PNG preserves crisp text edges, sharp vector diagrams, logos, and technical blueprints without introducing blurry compression noise around letters.
          </p>
          <p className="text-slate-600 leading-relaxed">
            SnapFreeTools PDF to PNG Converter processes your document pages locally in your browser memory using HTML5 Canvas rendering. You can export 300 DPI high-resolution PNGs for desktop publishing, web presentations, or design mockups without uploading files to servers.
          </p>
        </div>
      </section>

      {/* H2 Section: Key Features */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            PDF to PNG Converter Features
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Flexible resolution settings, batch ZIP packaging, and custom page range selection.
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

      {/* H2 Sections: Technical Specifications & Security */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            Configurable DPI Scaling
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Select 72 DPI for web use, 150 DPI for balanced quality and file size, or 300 DPI for high-resolution print graphics. Render canvas areas are automatically capped at 12 Megapixels to ensure memory stability.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            100% In-Browser Privacy
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your PDF is processed locally inside your web browser. File bytes are never sent to external servers or cloud storage.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            Batch ZIP Packaging
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Multi-page PDF conversions automatically generate a clean ZIP archive containing all PNG images with standardized filenames (`document-page-001.png`).
          </p>
        </div>
      </section>

      {/* H2 Section: Mobile Support */}
      <section className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Convert PDF to PNG on Mobile Devices
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Convert documents on iPhones, Android phones, iPads, and tablets.
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The converter is fully optimized for mobile browsers, providing responsive dropzones, quality toggles, and single-tap image downloads directly to your device storage.
        </p>
      </section>

      {/* Internal Linking Section to Related PDF & Image Tools */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-extrabold text-slate-800">
            Explore Related PDF & Image Tools
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
