"use client";

import React, { useState, useEffect, useRef } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import FormFillWorkspace from "./components/FormFillWorkspace";
import ProcessingState from "./components/ProcessingState";
import FillSuccess from "./components/FillSuccess";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import FillPdfEducationalContent from "./content/educationalContent";
import { FILL_PDF_FORMS_FAQS } from "./content/faqs";
import {
  readPdfFormInfo,
  fillPdfForms,
  getSafeFilledFilename,
  PdfFormFillError,
} from "./engine/pdfFormFiller";

export default function FillPdfFormsFeature({ faqs = FILL_PDF_FORMS_FAQS }) {
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [formValues, setFormValues] = useState({});
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
    setFormValues({});
    setIsProcessing(true);

    try {
      const info = await readPdfFormInfo(selectedFile);
      setFileInfo({
        name: selectedFile.name,
        byteSize: info.byteSize,
        pageCount: info.pageCount,
        fieldCount: info.fieldCount,
        hasFormFields: info.hasFormFields,
        fields: info.fields,
      });

      // Initialize form values state with current read values
      const initialVals = {};
      if (info.fields && info.fields.length > 0) {
        info.fields.forEach((f) => {
          initialVals[f.name] = f.value;
        });
      }
      setFormValues(initialVals);
      setStage("workspace");
    } catch (err) {
      console.error("PDF form info inspection error:", err);
      if (err.code === "PASSWORD_PROTECTED") {
        setFileError({
          title: "Password Protected PDF",
          message: "This PDF document is password-protected. Please unlock the PDF before filling forms.",
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
    setFormValues({});
    setResultData(null);
    setIsProcessing(false);
    setStage("upload");
  };

  const handleValueChange = (fieldName, newValue) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: newValue,
    }));
  };

  const handleResetValues = () => {
    const initialVals = {};
    if (fileInfo && fileInfo.fields) {
      fileInfo.fields.forEach((f) => {
        initialVals[f.name] = f.value;
      });
    }
    setFormValues(initialVals);
  };

  const handleExecuteFill = async () => {
    if (!file) return;

    setStage("processing");
    setIsProcessing(true);
    setProgressStep("Reading PDF document structure...");

    try {
      const res = await fillPdfForms(file, formValues, {}, (stepText) => {
        setProgressStep(stepText);
      });

      // Create Blob and Object URL for download
      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);
      downloadUrlRef.current = downloadUrl;

      const safeFileName = getSafeFilledFilename(file.name);

      setResultData({
        ...res,
        fileName: safeFileName,
        downloadUrl,
      });

      setStage("success");
    } catch (err) {
      console.error("Fill PDF Forms execution error:", err);
      setFileError({
        title: "Form Filling Failed",
        message: err.message || "An unexpected error occurred while filling the PDF form.",
      });
      setStage("workspace");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Fill PDF Forms Online"
      subtitle="Complete interactive PDF form fields, text inputs, checkboxes, and dropdowns directly inside your browser. 100% private in-browser processing."
    >
      <div className="space-y-12">
        
        {stage === "upload" && (
          <UploadZone
            onFileSelected={handleFileSelected}
            error={fileError}
          />
        )}

        {stage === "workspace" && fileInfo && (
          <FormFillWorkspace
            fileInfo={fileInfo}
            formValues={formValues}
            onValueChange={handleValueChange}
            onResetValues={handleResetValues}
            onGenerateFilledPdf={handleExecuteFill}
            onChangeFile={handleReset}
            isProcessing={isProcessing}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <FillSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* Educational Content Section */}
        <div className="pt-8 border-t border-slate-200/80">
          <FillPdfEducationalContent />
        </div>

        {/* FAQs Section */}
        <FAQSection faqs={faqs} />

      </div>
    </ToolLayout>
  );
}
