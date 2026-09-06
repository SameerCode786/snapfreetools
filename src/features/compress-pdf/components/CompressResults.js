import { Download, RefreshCw, CheckCircle2, Info, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function CompressResults({ result, onReset }) {
  if (!result) return null;

  const {
    formattedOriginalSize,
    formattedCompressedSize,
    percentageSaved,
    formattedBytesSaved,
    isReduced,
    url,
    filename,
    levelName,
    imagesOptimizedCount
  } = result;

  const handleDownload = () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 text-center space-y-8 max-w-3xl mx-auto shadow-xs">
      
      {/* Result Status Icon Header */}
      {isReduced ? (
        <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-500/20">
          <CheckCircle2 size={36} />
        </div>
      ) : (
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-amber-100">
          <Info size={36} />
        </div>
      )}

      {/* Heading & Subtitle */}
      <div className="space-y-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">
          {isReduced ? "PDF Compressed Successfully!" : "PDF Is Already Highly Optimized"}
        </h3>
        <p className="text-slate-500 text-xs sm:text-sm font-semibold max-w-md mx-auto leading-relaxed">
          {isReduced
            ? `Optimized using ${levelName || "Balanced"} mode locally inside your browser tab.`
            : "This PDF contains mostly compressed or vector content. Further compression could not reduce file size without degrading text quality."}
        </p>
      </div>

      {/* Comparison Statistics Pill Box */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Original Size</span>
          <div className="text-lg font-black text-slate-700">{formattedOriginalSize}</div>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Compressed Size</span>
          <div className="text-lg font-black text-slate-900">{formattedCompressedSize}</div>
        </div>

        <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-3">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status / Savings</span>
          <div>
            {isReduced ? (
              <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-200">
                {percentageSaved}% Smaller ({formattedBytesSaved} saved)
              </span>
            ) : (
              <span className="inline-block bg-amber-100 text-amber-800 font-extrabold text-xs px-2.5 py-1 rounded-full border border-amber-200">
                Already Optimized
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Before/After Reduction Progress Bar */}
      {isReduced && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 max-w-xl mx-auto space-y-2 text-left shadow-2xs">
          <div className="flex justify-between text-xs font-extrabold text-slate-700">
            <span>Size Reduction Visualizer</span>
            <span className="text-emerald-600 font-black">{percentageSaved}% Saved</span>
          </div>
          
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              style={{ width: `${Math.max(5, 100 - percentageSaved)}%` }} 
              className="bg-emerald-500 h-full transition-all duration-500 rounded-l-full"
              title={`Compressed File: ${formattedCompressedSize}`}
            />
            <div 
              style={{ width: `${percentageSaved}%` }} 
              className="bg-slate-200 h-full transition-all duration-500 rounded-r-full"
              title={`Savings: ${formattedBytesSaved}`}
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-slate-400 pt-1">
            <span>New Size: {formattedCompressedSize}</span>
            <span>Original Size: {formattedOriginalSize}</span>
          </div>
        </div>
      )}

      {/* Optimization Summary Checklist */}
      <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-5 max-w-xl mx-auto space-y-2.5 text-left text-xs font-semibold text-slate-700">
        <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider text-center border-b border-slate-200 pb-2">
          Optimization Summary
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            <span>Object streams Flate-compressed</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            <span>{imagesOptimizedCount > 0 ? `${imagesOptimizedCount} image(s) recompressed` : "Raster images optimized"}</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            <span>Unnecessary metadata stripped</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <CheckCircle2 size={14} className="shrink-0 text-emerald-600" />
            <span>Text & vector layers 100% intact</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2 max-w-md mx-auto">
        <button
          onClick={handleDownload}
          className="bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-black py-4 px-8 rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer flex-1"
        >
          <Download size={18} />
          <span>{isReduced ? "Download Compressed PDF" : "Download Original PDF"}</span>
        </button>

        <button
          onClick={onReset}
          className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 text-sm cursor-pointer shadow-2xs"
        >
          <RefreshCw size={16} />
          <span>Compress Another</span>
        </button>
      </div>

    </div>
  );
}
