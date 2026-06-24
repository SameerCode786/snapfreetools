import { BookOpen } from "lucide-react";

export default function FormulaCard({ 
  title = "Calculation Formula", 
  formula, 
  explanation, 
  className = "" 
}) {
  return (
    <section className={`bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <BookOpen size={18} />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      </div>

      <div className="space-y-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-center justify-center text-center">
          <code className="text-slate-800 font-mono text-base md:text-lg font-bold break-all select-all">
            {formula}
          </code>
        </div>

        {explanation && (
          <div className="text-slate-600 text-sm leading-relaxed font-medium">
            {explanation}
          </div>
        )}
      </div>
    </section>
  );
}
