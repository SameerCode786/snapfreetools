import { motion } from "motion/react";
import { FileType, Rocket, Clock } from "lucide-react";
import React, { useEffect } from "react";

export default function PDFToWord() {
  useEffect(() => {
    document.title = "PDF to Word Converter – Coming Soon | SnapFreeTools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Convert your PDF documents into editable Microsoft Word files with perfect formatting. Fast, secure, and free converter coming soon.");
    }
  }, []);

  return (
    <div id="pdf-to-word-page" className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl border border-slate-200 p-12 text-center"
      >
        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-8">
          <FileType size={40} />
        </div>
        
        <h1 className="text-4xl font-black mb-4">PDF to Word Converter</h1>
        
        <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8">
          <Rocket size={14} /> Coming Soon
        </div>
        
        <p className="text-slate-600 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          We're hard at work building a powerful, accurate PDF to Word converter that preserves your original formatting.
        </p>
        
        <div className="flex items-center gap-2 justify-center text-slate-400 font-medium italic">
          <Clock size={16} /> Estimated Release: Q3 2026
        </div>
      </motion.div>
    </div>
  );
}
