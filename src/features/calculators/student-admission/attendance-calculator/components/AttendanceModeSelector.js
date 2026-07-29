"use client";

import React from "react";
import { Icons } from "@/lib/lucide-icons";

const MODES = [
  { id: "current", label: "Current Attendance", icon: Icons.Target },
  { id: "reach", label: "Reach Target", icon: Icons.TrendingUp },
  { id: "safe", label: "Safe Absences", icon: Icons.Shield },
  { id: "project", label: "Future Projection", icon: Icons.LineChart }
];

export default function AttendanceModeSelector({ currentMode, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
      {MODES.map((mode) => {
        const isSelected = currentMode === mode.id;
        const Icon = mode.icon;
        
        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={`
              flex-1 min-w-[120px] px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all
              ${isSelected 
                ? "bg-white text-emerald-600 shadow-sm border border-slate-200/50" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent"}
            `}
          >
            <Icon size={16} />
            <span className="whitespace-nowrap">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
