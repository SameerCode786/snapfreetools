"use client";

import React from "react";
import Link from "next/link";
import {
  Pencil,
  Highlighter,
  Square,
  Type,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileText,
  Layers,
  Sparkles,
  MousePointer,
  ArrowRight,
  Eraser,
  Smartphone,
  Check,
  RotateCw,
  Trash2,
  Image as ImageIcon
} from "lucide-react";

export default function DrawPdfEducationalContent() {
  const steps = [
    {
      num: "01",
      title: "1. Upload Your PDF",
      desc: "Drag and drop your PDF document into the browser dropzone or select a file from your device."
    },
    {
      num: "02",
      title: "2. Draw, Highlight & Annotate",
      desc: "Choose a tool (Pen, Highlighter, Line, Arrow, Rectangle, Circle, or Text) to draw freehand, sketch shapes, or write notes."
    },
    {
      num: "03",
      title: "3. Export & Download PDF",
      desc: "Click Export PDF to compile your vector annotations into a new PDF document and download it instantly."
    }
  ];

  const toolsList = [
    {
      icon: Pencil,
      title: "Freehand Pen Tool",
      desc: "Draw freehand sketches, write handwritten notes, or add custom marks using smooth bezier curve rendering."
    },
    {
      icon: Highlighter,
      title: "Highlighter Tool",
      desc: "Mark important sentences and key passages with vibrant, semi-transparent strokes that keep underlying text readable."
    },
    {
      icon: Eraser,
      title: "Object Eraser & Undo/Redo",
      desc: "Target individual drawn annotations with the eraser or step backward and forward through your edit history."
    },
    {
      icon: Square,
      title: "Lines, Arrows & Shapes",
      desc: "Insert precise vector shapes including straight lines, directional arrows, rectangles, and circles with custom stroke colors."
    },
    {
      icon: Type,
      title: "Text Annotations",
      desc: "Click anywhere on any page to type multi-line text notes, comments, and labels with adjustable font sizes."
    }
  ];

  const relatedTools = [
    {
      href: "/sign-pdf",
      title: "Sign PDF Online",
      desc: "Add electronic signatures, initials, and date stamps to PDF pages."
    },
    {
      href: "/watermark-pdf",
      title: "Watermark PDF",
      desc: "Stamp text or image watermarks onto PDF pages with custom opacity."
    },
    {
      href: "/fill-pdf-forms",
      title: "Fill PDF Forms",
      desc: "Complete fillable form fields, checkboxes, and text inputs online."
    },
    {
      href: "/organize-pdf",
      title: "Organize PDF Pages",
      desc: "Visually reorder, sort, swap, and rearrange PDF page thumbnails."
    },
    {
      href: "/delete-pdf-pages",
      title: "Delete PDF Pages",
      desc: "Remove unwanted or blank pages from your PDF document instantly."
    },
    {
      href: "/rotate-pdf",
      title: "Rotate PDF Pages",
      desc: "Rotate individual pages or entire documents 90, 180, or 270 degrees."
    },
    {
      href: "/extract-pdf-pages",
      title: "Extract PDF Pages",
      desc: "Separate specific page ranges or single pages into a new PDF."
    }
  ];

  return (
    <div className="space-y-16 text-slate-700 leading-relaxed max-w-5xl mx-auto">
      {/* H2 Section: How to Draw on a PDF Online */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Draw on a PDF Online
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Annotate your PDF documents in 3 simple steps directly inside your web browser.
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

      {/* H2 Section: Why Draw on a PDF? */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-10 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900">
          Why Draw on a PDF Online?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <p className="text-slate-600 leading-relaxed">
            Drawing directly on PDF documents is essential for reviewing contracts, grading assignments, taking lecture notes, diagramming ideas, and highlighting key information. Traditional workflows often required printing documents, marking them with physical pens, and scanning them back into digital format.
          </p>
          <p className="text-slate-600 leading-relaxed">
            SnapFreeTools Draw on PDF eliminates printing and paper waste by providing a fast, web-based annotation workspace. You can draw freehand, sketch vector shapes, highlight text passages, and add typed notes directly inside your browser without installing heavy software suites or creating paid subscriptions.
          </p>
        </div>
      </section>

      {/* H2 Section: Drawing Tools Available */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Supported PDF Annotation & Drawing Tools
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto">
            Choose from a complete suite of precision drawing, highlighting, and shape tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {toolsList.map((item) => {
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

      {/* H2 Sections: How PDF Annotation Works, Is My PDF Uploaded?, Does Drawing Affect Quality? */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-amber-500" />
            Vector Drawing & Page Navigation
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Our editor features full page navigation, zoom controls, and thumbnail browsing for multi-page documents. On export, vector annotations are mapped into PDF coordinate space and embedded as native PDF graphics streams.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-600" />
            100% Private Client-Side Processing
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>No server uploads.</strong> Your PDF documents are processed entirely inside your web browser. File parsing, thumbnail rendering, drawing interaction, and output export take place locally on your device.
          </p>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 space-y-3 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles size={18} className="text-purple-600" />
            Zero Resolution or Quality Loss
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Original PDF untouched.</strong> SnapFreeTools embeds your drawings as native vector objects. Original selectable text, embedded fonts, vector artwork, photos, and page resolution remain 100% intact.
          </p>
        </div>
      </section>

      {/* H2 Section: Draw on PDF on Mobile and Touch Devices */}
      <section className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
            <Smartphone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Draw on PDF on Mobile & Touchscreen Devices
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Annotate documents on iPhones, Android devices, iPads, and touchscreen laptops.
            </p>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The drawing canvas supports HTML5 Pointer Events and touch input on mobile devices and tablets, allowing fluid drawing with finger touches or digital styluses like Apple Pencil and Surface Pen. Smart event handlers prevent screen scrolling while actively sketching on page surfaces.
        </p>
      </section>

      {/* Internal Linking Section to Complementary PDF Tools */}
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

