"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import ModeSelectionModal from "./components/ModeSelectionModal";
import SignPdfWorkspace from "./components/SignPdfWorkspace";
import ProcessingState from "./components/ProcessingState";
import SignPdfSuccess from "./components/SignPdfSuccess";

import {
  parsePdfMetadata,
  executePdfSigning
} from "./utils/signPdfEngine.js";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import SignPdfEducationalContent from "./content/educationalContent";
import { SIGN_PDF_FAQS } from "./content/faqs";

export default function SignPdfFeature({ faqs = SIGN_PDF_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'mode-select' | 'workspace' | 'processing' | 'success'
  const [mode, setMode] = useState("only-me"); // 'only-me' | 'several-people'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);

  // --- EXECUTION STATES ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setIsModeModalOpen(true);
      setStage("mode-select");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.isPasswordProtected || (err.message && err.message.toLowerCase().includes("password"))) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("We couldn't process this PDF. It may be corrupted, encrypted, or use an unsupported structure.");
      }
    }
  };

  // Mode Selection: Only Me
  const handleSelectOnlyMe = () => {
    setMode("only-me");
    setIsModeModalOpen(false);
    setStage("workspace");
  };

  // Mode Selection: Several People
  const handleSelectSeveralPeople = () => {
    setMode("several-people");
    setIsModeModalOpen(false);
    setStage("workspace");
  };

  // Reset file and workspace
  const handleReset = () => {
    if (resultData && resultData.downloadUrl) {
      URL.revokeObjectURL(resultData.downloadUrl);
    }
    setFile(null);
    setFileError(null);
    setResultData(null);
    setIsModeModalOpen(false);
    setMode("only-me");
    setStage("upload");
  };

  // Execute PDF Signing (Only Me flow)
  const handleExecuteSign = async (fieldsByPage) => {
    if (!file) return;

    setStage("processing");
    setProgressStep("Reading PDF structure...");

    try {
      const res = await executePdfSigning({
        file,
        fieldsByPage,
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("Sign PDF execution error:", err);
      setFileError(err.message || "An unexpected error occurred while signing PDF.");
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Sign PDF Online Free – Add Signature, Initials & Form Fields"
      subtitle="Draw, type, or upload your electronic signature, initials, date, text, and stamps onto any PDF page. 100% private in your browser with zero server uploads."
      currentSlug="sign-pdf"
    >
      <div className="space-y-12">
        {/* Interactive Workspace Area */}
        {stage === "upload" && (
          <UploadState
            onFileSelected={handleFileSelect}
            error={fileError}
          />
        )}

        {stage === "mode-select" && (
          <div className="py-8">
            <UploadState
              onFileSelected={handleFileSelect}
              error={fileError}
            />
            <ModeSelectionModal
              isOpen={isModeModalOpen}
              fileName={file?.name}
              onSelectOnlyMe={handleSelectOnlyMe}
              onSelectSeveralPeople={handleSelectSeveralPeople}
            />
          </div>
        )}

        {stage === "workspace" && file && (
          <SignPdfWorkspace
            file={file}
            mode={mode}
            onResetFile={handleReset}
            onExecuteSign={handleExecuteSign}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <SignPdfSuccess
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational Content */}
        <div className="pt-8 border-t border-slate-200/80">
          <SignPdfEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
