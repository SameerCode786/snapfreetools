import { useState } from "react";
import { Target, CheckCircle2, AlertCircle } from "lucide-react";
import { calculateRequiredEntryTestScore } from "../utils/calculations";

export default function TargetPlanner({ data, onCalculateTarget }) {
  const [target, setTarget] = useState("80");

  const handleCalculate = () => {
    const result = calculateRequiredEntryTestScore(data, target);
    onCalculateTarget(result, target);
  };

  const presetTargets = ["70", "75", "80", "85", "90", "95"];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Target className="w-5 h-5 text-indigo-500" />
        <h3 className="text-lg font-bold text-slate-800">Target Aggregate Planner</h3>
      </div>
      
      <p className="text-sm text-slate-600 mb-6">
        Select your desired admission aggregate to calculate exactly how many entry test marks you need.
      </p>

      <div className="flex flex-wrap gap-3 mb-6">
        {presetTargets.map(val => (
          <button
            key={val}
            onClick={() => {
              setTarget(val);
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-colors ${target === val ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'}`}
          >
            {val}%
          </button>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Custom Target (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div className="flex-shrink-0 pt-6">
          <button
            onClick={handleCalculate}
            className="h-11 px-6 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
}
