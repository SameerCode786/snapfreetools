"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileInfo from "./components/PdfFileInfo";
import GrayscaleSettings from "./components/GrayscaleSettings";
import ProcessingState from "./components/ProcessingState";
import ResultState from "./components/ResultState";
import {
  readPdfGrayscaleInfo,
  convertPdfToGrayscale,
  PdfGrayscaleError
} from "./engine/pdfGrayscaleEngine";

export default function PdfToGrayscaleFeature() {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [settings, setSettings] = useState({ dpi: 150, quality: 0.85, mode: "standard" });
  const [processingProgress, setProcessingProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("upload"); // "upload" | "configure" | "processing" | "result"

  const abortControllerRef = useRef(null);

  const handleFileSelected = async (selectedFile) => {
    setError(null);
    setFile(selectedFile);
    setResult(null);

    try {
      const pdfInfo = await readPdfGrayscaleInfo(selectedFile);
      setInfo(pdfInfo);
      setStep("configure");
    } catch (err) {
      if (err instanceof PdfGrayscaleError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message || "This PDF is encrypted with a password. Please unlock it before converting."
        });
      } else {
        setError({
          title: "Invalid PDF File",
          message: err.message || "We couldn't parse this PDF document. The file may be corrupt or invalid."
        });
      }
      setFile(null);
      setInfo(null);
      setStep("upload");
    }
  };

  const handleRemoveFile = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setInfo(null);
    setProcessingProgress(null);
    setResult(null);
    setError(null);
    setStep("upload");
  };

  const handleStartConversion = async () => {
    if (!file) return;

    setError(null);
    setStep("processing");
    setProcessingProgress({ stage: "initializing", currentPage: 0, totalPages: info?.pageCount || 0, percentage: 0 });

    abortControllerRef.current = new AbortController();

    try {
      const conversionResult = await convertPdfToGrayscale(file, {
        dpi: settings.dpi,
        quality: settings.quality,
        mode: settings.mode,
        filename: file.name,
        onProgress: (p) => setProcessingProgress(p),
        signal: abortControllerRef.current.signal
      });

      setResult(conversionResult);
      setStep("result");
    } catch (err) {
      if (err instanceof PdfGrayscaleError && err.code === "CANCELLED") {
        setStep("configure");
        setProcessingProgress(null);
        return;
      }

      if (err instanceof PdfGrayscaleError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message
        });
      } else {
        setError({
          title: "Conversion Failed",
          message: err.message || "An unexpected error occurred while converting the PDF to grayscale."
        });
      }

      setStep("upload");
      setProcessingProgress(null);
    }
  };

  const handleCancelProcessing = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  return (
    <ToolLayout
      title="PDF to Grayscale"
      description="Convert PDF pages to grayscale to reduce color usage and prepare documents for printing."
      currentSlug="pdf-to-grayscale"
      result={result}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 py-4">
        {step === "upload" && (
          <UploadZone onFileSelected={handleFileSelected} error={error} />
        )}

        {step === "configure" && file && (
          <div className="space-y-6">
            <PdfFileInfo file={file} pageCount={info?.pageCount} onRemove={handleRemoveFile} />
            <GrayscaleSettings
              settings={settings}
              onSettingsChange={setSettings}
              onConvert={handleStartConversion}
              disabled={false}
            />
          </div>
        )}

        {step === "processing" && (
          <ProcessingState
            progress={processingProgress}
            onCancel={handleCancelProcessing}
          />
        )}

        {step === "result" && result && (
          <ResultState
            result={result}
            onReset={handleRemoveFile}
          />
        )}
      </div>
    </ToolLayout>
  );
}
