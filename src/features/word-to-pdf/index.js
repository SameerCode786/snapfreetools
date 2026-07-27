"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadState from "./components/UploadState";
import FileReadyState from "./components/FileReadyState";
import ConversionProgress from "./components/ConversionProgress";
import ConversionSuccess from "./components/ConversionSuccess";

import { validateDocxFile } from "./utils/validateDocx";
import { convertDocxToPdf } from "./utils/convertDocxToPdf";

import {
  FileText, Shield, Zap, Sparkles, HelpCircle,
  AlertCircle, CheckCircle, Info, Lock, ChevronDown, ChevronUp
} from "lucide-react";

export default function WordToPDFFeature({ faqs = [] }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [stage, setStage] = useState("upload"); // upload, ready, converting, success
  const [progress, setProgress] = useState(0);
  const [stageText, setStageText] = useState("");
  const [pdfResult, setPdfResult] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
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

  const handleFileSelect = async (selectedFile) => {
    setFileError(null);
    if (!selectedFile) return;

    try {
      await validateDocxFile(selectedFile);
      setFile(selectedFile);
      setStage("ready");
    } catch (err) {
      setFile(null);
      setFileError(err.message || "Invalid Word document.");
      setStage("upload");
    }
  };

  const handleStartConversion = async () => {
    if (!file) return;

    setStage("converting");
    setProgress(0);
    setStageText("Loading conversion engine...");
    setFileError(null);

    abortControllerRef.current = new AbortController();

    try {
      const result = await convertDocxToPdf({
        file,
        containerRef,
        onProgress: ({ progress, stageText }) => {
          setProgress(progress);
          setStageText(stageText);
        },
        signal: abortControllerRef.current.signal
      });

      setPdfResult(result);
      setStage("success");
    } catch (err) {
      if (err.message === "CANCELLED") {
        setStage("ready");
        setFileError("Conversion was cancelled.");
      } else {
        setFileError(err.message || "Failed to convert Word document to PDF.");
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
    setFile(null);
    setPdfResult(null);
    setFileError(null);
    setProgress(0);
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
    <ToolLayout>
      <div className="space-y-12 max-w-4xl mx-auto">
        {/* Tool Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            100% Free & Browser-Based
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Word to PDF Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Convert DOCX files to PDF directly in your browser. Fast, private, and no file upload required.
          </p>
        </div>

        {/* Converter Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
          {stage === "upload" && (
            <UploadState
              onFileSelect={handleFileSelect}
              fileError={fileError}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
              fileInputRef={fileInputRef}
            />
          )}

          {stage === "ready" && (
            <FileReadyState
              file={file}
              onConvert={handleStartConversion}
              onChangeFile={handleReset}
            />
          )}

          {stage === "converting" && (
            <ConversionProgress
              progress={progress}
              stageText={stageText}
              onCancel={handleCancelConversion}
            />
          )}

          {stage === "success" && pdfResult && (
            <ConversionSuccess
              originalFilename={file.name}
              pdfUrl={pdfResult.pdfUrl}
              metrics={pdfResult.metrics}
              onReset={handleReset}
            />
          )}
        </div>

        {/* Informational & SEO Sections */}
        <div className="space-y-12 pt-6">
          {/* How to Convert Section */}
          <section className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center">
              How to Convert Word to PDF Online
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Select DOCX File</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Choose a Word document (<code className="bg-slate-200 text-slate-700 px-1 py-0.5 rounded text-[10px]">.docx</code>) up to 10MB from your computer or phone.
                </p>
              </div>

              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Convert in Browser</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Click 'Convert to PDF'. Our local script parses OpenXML and formats your document inside browser RAM.
                </p>
              </div>

              <div className="space-y-2 text-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 font-black rounded-xl flex items-center justify-center mx-auto text-sm">
                  3
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Download PDF</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Save your converted PDF file instantly. No watermarks, no registration, and 100% private.
                </p>
              </div>
            </div>
          </section>

          {/* Feature Highlights */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">100% Private & Secure</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Your Word documents are never uploaded to any remote server or cloud database. Conversion logic runs entirely on your device using client-side JavaScript.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                <Zap size={20} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Lightning Fast Output</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Because there is zero network upload latency, documents are converted in seconds. Download your clean PDF immediately without waiting in server queues.
              </p>
            </div>
          </section>

          {/* Formatting & Limitations Disclosure */}
          <section className="bg-amber-50/60 border border-amber-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <Info size={18} className="text-amber-600" />
              Supported Formatting & Known Limitations
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              SnapFreeTools converts standard Word documents including paragraphs, bold/italic text, headings, bulleted/numbered lists, inline images, and basic tables.
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
              <li>Supports modern OpenXML <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-[11px]">.docx</code> files up to 10MB and 20 pages.</li>
              <li>Legacy binary <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded text-[11px]">.doc</code> format (Word 97-2003) is not supported.</li>
              <li>Complex floating WordArt, dynamic fields, macro scripts, or proprietary fonts may render with minor visual differences.</li>
            </ul>
          </section>

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
      </div>

      {/* Hidden DOM rendering container */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
          width: "794px",
          background: "#ffffff"
        }}
      />
    </ToolLayout>
  );
}
