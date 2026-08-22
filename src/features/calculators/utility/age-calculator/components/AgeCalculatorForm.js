"use client";

import { Calendar, RotateCcw } from "lucide-react";

export default function AgeCalculatorForm({ dob, targetDate, setDob, setTargetDate }) {
  const handleReset = () => {
    setDob("");
    setTargetDate(new Date().toISOString().split("T")[0]);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Calendar size={20} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Age Details</h2>
      </div>

      <div className="space-y-5">
        <div className="space-y-2 relative">
          <label htmlFor="dob" className="block text-sm font-bold text-slate-700">
            Date of Birth
          </label>
          <div className="relative">
            <input
              type="date"
              id="dob"
              value={dob}
              max={targetDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setDob(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3.5 text-base font-medium text-slate-800 transition-all focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-2 relative">
          <label htmlFor="targetDate" className="block text-sm font-bold text-slate-700">
            Calculate age at
          </label>
          <div className="relative">
            <input
              type="date"
              id="targetDate"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 rounded-2xl px-4 py-3.5 text-base font-medium text-slate-800 transition-all focus:outline-none"
            />
          </div>
          <p className="text-xs text-slate-500 font-medium ml-1">
            Defaults to today's date
          </p>
        </div>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors focus:outline-none focus:ring-4 focus:ring-slate-200/50"
          >
            <RotateCcw size={18} />
            <span>Clear Inputs</span>
          </button>
        </div>
      </div>
    </div>
  );
}
