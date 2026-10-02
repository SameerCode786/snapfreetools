"use client";

import React from "react";
import { ArrowUpDown, ShieldCheck, Zap, FileCheck, Layers, Cpu } from "lucide-react";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export default function ReversePdfEducationalContent({ faqs = [] }) {
  const specs = [
    { label: "Operation Type", value: "Page Reversal / Order Inversion" },
    { label: "Input Format", value: "PDF (.pdf)" },
    { label: "Output Format", value: "PDF (.pdf)" },
    { label: "Processing Model", value: "100% Client-Side WebAssembly & JS" },
    { label: "Vector Quality", value: "100% Preserved (Zero Loss)" },
    { label: "Max Supported File Size", value: "100 MB" },
    { label: "Account Requirement", value: "None (Free & Unlimited)" },
    { label: "Watermark", value: "None" }
  ];

  return (
    <div className="space-y-16 max-w-4xl mx-auto text-slate-700 leading-relaxed text-sm">
      
      {/* 1. Educational Overview */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          What Does Reversing PDF Pages Mean?
        </h2>
        <p>
          Reversing a PDF document means inverting its page sequence so that the last page becomes the first, the second-to-last becomes the second, and so forth ($1, 2, 3 \rightarrow 3, 2, 1$). This operation is essential when dealing with documents scanned in reverse order, double-sided printing stacks loaded upside down, or multi-page invoices compiled backwards.
        </p>
        <p>
          Unlike basic online converters that rasterize your pages into low-resolution JPEG images, SnapFreeTools uses direct PDF stream manipulation. This ensures that every line of text remains selectable, fonts stay embedded, and vector graphics preserve crisp sharpness.
        </p>
      </section>

      {/* 2. Step-by-Step Guide */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Reverse PDF Pages Online in 3 Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              1
            </div>
            <h3 className="font-black text-slate-900 text-sm">Upload PDF File</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Drag and drop your PDF file into the upload box or browse from your device.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              2
            </div>
            <h3 className="font-black text-slate-900 text-sm">Click Reverse PDF</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Click the "Reverse PDF" button. The engine reorders your page tree instantly in browser RAM.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 font-black flex items-center justify-center text-base">
              3
            </div>
            <h3 className="font-black text-slate-900 text-sm">Download Reversed PDF</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Save your reordered PDF document with zero quality loss or added watermarks.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Key Use Cases */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Why Reverse the Page Order of a PDF?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <FileCheck size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Fix Reversed Scans</h4>
              <p className="text-xs text-slate-500 font-medium">Correct multi-page documents scanned upside-down or back-to-front.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <Layers size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Prepare Print Queues</h4>
              <p className="text-xs text-slate-500 font-medium">Reorder print jobs for printers that stack pages face-up.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Chronological Sorting</h4>
              <p className="text-xs text-slate-500 font-medium">Invert bank statements or transaction histories from newest-first to oldest-first.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white border border-slate-200 p-4 rounded-2xl">
            <ShieldCheck size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-slate-900 text-xs">Complete Privacy</h4>
              <p className="text-xs text-slate-500 font-medium">Keep sensitive legal, financial, and personal PDFs 100% local on your computer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Technical Quick Specifications */}
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

      {/* 5. FAQs */}
      {faqs && faqs.length > 0 && (
        <section className="pt-6 border-t border-slate-100">
          <FAQSection faqs={faqs} title="Frequently Asked Questions" />
        </section>
      )}

    </div>
  );
}
