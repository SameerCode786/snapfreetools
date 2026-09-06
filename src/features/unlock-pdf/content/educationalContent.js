import React from "react";
import { Shield, Lock, Unlock, Key, CheckCircle2, FileText, Cpu, Info, Award, HelpCircle } from "lucide-react";

export const UNLOCK_PDF_EDUCATIONAL_CONTENT = (
  <div className="space-y-12">
    {/* AI Search & GEO Quick Answer Box */}
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 max-w-4xl mx-auto shadow-2xs">
      <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-sm sm:text-base">
        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
          <HelpCircle size={18} />
        </div>
        <span>AI Search & Quick Answers</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs">What does an Unlock PDF tool do?</h4>
          <p className="leading-relaxed text-slate-600">
            An Unlock PDF tool removes password encryption and editing restrictions from a PDF document when the correct password is provided, exporting a clean, unencrypted file.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs">How does client-side PDF unlocking work?</h4>
          <p className="leading-relaxed text-slate-600">
            Our tool uses WebAssembly and JavaScript PDF engine primitives to verify your password locally inside your browser tab and save a new PDF file without encryption streams.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs">Are my files or passwords uploaded?</h4>
          <p className="leading-relaxed text-slate-600">
            No. Processing happens 100% locally in your web browser. Your PDF files and passwords never leave your device or get transmitted to any remote server.
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-1.5 shadow-2xs">
          <h4 className="font-extrabold text-slate-900 text-xs">Can it crack unknown passwords?</h4>
          <p className="leading-relaxed text-slate-600">
            No. This tool is designed for authorized document owners who know their PDF password and want to permanently remove password prompts for daily editing.
          </p>
        </div>
      </div>
    </div>

    {/* Feature Overview Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Unlock size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">Permanent Password Removal</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Export clean PDF files that open seamlessly on any computer, mobile device, or PDF viewer without requiring repeated password entries.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Shield size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">Local Browser Security</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Your confidential financial statements, legal contracts, and personal records remain 100% private. Files and passwords are never logged or stored.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <FileText size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">100% Quality & Layout Intact</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          All document content, fonts, images, pages, selectable text, and vector graphics are preserved without re-encoding or quality degradation.
        </p>
      </div>
    </div>

    {/* Detailed How-To & Guide Section */}
    <div className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
          Comprehensive Guide
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Remove PDF Password Protection Online
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Follow these simple steps to remove password security from your PDF documents.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 pt-2">
        <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Step 1</span>
          <h4 className="font-extrabold text-slate-900 text-xs">Upload Document</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Drag and drop your password-protected PDF into the upload area or browse from your device.
          </p>
        </div>

        <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Step 2</span>
          <h4 className="font-extrabold text-slate-900 text-xs">Enter Password</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Type the authorized password into the secure password field and click Unlock PDF.
          </p>
        </div>

        <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Step 3</span>
          <h4 className="font-extrabold text-slate-900 text-xs">Local Decryption</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Our engine verifies the password and strips document encryption streams in real time.
          </p>
        </div>

        <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
          <span className="text-xs font-black text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md">Step 4</span>
          <h4 className="font-extrabold text-slate-900 text-xs">Download File</h4>
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
            Download your unlocked PDF file for instant viewing, editing, printing, and sharing.
          </p>
        </div>
      </div>
    </div>
  </div>
);
