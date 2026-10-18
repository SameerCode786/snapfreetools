"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Sparkles,
  Shield,
  Zap,
  Globe,
  ArrowRight,
  Info,
  X,
  FileCheck2,
} from "lucide-react";
import { SUPPORTED_OCR_LANGUAGES } from "../utils/ocr-engine";

export default function ScannedPdfModal({
  isOpen,
  onClose,
  onConvertWithOcr,
  onConvertWithoutOcr,
  selectedLanguage,
  onSelectLanguage,
  inspectionDetails,
}) {
  if (!isOpen) return null;

  const isMixed = inspectionDetails?.isMixed;
  const numPages = inspectionDetails?.numPages || 1;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 z-10 my-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scanned-pdf-modal-title"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>

          {/* Modal Header */}
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <FileText size={28} className="text-amber-500" />
            </div>
            <div className="space-y-1">
              <h2
                id="scanned-pdf-modal-title"
                className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight"
              >
                Scanned PDF Detected
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-md mx-auto">
                {isMixed
                  ? "This document contains scanned or image-based pages with no extractable text. OCR can recognize characters inside scanned pages to make your Word document editable."
                  : "This PDF contains scanned or photograph pages with no extractable text. OCR (Optical Character Recognition) can recognize text in scanned pages and convert them into editable Word paragraphs."}
              </p>
            </div>
          </div>

          {/* Free & Privacy Highlights */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 flex items-center gap-2">
              <Zap size={16} className="text-emerald-600 shrink-0" />
              <div className="text-[11px] font-bold text-emerald-800 leading-tight">
                100% Free & No Signup
              </div>
            </div>
            <div className="bg-blue-50/60 border border-blue-100 rounded-xl p-3 flex items-center gap-2">
              <Shield size={16} className="text-blue-600 shrink-0" />
              <div className="text-[11px] font-bold text-blue-800 leading-tight">
                100% Client-Side Privacy
              </div>
            </div>
          </div>

          {/* Language Selector */}
          <div className="space-y-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
            <label
              htmlFor="ocr-language-select"
              className="flex items-center justify-between text-xs font-bold text-slate-700"
            >
              <span className="flex items-center gap-1.5">
                <Globe size={14} className="text-amber-600" /> OCR Document Language:
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Select Language
              </span>
            </label>
            <select
              id="ocr-language-select"
              value={selectedLanguage}
              onChange={(e) => onSelectLanguage(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer shadow-xs"
            >
              {SUPPORTED_OCR_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Default English model is bundled locally for instant, offline recognition.
            </p>
          </div>

          {/* Information & Limitations Notice */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-xl p-3 flex gap-2.5 text-amber-900">
            <Info size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="text-[11px] font-medium leading-relaxed">
              <strong>Formatting Note:</strong> Text, paragraphs, and order will be preserved. Complex tables, multi-column articles, or handwritten notes may require manual adjustment in Word. Free in-browser OCR supports up to 10 scanned pages per document.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={() => onConvertWithOcr(selectedLanguage)}
              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-bold py-3.5 px-6 rounded-2xl text-xs sm:text-sm shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles size={16} />
              Convert with Free OCR
              <ArrowRight size={15} />
            </button>

            <button
              onClick={onConvertWithoutOcr}
              className="w-full bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 font-bold py-3 px-6 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <FileCheck2 size={15} />
              Convert without OCR
            </button>
          </div>

          <div className="text-center">
            <span className="text-[11px] text-slate-400 font-medium">
              Document: {numPages} page{numPages === 1 ? "" : "s"} • Processed privately in your browser
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
