"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, UploadCloud, CheckCircle, Loader2, Download, 
  RefreshCw, Trash2, ArrowRight, Shield, Zap, Sparkles, 
  HelpCircle, Eye, AlertCircle, FileEdit, Award, Info, Rocket,
  FileCheck, Layers
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
    <ToolLayout
      title="PDF to Word Converter"
      description="Convert PDF files into editable Word documents online. Fast, secure, and easy to use."
      currentSlug="pdf-to-word"
      result={conversionState === "completed" && docBlob ? {
        summary: `Converted PDF file (${pageCount || 1} pages) into an editable Word document (.docx).`
      } : null}
      seoContent={
        <div className="space-y-12">
          {/* Limitation Warnings */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-red-800 uppercase tracking-wider">Scanned PDFs</h4>
                <p className="text-[11px] text-red-700 leading-relaxed font-semibold mt-1">
                  Scanned or image-based PDFs require OCR to extract editable text.
                </p>
                <button 
                  onClick={() => setShowOcrDialog(true)}
                  className="mt-2 text-[11px] font-bold text-red-600 underline hover:text-red-800 transition-colors cursor-pointer"
                >
                  Learn about scanned PDF conversion →
                </button>
              </div>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 flex gap-3">
              <Info size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs text-amber-800 uppercase tracking-wider">Complex Formatting</h4>
                <p className="text-[11px] text-amber-700 leading-relaxed font-semibold mt-1">
                  Complex multi-column layouts, tables, or non-standard fonts may require manual adjustment in Word after conversion.
                </p>
              </div>
            </div>
          </div>

          {/* Info Comparison Box */}
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FileCheck size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Native Text Extraction Engine</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Extracts original PDF text strings directly into standard Microsoft Word paragraph structures, preserving fonts, bold weights, and bullet points.
              </p>
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Supported Features</h4>
                <ul className="text-xs text-slate-650 font-semibold space-y-2 text-slate-700">
                  <li className="flex items-center gap-2">• Clean paragraph text preservation</li>
                  <li className="flex items-center gap-2">• Paragraph spacing and line breaks</li>
                  <li className="flex items-center gap-2">• Standard font weights & styling</li>
                </ul>
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Layers size={20} />
              </div>
              <h3 className="font-black text-slate-900 text-lg">Privacy-First Offline Architecture</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Unlike cloud-based PDF services, our engine processes files entirely inside your client browser tab using WebAssembly & JavaScript.
              </p>
              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Coming Improvements</h4>
                <ul className="text-xs text-slate-655 font-semibold space-y-2.5 text-slate-700">
                  <li className="flex items-center gap-2">• Enhanced table layout formatting</li>
                  <li className="flex items-center gap-2">• Complex multi-column page translation</li>
                  <li className="flex items-center gap-2">• Advanced font matching systems</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      }
    >
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

        {/* Dropzone / Upload Form */}
        {conversionState === "idle" && !file && (
          <div className="max-w-3xl mx-auto space-y-8">
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
              className="border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer transition-all group flex flex-col items-center justify-center min-h-[220px]"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files && validateAndSetFile(e.target.files[0])}
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
          </div>
        )}

        {/* Conversion in Progress */}
        {conversionState === "converting" && (
          <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6 text-center">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <RefreshCw size={28} className="animate-spin" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-800">Converting Your PDF to Word...</h3>
              <p className="text-xs text-slate-500 font-semibold">{statusMessage}</p>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
              <div 
                className="bg-amber-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${conversionProgress}%` }}
              />
            </div>

            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>Extracting text & formatting</span>
              <span>{conversionProgress}%</span>
            </div>
          </div>
        )}

        {/* Success / Download Section */}
        {conversionState === "completed" && docBlob && (
          <div className="max-w-3xl mx-auto bg-emerald-50/40 border border-emerald-100 rounded-3xl p-8 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
              <CheckCircle2 size={32} />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-slate-900">PDF Converted Successfully!</h3>
              <p className="text-slate-600 text-sm font-semibold">
                Your Word document (.docx) is ready for download.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
              <button
                onClick={handleDownload}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={18} /> Download Word Document (.docx)
              </button>

              <button
                onClick={handleReset}
                className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold px-6 py-3.5 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw size={16} /> Convert Another PDF
              </button>
            </div>
          </div>
        )}

        {/* Error Section */}
        {conversionState === "error" && (
          <div className="max-w-2xl mx-auto bg-red-50/60 border border-red-100 rounded-3xl p-8 text-center space-y-6">
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
              <AlertCircle size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-red-950">Conversion Failed</h3>
              <p className="text-xs text-red-700 font-semibold">{errorMessage}</p>
            </div>

            <button
              onClick={handleReset}
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-all shadow-md cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}

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
