import CircularProgressRing from "@/features/calculators/student-admission/attendance-calculator/components/CircularProgressRing";
import { getMeritStatus } from "../utils/calculations";

export default function AdmissionResultDashboard({ result, isSimulation, isTarget }) {
  if (!result || result.isEmpty) return null;

  const meritStatus = getMeritStatus(result.finalAggregate);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col min-h-0">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">
          {isSimulation ? "Simulated Admission Aggregate" : isTarget ? "Target Required" : "Final Admission Aggregate"}
        </h3>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="flex-shrink-0">
            <CircularProgressRing 
              percentage={result.finalAggregate} 
              size={160} 
              strokeWidth={14} 
            />
          </div>
          
          <div className="flex-grow w-full">
            <div className="grid grid-cols-2 gap-4 text-center mb-6">
              <StatCard label="Final Aggregate" value={`${result.finalAggregate.toFixed(2)}%`} color="text-indigo-600" />
              <StatCard label="Academic Contrib." value={`${result.academicContribution.toFixed(2)}%`} />
              <StatCard label="Entry Test Contrib." value={`${result.etContribution.toFixed(2)}%`} />
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-lg">
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Merit Status</span>
                <span className={`inline-flex items-center px-2 py-1 text-center leading-tight rounded-full text-xs font-semibold border border-opacity-50 border-current ${meritStatus.color}`}>
                  {meritStatus.label}
                </span>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Score Breakdown</h4>
              <div className="space-y-2 text-sm text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span>SSC ({result.sscPercentage.toFixed(2)}%)</span>
                  <span>{result.sscContribution.toFixed(2)} points</span>
                </div>
                <div className="flex justify-between">
                  <span>HSSC ({result.hsscPercentage.toFixed(2)}%)</span>
                  <span>{result.hsscContribution.toFixed(2)} points</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-slate-200 pt-2">
                  <span>Entry Test ({result.etPercentage.toFixed(2)}%)</span>
                  <span>{result.etContribution.toFixed(2)} points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isSimulation && (
        <div className="bg-amber-50 px-6 py-3 border-t border-amber-100 text-sm font-medium text-amber-800 text-center flex justify-center items-center gap-2 mt-auto">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          Viewing What-If Simulation
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, color = "text-slate-900" }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-lg">
      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 text-center">{label}</span>
      <span className={`text-xl sm:text-2xl font-bold ${color}`}>{value}</span>
    </div>
  );
}
