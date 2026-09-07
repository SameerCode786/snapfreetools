import React from "react";
import { Lock, Shield, Key, Eye, FileText, CheckCircle2, Award, Zap } from "lucide-react";

export const PROTECT_PDF_EDUCATIONAL_CONTENT = (
  <div className="space-y-12 text-slate-700">
    {/* Section 1: Overview */}
    <section className="space-y-4">
      <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
        <Lock className="text-amber-500 shrink-0" size={28} />
        How to Password Protect PDF Files Online Free
      </h2>
      <p className="text-base text-slate-600 leading-relaxed">
        Protecting confidential documents, bank statements, legal contracts, and personal records is essential. With SnapFreeTools Protect PDF, you can add strong AES-256 password encryption and configure custom permission limits—100% free and completely private in your web browser.
      </p>
    </section>

    {/* Section 2: Step by Step */}
    <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <Zap className="text-amber-500" size={22} />
        Easy Steps to Encrypt a PDF Document
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">1</div>
          <h4 className="font-extrabold text-slate-900 text-sm">Upload PDF</h4>
          <p className="text-slate-500 text-[11px]">Select or drag & drop your PDF file into the browser workspace.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">2</div>
          <h4 className="font-extrabold text-slate-900 text-sm">Set Password</h4>
          <p className="text-slate-500 text-[11px]">Enter a strong opening password and confirm your entry.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">3</div>
          <h4 className="font-extrabold text-slate-900 text-sm">Choose Permissions</h4>
          <p className="text-slate-500 text-[11px]">Optionally restrict printing, text copying, or editing permissions.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">4</div>
          <h4 className="font-extrabold text-slate-900 text-sm">Download PDF</h4>
          <p className="text-slate-500 text-[11px]">Download your verified, password-encrypted PDF file instantly.</p>
        </div>
      </div>
    </section>

    {/* Section 3: Technical Features Grid */}
    <section className="space-y-6">
      <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
        <Shield className="text-amber-500" size={22} />
        Why Choose SnapFreeTools for PDF Protection?
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
        <div className="space-y-2 p-5 bg-white border border-slate-200 rounded-2xl">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
            <Shield size={18} className="text-emerald-600" />
            100% Client-Side Privacy
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Your files and passwords never leave your computer. Encryption is performed locally inside your browser memory.
          </p>
        </div>

        <div className="space-y-2 p-5 bg-white border border-slate-200 rounded-2xl">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
            <Lock size={18} className="text-amber-600" />
            AES-256 Encryption
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Uses ISO 32000-compliant AES 256-bit encryption for bank-grade document security across all PDF readers.
          </p>
        </div>

        <div className="space-y-2 p-5 bg-white border border-slate-200 rounded-2xl">
          <h4 className="font-extrabold text-slate-900 flex items-center gap-2 text-base">
            <Award size={18} className="text-blue-600" />
            Adobe Acrobat Compatible
          </h4>
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            Protected files adhere strictly to PDF specifications and open seamlessly in Adobe Reader, Chrome, Edge, and Preview.
          </p>
        </div>
      </div>
    </section>
  </div>
);
