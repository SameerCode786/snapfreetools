"use client";

import React from "react";
import {
  Trash2,
  Copy,
  RotateCw,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PenTool,
  Type,
  Calendar,
  Award,
  Sliders,
  X,
  UserCheck,
  CheckSquare,
  Square
} from "lucide-react";

export const FONT_SIZES = [10, 12, 14, 16, 18, 22, 26];

export const TEXT_COLORS = [
  { id: "black", name: "Black", hex: "#0f172a" },
  { id: "blue", name: "Blue", hex: "#1d4ed8" },
  { id: "emerald", name: "Emerald", hex: "#047857" },
  { id: "red", name: "Red", hex: "#dc2626" }
];

export const DATE_FORMATS = [
  { id: "YYYY-MM-DD", label: "2026-09-19 (YYYY-MM-DD)" },
  { id: "DD/MM/YYYY", label: "19/09/2026 (DD/MM/YYYY)" },
  { id: "MM/DD/YYYY", label: "09/19/2026 (MM/DD/YYYY)" },
  { id: "MMMM D, YYYY", label: "September 19, 2026" }
];

export const FONT_FAMILIES = [
  { id: "Helvetica", name: "Sans-Serif (Helvetica)" },
  { id: "Times", name: "Serif (Times Roman)" },
  { id: "Courier", name: "Monospace (Courier)" }
];

export default function FieldPropertiesPanel({
  field,
  onUpdateField,
  onDeleteField,
  onDuplicateField,
  onOpenSignatureModal,
  onOpenInitialsModal,
  onOpenStampModal,
  onDeselect,
  totalPages = 1,
  onMoveToPage,
  mode = "only-me",
  recipients = []
}) {
  if (!field) return null;

  const handleStyleChange = (styleKey, val) => {
    onUpdateField({
      ...field,
      style: {
        ...(field.style || {}),
        [styleKey]: val
      }
    });
  };

  const handleValueChange = (val) => {
    onUpdateField({
      ...field,
      value: val
    });
  };

  const handleRecipientChange = (newRecipientId) => {
    onUpdateField({
      ...field,
      recipientId: newRecipientId
    });
  };

  const handleRequiredToggle = () => {
    onUpdateField({
      ...field,
      required: field.required === false ? true : false
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Field Properties ({field.type.toUpperCase()})
          </h4>
        </div>
        <button
          onClick={onDeselect}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Close properties"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Several People Mode: Recipient Assignment & Required Flag */}
      {mode === "several-people" && recipients.length > 0 && (
        <div className="space-y-2.5 p-2.5 bg-blue-50/50 rounded-xl border border-blue-100">
          <div>
            <label className="block text-[11px] font-bold text-blue-900 mb-1 flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assigned Recipient</span>
            </label>
            <select
              value={field.recipientId || ""}
              onChange={(e) => handleRecipientChange(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-blue-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {recipients.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.order}. {rec.name || "Unnamed"} ({rec.role})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] font-semibold text-slate-700">Required Field</span>
            <button
              type="button"
              onClick={handleRequiredToggle}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-all ${
                field.required !== false
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {field.required !== false ? "Required *" : "Optional"}
            </button>
          </div>
        </div>
      )}

      {/* Specific Properties for Signature */}
      {field.type === "signature" && (
        <div className="space-y-3">
          <button
            onClick={onOpenSignatureModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
          >
            <PenTool className="w-3.5 h-3.5" />
            Change / Redraw Signature
          </button>
        </div>
      )}

      {/* Specific Properties for Initials */}
      {field.type === "initials" && (
        <div className="space-y-3">
          <button
            onClick={onOpenInitialsModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
          >
            <Type className="w-3.5 h-3.5" />
            Edit Initials Text & Style
          </button>
        </div>
      )}

      {/* Specific Properties for Company Stamp */}
      {field.type === "stamp" && (
        <div className="space-y-3">
          <button
            onClick={onOpenStampModal}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            Replace Stamp Image
          </button>
        </div>
      )}

      {/* Specific Properties for Name Field */}
      {field.type === "name" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Signer Name
            </label>
            <input
              type="text"
              value={field.value || ""}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Specific Properties for Text Field */}
      {field.type === "text" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Text Content
            </label>
            <textarea
              rows={3}
              value={field.value || ""}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="Enter text to place on PDF..."
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {/* Specific Properties for Date Field */}
      {field.type === "date" && (
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Date Value
            </label>
            <input
              type="date"
              value={field.value ? field.value.split("T")[0] : new Date().toISOString().split("T")[0]}
              onChange={(e) => handleValueChange(e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Display Format
            </label>
            <select
              value={field.style?.dateFormat || "YYYY-MM-DD"}
              onChange={(e) => handleStyleChange("dateFormat", e.target.value)}
              className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {DATE_FORMATS.map((fmt) => (
                <option key={fmt.id} value={fmt.id}>
                  {fmt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Common Typography Controls for Name, Text, Date */}
      {(field.type === "name" || field.type === "text" || field.type === "date") && (
        <div className="space-y-3 pt-2 border-t border-slate-100">
          {field.type !== "date" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Font Family
              </label>
              <select
                value={field.style?.fontFamily || "Helvetica"}
                onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {FONT_FAMILIES.map((fam) => (
                  <option key={fam.id} value={fam.id}>
                    {fam.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Font Size
              </label>
              <select
                value={field.style?.fontSize || 14}
                onChange={(e) => handleStyleChange("fontSize", parseInt(e.target.value, 10))}
                className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {FONT_SIZES.map((sz) => (
                  <option key={sz} value={sz}>
                    {sz} pt
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Alignment
              </label>
              <div className="flex items-center gap-1 bg-slate-50 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleStyleChange("align", "left")}
                  className={`flex-1 p-1 rounded flex items-center justify-center transition-colors ${
                    (field.style?.align || "left") === "left" ? "bg-white shadow-xs text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStyleChange("align", "center")}
                  className={`flex-1 p-1 rounded flex items-center justify-center transition-colors ${
                    field.style?.align === "center" ? "bg-white shadow-xs text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStyleChange("align", "right")}
                  className={`flex-1 p-1 rounded flex items-center justify-center transition-colors ${
                    field.style?.align === "right" ? "bg-white shadow-xs text-emerald-600 font-bold" : "text-slate-500 hover:text-slate-700"
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Text Color
            </label>
            <div className="flex items-center gap-2">
              {TEXT_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleStyleChange("color", c.hex)}
                  className={`w-6 h-6 rounded-full border transition-all flex items-center justify-center ${
                    (field.style?.color || "#0f172a") === c.hex
                      ? "ring-2 ring-emerald-500 ring-offset-1 scale-110 shadow-xs"
                      : "border-slate-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Page Selector (Multi-page moving) */}
      {totalPages > 1 && onMoveToPage && (
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Current Page Placement
          </label>
          <select
            value={field.pageNumber || 1}
            onChange={(e) => onMoveToPage(parseInt(e.target.value, 10))}
            className="w-full px-3 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                Page {p} of {totalPages}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quick Action Footer: Duplicate & Delete */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <button
          onClick={onDuplicateField}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
          Duplicate
        </button>
        <button
          onClick={onDeleteField}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}
