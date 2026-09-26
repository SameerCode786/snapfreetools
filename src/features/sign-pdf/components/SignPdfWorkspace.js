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
  Maximize2,
  Minimize2,
  Check,
  ChevronDown,
  Users,
  AlertCircle,
  FileText,
  Filter,
  Sliders,
  Keyboard
} from "lucide-react";

import FieldOverlayItem from "./FieldOverlayItem";
import FieldPaletteToolbar from "./FieldPaletteToolbar";
import FieldPropertiesPanel from "./FieldPropertiesPanel";
import RecipientManagerPanel from "./RecipientManagerPanel";
import PreparationSummaryModal from "./PreparationSummaryModal";
import SignatureCreatorModal from "./SignatureCreatorModal";
import InitialsCreatorModal from "./InitialsCreatorModal";
import CompanyStampModal from "./CompanyStampModal";
import MobileDrawer from "./MobileDrawer";
import KeyboardShortcutsModal from "./KeyboardShortcutsModal";

import {
  renderSinglePage,
  renderPageThumbnailsBatch,
  getPdfJsEngine
} from "../utils/signPdfEngine.js";
import {
  computeDuplicateOffset,
  clampFieldToContainer,
  isTypingContext,
  nudgeFieldCoordinates
} from "../utils/fieldCoordinateMath.js";
import {
  createInitialRecipient,
  createNextRecipient,
  removeRecipientAndNormalize,
  validatePreparation
} from "../utils/recipientUtils.js";

