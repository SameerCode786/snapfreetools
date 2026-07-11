"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, UploadCloud, CheckCircle, Loader2, Download, 
  RefreshCw, Trash2, ArrowRight, Shield, Zap, Sparkles, 
  HelpCircle, Eye, AlertCircle, FileEdit, Award, Info, Rocket
} from "lucide-react";
import Link from "next/link";
import ToolLayout from "@/layouts/tool-layout";

export default function PDFToWord({ faqs = [] }) {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [pageCount, setPageCount] = useState(null);
  const [conversionState, setConversionState] = useState("idle"); // idle, converting, completed
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [docBlob, setDocBlob] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [scannedPDFDetected, setScannedPDFDetected] = useState(false);
  const [showOcrDialog, setShowOcrDialog] = useState(false);
  const [showOcrConfirmation, setShowOcrConfirmation] = useState(false);
  const [ocrConfidenceWarning, setOcrConfidenceWarning] = useState(null);
  const [isOcrCompleted, setIsOcrCompleted] = useState(false);
  const fileInputRef = useRef(null);
  const activeOcrJobRef = useRef(null);

  React.useEffect(() => {
    return () => {
      if (activeOcrJobRef.current) {
        activeOcrJobRef.current.cancel();
        activeOcrJobRef.current = null;
      }
    };
  }, []);

  // Maximum file size: 25MB
  const MAX_FILE_SIZE = 25 * 1024 * 1024;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    setFileError(null);
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".pdf")) {
      setFileError("Invalid file type. Please select a PDF document (.pdf).");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError("File is too large. Maximum supported size is 25MB.");
      return;
    }

    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }
    setFile(selectedFile);
    setConversionState("idle");
    setProgress(0);
    setDocBlob(null);
    setScannedPDFDetected(false);
    setShowOcrDialog(false);
    setShowOcrConfirmation(false);
    setOcrConfidenceWarning(null);
    setIsOcrCompleted(false);
    
    // Estimate page count client-side by reading raw file text
    const reader = new FileReader();
    reader.onload = function(e) {
      const arrBuffer = e.target.result;
      try {
        const text = new TextDecoder("ascii").decode(new Uint8Array(arrBuffer));
        
        // Search for "/Type /Pages /Count X" in the PDF catalog structure
        const countMatch = text.match(/\/Type\s*\/Pages\s*\/Count\s*(\d+)/);
        if (countMatch && countMatch[1]) {
          setPageCount(parseInt(countMatch[1], 10));
          return;
        }

        // Fallback: count /Type /Page objects
        const pageMatches = text.match(/\/Type\s*\/Page\b/g);
        if (pageMatches) {
          setPageCount(pageMatches.length);
          return;
        }
        
        setPageCount(1); // Default fallback
      } catch (err) {
        setPageCount(1); // Default fallback on parse error
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }
    setFile(null);
    setPageCount(null);
    setFileError(null);
    setConversionState("idle");
    setProgress(0);
    setDocBlob(null);
    setScannedPDFDetected(false);
    setShowOcrDialog(false);
    setShowOcrConfirmation(false);
    setOcrConfidenceWarning(null);
    setIsOcrCompleted(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleConversion = async () => {
    if (!file) return;

    setConversionState("converting");
    setProgress(0);
    setFileError(null);

    try {
      // 1. Loading PDF and worker engine
      setStatusMessage("Loading PDF...");
      setProgress(5);

      const pdfjs = await import("pdfjs-dist");
      
      // Load worker script from cdnjs dynamically to avoid webpack loading issues
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      setPageCount(numPages);

      // 2. Reading pages & Extracting text
      setStatusMessage("Reading pages...");
      setProgress(15);

      const pageTexts = [];
      let totalTextLength = 0;

      for (let i = 1; i <= numPages; i++) {
        setStatusMessage(`Extracting text from page ${i} of ${numPages}...`);
        
        // Progress grows from 20% to 75% depending on extracted pages
        const progressIncrement = Math.round((i / numPages) * 55) + 15;
        setProgress(progressIncrement);

        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        
        // Extract text items safely, filtering out metadata tags
        const pageText = textContent.items
          .filter(item => typeof item.str === "string")
          .map(item => item.str)
          .join(" ");

        pageTexts.push(pageText);
        totalTextLength += pageText.trim().length;
      }

      // Check if document has selectable text
      if (totalTextLength === 0) {
        setConversionState("idle");
        setScannedPDFDetected(true);
        return;
      }

      // 3. Building DOCX container
      setStatusMessage("Building DOCX...");
      setProgress(80);

      const docx = await import("docx");
      const { Document, Paragraph, TextRun, PageBreak, Packer } = docx;

      const docChildren = [];

      for (let i = 0; i < pageTexts.length; i++) {
        // Add a PageBreak before subsequent pages
        if (i > 0) {
          docChildren.push(new Paragraph({
            children: [new PageBreak()]
          }));
        }

        // Map line breaks and paragraph separations
        const paragraphs = pageTexts[i].split("\n\n").map(pText => {
          if (!pText.trim()) return null;
          return new Paragraph({
            children: [
              new TextRun({
                text: pText.trim(),
                size: 24, // 12pt font size
                font: "Arial"
              })
            ],
            spacing: {
              after: 160 // 8pt padding after paragraphs
            }
          });
        }).filter(p => p !== null);

        // Ensure at least one placeholder paragraph is added if the page has whitespace text
        if (paragraphs.length === 0 && pageTexts[i].trim().length > 0) {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({
                text: pageTexts[i].trim(),
                size: 24,
                font: "Arial"
              })
            ]
          }));
        }

        docChildren.push(...paragraphs);
      }

      // 4. Preparing download package
      setStatusMessage("Preparing download...");
      setProgress(95);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      setDocBlob(blob);
      setProgress(100);
      setConversionState("completed");
    } catch (err) {
      console.error("Client-side PDF compilation error:", err);
      setConversionState("idle");
      setFileError(`Conversion failed: ${err.message || "An unexpected error occurred during processing."}`);
    }
  };

  const handleConvertAsImages = async () => {
    if (!file) return;

    setConversionState("converting");
    setProgress(0);
    setScannedPDFDetected(false);
    setFileError(null);

    try {
      setStatusMessage("Preparing pages...");
      setProgress(10);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      setPageCount(numPages);

      const docx = await import("docx");
      const { Document, Paragraph, ImageRun, PageBreak, Packer } = docx;

      const docChildren = [];

      for (let i = 1; i <= numPages; i++) {
        setStatusMessage(`Rendering PDF pages (Page ${i} of ${numPages})...`);
        const progressIncrement = Math.round((i / numPages) * 50) + 15; // 15% to 65%
        setProgress(progressIncrement);

        const page = await pdfDoc.getPage(i);
        
        // Render PDF page to canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };
        await page.render(renderContext).promise;

        // Get blob data from canvas
        const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, "image/jpeg", 0.90));
        
        // Extract array buffer from blob
        const imgBuffer = await imageBlob.arrayBuffer();

        // Standard margin net A4 width is 450pt
        const ratio = viewport.height / viewport.width;
        const imgWidth = 450;
        const imgHeight = 450 * ratio;

        // Add a PageBreak before subsequent pages
        if (i > 1) {
          docChildren.push(new Paragraph({
            children: [new PageBreak()]
          }));
        }

        setStatusMessage(`Embedding images into Word (Page ${i} of ${numPages})...`);
        
        // Add paragraph containing the image
        docChildren.push(new Paragraph({
          children: [
            new ImageRun({
              data: imgBuffer,
              transformation: {
                width: imgWidth,
                height: imgHeight
              }
            })
          ],
          alignment: docx.AlignmentType.CENTER,
          spacing: {
            before: 200,
            after: 200
          }
        }));
      }

      setStatusMessage("Generating DOCX...");
      setProgress(85);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          }
        ]
      });

      setStatusMessage("Preparing download...");
      setProgress(95);

      const blob = await Packer.toBlob(doc);
      setDocBlob(blob);
      setProgress(100);
      setConversionState("completed");
    } catch (err) {
      console.error("Scanned PDF Image Conversion Error:", err);
      setConversionState("idle");
      setScannedPDFDetected(true);
      setFileError(`Image conversion failed: ${err.message || "An unexpected error occurred."}`);
    }
  };

  const handleStartOcrConversion = async () => {
    if (!file) return;

    // Estimate/Validate pages limit (10 pages)
    if (pageCount !== null && pageCount > 10) {
      setFileError("This OCR version supports up to 10 scanned pages per document. Please split larger PDFs and try again.");
      setShowOcrConfirmation(false);
      return;
    }

    setConversionState("converting");
    setProgress(0);
    setFileError(null);
    setOcrConfidenceWarning(null);
    setShowOcrConfirmation(false);
    setIsOcrCompleted(false);

    try {
      setStatusMessage("Preparing OCR engine...");
      setProgress(5);

      const pdfjs = await import("pdfjs-dist");
      pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdfDoc.numPages;
      setPageCount(numPages);

      if (numPages > 10) {
        throw new Error("limit_exceeded");
      }

      // Initialize OCR engine run
      const { runOCR } = await import("./utils/ocr-engine");
      const job = runOCR({
        pdfDoc,
        onProgress: (stage, page, total, percent) => {
          setStatusMessage(stage);
          setProgress(percent);
        }
      });

      activeOcrJobRef.current = job;

      const { ocrResults, averageConfidence } = await job.promise;
      activeOcrJobRef.current = null;

      // 5. Building editable DOCX
      setStatusMessage("Building editable DOCX...");
      setProgress(90);

      // Collect recognized text lengths
      let totalTextLength = 0;
      ocrResults.forEach(r => {
        r.paragraphs.forEach(p => {
          totalTextLength += p.trim().length;
        });
      });

      if (totalTextLength === 0) {
        throw new Error("no_readable_text");
      }

      const docx = await import("docx");
      const { Document, Paragraph, TextRun, PageBreak, Packer } = docx;

      const docChildren = [];

      for (let i = 0; i < ocrResults.length; i++) {
        const pageResult = ocrResults[i];

        // Add a PageBreak before subsequent pages
        if (i > 0) {
          docChildren.push(new Paragraph({
            children: [new PageBreak()]
          }));
        }

        const paragraphs = pageResult.paragraphs.map(pText => {
          return new Paragraph({
            children: [
              new TextRun({
                text: pText,
                size: 24, // 12pt
                font: "Arial"
              })
            ],
            spacing: {
              after: 160 // 8pt padding
            }
          });
        });

        docChildren.push(...paragraphs);
      }

      setStatusMessage("Finalizing download...");
      setProgress(95);

      const doc = new Document({
        sections: [
          {
            properties: {},
            children: docChildren
          }
        ]
      });

      const blob = await Packer.toBlob(doc);
      setDocBlob(blob);

      if (averageConfidence < 60) {
        setOcrConfidenceWarning("OCR completed, but some text may require manual review because the scan quality was low.");
      }

      setIsOcrCompleted(true);
      setProgress(100);
      setConversionState("completed");

    } catch (err) {
      activeOcrJobRef.current = null;
      console.error("OCR execution error:", err);
      
      if (err.message === "cancelled") {
        setConversionState("idle");
        setScannedPDFDetected(true);
        setProgress(0);
        return;
      }

      setConversionState("idle");
      setScannedPDFDetected(true);

      if (err.message === "limit_exceeded") {
        setFileError("This OCR version supports up to 10 scanned pages per document. Please split larger PDFs and try again.");
      } else if (err.message === "no_readable_text") {
        setFileError("OCR could not detect readable text. Please try a clearer or higher-resolution scan.");
      } else {
        setFileError(`OCR compilation failed: ${err.message || "An unexpected error occurred during processing."}`);
      }
    }
  };

  const handleCancelConversion = () => {
    if (activeOcrJobRef.current) {
      activeOcrJobRef.current.cancel();
      activeOcrJobRef.current = null;
    }
    setConversionState("idle");
    setScannedPDFDetected(true);
    setShowOcrConfirmation(false);
    setProgress(0);
  };

  const handleDownload = () => {
    if (!docBlob || !file) return;

    const originalName = file.name;
    const cleanName = originalName.replace(/\.[^/.]+$/, "");
    const url = URL.createObjectURL(docBlob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = isOcrCompleted ? `${cleanName}-ocr-converted.docx` : `${cleanName}-converted.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <ToolLayout>
      <div id="pdf-to-word-page" className="space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            PDF to Word Converter
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
            Convert PDF files into editable Word documents online. Fast, secure, and easy to use.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100">
              <Zap size={13} /> Free to Use
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-amber-700 bg-amber-50 border border-amber-100">
              <Shield size={13} /> No Signup Required
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100">
              <Award size={13} /> Secure Processing
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-700 bg-purple-50 border border-purple-100">
              <FileEdit size={13} /> Editable DOCX Output
            </span>
          </div>
        </div>

        {/* Limitation Warnings */}
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex gap-3">
            <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-red-800 uppercase tracking-wider">OCR Scanned Limitation</h4>
              <p className="text-[11px] text-red-700 leading-relaxed font-semibold mt-1">
                Scanned PDFs or image-based files cannot be converted to editable text as OCR processing is not supported client-side.
              </p>
            </div>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3">
            <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider">Layout Simplification</h4>
              <p className="text-[11px] text-amber-700 leading-relaxed font-semibold mt-1">
                Multi-column templates, floating text tags, and tables will be simplified to a single-column layout flow to preserve editability.
              </p>
            </div>
          </div>
        </div>

        {/* Converter Tool Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-10 max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {conversionState === "idle" && (
              <motion.div
                key="idle-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {scannedPDFDetected ? (
                  showOcrConfirmation ? (
                    /* Premium OCR Confirmation Panel */
                    <div className="space-y-6 text-left">
                      {/* Header */}
                      <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                          <Rocket size={24} />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">Convert Scanned PDF with OCR</h3>
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mt-0.5">OCR Language: English</p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-4 text-xs text-slate-650 font-semibold leading-relaxed">
                        <p className="text-slate-800 font-bold">
                          OCR scans each PDF page and converts recognized English text into an editable Word document. Processing time depends on the number of pages and scan quality.
                        </p>

                        {/* Privacy notice box */}
                        <div className="bg-emerald-50/50 border border-emerald-100/60 rounded-xl p-4 flex gap-2.5 text-emerald-855">
                          <Shield size={16} className="shrink-0 mt-0.5" />
                          <p className="text-[11px]">
                            <strong>Privacy Notice:</strong> Your scanned PDF and recognized text stay inside your browser. Nothing is uploaded to SnapFreeTools or any third-party OCR service.
                          </p>
                        </div>

                        {/* Limitation notice box */}
                        <div className="bg-amber-50/50 border border-amber-100/60 rounded-xl p-4 flex gap-2.5 text-amber-800">
                          <Info size={16} className="shrink-0 mt-0.5" />
                          <p className="text-[11px]">
                            <strong>Limitation Notice:</strong> Complex tables, multi-column layouts, handwriting, decorative fonts, and low-quality scans may not convert perfectly.
                          </p>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <button
                          onClick={handleStartOcrConversion}
                          className="flex-1 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-3 px-6 rounded-xl text-xs shadow-md shadow-amber-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          Start OCR Conversion
                          <ArrowRight size={14} />
                        </button>
                        <button
                          onClick={() => setShowOcrConfirmation(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-xl text-xs transition-all flex items-center justify-center cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Premium Scanned PDF Decision Panel */
                    <div className="space-y-8">
                      {/* Header */}
                      <div className="text-center space-y-3">
                        <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                          <FileText size={28} />
                        </div>
                        <div className="space-y-1">
                          <h2 className="text-xl font-black text-slate-900">Scanned PDF Detected</h2>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-md mx-auto">
                            This document appears to contain scanned pages or images instead of selectable text. Choose how you would like to continue.
                          </p>
                        </div>
                      </div>

                      {/* Options Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Option 1: Convert as Images */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-md transition-all duration-300 group">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-extrabold text-sm text-slate-800">Convert as Images</h3>
                              <span className="text-[9px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-emerald-100/50">
                                Free
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                              Your PDF pages will be inserted into a Microsoft Word document as high-quality images.
                            </p>
                            <div className="space-y-1.5 border-t border-slate-50 pt-3">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Benefits:</p>
                              <ul className="text-[10px] text-slate-650 font-semibold space-y-1.5">
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Preserves the original appearance</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Fast conversion</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ No OCR required</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ 100% Browser Processing</li>
                              </ul>
                            </div>
                            <div className="space-y-1.5 border-t border-slate-50 pt-3">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Limitations:</p>
                              <ul className="text-[10px] text-slate-500 font-semibold space-y-1">
                                <li>• Text will NOT be editable.</li>
                                <li>• Text will NOT be searchable.</li>
                                <li>• Images can still be resized, moved, or deleted inside Microsoft Word.</li>
                              </ul>
                            </div>
                          </div>
                          <button
                            onClick={handleConvertAsImages}
                            className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/10 hover:shadow-lg transition-all mt-6 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            Convert as Images
                            <ArrowRight size={14} />
                          </button>
                        </div>

                        {/* Option 2: Apply OCR & Convert */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-400/50 hover:shadow-md transition-all duration-300 group">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <h3 className="font-extrabold text-sm text-slate-800">Apply OCR & Convert</h3>
                              <span className="text-[9px] bg-amber-50 text-amber-700 font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider border border-amber-100/50">
                                Editable Text
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                              OCR (Optical Character Recognition) scans image-based text and converts it into editable Microsoft Word content.
                            </p>
                            <div className="space-y-1.5 border-t border-slate-50 pt-3">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">OCR can recognize:</p>
                              <ul className="text-[10px] text-slate-650 font-semibold space-y-1.5">
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Printed documents</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Books</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Invoices</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Forms</li>
                                <li className="flex items-center gap-1.5 text-emerald-600">✔ Reports</li>
                              </ul>
                            </div>
                            <div className="space-y-1.5 border-t border-slate-50 pt-3">
                              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">OCR may not perfectly preserve:</p>
                              <ul className="text-[10px] text-slate-500 font-semibold space-y-1">
                                <li>• Complex layouts</li>
                                <li>• Tables</li>
                                <li>• Handwriting</li>
                                <li>• Low-quality scans</li>
                                <li>• Multi-column formatting</li>
                              </ul>
                            </div>
                          </div>
                          <div className="space-y-2 mt-6">
                            <button
                              onClick={() => setShowOcrConfirmation(true)}
                              className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-amber-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              Apply OCR
                              <ArrowRight size={14} />
                            </button>
                            <p className="text-[9px] text-slate-500 font-extrabold text-center uppercase tracking-wider">Editable Text</p>
                          </div>
                        </div>

                      </div>

                    {/* Information Notice */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 space-y-2">
                      <h4 className="font-extrabold text-xs text-blue-800 flex items-center gap-1.5">
                        <Info size={16} className="shrink-0" /> Which option should I choose?
                      </h4>
                      <p className="text-[11px] text-blue-700 leading-relaxed font-semibold">
                        Choose <strong>"Convert as Images"</strong> if you only need the document inside Word while preserving its visual appearance. Choose <strong>"Apply OCR"</strong> if you need editable text. OCR support is planned for a future release.
                      </p>
                    </div>

                    {/* Reset/Cancel Button */}
                    <div className="text-center pt-2">
                      <button
                        onClick={removeFile}
                        className="text-xs text-slate-450 hover:text-slate-600 transition-colors font-bold underline cursor-pointer"
                      >
                        Cancel & Upload New PDF
                      </button>
                    </div>
                  </div>
                )
              ) : !file ? (
                  /* Dropzone */
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={triggerFileSelect}
                    className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[220px]"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="hidden"
                    />
                    <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300">
                      <UploadCloud size={30} />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      Drag & drop PDF file here
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold mt-1">
                      or click to browse from your computer
                    </p>
                    <div className="mt-4 flex gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span>PDF format only</span>
                      <span>•</span>
                      <span>Max file size 25MB</span>
                    </div>
                  </div>
                ) : (
                  /* File Info Display */
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <FileText size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 text-sm truncate">
                          {file.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-semibold mt-1">
                          <span>Size: {(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                          <span>•</span>
                          <span>Pages: {pageCount !== null ? pageCount : "Counting..."}</span>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-slate-400 hover:text-red-500 p-2 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <button
                      onClick={handleConversion}
                      className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold py-4 rounded-xl shadow-md shadow-amber-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Convert to Word
                      <ArrowRight size={18} />
                    </button>
                  </div>
                )}

                {fileError && (
                  fileError.includes("No selectable text") ? (
                    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-2xl space-y-3 text-left">
                      <div className="flex items-center gap-2 text-red-700 font-extrabold text-sm uppercase tracking-wider">
                        <AlertCircle size={18} />
                        Scanned PDF Detected
                      </div>
                      <div className="text-xs text-red-750 space-y-2 leading-relaxed font-semibold">
                        <p className="font-extrabold text-red-900">No selectable text was found in this PDF.</p>
                        <p>This appears to be a scanned or image-based document.</p>
                        <p>Our browser-based converter extracts real selectable text only.</p>
                        <p>Image-based PDFs require OCR (Optical Character Recognition), which is not included in the current browser version.</p>
                        <p>Please use a text-based PDF or convert your scanned document with an OCR tool before trying again.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold">
                      <AlertCircle size={16} />
                      {fileError}
                    </div>
                  )
                )}
              </motion.div>
            )}

            {conversionState === "converting" && (
              <motion.div
                key="converting-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-6 text-center space-y-6"
              >
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                  <Loader2 className="animate-spin text-amber-500" size={48} />
                  <FileText className="absolute text-slate-400" size={20} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    Converting document... {progress}%
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold animate-pulse">
                    {statusMessage}
                  </p>
                </div>

                <div className="w-full bg-slate-100 rounded-full h-2 max-w-md mx-auto overflow-hidden">
                  <div 
                    className="bg-amber-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </motion.div>
            )}

            {conversionState === "completed" && (
              <motion.div
                key="completed-state"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-4 text-center space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle size={32} />
                </div>

                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-800 text-lg">
                    Conversion Successful!
                  </h3>
                  <p className="text-slate-400 text-xs font-semibold">
                    Your editable Word document (.docx) has been created.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {file ? file.name.replace(/\.[^/.]+$/, "") + (isOcrCompleted ? "-ocr-converted.docx" : "-converted.docx") : "document-converted.docx"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Word Document (.docx)
                    </p>
                  </div>
                </div>

                {ocrConfidenceWarning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-md mx-auto flex gap-3 text-left">
                    <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
                      {ocrConfidenceWarning}
                     </p>
                   </div>
                 )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-emerald-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={16} />
                    Download Word File
                  </button>
                  <button
                    onClick={removeFile}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <RefreshCw size={16} />
                    Convert Another
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Guidance & Guidance Information Cards */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Text-based vs Scanned PDFs Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FileEdit className="text-amber-500 shrink-0" size={20} />
                Text-based vs Scanned PDFs
              </h3>
              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest mt-1">Understanding PDF Layouts & Parser Support</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
              <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-extrabold text-xs text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle size={14} className="shrink-0" /> Text-based PDF (Supported)
                </h4>
                <ul className="text-xs text-slate-650 font-semibold space-y-2">
                  <li className="flex items-center gap-2">✔ Editable digital PDFs</li>
                  <li className="flex items-center gap-2">✔ Resume PDFs</li>
                  <li className="flex items-center gap-2">✔ Articles</li>
                  <li className="flex items-center gap-2">✔ Notes</li>
                  <li className="flex items-center gap-2">✔ Invoices</li>
                  <li className="flex items-center gap-2">✔ eBooks</li>
                </ul>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed pt-1">
                  These PDFs contain selectable text and can be converted into editable Word (.docx) documents.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
                <h4 className="font-extrabold text-xs text-red-700 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle size={14} className="shrink-0" /> Scanned PDF (OCR Required)
                </h4>
                <p className="text-[11px] text-slate-700 font-extrabold leading-relaxed">
                  Scanned PDFs are photographs or image-based documents.
                </p>
                <div className="text-[11px] text-slate-600 font-semibold space-y-1">
                  <p className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Examples:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Mobile camera scans</li>
                    <li>Printed paper scans</li>
                    <li>Handwritten document scans</li>
                    <li>Image-only PDFs</li>
                  </ul>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold leading-relaxed pt-1">
                  These files do not contain selectable text. Because this converter runs 100% locally inside your browser and protects your privacy, OCR is not currently included. If no selectable text is detected, conversion will stop safely.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Privacy Notice Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
                  <Shield className="text-emerald-500 shrink-0" size={20} />
                  100% Private Conversion
                </h3>
                <ul className="text-xs text-slate-655 font-semibold space-y-2.5">
                  <li className="flex items-center gap-2 text-slate-700">✔ Files never leave your device.</li>
                  <li className="flex items-center gap-2 text-slate-700">✔ Everything runs locally in your browser.</li>
                  <li className="flex items-center gap-2 text-slate-700">✔ No uploads to our servers.</li>
                  <li className="flex items-center gap-2 text-slate-700">✔ No account required.</li>
                  <li className="flex items-center gap-2 text-slate-700">✔ No file storage.</li>
                </ul>
              </div>
            </div>

            {/* Future Roadmap Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-black text-slate-900 flex items-center gap-2 text-base">
                  <Rocket className="text-amber-500 shrink-0" size={18} />
                  Coming Soon
                </h3>
                <ul className="text-xs text-slate-655 font-semibold space-y-2.5 text-slate-700">
                  <li className="flex items-center gap-2">• OCR support for scanned PDFs</li>
                  <li className="flex items-center gap-2">• Better table preservation</li>
                  <li className="flex items-center gap-2">• Improved multi-column layout conversion</li>
                  <li className="flex items-center gap-2">• Advanced formatting preservation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AI Quick Answer Box */}
        <div className="bg-amber-50/50 border border-amber-100 rounded-3xl p-6 md:p-8 max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-amber-800">
            <Sparkles size={20} className="shrink-0" />
            <h3 className="font-extrabold text-sm uppercase tracking-wider">AI Quick Answer</h3>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 text-base">
              What is the best way to convert PDF to Word?
            </h4>
            <p className="text-slate-600 text-sm leading-relaxed font-semibold">
              The best way to convert PDF to Word is to upload your PDF, convert it into an editable DOCX file, and download the Word document while preserving text, layout, tables, and formatting as much as possible.
            </p>
          </div>
        </div>

        {/* SEO Articles Sections */}
        <div className="max-w-4xl mx-auto space-y-10 border-t border-slate-150 pt-10">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">How to Convert PDF to Word</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Converting your PDF documents into editable Microsoft Word files is incredibly straightforward. Follow these three steps:
            </p>
            <ol className="list-decimal pl-5 space-y-2 text-slate-600 text-sm font-medium">
              <li>
                <strong>Upload Document:</strong> Drag and drop your PDF file directly into the converter box above, or click "Browse File" to select a file from your device directory.
              </li>
              <li>
                <strong>Convert Process:</strong> Click the "Convert to Word" button. Our script begins reading document parameters, mapping structural layouts, and processing textual content.
              </li>
              <li>
                <strong>Save Output:</strong> Click the "Download Word File" button once the conversion completes to save your editable .docx file locally.
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Why Use a PDF to Word Converter?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Although PDF is the standard choice for sharing files securely across platforms, it is notorious for being hard to edit. Storing documents in PDF restricts quick text edits, paragraph formatting, and copy-paste routines. Converting PDF to Word enables you to edit, format, and share documents seamlessly without needing professional layout tools.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">PDF to DOCX vs PDF to DOC</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              When exporting documents from PDF, you can choose between .doc and .docx formats. Understanding the differences helps you choose the correct format:
            </p>
            <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white">
              <table className="min-w-full text-left text-xs font-semibold text-slate-600">
                <thead className="bg-slate-50 text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4">Feature</th>
                    <th className="px-6 py-4">DOC (.doc)</th>
                    <th className="px-6 py-4">DOCX (.docx)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-6 py-3.5 font-bold text-slate-800">Technology</td>
                    <td className="px-6 py-3.5">Older binary file format</td>
                    <td className="px-6 py-3.5">XML-based open standard file format</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-bold text-slate-800">File Size</td>
                    <td className="px-6 py-3.5">Large size footprint</td>
                    <td className="px-6 py-3.5">Highly compressed, small file sizes</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-bold text-slate-800">Formatting</td>
                    <td className="px-6 py-3.5">Risk of minor format shifts</td>
                    <td className="px-6 py-3.5">Preserves layouts and complex tables</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-3.5 font-bold text-slate-800">Compatibility</td>
                    <td className="px-6 py-3.5">Legacy support (Word 97-2003)</td>
                    <td className="px-6 py-3.5">Modern standard compatibility (Word 2007+)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Can scanned PDFs be converted to Word?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Yes. Typical converters extract simple text layers directly from documents. However, image-only scanned files lack text layers, requiring **OCR (Optical Character Recognition)** software. OCR algorithms identify shapes, map characters, and compile them into editable text layers within the final Word output.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">PDF to Word without losing formatting</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              One of the primary challenges in PDF conversions is keeping styles, margins, and shapes aligned. Standard text parses throw all text segments into single rows, breaking layouts. Modern layout analyzers map paragraph flows, table structures, and images, keeping column widths and margins identical to the original PDF container.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Is this PDF to Word converter secure?</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Yes, security is a core pillar of SnapFreeTools. Any metadata parsing or extraction occurs using secure HTTPS channels. Files are never shared or indexed, and all processed documents are completely wiped from our system automatically, ensuring strict privacy protection for personal and corporate files.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto space-y-6 border-t border-slate-150 pt-10">
          <h2 className="text-2xl font-black text-slate-900 text-center">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center py-4 px-6 text-left font-bold text-slate-800 hover:text-amber-500 transition-colors gap-4"
                  >
                    <span className="text-sm">{faq.question}</span>
                    <HelpCircle size={18} className={`text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden bg-slate-50/50 border-t border-slate-100"
                      >
                        <div className="p-6 text-slate-600 text-xs font-semibold leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Tools Section */}
        <div className="max-w-4xl mx-auto space-y-6 border-t border-slate-150 pt-10">
          <h2 className="text-2xl font-black text-slate-900 text-center">Related Productivity Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/word-counter" 
              className="bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-3xl transition-all hover:shadow-sm space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <FileText size={20} />
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm">Word Counter</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Count words, characters, sentences, paragraphs, and estimate reading speed.
              </p>
            </Link>

            <Link 
              href="/image-compressor" 
              className="bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-3xl transition-all hover:shadow-sm space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Eye size={20} />
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm">Image Compressor</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Compress JPG, PNG, WebP, and AVIF formats without losing visual quality.
              </p>
            </Link>

            <Link 
              href="/calculators" 
              className="bg-white border border-slate-200 hover:border-amber-400 p-6 rounded-3xl transition-all hover:shadow-sm space-y-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Award size={20} />
              </div>
              <h3 className="font-extrabold text-slate-850 text-sm">GPA Calculators</h3>
              <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                Calculate your semester GPA, aggregate merit, and grade percentages instantly.
              </p>
            </Link>
          </div>
        </div>

        {/* OCR Coming Soon Modal Dialog */}
        <AnimatePresence>
          {showOcrDialog && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 max-w-md w-full space-y-6 text-center"
              >
                <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Rocket size={24} />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-950">OCR Coming Soon</h3>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    OCR conversion for scanned PDFs is currently under development. The current version of SnapFreeTools focuses on privacy-first browser processing. Future updates will support editable OCR conversion without compromising user privacy.
                  </p>
                </div>

                <button
                  onClick={() => setShowOcrDialog(false)}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-slate-900/10 hover:shadow-lg cursor-pointer"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </ToolLayout>
  );
}
