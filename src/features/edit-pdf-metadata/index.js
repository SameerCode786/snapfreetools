"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { AlertCircle, Lock, RefreshCw, Sliders } from "lucide-react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import MetadataForm from "./components/MetadataForm";
import MetadataDiffPreview from "./components/MetadataDiffPreview";
import EDUCATIONAL_CONTENT from "./content/educationalContent";
import {
  readPdfMetadata,
  updatePdfMetadata,
  clearPdfMetadata,
  PdfMetadataError,
} from "./engine/pdfMetadataEditor";

export default function EditPdfMetadataFeature() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loaded | error
  const [originalMetadata, setOriginalMetadata] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState(null);
  const [updatedResult, setUpdatedResult] = useState(null);
  const [errorInfo, setErrorInfo] = useState(null);

  const [isDirty, setIsDirty] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const objectUrlRef = useRef(null);

  // Clean up Object URLs on unmount
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorInfo(null);
    setOriginalMetadata(null);
    setCurrentMetadata(null);
    setUpdatedResult(null);
    setIsDirty(false);
    setHasApplied(false);
    setIsProcessing(true);

    try {
      const readout = await readPdfMetadata(selectedFile);
      setOriginalMetadata(readout);
      setCurrentMetadata({ ...readout });
      setStatus("loaded");
    } catch (err) {
      console.error("PDF Metadata reading error:", err);
      setStatus("error");

      if (err.code === "PASSWORD_PROTECTED") {
        setErrorInfo({
          type: "PASSWORD_PROTECTED",
          title: "Password Protected PDF",
          message:
            "This PDF document is password-protected. Please unlock the PDF before editing document metadata.",
          showUnlockLink: true,
        });
      } else if (err.code === "CORRUPTED_PDF") {
        setErrorInfo({
          type: "CORRUPTED_PDF",
          title: "Corrupted PDF Document",
          message:
            "Unable to read PDF structure. The file may be corrupted or invalid.",
        });
      } else {
        setErrorInfo({
          type: "UNKNOWN",
          title: "Metadata Inspection Failed",
          message:
            err.message ||
            "An unexpected error occurred while processing the PDF file. Please try again.",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormChange = (newMetadata) => {
    setCurrentMetadata(newMetadata);

    // Check dirty state against original metadata
    const dirty =
      (newMetadata.title || "").trim() !== (originalMetadata?.title || "").trim() ||
      (newMetadata.author || "").trim() !== (originalMetadata?.author || "").trim() ||
      (newMetadata.subject || "").trim() !== (originalMetadata?.subject || "").trim() ||
      (newMetadata.keywords || "").trim() !== (originalMetadata?.keywords || "").trim() ||
      (newMetadata.creator || "").trim() !== (originalMetadata?.creator || "").trim() ||
      (newMetadata.producer || "").trim() !== (originalMetadata?.producer || "").trim();

    setIsDirty(dirty);
    setHasApplied(false);
  };

  const handleResetForm = () => {
    if (!originalMetadata) return;
    setCurrentMetadata({ ...originalMetadata });
    setIsDirty(false);
    setHasApplied(false);
  };

  const handleClearForm = () => {
    setCurrentMetadata((prev) => ({
      ...prev,
      title: "",
      author: "",
      subject: "",
      keywords: "",
      creator: "",
      producer: "",
    }));
    setIsDirty(true);
    setHasApplied(false);
  };

  const handleApplyChanges = async () => {
    if (!file || !currentMetadata) return;

    setIsProcessing(true);
    try {
      const result = await updatePdfMetadata(file, currentMetadata);
      setUpdatedResult(result);
      setHasApplied(true);
      setIsDirty(false);

      // Revoke previous object URL if any
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const blob = new Blob([result.pdfBytes], { type: "application/pdf" });
      objectUrlRef.current = URL.createObjectURL(blob);
    } catch (err) {
      console.error("Apply metadata changes error:", err);
      setStatus("error");
      setErrorInfo({
        type: "PROCESSING_FAILED",
        title: "Metadata Update Failed",
        message:
          err.message || "Failed to update PDF document metadata. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getSafeBaseName = (filename) => {
    if (!filename) return "document";
    return filename
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .toLowerCase();
  };

  const handleDownload = () => {
    if (!objectUrlRef.current) return;

    const baseName = getSafeBaseName(file?.name);
    const downloadFilename = `${baseName}-metadata-edited.pdf`;

    const link = document.createElement("a");
    link.href = objectUrlRef.current;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetAll = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setFile(null);
    setStatus("idle");
    setOriginalMetadata(null);
    setCurrentMetadata(null);
    setUpdatedResult(null);
    setErrorInfo(null);
    setIsDirty(false);
    setHasApplied(false);
    setIsProcessing(false);
  };

  return (
    <ToolLayout
      title="Edit PDF Metadata"
      description="Edit PDF document title, author, subject, keywords, creator, and timestamps instantly in your browser."
      currentSlug="edit-pdf-metadata"
      seoContent={<EDUCATIONAL_CONTENT />}
    >
      <div className="w-full space-y-8">
        {/* State 1: Upload Zone (Idle) */}
        {status === "idle" && (
          <UploadZone
            onFileSelect={handleFileSelect}
            onError={(msg) => {
              if (msg) {
                setStatus("error");
                setErrorInfo({
                  type: "VALIDATION",
                  title: "Invalid File",
                  message: msg,
                });
              } else {
                setErrorInfo(null);
              }
            }}
          />
        )}

        {/* State 2: Metadata Editor & Diff Preview */}
        {status === "loaded" && originalMetadata && currentMetadata && (
          <div className="space-y-8">
            <MetadataForm
              originalMetadata={originalMetadata}
              currentMetadata={currentMetadata}
              onChange={handleFormChange}
              onReset={handleResetForm}
              onClear={handleClearForm}
              onApply={handleApplyChanges}
              onDownload={handleDownload}
              isDirty={isDirty}
              hasApplied={hasApplied}
              isProcessing={isProcessing}
              originalFilename={file?.name}
            />

            {/* Metadata Comparison Preview */}
            <MetadataDiffPreview
              originalMetadata={originalMetadata}
              currentMetadata={currentMetadata}
            />

            {/* Reset / Try Another Document Button */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={handleResetAll}
                className="py-2.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all inline-flex items-center gap-2"
              >
                <RefreshCw size={14} /> Edit Another PDF Document
              </button>
            </div>
          </div>
        )}

        {/* State 3: Error Display Banner */}
        {status === "error" && errorInfo && (
          <div className="w-full max-w-3xl mx-auto bg-white border border-red-200 rounded-3xl p-8 text-center space-y-6 shadow-xs animate-fade">
            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto text-red-500 shadow-inner">
              {errorInfo.type === "PASSWORD_PROTECTED" ? (
                <Lock size={26} />
              ) : (
                <AlertCircle size={26} />
              )}
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="font-extrabold text-slate-800 text-lg">
                {errorInfo.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                {errorInfo.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {errorInfo.showUnlockLink && (
                <Link
                  href="/unlock-pdf"
                  className="py-3 px-6 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all w-full sm:w-auto text-center"
                >
                  Unlock PDF First
                </Link>
              )}
              <button
                type="button"
                onClick={handleResetAll}
                className="py-3 px-6 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 w-full sm:w-auto"
              >
                <RefreshCw size={14} /> Try Another PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
