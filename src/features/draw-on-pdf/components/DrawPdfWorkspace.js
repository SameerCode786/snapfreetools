"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

import DrawingToolbar from "./DrawingToolbar.js";
import DrawingCanvas from "./DrawingCanvas.js";
import PageNavigationStrip from "./PageNavigationStrip.js";

import {
  renderSinglePage,
  renderPageThumbnailsBatch,
  getPdfJsEngine
} from "../../sign-pdf/utils/signPdfEngine.js";

import { exportAnnotationsToPdf } from "../utils/drawPdfEngine.js";

export default function DrawPdfWorkspace({
  file,
  onResetFile,
  onExportSuccess,
  onExportStart
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

  // Active page preview state
  const [pagePreviewUrl, setPagePreviewUrl] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 600, height: 800, rotation: 0 });
  const [loadingPagePreview, setLoadingPagePreview] = useState(true);

  // Zoom Scale (0.5 to 2.0)
  const [zoomScale, setZoomScale] = useState(1.0);

  // Active Drawing Tool & Styles
  const [activeTool, setActiveTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [opacity, setOpacity] = useState(1.0);
  const [fontSize, setFontSize] = useState(16);

  // Annotations state: { [pageNumber]: Array<Annotation> }
  const [annotationsByPage, setAnnotationsByPage] = useState({});

  // History Undo / Redo Stacks per page: { [pageNumber]: { undoStack: [], redoStack: [] } }
  const [historyByPage, setHistoryByPage] = useState({});

  const [isExporting, setIsExporting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const pdfDocRef = useRef(null);
  const workspaceContainerRef = useRef(null);

  // Initialize PDF document & batch render page thumbnails
  useEffect(() => {
    let isMounted = true;

    async function initPdf() {
      try {
        const pdfjs = await getPdfJsEngine();
        const rawFile = file.rawFile || file;
        const rawArrayBuffer = await rawFile.arrayBuffer();
        const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

        const doc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
        if (!isMounted) return;
        pdfDocRef.current = doc;

        const thumbs = await renderPageThumbnailsBatch(file, 0.25);
        if (isMounted) {
          setPageThumbnails(thumbs);
          setLoadingThumbnails(false);
        }
      } catch (err) {
        console.error("Failed to load PDF preview:", err);
      }
    }

    initPdf();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Load active page preview image whenever currentPage changes
  useEffect(() => {
    let isMounted = true;

    async function loadPagePreview() {
      if (!pdfDocRef.current) {
        const pdfjs = await getPdfJsEngine();
        const rawFile = file.rawFile || file;
        const rawArrayBuffer = await rawFile.arrayBuffer();
        const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));
        pdfDocRef.current = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
      }

      setLoadingPagePreview(true);
      try {
        const res = await renderSinglePage(pdfDocRef.current, currentPage, 1.4);
        if (isMounted && res) {
          setPagePreviewUrl(res.dataUrl);
          setPageDimensions({
            width: res.width,
            height: res.height,
            rotation: file?.pageDimensions?.[currentPage - 1]?.rotation || 0
          });
          setLoadingPagePreview(false);
        }
      } catch (err) {
        console.error(`Failed to render page ${currentPage}:`, err);
        if (isMounted) setLoadingPagePreview(false);
      }
    }

    loadPagePreview();

    return () => {
      isMounted = false;
    };
  }, [currentPage, file]);

  // Add Annotation on current page
  const handleAddAnnotation = (annot) => {
    const currentList = annotationsByPage[currentPage] || [];
    const updatedList = [...currentList, annot];

    // Push to undo history stack for current page
    const pageHist = historyByPage[currentPage] || { undoStack: [], redoStack: [] };
    const updatedHist = {
      undoStack: [...pageHist.undoStack, currentList],
      redoStack: []
    };

    setAnnotationsByPage((prev) => ({
      ...prev,
      [currentPage]: updatedList
    }));

    setHistoryByPage((prev) => ({
      ...prev,
      [currentPage]: updatedHist
    }));
  };

  // Delete Annotation from current page
  const handleDeleteAnnotation = (annotId) => {
    const currentList = annotationsByPage[currentPage] || [];
    const updatedList = currentList.filter((a) => a.id !== annotId);

    const pageHist = historyByPage[currentPage] || { undoStack: [], redoStack: [] };
    const updatedHist = {
      undoStack: [...pageHist.undoStack, currentList],
      redoStack: []
    };

    setAnnotationsByPage((prev) => ({
      ...prev,
      [currentPage]: updatedList
    }));

    setHistoryByPage((prev) => ({
      ...prev,
      [currentPage]: updatedHist
    }));
  };

  // Undo Action for current page
  const handleUndo = () => {
    const pageHist = historyByPage[currentPage] || { undoStack: [], redoStack: [] };
    if (pageHist.undoStack.length === 0) return;

    const currentList = annotationsByPage[currentPage] || [];
    const previousList = pageHist.undoStack[pageHist.undoStack.length - 1];

    setAnnotationsByPage((prev) => ({
      ...prev,
      [currentPage]: previousList
    }));

    setHistoryByPage((prev) => ({
      ...prev,
      [currentPage]: {
        undoStack: pageHist.undoStack.slice(0, -1),
        redoStack: [currentList, ...pageHist.redoStack]
      }
    }));
  };

  // Redo Action for current page
  const handleRedo = () => {
    const pageHist = historyByPage[currentPage] || { undoStack: [], redoStack: [] };
    if (pageHist.redoStack.length === 0) return;

    const currentList = annotationsByPage[currentPage] || [];
    const nextList = pageHist.redoStack[0];

    setAnnotationsByPage((prev) => ({
      ...prev,
      [currentPage]: nextList
    }));

    setHistoryByPage((prev) => ({
      ...prev,
      [currentPage]: {
        undoStack: [...pageHist.undoStack, currentList],
        redoStack: pageHist.redoStack.slice(1)
      }
    }));
  };

  // Clear Current Page Annotations
  const handleClearCurrentPage = () => {
    const currentList = annotationsByPage[currentPage] || [];
    if (currentList.length === 0) return;

    const pageHist = historyByPage[currentPage] || { undoStack: [], redoStack: [] };

    setAnnotationsByPage((prev) => ({
      ...prev,
      [currentPage]: []
    }));

    setHistoryByPage((prev) => ({
      ...prev,
      [currentPage]: {
        undoStack: [...pageHist.undoStack, currentList],
        redoStack: []
      }
    }));
  };

  // Clear All Pages Annotations
  const handleClearAllPages = () => {
    setAnnotationsByPage({});
    setHistoryByPage({});
  };

  // Zoom Handlers
  const handleZoomIn = () => setZoomScale((prev) => Math.min(2.0, prev + 0.15));
  const handleZoomOut = () => setZoomScale((prev) => Math.max(0.5, prev - 0.15));
  const handleResetZoom = () => setZoomScale(1.0);
  const handleFitPage = () => {
    if (!workspaceContainerRef.current) return;
    const availWidth = workspaceContainerRef.current.clientWidth - 48;
    const availHeight = workspaceContainerRef.current.clientHeight - 48;
    const scaleX = availWidth / (pageDimensions.width || 600);
    const scaleY = availHeight / (pageDimensions.height || 800);
    const fitScale = Math.max(0.5, Math.min(2.0, Math.min(scaleX, scaleY)));
    setZoomScale(fitScale);
  };

  // Global Keyboard Shortcuts (Ctrl+Z, Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in a textarea or input
      const tag = e.target.tagName ? e.target.tagName.toUpperCase() : "";
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;

      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, annotationsByPage, historyByPage]);

  // Execute Export PDF
  const handleExecuteExport = async () => {
    setIsExporting(true);
    setErrorMessage(null);

    if (onExportStart) onExportStart("Embedding vector annotations...");

    try {
      const res = await exportAnnotationsToPdf({
        pdfInput: file.rawFile || file,
        annotationsByPage,
        filename: file.name
      });

      const blob = new Blob([res.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(blob);

      if (onExportSuccess) {
        onExportSuccess({
          ...res,
          blob,
          downloadUrl
        });
      }
    } catch (err) {
      console.error("PDF Export error:", err);
      setErrorMessage(err.message || "An unexpected error occurred while exporting PDF.");
      setIsExporting(false);
    }
  };

  const currentPageAnnots = annotationsByPage[currentPage] || [];
  const currentHistory = historyByPage[currentPage] || { undoStack: [], redoStack: [] };
  const totalAnnotationsCount = Object.values(annotationsByPage).reduce(
    (sum, list) => sum + (list ? list.length : 0),
    0
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
      {/* Top Header Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onResetFile}
            title="Change PDF File"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Change File</span>
          </button>
          <div className="h-4 w-px bg-slate-800 hidden sm:block" />
          <div className="flex items-center gap-2 truncate max-w-xs sm:max-w-md">
            <FileText size={16} className="text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-slate-200 truncate">{file?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400">
            {totalAnnotationsCount > 0 ? (
              <span className="text-amber-400 font-bold">{totalAnnotationsCount} Annotations</span>
            ) : (
              "No annotations yet"
            )}
          </span>

          <button
            onClick={handleExecuteExport}
            disabled={isExporting}
            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main Drawing Toolbar */}
      <DrawingToolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
        opacity={opacity}
        setOpacity={setOpacity}
        fontSize={fontSize}
        setFontSize={setFontSize}
        canUndo={currentHistory.undoStack.length > 0}
        canRedo={currentHistory.redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClearPage={handleClearCurrentPage}
        onClearAll={handleClearAllPages}
        zoomScale={zoomScale}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onFitPage={handleFitPage}
        onExportPdf={handleExecuteExport}
        isExporting={isExporting}
      />

      {/* Main Workspace Canvas Container */}
      <div
        ref={workspaceContainerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-slate-950 relative min-h-[500px]"
      >
        {errorMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-3 bg-rose-950 border border-rose-800 text-rose-200 rounded-2xl text-xs font-semibold shadow-2xl">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <DrawingCanvas
          pageNumber={currentPage}
          pagePreviewUrl={pagePreviewUrl}
          pageDimensions={pageDimensions}
          zoomScale={zoomScale}
          activeTool={activeTool}
          color={color}
          strokeWidth={strokeWidth}
          opacity={opacity}
          fontSize={fontSize}
          annotations={currentPageAnnots}
          onAddAnnotation={handleAddAnnotation}
          onDeleteAnnotation={handleDeleteAnnotation}
        />
      </div>

      {/* Bottom Page Navigation Bar */}
      <PageNavigationStrip
        currentPage={currentPage}
        pageCount={file?.pageCount || 1}
        pageThumbnails={pageThumbnails}
        onSelectPage={setCurrentPage}
      />
    </div>
  );
}
