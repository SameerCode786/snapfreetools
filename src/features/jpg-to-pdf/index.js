"use client";

import React, { useState, useRef, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";
import ImageItem from "./components/ImageItem";
import SettingsPanel from "./components/SettingsPanel";
import { generatePdfFromImages } from "./utils/pdfGenerator";
import { EDUCATIONAL_CONTENT } from "./content/educationalContent";

import {
  Upload, FileText, ChevronDown, Sparkles,
  Info, AlertCircle, FileCheck, RefreshCw, Download
} from "lucide-react";

export default function JPGToPDFFeature({ faqs = [] }) {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    pageSize: "a4", // fit, a4, letter
    orientation: "auto", // auto, portrait, landscape
    margin: "none", // none, small, large
    quality: 0.85
  });

  // Conversion state
  const [status, setStatus] = useState("idle"); // idle, converting, success
  const [progress, setProgress] = useState(0);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  
  // Drag and drop state
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const fileInputRef = useRef(null);

  // Clean up object URLs on change/unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  // Handle image uploads
  const processFiles = async (files) => {
    setError(null);
    const validImages = [];
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const fileList = Array.from(files);
    
    // Process each file with a promise to extract natural dimensions
    const promises = fileList.map((file) => {
      return new Promise((resolve) => {
        if (!allowedTypes.includes(file.type)) {
          setError("Only JPG, JPEG, and PNG images are supported.");
          resolve(null);
          return;
        }
        
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          resolve({
            id: Math.random().toString(36).substring(2, 9) + Date.now(),
            file,
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height
          });
        };
        img.onerror = () => {
          // Fallback if dimensions parsing fails
          resolve({
            id: Math.random().toString(36).substring(2, 9) + Date.now(),
            file,
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            width: 800,
            height: 600
          });
        };
        img.src = url;
      });
    });

    const resolvedImages = (await Promise.all(promises)).filter(Boolean);

    if (resolvedImages.length > 0) {
      setImages((prev) => [...prev, ...resolvedImages]);
      // If we were on success screen, reset to idle since new images added
      if (status === "success") {
        handleResetConversion();
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Drag and drop events for file uploading
  const handleDragOverFile = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeaveFile = () => {
    setIsDragging(false);
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Image reordering handlers
  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    setImages(reordered);
    if (status === "success") {
      handleResetConversion();
    }
  };

  const handleRemoveImage = (index) => {
    const target = images[index];
    if (target) {
      URL.revokeObjectURL(target.url);
    }
    const updated = images.filter((_, idx) => idx !== index);
    setImages(updated);
    if (status === "success") {
      handleResetConversion();
    }
  };

  const handleClearAll = () => {
    images.forEach((img) => URL.revokeObjectURL(img.url));
    setImages([]);
    setError(null);
    handleResetConversion();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Reordering drag events for preview cards
  const handleDragStartCard = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverCard = (e, index) => {
    e.preventDefault();
  };

  const handleDropCard = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    handleMoveImage(draggedIndex, index);
  };

  const handleDragEndCard = () => {
    setDraggedIndex(null);
  };

  // Settings modification
  const handleChangeSetting = (key, val) => {
    setSettings((prev) => ({ ...prev, [key]: val }));
    // If setting changes after success, reset status so conversion is run again with new settings
    if (status === "success") {
      handleResetConversion();
    }
  };

  const handleResetConversion = () => {
    setStatus("idle");
    setProgress(0);
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
    setPdfBlob(null);
  };

  // PDF Conversion execution
  const handleConvert = async () => {
    if (images.length === 0) {
      setError("Please add at least one image to convert.");
      return;
    }

    setStatus("converting");
    setProgress(0);
    setError(null);

    try {
      const blob = await generatePdfFromImages(images, settings, (prog) => {
        setProgress(prog);
      });
      
      const url = URL.createObjectURL(blob);
      setPdfBlob(blob);
      setPdfUrl(url);
      setStatus("success");
    } catch (err) {
      setError(err.message || "Failed to generate PDF. Please try again.");
      setStatus("idle");
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = `snapfreetools-${Date.now()}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <ToolLayout
      title="JPG to PDF Converter"
      description="Convert JPG, JPEG, and PNG images into a PDF file locally inside your browser."
      currentSlug="jpg-to-pdf"
      result={status === "success" && pdfUrl ? {
        summary: `Converted ${images.length} images into a single PDF document.`
      } : null}
      seoContent={
        <>
          <EDUCATIONAL_CONTENT />
          {faqs && faqs.length > 0 && (
            <section className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-slate-900 text-center">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="bg-white border border-slate-200 rounded-2xl p-6 group shadow-xs cursor-pointer open:border-amber-300 open:ring-1 open:ring-amber-200 transition-all"
                  >
                    <summary className="font-bold text-slate-800 text-base list-none flex items-center justify-between gap-4">
                      {faq.question}
                      <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0 text-xs">▼</span>
                    </summary>
                    <p className="mt-4 text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </>
      }
    >
      <div className="space-y-12 max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            100% Free & Secure
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            JPG to PDF Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto font-medium leading-relaxed">
            Convert JPG, JPEG, and PNG images into a PDF file locally inside your browser. No files are uploaded to any server.
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-2.5 text-red-700 text-sm font-medium">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}

        {/* Conversion States */}
        {status === "converting" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <RefreshCw className="animate-spin text-amber-500 mx-auto" size={40} />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-800">Generating PDF Document</h3>
              <p className="text-xs text-slate-500 font-medium">Processing files in memory... {progress}%</p>
            </div>
            <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "success" && pdfUrl && (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-100">
              <FileCheck size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900">PDF Ready for Download</h3>
              <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                {images.length} images compiled successfully into a single PDF file ({(pdfBlob.size / (1024 * 1024)).toFixed(2)} MB).
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                <Download size={18} />
                Download PDF
              </button>
              <button
                type="button"
                onClick={handleResetConversion}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 px-6 rounded-xl shadow-sm transition-all"
              >
                Modify Settings / Order
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 bg-white hover:bg-red-50 border border-red-200 text-red-500 font-bold py-3.5 px-6 rounded-xl transition-all"
              >
                Convert New Images
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace (Idle State) */}
        {status === "idle" && (
          <div>
            {/* File input (Hidden) */}
            <input
              type="file"
              multiple
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />

            {images.length === 0 ? (
              /* Empty Upload State (Upload-First UX) */
              <div
                onDragOver={handleDragOverFile}
                onDragLeave={handleDragLeaveFile}
                onDrop={handleDropFile}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[360px] max-w-4xl mx-auto group ${
                  isDragging
                    ? "border-amber-500 bg-amber-50/50"
                    : "border-slate-300 bg-white hover:border-amber-400 hover:bg-slate-50/30"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all shadow-xs ${
                  isDragging ? "bg-amber-500 text-white animate-bounce" : "bg-slate-100 text-slate-400 group-hover:bg-amber-50 group-hover:text-amber-500"
                }`}>
                  <Upload size={28} />
                </div>
                <h3 className="text-lg font-extrabold text-slate-800 mb-2">Drag and drop your images here</h3>
                <p className="text-xs text-slate-400 font-medium mb-4 max-w-xs leading-relaxed">
                  Supports JPG, JPEG, and PNG files. Your images remain private and local.
                </p>
                <span className="bg-white border border-slate-200 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl shadow-xs group-hover:border-amber-300 transition-all">
                  Choose Files
                </span>
              </div>
            ) : (
              /* Active Grid Workspace (Side-by-side Layout) */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Images Workspace Area (Left col-span-8) */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                        <FileText size={18} className="text-amber-500 animate-pulse" />
                        Images Order ({images.length})
                      </h3>
                      <p className="text-[10px] text-slate-400 font-medium italic hidden sm:block">
                        💡 Tip: Drag images or use buttons to reorder pages.
                      </p>
                    </div>
                    
                    {/* Grid list - Spacious 3-column rows for proportional previews */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {images.map((item, idx) => (
                        <ImageItem
                          key={item.id}
                          item={item}
                          index={idx}
                          total={images.length}
                          settings={settings}
                          onMove={handleMoveImage}
                          onRemove={handleRemoveImage}
                          onDragStart={handleDragStartCard}
                          onDragOver={handleDragOverCard}
                          onDragEnd={handleDragEndCard}
                          onDrop={handleDropCard}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Settings Panel (Right col-span-4) */}
                <div className="lg:col-span-4">
                  <SettingsPanel
                    settings={settings}
                    onChangeSetting={handleChangeSetting}
                    onAddImages={triggerFileInput}
                    onClearAll={handleClearAll}
                    onConvert={handleConvert}
                    isConverting={status === "converting"}
                    imageCount={images.length}
                  />
                </div>

              </div>
            )}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
