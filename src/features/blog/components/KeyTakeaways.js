import React from "react";
import { Lightbulb } from "lucide-react";

export default function KeyTakeaways({ takeaways }) {
  if (!takeaways || takeaways.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-100 rounded-[2rem] p-6 sm:p-8 mb-10 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
      
      <h3 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Lightbulb size={20} />
        </div>
        Key Takeaways
      </h3>
      
      <ul className="space-y-4">
        {takeaways.map((takeaway, idx) => (
          <li key={idx} className="flex items-start gap-3 text-amber-900/80 font-medium leading-relaxed text-sm sm:text-base">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full flex-shrink-0 mt-2"></span>
            <span>{takeaway}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
