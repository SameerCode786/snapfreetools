"use client";

import React, { useState, useRef } from "react";
import OcrModeSelector from "./components/OcrModeSelector";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState";
import TablePreview from "./components/TablePreview";
import ProcessingState from "./components/ProcessingState";
import SuccessState from "./components/SuccessState";

import {
  inspectAndExtractTablesFromPdf,
  generateExcelWorkbookBlob,
  isPasswordProtectedError
} from "./utils/pdfToExcelEngine";
import { cancelCurrentOcr } from "./utils/ocrHelper";

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import PdfToExcelEducationalContent from "./content/educationalContent";
import { PDF_TO_EXCEL_FAQS } from "./content/faqs";
import { FileSpreadsheet, XCircle } from "lucide-react";

export default function PdfToExcelFeature({ faqs = PDF_TO_EXCEL_FAQS }) {
  // OCR mode state
  const [ocrEnabled, setOcrEnabled] = useState(false);
  // --- CORE STAGES ---
  const [stage, setStage] = useState("upload"); // 'upload' | 'analyzing' | 'preview' | 'processing' | 'success'
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [isPasswordError, setIsPasswordError] = useState(false);

  // --- ANALYSIS & TABLES ---
  const [analysis, setAnalysis] = useState(null);
  const [tables, setTables] = useState([]);

  // --- EXECUTION & RESULTS ---
  const [progressStep, setProgressStep] = useState("Reading PDF structure...");
  const [resultData, setResultData] = useState(null);

  const isCancelledRef = useRef(false);

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile, forceOcr = null) => {
    isCancelledRef.current = false;
    setFileError(null);
    setIsPasswordError(false);
    setFile(rawFile);
    setStage("analyzing");
    setProgressStep("Analyzing PDF pages & table structures...");

    const activeOcr = forceOcr !== null ? forceOcr : ocrEnabled;
    if (forceOcr !== null) {
      setOcrEnabled(forceOcr);
    }

    try {
      const res = await inspectAndExtractTablesFromPdf(rawFile, {
        onProgress: (stepText) => {
          if (!isCancelledRef.current) {
            setProgressStep(stepText);
          }
        },
        ocrEnabled: activeOcr
      });

      if (isCancelledRef.current) return;

      setAnalysis(res);
      setTables(res.detectedTables || []);
      setStage("preview");

      // Section 10: Verify UI State Log
      const finalLen = (res.detectedTables || []).length;
      console.log(`
==================================================
[PDF-TO-EXCEL UI STATE] EXTRACTION COMPLETE
==================================================
finalDetectedTablesLength: ${finalLen}
finalUIState: preview
showNoReliableTables: ${finalLen === 0}
showTablePreview: ${finalLen > 0}
`);
    } catch (err) {
      if (isCancelledRef.current || (err.message && err.message.includes("cancelled"))) {
        setStage("upload");
        return;
      }

      if (err.isPasswordProtected || isPasswordProtectedError(err)) {
        setIsPasswordError(true);
        setFileError("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      } else {
        console.error("PDF Table Extraction Error:", err);
        setIsPasswordError(false);
        setFileError("We couldn't process this PDF file. It may be corrupted, invalid, or use an unsupported structure.");
      }
      setStage("upload");
    }
  };

  // Cancel in-progress analysis or OCR
  const handleCancelAnalysis = async () => {
    isCancelledRef.current = true;
    await cancelCurrentOcr();
    setStage("upload");
    setProgressStep("Analysis cancelled.");
  };

  // Reprocess current file with OCR enabled
  const handleEnableOcrAndReprocess = () => {
    if (file) {
      handleFileSelect(file, true);
    }
  };

  // Reset workspace
  const handleReset = () => {
    if (resultData && resultData.blobUrl) {
      URL.revokeObjectURL(resultData.blobUrl);
    }
    setFile(null);
    setFileError(null);
    setIsPasswordError(false);
    setAnalysis(null);
    setTables([]);
    setResultData(null);
    setStage("upload");
  };

  // Execute Excel Generation
  const handleGenerateExcel = async () => {
    if (!tables || tables.length === 0) return;

    setStage("processing");
    setProgressStep("Building OpenXML Excel workbook structure...");

    try {
      const res = await generateExcelWorkbookBlob(tables, {
        onProgress: (stepText) => setProgressStep(stepText)
      });

      setResultData({
        ...res,
        originalSize: file ? file.size : 0
      });

      setStage("success");
    } catch (err) {
      console.error("Excel Generation Error:", err);
      setFileError(err.message || "An unexpected error occurred while generating Excel file.");
      setStage("preview");
    }
  };

  return (
    <ToolLayout
      title="PDF to Excel Converter with Free OCR"
      subtitle="Extract PDF tables, financial reports, and spreadsheet data into editable Microsoft Excel (.xlsx) files. Convert selectable and scanned PDFs 100% privately in your browser."
      currentSlug="pdf-to-excel"
    >
      <div className="space-y-12">
        {/* Interactive Workspace Area */}
        {stage === "upload" && (
          <div className="space-y-6">
            <UploadState
              onFileSelected={handleFileSelect}
              error={fileError}
              isPasswordError={isPasswordError}
            />
            <OcrModeSelector ocrEnabled={ocrEnabled} setOcrEnabled={setOcrEnabled} />
          </div>
        )}

        {stage === "analyzing" && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center max-w-xl mx-auto shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <FileSpreadsheet size={32} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">
                {ocrEnabled ? "Processing & OCR Analysis..." : "Analyzing PDF Tables..."}
              </h3>
              <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">{progressStep}</p>
            </div>
            <div>
              <button
                onClick={handleCancelAnalysis}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle size={15} />
                <span>Cancel Processing</span>
              </button>
            </div>
          </div>
        )}

        {stage === "preview" && analysis && (
          <TablePreview
            analysis={analysis}
            tables={tables}
            setTables={setTables}
            onResetFile={handleReset}
            onGenerateExcel={handleGenerateExcel}
            ocrEnabled={ocrEnabled}
            onEnableOcrAndReprocess={handleEnableOcrAndReprocess}
          />
        )}

        {stage === "processing" && (
          <ProcessingState stepText={progressStep} />
        )}

        {stage === "success" && resultData && (
          <SuccessState
            result={resultData}
            onReset={handleReset}
          />
        )}

        {/* SEO Educational Content */}
        <div className="pt-8 border-t border-slate-200/80">
          <PdfToExcelEducationalContent />
        </div>

        {/* SEO FAQ Section */}
        <FAQSection faqs={faqs} />
      </div>
    </ToolLayout>
  );
}
