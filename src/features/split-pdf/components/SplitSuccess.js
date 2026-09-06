import React from "react";
import { Download, Archive, RefreshCw, FileText, CheckCircle2 } from "lucide-react";
import { formatFileSize } from "../utils/pdfSplitterEngine";

export default function SplitSuccess({
  resultData,
  onReset
}) {
  const {
    outputFiles,
    zipBlob,
    zipUrl,
    zipName,
    totalOutputFiles,
    totalOriginalPages
  } = resultData;

  const handleDownloadFile = (fileItem) => {
    const a = document.createElement("a");
    a.href = fileItem.url;
    a.download = fileItem.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadZip = () => {
    if (!zipUrl) return;
    const a = document.createElement("a");
    a.href = zipUrl;
    a.download = zipName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Success Banner */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 size={32} />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            PDF Split Successfully!
          </h2>
          <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
            Created {totalOutputFiles} PDF {totalOutputFiles === 1 ? "file" : "files"} from {totalOriginalPages} original document {totalOriginalPages === 1 ? "page" : "pages"}.
          </p>
        </div>

        {/* Primary ZIP Download Button (if multiple files) */}
        {outputFiles.length > 1 && zipUrl && (
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDownloadZip}
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2.5 mx-auto text-sm hover:scale-105 active:scale-95"
            >
              <Archive size={20} />
              Download All as ZIP ({formatFileSize(zipBlob.size)})
            </button>
          </div>
        )}
      </div>

      {/* Output Files Cards List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
          Generated PDF Documents ({outputFiles.length})
        </h3>

        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
          {outputFiles.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={20} />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-semibold">
                    {item.pageCount} {item.pageCount === 1 ? "Page" : "Pages"} • {formatFileSize(item.size)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadFile(item)}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Download size={14} /> Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Start Over Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
        >
          <RefreshCw size={14} /> Split Another PDF
        </button>
      </div>
    </div>
  );
}
