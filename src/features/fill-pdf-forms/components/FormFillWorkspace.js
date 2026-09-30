"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FileText, CheckSquare, RefreshCw, Lock, AlertCircle, ArrowRight, Layers, FileCheck } from "lucide-react";

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function FormFillWorkspace({
  fileInfo,
  formValues,
  onValueChange,
  onResetValues,
  onGenerateFilledPdf,
  onChangeFile,
  isProcessing,
}) {
  if (!fileInfo) return null;

  const hasFields = fileInfo.hasFormFields && fileInfo.fields.length > 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-8 space-y-8 max-w-4xl mx-auto shadow-xs">
      
      {/* Header Info */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm break-all">{fileInfo.name}</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              {formatBytes(fileInfo.byteSize)} • {fileInfo.pageCount} {fileInfo.pageCount === 1 ? "page" : "pages"} • {fileInfo.fieldCount} form {fileInfo.fieldCount === 1 ? "field" : "fields"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeFile}
          disabled={isProcessing}
          className="text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors shrink-0 disabled:opacity-50"
        >
          Change File
        </button>
      </div>

      {/* Non-Interactive / Scanned PDF Banner */}
      {!hasFields ? (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 space-y-4 text-amber-900">
          <div className="flex items-start gap-3">
            <AlertCircle size={22} className="text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm">No Interactive Form Fields Detected</h4>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                This document is a standard flat PDF or scanned image document with no embedded AcroForm interactive data fields. Programmatic form field editing is only supported for fillable PDF documents.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-200/50 flex flex-wrap gap-3">
            <Link
              href="/flatten-pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-extrabold text-xs hover:bg-amber-100 transition-colors shadow-2xs"
            >
              Try Flatten PDF
              <ArrowRight size={14} />
            </Link>

            <Link
              href="/sign-pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs hover:bg-amber-700 transition-colors shadow-2xs"
            >
              Sign & Manual Text Overlay
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        /* Interactive Form Inputs Container */
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare size={18} className="text-amber-500 shrink-0" />
              <h4 className="font-extrabold text-xs text-slate-900">
                Fill Form Fields ({fileInfo.fieldCount})
              </h4>
            </div>

            <button
              type="button"
              onClick={onResetValues}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Reset All Fields
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {fileInfo.fields.map((field, idx) => {
              const currentValue = Object.prototype.hasOwnProperty.call(formValues, field.name)
                ? formValues[field.name]
                : field.value;

              return (
                <div
                  key={idx}
                  className={`bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-2 transition-all ${
                    field.isMultiline ? "md:col-span-2" : ""
                  }`}
                >
                  <label className="text-xs font-extrabold text-slate-800 block break-all">
                    {field.name}
                    {field.isReadOnly && (
                      <span className="ml-2 text-[10px] text-slate-400 font-bold uppercase">(Read Only)</span>
                    )}
                  </label>

                  {/* Render based on field type */}
                  {field.type === "text" && (
                    field.isMultiline ? (
                      <textarea
                        value={currentValue || ""}
                        onChange={(e) => onValueChange(field.name, e.target.value)}
                        disabled={field.isReadOnly || isProcessing}
                        rows={3}
                        placeholder="Type response..."
                        className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
                      />
                    ) : (
                      <input
                        type="text"
                        value={currentValue || ""}
                        onChange={(e) => onValueChange(field.name, e.target.value)}
                        disabled={field.isReadOnly || isProcessing}
                        placeholder="Type response..."
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
                      />
                    )
                  )}

                  {field.type === "checkbox" && (
                    <label className="flex items-center gap-2.5 cursor-pointer pt-1 select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(currentValue)}
                        onChange={(e) => onValueChange(field.name, e.target.checked)}
                        disabled={field.isReadOnly || isProcessing}
                        className="w-4 h-4 rounded border-slate-300 text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-xs font-bold text-slate-700">Checked / Enabled</span>
                    </label>
                  )}

                  {(field.type === "dropdown" || field.type === "optionlist") && (
                    <select
                      value={currentValue || ""}
                      onChange={(e) => onValueChange(field.name, e.target.value)}
                      disabled={field.isReadOnly || isProcessing}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-400 transition-colors disabled:opacity-50"
                    >
                      <option value="">-- Select Option --</option>
                      {field.options && field.options.map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {field.type === "radiogroup" && (
                    <div className="space-y-1.5 pt-1">
                      {field.options && field.options.map((opt, rIdx) => (
                        <label key={rIdx} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                          <input
                            type="radio"
                            name={field.name}
                            value={opt}
                            checked={currentValue === opt}
                            onChange={(e) => onValueChange(field.name, e.target.value)}
                            disabled={field.isReadOnly || isProcessing}
                            className="text-amber-500 focus:ring-amber-400"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {field.type === "other" && (
                    <input
                      type="text"
                      value={currentValue || ""}
                      onChange={(e) => onValueChange(field.name, e.target.value)}
                      disabled={field.isReadOnly || isProcessing}
                      placeholder="Type response..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 focus:outline-none focus:border-amber-400"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Footer */}
      {hasFields && (
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onGenerateFilledPdf}
            disabled={isProcessing}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                Generating Filled PDF...
              </>
            ) : (
              <>
                <CheckSquare size={16} />
                Generate Filled PDF Document
              </>
            )}
          </button>
        </div>
      )}

    </div>
  );
}
