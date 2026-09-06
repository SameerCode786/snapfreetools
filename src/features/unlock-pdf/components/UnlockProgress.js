import React from "react";
import { Loader2, Unlock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function UnlockProgress({ progressInfo }) {
  const { step = "Unlocking PDF...", percent = 0 } = progressInfo || {};

  const stepsList = [
    { label: "Verifying password", threshold: 30 },
    { label: "Removing protection", threshold: 70 },
    { label: "Generating unlocked PDF", threshold: 95 },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 text-center space-y-8 max-w-xl mx-auto shadow-xs">
      <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        <Loader2 className="animate-spin text-amber-500" size={48} />
        <Unlock className="absolute text-slate-400" size={22} />
      </div>

      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 text-lg sm:text-xl">
          {step}
        </h3>
        <p className="text-slate-400 text-xs font-semibold">
          Decrypting PDF locally inside your browser...
        </p>
      </div>

      {/* Checklist Status */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-left max-w-md mx-auto">
        {stepsList.map((s, idx) => {
          const isDone = percent >= s.threshold;
          const isCurrent = percent < s.threshold && (idx === 0 || percent >= stepsList[idx - 1].threshold);
          return (
            <div key={idx} className="flex items-center gap-3 text-xs font-semibold">
              {isDone ? (
                <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 size={13} />
                </div>
              ) : isCurrent ? (
                <div className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 text-amber-600 flex items-center justify-center shrink-0 animate-pulse">
                  <Loader2 size={12} className="animate-spin" />
                </div>
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-slate-200 shrink-0" />
              )}
              <span className={isDone ? "text-slate-900 font-bold" : isCurrent ? "text-amber-800 font-bold" : "text-slate-400"}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Unlocking Document</span>
          <span>{percent}%</span>
        </div>
      </div>
    </div>
  );
}
