import { Calculator, Wallet, Scale, FastForward, HelpCircle } from "lucide-react";

const MODES = [
  { id: "standard", label: "Payment", icon: Calculator },
  { id: "affordability", label: "Affordability", icon: Wallet },
  { id: "comparison", label: "Compare", icon: Scale },
  { id: "extra", label: "Extra Pay", icon: FastForward },
  { id: "reverse", label: "Reverse", icon: HelpCircle },
];

export default function ModeSwitcher({ currentMode, onModeChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-2 mb-8 overflow-x-auto">
      <div className="flex sm:grid sm:grid-cols-5 gap-2 min-w-max sm:min-w-0">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all ${
                isActive 
                  ? "bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-sm" 
                  : "bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent"
              }`}
            >
              <Icon className={`w-5 h-5 mb-1.5 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              <span className={`text-xs font-semibold ${isActive ? "text-indigo-700" : "text-slate-500"}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
