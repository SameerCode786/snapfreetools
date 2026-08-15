import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

export default function AmortizationSchedule({ yearlySchedule, currencyCode }) {
  const [expandedYears, setExpandedYears] = useState({});

  if (!yearlySchedule || yearlySchedule.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-8 text-center">
        <p className="text-sm font-medium text-slate-500">Enter valid loan details to view your amortization schedule.</p>
      </div>
    );
  }

  const toggleYear = (year) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Amortization Schedule</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">Year / Period</th>
              <th className="px-6 py-3 whitespace-nowrap">Payment</th>
              <th className="px-6 py-3 whitespace-nowrap">Principal</th>
              <th className="px-6 py-3 whitespace-nowrap">Interest</th>
              <th className="px-6 py-3 whitespace-nowrap">Remaining Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {yearlySchedule.map((yearData) => {
              const isExpanded = !!expandedYears[yearData.year];
              
              return (
                <React.Fragment key={`year-${yearData.year}`}>
                  <tr 
                    className="hover:bg-slate-50 cursor-pointer transition-colors"
                    onClick={() => toggleYear(yearData.year)}
                  >
                    <td className="px-6 py-4 font-semibold text-slate-800 flex items-center gap-2 whitespace-nowrap">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      Year {yearData.year}
                    </td>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">{formatCurrency(yearData.payment, currencyCode)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(yearData.principal, currencyCode)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(yearData.interest, currencyCode)}</td>
                    <td className="px-6 py-4 font-medium text-slate-700 whitespace-nowrap">{formatCurrency(yearData.balance, currencyCode)}</td>
                  </tr>
                  
                  {isExpanded && yearData.months.map((month) => (
                    <tr key={`month-${month.period}`} className="bg-slate-50/50 hover:bg-slate-100/50 transition-colors text-xs">
                      <td className="px-6 py-3 pl-12 whitespace-nowrap text-slate-500">Payment {month.period}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{formatCurrency(month.payment, currencyCode)}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{formatCurrency(month.principal, currencyCode)}</td>
                      <td className="px-6 py-3 whitespace-nowrap">{formatCurrency(month.interest, currencyCode)}</td>
                      <td className="px-6 py-3 font-medium whitespace-nowrap">{formatCurrency(month.balance, currencyCode)}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
