"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import FlattenOptions from "./components/FlattenOptions";
import ProcessingState from "./components/ProcessingState";
import FlattenSuccess from "./components/FlattenSuccess";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import FlattenPdfEducationalContent from "./content/educationalContent";
import { FLATTEN_PDF_FAQS } from "./content/faqs";
import {
  readPdfInfo,
  flattenPdf,
  getSafeFlattenedFilename,
  PdfFlattenError,
} from "./engine/pdfFlattener";

export default function FlattenPdfFeature({ faqs = FLATTEN_PDF_FAQS }) {
  const [stage, setStage] = useState("upload"); // 'upload' | 'options' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const downloadUrlRef = useRef(null);

  // Clean up created Blob URLs on unmount or reset
  useEffect(() => {
    return () => {
      if (downloadUrlRef.current) {
        URL.revokeObjectURL(downloadUrlRef.current);
      }
    };
  }, []);

  const handleFileSelected = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileError(null);
    setResultData(null);
    setIsProcessing(true);

    try {
      const info = await readPdfInfo(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        byteSize: info.byteSize,
        pageCount: info.pageCount,
        fieldCount: info.fieldCount,
        formHasFields: info.formHasFields,
      });
      setStage("options");
    } catch (err) {
      console.error("PDF info inspection error:", err);
      if (err.code === "PASSWORD_PROTECTED") {
        setFileError({
          title: "Password Protected PDF",
          message: "This PDF document is password-protected. Please unlock the PDF before flattening.",
        });
      } else if (err.code === "CORRUPTED_PDF") {
        setFileError({
          title: "Corrupted PDF Document",
          message: "We couldn't read this PDF structure. The file may be damaged or malformed.",
        });
      } else {
        setFileError({
          title: "File Reading Error",
          message: err.message || "Failed to inspect PDF document structure. Please select a valid PDF.",
        });
      }
      setStage("upload");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    if (downloadUrlRef.current) {
      URL.revokeObjectURL(downloadUrlRef.current);
      downloadUrlRef.current = null;
    }
    setFile(null);
    setFileInfo(null);
    setFileError(null);
    setResultData(null);
    setIsProcessing(false);
    setStage("upload");
  };

  const handleExecuteFlatten = async () => {
    if (!file) return;

    setStage("processing");
    setIsProcessing(true);
    setProgressStep("Reading PDF document structure...");

    try {
      const res = await flattenPdf(file, {}, (stepText) => {
        setProgressStep(stepText);
      });

      // Create Blob and Object URL for download
      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      downloadUrlRef.current = downloadUrl;

      const safeFileName = getSafeFlattenedFilename(file.name);

      setResultData({
        ...res,
        fileName: safeFileName,
        downloadUrl,
      });

      setStage("success");
    } catch (err) {
      console.error("Flatten PDF execution error:", err);
      setFileError({
        title: "Flattening Failed",
        message: err.message || "An unexpected error occurred while flattening the PDF file.",
      });
      setStage("options");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Flatten PDF Online"
      subtitle="Bake fillable forms, text fields, and interactive annotations into permanent PDF page content. 100% private in-browser processing."
    >
      <div className="space-y-12">
        
        {stage === "upload" && (
          <UploadZone
            onFileSelected={handleFileSelected}
            error={fileError}
          />
        )}

        {stage === "options" && fileInfo && (
          <FlattenOptions
            fileInfo={fileInfo}
            onFlatten={handleExecuteFlatten}
            onChangeFile={handleReset}
            isProcessing={isProcessing}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <FlattenSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* Educational Content Section */}
        <div className="pt-8 border-t border-slate-200/80">
          <FlattenPdfEducationalContent />
        </div>

        {/* FAQs Section */}
        <FAQSection faqs={faqs} />

      </div>
    </ToolLayout>
  );
}
