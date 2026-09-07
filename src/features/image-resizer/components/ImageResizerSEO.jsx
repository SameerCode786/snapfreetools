import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Zap, Sparkles, CheckCircle2, HelpCircle, Scaling, Lock } from "lucide-react";

export default function ImageResizerSEO({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="mt-16 space-y-12 max-w-5xl mx-auto border-t border-slate-200/60 pt-12">
      
      {/* Privacy Guarantee Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-400" />
              100% Client-Side & Private
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Is Image Resizing Private on SnapFreeTools?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Yes, absolutely. All image decoding, scaling, canvas rendering, and format conversions happen locally inside your web browser RAM using HTML5 Canvas API. Your photos are never uploaded to any cloud server or recorded anywhere.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
            <Zap size={24} className="text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-black text-white">Zero Server Upload</div>
              <div className="text-[10px] text-slate-300 font-semibold">Instant Local Canvas Engine</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Educational Copy */}
      <section className="space-y-8 text-slate-700">
        
        {/* Intro */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Scaling size={22} className="text-amber-500" />
            Online Image Resizer
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 font-medium">
            SnapFreeTools Image Resizer is a free, high-performance in-browser image optimization tool. Easily resize JPG, PNG, WebP, GIF, and BMP images to custom dimensions in pixels or percentages. Lock aspect ratio, apply social media presets, adjust quality compression, and convert file formats seamlessly.
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Image Resizer Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Custom Pixel & Percentage Scaling
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Change width and height to exact pixel values or scale down by percentages (25%, 50%, 75%, etc.).
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Aspect Ratio Lock
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Keep original proportion locked to prevent accidental image stretching or distortion.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Social Media & Display Presets
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Includes presets for Instagram Square/Portrait, Facebook Cover, YouTube Thumbnails, and Full HD resolutions.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Format Conversion & Background Fill
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Convert between JPG, PNG, and WebP formats. Apply solid background fills when converting transparent PNGs to JPG.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Target KB File Size Optimization
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Set a target max file size (e.g. 500 KB) and let our engine calculate compression quality automatically.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Batch Image Processing
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Upload and process multiple images at once right inside your browser without page reloads.
              </p>
            </div>

          </div>
        </div>

        {/* How to Resize Step-by-Step */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-black text-slate-900">
            How to Resize an Image
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Upload Image</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Drag and drop your image, click browse, or paste directly from your clipboard.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Choose Dimensions</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Enter target width and height in pixels, pick a social media preset, or select a scaling percentage.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Adjust Quality</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Optionally set output format (JPG, PNG, WebP) and compression quality percentage.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900">Download</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Review the live before & after comparison and click Download Resized Image.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="text-amber-500" size={24} />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto">
              Everything you need to know about image resizing, aspect ratios, and privacy.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left font-bold text-slate-800 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                        isOpen ? "rotate-180 text-amber-500" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
