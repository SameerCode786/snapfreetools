import { useState, useEffect } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
import CalculatorInput from "@/features/student-hub/shared/components/CalculatorInput";

export default function WhatIfSimulator({ 
  currentObtained, 
  currentTotal, 
  onSimulate,
  mode = "single"
}) {
  const [simulationType, setSimulationType] = useState("addMarks");
  const [value, setValue] = useState("");

  // Only apply to modes where marks obtained/total make sense
  if (mode !== "single" && mode !== "multiple") return null;

  const handleSimulate = () => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) return;

    if (simulationType === "addMarks") {
      onSimulate(currentObtained + numValue, currentTotal);
    } else if (simulationType === "addPercent") {
      const additionalMarks = (numValue / 100) * currentTotal;
      onSimulate(currentObtained + additionalMarks, currentTotal);
    } else if (simulationType === "changeFinal") {
      // Assuming changing final replaces some marks. Simplified for V1.
      onSimulate(currentObtained + numValue, currentTotal + 100);
    }
  };

  return (
    <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 md:p-8 mt-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Grade Improvement Simulator</h3>
          <p className="text-sm text-slate-500">Experiment with "What If" scenarios</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">Scenario</label>
          <div className="relative">
            <select
              value={simulationType}
              onChange={(e) => setSimulationType(e.target.value)}
              className="w-full bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="addMarks">If I get extra marks...</option>
              <option value="addPercent">If I improve by %...</option>
              <option value="changeFinal">If I add a 100-mark final and score...</option>
            </select>
          </div>
        </div>

        <div className="flex-1 w-full">
          <CalculatorInput
            label="Value"
            type="number"
            placeholder="e.g. 10"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min="0"
          />
        </div>

        <button
          onClick={handleSimulate}
          disabled={!value || parseFloat(value) <= 0}
          className="w-full md:w-auto px-6 py-3.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Simulate <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
