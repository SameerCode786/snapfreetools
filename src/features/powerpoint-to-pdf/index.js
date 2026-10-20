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
  validatePptxFile,
  parsePptxPresentation,
  convertPowerpointToPdf
} from "./utils/powerpointToPdfEngine";
import { ChevronDown, HelpCircle, AlertCircle, RefreshCw, Shield, Zap, Sparkles, Presentation } from "lucide-react";

export default function PowerPointToPDFFeature({ faqs = FAQS_DATA }) {
  const [viewState, setViewState] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success' | 'error'
  const [file, setFile] = useState(null);
  const [presentation, setPresentation] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, percent: 0, stage: "", message: "" });
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const abortControllerRef = useRef(null);

  // Clean up any memory / abort controllers on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFileSelected = async (selectedFile) => {
    setErrorMessage(null);
    try {
      const { buffer } = await validatePptxFile(selectedFile);
      const presData = await parsePptxPresentation(buffer);

      setFile(selectedFile);
      setPresentation(presData);
      setViewState("workspace");
    } catch (err) {
      setErrorMessage(err.message || "Failed to analyze PowerPoint presentation.");
      setViewState("upload");
    }
  };

  const handleStartConversion = async (options) => {
    if (!file || !presentation) return;

    setViewState("processing");
    setProgress({ current: 0, total: 1, percent: 5, stage: "Preparing presentation...", message: "Starting local conversion pipeline" });
    setErrorMessage(null);

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      const conversionResult = await convertPowerpointToPdf({
        file,
        options,
        onProgress: (prog) => {
          setProgress((prev) => ({ ...prev, ...prog }));
        },
        signal: abortController.signal
      });

      setResult(conversionResult);
      setViewState("success");
    } catch (err) {
      if (err.message === "Conversion cancelled by user.") {
        setViewState("workspace");
      } else {
        setErrorMessage(err.message || "An unexpected error occurred during PowerPoint conversion.");
        setViewState("workspace");
      }
    } finally {
      abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setViewState("workspace");
  };

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setPresentation(null);
    setResult(null);
    setErrorMessage(null);
    setProgress({ current: 0, total: 0, percent: 0, stage: "", message: "" });
    setViewState("upload");
  };

  return (
    <ToolLayout
      title="PowerPoint to PDF Converter"
      description="Convert PowerPoint presentations into PDF documents directly in your browser. Fast, private, and preserves slide layouts without server uploads."
      badge="100% Client-Side"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "PDF Tools", href: "/pdf-tools" },
        { label: "PowerPoint to PDF", href: "/powerpoint-to-pdf" }
      ]}
      faqs={faqs}
      educationalContent={<EducationalContent />}
    >
      <div className="w-full">
        {/* Dynamic State Rendering */}
        {viewState === "upload" && (
          <UploadState
            onFileSelected={handleFileSelected}
            error={errorMessage}
          />
        )}

        {viewState === "workspace" && (
          <div className="space-y-6">
            {errorMessage && (
              <div className="max-w-4xl mx-auto p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-rose-700 text-sm font-medium animate-in fade-in duration-200 text-left">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Conversion Error</p>
                  <p className="text-xs leading-relaxed">{errorMessage}</p>
                </div>
              </div>
            )}
            <Workspace
              file={file}
              presentation={presentation}
              onStartConversion={handleStartConversion}
              onReset={handleReset}
            />
          </div>
        )}

        {viewState === "processing" && (
          <ProcessingState
            progress={progress}
            onCancel={handleCancel}
          />
        )}

        {viewState === "success" && (
          <SuccessState
            result={result}
            onReset={handleReset}
          />
        )}
      </div>
    </ToolLayout>
  );
}
