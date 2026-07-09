"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, UploadCloud, CheckCircle, Loader2, Download, 
  RefreshCw, Trash2, ArrowRight, Shield, Zap, Sparkles, 
  HelpCircle, Eye, AlertCircle, FileEdit, Award, Info
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
  const fileInputRef = useRef(null);

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

    setFile(selectedFile);
    setConversionState("idle");
    setProgress(0);
    setDocBlob(null);
    
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
    setFile(null);
    setPageCount(null);
    setFileError(null);
    setConversionState("idle");
    setProgress(0);
    setDocBlob(null);
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
        setFileError("No selectable text was found. This PDF may be scanned or image-based and requires OCR.");
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

  const handleDownload = () => {
    if (!docBlob || !file) return;

    const originalName = file.name;
    const cleanName = originalName.replace(/\.[^/.]+$/, "");
    const url = URL.createObjectURL(docBlob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${cleanName}-converted.docx`;
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
                {!file ? (
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
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-bold">
                    <AlertCircle size={16} />
                    {fileError}
                  </div>
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
                      {file ? file.name.replace(/\.[^/.]+$/, "") + "-converted.docx" : "document-converted.docx"}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold">
                      Word Document (.docx)
                    </p>
                  </div>
                </div>

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

      </div>
    </ToolLayout>
  );
}
