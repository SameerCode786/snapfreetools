"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileInfo from "./components/PdfFileInfo";
import ReverseOptions from "./components/ReverseOptions";
import ProcessingState from "./components/ProcessingState";
import ResultState from "./components/ResultState";
import ReversePdfEducationalContent from "./content/educationalContent";
import { REVERSE_PDF_FAQS } from "./content/faqs";
import {
  readPdfInfo,
  reversePdfPages,
  ReversePdfError
} from "./engine/reversePdfEngine";

export default function ReversePdfFeature({ faqs = REVERSE_PDF_FAQS }) {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [options, setOptions] = useState({ mode: "all", rangeStart: 1, rangeEnd: 1 });
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
      const pdfInfo = await readPdfInfo(selectedFile);
      setInfo(pdfInfo);
      setOptions({
        mode: "all",
        rangeStart: 1,
        rangeEnd: pdfInfo.pageCount
      });
      setStep("configure");
    } catch (err) {
      if (err instanceof ReversePdfError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message || "This PDF is encrypted with a password. Please unlock it before reversing pages."
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
      const conversionResult = await reversePdfPages(file, {
        filename: file.name,
        mode: options.mode,
        rangeStart: options.rangeStart,
        rangeEnd: options.rangeEnd,
        onProgress: (p) => setProcessingProgress(p),
        signal: abortControllerRef.current.signal
      });

      setResult(conversionResult);
      setStep("result");
    } catch (err) {
      if (err instanceof ReversePdfError && err.code === "CANCELLED") {
        setStep("configure");
        setProcessingProgress(null);
        return;
      }

      if (err instanceof ReversePdfError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message
        });
      } else {
        setError({
          title: "Conversion Failed",
          message: err.message || "An unexpected error occurred while reversing the PDF page order."
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
      title="Reverse PDF Pages"
      description="Reverse the page order of a PDF document online for free."
      currentSlug="reverse-pdf-pages"
      result={result}
      seoContent={<ReversePdfEducationalContent faqs={faqs} />}
    >
      <div className="space-y-8 max-w-4xl mx-auto px-4 py-4">
        {step === "upload" && (
          <UploadZone onFileSelected={handleFileSelected} error={error} />
        )}

        {step === "configure" && file && (
          <div className="space-y-6">
            <PdfFileInfo file={file} pageCount={info?.pageCount} onRemove={handleRemoveFile} />
            <ReverseOptions
              pageCount={info?.pageCount}
              options={options}
              onOptionsChange={setOptions}
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
