import { Lightbulb, Info, AlertTriangle, CheckCircle } from "lucide-react";

export default function LoanInsights({ recommendations }) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Financial Insights
        </h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {recommendations.map((rec, idx) => {
            let Icon = Info;
            let colorClass = "text-blue-600 bg-blue-50 border-blue-100";
            let iconColor = "text-blue-500";
            
            if (rec.type === 'warning') {
              Icon = AlertTriangle;
              colorClass = "text-amber-800 bg-amber-50 border-amber-100";
              iconColor = "text-amber-500";
            } else if (rec.type === 'error') {
              Icon = AlertTriangle;
              colorClass = "text-red-800 bg-red-50 border-red-100";
              iconColor = "text-red-500";
            } else if (rec.type === 'success') {
              Icon = CheckCircle;
              colorClass = "text-emerald-800 bg-emerald-50 border-emerald-100";
              iconColor = "text-emerald-500";
            }

            return (
              <div key={idx} className={`flex items-start gap-4 p-4 rounded-lg border ${colorClass}`}>
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
                <div>
                  <h4 className="text-sm font-bold mb-1">{rec.title}</h4>
                  <p className="text-sm font-medium opacity-90 leading-relaxed">{rec.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
