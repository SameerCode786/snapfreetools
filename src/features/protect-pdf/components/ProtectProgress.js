import React from "react";
import { Lock, Shield, Loader2 } from "lucide-react";

export default function ProtectProgress({ progressInfo }) {
  const { step = "Protecting PDF document...", percent = 0 } = progressInfo || {};

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-xs">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-amber-100 border-t-amber-500 animate-spin" />
        <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold shadow-xs">
          <Lock size={24} />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Protecting PDF Document
        </h3>
        <p className="text-xs font-semibold text-slate-500 max-w-sm mx-auto">
          {step}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 max-w-md mx-auto">
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/60">
          <div
            className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-300 shadow-xs"
            style={{ width: `${Math.min(100, Math.max(5, percent))}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
          <span>Local Browser Engine</span>
          <span>{percent}%</span>
        </div>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-100 rounded-2xl p-3 flex items-center justify-center gap-2 text-xs text-emerald-800 font-semibold max-w-md mx-auto">
        <Shield size={14} className="text-emerald-600 shrink-0" />
        <span>Files stay 100% inside your browser memory during encryption.</span>
      </div>
    </div>
  );
}
