import React from "react";
import { Icons } from "@/lib/lucide-icons";

export default function ModeSwitcher({ mode, setMode }) {
  const modes = [
    { id: "growth", label: "Investment Growth", icon: "TrendingUp" },
    { id: "compound", label: "Compound Interest", icon: "LineChart" },
    { id: "sip", label: "Monthly / SIP", icon: "Calendar" },
    { id: "goal", label: "Target Goal", icon: "Target" },
    { id: "inflation", label: "Inflation", icon: "TrendingDown" },
    { id: "comparison", label: "Comparison", icon: "ArrowRightLeft" }
  ];

  return (
    <div className="bg-slate-50 p-1.5 rounded-xl flex flex-wrap md:flex-nowrap overflow-x-auto border border-slate-100 hide-scrollbar mb-8">
      {modes.map((m) => {
        const Icon = Icons[m.icon];
        const isActive = mode === m.id;
        
        return (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`
              flex-1 min-w-[140px] md:min-w-0 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all
              ${isActive 
                ? "bg-white text-indigo-600 shadow-sm border border-slate-200" 
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent"}
            `}
          >
            {Icon && <Icon size={16} />}
            {m.label}
          </button>
        );
      })}
    </div>
  );
}
