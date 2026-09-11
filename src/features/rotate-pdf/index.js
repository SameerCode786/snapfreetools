"use client";

import React, { useState } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import RotateWorkspace from "./components/RotateWorkspace";
import ProcessingState from "./components/ProcessingState";
import RotateSuccess from "./components/RotateSuccess";

import { 
  parsePdfMetadata, 
  renderPageThumbnailsBatch, 
  executePdfRotate 
} from "./utils/pdfRotateEngine";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import RotatePdfEducationalContent from "./content/educationalContent";
import { ROTATE_PDF_FAQS } from "./content/faqs";

export default function RotatePDFFeature({ faqs = ROTATE_PDF_FAQS }) {
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'workspace' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  // --- WORKSPACE STATES ---
  const [thumbnails, setThumbnails] = useState([]);
  const [pageRotations, setPageRotations] = useState({}); // { [pageIndex]: degrees (0, 90, 180, 270) }
  const [selectedIndices, setSelectedIndices] = useState([]);

  // --- EXECUTION STATES ---
  const [progress, setProgress] = useState({ percent: 0, message: "" });
  const [resultData, setResultData] = useState(null);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile, customError = null) => {
    if (customError) {
      setFileError(customError);
      return;
    }
    setFileError(null);

    try {
      const parsed = await parsePdfMetadata(rawFile);
      setFile(parsed);
      setPageRotations({});
      setSelectedIndices([]);
      setStage("workspace");

      // Batch render page thumbnails asynchronously
      renderPageThumbnailsBatch(rawFile, 0.3, (p) => {
        // Thumbnail progress if needed
      }).then((thumbs) => {
        setThumbnails(thumbs);
      }).catch((err) => {
        console.warn("Thumbnail background batch rendering warning:", err);
      });

    } catch (err) {
      console.error("PDF Parsing Error:", err);
      if (err.message && err.message.toLowerCase().includes("encrypted")) {
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        setFileError("We couldn't process this PDF. It may be corrupted, encrypted, or use an unsupported PDF structure.");
      }
    }
  };

  // Reset file and workspace
  const handleReset = () => {
    if (resultData && resultData.downloadUrl) {
      URL.revokeObjectURL(resultData.downloadUrl);
    }
    setFile(null);
    setFileError(null);
    setResultData(null);
    setThumbnails([]);
    setPageRotations({});
    setSelectedIndices([]);
    setStage("upload");
  };

  // Rotation State Handlers
  const handleUpdatePageRotation = (pageIndex, degreesAngle) => {
    setPageRotations((prev) => ({
      ...prev,
      [pageIndex]: degreesAngle % 360
    }));
  };

  const handleRotateAll = (addDegrees) => {
    if (!file) return;
    setPageRotations((prev) => {
      const next = { ...prev };
      for (let i = 0; i < file.pageCount; i++) {
        const current = next[i] || 0;
        next[i] = (current + addDegrees) % 360;
      }
      return next;
    });
  };

  const handleRotateSelected = (addDegrees) => {
    if (selectedIndices.length === 0) return;
    setPageRotations((prev) => {
      const next = { ...prev };
      selectedIndices.forEach((idx) => {
        const current = next[idx] || 0;
        next[idx] = (current + addDegrees) % 360;
      });
      return next;
    });
  };

  const handleToggleSelectPage = (pageIndex) => {
    setSelectedIndices((prev) =>
      prev.includes(pageIndex)
        ? prev.filter((i) => i !== pageIndex)
        : [...prev, pageIndex]
    );
  };

  const handleSelectAllPages = () => {
    if (!file) return;
    const all = Array.from({ length: file.pageCount }, (_, i) => i);
    setSelectedIndices(all);
  };

  const handleDeselectAllPages = () => {
    setSelectedIndices([]);
  };

  const handleResetRotations = () => {
    setPageRotations({});
  };

  // Execute PDF Page Rotation
  const handleExecuteRotate = async () => {
    if (!file) return;

    setStage("processing");
    setProgress({ percent: 10, message: "Reading PDF file structure..." });

    try {
      const res = await executePdfRotate({
        file,
        pageRotations,
        onProgress: (p) => setProgress(p)
      });

      setResultData(res);
      setStage("success");
    } catch (err) {
      console.error("PDF Rotation Error:", err);
      setFileError("We couldn't process this PDF. It may be corrupted, encrypted, or use an unsupported PDF structure.");
      setStage("upload");
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF Online Free"
      description="Rotate all PDF pages or individual pages permanently by 90°, 180°, or 270°. 100% free, browser-based, and private."
      currentSlug="rotate-pdf"
      result={stage === "success" && resultData ? {
        summary: `Rotated PDF pages successfully inside browser without rasterizing text.`
      } : null}
      seoContent={
        <>
          <RotatePdfEducationalContent />
          <FAQSection faqs={faqs} />
        </>
      }
    >
      <div className="space-y-12">
        {stage === "upload" && (
          <UploadState
            onFileSelect={handleFileSelect}
            fileError={fileError}
          />
        )}

        {stage === "workspace" && file && (
          <RotateWorkspace
            file={file}
            thumbnails={thumbnails}
            pageRotations={pageRotations}
            selectedIndices={selectedIndices}
            onUpdatePageRotation={handleUpdatePageRotation}
            onRotateAll={handleRotateAll}
            onRotateSelected={handleRotateSelected}
            onToggleSelectPage={handleToggleSelectPage}
            onSelectAllPages={handleSelectAllPages}
            onDeselectAllPages={handleDeselectAllPages}
            onResetRotations={handleResetRotations}
            onResetFile={handleReset}
            onExecuteRotate={handleExecuteRotate}
          />
        )}

        {stage === "processing" && (
          <ProcessingState progress={progress} />
        )}

        {stage === "success" && resultData && (
          <RotateSuccess
            resultData={resultData}
            onReset={handleReset}
          />
        )}
      </div>
    </ToolLayout>
  );
}
