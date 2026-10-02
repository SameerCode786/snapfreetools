"use client";

import React, { useState, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileInfo from "./components/PdfFileInfo";
import PageSelector from "./components/PageSelector";
import ExtractionOptions from "./components/ExtractionOptions";
import ProcessingState from "./components/ProcessingState";
import ResultState from "./components/ResultState";
import ExtractPdfEducationalContent from "./content/educationalContent";
import { EXTRACT_PDF_FAQS } from "./content/faqs";
import {
  readPdfInfo,
  extractPdfPages,
  getPdfJsEngine,
  ExtractPdfError
} from "./engine/extractPdfEngine";

/**
 * Batch renders low-resolution page thumbnails using pdfjs-dist.
 * Immediately zeros canvas dimensions after rendering to ensure zero memory leaks.
 */
async function generatePageThumbnails(file, pageCount, onProgress = null) {
  try {
    const pdfjs = await getPdfJsEngine();
    const rawArrayBuffer = await file.arrayBuffer();
    const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));
    const pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;

    const thumbnails = [];
    const scale = 0.25;

    for (let p = 1; p <= pageCount; p++) {
      try {
        const page = await pdfDoc.getPage(p);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);

        // Release canvas memory buffer
        canvas.width = 0;
        canvas.height = 0;

        thumbnails.push({
          pageNumber: p,
          pageIndex: p - 1,
          thumbnailUrl: dataUrl
        });
      } catch (err) {
        thumbnails.push({
          pageNumber: p,
          pageIndex: p - 1,
          thumbnailUrl: null
        });
      }

      if (onProgress) {
        onProgress(p, pageCount);
      }

      // Yield main thread every 5 pages to keep UI fluid
      if (p % 5 === 0) {
        await new Promise((r) => setTimeout(r, 0));
      }
    }

    return thumbnails;
  } catch (err) {
    console.error("Failed to generate page thumbnails:", err);
    return [];
  }
}

export default function ExtractPdfFeature({ faqs = EXTRACT_PDF_FAQS }) {
  const [file, setFile] = useState(null);
  const [info, setInfo] = useState(null);
  const [thumbnails, setThumbnails] = useState([]);
  const [selectedPages, setSelectedPages] = useState([]);
  const [isParsingPdf, setIsParsingPdf] = useState(false);
  const [isRenderingThumbnails, setIsRenderingThumbnails] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [step, setStep] = useState("upload"); // "upload" | "configure" | "processing" | "result"

  const abortControllerRef = useRef(null);

  const handleFileSelected = async (selectedFile) => {
    setError(null);
    setFile(selectedFile);
    setResult(null);
    setIsParsingPdf(true);

    try {
      // 1. Parse PDF basic metadata & page count
      const pdfInfo = await readPdfInfo(selectedFile);
      setInfo(pdfInfo);

      // By default select all pages on upload
      const allPages = Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1);
      setSelectedPages(allPages);
      setStep("configure");
      setIsParsingPdf(false);

      // 2. Asynchronously render thumbnails in background
      setIsRenderingThumbnails(true);
      const thumbs = await generatePageThumbnails(selectedFile, pdfInfo.pageCount);
      setThumbnails(thumbs);
      setIsRenderingThumbnails(false);
    } catch (err) {
      setIsParsingPdf(false);
      setIsRenderingThumbnails(false);

      if (err instanceof ExtractPdfError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message || "This PDF is encrypted with a password. Please unlock it before extracting pages."
        });
      } else {
        setError({
          title: "Invalid PDF File",
          message: err.message || "We couldn't parse this PDF document. The file may be corrupt or invalid."
        });
      }
      setFile(null);
      setInfo(null);
      setThumbnails([]);
      setSelectedPages([]);
      setStep("upload");
    }
  };

  const handleRemoveFile = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setFile(null);
    setInfo(null);
    setThumbnails([]);
    setSelectedPages([]);
    setProcessingProgress(null);
    setResult(null);
    setError(null);
    setStep("upload");
  };

  const handleStartExtraction = async () => {
    if (!file || selectedPages.length === 0) return;

    setError(null);
    setStep("processing");
    setProcessingProgress({
      stage: "initializing",
      currentPage: 0,
      totalPages: selectedPages.length,
      percentage: 0
    });

    abortControllerRef.current = new AbortController();

    try {
      const extractionResult = await extractPdfPages(file, selectedPages, {
        filename: file.name,
        allowDuplicates: false,
        onProgress: (p) => setProcessingProgress(p),
        signal: abortControllerRef.current.signal
      });

      setResult(extractionResult);
      setStep("result");
    } catch (err) {
      if (err instanceof ExtractPdfError && err.code === "CANCELLED") {
        setStep("configure");
        setProcessingProgress(null);
        return;
      }

      if (err instanceof ExtractPdfError && err.code === "PASSWORD_PROTECTED") {
        setError({
          title: "Password-Protected PDF",
          message: err.message
        });
      } else {
        setError({
          title: "Extraction Failed",
          message: err.message || "An unexpected error occurred while extracting PDF pages."
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
      title="Extract PDF Pages"
      description="Extract selected pages from a PDF document online for free."
      currentSlug="extract-pdf-pages"
      result={result}
      seoContent={<ExtractPdfEducationalContent faqs={faqs} />}
    >
      <div className="space-y-8 max-w-5xl mx-auto px-4 py-4">
        {step === "upload" && (
          <UploadZone
            onFileSelected={handleFileSelected}
            isLoading={isParsingPdf}
            error={error}
          />
        )}

        {step === "configure" && file && info && (
          <div className="space-y-8">
            <PdfFileInfo
              file={file}
              pageCount={info.pageCount}
              onRemove={handleRemoveFile}
            />

            <PageSelector
              totalPages={info.pageCount}
              thumbnails={thumbnails}
              selectedPages={selectedPages}
              onSelectionChange={setSelectedPages}
              isRenderingThumbnails={isRenderingThumbnails}
            />

            <ExtractionOptions
              selectedCount={selectedPages.length}
              totalPages={info.pageCount}
              selectedPages={selectedPages}
              onExecuteExtraction={handleStartExtraction}
              isProcessing={false}
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
