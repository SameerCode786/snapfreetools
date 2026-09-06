import React from "react";
import { Shield, Zap, FileDown, Layers, Sparkles, CheckCircle2, Lock, Cpu, Info, FileText } from "lucide-react";

export const COMPRESS_PDF_EDUCATIONAL_CONTENT = (
  <div className="space-y-12">
    {/* Intro Overview Grid */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <Zap size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">Instant Client-Side Processing</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Compress PDF documents directly in your browser. Calculations run using client WebAssembly and JavaScript engines without uploading files.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <FileText size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">Preserve Text & Vector Fidelity</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Our structural compression algorithm reorganizes object streams without rasterizing document pages. Text remains 100% selectable and crisp.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-sm">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Lock size={20} />
        </div>
        <h3 className="font-extrabold text-slate-900 text-base">Strict Privacy Guarantee</h3>
        <p className="text-xs text-slate-600 leading-relaxed font-semibold">
          Your confidential documents, contracts, and financial reports never leave your device. No cloud storage, no server logging, zero data risk.
        </p>
      </div>
    </div>

    {/* Educational Deep Dive Sections */}
    <div className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs">
      <div className="space-y-3">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
          Comprehensive Guide
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Understanding Online PDF Compression
        </h2>
        <p className="text-xs text-slate-500 font-semibold leading-relaxed">
          Learn how PDF file sizes are calculated, what makes documents large, and how browser-side optimization works.
        </p>
      </div>

      <div className="space-y-6 text-xs text-slate-700 leading-relaxed font-medium">
        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Layers size={16} className="text-amber-500" />
            1. What Makes PDF Files Large?
          </h3>
          <p>
            PDF documents accumulate size from multiple elements, including high-resolution raster images, embedded font subsets, uncompressed metadata objects, and redundant cross-reference tables. When a document is created or scanned, it often contains uncompressed streams that inflate the overall file footprint.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Cpu size={16} className="text-amber-500" />
            2. How Structural PDF Optimization Works
          </h3>
          <p>
            Rather than converting entire pages into flat image files, our structural compression engine parses the PDF object hierarchy. It packs indirect objects into Flate-compressed object streams, removes orphaned metadata, and flattens cross-reference tables. This approach reduces byte counts while preserving selectable text, vector graphics, and original layout geometry.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <CheckCircle2 size={16} className="text-amber-500" />
            3. Why Some PDFs Cannot Be Compressed Further
          </h3>
          <p>
            PDF files that have already been optimized by software like Adobe Acrobat or ghostscript already use maximum stream compression. If a PDF contains pre-compressed vector paths or low-resolution compressed images, running additional compression will not yield a smaller output. In such cases, SnapFreeTools detects this gracefully and provides the original file.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Shield size={16} className="text-amber-500" />
            4. Privacy & Client-Side Security
          </h3>
          <p>
            Traditional online PDF tools upload your sensitive documents to remote cloud servers for processing. SnapFreeTools operates entirely inside your local web browser tab. Your files remain on your computer or mobile device at all times.
          </p>
        </div>
      </div>
    </div>
  </div>
);
