"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Download,
  RefreshCw,
  Trash2,
  ArrowRight,
  Shield,
  Zap,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileEdit,
  Award,
  Info,
  Layers,
  Globe,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import ToolLayout from "@/layouts/tool-layout";
import ScannedPdfModal from "./components/ScannedPdfModal";
import { inspectPdfDocument } from "./utils/pdf-inspector";
import { runOCR, SUPPORTED_OCR_LANGUAGES, MAX_OCR_PAGES } from "./utils/ocr-engine";
import { generateDocxFromPages } from "./utils/docx-generator";
import { formatOCRText } from "./utils/ocr-text-formatter";

async function getPdfJsEngine() {
  let pdfjsModule;
  try {
    pdfjsModule = await import("pdfjs-dist");
  } catch {
    pdfjsModule = await import("pdfjs-dist/build/pdf.mjs");
  }
  const pdfjs = pdfjsModule.default || pdfjsModule;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
}

export default function PDFToWord({ faqs = [] }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [inspectionDetails, setInspectionDetails] = useState(null);
  const [isInspecting, setIsInspecting] = useState(false);
  const [showScannedModal, setShowScannedModal] = useState(false);

  const [conversionState, setConversionState] = useState("idle"); // idle | converting | completed | error
  const [conversionMode, setConversionMode] = useState("standard"); // standard | ocr
  const [selectedLanguage, setSelectedLanguage] = useState("eng");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [docBlob, setDocBlob] = useState(null);
  const [isOcrCompleted, setIsOcrCompleted] = useState(false);
  const [ocrConfidenceWarning, setOcrConfidenceWarning] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const fileInputRef = useRef(null);
  const activeOcrJobRef = useRef(null);
  const cachedPdfDocRef = useRef(null);

  // Cancel any active OCR worker when component unmounts
  useEffect(() => {
    return () => {
      if (activeOcrJobRef.current) {
        activeOcrJobRef.current.cancel();
        activeOcrJobRef.current = null;
      }
    };
  }, []);

  // Maximum file size: 25MB
  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    validateAndInspectFile(selectedFile);
  };

  const validateAndInspectFile = async (selectedFile) => {
    setFileError(null);
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setFileError("Invalid file type. Please select a PDF document (.pdf).");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File is too large. Maximum supported size is 25MB.");
      return;
    }

    // Cancel any previous job
    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }

    setFile(selectedFile);
    setConversionState("idle");
    setProgress(0);
    setDocBlob(null);
    setIsOcrCompleted(false);
    setOcrConfidenceWarning(null);
    setInspectionDetails(null);
    setIsInspecting(true);
    setStatusMessage("Inspecting PDF document...");

    try {
      const pdfjs = await getPdfJsEngine();
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      cachedPdfDocRef.current = pdfDoc;

      setPageCount(pdfDoc.numPages);
      setTotalPages(pdfDoc.numPages);

      // Perform deep inspection to detect scanned pages vs digital text
      const inspection = await inspectPdfDocument(pdfDoc);
      setInspectionDetails(inspection);

      if (inspection.isScanned) {
        // Scanned or mixed PDF detected -> show iLovePDF-inspired modal
        setConversionMode("ocr");
        setShowScannedModal(true);
      } else {
        // Purely digital text PDF -> keep standard conversion mode
        setConversionMode("standard");
        setShowScannedModal(false);
      }
    } catch (inspectErr) {
      console.warn("PDF inspection fallback:", inspectErr);
      setPageCount(1);
      setTotalPages(1);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndInspectFile(droppedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }
    cachedPdfDocRef.current = null;
    setFile(null);
    setPageCount(null);
    setFileError(null);
    setInspectionDetails(null);
    setConversionState("idle");
    setConversionMode("standard");
    setProgress(0);
    setDocBlob(null);
    setShowScannedModal(false);
    setOcrConfidenceWarning(null);
    setIsOcrCompleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 1. Primary Action from Scanned Modal or Convert Button: Free OCR Conversion
  const handleStartOcrConversion = async (languageOverride) => {
    if (!file) return;

    setShowScannedModal(false);
    setConversionMode("ocr");
    setConversionState("converting");
    setProgress(5);
    setFileError(null);
    setOcrConfidenceWarning(null);
    setIsOcrCompleted(false);

    const langToUse = languageOverride || selectedLanguage || "eng";

    try {
      setStatusMessage("Preparing PDF document...");
      let pdfDoc = cachedPdfDocRef.current;
      if (!pdfDoc) {
        const pdfjs = await getPdfJsEngine();
        const arrayBuffer = await file.arrayBuffer();
        pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        cachedPdfDocRef.current = pdfDoc;
      }

      const numPages = pdfDoc.numPages;
      setPageCount(numPages);
      setTotalPages(numPages);

      if (numPages > MAX_OCR_PAGES) {
        const limitErr = new Error(
          `This free in-browser OCR version supports up to ${MAX_OCR_PAGES} scanned pages per document. Please split larger PDFs and try again.`
        );
        limitErr.code = "LIMIT_EXCEEDED";
        throw limitErr;
      }

      // Initialize OCR Engine with cached inspection and balanced quality
      const job = runOCR({
        pdfDoc,
        lang: langToUse,
        quality: "balanced",
        pageInspection: inspectionDetails,
        onProgress: (stage, current, total, percent) => {
          setStatusMessage(stage);
          setCurrentPage(current);
          setTotalPages(total);
          setProgress(percent);
        },
      });

      activeOcrJobRef.current = job;
      const { ocrResults, averageConfidence } = await job.promise;
      activeOcrJobRef.current = null;

      // Stage: Compiling editable DOCX document
      setStatusMessage("Generating editable Microsoft Word (.docx) file...");
      setProgress(92);

      const blob = await generateDocxFromPages(ocrResults);
      setDocBlob(blob);

      if (averageConfidence < 60) {
        setOcrConfidenceWarning(
          "OCR completed, but some text may require manual review because the scan quality was low."
        );
      }

      setIsOcrCompleted(true);
      setProgress(100);
      setConversionState("completed");
    } catch (err) {
      activeOcrJobRef.current = null;
      console.error("OCR execution error:", err);

      if (err.message === "cancelled") {
        setConversionState("idle");
        setProgress(0);
        setStatusMessage("");
        return;
      }

      setConversionState("error");
      if (err.code === "LIMIT_EXCEEDED") {
        setFileError(
          `This free OCR tool supports up to ${MAX_OCR_PAGES} scanned pages per document. Please split your file and try in batches.`
        );
      } else if (err.code === "NO_TEXT_FOUND") {
        setFileError(
          "OCR completed, but no readable text was detected. The scanned pages may be blank or too low resolution. Try uploading a clearer scan."
        );
      } else if (err.code === "UNSUPPORTED_LANGUAGE") {
        setFileError(err.message);
      } else if (err.code === "LANGUAGE_LOAD_FAILED") {
        setFileError(
          `Failed to load OCR language data for '${langToUse}'. Please ensure an active internet connection or switch to English.`
        );
      } else {
        setFileError(
          `OCR conversion failed: ${err.message || "An unexpected error occurred during processing."}`
        );
      }
    }
  };

  // 2. Secondary Action: Standard Native Conversion (Without OCR)
  const handleStandardConversion = async () => {
    if (!file) return;

    setShowScannedModal(false);
    setConversionMode("standard");
    setConversionState("converting");
    setProgress(5);
    setFileError(null);
    setOcrConfidenceWarning(null);
    setIsOcrCompleted(false);

    try {
      setStatusMessage("Loading PDF document...");
      let pdfDoc = cachedPdfDocRef.current;
      if (!pdfDoc) {
        const pdfjs = await getPdfJsEngine();
        const arrayBuffer = await file.arrayBuffer();
        pdfDoc = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
        cachedPdfDocRef.current = pdfDoc;
      }

      const numPages = pdfDoc.numPages;
      setPageCount(numPages);
      setTotalPages(numPages);

      setStatusMessage("Extracting text and paragraphs...");
      setProgress(20);

      const pageResults = [];
      let totalTextLength = 0;

      for (let i = 1; i <= numPages; i++) {
        setCurrentPage(i);
        setStatusMessage(`Reading page ${i} of ${numPages}...`);
        const pct = Math.round(20 + (i / numPages) * 60);
        setProgress(pct);

        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();

        const pageText = (textContent.items || [])
          .filter((item) => typeof item.str === "string")
          .map((item) => item.str)
          .join(" ")
          .trim();

        totalTextLength += pageText.length;
        const paragraphs = formatOCRText(pageText);

        pageResults.push({
          pageNumber: i,
          paragraphs,
          confidence: 100,
          isOcr: false,
        });
      }

      // Check if document was purely scanned and had 0 selectable text
      if (totalTextLength === 0) {
        setConversionState("idle");
        setFileError(
          "No selectable digital text was found in this PDF. This document requires OCR to recognize text. Please click 'Convert with Free OCR' to extract text from scanned pages."
        );
        setShowScannedModal(true);
        return;
      }

      setStatusMessage("Building Word (.docx) document...");
      setProgress(85);

      const blob = await generateDocxFromPages(pageResults);
      setDocBlob(blob);
      setProgress(100);
      setConversionState("completed");
    } catch (err) {
      console.error("Standard PDF conversion error:", err);
      setConversionState("error");
      setFileError(
        `Conversion failed: ${err.message || "An unexpected error occurred during processing."}`
      );
    }
  };

  // Safe Cancel handler
  const handleCancelConversion = () => {
    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }
    setConversionState("idle");
    setProgress(0);
    setStatusMessage("Conversion cancelled.");
  };

  // File download handler
  const handleDownload = () => {
    if (!docBlob || !file) return;

    const originalName = file.name;
    const cleanName = originalName.replace(/\.[^/.]+$/, "");
    const url = URL.createObjectURL(docBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = isOcrCompleted
      ? `${cleanName}-ocr-converted.docx`
      : `${cleanName}-converted.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <ToolLayout
      title="PDF to Word Converter"
      description="Convert PDF files into editable Word documents online with Free In-Browser OCR. Fast, secure, and 100% private."
      currentSlug="pdf-to-word"
      result={
        conversionState === "completed" && docBlob
          ? {
              summary: `Converted PDF file (${pageCount || 1} pages) into an editable Word document (.docx)${
                isOcrCompleted ? " via Free In-Browser OCR" : ""
              }.`,
            }
          : null
      }
      seoContent={
        <div className="space-y-12">
          {/* Limitation & Information Badges */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                  Free In-Browser OCR Included
                </h4>
                <p className="text-[11px] text-amber-800 leading-relaxed font-semibold mt-1">
                  Scanned and image-based PDFs are automatically detected and converted into editable Word paragraphs without any cloud upload.
                </p>
              </div>
            </div>
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">
                  Layout & Formatting Preservation
                </h4>
                <p className="text-[11px] text-blue-800 leading-relaxed font-semibold mt-1">
                  Original paragraphs, line spacing, and page order are preserved. Complex multi-column articles or complex tables may require manual adjustment in Word.
                </p>
              </div>
            </div>
          </div>

          {/* Info Feature Comparison Box */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileCheck size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">
                Dual Conversion: Digital & Scanned
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                SnapFreeTools inspects your PDF on upload. Native digital PDFs convert instantly, while scanned documents get high-accuracy OCR text recognition with editable DOCX output.
              </p>
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Key Capabilities
                </h4>
                <ul className="text-xs text-slate-700 font-semibold space-y-2">
                  <li className="flex items-center gap-2">• Clean paragraph & list preservation</li>
                  <li className="flex items-center gap-2">• Unwraps hyphenated word line breaks</li>
                  <li className="flex items-center gap-2">• Multilingual OCR (English, Spanish, French, etc.)</li>
                  <li className="flex items-center gap-2">• Strict page order & break preservation</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Shield size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">
                100% Client-Side Privacy
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Unlike cloud converters that upload your confidential documents to external servers, our WebAssembly OCR engine runs entirely inside your browser tab.
              </p>
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                  Privacy Guarantees
                </h4>
                <ul className="text-xs text-slate-700 font-semibold space-y-2">
                  <li className="flex items-center gap-2">• Zero server uploads or file storage</li>
                  <li className="flex items-center gap-2">• Free forever with no registration or sign-in</li>
                  <li className="flex items-center gap-2">• No payment wall or credit card required</li>
                  <li className="flex items-center gap-2">• No watermarks or hidden branding</li>
                </ul>
              </div>
            </div>
          </div>

          {/* FAQ Accordion Section */}
          <div className="max-w-4xl mx-auto space-y-6 border-t border-slate-100 pt-10">
            <h2 className="text-2xl font-black text-slate-900 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center py-4 px-6 text-left font-bold text-slate-800 hover:text-amber-500 transition-colors gap-4 cursor-pointer"
                    >
                      <span className="text-sm">{faq.question}</span>
                      <HelpCircle
                        size={18}
                        className={`text-slate-400 shrink-0 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                        >
                          <div className="p-6 text-slate-600 text-xs font-semibold leading-relaxed">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      }
    >
      <div id="pdf-to-word-page" className="space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            PDF to Word Converter
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Convert native & scanned PDF files into fully editable Word documents (.docx). Free, private, and powered by In-Browser OCR.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Sparkles size={13} /> Free In-Browser OCR
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Shield size={13} /> 100% Client-Side Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100">
              <FileEdit size={13} /> Editable DOCX Output
            </span>
          </div>
        </div>

        {/* Scanned PDF Detection Modal (iLovePDF-inspired prompt) */}
        <ScannedPdfModal
          isOpen={showScannedModal}
          onClose={() => setShowScannedModal(false)}
          onConvertWithOcr={handleStartOcrConversion}
          onConvertWithoutOcr={handleStandardConversion}
          selectedLanguage={selectedLanguage}
          onSelectLanguage={setSelectedLanguage}
          inspectionDetails={inspectionDetails}
        />

        {/* Upload Zone / Dropzone */}
        {conversionState === "idle" && !file && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-slate-50/50 rounded-3xl p-10 sm:p-12 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[240px] shadow-xs"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,application/pdf"
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 shadow-inner">
                <UploadCloud size={32} />
              </div>
              <h3 className="font-black text-slate-800 text-lg sm:text-xl">
                Drag & drop PDF file here
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1.5">
                or click to browse from your device
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                <span>PDF format only</span>
                <span>•</span>
                <span>Max 25MB</span>
                <span>•</span>
                <span>Up to 10 scanned pages for OCR</span>
              </div>
            </div>

            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs">
                <AlertCircle size={18} className="shrink-0 text-red-500" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        )}

        {/* File Ready Card */}
        {conversionState === "idle" && file && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 shadow-inner">
                <FileText size={28} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 text-base sm:text-lg truncate">
                  {file.name}
                </h4>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold mt-1">
                  <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                  <span>•</span>
                  <span>{pageCount !== null ? `${pageCount} page${pageCount === 1 ? "" : "s"}` : "Counting pages..."}</span>
                  {inspectionDetails?.isScanned && (
                    <>
                      <span>•</span>
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <Sparkles size={12} /> Scanned PDF
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
                title="Remove file"
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Scanned PDF Notification banner if detected */}
            {inspectionDetails?.isScanned && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                    <Sparkles size={16} className="text-amber-600" />
                    Scanned Pages Detected
                  </div>
                  <button
                    onClick={() => setShowScannedModal(true)}
                    className="text-[11px] font-bold text-amber-700 underline hover:text-amber-900 cursor-pointer"
                  >
                    View OCR Options
                  </button>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed font-semibold">
                  This document contains scanned pages. Free In-Browser OCR will be used to extract editable text.
                </p>

                {/* OCR Language Selector in Card */}
                <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 shrink-0">
                    <Globe size={14} className="text-amber-600" /> Language:
                  </span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 cursor-pointer"
                  >
                    {SUPPORTED_OCR_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {fileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold">
                <AlertCircle size={16} className="shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Convert Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {inspectionDetails?.isScanned ? (
                <>
                  <button
                    onClick={() => handleStartOcrConversion(selectedLanguage)}
                    disabled={isInspecting}
                    className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={18} />
                    Convert with Free OCR
                    <ArrowRight size={16} />
                  </button>

                  <button
                    onClick={handleStandardConversion}
                    disabled={isInspecting}
                    className="bg-slate-100 hover:bg-slate-200 active:scale-[0.99] text-slate-700 font-bold py-4 px-5 rounded-2xl transition-all flex items-center justify-center gap-1.5 text-xs cursor-pointer"
                  >
                    Convert without OCR
                  </button>
                </>
              ) : (
                <button
                  onClick={handleStandardConversion}
                  disabled={isInspecting}
                  className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black py-4 px-6 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer disabled:opacity-50"
                >
                  Convert to Word (.docx)
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Conversion in Progress */}
        {conversionState === "converting" && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <Loader2 size={32} className="animate-spin text-amber-500" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {conversionMode === "ocr" ? "Performing OCR & Converting..." : "Converting PDF to Word..."}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">{statusMessage}</p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>
                {conversionMode === "ocr"
                  ? `Scanning Page ${currentPage} of ${totalPages}`
                  : `Processing Page ${currentPage} of ${totalPages}`}
              </span>
              <span>{progress}%</span>
            </div>

            <div className="pt-2">
              <button
                onClick={handleCancelConversion}
                className="text-xs text-slate-500 hover:text-red-600 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer"
              >
                Cancel Conversion
              </button>
            </div>
          </div>
        )}

        {/* Success / Download Section */}
        {conversionState === "completed" && docBlob && (
          <div className="max-w-3xl mx-auto bg-emerald-50/40 border border-emerald-100 rounded-3xl p-8 sm:p-10 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 size={34} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                PDF Converted Successfully!
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm font-semibold max-w-md mx-auto">
                {isOcrCompleted
                  ? "Your scanned pages have been recognized via Free In-Browser OCR and compiled into an editable Word document."
                  : "Your PDF text has been extracted and compiled into an editable Word document."}
              </p>
            </div>

            {ocrConfidenceWarning && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs font-medium text-left flex gap-3 max-w-lg mx-auto">
                <Info size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Quality Notice:</strong> {ocrConfidenceWarning}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-slate-950 font-black px-8 py-4 rounded-2xl shadow-lg shadow-amber-500/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <Download size={18} /> Download Word Document (.docx)
              </button>

              <button
                onClick={removeFile}
                className="bg-white border border-slate-200 hover:border-slate-300 active:scale-[0.99] text-slate-700 font-bold px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-xs"
              >
                <RefreshCw size={16} /> Convert Another PDF
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {conversionState === "error" && (
          <div className="max-w-2xl mx-auto bg-red-50/60 border border-red-100 rounded-3xl p-8 sm:p-10 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <AlertCircle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-red-950">Conversion Failed</h3>
              <p className="text-xs sm:text-sm text-red-700 font-semibold max-w-md mx-auto">
                {fileError || "An unexpected error occurred during processing."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              {inspectionDetails?.isScanned && (
                <button
                  onClick={() => handleStartOcrConversion(selectedLanguage)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles size={15} /> Retry with OCR
                </button>
              )}
              <button
                onClick={removeFile}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                Upload Different File
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
