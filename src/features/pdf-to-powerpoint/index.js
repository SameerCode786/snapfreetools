"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadState from "./components/UploadState";
import Workspace from "./components/Workspace";
import ProcessingState from "./components/ProcessingState";
import SuccessState from "./components/SuccessState";
import EducationalContent from "./content/educationalContent";
import { FAQS_DATA } from "./content/faqData";
import {
  getPdfJsEngine,
  validatePdfInput,
  analyzePdfDocument,
  convertPdfToPowerpoint,
  sanitizePptxFilename
} from "./utils/pdfToPowerpointEngine";
import { ChevronDown, HelpCircle, AlertCircle, RefreshCw, Shield, Zap, Sparkles, Presentation } from "lucide-react";

export default function PDFToPowerPointFeature({ faqs = FAQS_DATA }) {
  const [viewState, setViewState] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success' | 'error'
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0, stage: "", message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const cachedPdfDocRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Clean up any memory / abort controllers on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      cachedPdfDocRef.current = null;
    };
  }, []);

  const handleFileSelected = async (selectedFile) => {
    setErrorMessage(null);
    const validation = validatePdfInput(selectedFile);
    if (!validation.valid) {
      setErrorMessage(validation.error);
      return;
    }

    try {
      setViewState("processing");
      setProgress({
        current: 0,
        total: 1,
        percent: 15,
        stage: "Reading document...",
        message: "Loading PDF into browser memory..."
      });

      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfjs = await getPdfJsEngine();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdfDoc = await loadingTask.promise;
      cachedPdfDocRef.current = pdfDoc;

      setProgress({
        current: 0,
        total: pdfDoc.numPages,
        percent: 40,
        stage: "Analyzing structure...",
        message: "Detecting page sizes, orientation, and text elements..."
      });

      const docAnalysis = await analyzePdfDocument(pdfDoc);
      setAnalysis(docAnalysis);

      setFile(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        size: selectedFile.size,
        pageCount: pdfDoc.numPages
      });

      setViewState("workspace");

      // Generate low-res thumbnails asynchronously for first up to 12 pages
      generateThumbnails(pdfDoc, Math.min(docAnalysis.numPages, 12));
    } catch (err) {
      console.error("PDF Parsing error:", err);
      setViewState("upload");
      if (err.name === "PasswordException") {
        setErrorMessage("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setErrorMessage("Could not process this PDF document. The file may be corrupted or in an unsupported format.");
      }
    }
  };

  const generateThumbnails = async (pdfDoc, maxPages) => {
    setIsLoadingThumbnails(true);
    const thumbs = [];
    try {
      for (let i = 1; i <= maxPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement("canvas");
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext("2d", { willReadFrequently: false });
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({
          canvasContext: ctx,
          viewport
        }).promise;

        const url = canvas.toDataURL("image/jpeg", 0.75);
        thumbs.push({ pageNumber: i, url });

        // Free canvas
        canvas.width = 0;
        canvas.height = 0;
      }
      setThumbnails(thumbs);
    } catch (e) {
      console.warn("Thumbnail generation non-critical error:", e);
    } finally {
      setIsLoadingThumbnails(false);
    }
  };

  const handleStartConversion = async (settings) => {
    if (!cachedPdfDocRef.current || !fileInfo) {
      setErrorMessage("PDF document is no longer in memory. Please upload your file again.");
      setViewState("upload");
      return;
    }

    setViewState("processing");
    setProgress({
      current: 0,
      total: fileInfo.pageCount,
      percent: 5,
      stage: "Starting conversion...",
      message: "Preparing slides and presentation layout..."
    });

    abortControllerRef.current = new AbortController();

    try {
      const conversionResult = await convertPdfToPowerpoint(cachedPdfDocRef.current, {
        mode: settings.mode,
        preset: settings.preset,
        pageRange: settings.pageRange,
        onProgress: (p) => setProgress(p),
        signal: abortControllerRef.current.signal
      });

      const targetFilename = sanitizePptxFilename(fileInfo.name);

      setResult({
        ...conversionResult,
        filename: targetFilename
      });

      setViewState("success");
    } catch (err) {
      console.error("Conversion error:", err);
      setViewState("error");
      setErrorMessage(err.message || "An unexpected error occurred during PowerPoint conversion.");
    }
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    cachedPdfDocRef.current = null;
    setFile(null);
    setFileInfo(null);
    setAnalysis(null);
    setThumbnails([]);
    setResult(null);
    setErrorMessage(null);
    setProgress({ current: 0, total: 0, percent: 0, stage: "", message: "" });
    setViewState("upload");
  };

  const toggleFaq = (idx) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <ToolLayout
      title="PDF to PowerPoint Converter"
      description="Convert PDF documents into editable or high-fidelity PowerPoint presentation files (.pptx) directly in your browser. 100% free and private."
      currentSlug="pdf-to-powerpoint"
      result={
        viewState === "success" && result
          ? {
              summary: `Converted ${result.convertedCount} ${
                result.convertedCount === 1 ? "page" : "pages"
              } into a Microsoft PowerPoint presentation (.pptx) in ${
                result.mode === "editable" ? "Editable Content" : "High Fidelity"
              } mode.`,
            }
          : null
      }
      seoContent={<EducationalContent />}
    >
      <div id="pdf-to-powerpoint-tool" className="space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            PDF to PowerPoint Converter — Convert PDF to PPTX Online
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-medium">
            Convert PDF pages into downloadable Microsoft PowerPoint presentation files (.pptx) directly in your browser. 100% free, private, and client-side.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> 100% Free
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Sparkles size={13} /> Editable Text Reconstruction
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Shield size={13} /> 100% Client-Side Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100">
              <Presentation size={13} /> Native .PPTX Output
            </span>
          </div>
        </div>

        {/* Upload State */}
        {viewState === "upload" && (
          <UploadState
            onFileSelected={handleFileSelected}
            isLoading={false}
            error={errorMessage}
          />
        )}

        {/* Workspace State */}
        {viewState === "workspace" && (
          <Workspace
            fileInfo={fileInfo}
            analysis={analysis}
            thumbnails={thumbnails}
            isLoadingThumbnails={isLoadingThumbnails}
            onStartConversion={handleStartConversion}
            onReset={handleReset}
          />
        )}

        {/* Processing State */}
        {viewState === "processing" && (
          <ProcessingState progress={progress} />
        )}

        {/* Success State */}
        {viewState === "success" && (
          <SuccessState result={result} onReset={handleReset} />
        )}

        {/* Error State */}
        {viewState === "error" && (
          <div className="max-w-xl mx-auto text-center space-y-6 bg-white border border-red-200/80 rounded-3xl p-8 sm:p-12 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-2xs">
              <AlertCircle size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Conversion Failed
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">
                {errorMessage || "An unexpected error occurred while converting your PDF."}
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={16} />
                <span>Try Another PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* FAQ Accordion Section */}
        {faqs && faqs.length > 0 && (
          <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                <HelpCircle size={22} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-xl sm:text-2xl">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs font-semibold text-slate-500">
                  Everything you need to know about converting PDF documents to PowerPoint presentations.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={index} className="py-4">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between text-left gap-4 group cursor-pointer focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors">
                        {faq.question}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-400 group-hover:text-amber-600 transition-transform duration-200 shrink-0 ${
                          isOpen ? "rotate-180 text-amber-600" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium animate-in fade-in duration-200 pr-6">
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
    </ToolLayout>
  );
}
