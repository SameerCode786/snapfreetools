"use client";

import React, { useRef, useState, useEffect } from "react";
import { Trash2, RotateCw, Calendar, User, Move, Check } from "lucide-react";

export default function SignatureOverlay({
  signature,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  containerBounds
}) {
  const overlayRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startSigX: 0, startSigY: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, startWidth: 0, startHeight: 0, startSigX: 0, startSigY: 0 });

  // Handle Drag Pointer Down
  const handleDragPointerDown = (e) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startSigX: signature.x,
      startSigY: signature.y
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
      startWidth: signature.width,
      startHeight: signature.height,
      startSigX: signature.x,
      startSigY: signature.y
    };
  };

  // Global pointer move & up for smooth dragging and resizing outside overlay boundary
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handlePointerMove = (e) => {
      if (isDragging) {
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        const maxX = Math.max(0, containerBounds.width - signature.width);
        const maxY = Math.max(0, containerBounds.height - signature.height);

        const newX = Math.max(0, Math.min(maxX, dragStartRef.current.startSigX + deltaX));
        const newY = Math.max(0, Math.min(maxY, dragStartRef.current.startSigY + deltaY));

        onUpdate({
          ...signature,
          x: Math.round(newX),
          y: Math.round(newY)
        });
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartRef.current.x;
        const aspectRatio = resizeStartRef.current.startWidth / resizeStartRef.current.startHeight;

        // Minimum 40px width, maximum up to container width
        const minWidth = 40;
        const maxWidth = containerBounds.width - resizeStartRef.current.startSigX;

        let newWidth = Math.max(minWidth, Math.min(maxWidth, resizeStartRef.current.startWidth + deltaX));
        let newHeight = newWidth / aspectRatio;

        if (resizeStartRef.current.startSigY + newHeight > containerBounds.height) {
          newHeight = containerBounds.height - resizeStartRef.current.startSigY;
          newWidth = newHeight * aspectRatio;
        }

        onUpdate({
          ...signature,
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
  }, [isDragging, isResizing, signature, containerBounds, onUpdate]);

  // Rotate signature 90 degrees clockwise
  const handleRotate = (e) => {
    e.stopPropagation();
    const nextRotation = ((signature.rotation || 0) + 90) % 360;
    onUpdate({
      ...signature,
      rotation: nextRotation
    });
  };

  const formattedDate = new Date().toISOString().split("T")[0];

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`absolute select-none cursor-move group transition-shadow ${
        isSelected
          ? "ring-2 ring-emerald-500 ring-offset-1 shadow-md bg-emerald-50/10"
          : "hover:ring-1 hover:ring-emerald-400"
      }`}
      style={{
        left: `${signature.x}px`,
        top: `${signature.y}px`,
        width: `${signature.width}px`,
        height: `${signature.height}px`,
        opacity: typeof signature.opacity === "number" ? signature.opacity : 1.0,
        touchAction: "none"
      }}
    >
      {/* Signature Image Graphic */}
      <div
        onPointerDown={handleDragPointerDown}
        className="w-full h-full flex items-center justify-center relative"
      >
        <img
          src={signature.dataUrl}
          alt="Signature Overlay"
          className="w-full h-full object-contain pointer-events-none"
          style={{
            transform: `rotate(${signature.rotation || 0}deg)`,
            transition: "transform 0.15s ease"
          }}
        />

        {/* Embedded Optional Signer / Date Badges Preview */}
        {(signature.includeSignerName || signature.includeDate) && (
          <div className="absolute -bottom-5 left-0 right-0 text-[8px] font-bold text-slate-700 whitespace-nowrap overflow-hidden text-ellipsis bg-white/85 px-1 rounded shadow-2xs">
            {signature.includeSignerName && signature.signerName && (
              <span>{signature.signerName} </span>
            )}
            {signature.includeDate && (
              <span>{signature.dateString || formattedDate}</span>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Controls (when selected) */}
      {isSelected && (
        <>
          {/* Top Bar Actions */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-lg px-2 py-1 flex items-center gap-1.5 z-20"
          >
            <button
              onClick={handleRotate}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw size={13} />
            </button>
            <div className="w-[1px] h-3 bg-slate-700" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdate({
                  ...signature,
                  includeDate: !signature.includeDate,
                  dateString: formattedDate
                });
              }}
              className={`p-1 rounded transition-colors cursor-pointer ${
                signature.includeDate ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white"
              }`}
              title="Toggle Date Stamp"
            >
              <Calendar size={13} />
            </button>
            <div className="w-[1px] h-3 bg-slate-700" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 rounded transition-colors cursor-pointer"
              title="Delete Signature"
            >
              <Trash2 size={13} />
            </button>
          </div>

          {/* Bottom-Right Corner Resize Handle */}
          <div
            onPointerDown={handleResizePointerDown}
            className="absolute -bottom-2 -right-2 w-5 h-5 bg-white border-2 border-emerald-600 rounded-full shadow-xs cursor-nwse-resize flex items-center justify-center z-20 hover:scale-110 transition-transform"
            title="Drag to resize"
          >
            <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
          </div>
        </>
      )}
    </div>
  );
}
