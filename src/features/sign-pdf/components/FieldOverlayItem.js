"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  Trash2,
  Copy,
  RotateCw,
  Calendar,
  User,
  Type,
  PenTool,
  FileText,
  Award,
  Move,
  Check,
  ChevronDown,
  AlertCircle
} from "lucide-react";
import {
  formatDateValue,
  calculateFieldResize,
  computeSmartGuidesAndSnap,
  nudgeFieldCoordinates,
  isTypingContext
} from "../utils/fieldCoordinateMath.js";
import { getRecipientById } from "../utils/recipientUtils.js";

export default function FieldOverlayItem({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  onDeselect,
  containerBounds,
  totalPages = 1,
  onMoveToPage,
  mode = "only-me",
  recipients = [],
  zoomScale = 1.0,
  siblingFields = [],
  onDragGuidesChange,
  focusedRecipientId = "all"
}) {
  const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const activeHandleRef = useRef(null);

  const dragStartRef = useRef({ clientX: 0, clientY: 0, startFieldX: 0, startFieldY: 0 });
  const resizeStartRef = useRef({ clientX: 0, clientY: 0, x: 0, y: 0, width: 0, height: 0 });

  // Get recipient assigned to this field in several-people mode
  const assignedRecipient = mode === "several-people" ? getRecipientById(field.recipientId, recipients) : null;
  const recipientColor = assignedRecipient?.color;

  // Handle Drag Pointer Down
  const handleDragPointerDown = (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON" || e.target.tagName === "SELECT") {
      return;
    }
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      startFieldX: field.x,
      startFieldY: field.y
    };
  };

  // Handle Resize Pointer Down for any of the 8 handles
  const handleResizePointerDown = (e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    onSelect();
    setIsResizing(true);
    activeHandleRef.current = handle;
    resizeStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      x: field.x,
      y: field.y,
      width: field.width,
      height: field.height
    };
  };

  // Drag and Resize Pointer Movement Listener
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const scale = zoomScale > 0 ? zoomScale : 1.0;

    const handlePointerMove = (e) => {
      if (isDragging) {
        const deltaX = (e.clientX - dragStartRef.current.clientX) / scale;
        const deltaY = (e.clientY - dragStartRef.current.clientY) / scale;

        const rawX = dragStartRef.current.startFieldX + deltaX;
        const rawY = dragStartRef.current.startFieldY + deltaY;

        const { snappedX, snappedY, activeGuides } = computeSmartGuidesAndSnap({
          rawX,
          rawY,
          width: field.width,
          height: field.height,
          containerBounds,
          siblingFields,
          threshold: 6
        });

        if (onDragGuidesChange) {
          onDragGuidesChange(activeGuides);
        }

        onUpdate({
          ...field,
          x: snappedX,
          y: snappedY
        });
      } else if (isResizing && activeHandleRef.current) {
        const deltaX = (e.clientX - resizeStartRef.current.clientX) / scale;
        const deltaY = (e.clientY - resizeStartRef.current.clientY) / scale;

        const isImageField = field.type === "signature" || field.type === "initials" || field.type === "stamp";
        const minWidth = isImageField ? 40 : 35;
        const minHeight = isImageField ? 20 : 16;
        const isCorner = ["nw", "ne", "sw", "se"].includes(activeHandleRef.current);
        const lockAspect = (isImageField && isCorner) || !!field.lockAspectRatio;

        const newRect = calculateFieldResize({
          startRect: {
            x: resizeStartRef.current.x,
            y: resizeStartRef.current.y,
            width: resizeStartRef.current.width,
            height: resizeStartRef.current.height
          },
          handle: activeHandleRef.current,
          deltaX,
          deltaY,
          containerBounds,
          minWidth,
          minHeight,
          lockAspectRatio: lockAspect
        });

        onUpdate({
          ...field,
          ...newRect
        });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      activeHandleRef.current = null;
      if (onDragGuidesChange) {
        onDragGuidesChange([]);
      }
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isResizing, field, containerBounds, zoomScale, siblingFields, onUpdate, onDragGuidesChange]);

  // Keyboard navigation & shortcuts for selected field
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e) => {
      if (isTypingContext(e.target)) {
        return;
      }

      // Ctrl/Cmd + D (Duplicate)
      if ((e.ctrlKey || e.metaKey) && (e.key === "d" || e.key === "D")) {
        if (onDuplicate) {
          e.preventDefault();
          e.stopPropagation();
          onDuplicate();
          return;
        }
      }

      // Escape (Deselect)
      if (e.key === "Escape") {
        if (onDeselect) {
          e.preventDefault();
          e.stopPropagation();
          onDeselect();
          return;
        }
      }

      // Arrow Keys (Nudge 1 unit or 10 units with Shift)
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
        const step = e.shiftKey ? 10 : 1;
        const nudged = nudgeFieldCoordinates({
          x: field.x,
          y: field.y,
          width: field.width,
          height: field.height,
          direction: e.key,
          step,
          containerBounds
        });

        e.preventDefault();
        e.stopPropagation();
        onUpdate({
          ...field,
          ...nudged
        });
        return;
      }

      // Delete / Backspace (Delete field)
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        e.stopPropagation();
        onDelete();
        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, field, containerBounds, onUpdate, onDelete, onDuplicate, onDeselect]);

  // Rotate handler
  const handleRotate = (e) => {
    e.stopPropagation();
    const nextRotation = ((field.rotation || 0) + 90) % 360;
    onUpdate({
      ...field,
      rotation: nextRotation
    });
  };

  // Get field type icon & label
  const getFieldMeta = () => {
    switch (field.type) {
      case "signature":
        return { icon: PenTool, label: "Signature", badgeColor: "bg-emerald-600" };
      case "initials":
        return { icon: Type, label: "Initials", badgeColor: "bg-teal-600" };
      case "name":
        return { icon: User, label: "Name", badgeColor: "bg-blue-600" };
      case "date":
        return { icon: Calendar, label: "Date", badgeColor: "bg-indigo-600" };
      case "text":
        return { icon: FileText, label: "Text", badgeColor: "bg-slate-700" };
      case "stamp":
        return { icon: Award, label: "Stamp", badgeColor: "bg-amber-600" };
      default:
        return { icon: FileText, label: "Field", badgeColor: "bg-slate-600" };
    }
  };

  const meta = getFieldMeta();
  const IconComp = meta.icon;

  const isImageField = field.type === "signature" || field.type === "initials" || field.type === "stamp";
  const displayDate = field.type === "date" ? formatDateValue(field.value || new Date(), field.style?.dateFormat || "YYYY-MM-DD") : "";

  // Several People mode focus & assignment state
  const isUnassigned = mode === "several-people" && (!field.recipientId || !recipients.some((r) => r.id === field.recipientId));
  const isDimmed = mode === "several-people" && focusedRecipientId !== "all" && field.recipientId !== focusedRecipientId && !isUnassigned;
  const isFocused = mode === "several-people" && focusedRecipientId !== "all" && field.recipientId === focusedRecipientId;

  // Styling dynamically assigned based on mode, focus, and recipient
  let activeBorderColor = "#cbd5e1";
  let activeBgColor = "rgba(255, 255, 255, 0.4)";

  if (isUnassigned) {
    activeBorderColor = "#f59e0b";
    activeBgColor = isSelected ? "rgba(245, 158, 11, 0.12)" : "rgba(254, 243, 199, 0.5)";
  } else if (recipientColor) {
    activeBorderColor = isSelected || isFocused ? recipientColor.border : "#cbd5e1";
    activeBgColor = isSelected ? recipientColor.bg : (isFocused ? recipientColor.bg : "rgba(255, 255, 255, 0.6)");
  } else if (isSelected) {
    activeBorderColor = "#10b981";
    activeBgColor = "rgba(16, 185, 129, 0.08)";
  }

  // Keyboard Activation Handler on Field Focus
  const handleKeyDownSelect = (e) => {
    if (isDimmed) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      ref={overlayRef}
      tabIndex={isDimmed ? -1 : 0}
      role="button"
      aria-label={`${meta.label} form field${assignedRecipient ? `, assigned to ${assignedRecipient.name}` : ""}${isUnassigned ? ", unassigned" : ""}`}
      aria-selected={isSelected}
      aria-disabled={isDimmed}
      onKeyDown={handleKeyDownSelect}
      onClick={(e) => {
        if (isDimmed) return;
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute select-none cursor-move group transition-shadow rounded-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:outline-hidden ${
        isSelected
          ? "ring-2 ring-offset-1 shadow-lg"
          : isFocused
          ? "ring-1 ring-offset-1 shadow-md"
          : "hover:ring-1 hover:ring-slate-400"
      }`}
      style={{
        left: `${field.x * zoomScale}px`,
        top: `${field.y * zoomScale}px`,
        width: `${field.width * zoomScale}px`,
        height: `${field.height * zoomScale}px`,
        opacity: isDimmed ? 0.35 : (typeof field.opacity === "number" ? field.opacity : 1.0),
        pointerEvents: isDimmed ? "none" : "auto",
        touchAction: "none",
        zIndex: isSelected ? 30 : isFocused ? 20 : 10,
        borderColor: activeBorderColor,
        borderWidth: "1.5px",
        borderStyle: (field.required === false || isUnassigned) ? "dashed" : "solid",
        backgroundColor: activeBgColor,
        outlineColor: isUnassigned ? "#f59e0b" : (recipientColor?.primary || "#10b981")
      }}
    >
      {/* Field Content Body */}
      <div
        onPointerDown={isDimmed ? undefined : handleDragPointerDown}
        className="w-full h-full flex items-center justify-center relative overflow-hidden p-1"
      >
        {/* Render Image for Signature / Initials / Stamp */}
        {isImageField && field.dataUrl && (
          <img
            src={field.dataUrl}
            alt={meta.label}
            className="w-full h-full object-contain pointer-events-none"
            style={{
              transform: `rotate(${field.rotation || 0}deg)`,
              transition: "transform 0.15s ease"
            }}
          />
        )}

        {/* Render Name Field */}
        {field.type === "name" && (
          <div
            className="w-full h-full flex items-center px-2 text-slate-800 font-medium"
            style={{
              fontSize: `${(field.style?.fontSize || 13) * zoomScale}px`,
              color: field.style?.color || "#0f172a",
              justifyContent: field.style?.align === "center" ? "center" : field.style?.align === "right" ? "flex-end" : "flex-start",
              fontFamily: field.style?.fontFamily === "Courier" ? "Courier, monospace" : field.style?.fontFamily === "Times" ? "Times New Roman, serif" : "Helvetica, Arial, sans-serif"
            }}
          >
            {field.value || (assignedRecipient ? assignedRecipient.name : "Your Name")}
          </div>
        )}

        {/* Render Date Field */}
        {field.type === "date" && (
          <div
            className="w-full h-full flex items-center px-2 font-mono text-slate-800"
            style={{
              fontSize: `${(field.style?.fontSize || 12) * zoomScale}px`,
              color: field.style?.color || "#0f172a",
              justifyContent: field.style?.align === "center" ? "center" : field.style?.align === "right" ? "flex-end" : "flex-start"
            }}
          >
            {displayDate}
          </div>
        )}

        {/* Render Text Field */}
        {field.type === "text" && (
          <div
            className="w-full h-full flex items-center px-2 text-slate-800 break-words whitespace-pre-wrap leading-tight"
            style={{
              fontSize: `${(field.style?.fontSize || 12) * zoomScale}px`,
              color: field.style?.color || "#0f172a",
              justifyContent: field.style?.align === "center" ? "center" : field.style?.align === "right" ? "flex-end" : "flex-start",
              fontFamily: field.style?.fontFamily === "Courier" ? "Courier, monospace" : field.style?.fontFamily === "Times" ? "Times New Roman, serif" : "Helvetica, Arial, sans-serif"
            }}
          >
            {field.value || field.placeholder || "Type text here..."}
          </div>
        )}
      </div>

      {/* Type & Recipient Tag Badge (Top Left) */}
      <div
        className={`absolute -top-4.5 left-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold text-white tracking-wide flex items-center gap-1 shadow-xs pointer-events-none transition-opacity ${
          isUnassigned
            ? "bg-amber-600"
            : recipientColor
            ? recipientColor.badgeBg
            : meta.badgeColor
        } ${isSelected || isFocused || isUnassigned ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        {isUnassigned ? (
          <AlertCircle className="w-2.5 h-2.5 shrink-0" />
        ) : (
          <IconComp className="w-2.5 h-2.5 shrink-0" />
        )}
        <span>
          {isUnassigned
            ? `⚠ Unassigned • ${meta.label}`
            : assignedRecipient
            ? `${assignedRecipient.name} • ${meta.label}`
            : meta.label}
          {mode === "several-people" && !isUnassigned && field.required !== false && " *"}
        </span>
      </div>

      {/* Contextual Floating Quick-Action Toolbar (Shown when selected & not dimmed) */}
      {isSelected && !isDimmed && (
        <div
          className={`absolute ${
            (field.y * zoomScale) < 55 ? "top-[calc(100%+8px)]" : "bottom-[calc(100%+8px)]"
          } left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-1.5 bg-slate-900/95 text-white py-1 px-1.5 sm:px-2 rounded-xl shadow-2xl backdrop-blur-md z-50 border border-slate-700/80 animate-in fade-in zoom-in-95 duration-100 whitespace-nowrap text-xs max-w-[calc(100vw-36px)] overflow-x-auto no-scrollbar`}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {/* Rotate (for image fields) */}
          {isImageField && (
            <button
              type="button"
              onClick={handleRotate}
              title="Rotate 90°"
              aria-label="Rotate 90°"
              className="p-1.5 sm:p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Required / Optional Quick Toggle (Several People mode) */}
          {mode === "several-people" && (
            <button
              type="button"
              onClick={() => onUpdate({ ...field, required: field.required === false ? true : false })}
              title={field.required === false ? "Mark as Required" : "Mark as Optional"}
              aria-label={field.required === false ? "Mark as Required" : "Mark as Optional"}
              className={`px-2 py-1 sm:py-0.5 rounded-lg text-[10.5px] font-bold transition-colors flex items-center gap-1 ${
                field.required !== false
                  ? "bg-blue-600 text-white hover:bg-blue-500 shadow-xs"
                  : "bg-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>{field.required !== false ? "Required *" : "Optional"}</span>
            </button>
          )}

          {/* Quick Recipient Assignment (Several People mode) */}
          {mode === "several-people" && recipients.length > 0 && (
            <div className="relative flex items-center">
              <select
                value={field.recipientId || ""}
                onChange={(e) => onUpdate({ ...field, recipientId: e.target.value || null })}
                className={`text-[11px] font-bold px-2 py-1 sm:py-0.5 rounded-lg cursor-pointer border focus:outline-hidden transition-colors ${
                  isUnassigned
                    ? "bg-amber-500/25 text-amber-300 border-amber-500/50"
                    : "bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-750"
                }`}
                title="Assign recipient"
                aria-label="Assign recipient"
              >
                {isUnassigned && <option value="" className="bg-slate-900 text-amber-400">⚠ Assign...</option>}
                {recipients.map((rec) => (
                  <option key={rec.id} value={rec.id} className="bg-slate-900 text-white">
                    {rec.order}. {rec.name || "Unnamed"} ({rec.role})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Move Page Dropdown if multi-page */}
          {totalPages > 1 && onMoveToPage && (
            <div className="relative flex items-center">
              <select
                value={field.pageNumber || 1}
                onChange={(e) => onMoveToPage(parseInt(e.target.value, 10))}
                className="bg-slate-800 text-[11px] font-semibold text-slate-300 px-1.5 py-1 sm:py-0.5 rounded-lg hover:bg-slate-750 cursor-pointer border border-slate-700 focus:outline-hidden"
                title="Move field to another page"
                aria-label="Move field to another page"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p} className="bg-slate-900 text-white">
                    Page {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duplicate Button */}
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              title="Duplicate field"
              aria-label="Duplicate field"
              className="p-1.5 sm:p-1 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Delete field"
              aria-label="Delete field"
              className="p-1.5 sm:p-1 rounded-lg hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 8-Point Resize Handles (Active when field is selected & not dimmed) */}
      {isSelected && !isDimmed && (
        <>
          {/* North-West (NW) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "nw")}
            className="absolute -top-1.5 -left-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Top-Left"
            aria-label="Resize Top-Left"
          />

          {/* North (N) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "n")}
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-ns-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Top"
            aria-label="Resize Top"
          />

          {/* North-East (NE) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "ne")}
            className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Top-Right"
            aria-label="Resize Top-Right"
          />

          {/* East (E) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "e")}
            className="absolute top-1/2 -translate-y-1/2 -right-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-ew-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Right"
            aria-label="Resize Right"
          />

          {/* South-East (SE) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "se")}
            className="absolute -bottom-1.5 -right-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-nwse-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Bottom-Right"
            aria-label="Resize Bottom-Right"
          />

          {/* South (S) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "s")}
            className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-ns-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Bottom"
            aria-label="Resize Bottom"
          />

          {/* South-West (SW) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "sw")}
            className="absolute -bottom-1.5 -left-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-nesw-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Bottom-Left"
            aria-label="Resize Bottom-Left"
          />

          {/* West (W) */}
          <div
            onPointerDown={(e) => handleResizePointerDown(e, "w")}
            className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 rounded-[2px] bg-white border-2 shadow-xs cursor-ew-resize z-40 hover:scale-125 transition-transform touch-none before:absolute before:-inset-2 before:content-['']"
            style={{ borderColor: recipientColor?.primary || "#10b981" }}
            title="Resize Left"
            aria-label="Resize Left"
          />
        </>
      )}
    </div>
  );
}
