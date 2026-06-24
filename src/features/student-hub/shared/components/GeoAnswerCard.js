"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function GeoAnswerCard({ 
  question, 
  answer, 
  className = "" 
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`${question}\n\nAnswer: ${answer}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      id="quick-answer" 
      className={`bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden ${className}`}
    >
      <div className="flex justify-between items-start gap-4 mb-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Quick Answer & AI Summary
        </h3>
        <button
          onClick={handleCopy}
          className="text-slate-400 hover:text-amber-600 transition-colors p-1.5 hover:bg-slate-100 rounded-lg flex items-center gap-1.5 text-xs font-bold"
          title="Copy answer to clipboard"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-600" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy Summary</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-2">
        <h4 className="text-base font-bold text-slate-800 leading-snug">
          {question}
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed font-medium">
          {answer}
        </p>
      </div>
    </section>
  );
}
