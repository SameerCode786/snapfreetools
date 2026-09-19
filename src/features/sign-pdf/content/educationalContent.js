import React from "react";
import Link from "next/link";
import {
  PenTool,
  ShieldCheck,
  Zap,
  FileCheck,
  CheckCircle2,
  Lock,
  Sparkles,
  HelpCircle,
  Layers,
  Type,
  User,
  Calendar,
  Award,
  FileText
} from "lucide-react";

export default function SignPdfEducationalContent() {
  return (
    <section className="space-y-12 text-slate-700 leading-relaxed text-base max-w-4xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
          <PenTool className="text-emerald-600" size={24} />
          Sign PDF Online Free – Add Electronic Signatures & Form Fields
        </h2>
        <p className="text-slate-600">
          SnapFreeTools Sign PDF is a free, privacy-first online tool that allows you to easily create and place electronic signatures, initials, dates, names, text, and official company stamps onto PDF documents directly in your web browser. The PDF pages are not rasterized; original text, vector graphics, images, and page structure remain intact. Everything runs 100% locally on your device without server uploads.
        </p>
      </div>

      {/* Step by Step How to Sign */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          How to Sign and Fill a PDF Document Online
        </h2>
        <p>
          Signing agreements, contracts, rental forms, or invoices takes just a few clicks without requiring printing or scanning:
        </p>
        <ol className="list-decimal pl-6 space-y-2 font-medium text-slate-600">
          <li><strong>Upload PDF:</strong> Drag and drop your PDF file into the secure workspace.</li>
          <li><strong>Select Fields:</strong> Choose from the field palette to add a Signature, Initials, Name, Date, Custom Text, or Company Stamp.</li>
          <li><strong>Position & Resize:</strong> Drag fields to the exact location on any page, resize using corner handles, or rotate if needed.</li>
          <li><strong>Customize Properties:</strong> Adjust font sizes, ink colors, typography styles, or date formats in the properties panel.</li>
          <li><strong>Download Signed PDF:</strong> Click <em>Sign & Download PDF</em> to receive your signed document instantly.</li>
        </ol>
      </div>

      {/* 6 Supported Form Field Types */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Supported PDF Form Fields
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PenTool size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Signature Field</h3>
            <p className="text-xs text-slate-500 font-medium">
              Draw smoothly, type cursive calligraphy, or upload handwritten signature PNGs with automated whitespace trimming.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Type size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Initials Field</h3>
            <p className="text-xs text-slate-500 font-medium">
              Generate 1–4 letter monogram or calligraphy script initials to sign every page of legal agreements quickly.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <User size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Name Field</h3>
            <p className="text-xs text-slate-500 font-medium">
              Place the signer&apos;s full name with custom font family (Helvetica, Times, Courier), font size, and color.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Date Field</h3>
            <p className="text-xs text-slate-500 font-medium">
              Auto-stamp today&apos;s date or pick a custom date in ISO (YYYY-MM-DD), European (DD/MM/YYYY), or US (MM/DD/YYYY) formats.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Custom Text</h3>
            <p className="text-xs text-slate-500 font-medium">
              Add single or multiline remarks, notes, titles, addresses, or department numbers with automatic word wrapping.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/80 rounded-2xl space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Award size={16} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-900">Company Stamp</h3>
            <p className="text-xs text-slate-500 font-medium">
              Upload official organization seals or company logo stamps with transparent PNG support.
            </p>
          </div>
        </div>
      </div>

      {/* Multi-Page & Precise Placement */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Multi-Page Navigation & Coordinate Accuracy
        </h2>
        <p>
          Need to sign on multiple pages or initial every page? Our visual multi-page navigator lets you switch between pages effortlessly. Every field&apos;s position, width, height, and rotation are mathematically translated from browser screen coordinates to exact PDF vector space, ensuring the downloaded document perfectly reflects your preview.
        </p>
      </div>

      {/* Electronic vs Digital Signatures */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <HelpCircle className="text-emerald-600" size={24} />
          Electronic Signatures vs. Cryptographic Digital Signatures
        </h2>
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 space-y-3 text-xs text-amber-900 font-medium">
          <p className="font-extrabold text-sm text-amber-950">Technical & Product Distinction</p>
          <p>
            <strong>Electronic Signatures (This Tool):</strong> Refers to placing a visual representation of your handwritten, typed, or image signature onto a document. This is widely used for everyday agreements, freelance contracts, internal approvals, permission forms, and invoices.
          </p>
          <p>
            <strong>Cryptographic Digital Signatures (PKI / Certificate-Based):</strong> Uses public-key cryptography and digital certificates issued by a Certificate Authority (CA). SnapFreeTools Sign PDF provides visual electronic signature placement and form filling; it does not issue cryptographic PKI digital certificates or Qualified Electronic Signatures.
          </p>
        </div>
      </div>

      {/* Privacy and Security */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" size={26} />
          100% Client-Side Privacy & Security
        </h2>
        <p>
          Your confidential legal documents, financial contracts, and personal signatures should never be uploaded to third-party cloud servers. SnapFreeTools runs entirely in your browser:
        </p>
        <ul className="list-disc pl-6 space-y-2 font-medium text-slate-600">
          <li>Zero server uploads or remote file storage in Only Me mode</li>
          <li>Your PDF content and signature remain strictly on your device</li>
          <li>No email registration or personal account required</li>
          <li>Works completely offline after initial page load</li>
        </ul>
      </div>

      {/* Related Tools */}
      <div className="pt-6 border-t border-slate-200/80 space-y-4">
        <h3 className="text-lg font-black text-slate-900">Explore Related PDF Tools</h3>
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          <Link href="/protect-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Protect PDF
          </Link>
          <Link href="/unlock-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Unlock PDF
          </Link>
          <Link href="/merge-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Merge PDF
          </Link>
          <Link href="/pdf-to-word" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            PDF to Word
          </Link>
          <Link href="/watermark-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all">
            Watermark PDF
          </Link>
        </div>
      </div>
    </section>
  );
}
