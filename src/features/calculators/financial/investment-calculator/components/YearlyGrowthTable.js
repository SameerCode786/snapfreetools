import React from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function YearlyGrowthTable({ result, currencyCode }) {
  if (!result || !result.yearlyBreakdown || result.yearlyBreakdown.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Yearly Growth Breakdown</h3>
      </div>
      
      <div className="overflow-x-auto max-h-[400px] overflow-y-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Year</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Start Balance</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Contributions</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Yearly Growth</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">End Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {result.yearlyBreakdown.map((row, index) => (
              <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3 px-6 text-sm font-bold text-slate-700">{row.year}</td>
                <td className="py-3 px-6 text-sm font-semibold text-slate-600">{formatCurrency(row.startBalance, currencyCode)}</td>
                <td className="py-3 px-6 text-sm font-semibold text-slate-600">{formatCurrency(row.contribution, currencyCode)}</td>
                <td className="py-3 px-6 text-sm font-bold text-emerald-600">{formatCurrency(row.growth, currencyCode)}</td>
                <td className="py-3 px-6 text-sm font-bold text-indigo-700">{formatCurrency(row.endBalance, currencyCode)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
