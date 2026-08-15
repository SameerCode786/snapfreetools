import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function WeightConfiguration({ data, updateData, validation }) {
  const { isValid, total, difference } = validation;

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h3 className="text-sm font-bold text-slate-700 mb-4 flex justify-between items-center">
        Weightage Configuration
        <span className={`px-2 py-1 rounded text-xs font-semibold ${isValid ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
          Total: {total.toFixed(2)}%
        </span>
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">SSC Weight (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={data.sscWeight}
            onChange={(e) => updateData("sscWeight", e.target.value)}
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">HSSC Weight (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={data.hsscWeight}
            onChange={(e) => updateData("hsscWeight", e.target.value)}
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Entry Test (%)</label>
          <input
            type="number"
            min="0"
            max="100"
            step="any"
            value={data.etWeight}
            onChange={(e) => updateData("etWeight", e.target.value)}
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
          />
        </div>
      </div>

      {!isValid && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 text-red-800 border border-red-100">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
          <div className="text-sm">
            <p className="font-semibold">Invalid Weights</p>
            <p>
              Your weights total {total.toFixed(2)}%. 
              {difference > 0 ? ` Please reduce weights by ${difference.toFixed(2)}%.` : ` Please add ${Math.abs(difference).toFixed(2)}% to reach exactly 100%.`}
            </p>
          </div>
        </div>
      )}
      {isValid && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
          <CheckCircle2 className="w-4 h-4" />
          Weights are correctly configured to 100%.
        </div>
      )}
    </div>
  );
}
