"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  PenTool,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  Sparkles,
  Layers,
  ZoomIn,
  ZoomOut,
  Users,
  AlertCircle,
  FileText
} from "lucide-react";

import FieldOverlayItem from "./FieldOverlayItem";
import FieldPaletteToolbar from "./FieldPaletteToolbar";
import FieldPropertiesPanel from "./FieldPropertiesPanel";
import RecipientManagerPanel from "./RecipientManagerPanel";
import PreparationSummaryModal from "./PreparationSummaryModal";
import SignatureCreatorModal from "./SignatureCreatorModal";
import InitialsCreatorModal from "./InitialsCreatorModal";
import CompanyStampModal from "./CompanyStampModal";

import {
  renderSinglePage,
  renderPageThumbnailsBatch,
  getPdfJsEngine
} from "../utils/signPdfEngine.js";
import {
  computeDuplicateOffset,
  clampFieldToContainer
} from "../utils/fieldCoordinateMath.js";
import {
  createInitialRecipient,
  createNextRecipient,
  removeRecipientAndNormalize,
  validatePreparation
} from "../utils/recipientUtils.js";

export default function SignPdfWorkspace({
  file,
  mode = "only-me", // 'only-me' | 'several-people'
  onResetFile,
  onExecuteSign
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

  // Active page preview state
  const [pagePreviewUrl, setPagePreviewUrl] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 600, height: 800 });
  const [loadingPagePreview, setLoadingPagePreview] = useState(true);
  const [zoomScale, setZoomScale] = useState(1.0);

  // Sidebar Tab in Several People Mode ('pages' | 'recipients')
  const [sidebarTab, setSidebarTab] = useState(mode === "several-people" ? "recipients" : "pages");

  // Fields map: { [pageNumber: number]: Array<FieldItem> }
  const [fieldsByPage, setFieldsByPage] = useState({});
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // Several People State
  const [recipients, setRecipients] = useState([createInitialRecipient(1)]);
  const [activeRecipientId, setActiveRecipientId] = useState(null);
  const [signingOrderMode, setSigningOrderMode] = useState("sequential");
  const [recipientErrors, setRecipientErrors] = useState({});
  const [validationErrors, setValidationErrors] = useState([]);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Modal open states
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [isInitialsModalOpen, setIsInitialsModalOpen] = useState(false);
  const [isStampModalOpen, setIsStampModalOpen] = useState(false);

  // Stored assets for 1-click reuse
  const [storedSignature, setStoredSignature] = useState(null);
  const [storedInitials, setStoredInitials] = useState(null);
  const [storedStamp, setStoredStamp] = useState(null);

  const previewContainerRef = useRef(null);
  const pdfDocRef = useRef(null);

  // Ensure active recipient is set when recipients change
  useEffect(() => {
    if (recipients.length > 0 && (!activeRecipientId || !recipients.some((r) => r.id === activeRecipientId))) {
      setActiveRecipientId(recipients[0].id);
    }
  }, [recipients, activeRecipientId]);

  // Initialize PDF doc and load thumbnails
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

        // Load thumbnails batch
        const thumbs = await renderPageThumbnailsBatch(file, 0.25);
        if (isMounted) {
          setPageThumbnails(thumbs);
          setLoadingThumbnails(false);
        }
      } catch (err) {
        console.error("Error loading PDF preview:", err);
      }
    }

    initPdf();

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Load preview for current page whenever currentPage changes
  useEffect(() => {
    let isMounted = true;

    async function loadPage() {
      if (!pdfDocRef.current) {
        const pdfjs = await getPdfJsEngine();
        const rawFile = file.rawFile || file;
        const rawArrayBuffer = await rawFile.arrayBuffer();
        const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));
        pdfDocRef.current = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
      }

      setLoadingPagePreview(true);
      try {
        const res = await renderSinglePage(pdfDocRef.current, currentPage, 1.3);
        if (isMounted && res) {
          setPagePreviewUrl(res.dataUrl);
          setPageDimensions({ width: res.width, height: res.height });
          setLoadingPagePreview(false);
        }
      } catch (err) {
        console.error("Failed to render page:", err);
        if (isMounted) setLoadingPagePreview(false);
      }
    }

    loadPage();

    return () => {
      isMounted = false;
    };
  }, [currentPage, file]);

  // Calculate total fields placed across all pages
  const totalFieldsCount = Object.values(fieldsByPage).reduce(
    (sum, list) => sum + (list ? list.length : 0),
    0
  );

  // Currently active page fields
  const activePageFields = fieldsByPage[currentPage] || [];
  const selectedField = activePageFields.find((f) => f.id === selectedFieldId) || null;

  // Add Recipient Handler
  const handleAddRecipient = () => {
    setRecipients((prev) => {
      const nextRec = createNextRecipient(prev);
      setActiveRecipientId(nextRec.id);
      return [...prev, nextRec];
    });
  };

  // Update Recipient Handler
  const handleUpdateRecipient = (recipientId, updates) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === recipientId ? { ...r, ...updates } : r))
    );
  };

  // Remove Recipient Handler & Cascade Field Reassignment
  const handleRemoveRecipient = (recipientIdToRemove) => {
    const updatedRecipients = removeRecipientAndNormalize(recipients, recipientIdToRemove);
    setRecipients(updatedRecipients);

    const fallbackRecipientId = updatedRecipients[0]?.id || null;

    // Safely reassign any fields previously attached to the removed recipient
    setFieldsByPage((prev) => {
      const newMap = {};
      for (const [p, list] of Object.entries(prev)) {
        newMap[p] = (list || []).map((f) => {
          if (f.recipientId === recipientIdToRemove) {
            return { ...f, recipientId: fallbackRecipientId };
          }
          return f;
        });
      }
      return newMap;
    });

    if (activeRecipientId === recipientIdToRemove) {
      setActiveRecipientId(fallbackRecipientId);
    }
  };

  // Helper to add a new field to current page
  const addFieldToCurrentPage = (fieldData, targetRecipientId) => {
    const containerWidth = pageDimensions.width || 600;
    const containerHeight = pageDimensions.height || 800;
    const assignedId = mode === "several-people" ? (targetRecipientId || activeRecipientId || recipients[0]?.id) : null;

    const newField = {
      id: `fld-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      pageNumber: currentPage,
      recipientId: assignedId,
      required: true,
      previewWidth: containerWidth,
      previewHeight: containerHeight,
      rotation: 0,
      opacity: 1.0,
      ...fieldData
    };

    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), newField]
    }));

    setSelectedFieldId(newField.id);
  };

  // Handle Palette Trigger
  const handlePaletteAddField = (fieldType, targetRecipientId) => {
    const containerWidth = pageDimensions.width || 600;
    const containerHeight = pageDimensions.height || 800;

    if (fieldType === "signature") {
      if (storedSignature) {
        const defaultWidth = Math.min(180, Math.round(containerWidth * 0.35));
        const defaultHeight = Math.round(defaultWidth * 0.45);
        addFieldToCurrentPage({
          type: "signature",
          dataUrl: storedSignature.dataUrl,
          width: defaultWidth,
          height: defaultHeight,
          x: Math.round((containerWidth - defaultWidth) / 2),
          y: Math.round((containerHeight - defaultHeight) / 2)
        }, targetRecipientId);
      } else {
        setIsSignatureModalOpen(true);
      }
    } else if (fieldType === "initials") {
      if (storedInitials) {
        const defaultWidth = Math.min(100, Math.round(containerWidth * 0.22));
        const defaultHeight = Math.round(defaultWidth * 0.55);
        addFieldToCurrentPage({
          type: "initials",
          dataUrl: storedInitials.dataUrl,
          initialsText: storedInitials.initialsText,
          width: defaultWidth,
          height: defaultHeight,
          x: Math.round((containerWidth - defaultWidth) / 2),
          y: Math.round((containerHeight - defaultHeight) / 2)
        }, targetRecipientId);
      } else {
        setIsInitialsModalOpen(true);
      }
    } else if (fieldType === "stamp") {
      if (storedStamp) {
        const defaultSize = Math.min(120, Math.round(containerWidth * 0.25));
        addFieldToCurrentPage({
          type: "stamp",
          dataUrl: storedStamp.dataUrl,
          width: defaultSize,
          height: defaultSize,
          x: Math.round((containerWidth - defaultSize) / 2),
          y: Math.round((containerHeight - defaultSize) / 2)
        }, targetRecipientId);
      } else {
        setIsStampModalOpen(true);
      }
    } else if (fieldType === "name") {
      const defaultWidth = Math.min(160, Math.round(containerWidth * 0.3));
      const defaultHeight = 32;
      addFieldToCurrentPage({
        type: "name",
        value: mode === "several-people" ? "" : "Your Name",
        width: defaultWidth,
        height: defaultHeight,
        x: Math.round((containerWidth - defaultWidth) / 2),
        y: Math.round((containerHeight - defaultHeight) / 2),
        style: {
          fontFamily: "Helvetica",
          fontSize: 13,
          color: "#0f172a",
          align: "left"
        }
      }, targetRecipientId);
    } else if (fieldType === "date") {
      const defaultWidth = Math.min(130, Math.round(containerWidth * 0.25));
      const defaultHeight = 28;
      addFieldToCurrentPage({
        type: "date",
        value: new Date().toISOString().split("T")[0],
        width: defaultWidth,
        height: defaultHeight,
        x: Math.round((containerWidth - defaultWidth) / 2),
        y: Math.round((containerHeight - defaultHeight) / 2),
        style: {
          dateFormat: "YYYY-MM-DD",
          fontSize: 12,
          color: "#0f172a",
          align: "left"
        }
      }, targetRecipientId);
    } else if (fieldType === "text") {
      const defaultWidth = Math.min(180, Math.round(containerWidth * 0.35));
      const defaultHeight = 48;
      addFieldToCurrentPage({
        type: "text",
        value: "Click to enter text...",
        placeholder: "Type text here...",
        width: defaultWidth,
        height: defaultHeight,
        x: Math.round((containerWidth - defaultWidth) / 2),
        y: Math.round((containerHeight - defaultHeight) / 2),
        style: {
          fontFamily: "Helvetica",
          fontSize: 12,
          color: "#0f172a",
          align: "left"
        }
      }, targetRecipientId);
    }
  };

  // Signature modal save handler
  const handleSaveSignature = (sigAsset) => {
    setStoredSignature(sigAsset);
    const containerWidth = pageDimensions.width || 600;
    const defaultWidth = Math.min(180, Math.round(containerWidth * 0.35));
    const defaultHeight = Math.round(defaultWidth * 0.45);

    if (selectedField && selectedField.type === "signature") {
      handleUpdateField({
        ...selectedField,
        dataUrl: sigAsset.dataUrl
      });
    } else {
      addFieldToCurrentPage({
        type: "signature",
        dataUrl: sigAsset.dataUrl,
        width: defaultWidth,
        height: defaultHeight,
        x: Math.round((containerWidth - defaultWidth) / 2),
        y: Math.round((pageDimensions.height - defaultHeight) / 2)
      });
    }
  };

  // Initials modal save handler
  const handleSaveInitials = (initAsset) => {
    setStoredInitials(initAsset);
    const containerWidth = pageDimensions.width || 600;
    const defaultWidth = Math.min(100, Math.round(containerWidth * 0.22));
    const defaultHeight = Math.round(defaultWidth * 0.55);

    if (selectedField && selectedField.type === "initials") {
      handleUpdateField({
        ...selectedField,
        dataUrl: initAsset.dataUrl,
        initialsText: initAsset.initialsText
      });
    } else {
      addFieldToCurrentPage({
        type: "initials",
        dataUrl: initAsset.dataUrl,
        initialsText: initAsset.initialsText,
        width: defaultWidth,
        height: defaultHeight,
        x: Math.round((containerWidth - defaultWidth) / 2),
        y: Math.round((pageDimensions.height - defaultHeight) / 2)
      });
    }
  };

  // Stamp modal save handler
  const handleSaveStamp = (stampAsset) => {
    setStoredStamp(stampAsset);
    const containerWidth = pageDimensions.width || 600;
    const defaultSize = Math.min(120, Math.round(containerWidth * 0.25));

    if (selectedField && selectedField.type === "stamp") {
      handleUpdateField({
        ...selectedField,
        dataUrl: stampAsset.dataUrl
      });
    } else {
      addFieldToCurrentPage({
        type: "stamp",
        dataUrl: stampAsset.dataUrl,
        width: defaultSize,
        height: defaultSize,
        x: Math.round((containerWidth - defaultSize) / 2),
        y: Math.round((pageDimensions.height - defaultSize) / 2)
      });
    }
  };

  // Update a field on current page
  const handleUpdateField = (updatedField) => {
    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map((f) =>
        f.id === updatedField.id ? updatedField : f
      )
    }));
  };

  // Delete a field from current page
  const handleDeleteField = (fieldId) => {
    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).filter((f) => f.id !== fieldId)
    }));
    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  // Duplicate a field with an offset
  const handleDuplicateField = (fieldToDup) => {
    const offset = computeDuplicateOffset(fieldToDup, pageDimensions, 20);
    const duplicated = {
      ...fieldToDup,
      id: `fld-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      x: offset.x,
      y: offset.y
    };

    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] || []), duplicated]
    }));

    setSelectedFieldId(duplicated.id);
  };

  // Move a field to another page
  const handleMoveFieldToPage = (fieldToMove, targetPageNum) => {
    if (targetPageNum === currentPage || targetPageNum < 1 || targetPageNum > file.pageCount) return;

    setFieldsByPage((prev) => {
      const currentList = (prev[currentPage] || []).filter((f) => f.id !== fieldToMove.id);
      const targetList = [...(prev[targetPageNum] || []), { ...fieldToMove, pageNumber: targetPageNum }];
      return {
        ...prev,
        [currentPage]: currentList,
        [targetPageNum]: targetList
      };
    });

    setCurrentPage(targetPageNum);
    setSelectedFieldId(fieldToMove.id);
  };

  // Trigger Review & Validation in Several People Mode
  const handleReviewPreparation = () => {
    const validation = validatePreparation({
      recipients,
      fieldsByPage,
      signingOrderMode
    });

    setRecipientErrors(validation.recipientErrors);
    setValidationErrors(validation.errors);

    if (validation.isValid) {
      setIsSummaryModalOpen(true);
    } else {
      // Focus on recipients tab if there are recipient errors
      if (Object.keys(validation.recipientErrors).length > 0) {
        setSidebarTab("recipients");
      }
    }
  };

  // Save preparation to sessionStorage
  const handleSaveToSessionStorage = () => {
    try {
      const prepState = {
        mode: "several-people",
        fileName: file.name,
        recipients,
        signingOrderMode,
        fieldsByPage,
        updatedAt: new Date().toISOString()
      };
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.setItem("sft_sign_pdf_prep", JSON.stringify(prepState));
      }
    } catch (e) {
      console.warn("Unable to save preparation to sessionStorage:", e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base shadow-xs ${
            mode === "several-people" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
          }`}>
            {mode === "several-people" ? <Users className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 truncate max-w-xs md:max-w-md">
                {file.name}
              </h2>
              {mode === "several-people" && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md bg-blue-100 text-blue-800">
                  Several People Preparation
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{file.pageCount} {file.pageCount === 1 ? "page" : "pages"}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700">
                {totalFieldsCount} {totalFieldsCount === 1 ? "field" : "fields"} placed
              </span>
              {mode === "several-people" && (
                <>
                  <span>•</span>
                  <span className="font-semibold text-blue-600">
                    {recipients.length} {recipients.length === 1 ? "recipient" : "recipients"}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-slate-600">
            <button
              onClick={() => setZoomScale((z) => Math.max(0.75, z - 0.15))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-semibold px-2 min-w-[42px] text-center">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              onClick={() => setZoomScale((z) => Math.min(1.5, z + 0.15))}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onResetFile}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Change PDF</span>
          </button>

          {mode === "several-people" ? (
            <button
              onClick={handleReviewPreparation}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Review Preparation</span>
            </button>
          ) : (
            <button
              onClick={() => onExecuteSign(fieldsByPage)}
              className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm hover:shadow transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Download PDF</span>
            </button>
          )}
        </div>
      </div>

      {/* Validation Error Banner in Several People Mode */}
      {validationErrors.length > 0 && mode === "several-people" && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center gap-2 text-xs font-bold text-red-800">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>Please resolve the following items before finalizing preparation:</span>
          </div>
          <ul className="list-disc pl-6 space-y-1 text-xs text-red-700 font-medium">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Page Thumbnails OR Recipient Manager Panel */}
        <div className="lg:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col max-h-[780px]">
          {/* Mode Sidebar Tabs in Several People Mode */}
          {mode === "several-people" && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl mb-3 border border-slate-200/60">
              <button
                type="button"
                onClick={() => setSidebarTab("recipients")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "recipients"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Recipients ({recipients.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setSidebarTab("pages")}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  sidebarTab === "pages"
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Pages ({file.pageCount})</span>
              </button>
            </div>
          )}

          {/* Tab 1: Recipients Manager (Several People mode) */}
          {mode === "several-people" && sidebarTab === "recipients" && (
            <RecipientManagerPanel
              recipients={recipients}
              onAddRecipient={handleAddRecipient}
              onUpdateRecipient={handleUpdateRecipient}
              onRemoveRecipient={handleRemoveRecipient}
              signingOrderMode={signingOrderMode}
              onToggleSigningOrderMode={(newMode) => setSigningOrderMode(newMode)}
              recipientErrors={recipientErrors}
              activeRecipientId={activeRecipientId}
              onSelectActiveRecipient={(id) => setActiveRecipientId(id)}
            />
          )}

          {/* Tab 2: Pages Thumbnails (Both modes) */}
          {(mode === "only-me" || sidebarTab === "pages") && (
            <>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Pages ({file.pageCount})
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Select to view</span>
              </div>

              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                {loadingThumbnails ? (
                  <div className="space-y-3 py-4">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-32 bg-slate-100 animate-pulse rounded-xl" />
                    ))}
                  </div>
                ) : (
                  pageThumbnails.map((thumb) => {
                    const pageFieldsCount = (fieldsByPage[thumb.pageNumber] || []).length;
                    const isCurrent = thumb.pageNumber === currentPage;

                    return (
                      <div
                        key={thumb.pageNumber}
                        onClick={() => {
                          setCurrentPage(thumb.pageNumber);
                          setSelectedFieldId(null);
                        }}
                        className={`relative p-2 rounded-xl border-2 transition-all cursor-pointer group flex flex-col items-center ${
                          isCurrent
                            ? "border-blue-500 bg-blue-50/20 ring-2 ring-blue-500/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
                        }`}
                      >
                        <div className="w-full aspect-[3/4] bg-white rounded-lg border border-slate-200 overflow-hidden relative flex items-center justify-center">
                          {thumb.thumbnailUrl ? (
                            <img
                              src={thumb.thumbnailUrl}
                              alt={`Page ${thumb.pageNumber}`}
                              className="w-full h-full object-contain pointer-events-none"
                            />
                          ) : (
                            <span className="text-xs text-slate-400">Page {thumb.pageNumber}</span>
                          )}

                          {pageFieldsCount > 0 && (
                            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm">
                              {pageFieldsCount}
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] font-semibold text-slate-600 mt-1.5">
                          Page {thumb.pageNumber}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </div>

        {/* Center Column: Interactive Document Canvas */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* Page Navigation Bar */}
          <div className="w-full flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs mb-3">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-bold text-slate-700">
              Page {currentPage} of {file.pageCount}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(file.pageCount, p + 1))}
              disabled={currentPage === file.pageCount}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Document Viewport */}
          <div
            ref={previewContainerRef}
            onClick={() => setSelectedFieldId(null)}
            className="relative bg-slate-200/80 p-3 rounded-2xl border border-slate-300/80 shadow-inner flex items-center justify-center overflow-auto max-w-full"
            style={{ minHeight: "520px" }}
          >
            {loadingPagePreview ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
                <span className="text-xs font-medium">Rendering PDF page...</span>
              </div>
            ) : (
              <div
                className="relative bg-white shadow-xl rounded-sm select-none transition-transform"
                style={{
                  width: `${pageDimensions.width * zoomScale}px`,
                  height: `${pageDimensions.height * zoomScale}px`,
                  transformOrigin: "top center"
                }}
              >
                {/* Rendered PDF Page Background */}
                {pagePreviewUrl && (
                  <img
                    src={pagePreviewUrl}
                    alt={`Page ${currentPage} Preview`}
                    className="w-full h-full object-contain pointer-events-none"
                  />
                )}

                {/* Overlaid Interactive Fields */}
                {activePageFields.map((f) => (
                  <FieldOverlayItem
                    key={f.id}
                    field={f}
                    isSelected={f.id === selectedFieldId}
                    onSelect={() => setSelectedFieldId(f.id)}
                    onUpdate={handleUpdateField}
                    onDelete={() => handleDeleteField(f.id)}
                    onDuplicate={() => handleDuplicateField(f)}
                    containerBounds={pageDimensions}
                    totalPages={file.pageCount}
                    onMoveToPage={(targetPage) => handleMoveFieldToPage(f, targetPage)}
                    mode={mode}
                    recipients={recipients}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Field Toolbox & Properties Inspector */}
        <div className="lg:col-span-3 space-y-4">
          {/* Field Palette Toolbar */}
          <FieldPaletteToolbar
            onAddField={handlePaletteAddField}
            activeFieldCount={totalFieldsCount}
            mode={mode}
            recipients={recipients}
            activeRecipientId={activeRecipientId}
            onSelectActiveRecipient={(id) => setActiveRecipientId(id)}
          />

          {/* Field Properties Panel (when a field is selected) */}
          {selectedField && (
            <FieldPropertiesPanel
              field={selectedField}
              onUpdateField={handleUpdateField}
              onDeleteField={() => handleDeleteField(selectedField.id)}
              onDuplicateField={() => handleDuplicateField(selectedField)}
              onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
              onOpenInitialsModal={() => setIsInitialsModalOpen(true)}
              onOpenStampModal={() => setIsStampModalOpen(true)}
              onDeselect={() => setSelectedFieldId(null)}
              totalPages={file.pageCount}
              onMoveToPage={(targetPage) => handleMoveFieldToPage(selectedField, targetPage)}
              mode={mode}
              recipients={recipients}
            />
          )}
        </div>
      </div>

      {/* Signature Creator Modal */}
      <SignatureCreatorModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onApplySignature={handleSaveSignature}
      />

      {/* Initials Creator Modal */}
      <InitialsCreatorModal
        isOpen={isInitialsModalOpen}
        onClose={() => setIsInitialsModalOpen(false)}
        onApply={handleSaveInitials}
      />

      {/* Company Stamp Modal */}
      <CompanyStampModal
        isOpen={isStampModalOpen}
        onClose={() => setIsStampModalOpen(false)}
        onApply={handleSaveStamp}
      />

      {/* Preparation Summary Modal (Several People Mode) */}
      <PreparationSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        file={file}
        recipients={recipients}
        fieldsByPage={fieldsByPage}
        signingOrderMode={signingOrderMode}
        onSavePreparation={handleSaveToSessionStorage}
      />
    </div>
  );
}
