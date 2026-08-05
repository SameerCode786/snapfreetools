import { motion } from "motion/react";
import { BookOpen, Calculator, LineChart, Target } from "lucide-react";

export default function GradeModeSelector({ activeMode, onChange }) {
  const modes = [
    { id: "single", label: "Single Grade", icon: BookOpen },
    { id: "multiple", label: "Multiple Subjects", icon: Calculator },
    { id: "weighted", label: "Weighted Grade", icon: LineChart },
    { id: "required", label: "Required Marks", icon: Target }
  ];

  return (
    <div className="bg-slate-50 p-2 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-8 border border-slate-100">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => onChange(mode.id)}
            className={`
              relative w-full flex items-center justify-center gap-2.5 px-4 py-3.5 
              rounded-xl text-sm font-bold transition-all duration-300
              ${isActive ? "text-amber-700 shadow-sm" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"}
            `}
          >
            {isActive && (
              <motion.div
                layoutId="gradeModeActiveBg"
                className="absolute inset-0 bg-white rounded-xl border border-amber-100"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={18} className={`relative z-10 ${isActive ? "text-amber-500" : "opacity-60"}`} />
            <span className="relative z-10">{mode.label}</span>
          </button>
        );
      })}
    </div>
  );
}
