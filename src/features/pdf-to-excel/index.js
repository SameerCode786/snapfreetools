"use client";

import React, { useState } from "react";
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

import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import PdfToExcelEducationalContent from "./content/educationalContent";
import { PDF_TO_EXCEL_FAQS } from "./content/faqs";
import { FileSpreadsheet } from "lucide-react";

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

  // Handle uploaded File selection
  const handleFileSelect = async (rawFile) => {
    setFileError(null);
    setIsPasswordError(false);
    setFile(rawFile);
    setStage("analyzing");
    setProgressStep("Analyzing PDF pages & table structures...");

    try {
      const res = await inspectAndExtractTablesFromPdf(rawFile, {
        onProgress: (stepText) => setProgressStep(stepText),
        ocrEnabled
      });

      setAnalysis(res);
      setTables(res.detectedTables || []);
      setStage("preview");
    } catch (err) {
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
      title="PDF to Excel Converter Online Free"
      subtitle="Extract PDF tables, financial reports, and spreadsheet data into editable Microsoft Excel (.xlsx) files. 100% private in your browser."
      currentSlug="pdf-to-excel"
    >
      <div className="space-y-12">
        {/* Interactive Workspace Area */}
        {stage === "upload" && (
          <UploadState
            onFileSelected={handleFileSelect}
            error={fileError}
            isPasswordError={isPasswordError}
          />
        )}
        {stage === "upload" && (
          <OcrModeSelector ocrEnabled={ocrEnabled} setOcrEnabled={setOcrEnabled} />
        )}

        {stage === "analyzing" && (
          <div className="bg-white border border-slate-200/90 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
              <FileSpreadsheet size={32} className="animate-bounce" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">Analyzing PDF Tables...</h3>
              <p className="text-sm font-semibold text-slate-500 max-w-sm mx-auto">{progressStep}</p>
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
