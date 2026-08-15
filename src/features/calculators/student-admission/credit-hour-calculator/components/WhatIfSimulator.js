import { useState, useEffect } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { calculateDegreeProgress } from "../utils/calculations";

export default function WhatIfSimulator({ originalConfig, onSimulate, onReset }) {
  const [isActive, setIsActive] = useState(false);
  
  // Local state for simulator sliders
  const [addedCredits, setAddedCredits] = useState(0);
  const [adjustedSemesters, setAdjustedSemesters] = useState(originalConfig.remainingSemesters || 1);

  // Sync with original config changes when not active
  useEffect(() => {
    if (!isActive && originalConfig.remainingSemesters) {
      setAdjustedSemesters(originalConfig.remainingSemesters);
    }
  }, [originalConfig, isActive]);

  const handleSimulate = () => {
    setIsActive(true);
    
    // Create new simulated completion state
    const simulatedCompleted = Number(originalConfig.completedCredits || 0) + Number(addedCredits);
    
    const simulatedResult = calculateDegreeProgress(
      originalConfig.targetCredits,
      simulatedCompleted,
      originalConfig.currentSemesterCredits,
      adjustedSemesters
    );
    
    onSimulate(simulatedResult);
  };

  const handleReset = () => {
    setIsActive(false);
    setAddedCredits(0);
    setAdjustedSemesters(originalConfig.remainingSemesters || 1);
    onReset();
  };

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mt-8">
      <div className="flex items-center gap-2 mb-6">
        <SlidersHorizontal className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-800">What-If Simulator</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-6">
        Experiment with your degree progress by simulating extra credits earned or changing your graduation timeline.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Simulate Additional Earned Credits (+{addedCredits})
          </label>
          <input
            type="range"
            min="0"
            max="60"
            step="1"
            value={addedCredits}
            onChange={(e) => setAddedCredits(e.target.value)}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>0</span>
            <span>60</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Adjust Remaining Semesters ({adjustedSemesters})
          </label>
          <input
            type="range"
            min="1"
            max="12"
            step="1"
            value={adjustedSemesters}
            onChange={(e) => setAdjustedSemesters(e.target.value)}
            className="w-full accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1</span>
            <span>12</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleSimulate}
          className="flex-1 sm:flex-none px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Run Simulation
        </button>
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
