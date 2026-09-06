import React, { useState } from "react";
import { Download, RefreshCw, CheckCircle2 } from "lucide-react";

export default function MergeResults({
  mergedBlob,
  filename,
  totalFiles,
  totalPages,
  onReset,
  onStartOver
}) {
  const [copied, setCopied] = useState(false);

  // Format file size
  const formatSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + " KB";
    return (kb / 1024).toFixed(1) + " MB";
  };

  // Safe filename helper
  const getCleanFilename = () => {
    let clean = filename.trim();
    if (!clean.toLowerCase().endsWith(".pdf")) {
      clean += ".pdf";
    }
    return clean;
  };

  // Download trigger
  const handleDownload = () => {
    if (!mergedBlob) return;
    const cleanName = getCleanFilename();
    const url = URL.createObjectURL(mergedBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cleanName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Revoke URL memory after 5s
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // Share handlers
  const shareText = `Successfully merged ${totalFiles} PDF files containing ${totalPages} pages using SnapFreeTools Merge PDF.`;
  const shareUrl = "https://www.snapfreetools.com/merge-pdf";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Merge PDF Online - SnapFreeTools",
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Native share failed:", err);
        }
      }
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, "_blank");
  };

  const handleMailShare = () => {
    const mailUrl = `mailto:?subject=${encodeURIComponent("Merged PDF Documents via SnapFreeTools")}&body=${encodeURIComponent(`${shareText}\n\nCheck out the tool: ${shareUrl}`)}`;
    window.open(mailUrl, "_self");
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-fade">
      
      {/* Main Success Dashboard Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs text-center space-y-6">
        
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-2xs">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-1.5">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">
            PDF Files Merged Successfully!
          </h3>
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Your combined document is ready. Native vector pages and layout shapes were preserved.
          </p>
        </div>

        {/* File Metadata Details Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-center">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Output Name</span>
            <span className="text-xs font-extrabold text-slate-800 truncate block max-w-[120px] mx-auto" title={getCleanFilename()}>
              {getCleanFilename()}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Files Merged</span>
            <span className="text-xs font-extrabold text-slate-800">{totalFiles}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Pages</span>
            <span className="text-xs font-extrabold text-slate-800">{totalPages}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Output Size</span>
            <span className="text-xs font-extrabold text-slate-800">{formatSize(mergedBlob ? mergedBlob.size : 0)}</span>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="w-full sm:w-auto py-3.5 px-8 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download Merged PDF
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            <RefreshCw size={14} /> Edit Workspace
          </button>

          <button
            type="button"
            onClick={onStartOver}
            className="w-full sm:w-auto py-3.5 px-6 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
          >
            Start Over
          </button>
        </div>

      </div>

    </div>
  );
}
