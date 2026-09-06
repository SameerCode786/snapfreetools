import { Zap, ShieldCheck, Flame, Check, Sparkles, Lightbulb } from "lucide-react";

export default function CompressionSettings({
  selectedLevel,
  onSelectLevel,
  onCompress,
  smartRecommendation = null,
  disabled = false
}) {
  const levels = [
    {
      id: "balanced",
      title: "Balanced",
      badge: "Recommended",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-100",
      icon: Zap,
      desc: "Optimizes object streams and applies gentle image compression. Best for everyday documents, preserving 100% crisp text and vector quality.",
      qualityLabel: "Original Visual Quality",
      reductionLabel: "Moderate Size Savings"
    },
    {
      id: "strong",
      title: "Strong",
      badge: "Smaller Size",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-100",
      icon: ShieldCheck,
      desc: "Downsamples high-resolution raster images to ~150 DPI and recompresses streams. Excellent for image-rich PDFs and scanned reports.",
      qualityLabel: "Good Visual Quality",
      reductionLabel: "High Size Savings"
    },
    {
      id: "maximum",
      title: "Maximum",
      badge: "Max Savings",
      badgeClass: "bg-purple-50 text-purple-700 border-purple-100",
      icon: Flame,
      desc: "Aggressive image recompression (~100 DPI) and maximum stream compaction. Ideal when small file size is the top priority for email attachments.",
      qualityLabel: "Standard Visual Quality",
      reductionLabel: "Maximum Size Savings"
    }
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs max-w-3xl mx-auto">
      
      {/* Smart Recommendation Banner */}
      {smartRecommendation && (
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
          <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 font-bold mt-0.5">
            <Lightbulb size={16} />
          </div>
          <div className="space-y-0.5">
            <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
              <span>Smart Recommendation:</span>
              <span className="capitalize text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md text-[11px]">
                {smartRecommendation.recommendedLevel} Mode
              </span>
            </div>
            <p className="text-amber-800/90 font-medium leading-relaxed">
              {smartRecommendation.reason}
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-black text-slate-900 text-lg">Select Compression Level</h3>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">
          Choose the optimization strategy that best suits your document needs.
        </p>
      </div>

      {/* Preset Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {levels.map((lvl) => {
          const isSelected = selectedLevel === lvl.id;
          const isRecommended = smartRecommendation && smartRecommendation.recommendedLevel === lvl.id;
          const Icon = lvl.icon;

          return (
            <div
              key={lvl.id}
              onClick={() => !disabled && onSelectLevel(lvl.id)}
              className={`border-2 rounded-2xl p-5 cursor-pointer transition-all duration-200 space-y-3 flex flex-col justify-between relative ${
                isSelected
                  ? "border-amber-500 bg-amber-50/20 ring-2 ring-amber-500/10 shadow-sm"
                  : "border-slate-200 hover:border-slate-300 bg-white"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${lvl.badgeClass}`}>
                    {isRecommended ? "⭐ Smart Pick" : lvl.badge}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Icon size={18} className={isSelected ? "text-amber-500" : "text-slate-400"} />
                  <h4 className="font-extrabold text-slate-900 text-base">{lvl.title}</h4>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  {lvl.desc}
                </p>

                <div className="border-t border-slate-100 pt-2.5 space-y-1 text-[10px] font-bold text-slate-400">
                  <div className="flex justify-between">
                    <span>Quality:</span>
                    <span className="text-slate-700">{lvl.qualityLabel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Reduction:</span>
                    <span className="text-amber-600">{lvl.reductionLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Button */}
      <div className="pt-2">
        <button
          onClick={onCompress}
          disabled={disabled}
          className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black py-4 px-8 rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50"
        >
          <Zap size={20} />
          <span>Compress PDF Now</span>
        </button>
      </div>

      {/* Privacy Notice */}
      <p className="text-[11px] text-slate-400 font-semibold text-center leading-relaxed">
        🔒 100% Local In-Browser Optimization — Your document files never leave your device.
      </p>
    </div>
  );
}
