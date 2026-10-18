"use client";

import React from "react";
import { Link2, Code2, Upload, FileCode, Archive, AlertCircle, ArrowRight, X, Info } from "lucide-react";

export default function UploadState({
  mode,
  setMode,
  urlInput,
  setUrlInput,
  pasteInput,
  setPasteInput,
  uploadFile,
  setUploadFile,
  fileError,
  setFileError,
  onStartConversion,
  isDragging,
  setIsDragging,
  fileInputRef
}) {
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setFileError(null);

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const droppedFile = files[0];
      const filename = (droppedFile.name || '').toLowerCase();
      if (filename.endsWith('.zip')) {
        setMode("zip");
      } else {
        setMode("html_upload");
      }
      setUploadFile(droppedFile);
    }
  };

  const handleFileChange = (e) => {
    setFileError(null);
    const files = e.target?.files;
    if (files && files.length > 0) {
      setUploadFile(files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Mode Navigation Tabs with Accessible WAI-ARIA Roles */}
      <div 
        role="tablist"
        aria-label="HTML Input Modes"
        className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/80"
      >
        <button
          type="button"
          role="tab"
          id="tab-mode-url"
          aria-selected={mode === "url"}
          aria-controls="panel-mode-url"
          onClick={() => { setMode("url"); setFileError(null); }}
          className={`flex-1 min-w-[110px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mode === "url"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Link2 size={16} className={mode === "url" ? "text-amber-500" : "text-slate-400"} />
          Website URL
        </button>

        <button
          type="button"
          role="tab"
          id="tab-mode-paste"
          aria-selected={mode === "html_paste"}
          aria-controls="panel-mode-paste"
          onClick={() => { setMode("html_paste"); setFileError(null); }}
          className={`flex-1 min-w-[110px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mode === "html_paste"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Code2 size={16} className={mode === "html_paste" ? "text-amber-500" : "text-slate-400"} />
          Paste HTML
        </button>

        <button
          type="button"
          role="tab"
          id="tab-mode-upload"
          aria-selected={mode === "html_upload"}
          aria-controls="panel-mode-upload"
          onClick={() => {
            setMode("html_upload");
            setFileError(null);
            if (uploadFile && !/\.(html|htm)$/i.test(uploadFile.name)) {
              setUploadFile(null);
            }
          }}
          className={`flex-1 min-w-[110px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mode === "html_upload"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Upload size={16} className={mode === "html_upload" ? "text-amber-500" : "text-slate-400"} />
          Upload HTML File
        </button>

        <button
          type="button"
          role="tab"
          id="tab-mode-zip"
          aria-selected={mode === "zip"}
          aria-controls="panel-mode-zip"
          onClick={() => {
            setMode("zip");
            setFileError(null);
            if (uploadFile && !/\.zip$/i.test(uploadFile.name)) {
              setUploadFile(null);
            }
          }}
          className={`flex-1 min-w-[110px] py-2.5 px-3.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            mode === "zip"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Archive size={16} className={mode === "zip" ? "text-amber-500" : "text-slate-400"} />
          Upload ZIP
        </button>
      </div>

      {/* Mode A: Website URL Input */}
      {mode === "url" && (
        <div 
          role="tabpanel" 
          id="panel-mode-url" 
          aria-labelledby="tab-mode-url"
          className="space-y-4"
        >
          <div>
            <label htmlFor="html-url-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Webpage Address (URL)
            </label>
            <div className="relative">
              <input
                type="url"
                id="html-url-input"
                value={urlInput}
                onChange={(e) => { setUrlInput(e.target.value); setFileError(null); }}
                placeholder="https://example.com/article"
                aria-required="true"
                className="w-full px-4 py-3.5 bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:bg-white transition-all pl-11"
              />
              <Link2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
              <span>Enter any publicly accessible website address starting with http:// or https://</span>
            </p>
          </div>
        </div>
      )}

      {/* Mode B: Paste HTML Markup */}
      {mode === "html_paste" && (
        <div 
          role="tabpanel" 
          id="panel-mode-paste" 
          aria-labelledby="tab-mode-paste"
          className="space-y-4"
        >
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="html-paste-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paste HTML Code
              </label>
              <span className="text-[11px] font-semibold text-slate-400">
                {pasteInput.length} chars (Max 10MB)
              </span>
            </div>
            <textarea
              id="html-paste-input"
              rows={8}
              value={pasteInput}
              onChange={(e) => { setPasteInput(e.target.value); setFileError(null); }}
              placeholder="<!DOCTYPE html>&#10;<html>&#10;  <head><title>My Document</title></head>&#10;  <body>&#10;    <h1>Hello World</h1>&#10;    <p>Paste your HTML markup here...</p>&#10;  </body>&#10;</html>"
              aria-required="true"
              className="w-full p-4 bg-slate-900 text-amber-300 font-mono text-xs rounded-2xl border border-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 leading-relaxed transition-all resize-y"
            />
          </div>
        </div>
      )}

      {/* Mode C: Upload HTML File */}
      {mode === "html_upload" && (
        <div 
          role="tabpanel" 
          id="panel-mode-upload" 
          aria-labelledby="tab-mode-upload"
          className="space-y-4"
        >
          {!uploadFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".html,.htm"
                aria-label="Upload HTML or HTM file"
                className="hidden"
                id="html-file-upload-input"
              />
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <FileCode size={28} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
                Choose HTML File or Drag & Drop
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Supports <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">.html</code> and <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">.htm</code> files up to 10MB
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-amber-600 transition-colors">
                Browse Files
              </span>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <FileCode size={20} />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                    {uploadFile.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(uploadFile.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setUploadFile(null); setFileError(null); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                aria-label="Remove selected HTML file"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode D: Upload ZIP Package */}
      {mode === "zip" && (
        <div 
          role="tabpanel" 
          id="panel-mode-zip" 
          aria-labelledby="tab-mode-zip"
          className="space-y-4"
        >
          {!uploadFile ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-amber-500 bg-amber-50/50 scale-[1.01]"
                  : "border-slate-300 hover:border-amber-400 bg-slate-50/50 hover:bg-slate-50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".zip"
                aria-label="Upload ZIP package file"
                className="hidden"
                id="zip-file-upload-input"
              />
              <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Archive size={28} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg mb-1">
                Choose ZIP Package or Drag & Drop
              </h3>
              <p className="text-xs text-slate-500 mb-3">
                Supports <code className="bg-slate-200 px-1.5 py-0.5 rounded text-[11px]">.zip</code> packages containing HTML & assets up to 25MB
              </p>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-amber-600 transition-colors mb-4">
                Browse ZIP Package
              </span>

              <div className="mt-4 pt-4 border-t border-slate-200/60 max-w-lg mx-auto text-left space-y-2 text-[11px] text-slate-500">
                <p className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Info size={14} className="text-amber-500 shrink-0" />
                  ZIP Package Requirements:
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1">
                  <li>Must contain an <code className="bg-slate-200/80 px-1 rounded text-[10px]">index.html</code> or <code className="bg-slate-200/80 px-1 rounded text-[10px]">index.htm</code> entry file.</li>
                  <li>Can include local CSS stylesheets, images (PNG, JPG, SVG, WebP), and web fonts (WOFF2, TTF).</li>
                  <li>JavaScript inside ZIP is disabled for security; external web resources are blocked by default.</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                  <Archive size={20} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {uploadFile.name}
                    </p>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase rounded-full shrink-0">
                      ZIP Package
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {formatFileSize(uploadFile.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => { setUploadFile(null); setFileError(null); }}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                aria-label="Remove selected ZIP file"
                title="Remove file"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Validation Error Banner */}
      {fileError && (
        <div 
          role="alert" 
          aria-live="assertive"
          className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 text-red-700 text-xs font-medium"
        >
          <AlertCircle size={18} className="shrink-0 text-red-500 mt-0.5" />
          <div className="flex-1">{fileError}</div>
        </div>
      )}

      {/* Convert Trigger Button */}
      <div className="pt-2">
        <button
          type="button"
          id="btn-convert-html-to-pdf"
          onClick={onStartConversion}
          className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
        >
          <span>Convert HTML to PDF</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
