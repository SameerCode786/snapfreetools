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
  ChevronDown
} from "lucide-react";
import { formatDateValue } from "../utils/fieldCoordinateMath.js";
import { getRecipientById } from "../utils/recipientUtils.js";

export default function FieldOverlayItem({
  field,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onDuplicate,
  containerBounds,
  totalPages = 1,
  onMoveToPage,
  mode = "only-me",
  recipients = []
}) {
  const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0, startFieldX: 0, startFieldY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, startWidth: 0, startHeight: 0, startFieldX: 0, startFieldY: 0 });

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
      x: e.clientX,
      y: e.clientY,
      startFieldX: field.x,
      startFieldY: field.y
    };
  };

  // Handle Resize Pointer Down
  const handleResizePointerDown = (e) => {
    e.stopPropagation();
    onSelect();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startWidth: field.width,
      startHeight: field.height,
      startFieldX: field.x,
      startFieldY: field.y
    };
  };

  // Drag and Resize Pointer Movement Listener
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handlePointerMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const maxX = Math.max(0, containerBounds.width - field.width);
        const maxY = Math.max(0, containerBounds.height - field.height);

        const newX = Math.max(0, Math.min(maxX, dragStartRef.current.startFieldX + deltaX));
        const newY = Math.max(0, Math.min(maxY, dragStartRef.current.startFieldY + deltaY));

        onUpdate({
          ...field,
          x: Math.round(newX),
          y: Math.round(newY)
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const deltaY = e.clientY - resizeStartRef.current.y;

        const isImageField = field.type === "signature" || field.type === "initials" || field.type === "stamp";
        const minWidth = isImageField ? 40 : 60;
        const minHeight = isImageField ? 20 : 20;

        const maxWidth = containerBounds.width - resizeStartRef.current.startFieldX;
        const maxHeight = containerBounds.height - resizeStartRef.current.startFieldY;

        let newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.startWidth + deltaX));
        let newHeight;

        if (isImageField) {
          const aspectRatio = resizeStartRef.current.startWidth / resizeStartRef.current.startHeight;
          newHeight = newWidth / aspectRatio;
          if (newHeight > maxHeight) {
            newHeight = maxHeight;
            newWidth = newHeight * aspectRatio;
          }
        } else {
          newHeight = Math.max(minHeight, Math.min(maxHeight, resizeStartRef.current.startHeight + deltaY));
        }

        onUpdate({
          ...field,
          width: Math.round(newWidth),
          height: Math.round(newHeight)
        });
      }
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, isResizing, field, containerBounds, onUpdate]);

  // Keyboard navigation for nudge / delete
  useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }

      const step = e.shiftKey ? 10 : 1;
      let handled = false;

      if (e.key === "ArrowLeft") {
        onUpdate({ ...field, x: Math.max(0, field.x - step) });
        handled = true;
      } else if (e.key === "ArrowRight") {
        const maxX = Math.max(0, containerBounds.width - field.width);
        onUpdate({ ...field, x: Math.min(maxX, field.x + step) });
        handled = true;
      } else if (e.key === "ArrowUp") {
        onUpdate({ ...field, y: Math.max(0, field.y - step) });
        handled = true;
      } else if (e.key === "ArrowDown") {
        const maxY = Math.max(0, containerBounds.height - field.height);
        onUpdate({ ...field, y: Math.min(maxY, field.y + step) });
        handled = true;
      } else if (e.key === "Delete" || e.key === "Backspace") {
        onDelete();
        handled = true;
      }

      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSelected, field, containerBounds, onUpdate, onDelete]);

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

  // Styling dynamically assigned based on mode and recipient
  const activeBorderColor = recipientColor?.border || (isSelected ? "#10b981" : "#cbd5e1");
  const activeBgColor = recipientColor ? (isSelected ? recipientColor.bg : "rgba(255, 255, 255, 0.6)") : (isSelected ? "rgba(16, 185, 129, 0.08)" : "rgba(255, 255, 255, 0.4)");

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute select-none cursor-move group transition-shadow rounded-sm ${
        isSelected
          ? "ring-2 ring-offset-1 shadow-lg"
          : "hover:ring-1 hover:ring-slate-400"
      }`}
      style={{
        left: `${field.x}px`,
        top: `${field.y}px`,
        width: `${field.width}px`,
        height: `${field.height}px`,
        opacity: typeof field.opacity === "number" ? field.opacity : 1.0,
        touchAction: "none",
        zIndex: isSelected ? 30 : 10,
        borderColor: activeBorderColor,
        borderWidth: "1.5px",
        borderStyle: field.required === false ? "dashed" : "solid",
        backgroundColor: activeBgColor,
        outlineColor: recipientColor?.primary || "#10b981"
      }}
    >
      {/* Field Content Body */}
      <div
        onPointerDown={handleDragPointerDown}
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
              fontSize: `${field.style?.fontSize || 13}px`,
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
              fontSize: `${field.style?.fontSize || 12}px`,
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
              fontSize: `${field.style?.fontSize || 12}px`,
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
        className={`absolute -top-4 left-1 px-1.5 py-0.5 rounded text-[9.5px] font-bold text-white tracking-wide flex items-center gap-1 shadow-xs pointer-events-none transition-opacity ${
          recipientColor ? recipientColor.badgeBg : meta.badgeColor
        } ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
      >
        <IconComp className="w-2.5 h-2.5" />
        <span>
          {assignedRecipient ? `${assignedRecipient.name} • ${meta.label}` : meta.label}
          {field.required !== false && " *"}
        </span>
      </div>

      {/* Active Floating Control Toolbar (Shown when selected) */}
      {isSelected && (
        <div
          className="absolute -top-10 right-0 flex items-center gap-1 bg-slate-900/90 text-white p-1 rounded-lg shadow-xl backdrop-blur-sm z-40 border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Rotate (for image fields) */}
          {isImageField && (
            <button
              onClick={handleRotate}
              title="Rotate 90°"
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Move Page Dropdown if multi-page */}
          {totalPages > 1 && onMoveToPage && (
            <div className="relative flex items-center">
              <select
                value={field.pageNumber || 1}
                onChange={(e) => onMoveToPage(parseInt(e.target.value, 10))}
                className="bg-slate-800 text-[11px] font-semibold text-emerald-400 px-1.5 py-0.5 rounded hover:bg-slate-700 cursor-pointer border border-slate-700 focus:outline-none"
                title="Move field to another page"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>
                    Page {p}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duplicate Button */}
          {onDuplicate && (
            <button
              onClick={onDuplicate}
              title="Duplicate field"
              className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete Button */}
          <button
            onClick={onDelete}
            title="Delete field"
            className="p-1 rounded hover:bg-red-600/80 text-slate-300 hover:text-white transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Resize Handle (Bottom Right) */}
      {isSelected && (
        <div
          onPointerDown={handleResizePointerDown}
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white shadow cursor-se-resize flex items-center justify-center z-40 hover:scale-125 transition-transform"
          style={{ backgroundColor: recipientColor?.primary || "#10b981" }}
          title="Drag to resize field"
        />
      )}
    </div>
  );
}
