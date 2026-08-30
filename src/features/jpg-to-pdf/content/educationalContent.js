import React from "react";
import Link from "next/link";
import { Image, FileText, Layout, ShieldAlert, Sparkles } from "lucide-react";

export const EDUCATIONAL_CONTENT = () => {
  return (
    <div className="space-y-12">
      {/* Overview Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Image size={24} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">What is a JPG to PDF Converter?</h2>
        </div>
        
        <div className="prose prose-slate max-w-none prose-p:leading-relaxed">
          <p>
            A <strong>JPG to PDF Converter</strong> is an online utility designed to merge, format, and save standard image files (like JPG, JPEG, and PNG) into a single, structured PDF document. Whether you need to compile scan receipts for an expense report, package design mockups for a client, or bind scanned book pages together, converting images into a PDF makes sharing and printing effortless.
          </p>
          <p>
            SnapFreeTools offers a state-of-the-art converter that works completely inside your web browser. There is no server upload, which means your documents are 100% private, and the tool performs with zero lag even with high-resolution images.
          </p>
        </div>
      </section>

      {/* How to Convert */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <h2 className="text-2xl font-black text-slate-900 text-center">How to Convert JPG to PDF Online</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">1</div>
            <h4 className="font-bold text-slate-800 text-sm">Select & Upload</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Drag and drop multiple JPG or PNG images into the converter box, or select them from your local device.
            </p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">2</div>
            <h4 className="font-bold text-slate-800 text-sm">Reorder & Customize</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Drag previews to rearrange pages. Choose page dimensions (A4, Letter, or Fit), adjust orientation, and set margins.
            </p>
          </div>
          <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">3</div>
            <h4 className="font-bold text-slate-800 text-sm">Generate & Download</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Click "Convert to PDF". The tool compiles the images locally and downloads the PDF to your device in seconds.
            </p>
          </div>
        </div>
      </section>

      {/* PDF Page Customization Settings */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
        <h2 className="text-2xl font-black text-slate-900">Customizing Your PDF Layout</h2>
        <p className="text-sm text-slate-600 font-medium leading-relaxed">
          Standard converters often stretch or crop images awkwardly. SnapFreeTools gives you full control over page properties:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-amber-500" />
              <h4 className="font-bold text-slate-800 text-sm">Page Size Settings</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Choose <strong>Fit Image</strong> to make each page exactly match the image size. Alternatively, use standard paper presets like <strong>A4</strong> or <strong>US Letter</strong> for easy printing.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Layout size={18} className="text-amber-500" />
              <h4 className="font-bold text-slate-800 text-sm">Smart Margins</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Add small (10mm) or large (20mm) margins around your images. Margins create clean borders that are ideal for binding documents or adding handwritten notes.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-amber-500" />
              <h4 className="font-bold text-slate-800 text-sm">Page Orientation</h4>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Select Portrait or Landscape layout. Use the <strong>Auto</strong> mode to let the engine evaluate each image and automatically orient pages to prevent stretching.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy and Local Processing */}
      <section className="bg-slate-900 border border-slate-950 rounded-3xl p-8 sm:p-12 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">100% Private Browser-Based Conversion</h3>
          </div>
          <div className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed space-y-4">
            <p>
              Your security is our priority. Most web tools upload your files to external remote servers, leaving digital footprints and risks of data breaches. Our JPG to PDF Converter operates on the client-side inside your browser sandbox.
            </p>
            <p>
              No image is ever uploaded. The PDF is assembled in your device memory. This makes it perfect for business agreements, scanned IDs, medical records, and bank statements.
            </p>
          </div>
        </div>
      </section>

      {/* Internal Linking & Quick Navigation */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Explore Other Document Tools</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { name: "Word to PDF", href: "/word-to-pdf", desc: "Convert Microsoft Word docx files into PDF documents instantly." },
            { name: "PDF to Word", href: "/pdf-to-word", desc: "Convert PDF documents back to editable Microsoft Word files." },
            { name: "Image Compressor", href: "/image-compressor", desc: "Reduce the file size of JPG, PNG, and WebP images local in-browser." },
            { name: "Word Counter", href: "/word-counter", desc: "Analyze characters, word density, and reading time of text." }
          ].map(({ name, href, desc }) => (
            <Link key={href} href={href} className="p-4 bg-white border border-slate-200 hover:border-amber-400 rounded-xl transition-all group block">
              <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                {name} &rarr;
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
