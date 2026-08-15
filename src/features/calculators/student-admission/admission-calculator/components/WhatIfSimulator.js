import { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { calculateAggregate } from "../utils/calculations";

export default function WhatIfSimulator({ originalData, onSimulate, onReset }) {
  const [isActive, setIsActive] = useState(false);
  
  // Isolated simulation state
  const [simulatedData, setSimulatedData] = useState({ ...originalData });

  useEffect(() => {
    if (!isActive) {
      setSimulatedData({ ...originalData });
    }
  }, [originalData, isActive]);

  const handleSimulate = (key, value) => {
    setIsActive(true);
    const updatedData = { ...simulatedData, [key]: value };
    setSimulatedData(updatedData);
    const result = calculateAggregate(updatedData);
    onSimulate(result);
  };

  const handleReset = () => {
    setIsActive(false);
    setSimulatedData({ ...originalData });
    onReset();
  };

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-800">What-If Admission Simulator</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-6">
        Experiment with your scores and weights to instantly see how your merit aggregate changes.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Simulate Entry Test Score: {simulatedData.etObtained || 0}
          </label>
          <input
            type="range"
            min="0"
            max={simulatedData.etTotal || 100}
            step="1"
            value={simulatedData.etObtained || 0}
            onChange={(e) => handleSimulate("etObtained", e.target.value)}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0</span>
            <span>{simulatedData.etTotal || 100}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Simulate HSSC Score: {simulatedData.hsscObtained || 0}
          </label>
          <input
            type="range"
            min="0"
            max={simulatedData.hsscTotal || 1100}
            step="1"
            value={simulatedData.hsscObtained || 0}
            onChange={(e) => handleSimulate("hsscObtained", e.target.value)}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0</span>
            <span>{simulatedData.hsscTotal || 1100}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {isActive && (
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-700 bg-white"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
