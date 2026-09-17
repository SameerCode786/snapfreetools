"use client";

import React, { useState } from "react";
import { FileSpreadsheet, RefreshCw, Layers, CheckSquare, Square, Table as TableIcon, AlertTriangle, Download, Info, Sparkles } from "lucide-react";

export default function TablePreview({
  analysis,
  tables,
  setTables,
  onResetFile,
  onGenerateExcel,
  ocrEnabled,
  onEnableOcrAndReprocess
}) {
  const [selectedTableId, setSelectedTableId] = useState(tables[0]?.id || null);

  const activeTable = tables.find((t) => t.id === selectedTableId) || tables[0];

  const handleToggleSelectAll = (select) => {
    setTables((prev) => prev.map((t) => ({ ...t, selected: select })));
  };

  const handleToggleTableSelect = (id) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, selected: !t.selected } : t))
    );
  };

  const handleTitleChange = (id, newTitle) => {
    setTables((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title: newTitle } : t))
    );
  };

  const selectedCount = tables.filter((t) => t.selected).length;

  return (
    <div className="space-y-8">
      {/* Document Analysis Banner */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                PDF Structure Analysis
              </h2>
              <p className="text-xs font-semibold text-slate-500">
                Total Pages: {analysis.totalPages} | Tables Detected: {tables.length}
                {analysis.ocrPagesCount > 0 && ` | OCR Pages: ${analysis.ocrPagesCount} (Avg Confidence: ${analysis.avgOcrConfidence}%)`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleSelectAll(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <CheckSquare size={14} />
              <span>Select All</span>
            </button>
            <button
              onClick={() => handleToggleSelectAll(false)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Square size={14} />
              <span>Deselect All</span>
            </button>
            <button
              onClick={onResetFile}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw size={14} />
              <span>Change PDF</span>
            </button>
          </div>
        </div>

        {/* Low Confidence Warning Banner */}
        {analysis.isLowConfidence && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 text-xs font-semibold">
            <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-extrabold text-sm">OCR Confidence Warning ({analysis.avgOcrConfidence}%)</p>
              <p className="mt-0.5 leading-relaxed text-amber-800">
                OCR confidence is below 70%. Please review the Excel results carefully before using them.
              </p>
            </div>
          </div>
        )}

        {/* Scanned PDF Warning Banner (When OCR is disabled) */}
        {!ocrEnabled && analysis.isScannedPdf && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 text-xs font-semibold">
            <div className="flex items-start gap-3">
              <AlertTriangle size={18} className="shrink-0 text-amber-600 mt-0.5" />
              <div>
                <p className="font-extrabold text-sm">Scanned or Image-Only PDF Detected</p>
                <p className="mt-0.5 leading-relaxed text-amber-800">
                  Some or all pages in this document appear to be scanned images. Reliable table extraction from image PDFs requires OCR pre-processing.
                </p>
              </div>
            </div>
            {onEnableOcrAndReprocess && (
              <button
                onClick={onEnableOcrAndReprocess}
                className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} />
                <span>Use Free OCR</span>
              </button>
            )}
          </div>
        )}

        {/* No Tables Found State */}
        {tables.length === 0 && (
          <div className="p-8 text-center space-y-4 max-w-md mx-auto">
            <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-2xl flex items-center justify-center mx-auto">
              <TableIcon size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">No Reliable Tables Detected</h3>
              <p className="text-xs text-slate-500 font-medium">
                We couldn't detect clear multi-column table structures in this PDF. The tool works best with text-based reports, bank statements, and structured tables.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              {!ocrEnabled && onEnableOcrAndReprocess && (
                <button
                  onClick={onEnableOcrAndReprocess}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles size={14} />
                  <span>Scan with Free OCR</span>
                </button>
              )}
              <button
                onClick={onResetFile}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Try Another PDF File
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace (Split Grid) */}
      {tables.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar: Table Selection List & Worksheet Renaming */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-xs space-y-4">
              <h3 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Layers size={16} className="text-emerald-600" />
                Detected Tables & Sheets ({selectedCount}/{tables.length})
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {tables.map((table) => {
                  const isActive = activeTable?.id === table.id;
                  return (
                    <div
                      key={table.id}
                      onClick={() => setSelectedTableId(table.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                        isActive
                          ? "border-emerald-500 bg-emerald-50/40 shadow-xs"
                          : "border-slate-200/80 hover:border-slate-300 bg-slate-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <label
                          className="flex items-center gap-2 text-xs font-extrabold text-slate-900 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={table.selected}
                            onChange={() => handleToggleTableSelect(table.id)}
                            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                          />
                          <span>Page {table.pageNum}</span>
                          {table.isOcr && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              OCR {table.avgConfidence ? `(${table.avgConfidence}%)` : ""}
                            </span>
                          )}
                        </label>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600">
                          {table.rowCount} rows × {table.columnsCount} cols
                        </span>
                      </div>

                      <div onClick={(e) => e.stopPropagation()}>
                        <label className="block text-[10px] font-bold text-slate-400 mb-1">
                          Excel Worksheet Name
                        </label>
                        <input
                          type="text"
                          maxLength={31}
                          value={table.title}
                          onChange={(e) => handleTitleChange(table.id, e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-bold text-slate-800 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Table Preview Panel */}
          <div className="lg:col-span-8 space-y-4">
            {activeTable && (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                      <span>{activeTable.title} Preview</span>
                      {activeTable.isOcr && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          Extracted with Free OCR
                        </span>
                      )}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      Found on Page {activeTable.pageNum} ({activeTable.rowCount} rows, {activeTable.columnsCount} columns)
                    </p>
                  </div>
                </div>

                {/* Bounded Scrollable Table Grid */}
                <div className="border border-slate-200/80 rounded-2xl overflow-x-auto max-h-[420px] overflow-y-auto">
                  <table className="w-full text-left text-xs font-semibold border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold sticky top-0 z-10">
                        <th className="p-3 border-r border-slate-200 w-12 text-center text-slate-400">#</th>
                        {Array.from({ length: activeTable.columnsCount }).map((_, cIdx) => (
                          <th key={cIdx} className="p-3 border-r border-slate-200 whitespace-nowrap">
                            Col {cIdx + 1}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {activeTable.rows.slice(0, 50).map((row, rIdx) => (
                        <tr
                          key={rIdx}
                          className={rIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                        >
                          <td className="p-2.5 border-r border-slate-100 text-center text-slate-400 font-mono text-[11px]">
                            {rIdx + 1}
                          </td>
                          {row.map((cellText, cIdx) => (
                            <td
                              key={cIdx}
                              className="p-2.5 border-r border-slate-100 text-slate-800 whitespace-nowrap max-w-[200px] truncate"
                              title={cellText}
                            >
                              {cellText || <span className="text-slate-300 italic">empty</span>}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {activeTable.rows.length > 50 && (
                  <p className="text-[11px] font-bold text-slate-400 text-right">
                    Showing first 50 rows of {activeTable.rowCount} in preview. All rows will be included in Excel download.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      {tables.length > 0 && (
        <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-extrabold text-slate-600">
            <Info size={16} className="text-emerald-600 shrink-0" />
            <span>
              {selectedCount} of {tables.length} {tables.length === 1 ? "table" : "tables"} selected for Excel workbook generation.
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onResetFile}
              className="px-5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-extrabold text-xs rounded-2xl transition-all cursor-pointer w-1/2 sm:w-auto text-center"
            >
              Reset
            </button>
            <button
              onClick={onGenerateExcel}
              disabled={selectedCount === 0}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm rounded-2xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer w-1/2 sm:w-auto"
            >
              <Download size={18} />
              <span>Generate Excel Workbook</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