const ZOOM_PRESETS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function SignPdfWorkspace({
  file,
  mode = "only-me", // 'only-me' | 'several-people'
  onResetFile,
  onExecuteSign
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageThumbnails, setPageThumbnails] = useState([]);
  const [loadingThumbnails, setLoadingThumbnails] = useState(true);

  // Active page preview state & Advanced Zoom
  const [pagePreviewUrl, setPagePreviewUrl] = useState(null);
  const [pageDimensions, setPageDimensions] = useState({ width: 600, height: 800 });
  const [loadingPagePreview, setLoadingPagePreview] = useState(true);
  const [zoomScale, setZoomScale] = useState(1.0);
  const [fitMode, setFitMode] = useState("manual"); // 'manual' | 'fit-width' | 'fit-page'
  const [isZoomDropdownOpen, setIsZoomDropdownOpen] = useState(false);
  const [pageJumpInput, setPageJumpInput] = useState("1");
  const [activeGuides, setActiveGuides] = useState([]);
  const [focusedRecipientId, setFocusedRecipientId] = useState("all");
  const zoomDropdownRef = useRef(null);

  // Mobile Drawers state (Phase 3D responsive workspace)
  const [isPagesDrawerOpen, setIsPagesDrawerOpen] = useState(false);
  const [isPaletteDrawerOpen, setIsPaletteDrawerOpen] = useState(false);
  const [isPropertiesDrawerOpen, setIsPropertiesDrawerOpen] = useState(false);
  const [isRecipientsDrawerOpen, setIsRecipientsDrawerOpen] = useState(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);

  // Two-Finger Touch Pinch-to-Zoom Tracking
  const pinchStartDistRef = useRef(null);
  const pinchStartScaleRef = useRef(1.0);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = zoomScale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && pinchStartDistRef.current) {
      if (e.cancelable) {
        e.preventDefault();
      }
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (dist > 0 && pinchStartDistRef.current > 0) {
        const factor = dist / pinchStartDistRef.current;
        const rawScale = pinchStartScaleRef.current * factor;
        const clampedScale = Math.max(0.5, Math.min(2.0, Math.round(rawScale * 100) / 100));
        setFitMode("manual");
        setZoomScale(clampedScale);
      }
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
  };

  // Sidebar Tab in Several People Mode ('pages' | 'recipients')
  const [sidebarTab, setSidebarTab] = useState(mode === "several-people" ? "recipients" : "pages");

  // Fields map: { [pageNumber: number]: Array<FieldItem> }
  const [fieldsByPage, setFieldsByPage] = useState({});
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  // Immutable Undo / Redo History Stack (Phase 3E)
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);

  const pushToHistory = (previousFields) => {
    setHistoryPast((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(previousFields))]);
    setHistoryFuture([]);
  };

  const handleUndo = () => {
    if (historyPast.length === 0) return;
    const previousState = historyPast[historyPast.length - 1];
    setHistoryPast((prev) => prev.slice(0, -1));
    setHistoryFuture((prev) => [JSON.parse(JSON.stringify(fieldsByPage)), ...prev.slice(0, 20)]);
    setFieldsByPage(previousState);
  };

  const handleRedo = () => {
    if (historyFuture.length === 0) return;
    const nextState = historyFuture[0];
    setHistoryFuture((prev) => prev.slice(1));
    setHistoryPast((prev) => [...prev.slice(-20), JSON.parse(JSON.stringify(fieldsByPage))]);
    setFieldsByPage(nextState);
  };

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

  // Synchronize jump input with currentPage
  useEffect(() => {
    setPageJumpInput(currentPage.toString());
  }, [currentPage]);

  // Click outside to close zoom dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (zoomDropdownRef.current && !zoomDropdownRef.current.contains(e.target)) {
        setIsZoomDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fit to Width / Fit to Page Calculation
  const calculateFit = (targetMode) => {
    if (!previewContainerRef.current || !pageDimensions.width || !pageDimensions.height) return;
    const container = previewContainerRef.current;
    const availW = Math.max(200, container.clientWidth - 48);
    const availH = Math.max(200, container.clientHeight - 48);

    if (targetMode === "fit-width") {
      const scale = Math.max(0.4, Math.min(2.0, availW / pageDimensions.width));
      setZoomScale(Math.round(scale * 100) / 100);
    } else if (targetMode === "fit-page") {
      const scaleX = availW / pageDimensions.width;
      const scaleY = availH / pageDimensions.height;
      const scale = Math.max(0.4, Math.min(2.0, Math.min(scaleX, scaleY)));
      setZoomScale(Math.round(scale * 100) / 100);
    }
  };

  // Recalculate fit on dimensions/mode change
  useEffect(() => {
    if (fitMode === "manual") return;
    calculateFit(fitMode);
  }, [fitMode, pageDimensions, currentPage]);

  // Observe container resize for dynamic fit recalculation
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      if (fitMode !== "manual") {
        calculateFit(fitMode);
      }
    });
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [fitMode, pageDimensions]);

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

  // Zoom Handler Functions
  const handleZoomIn = () => {
    setFitMode("manual");
    setZoomScale((current) => {
      const nextPreset = ZOOM_PRESETS.find((p) => p > current + 0.01);
      return nextPreset || ZOOM_PRESETS[ZOOM_PRESETS.length - 1];
    });
  };

  const handleZoomOut = () => {
    setFitMode("manual");
    setZoomScale((current) => {
      const prevPresets = ZOOM_PRESETS.filter((p) => p < current - 0.01);
      return prevPresets.length > 0 ? prevPresets[prevPresets.length - 1] : ZOOM_PRESETS[0];
    });
  };

  const handleSelectZoomPreset = (preset) => {
    setFitMode("manual");
    setZoomScale(preset);
    setIsZoomDropdownOpen(false);
  };

  const handleTriggerFitWidth = () => {
    setFitMode("fit-width");
    calculateFit("fit-width");
    setIsZoomDropdownOpen(false);
  };

  const handleTriggerFitPage = () => {
    setFitMode("fit-page");
    calculateFit("fit-page");
    setIsZoomDropdownOpen(false);
  };

  // Direct Page Jump Handler
  const handleApplyPageJump = () => {
    const parsed = parseInt(pageJumpInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= (file?.pageCount || 1)) {
      setCurrentPage(parsed);
      setSelectedFieldId(null);
    } else {
      setPageJumpInput(currentPage.toString());
    }
  };

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
    if (focusedRecipientId === recipientIdToRemove) {
      setFocusedRecipientId("all");
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

    pushToHistory(fieldsByPage);
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
    pushToHistory(fieldsByPage);
    setFieldsByPage((prev) => ({
      ...prev,
      [currentPage]: (prev[currentPage] || []).map((f) =>
        f.id === updatedField.id ? updatedField : f
      )
    }));
  };

  // Delete a field from current page
  const handleDeleteField = (fieldId) => {
    pushToHistory(fieldsByPage);
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
    pushToHistory(fieldsByPage);
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

    pushToHistory(fieldsByPage);
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

  // Global Keyboard Shortcuts (Phase 3E)
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const inTyping = isTypingContext(e.target);

      // 1. Escape Priority
      if (e.key === "Escape") {
        if (isShortcutsModalOpen) {
          setIsShortcutsModalOpen(false);
          return;
        }
        if (isSummaryModalOpen) {
          setIsSummaryModalOpen(false);
          return;
        }
        if (isSignatureModalOpen) {
          setIsSignatureModalOpen(false);
          return;
        }
        if (isInitialsModalOpen) {
          setIsInitialsModalOpen(false);
          return;
        }
        if (isStampModalOpen) {
          setIsStampModalOpen(false);
          return;
        }
        if (isPagesDrawerOpen) {
          setIsPagesDrawerOpen(false);
          return;
        }
        if (isPaletteDrawerOpen) {
          setIsPaletteDrawerOpen(false);
          return;
        }
        if (isPropertiesDrawerOpen) {
          setIsPropertiesDrawerOpen(false);
          return;
        }
        if (isRecipientsDrawerOpen) {
          setIsRecipientsDrawerOpen(false);
          return;
        }
        if (selectedFieldId) {
          setSelectedFieldId(null);
          return;
        }
      }

      // If typing inside an input/textarea, do not intercept alphanumeric/edit hotkeys
      if (inTyping) return;

      // 2. Toggle Shortcuts Help Guide ('?' or 'Shift+/')
      if (e.key === "?" || (e.shiftKey && e.key === "/")) {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // 3. Undo / Redo
      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 4. Duplicate Shortcut (Ctrl/Cmd + D)
      if ((e.ctrlKey || e.metaKey) && (e.key === "d" || e.key === "D")) {
        if (selectedField) {
          e.preventDefault();
          handleDuplicateField(selectedField);
          return;
        }
      }

      // 5. Delete Shortcut (Delete / Backspace outside input)
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedFieldId) {
          e.preventDefault();
          handleDeleteField(selectedFieldId);
          return;
        }
      }

      // 6. Zoom Shortcuts
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        handleZoomIn();
        return;
      }
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        handleZoomOut();
        return;
      }
      if (e.key === "0") {
        e.preventDefault();
        handleSelectZoomPreset(1.0);
        return;
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [
    isShortcutsModalOpen,
    isSummaryModalOpen,
    isSignatureModalOpen,
    isInitialsModalOpen,
    isStampModalOpen,
    isPagesDrawerOpen,
    isPaletteDrawerOpen,
    isPropertiesDrawerOpen,
    isRecipientsDrawerOpen,
    selectedFieldId,
    selectedField,
    zoomScale,
    fieldsByPage,
    historyPast,
    historyFuture
  ]);

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
          {/* Advanced Zoom Controls */}
          <div
            className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-slate-700 relative"
            ref={zoomDropdownRef}
          >
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoomScale <= 0.5}
              className="p-1.5 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
              title="Zoom out (min 50%)"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Toggle */}
            <button
              type="button"
              onClick={() => setIsZoomDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 text-[11px] font-mono font-semibold px-2 py-1 hover:bg-white rounded-lg transition-colors min-w-[58px] justify-center"
              title="Select Zoom Level"
              aria-label="Select Zoom Level"
              aria-expanded={isZoomDropdownOpen}
            >
              <span>{Math.round(zoomScale * 100)}%</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoomScale >= 2.0}
              className="p-1.5 hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
              title="Zoom in (max 200%)"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1 hidden sm:block" />

            {/* Quick Fit Width Button */}
            <button
              type="button"
              onClick={handleTriggerFitWidth}
              className={`p-1.5 hidden sm:flex items-center gap-1 text-[11px] font-medium rounded-lg transition-colors ${
                fitMode === "fit-width"
                  ? "bg-white text-blue-600 shadow-xs font-bold"
                  : "hover:bg-white text-slate-600"
              }`}
              title="Fit to Width"
              aria-label="Fit to Width"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Fit Width</span>
            </button>

            {/* Quick Fit Page Button */}
            <button
              type="button"
              onClick={handleTriggerFitPage}
              className={`p-1.5 hidden sm:flex items-center gap-1 text-[11px] font-medium rounded-lg transition-colors ${
                fitMode === "fit-page"
                  ? "bg-white text-blue-600 shadow-xs font-bold"
                  : "hover:bg-white text-slate-600"
              }`}
              title="Fit to Page"
              aria-label="Fit to Page"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Fit Page</span>
            </button>

            {/* Dropdown Menu */}
            {isZoomDropdownOpen && (
              <div className="absolute top-full mt-2 left-0 sm:left-auto sm:right-0 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Presets
                </div>
                {ZOOM_PRESETS.map((preset) => {
                  const pct = Math.round(preset * 100);
                  const isSelected = fitMode === "manual" && Math.round(zoomScale * 100) === pct;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleSelectZoomPreset(preset)}
                      className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 transition-colors"
                    >
                      <span className={isSelected ? "font-bold text-blue-600" : ""}>{pct}%</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                    </button>
                  );
                })}
                <div className="my-1 border-t border-slate-100" />
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Fit Modes
                </div>
                <button
                  type="button"
                  onClick={handleTriggerFitWidth}
                  className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <span className={fitMode === "fit-width" ? "font-bold text-blue-600" : ""}>Fit to Width</span>
                  {fitMode === "fit-width" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
                <button
                  type="button"
                  onClick={handleTriggerFitPage}
                  className="w-full px-3 py-1.5 text-xs text-left flex items-center justify-between hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  <span className={fitMode === "fit-page" ? "font-bold text-blue-600" : ""}>Fit to Page</span>
                  {fitMode === "fit-page" && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsShortcutsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Shortcuts</span>
          </button>

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

      {/* Mobile Quick Controls Action Bar (Visible on mobile/tablet < lg) */}
      <div className="flex lg:hidden items-center justify-between gap-1.5 sm:gap-2 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs overflow-x-auto no-scrollbar">
        {/* Pages Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsPagesDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all shrink-0 cursor-pointer min-h-[40px]"
          title="Open Pages Drawer"
          aria-label="Open Pages Drawer"
        >
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>Pages ({file.pageCount})</span>
        </button>

        {/* Add Field Drawer Trigger */}
        <button
          type="button"
          onClick={() => setIsPaletteDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-95 rounded-xl shadow-xs transition-all shrink-0 cursor-pointer min-h-[40px]"
          title="Add PDF Form Field"
          aria-label="Add PDF Form Field"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Field</span>
        </button>

        {/* Recipients Manager Trigger in Several People Mode */}
        {mode === "several-people" && (
          <button
            type="button"
            onClick={() => setIsRecipientsDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 active:scale-95 rounded-xl border border-blue-200/60 transition-all shrink-0 cursor-pointer min-h-[40px]"
            title="Manage Recipients"
            aria-label="Manage Recipients"
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Recipients ({recipients.length})</span>
          </button>
        )}

        {/* Selected Field Properties Trigger */}
        {selectedField && (
          <button
            type="button"
            onClick={() => setIsPropertiesDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 active:scale-95 rounded-xl border border-purple-200/60 transition-all shrink-0 cursor-pointer animate-in fade-in min-h-[40px]"
            title="Edit Field Properties"
            aria-label="Edit Field Properties"
          >
            <Sliders className="w-4 h-4 text-purple-600" />
            <span>Properties</span>
          </button>
        )}

        {/* Keyboard Shortcuts Trigger on Mobile */}
        <button
          type="button"
          onClick={() => setIsShortcutsModalOpen(true)}
          className="flex items-center justify-center p-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 active:scale-95 rounded-xl transition-all shrink-0 cursor-pointer min-h-[40px] min-w-[40px]"
          title="Keyboard Shortcuts (?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Page Thumbnails OR Recipient Manager Panel (Desktop >= lg) */}
        <div className="hidden lg:flex lg:col-span-3 xl:col-span-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex-col max-h-[780px]">
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
        <div className="col-span-1 lg:col-span-6 xl:col-span-6 flex flex-col items-center min-w-0 w-full">
          {/* Page Navigation Bar */}
          <div className="w-full flex items-center justify-between bg-white px-3 sm:px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs mb-3">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[38px]"
              title="Previous page"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Quick Page Jump */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>Page</span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                aria-label="Current page jump"
                value={pageJumpInput}
                onChange={(e) => setPageJumpInput(e.target.value.replace(/[^0-9]/g, ""))}
                onBlur={handleApplyPageJump}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleApplyPageJump();
                    e.currentTarget.blur();
                  }
                }}
                className="w-12 text-center py-1 px-1.5 text-xs font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-2xs"
              />
              <span className="text-slate-500">of {file.pageCount}</span>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(file.pageCount, p + 1))}
              disabled={currentPage === file.pageCount}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed px-2.5 py-2 sm:py-1.5 rounded-lg hover:bg-slate-100 transition-colors min-h-[38px]"
              title="Next page"
              aria-label="Next page"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Several People Mode: Recipient Focus Filter Bar */}
          {mode === "several-people" && recipients.length > 0 && (
            <div className="w-full flex items-center gap-1.5 overflow-x-auto pb-1 mb-2.5 text-xs no-scrollbar touch-pan-x">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                <span>Focus:</span>
              </span>

              {/* All Fields Filter Pill */}
              <button
                type="button"
                onClick={() => setFocusedRecipientId("all")}
                className={`px-2.5 py-1.5 sm:py-1 rounded-lg font-bold transition-all text-xs shrink-0 flex items-center gap-1.5 ${
                  focusedRecipientId === "all"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
                title="Show all recipient fields"
                aria-label="Show all recipient fields"
              >
                <span>All Fields</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-slate-700/40 rounded-full font-mono">
                  {totalFieldsCount}
                </span>
              </button>

              {/* Recipient-Specific Filter Pills */}
              {recipients.map((rec) => {
                const isFocused = focusedRecipientId === rec.id;
                const recFieldsCount = Object.values(fieldsByPage).reduce(
                  (sum, list) => sum + (list ? list.filter((f) => f.recipientId === rec.id).length : 0),
                  0
                );

                return (
                  <button
                    key={rec.id}
                    type="button"
                    onClick={() => setFocusedRecipientId(rec.id)}
                    className={`px-2.5 py-1.5 sm:py-1 rounded-lg font-bold transition-all text-xs shrink-0 flex items-center gap-1.5 border ${
                      isFocused
                        ? "shadow-xs text-white"
                        : "bg-white hover:bg-slate-50"
                    }`}
                    style={{
                      borderColor: rec.color?.primary || "#3b82f6",
                      backgroundColor: isFocused ? rec.color?.primary || "#3b82f6" : "#ffffff",
                      color: isFocused ? "#ffffff" : rec.color?.primary || "#1e293b"
                    }}
                    title={`Focus on fields for ${rec.name || `Recipient ${rec.order}`}`}
                    aria-label={`Focus on fields for ${rec.name || `Recipient ${rec.order}`}`}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isFocused ? "#ffffff" : rec.color?.primary }}
                    />
                    <span className="truncate max-w-[120px]">{rec.name || `Recipient ${rec.order}`}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isFocused ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {recFieldsCount}
                    </span>
                  </button>
                );
              })}

              {/* Clear Filter button if a specific recipient is active */}
              {focusedRecipientId !== "all" && (
                <button
                  type="button"
                  onClick={() => setFocusedRecipientId("all")}
                  className="text-[11px] text-slate-500 hover:text-slate-800 underline ml-1 shrink-0 font-medium"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}

          {/* Interactive Document Viewport with Two-Finger Touch Pinch Zoom */}
          <div
            ref={previewContainerRef}
            onClick={() => setSelectedFieldId(null)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            className="relative bg-slate-200/80 p-2 sm:p-3 rounded-2xl border border-slate-300/80 shadow-inner flex items-center justify-center overflow-auto w-full min-h-[420px] sm:min-h-[520px] max-h-[820px] touch-pan-x touch-pan-y"
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

                {/* Smart Alignment Guides (Editor-only visual alignment lines) */}
                {activeGuides && activeGuides.map((g, idx) => (
                  g.orientation === "vertical" ? (
                    <div
                      key={`guide-v-${idx}-${g.x}`}
                      className="absolute top-0 bottom-0 pointer-events-none z-30 border-l border-blue-500 border-dashed"
                      style={{
                        left: `${g.x * zoomScale}px`,
                        opacity: 0.85
                      }}
                    />
                  ) : (
                    <div
                      key={`guide-h-${idx}-${g.y}`}
                      className="absolute left-0 right-0 pointer-events-none z-30 border-t border-blue-500 border-dashed"
                      style={{
                        top: `${g.y * zoomScale}px`,
                        opacity: 0.85
                      }}
                    />
                  )
                ))}

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
                    onDeselect={() => setSelectedFieldId(null)}
                    containerBounds={pageDimensions}
                    zoomScale={zoomScale}
                    siblingFields={activePageFields.filter((sibling) => sibling.id !== f.id)}
                    onDragGuidesChange={setActiveGuides}
                    totalPages={file.pageCount}
                    onMoveToPage={(targetPage) => handleMoveFieldToPage(f, targetPage)}
                    mode={mode}
                    recipients={recipients}
                    focusedRecipientId={focusedRecipientId}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Field Toolbox & Properties Inspector (Desktop >= lg) */}
        <div className="hidden lg:block lg:col-span-3 xl:col-span-3 space-y-4">
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

      {/* MOBILE DRAWERS (Phase 3D Responsive Architecture) */}

      {/* 1. Mobile Pages Drawer */}
      <MobileDrawer
        isOpen={isPagesDrawerOpen}
        onClose={() => setIsPagesDrawerOpen(false)}
        title="Document Pages"
        icon={Layers}
        badge={`${file.pageCount} ${file.pageCount === 1 ? "page" : "pages"}`}
        position="bottom"
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pageThumbnails.map((thumb) => {
            const pageFieldsCount = (fieldsByPage[thumb.pageNumber] || []).length;
            const isCurrent = thumb.pageNumber === currentPage;

            return (
              <div
                key={thumb.pageNumber}
                onClick={() => {
                  setCurrentPage(thumb.pageNumber);
                  setSelectedFieldId(null);
                  setIsPagesDrawerOpen(false);
                }}
                className={`relative p-2.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center ${
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
                    <span className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600 text-white shadow-sm">
                      {pageFieldsCount}
                    </span>
                  )}
                </div>

                <span className="text-xs font-bold text-slate-700 mt-2">
                  Page {thumb.pageNumber} {isCurrent && "(Active)"}
                </span>
              </div>
            );
          })}
        </div>
      </MobileDrawer>

      {/* 2. Mobile Field Palette Drawer */}
      <MobileDrawer
        isOpen={isPaletteDrawerOpen}
        onClose={() => setIsPaletteDrawerOpen(false)}
        title="Add PDF Form Field"
        icon={Plus}
        badge={`${totalFieldsCount} placed`}
        position="bottom"
      >
        <FieldPaletteToolbar
          onAddField={(type, targetRecId) => {
            handlePaletteAddField(type, targetRecId);
            setIsPaletteDrawerOpen(false);
          }}
          activeFieldCount={totalFieldsCount}
          mode={mode}
          recipients={recipients}
          activeRecipientId={activeRecipientId}
          onSelectActiveRecipient={(id) => setActiveRecipientId(id)}
        />
      </MobileDrawer>

      {/* 3. Mobile Field Properties Sheet (when field is selected) */}
      <MobileDrawer
        isOpen={isPropertiesDrawerOpen && !!selectedField}
        onClose={() => setIsPropertiesDrawerOpen(false)}
        title={`Edit ${selectedField?.type ? selectedField.type.toUpperCase() : "Field"}`}
        icon={Sliders}
        position="bottom"
      >
        {selectedField && (
          <FieldPropertiesPanel
            field={selectedField}
            onUpdateField={handleUpdateField}
            onDeleteField={() => {
              handleDeleteField(selectedField.id);
              setIsPropertiesDrawerOpen(false);
            }}
            onDuplicateField={() => {
              handleDuplicateField(selectedField);
              setIsPropertiesDrawerOpen(false);
            }}
            onOpenSignatureModal={() => setIsSignatureModalOpen(true)}
            onOpenInitialsModal={() => setIsInitialsModalOpen(true)}
            onOpenStampModal={() => setIsStampModalOpen(true)}
            onDeselect={() => {
              setSelectedFieldId(null);
              setIsPropertiesDrawerOpen(false);
            }}
            totalPages={file.pageCount}
            onMoveToPage={(targetPage) => {
              handleMoveFieldToPage(selectedField, targetPage);
              setIsPropertiesDrawerOpen(false);
            }}
            mode={mode}
            recipients={recipients}
          />
        )}
      </MobileDrawer>

      {/* 4. Mobile Recipients Drawer (Several People Mode) */}
      {mode === "several-people" && (
        <MobileDrawer
          isOpen={isRecipientsDrawerOpen}
          onClose={() => setIsRecipientsDrawerOpen(false)}
          title="Recipients Management"
          icon={Users}
          badge={`${recipients.length} ${recipients.length === 1 ? "recipient" : "recipients"}`}
          position="bottom"
        >
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
        </MobileDrawer>
      )}

      {/* Keyboard Shortcuts Modal (Phase 3E) */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Signature Creator Modal */}
      <SignatureCreatorModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onApplySignature={handleSaveSignature}
        onSaveSignature={handleSaveSignature}
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
