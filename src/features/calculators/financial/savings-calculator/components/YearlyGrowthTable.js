import React from "react";
import { safeFormatNumber } from "../utils/calculations";

export default function YearlyGrowthTable({ data, currencySymbol }) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Yearly Breakdown</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Year</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Start Balance</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Contributions</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Interest</th>
              <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">End Balance</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.year} 
                className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}
              >
                <td className="py-3 px-6 font-semibold text-slate-800">{row.year}</td>
                <td className="py-3 px-6 text-slate-600">{currencySymbol}{safeFormatNumber(row.startBalance, 2)}</td>
                <td className="py-3 px-6 text-slate-600">{currencySymbol}{safeFormatNumber(row.contributions, 2)}</td>
                <td className="py-3 px-6 text-indigo-600 font-medium">{currencySymbol}{safeFormatNumber(row.interest, 2)}</td>
                <td className="py-3 px-6 font-bold text-slate-800">{currencySymbol}{safeFormatNumber(row.endBalance, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
