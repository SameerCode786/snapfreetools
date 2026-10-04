"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  screenToPdfPoint,
  pdfToScreenPoint,
  smoothPoints,
  pointsToSvgPath,
  calculateArrowGeometry,
  normalizeRectangle,
  calculateEllipseGeometry,
  hexToNormalizedRgb
} from "../utils/drawingMath.js";
import { Check, X, Trash2 } from "lucide-react";

export default function DrawingCanvas({
  pageNumber,
  pagePreviewUrl,
  pageDimensions = { width: 600, height: 800, rotation: 0 },
  zoomScale = 1.0,
  activeTool = "pen",
  color = "#000000",
  strokeWidth = 3,
  opacity = 1.0,
  fontSize = 16,
  annotations = [],
  onAddAnnotation,
  onDeleteAnnotation,
  onUpdateAnnotation
}) {
  const containerRef = useRef(null);
  const activeStrokePointsRef = useRef([]);
  const isDrawingRef = useRef(false);
  const animFrameIdRef = useRef(null);

  // Live preview state for active drawing shape
  const [livePreview, setLivePreview] = useState(null);
  const [hoveredAnnotationId, setHoveredAnnotationId] = useState(null);

  // Active Text Box editing state
  const [activeTextInput, setActiveTextInput] = useState(null);
  const textInputRef = useRef(null);

  // Calculate rendered screen container dimensions based on page dimensions and zoom
  const displayWidth = Math.round((pageDimensions.width || 600) * zoomScale);
  const displayHeight = Math.round((pageDimensions.height || 800) * zoomScale);
  const pageRotation = pageDimensions.rotation || 0;

  // Focus textarea when text editing starts
  useEffect(() => {
    if (activeTextInput && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [activeTextInput]);

  // Handle Text Submission
  const handleConfirmText = () => {
    if (!activeTextInput || !activeTextInput.text.trim()) {
      setActiveTextInput(null);
      return;
    }

    const newAnnot = {
      id: `annot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      pageNumber,
      type: "text",
      text: activeTextInput.text.trim(),
      x: activeTextInput.x,
      y: activeTextInput.y,
      width: activeTextInput.width || 200,
      height: activeTextInput.height || 40,
      color,
      fontSize,
      opacity,
      previewWidth: displayWidth,
      previewHeight: displayHeight,
      rotation: pageRotation
    };

    onAddAnnotation(newAnnot);
    setActiveTextInput(null);
  };

  const handleCancelText = () => {
    setActiveTextInput(null);
  };

  // Convert raw client coordinates to screen container relative pixels
  const getCanvasCoords = useCallback((e) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    return { x, y };
  }, []);

  // Pointer Down (Start Drawing / Text Input / Eraser)
  const handlePointerDown = (e) => {
    if (activeTool === "select") return;

    // Direct click on Text input element or buttons must not trigger drawing
    if (e.target.closest(".text-input-container") || e.target.closest("button")) {
      return;
    }

    const coords = getCanvasCoords(e);

    // 1. TEXT TOOL: Spawn text input
    if (activeTool === "text") {
      if (activeTextInput) {
        handleConfirmText();
      } else {
        setActiveTextInput({
          x: coords.x,
          y: coords.y,
          text: "",
          width: 200,
          height: 40
        });
      }
      return;
    }

    // 2. ERASER TOOL: Delete hovered annotation
    if (activeTool === "eraser") {
      if (hoveredAnnotationId) {
        onDeleteAnnotation(hoveredAnnotationId);
        setHoveredAnnotationId(null);
      }
      return;
    }

    // 3. DRAWING TOOLS: Pen, Highlighter, Line, Arrow, Rectangle, Ellipse
    isDrawingRef.current = true;
    activeStrokePointsRef.current = [coords];

    if (e.target.setPointerCapture) {
      try {
        e.target.setPointerCapture(e.pointerId);
      } catch (err) {
        // Pointer capture may fail on some touch emulators safely
      }
    }

    setLivePreview({
      type: activeTool,
      startX: coords.x,
      startY: coords.y,
      currentX: coords.x,
      currentY: coords.y,
      points: [coords]
    });
  };

  // Pointer Move (Live Preview Throttling)
  const handlePointerMove = (e) => {
    const coords = getCanvasCoords(e);

    // Eraser hover detection
    if (activeTool === "eraser") {
      const hit = annotations.find((item) => {
        if (!item) return false;
        if (item.points && item.points.length > 0) {
          return item.points.some(
            (pt) => Math.hypot(pt.x - coords.x, pt.y - coords.y) <= Math.max(12, strokeWidth * 2)
          );
        }
        if (typeof item.x === "number" && typeof item.y === "number") {
          return (
            coords.x >= item.x - 10 &&
            coords.x <= item.x + (item.width || 20) + 10 &&
            coords.y >= item.y - 10 &&
            coords.y <= item.y + (item.height || 20) + 10
          );
        }
        return false;
      });

      setHoveredAnnotationId(hit ? hit.id : null);
      return;
    }

    if (!isDrawingRef.current) return;

    activeStrokePointsRef.current.push(coords);

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }

    animFrameIdRef.current = requestAnimationFrame(() => {
      setLivePreview((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          currentX: coords.x,
          currentY: coords.y,
          points: [...activeStrokePointsRef.current]
        };
      });
    });
  };

  // Pointer Up (Commit Annotation)
  const handlePointerUp = (e) => {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;

    if (e.target.releasePointerCapture) {
      try {
        e.target.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const currentPoints = [...activeStrokePointsRef.current];
    activeStrokePointsRef.current = [];

    if (!livePreview) return;

    const { startX, startY, currentX, currentY } = livePreview;

    const newAnnotId = `annot-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    let finalAnnot = null;

    // 1. Freehand Pen & Highlighter
    if (activeTool === "pen" || activeTool === "highlighter") {
      if (currentPoints.length > 0) {
        finalAnnot = {
          id: newAnnotId,
          pageNumber,
          type: activeTool,
          points: currentPoints,
          color,
          strokeWidth: activeTool === "highlighter" ? Math.max(12, strokeWidth) : strokeWidth,
          opacity: activeTool === "highlighter" ? 0.35 : opacity,
          previewWidth: displayWidth,
          previewHeight: displayHeight,
          rotation: pageRotation
        };
      }
    }

    // 2. Line Tool
    else if (activeTool === "line") {
      finalAnnot = {
        id: newAnnotId,
        pageNumber,
        type: "line",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
        color,
        strokeWidth,
        opacity,
        previewWidth: displayWidth,
        previewHeight: displayHeight,
        rotation: pageRotation
      };
    }

    // 3. Arrow Tool
    else if (activeTool === "arrow") {
      finalAnnot = {
        id: newAnnotId,
        pageNumber,
        type: "arrow",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
        color,
        strokeWidth,
        opacity,
        previewWidth: displayWidth,
        previewHeight: displayHeight,
        rotation: pageRotation
      };
    }

    // 4. Rectangle Tool
    else if (activeTool === "rectangle") {
      const norm = normalizeRectangle({
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY
      });

      if (norm.width > 2 || norm.height > 2) {
        finalAnnot = {
          id: newAnnotId,
          pageNumber,
          type: "rectangle",
          x: norm.x,
          y: norm.y,
          width: norm.width,
          height: norm.height,
          color,
          strokeWidth,
          opacity,
          previewWidth: displayWidth,
          previewHeight: displayHeight,
          rotation: pageRotation
        };
      }
    }

    // 5. Circle / Ellipse Tool
    else if (activeTool === "ellipse") {
      const norm = normalizeRectangle({
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY
      });

      if (norm.width > 2 || norm.height > 2) {
        finalAnnot = {
          id: newAnnotId,
          pageNumber,
          type: "ellipse",
          x: norm.x,
          y: norm.y,
          width: norm.width,
          height: norm.height,
          color,
          strokeWidth,
          opacity,
          previewWidth: displayWidth,
          previewHeight: displayHeight,
          rotation: pageRotation
        };
      }
    }

    if (finalAnnot) {
      onAddAnnotation(finalAnnot);
    }

    setLivePreview(null);
  };

  const handlePointerCancel = (e) => {
    isDrawingRef.current = false;
    activeStrokePointsRef.current = [];
    setLivePreview(null);
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      style={{
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        touchAction: "none"
      }}
      className="relative mx-auto bg-white shadow-2xl rounded-sm overflow-hidden select-none cursor-crosshair"
    >
      {/* Layer 1: PDF.js Page Render Background */}
      {pagePreviewUrl ? (
        <img
          src={pagePreviewUrl}
          alt={`PDF Page ${pageNumber}`}
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400 text-sm font-medium">
          Loading Page {pageNumber}...
        </div>
      )}

      {/* Layer 2: Interactive SVG Drawing & Vector Overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 ${displayWidth} ${displayHeight}`}
      >
        {/* Render Committed Annotations */}
        {annotations.map((item) => {
          if (!item) return null;
          const isHovered = item.id === hoveredAnnotationId;
          const strokeColor = item.color || "#000000";
          const itemStrokeWidth = item.strokeWidth || 2;
          const itemOpacity = typeof item.opacity === "number" ? item.opacity : 1.0;

          // Freehand Pen / Highlighter
          if (item.type === "pen" || item.type === "highlighter") {
            const svgPathData = pointsToSvgPath(item.points || []);
            return (
              <path
                key={item.id}
                d={svgPathData}
                fill="none"
                stroke={isHovered ? "#ef4444" : strokeColor}
                strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={itemOpacity}
              />
            );
          }

          // Line Annotation
          if (item.type === "line") {
            const endX = (item.x || 0) + (item.width || 0);
            const endY = (item.y || 0) + (item.height || 0);
            return (
              <line
                key={item.id}
                x1={item.x}
                y1={item.y}
                x2={endX}
                y2={endY}
                stroke={isHovered ? "#ef4444" : strokeColor}
                strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                strokeLinecap="round"
                opacity={itemOpacity}
              />
            );
          }

          // Arrow Annotation
          if (item.type === "arrow") {
            const endX = (item.x || 0) + (item.width || 0);
            const endY = (item.y || 0) + (item.height || 0);
            const arrowGeo = calculateArrowGeometry({
              startX: item.x || 0,
              startY: item.y || 0,
              endX,
              endY,
              arrowSize: Math.max(10, itemStrokeWidth * 3)
            });

            return (
              <g key={item.id} opacity={itemOpacity}>
                <line
                  x1={item.x}
                  y1={item.y}
                  x2={endX}
                  y2={endY}
                  stroke={isHovered ? "#ef4444" : strokeColor}
                  strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                  strokeLinecap="round"
                />
                <line
                  x1={endX}
                  y1={endY}
                  x2={arrowGeo.arrowLeft.x}
                  y2={arrowGeo.arrowLeft.y}
                  stroke={isHovered ? "#ef4444" : strokeColor}
                  strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                  strokeLinecap="round"
                />
                <line
                  x1={endX}
                  y1={endY}
                  x2={arrowGeo.arrowRight.x}
                  y2={arrowGeo.arrowRight.y}
                  stroke={isHovered ? "#ef4444" : strokeColor}
                  strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                  strokeLinecap="round"
                />
              </g>
            );
          }

          // Rectangle Annotation
          if (item.type === "rectangle") {
            return (
              <rect
                key={item.id}
                x={item.x}
                y={item.y}
                width={item.width}
                height={item.height}
                fill={item.fillColor || "none"}
                stroke={isHovered ? "#ef4444" : strokeColor}
                strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                opacity={itemOpacity}
                rx={2}
              />
            );
          }

          // Circle / Ellipse Annotation
          if (item.type === "circle" || item.type === "ellipse") {
            const rx = (item.width || 0) / 2;
            const ry = (item.height || 0) / 2;
            const cx = (item.x || 0) + rx;
            const cy = (item.y || 0) + ry;

            return (
              <ellipse
                key={item.id}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill={item.fillColor || "none"}
                stroke={isHovered ? "#ef4444" : strokeColor}
                strokeWidth={isHovered ? itemStrokeWidth + 3 : itemStrokeWidth}
                opacity={itemOpacity}
              />
            );
          }

          // Text Annotation Render
          if (item.type === "text") {
            const lines = (item.text || "").split("\n");
            const itemFontSize = item.fontSize || 16;

            return (
              <g key={item.id} opacity={itemOpacity}>
                {lines.map((line, idx) => (
                  <text
                    key={idx}
                    x={item.x}
                    y={item.y + idx * itemFontSize * 1.25 + itemFontSize}
                    fill={isHovered ? "#ef4444" : strokeColor}
                    fontSize={itemFontSize}
                    fontFamily="sans-serif"
                    fontWeight="500"
                  >
                    {line}
                  </text>
                ))}
              </g>
            );
          }

          return null;
        })}

        {/* Live Active Drawing Shape Preview */}
        {livePreview && (
          <>
            {(livePreview.type === "pen" || livePreview.type === "highlighter") && (
              <path
                d={pointsToSvgPath(livePreview.points || [])}
                fill="none"
                stroke={color}
                strokeWidth={livePreview.type === "highlighter" ? Math.max(12, strokeWidth) : strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={livePreview.type === "highlighter" ? 0.35 : opacity}
              />
            )}

            {livePreview.type === "line" && (
              <line
                x1={livePreview.startX}
                y1={livePreview.startY}
                x2={livePreview.currentX}
                y2={livePreview.currentY}
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                opacity={opacity}
              />
            )}

            {livePreview.type === "arrow" && (
              (() => {
                const arrowGeo = calculateArrowGeometry({
                  startX: livePreview.startX,
                  startY: livePreview.startY,
                  endX: livePreview.currentX,
                  endY: livePreview.currentY,
                  arrowSize: Math.max(10, strokeWidth * 3)
                });
                return (
                  <g opacity={opacity}>
                    <line
                      x1={livePreview.startX}
                      y1={livePreview.startY}
                      x2={livePreview.currentX}
                      y2={livePreview.currentY}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                    />
                    <line
                      x1={livePreview.currentX}
                      y1={livePreview.currentY}
                      x2={arrowGeo.arrowLeft.x}
                      y2={arrowGeo.arrowLeft.y}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                    />
                    <line
                      x1={livePreview.currentX}
                      y1={livePreview.currentY}
                      x2={arrowGeo.arrowRight.x}
                      y2={arrowGeo.arrowRight.y}
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                    />
                  </g>
                );
              })()
            )}

            {livePreview.type === "rectangle" && (
              (() => {
                const norm = normalizeRectangle({
                  x: livePreview.startX,
                  y: livePreview.startY,
                  width: livePreview.currentX - livePreview.startX,
                  height: livePreview.currentY - livePreview.startY
                });
                return (
                  <rect
                    x={norm.x}
                    y={norm.y}
                    width={norm.width}
                    height={norm.height}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray="4 4"
                    opacity={opacity}
                  />
                );
              })()
            )}

            {livePreview.type === "ellipse" && (
              (() => {
                const norm = normalizeRectangle({
                  x: livePreview.startX,
                  y: livePreview.startY,
                  width: livePreview.currentX - livePreview.startX,
                  height: livePreview.currentY - livePreview.startY
                });
                const rx = norm.width / 2;
                const ry = norm.height / 2;
                return (
                  <ellipse
                    cx={norm.x + rx}
                    cy={norm.y + ry}
                    rx={rx}
                    ry={ry}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray="4 4"
                    opacity={opacity}
                  />
                );
              })()
            )}
          </>
        )}
      </svg>

      {/* Layer 3: Text Editing Input Overlay */}
      {activeTextInput && (
        <div
          className="text-input-container absolute z-20 flex flex-col gap-1 p-2 bg-slate-900/90 border border-slate-700 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 pointer-events-auto"
          style={{
            left: `${activeTextInput.x}px`,
            top: `${activeTextInput.y}px`
          }}
        >
          <textarea
            ref={textInputRef}
            value={activeTextInput.text}
            onChange={(e) =>
              setActiveTextInput((prev) => ({ ...prev, text: e.target.value }))
            }
            placeholder="Type text note..."
            style={{ color, fontSize: `${fontSize}px` }}
            className="w-48 sm:w-64 min-h-[60px] p-2 bg-slate-950 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 resize-y text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                handleConfirmText();
              } else if (e.key === "Escape") {
                e.preventDefault();
                handleCancelText();
              }
            }}
          />

          <div className="flex items-center justify-end gap-1 pt-1">
            <button
              onClick={handleCancelText}
              title="Cancel (Esc)"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X size={14} />
            </button>
            <button
              onClick={handleConfirmText}
              title="Confirm Text"
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-md flex items-center gap-1"
            >
              <Check size={14} />
              <span>Add</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
