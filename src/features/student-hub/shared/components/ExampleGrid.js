import { HelpCircle, ChevronRight } from "lucide-react";

export default function ExampleGrid({ 
  examples, 
  title = "Worked Examples & Scenarios",
  className = "" 
}) {
  if (!examples || examples.length === 0) return null;

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <HelpCircle size={18} />
        </div>
        <h3 className="font-bold text-slate-900 text-lg">{title}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {examples.map((ex, index) => (
          <div 
            key={index}
            className="bg-white border border-slate-200 hover:border-amber-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:shadow-amber-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                Scenario {index + 1}
              </span>
              <h4 className="font-bold text-slate-800 text-sm md:text-base leading-snug">
                "{ex.scenario}"
              </h4>
              <p className="text-slate-600 text-sm font-medium leading-relaxed">
                {ex.solution}
              </p>
            </div>
            {ex.steps && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Steps:</span>
                {ex.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-500 font-medium">
                    <ChevronRight size={12} className="text-amber-500 shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
