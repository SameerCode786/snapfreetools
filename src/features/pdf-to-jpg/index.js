"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import UploadZone from "./components/UploadZone";
import PdfDetails from "./components/PdfDetails";
import ConversionProgress from "./components/ConversionProgress";
import ConversionResults from "./components/ConversionResults";
import ImagePreview from "./components/ImagePreview";
import { loadPdfDocument, renderPageThumbnail, renderPageToJpg } from "./utils/pdfRenderer";
import { EDUCATIONAL_CONTENT } from "./content/educationalContent";
import { PDF_TO_JPG_FAQS } from "./content/faqs";
import { FileImage, AlertCircle } from "lucide-react";

export default function PDFToJPGFeature({ faqs = PDF_TO_JPG_FAQS }) {
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [thumbnails, setThumbnails] = useState([]);
  
  // Settings state
  const [settings, setSettings] = useState({
    pageMode: "all", // all, range, selected
    pageRange: "",
    dpi: "150", // 72, 150, 300
    quality: "high" // standard, high, maximum
  });

  const [selectedPages, setSelectedPages] = useState([]);
  
  // App flow states
  const [status, setStatus] = useState("idle"); // idle, converting, success
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [results, setResults] = useState([]);
  const [expandedImageUrl, setExpandedImageUrl] = useState(null);
  const [error, setError] = useState(null);

  // References
  const pdfDocRef = useRef(null);
  const isCancelledRef = useRef(false);

  // Clean up Object URLs on component unmount
  useEffect(() => {
    return () => {
      // Revoke thumbnail urls
      thumbnails.forEach((t) => {
        if (t.url) URL.revokeObjectURL(t.url);
      });
    };
  }, [thumbnails]);

  // Handle file selection and preview thumbnail generation
  const handleFileSelect = async (selectedFile) => {
    setFile(selectedFile);
    setError(null);
    setLoadingDoc(true);
    setThumbnails([]);
    setSelectedPages([]);

    try {
      const pdfDoc = await loadPdfDocument(selectedFile);
      pdfDocRef.current = pdfDoc;
      const totalPages = pdfDoc.numPages;
      setPageCount(totalPages);

      // Generate thumbnails for the first 12 pages sequentially to keep UI responsive
      const thumbs = [];
      const renderLimit = Math.min(totalPages, 12);
      for (let i = 1; i <= renderLimit; i++) {
        const thumb = await renderPageThumbnail(pdfDoc, i);
        thumbs.push(thumb);
      }
      setThumbnails(thumbs);
      
      // Auto pre-populate all pages as selected
      const allPagesArray = Array.from({ length: totalPages }, (_, idx) => idx + 1);
      setSelectedPages(allPagesArray);
    } catch (err) {
      console.error("PDF Parsing error:", err);
      if (err.name === "PasswordException") {
        setError("This PDF is password-protected. Please upload an unlocked PDF.");
      } else {
        setError("Failed to load PDF. The file may be corrupt or invalid.");
      }
      setFile(null);
      setPageCount(0);
      pdfDocRef.current = null;
    } finally {
      setLoadingDoc(false);
    }
  };

  // Setting handlers
  const handleChangeSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle individual page checkboxes in manual Selected Mode
  const handleTogglePageSelect = (pageNum) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b)
    );
  };

  // Sequential Conversion triggers
  const handleConvert = async () => {
    if (!pdfDocRef.current) return;
    setStatus("converting");
    setProgress(0);
    setCurrentPage(1);
    setResults([]);
    isCancelledRef.current = false;

    // Resolve targeted pages based on selection modes
    let targetPages = [];
    if (settings.pageMode === "all") {
      targetPages = Array.from({ length: pageCount }, (_, idx) => idx + 1);
    } else if (settings.pageMode === "range") {
      if (!settings.pageRange) {
        setError("Invalid page range specified.");
        setStatus("idle");
        return;
      }
      const rangeRegex = /^(\d+)-(\d+)$/;
      const singleRegex = /^(\d+)$/;
      if (rangeRegex.test(settings.pageRange)) {
        const [, start, end] = settings.pageRange.match(rangeRegex);
        const startNum = parseInt(start, 10);
        const endNum = parseInt(end, 10);
        for (let i = startNum; i <= endNum; i++) {
          targetPages.push(i);
        }
      } else if (singleRegex.test(settings.pageRange)) {
        targetPages.push(parseInt(settings.pageRange, 10));
      }
    } else if (settings.pageMode === "selected") {
      targetPages = [...selectedPages];
    }

    if (targetPages.length === 0) {
      setError("No target pages selected for conversion.");
      setStatus("idle");
      return;
    }

    const conversionResults = [];
    const totalConversions = targetPages.length;

    try {
      for (let i = 0; i < totalConversions; i++) {
        // Intercept cancellation action immediately
        if (isCancelledRef.current) {
          break;
        }

        const pageNum = targetPages[i];
        setCurrentPage(pageNum);
        // Calculate progress grows from 0 to 100%
        setProgress(Math.round((i / totalConversions) * 100));

        // Render page
        const result = await renderPageToJpg(pdfDocRef.current, pageNum, settings);
        conversionResults.push(result);
      }

      if (!isCancelledRef.current) {
        setResults(conversionResults);
        setStatus("success");
        setProgress(100);
      } else {
        // Clean up any partially created blob urls if cancelled
        setStatus("idle");
        setProgress(0);
      }
    } catch (err) {
      console.error("Conversion failed:", err);
      setError("An error occurred during conversion. Please check document structures.");
      setStatus("idle");
    }
  };

  // Cancel rendering loop
  const handleCancelConversion = () => {
    isCancelledRef.current = true;
    setStatus("idle");
    setProgress(0);
  };

  // Reset conversion results back to settings panel
  const handleResetConversion = () => {
    setResults([]);
    setStatus("idle");
    setProgress(0);
  };

  // Clear PDF, unbind documents references and trigger GC URL revocations
  const handleClearAll = () => {
    // Revoke thumbnails
    thumbnails.forEach((t) => {
      if (t.url) URL.revokeObjectURL(t.url);
    });
    setThumbnails([]);
    setFile(null);
    setPageCount(0);
    setResults([]);
    pdfDocRef.current = null;
    setError(null);
    setStatus("idle");
    setProgress(0);
    setSelectedPages([]);
    setSettings({
      pageMode: "all",
      pageRange: "",
      dpi: "150",
      quality: "high"
    });
  };

  return (
    <ToolLayout
      title="Convert PDF to JPG"
      description="Extract PDF pages as high-quality JPG images free. 100% private client-side browser processing."
      currentSlug="pdf-to-jpg"
      result={status === "success" && results.length > 0 ? {
        summary: `Converted ${results.length} PDF pages into high-quality JPG images.`
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
        
        {/* Header Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto border border-amber-100 shadow-2xs">
            <FileImage size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
              Convert PDF to JPG
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">
              Extract PDF pages as high-quality JPG images free. 100% private client-side browser processing.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 max-w-2xl mx-auto text-red-700 animate-slide">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{error}</p>
          </div>
        )}

        {/* Document Parsing state loader */}
        {loadingDoc && (
          <div className="flex flex-col items-center justify-center space-y-4 min-h-[250px] text-center">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
            </div>
            <p className="text-sm font-bold text-slate-700 animate-pulse">Parsing PDF document structures...</p>
            <p className="text-xs text-slate-400 font-semibold max-w-xs leading-relaxed">
              Analyzing pages and preparing low-resolution previews inside your browser.
            </p>
          </div>
        )}

        {/* State Machine render switcher */}
        {!loadingDoc && status === "idle" && (
          <>
            {!file ? (
              <UploadZone onFileSelect={handleFileSelect} onError={setError} />
            ) : (
              <PdfDetails
                file={file}
                pageCount={pageCount}
                thumbnails={thumbnails}
                settings={settings}
                onChangeSetting={handleChangeSetting}
                onConvert={handleConvert}
                onClear={handleClearAll}
                selectedPages={selectedPages}
                onTogglePageSelect={handleTogglePageSelect}
              />
            )}
          </>
        )}

        {!loadingDoc && status === "converting" && (
          <ConversionProgress
            progress={progress}
            currentPage={currentPage}
            totalPages={pageCount}
            onCancel={handleCancelConversion}
          />
        )}

        {!loadingDoc && status === "success" && (
          <ConversionResults
            results={results}
            originalFilename={file ? file.name : "document"}
            onReset={handleResetConversion}
            onImageExpand={setExpandedImageUrl}
          />
        )}

        {/* Image Zoom Lightbox Overlay */}
        {expandedImageUrl && (
          <ImagePreview url={expandedImageUrl} onClose={() => setExpandedImageUrl(null)} />
        )}
      </div>
    </ToolLayout>
  );
}
