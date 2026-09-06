"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadState from "./components/UploadState";
import PdfAnalysisCard from "./components/PdfAnalysisCard";
import ModeSpecificPages from "./components/ModeSpecificPages";
import ModeEveryPage from "./components/ModeEveryPage";
import ModeCustomRanges from "./components/ModeCustomRanges";
import ModeEveryNPages from "./components/ModeEveryNPages";
import ModeVisualSelection from "./components/ModeVisualSelection";
import OutputPreviewCard from "./components/OutputPreviewCard";
import ProcessingState from "./components/ProcessingState";
import SplitSuccess from "./components/SplitSuccess";

import { parsePdfMetadata } from "./utils/thumbnailRenderer";
import { parsePageRanges, validateCustomRangeGroups } from "./utils/rangeParser";
import { executePdfSplit } from "./utils/pdfSplitterEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import SplitPdfEducationalContent from "./content/educationalContent";

export default function SplitPDFFeature({ faqs = [] }) {
  // --- CORE STATES ---
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'

  // --- SPLIT MODE STATES ---
  const [activeMode, setActiveMode] = useState("specific-pages");
  const [rangeValue, setRangeValue] = useState("");
  const [customRanges, setCustomRanges] = useState([]);
  const [everyN, setEveryN] = useState("2");
  const [selectedIndices, setSelectedIndices] = useState([]);

  // --- EXECUTION STATES ---
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [resultData, setResultData] = useState(null);
  const [processError, setProcessError] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);
    setProcessError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      
      // Default Mode 1 range value to all pages (e.g. 1-10)
      setRangeValue(`1-${parsed.pageCount}`);

      // Default Mode 3 custom ranges
      const half = Math.max(1, Math.floor(parsed.pageCount / 2));
      setCustomRanges([
        { id: 1, startPage: "1", endPage: half.toString() },
        { id: 2, startPage: (half + 1 > parsed.pageCount ? half : half + 1).toString(), endPage: parsed.pageCount.toString() }
      ]);

      // Default Mode 5 visual selection (all pages selected initially)
      const allIndices = Array.from({ length: parsed.pageCount }, (_, i) => i);
      setSelectedIndices(allIndices);

      setStage("workspace");
    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.message && err.message.toLowerCase().includes("encrypted")) {
        setFileError("This PDF is password-protected. Please unlock it before splitting.");
      } else {
        setFileError("Failed to read PDF file. The file may be corrupt or invalid.");
      }
    }
  };

  // Reset file and workspace
  const handleReset = () => {
    // Revoke Blob URLs
    if (resultData) {
      if (resultData.zipUrl) URL.revokeObjectURL(resultData.zipUrl);
      if (resultData.outputFiles) {
        resultData.outputFiles.forEach(f => f.url && URL.revokeObjectURL(f.url));
      }
    }

    setFile(null);
    setFileError(null);
    setProcessError(null);
    setResultData(null);
    setStage("upload");
  };

  // Visual selection helpers
  const handleTogglePage = (idx) => {
    setSelectedIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSelectAllVisual = () => {
    if (!file) return;
    const all = Array.from({ length: file.pageCount }, (_, i) => i);
    setSelectedIndices(all);
  };

  const handleClearSelectionVisual = () => {
    setSelectedIndices([]);
  };

  // Derive dynamic output summary text and validity based on active mode
  const getModeValidationAndSummary = () => {
    if (!file) return { isValid: false, summary: "" };

    if (activeMode === "specific-pages") {
      const parsed = parsePageRanges(rangeValue, file.pageCount);
      if (!parsed.isValid) return { isValid: false, summary: parsed.error || "Invalid range" };
      return {
        isValid: true,
        summary: `Will create 1 PDF document containing ${parsed.pageIndices.length} selected page${parsed.pageIndices.length > 1 ? "s" : ""}.`
      };
    }

    if (activeMode === "every-page") {
      return {
        isValid: true,
        summary: `Will create ${file.pageCount} single-page PDF files.`
      };
    }

    if (activeMode === "custom-ranges") {
      const validated = validateCustomRangeGroups(customRanges, file.pageCount);
      if (!validated.isValid) return { isValid: false, summary: validated.error || "Invalid ranges" };
      return {
        isValid: true,
        summary: `Will create ${validated.ranges.length} custom PDF document${validated.ranges.length > 1 ? "s" : ""}.`
      };
    }

    if (activeMode === "every-n-pages") {
      const n = parseInt(everyN, 10) || 1;
      const validN = Math.max(1, Math.min(n, file.pageCount));
      const count = Math.ceil(file.pageCount / validN);
      return {
        isValid: true,
        summary: `Will create ${count} PDF file${count > 1 ? "s" : ""} (split every ${validN} page${validN > 1 ? "s" : ""}).`
      };
    }

    if (activeMode === "visual-selection") {
      if (selectedIndices.length === 0) {
        return { isValid: false, summary: "Please select at least one page thumbnail." };
      }
      const sorted = [...selectedIndices].sort((a, b) => a - b);
      return {
        isValid: true,
        summary: `Will create 1 PDF file containing ${sorted.length} visually selected page${sorted.length > 1 ? "s" : ""}.`
      };
    }

    return { isValid: false, summary: "" };
  };

  const { isValid: canSplit, summary: summaryText } = getModeValidationAndSummary();

  // Execute PDF Split Action
  const handleExecuteSplit = async () => {
    if (!canSplit || !file) return;

    setStage("processing");
    setProgress({ percent: 5, message: "Preparing PDF pages..." });
    setProcessError(null);

    let modeSettings = {};

    if (activeMode === "specific-pages") {
      const parsed = parsePageRanges(rangeValue, file.pageCount);
      modeSettings = { pageIndices: parsed.pageIndices };
    } else if (activeMode === "custom-ranges") {
      const validated = validateCustomRangeGroups(customRanges, file.pageCount);
      modeSettings = { ranges: validated.ranges };
    } else if (activeMode === "every-n-pages") {
      modeSettings = { n: parseInt(everyN, 10) || 1 };
    } else if (activeMode === "visual-selection") {
      const sorted = [...selectedIndices].sort((a, b) => a - b);
      modeSettings = { selectedPageIndices: sorted };
    }

    try {
      const res = await executePdfSplit({
        file,
        mode: activeMode,
        settings: modeSettings,
        onProgress: (p) => setProgress(p)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("PDF Split Error:", err);
      setProcessError(err.message || "An unexpected error occurred while splitting the PDF.");
      setStage("workspace");
    }
  };

  return (
    <ToolLayout
      title="Split PDF Online Free"
      description="Separate PDF pages, extract page ranges, or split into individual PDFs. 100% fast, browser-based, and private."
      currentSlug="split-pdf"
      result={stage === "success" && resultData ? {
        summary: `Split PDF into ${resultData.totalOutputFiles} separate file${resultData.totalOutputFiles > 1 ? "s" : ""} cleanly in browser.`
      } : null}
      seoContent={
        <>
          <SplitPdfEducationalContent />
          {faqs && faqs.length > 0 && <FAQSection faqs={faqs} />}
        </>
      }
    >
      <div className="space-y-12">
        {/* Workspace Stepper Stages */}
        {stage === "upload" && (
          <UploadState
            onFileSelect={handleFileSelect}
            fileError={fileError}
          />
        )}

        {stage === "workspace" && file && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {processError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 font-bold text-xs">
                ⚠️ {processError}
              </div>
            )}

            <PdfAnalysisCard
              file={file}
              activeMode={activeMode}
              onSelectMode={setActiveMode}
              onResetFile={handleReset}
            />

            {/* Mode-Specific Settings Component */}
            {activeMode === "specific-pages" && (
              <ModeSpecificPages
                totalPages={file.pageCount}
                rangeValue={rangeValue}
                onChangeRange={setRangeValue}
              />
            )}

            {activeMode === "every-page" && (
              <ModeEveryPage
                totalPages={file.pageCount}
              />
            )}

            {activeMode === "custom-ranges" && (
              <ModeCustomRanges
                totalPages={file.pageCount}
                ranges={customRanges}
                onChangeRanges={setCustomRanges}
              />
            )}

            {activeMode === "every-n-pages" && (
              <ModeEveryNPages
                totalPages={file.pageCount}
                nValue={everyN}
                onChangeN={setEveryN}
              />
            )}

            {activeMode === "visual-selection" && (
              <ModeVisualSelection
                file={file}
                selectedIndices={selectedIndices}
                onTogglePage={handleTogglePage}
                onSelectAll={handleSelectAllVisual}
                onClearSelection={handleClearSelectionVisual}
              />
            )}

            {/* Output Preview Banner & Primary Split CTA */}
            <OutputPreviewCard
              summaryText={summaryText}
              isValid={canSplit}
              onExecuteSplit={handleExecuteSplit}
            />
          </div>
        )}

        {stage === "processing" && (
          <ProcessingState progress={progress} />
        )}

        {stage === "success" && resultData && (
          <SplitSuccess
            resultData={resultData}
            onReset={handleReset}
          />
        )}
      </div>
    </ToolLayout>
  );
}
