"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadState from "./components/UploadState";
import Workspace from "./components/Workspace";
import ProcessingState from "./components/ProcessingState";
import SuccessState from "./components/SuccessState";

import { HTML_TO_PDF_FAQS } from "./content/faqs";
import EducationalContent from "./content/educationalContent";

import {
  validateUrlInput,
  validatePasteInput,
  validateUploadFile,
  validateZipFile,
  sanitizeDownloadFilename
} from "./utils/htmlToPdfValidation";

import { convertHtmlToPdf } from "./utils/htmlToPdfApi";

import {
  FileCode, Shield, Zap, Sparkles, HelpCircle,
  AlertCircle, CheckCircle, Info, Lock, ChevronDown, ChevronUp
} from "lucide-react";

export default function HtmlToPdfFeature({ faqs = HTML_TO_PDF_FAQS }) {
  const [mode, setMode] = useState("url"); // 'url', 'html_paste', 'html_upload', 'zip'
  const [urlInput, setUrlInput] = useState("");
  const [pasteInput, setPasteInput] = useState("");
  const [uploadFile, setUploadFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [settings, setSettings] = useState({
    pageSize: "A4",
    orientation: "portrait",
    mediaType: "print",
    scale: 1.0,
    marginTop: "10mm",
    marginRight: "10mm",
    marginBottom: "10mm",
    marginLeft: "10mm",
    printBackground: true,
    showFooter: false,
    respectCssPageSize: false
  });

  const [stage, setStage] = useState("upload"); // 'upload', 'converting', 'success'
  const [stageText, setStageText] = useState("");
  const [pdfResult, setPdfResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const fileInputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Revoke Object URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (pdfResult?.pdfUrl) {
        URL.revokeObjectURL(pdfResult.pdfUrl);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [pdfResult]);

  const handleStartConversion = async () => {
    setFileError(null);

    // 1. Client-Side Input Validation
    let targetUrl = null;
    let targetFilename = "html-to-pdf.pdf";

    if (mode === "url") {
      const urlValidation = validateUrlInput(urlInput);
      if (!urlValidation.valid) {
        setFileError(urlValidation.error);
        return;
      }
      targetUrl = urlValidation.sanitizedUrl;
      try {
        const hostname = new URL(targetUrl).hostname;
        targetFilename = sanitizeDownloadFilename(`${hostname}-converted.pdf`, "webpage-converted.pdf");
      } catch (e) {
        targetFilename = "webpage-converted.pdf";
      }

    } else if (mode === "html_paste") {
      const pasteValidation = validatePasteInput(pasteInput);
      if (!pasteValidation.valid) {
        setFileError(pasteValidation.error);
        return;
      }
      targetFilename = "pasted-document.pdf";

    } else if (mode === "html_upload") {
      const uploadValidation = validateUploadFile(uploadFile);
      if (!uploadValidation.valid) {
        setFileError(uploadValidation.error);
        return;
      }
      const baseName = uploadFile.name.replace(/\.[^/.]+$/, "");
      targetFilename = sanitizeDownloadFilename(`${baseName}-converted.pdf`, "html-document.pdf");

    } else if (mode === "zip") {
      const zipValidation = validateZipFile(uploadFile);
      if (!zipValidation.valid) {
        setFileError(zipValidation.error);
        return;
      }
      const baseName = uploadFile.name.replace(/\.[^/.]+$/, "");
      targetFilename = sanitizeDownloadFilename(`${baseName}-converted.pdf`, "zip-package.pdf");
    }

    // 2. Begin Processing Stage
    setStage("converting");
    setStageText("Connecting to PDF conversion engine...");

    abortControllerRef.current = new AbortController();

    try {
      setStageText("Rendering HTML markup and styles...");
      
      const blob = await convertHtmlToPdf({
        mode,
        url: targetUrl,
        htmlContent: pasteInput,
        file: uploadFile,
        settings,
        signal: abortControllerRef.current.signal
      });

      setStageText("Finalizing PDF document...");
      const pdfUrl = URL.createObjectURL(blob);

      setPdfResult({
        pdfUrl,
        pdfFilename: targetFilename,
        pdfSizeBytes: blob.size
      });

      setStage("success");

    } catch (err) {
      if (err.code === "CANCELLED" || err.message === "Conversion was cancelled.") {
        setStage("upload");
        setFileError("Conversion was cancelled.");
      } else {
        setFileError(err.message || "Failed to convert HTML to PDF.");
        setStage("upload");
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancelConversion = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleReset = () => {
    if (pdfResult?.pdfUrl) {
      URL.revokeObjectURL(pdfResult.pdfUrl);
    }
    setUrlInput("");
    setPasteInput("");
    setUploadFile(null);
    setPdfResult(null);
    setFileError(null);
    setStageText("");
    setStage("upload");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <ToolLayout
      title="HTML to PDF Converter"
      description="Convert public website URLs, raw HTML code, or uploaded .html files into clean PDF documents."
      currentSlug="html-to-pdf"
      result={stage === "success" && pdfResult ? {
        summary: "Converted HTML content into a high-quality PDF document."
      } : null}
      seoContent={
        <div className="space-y-12">
          {/* How It Works */}
          <section className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center">
              How to Convert HTML to PDF Online
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Choose Input Mode</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Select whether to convert a public Website URL, paste raw HTML markup, or upload an <code className="bg-slate-200 px-1 py-0.5 rounded text-[10px]">.html</code> file.
                </p>
              </div>

              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Configure Options</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Customize page dimensions (A4, Letter), orientation, margins, print backgrounds, media styles, and page numbers.
                </p>
              </div>

              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Download PDF</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click 'Convert HTML to PDF' to generate and save your formatted PDF document instantly.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy & Security Disclosures */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Secure Server Processing</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                URL conversion requests are rendered through isolated, secure backend browser instances. Uploaded or pasted HTML is sanitized and processed in memory without persistent file storage.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">High-Fidelity Chromium Output</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our modern rendering engine accurately preserves CSS layouts, web fonts, vector graphics, print page breaks, and complex web page styling.
              </p>
            </div>
          </section>

          {/* Educational Content & AEO Sections */}
          <EducationalContent />

          {/* FAQ Accordion */}
          {faqs && faqs.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3 pt-2">
                {faqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full p-4 text-left font-bold text-slate-800 text-xs sm:text-sm flex justify-between items-center bg-slate-50/50 hover:bg-slate-50"
                      >
                        <span>{faq.question}</span>
                        {isOpen ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
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
      }
    >
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Tool Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            Fast & Free Webpage to PDF Converter
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            HTML to PDF Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Convert public website URLs, raw HTML markup, or uploaded HTML files into clean, downloadable PDF documents.
          </p>
        </div>

        {/* Converter Main Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {stage === "upload" && (
            <>
              <UploadState
                mode={mode}
                setMode={setMode}
                urlInput={urlInput}
                setUrlInput={setUrlInput}
                pasteInput={pasteInput}
                setPasteInput={setPasteInput}
                uploadFile={uploadFile}
                setUploadFile={setUploadFile}
                fileError={fileError}
                setFileError={setFileError}
                onStartConversion={handleStartConversion}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
                fileInputRef={fileInputRef}
              />

              <Workspace
                settings={settings}
                setSettings={setSettings}
              />
            </>
          )}

          {stage === "converting" && (
            <ProcessingState
              stageText={stageText}
              mode={mode}
              onCancel={handleCancelConversion}
            />
          )}

          {stage === "success" && pdfResult && (
            <SuccessState
              pdfUrl={pdfResult.pdfUrl}
              pdfFilename={pdfResult.pdfFilename}
              pdfSizeBytes={pdfResult.pdfSizeBytes}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
