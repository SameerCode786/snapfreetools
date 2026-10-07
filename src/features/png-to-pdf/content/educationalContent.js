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
  Sliders,
  Image as ImageIcon
} from "lucide-react";

export default function PngToPdfEducationalContent() {
  const steps = [
    {
      num: "01",
      title: "1. Upload PNG Images",
      desc: "Drag and drop your PNG images into the dropzone or click to select up to 100 files from your device."
    },
    {
      num: "02",
      title: "2. Arrange Page Order",
      desc: "Reorder thumbnails using drag-and-drop or position buttons to control the exact sequence of pages in your PDF."
    },
    {
      num: "03",
      title: "3. Choose Page Layout",
      desc: "Select paper preset (A4, Letter, Legal, A3, or Original), page orientation, fit mode, and page margins."
    },
    {
      num: "04",
      title: "4. Convert & Download PDF",
      desc: "Click Convert to PDF to generate your document instantly in your browser and save the compiled PDF file."
    }
  ];

  const featuresList = [
    {
      icon: Sliders,
      title: "Standard Paper & Custom Presets",
      desc: "Choose standard paper dimensions like A4, Letter, Legal, and A3, or use Original Image Size for exact DPI matching."
    },
    {
      icon: Layers,
      title: "Multi-Image Batch Conversion",
      desc: "Combine up to 100 PNG images into a single multi-page PDF document in a single execution step."
    },
    {
      icon: ShieldCheck,
      title: "Private In-Browser Processing",
      desc: "Your PNG images are processed locally using client-side JavaScript and PDF rendering libraries. Files are never uploaded to servers."
    },
    {
      icon: Sparkles,
      title: "Clean Background Compositing",
      desc: "Transparent PNG pixels are automatically composited over a clean white (#FFFFFF) background for professional document rendering."
    }
  ];

  const relatedTools = [
    {
      href: "/jpg-to-pdf",
      title: "JPG to PDF Converter",
      desc: "Convert JPG and JPEG photos into PDF documents online."
    },
    {
      href: "/pdf-to-png",
      title: "PDF to PNG Converter",
      desc: "Convert PDF pages into high-resolution PNG images."
    },
    {
      href: "/resize-pdf",
      title: "Resize PDF Pages",
      desc: "Change PDF page dimensions to A4, Letter, Legal, or custom sizes."
    },
    {
      href: "/organize-pdf",
      title: "Organize PDF Pages",
      desc: "Visually reorder, sort, and rearrange PDF page thumbnails."
    },
    {
      href: "/compress-pdf",
      title: "Compress PDF Size",
      desc: "Reduce PDF document file size while preserving layout clarity."
    }
  ];

  return (
    <div className="space-y-16 text-slate-700 leading-relaxed max-w-5xl mx-auto">
      {/* How to Convert PNG to PDF */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Convert PNG to PDF
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Follow these 4 simple steps to combine one or multiple PNG images into a single structured PDF document.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
            >
              <span className="text-3xl font-black text-amber-500/20 group-hover:text-amber-500/30 transition-colors absolute top-4 right-5">
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

      {/* What Is a PNG to PDF Converter? */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          What Is a PNG to PDF Converter?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <p className="text-slate-600 leading-relaxed">
            PNG (Portable Network Graphics) is a raster image format designed for web graphics, screenshots, and digital images with optional alpha transparency. PDF (Portable Document Format) is a universal document container designed for multi-page printing, archiving, and distribution.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Converting PNG to PDF places each raster PNG image into a structured PDF page frame. This enables multiple individual PNG files to be compiled into a single shareable document. Note: This tool embeds PNG image frames into PDF pages; it does not vectorize raster pixels into scale-independent vector curves.
          </p>
        </div>
      </section>

      {/* Does Converting PNG to PDF Reduce Image Quality? */}
      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Does Converting PNG to PDF Reduce Image Quality?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-800">PNG Lossless Data Preservation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              PNG image bytes are embedded directly into the generated PDF without applying lossy JPEG compression in the standard workflow. Text lines, screenshots, and diagrams retain their pixel clarity.
            </p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
            <h3 className="text-base font-bold text-slate-800">Page Scaling & Layout Options</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Choosing <strong>Fit to Page</strong> or <strong>Fill Page</strong> scales the image visually to fit your selected paper margins. Fill Page mode may clip outer image edges if aspect ratios differ from the target paper size.
            </p>
          </div>
        </div>
      </section>

      {/* How PNG Transparency Is Handled */}
      <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
        <h2 className="text-xl font-extrabold text-slate-900">
          How Transparent PNGs Are Rendered in PDF
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Transparent areas in PNG images (alpha channels) are composited onto a solid white background (<code>#FFFFFF</code>) when the PDF page is generated. The resulting PDF document renders pages with clean white backing rather than preserving alpha transparency.
        </p>
      </section>

      {/* Original Image Size & 96 DPI Page Calculation */}
      <section className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          Original Image Size & 96 DPI Page Calculation
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          When the page size setting is set to <strong>Original Image Size</strong>, page dimensions are calculated using a 96 DPI conversion policy where 1 pixel equals 0.75 PDF points (72 pt / 96 DPI).
        </p>
        <div className="bg-white/80 border border-amber-200 rounded-2xl p-4 text-xs text-slate-700 font-mono">
          Example: A 1200 × 800 px image renders as a 900 × 600 pt page (12.5 × 8.33 inches).
        </div>
        <p className="text-xs text-slate-500 font-medium">
          Note: Images with very high pixel resolutions will produce physically large PDF page dimensions under this policy.
        </p>
      </section>

      {/* Supported File Types & Safety Limits */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supported Files & Conversion Limits
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Client-side safety bounds ensure fast and reliable in-browser PDF creation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-2 text-center shadow-sm">
            <div className="text-2xl font-black text-amber-600">PNG Only</div>
            <p className="text-xs text-slate-500 font-medium">Standard PNG image format (.png)</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-2 text-center shadow-sm">
            <div className="text-2xl font-black text-amber-600">100 Images</div>
            <p className="text-xs text-slate-500 font-medium">Maximum batch limit per PDF</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-2 text-center shadow-sm">
            <div className="text-2xl font-black text-amber-600">50 MB</div>
            <p className="text-xs text-slate-500 font-medium">Maximum file size per image</p>
          </div>
          <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-2 text-center shadow-sm">
            <div className="text-2xl font-black text-amber-600">12 MP</div>
            <p className="text-xs text-slate-500 font-medium">Maximum resolution per PNG</p>
          </div>
        </div>
        <p className="text-xs text-center text-slate-500 font-medium">
          Animated PNGs (APNG) are processed using their first decoded frame.
        </p>
      </section>

      {/* Internal Links Section to Related PDF & Image Tools */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
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
