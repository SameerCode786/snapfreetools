"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown } from "lucide-react";

export default function FAQSection({ faqs, className = "" }) {
  const [openIndex, setOpenIndex] = useState(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={`space-y-6 ${className}`}>
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
          <HelpCircle size={18} />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          
          return (
            <div 
              key={index} 
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-200"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex justify-between items-center p-5 text-left font-bold text-slate-800 hover:text-amber-600 transition-colors text-sm md:text-base gap-4"
              >
                <span>{faq.question}</span>
                <span className={`p-1 rounded-lg bg-slate-50 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180 bg-amber-50 text-amber-600" : ""}`}>
                  <ChevronDown size={18} />
                </span>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-slate-100" : "max-h-0"
                }`}
              >
                <div className="p-5 text-slate-600 text-sm leading-relaxed font-medium">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
