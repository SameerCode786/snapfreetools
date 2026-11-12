"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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
  Info,
  Globe,
  FileCheck,
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
      title="Scanned PDF to Word Converter with OCR Free"
      description="Convert native or scanned PDFs to editable Word (DOCX) online free. Your PDF never leaves your browser."
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
          {/* Quick Capabilities & Extraction Scope */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Sparkles size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-amber-900 uppercase tracking-wider">
                  In-Browser Tesseract OCR (Up to 10 Pages)
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed font-semibold mt-1">
                  Scanned and image-based PDFs are detected automatically and converted into editable Word (.docx) paragraphs right in your browser tab.
                </p>
              </div>
            </div>
            <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-3">
              <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-xs text-blue-900 uppercase tracking-wider">
                  What Gets Extracted to DOCX
                </p>
                <p className="text-[11px] text-blue-800 leading-relaxed font-semibold mt-1">
                  Readable text, headings, bullet/numbered lists, and paragraphs are extracted into Word. Complex tables, multi-column layouts, images, and original fonts are not recreated.
                </p>
              </div>
            </div>
          </div>

          {/* Scanned vs Native-Text PDFs & OCR Explanation */}
          <section className="max-w-4xl mx-auto space-y-6">
            <div className="space-y-2 text-center sm:text-left">
              <h2 className="text-2xl font-black text-slate-900">
                How Scanned vs. Native-Text PDF Conversion Works
              </h2>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">
                PDF files are either created digitally with selectable text or saved as scanned page images. When you select a file, this converter checks up to the first 10 pages to choose the appropriate extraction path.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FileCheck size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  Native Digital Text PDFs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  PDFs exported from word processors or web pages already hold embedded character data. Standard mode reads that digital text directly via <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">pdf.js</code>, unwraps line-split hyphens, formats headings/lists, and writes a clean <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">.docx</code> file without running OCR.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  Scanned &amp; Image-Based PDFs
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  Camera captures and flatbed scans contain flat images without selectable text. In OCR mode, each page is rendered onto a local canvas with contrast cleanup, processed by Tesseract.js WebAssembly in your browser, and structured into editable Word paragraphs and page breaks.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Info size={20} />
                </div>
                <h3 className="font-black text-slate-900 text-base">
                  OCR Accuracy &amp; Layout Reality
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                  OCR accuracy depends directly on scan resolution, lighting, and font clarity—low-quality scans can misread characters and trigger a review warning. Select the language that matches your document. Accented characters can still be misread, so please review the output. Both modes output plain text structure (headings, lists, paragraphs); complex tables, multi-column layouts, images, and original fonts are not recreated. For spreadsheet tables, try{" "}
                  <Link href="/pdf-to-excel" className="text-amber-700 underline hover:text-amber-900">
                    PDF to Excel
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Limits & Supported OCR Languages */}
          <section className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-black text-slate-900 text-center sm:text-left">
              Page Limits, File Size &amp; Supported OCR Languages
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="font-black text-slate-900 text-lg">
                  Document Limits: OCR vs. Native PDFs
                </h3>
                <ul className="text-xs text-slate-700 font-semibold space-y-2.5 leading-relaxed">
                  <li>
                    <strong className="text-slate-900">Scanned / OCR PDFs:</strong> Hard-capped at{" "}
                    <strong className="text-amber-700">10 pages per document</strong> to prevent in-browser OCR rendering from exhausting device memory. Split longer scans before converting.
                  </li>
                  <li>
                    <strong className="text-slate-900">Native Digital-Text PDFs:</strong> Have{" "}
                    <strong className="text-emerald-700">no fixed page-count limit</strong> in standard extraction mode and are bounded practically by your browser tab memory.
                  </li>
                  <li>
                    <strong className="text-slate-900">Maximum File Size (All PDFs):</strong> Every uploaded PDF is limited to{" "}
                    <strong className="text-slate-900">25MB</strong> regardless of whether you convert with OCR or standard text extraction.
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
                <h3 className="font-black text-slate-900 text-lg">
                  All 6 Supported OCR Languages
                </h3>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  English OCR data is bundled with SnapFreeTools. The other five supported languages download their <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">.traineddata</code> model on first use and require an active internet connection:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                  <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-2">
                    <span className="text-slate-900 font-bold">English (eng)</span>
                    <span className="text-[10px] text-emerald-700 font-bold uppercase">Bundled</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-slate-800">Spanish (spa)</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">1st-Use CDN</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-slate-800">French (fra)</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">1st-Use CDN</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-slate-800">German (deu)</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">1st-Use CDN</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-slate-800">Italian (ita)</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">1st-Use CDN</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                    <span className="text-slate-800">Portuguese (por)</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase">1st-Use CDN</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Network Behavior */}
          <section className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Shield size={20} />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Privacy &amp; In-Browser Processing Disclosure
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
              <strong className="text-slate-900">Your PDF never leaves your browser.</strong> All document inspection, canvas rendering, OCR character recognition, and <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">.docx</code> packaging run directly inside your browser tab&apos;s memory. No uploaded PDF or converted Word file is sent to or stored on SnapFreeTools servers.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              To run the converter in your browser, certain runtime scripts load over HTTPS: the <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">pdf.js</code> worker script loads from Cloudflare&apos;s CDN (<code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">cdnjs.cloudflare.com</code>), and selecting Spanish, French, German, Italian, or Portuguese downloads that language&apos;s OCR model from <code className="text-[11px] bg-slate-100 px-1 py-0.5 rounded">tessdata.projectnaptha.com</code> on first use. English OCR data, Tesseract WebAssembly core files, and your PDF bytes stay in local origin/browser memory.
            </p>
          </section>

          {/* Generic Browser-Based vs Server-Upload Comparison */}
          <section className="max-w-4xl mx-auto space-y-4">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900">
                Browser-Based vs. Server-Upload PDF to Word Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Depending on document sensitivity, page count, and formatting needs, browser-based converters and server-upload tools each have practical trade-offs.
              </p>
            </div>
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-3xl shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-900">
                    <th className="py-3.5 px-5 font-black">Comparison Aspect</th>
                    <th className="py-3.5 px-5 font-black">Browser-Based Tools (Client-Side)</th>
                    <th className="py-3.5 px-5 font-black">Server-Upload Tools (Remote Processing)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Document Transfer</td>
                    <td className="py-3.5 px-5">PDF stays on your device in browser memory</td>
                    <td className="py-3.5 px-5">PDF is uploaded over HTTPS to external servers</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Processing Resources</td>
                    <td className="py-3.5 px-5">Uses your device CPU/RAM (OCR capped at 10 pages here)</td>
                    <td className="py-3.5 px-5">Uses remote server hardware for heavier jobs</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Network Activity</td>
                    <td className="py-3.5 px-5">Loads app/worker scripts &amp; optional language packs; no document upload</td>
                    <td className="py-3.5 px-5">Uploads source PDF and downloads converted output</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-5 font-bold text-slate-900">Layout Reconstruction</td>
                    <td className="py-3.5 px-5">Focused on editable text, headings, lists, and paragraphs</td>
                    <td className="py-3.5 px-5">Varies by server engine; often targets complex layout recreation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Contextual Internal Links */}
          <section className="max-w-4xl mx-auto space-y-5">
            <div className="space-y-1.5">
              <h2 className="text-2xl font-black text-slate-900">
                Related PDF &amp; Document Conversion Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Need plain unformatted text instead of a Word file? Use our{" "}
                <Link href="/pdf-to-text" className="text-amber-700 font-bold underline hover:text-amber-900">
                  PDF to Text converter
                </Link>
                . Working with tabular reports or financial sheets? Try{" "}
                <Link href="/pdf-to-excel" className="text-amber-700 font-bold underline hover:text-amber-900">
                  PDF to Excel
                </Link>{" "}
                for spreadsheet structure. Once you finish editing your Word file, convert it back with{" "}
                <Link href="/word-to-pdf" className="text-amber-700 font-bold underline hover:text-amber-900">
                  Word to PDF
                </Link>
                .
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/pdf-to-text"
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 space-y-1.5 transition-all shadow-xs group"
              >
                <h3 className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  PDF to Text
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Extract clean plain text (.txt) directly from digital PDFs inside your browser.
                </p>
              </Link>
              <Link
                href="/pdf-to-excel"
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 space-y-1.5 transition-all shadow-xs group"
              >
                <h3 className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  PDF to Excel
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Extract rows, columns, and scanned tables into editable Excel spreadsheets.
                </p>
              </Link>
              <Link
                href="/word-to-pdf"
                className="bg-white border border-slate-200 hover:border-amber-300 rounded-2xl p-5 space-y-1.5 transition-all shadow-xs group"
              >
                <h3 className="font-black text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                  Word to PDF
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Turn your edited DOCX document back into a shareable PDF file locally.
                </p>
              </Link>
            </div>
          </section>

          {/* FAQ Accordion Section (answers remain in DOM/SSR HTML for no-JS readability) */}
          <section className="max-w-4xl mx-auto space-y-6 border-t border-slate-100 pt-10">
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
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`pdf-to-word-faq-${idx}`}
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
                    <div
                      id={`pdf-to-word-faq-${idx}`}
                      className={isOpen ? "block bg-slate-50/50 border-t border-slate-100" : "hidden"}
                    >
                      <div className="p-6 text-slate-600 text-xs font-semibold leading-relaxed">
                        {faq.answer}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      }
    >
      <div id="pdf-to-word-page" className="space-y-10">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Scanned PDF to Word Converter with OCR Free
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Convert native or scanned PDF files into editable Word documents (.docx) inside your browser. Your PDF never leaves your browser—free, no signup, and no watermarks.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> Free, No Signup
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Sparkles size={13} /> Free In-Browser OCR
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Shield size={13} /> PDF Stays in Browser
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100">
              <FileEdit size={13} /> Editable .docx Output
            </span>
          </div>

          {/* Persistent Tool Limits & Language Notice */}
          <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-700 font-semibold">
            <div className="flex items-start sm:items-center gap-2">
              <Info size={16} className="text-amber-600 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong className="text-slate-900">OCR Limit:</strong> Up to <strong>10 scanned pages</strong> per PDF.{" "}
                <strong className="text-slate-900">Native PDFs:</strong> No hard page cap (<strong>25MB max upload</strong> for all PDFs).
              </span>
            </div>
            <div className="flex flex-col sm:items-end text-[11px] text-slate-500 shrink-0 space-y-0.5">
              <span>6 OCR languages (English bundled; 5 fetch on first use)</span>
              <span>OCR on up to 10 pages can take a minute or more, depending on your device and language.</span>
            </div>
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
              <h2 className="font-black text-slate-800 text-lg sm:text-xl">
                Drag & drop PDF file here
              </h2>
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
                <h2 className="font-black text-slate-900 text-base sm:text-lg truncate">
                  {file.name}
                </h2>
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
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {conversionMode === "ocr" ? "Performing OCR & Converting..." : "Converting PDF to Word..."}
              </h2>
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
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                PDF Converted Successfully!
              </h2>
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
              <h2 className="text-xl sm:text-2xl font-black text-red-950">Conversion Failed</h2>
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
