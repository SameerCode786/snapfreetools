"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  PenTool,
  Type,
  Upload,
  X,
  RotateCcw,
  Trash2,
  Check,
  Sparkles,
  AlertCircle
} from "lucide-react";
import {
  SIGNATURE_FONTS,
  generateTypedSignatureDataUrl,
  trimCanvasWhitespace,
  processUploadedSignatureImage
} from "../utils/signatureCanvasUtils";

const SIGNATURE_COLORS = [
  { id: "black", name: "Black", hex: "#0f172a" },
  { id: "blue", name: "Ink Blue", hex: "#1d4ed8" },
  { id: "red", name: "Dark Red", hex: "#b91c1c" }
];

export default function SignatureCreatorModal({ isOpen, onClose, onSaveSignature }) {
  const [activeTab, setActiveTab] = useState("draw"); // 'draw' | 'type' | 'upload'
  const [selectedColor, setSelectedColor] = useState(SIGNATURE_COLORS[0].hex);

  // --- DRAW STATE ---
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeHistory, setStrokeHistory] = useState([]);
  const [currentStroke, setCurrentStroke] = useState([]);
  const [lineWidth, setLineWidth] = useState(3.5);
  const [hasDrawnContent, setHasDrawnContent] = useState(false);

  // --- TYPE STATE ---
  const [typedName, setTypedName] = useState("");
  const [selectedFont, setSelectedFont] = useState(SIGNATURE_FONTS[0]);

  // --- UPLOAD STATE ---
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  // Redraw canvas on strokeHistory update
  useEffect(() => {
    if (activeTab !== "draw" || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokeHistory.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      ctx.lineTo(stroke.points[stroke.points.length - 1].x, stroke.points[stroke.points.length - 1].y);
      ctx.stroke();
    });

    setHasDrawnContent(strokeHistory.length > 0);
  }, [strokeHistory, activeTab]);

  // Handle pointer down on draw canvas
  const handlePointerDown = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentStroke([{ x, y }]);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...currentStroke, { x, y }];
    setCurrentStroke(newPoints);

    // Live stroke drawing
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = selectedColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (newPoints.length >= 2) {
      const p1 = newPoints[newPoints.length - 2];
      const p2 = newPoints[newPoints.length - 1];
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentStroke.length > 1) {
      setStrokeHistory((prev) => [
        ...prev,
        {
          points: currentStroke,
          color: selectedColor,
          width: lineWidth
        }
      ]);
    }
    setCurrentStroke([]);
  };

  const handleUndoDraw = () => {
    setStrokeHistory((prev) => prev.slice(0, -1));
  };

  const handleClearDraw = () => {
    setStrokeHistory([]);
    setCurrentStroke([]);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    setHasDrawnContent(false);
  };

  // Upload handler
  const handleUploadFile = async (e) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const processed = await processUploadedSignatureImage(file);
      setUploadedImage(processed);
    } catch (err) {
      setUploadError(err.message || "Failed to process image file.");
    }
  };

  // Save Signature Action
  const handleSave = () => {
    let finalDataUrl = null;
    let type = activeTab;

    if (activeTab === "draw") {
      if (!hasDrawnContent || !canvasRef.current) return;
      finalDataUrl = trimCanvasWhitespace(canvasRef.current, 8);
    } else if (activeTab === "type") {
      if (!typedName.trim()) return;
      finalDataUrl = generateTypedSignatureDataUrl(typedName, selectedFont, selectedColor);
    } else if (activeTab === "upload") {
      if (!uploadedImage || !uploadedImage.dataUrl) return;
      finalDataUrl = uploadedImage.dataUrl;
    }

    if (finalDataUrl) {
      onSaveSignature({
        dataUrl: finalDataUrl,
        type,
        color: selectedColor,
        typedText: activeTab === "type" ? typedName.trim() : null
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const isSaveDisabled =
    (activeTab === "draw" && !hasDrawnContent) ||
    (activeTab === "type" && !typedName.trim()) ||
    (activeTab === "upload" && !uploadedImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PenTool size={18} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Create Signature</h3>
              <p className="text-[11px] font-semibold text-slate-500">
                Choose how you want to create your signature
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-100 bg-slate-50/70 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setActiveTab("draw")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "draw"
                ? "bg-white text-emerald-600 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <PenTool size={14} />
            <span>Draw</span>
          </button>
          <button
            onClick={() => setActiveTab("type")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "type"
                ? "bg-white text-emerald-600 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Type size={14} />
            <span>Type</span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === "upload"
                ? "bg-white text-emerald-600 shadow-xs font-extrabold"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Upload size={14} />
            <span>Upload</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Color Selector for Draw & Type */}
          {(activeTab === "draw" || activeTab === "type") && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">Ink Color:</span>
              <div className="flex items-center gap-2">
                {SIGNATURE_COLORS.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedColor(c.hex)}
                    className={`w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                      selectedColor === c.hex
                        ? "border-emerald-500 scale-110 shadow-xs"
                        : "border-transparent opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.hex && <Check size={12} className="text-white" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 1: DRAW */}
          {activeTab === "draw" && (
            <div className="space-y-3">
              <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={440}
                  height={180}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  className="w-full h-[180px] touch-none cursor-crosshair block"
                />
                {!hasDrawnContent && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-semibold">
                    <span>Draw your signature here with mouse or touch</span>
                  </div>
                )}
              </div>

              {/* Drawing Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleUndoDraw}
                    disabled={strokeHistory.length === 0}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-slate-600 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw size={13} />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={handleClearDraw}
                    disabled={!hasDrawnContent}
                    className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 disabled:opacity-40 text-rose-600 font-bold text-xs rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span>Clear</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400">Width:</span>
                  {[2.5, 3.5, 5].map((w) => (
                    <button
                      key={w}
                      onClick={() => setLineWidth(w)}
                      className={`w-6 h-6 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                        lineWidth === w
                          ? "bg-slate-800 text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {w === 2.5 ? "S" : w === 3.5 ? "M" : "L"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TYPE */}
          {activeTab === "type" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Type Your Full Name
                </label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  maxLength={50}
                  className="w-full px-3.5 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-600">Choose Calligraphy Style:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                  {SIGNATURE_FONTS.map((font) => (
                    <div
                      key={font.id}
                      onClick={() => setSelectedFont(font)}
                      className={`p-3 rounded-2xl border transition-all cursor-pointer text-center ${
                        selectedFont.id === font.id
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-slate-50/40"
                      }`}
                    >
                      <p
                        className="text-xl leading-none py-2 truncate"
                        style={{
                          fontFamily: font.fontFamily,
                          fontStyle: font.slant || "normal",
                          fontWeight: font.weight || "normal",
                          color: selectedColor
                        }}
                      >
                        {typedName.trim() || "Your Signature"}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 block mt-1">
                        {font.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: UPLOAD */}
          {activeTab === "upload" && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleUploadFile}
                className="hidden"
              />

              {!uploadedImage ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-emerald-400 rounded-2xl p-6 text-center transition-all cursor-pointer bg-slate-50/50 space-y-2"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <Upload size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-slate-800">
                      Upload Signature Image
                    </p>
                    <p className="text-[11px] font-medium text-slate-500">
                      PNG (transparent), JPG, or WebP up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3 text-center">
                  <div className="bg-white border border-slate-200/80 rounded-xl p-3 flex items-center justify-center max-h-[140px] overflow-hidden">
                    <img
                      src={uploadedImage.dataUrl}
                      alt="Uploaded Signature"
                      className="max-h-[100px] object-contain"
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      onClick={() => setUploadedImage(null)}
                      className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-white border border-slate-200 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaveDisabled}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Check size={14} />
            <span>Use Signature</span>
          </button>
        </div>
      </div>
    </div>
  );
}
