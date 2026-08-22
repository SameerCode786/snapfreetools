import React from 'react';
import { 
  Tag, RotateCcw, Search, Layers, 
  Receipt, HandCoins, ArrowRightLeft, BarChart2, 
  Target, HelpCircle
} from 'lucide-react';

const MODES = [
  { id: 'basic', label: 'Discount', icon: Tag },
  { id: 'reverse', label: 'Reverse', icon: RotateCcw },
  { id: 'findOriginal', label: 'Original Price', icon: Search },
  { id: 'stacked', label: 'Stacked', icon: Layers },
  { id: 'tax', label: 'Tax', icon: Receipt },
  { id: 'tip', label: 'Tip', icon: HandCoins },
  { id: 'compare', label: 'Compare', icon: ArrowRightLeft },
  { id: 'target', label: 'Target Price', icon: Target },
];

export default function ModeSwitcher({ activeMode, setMode, onReset }) {
  const handleModeChange = (newMode) => {
    if (newMode !== activeMode) {
      setMode(newMode);
      onReset();
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-4 sm:p-6 mb-8 border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide no-scrollbar -mx-2 px-2 sm:mx-0 sm:px-0">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          
          return (
            <button
              key={mode.id}
              onClick={() => handleModeChange(mode.id)}
              className={`
                flex flex-col items-center justify-center min-w-[85px] sm:min-w-[100px] h-20 sm:h-24 rounded-2xl transition-all flex-shrink-0 border
                ${isActive 
                  ? 'bg-amber-50 border-amber-200 text-amber-700 shadow-sm' 
                  : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50 hover:border-slate-200'
                }
              `}
              aria-pressed={isActive}
            >
              <Icon size={24} className={`mb-2 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span className={`text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center ${isActive ? 'text-amber-700' : 'text-slate-500'}`}>
                {mode.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
