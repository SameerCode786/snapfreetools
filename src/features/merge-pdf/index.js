"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfFileList from "./components/PdfFileList";
import MergeSettings from "./components/MergeSettings";
import MergeProgress from "./components/MergeProgress";
import MergeResults from "./components/MergeResults";
import { parsePdfFileInfo, mergePdfFiles } from "./utils/pdfMerger";
import { EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { MERGE_PDF_FAQS } from "./content/faqs";
import { Combine, AlertCircle, Plus } from "lucide-react";

export default function MergePDFFeature({ faqs = MERGE_PDF_FAQS }) {
  const [files, setFiles] = useState([]);
  const [outputFilename, setOutputFilename] = useState("merged-document");
  
  // App state machine
  const [status, setStatus] = useState("idle"); // idle, loading_files, merging, success
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [progressInfo, setProgressInfo] = useState({ currentFileIndex: 0, totalFiles: 0, filename: "", percent: 0 });
  const [mergedResult, setMergedResult] = useState(null);
  const [error, setError] = useState(null);

  const addMoreInputRef = useRef(null);

  // Clean up Object URLs when thumbnails change or unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.thumbnailUrl) URL.revokeObjectURL(f.thumbnailUrl);
      });
    };
  }, [files]);

  // File parsing handler
  const handleFilesSelected = async (newRawFiles) => {
    setError(null);
    setLoadingFiles(true);

    try {
      const parsedItems = [];
      for (const rawFile of newRawFiles) {
        try {
          const fileInfo = await parsePdfFileInfo(rawFile);
          parsedItems.push(fileInfo);
        } catch (err) {
          console.error(`Error parsing ${rawFile.name}:`, err);
          if (err.name === "PasswordException") {
            setError(`"${rawFile.name}" is password-protected. Please unlock it first.`);
          } else {
            setError(`Could not read "${rawFile.name}". The file may be corrupt.`);
          }
        }
      }

      if (parsedItems.length > 0) {
        setFiles((prev) => [...prev, ...parsedItems]);
      }
    } catch (err) {
      console.error("File loading error:", err);
      setError("An error occurred while parsing PDF files.");
    } finally {
      setLoadingFiles(false);
    }
  };

  // Reordering handlers
  const handleMoveUp = (index) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  const handleMoveDown = (index) => {
    if (index >= files.length - 1) return;
    setFiles((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  const handleReorder = (fromIndex, toIndex) => {
    setFiles((prev) => {
      const updated = [...prev];
      const [movedItem] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, movedItem);
      return updated;
    });
  };

  const handleRemove = (index) => {
    setFiles((prev) => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      if (removed && removed.thumbnailUrl) {
        URL.revokeObjectURL(removed.thumbnailUrl);
      }
      return updated;
    });
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.thumbnailUrl) URL.revokeObjectURL(f.thumbnailUrl);
    });
    setFiles([]);
    setError(null);
    setStatus("idle");
    setMergedResult(null);
  };

  // Add More PDF button trigger
  const handleAddMoreTrigger = () => {
    if (addMoreInputRef.current) {
      addMoreInputRef.current.click();
    }
  };

  const handleAddMoreChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFilesSelected(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  // PDF Merge Execution
  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Please add at least two PDF files to merge.");
      return;
    }

    setError(null);
    setStatus("merging");
    setProgressInfo({ currentFileIndex: 1, totalFiles: files.length, filename: files[0].name, percent: 5 });

    try {
      const result = await mergePdfFiles(files, (progress) => {
        setProgressInfo(progress);
      });

      setMergedResult(result);
      setStatus("success");
    } catch (err) {
      console.error("Merge error:", err);
      setError(err.message || "An error occurred during merging. Please check document structures.");
      setStatus("idle");
    }
  };

  const handleResetResults = () => {
    setStatus("idle");
    setMergedResult(null);
  };

  return (
    <ToolLayout
      title="Merge PDF Online"
      description="Combine multiple PDF documents into one. Preserve original page sizes, orientations, and native vector quality."
      currentSlug="merge-pdf"
      result={status === "success" && mergedResult ? {
        summary: `Merged ${files.length} PDF files (${mergedResult.totalPages} total pages) into a single document.`
      } : null}
      seoContent={
        <>
          <EDUCATIONAL_CONTENT />
          {faqs && faqs.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xs space-y-6">
              <h2 className="text-2xl font-black text-slate-900 text-center tracking-tight">
                Frequently Asked Questions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 space-y-2">
                    <h3 className="font-bold text-slate-800 text-sm">{faq.question}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      }
    >
      <div className="space-y-12 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hidden File Input for Add More trigger */}
        <input
          type="file"
          accept="application/pdf"
          multiple
          ref={addMoreInputRef}
          onChange={handleAddMoreChange}
          className="hidden"
          id="pdf-merge-add-more-input"
        />

        {/* Page Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-2xs">
            <Combine size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Merge PDF Online
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Combine multiple PDF documents into one. Preserve original page sizes, orientations, and native vector quality.
            </p>
          </div>
        </div>

        {/* Global Error Notice Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 max-w-2xl mx-auto text-red-700 animate-slide">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Loading PDF Files Spinner */}
        {loadingFiles && (
          <div className="flex flex-col items-center justify-center space-y-4 min-h-[250px] text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700 animate-pulse">Reading & analyzing PDF documents...</p>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              Extracting page counts and rendering 1st-page thumbnail previews locally.
            </p>
          </div>
        )}

        {/* Workspace State Switcher */}
        {!loadingFiles && status === "idle" && (
          <>
            {files.length === 0 ? (
              <UploadZone onFilesSelected={handleFilesSelected} onError={setError} />
            ) : (
              <div className="space-y-8">
                <PdfFileList
                  files={files}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                  onRemove={handleRemove}
                  onAddMore={handleAddMoreTrigger}
                  onClearAll={handleClearAll}
                  onReorder={handleReorder}
                />

                <MergeSettings
                  files={files}
                  outputFilename={outputFilename}
                  onFilenameChange={setOutputFilename}
                  onMerge={handleMerge}
                  isProcessing={false}
                />
              </div>
            )}
          </>
        )}

        {!loadingFiles && status === "merging" && (
          <MergeProgress progressInfo={progressInfo} />
        )}

        {!loadingFiles && status === "success" && mergedResult && (
          <MergeResults
            mergedBlob={mergedResult.blob}
            filename={outputFilename}
            totalFiles={files.length}
            totalPages={mergedResult.totalPages}
            onReset={handleResetResults}
            onStartOver={handleClearAll}
          />
        )}
      </div>
    </ToolLayout>
  );
}
