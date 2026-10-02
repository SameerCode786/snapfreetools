"use client";

import React from "react";
import { FileCheck, ShieldCheck, Zap, Layers, CheckCircle, Cpu } from "lucide-react";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export default function ExtractPdfEducationalContent({ faqs = [] }) {
  const specs = [
    { label: "Operation Type", value: "PDF Page Extraction & Subset Creation" },
    { label: "Input Format", value: "PDF (.pdf)" },
    { label: "Output Format", value: "PDF (.pdf)" },
    { label: "Selection Methods", value: "Visual Grid Click + Custom Range Input (e.g. 1-5, 8)" },
    { label: "Processing Model", value: "100% Client-Side WebAssembly & JS" },
    { label: "Vector Quality", value: "100% Preserved (Zero Rasterization)" },
    { label: "Max File Size Supported", value: "100 MB" },
    { label: "Account Requirement", value: "None (Free & Unlimited)" },
    { label: "Watermarks Added", value: "None" }
  ];

  return (
    <div className="space-y-16 max-w-4xl mx-auto text-slate-700 leading-relaxed text-sm">
      
      {/* 1. Educational Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          What is PDF Page Extraction?
        </h2>
        <p>
          PDF page extraction is the process of selecting specific pages or page ranges from an existing PDF document and saving them as a brand-new, standalone PDF file ($1, 2, 3, 4, 5 \rightarrow 2, 4$). Whether you need a single page from a 100-page report, specific chapters from an eBook, or relevant receipts from an expense bundle, extracting pages allows you to share exactly what is needed without sending unnecessary data.
        </p>
        <p>
          SnapFreeTools performs page extraction natively by copying object streams directly inside your browser memory. This guarantees that all original vector text remains selectable, images maintain crisp resolution, and document formatting stays 100% intact with zero quality loss or rasterization.
        </p>
      </section>

      {/* 2. Step-by-Step Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Extract Pages from a PDF in 3 Easy Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-black text-slate-900 text-sm">Upload Your PDF</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Drag and drop your PDF file into the secure upload area or click to browse from your device.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-black text-slate-900 text-sm">Select Target Pages</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Click thumbnail cards or type custom page ranges (e.g., <code className="bg-slate-200/60 px-1 rounded">1-5, 8, 12</code>) to select pages.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-black text-slate-900 text-sm">Download Extracted PDF</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Click "Extract PDF" to generate and download your custom PDF file instantly with zero watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Key Features & Selection Capabilities */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Flexible Page Selection Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <Layers size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Non-Consecutive Page Selection</h4>
              <p className="text-xs text-slate-500 font-medium">Extract arbitrary page combinations like pages 2, 5, 9, and 14 into a single file.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <FileCheck size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Custom Range Parsing</h4>
              <p className="text-xs text-slate-500 font-medium">Type range expressions such as <code className="bg-slate-100 px-1 rounded">1-10, 15, 20-25</code> to select large document subsets in seconds.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Instant Quick Actions</h4>
              <p className="text-xs text-slate-500 font-medium">One-click Select All, Clear Selection, and Invert Selection tools for rapid workflow.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <ShieldCheck size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">100% In-Browser Privacy</h4>
              <p className="text-xs text-slate-500 font-medium">Your PDF files are never uploaded to any remote server or external cloud storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Specifications Table */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Quick Tool Specifications
        </h2>
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <tbody className="divide-y divide-slate-200/60">
              {specs.map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white/60" : "bg-slate-50/60"}>
                  <td className="py-3 px-5 font-bold text-slate-600 w-1/2">{item.label}</td>
                  <td className="py-3 px-5 font-extrabold text-slate-900 w-1/2">{item.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. FAQs Section */}
      {faqs && faqs.length > 0 && (
        <section className="pt-6 border-t border-slate-100">
          <FAQSection faqs={faqs} title="Frequently Asked Questions" />
        </section>
      )}

    </div>
  );
}
