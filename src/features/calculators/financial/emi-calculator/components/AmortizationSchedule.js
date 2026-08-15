import React, { useState } from 'react';
import { formatCurrency } from "../utils/currency";

export default function AmortizationSchedule({ result, schedule, currencyCode }) {
  const [expandedYears, setExpandedYears] = useState({});

  if (!result || result.isEmpty || !schedule || schedule.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Amortization Schedule</h3>
        <p className="text-sm text-slate-500 max-w-sm">Your repayment schedule will appear here after calculation.</p>
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
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50">
        <h3 className="text-lg font-bold text-slate-800">Amortization Schedule</h3>
        <p className="text-sm text-slate-500 mt-1">Yearly summary of your loan repayment journey.</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500">
              <th className="py-3 px-6 font-bold w-1/5">Year</th>
              <th className="py-3 px-6 font-bold text-right w-1/5">Payment</th>
              <th className="py-3 px-6 font-bold text-right w-1/5">Principal</th>
              <th className="py-3 px-6 font-bold text-right w-1/5">Interest</th>
              <th className="py-3 px-6 font-bold text-right w-1/5">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {schedule.map((yearData) => (
              <React.Fragment key={`year-${yearData.year}`}>
                {/* Yearly Row */}
                <tr 
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${expandedYears[yearData.year] ? 'bg-slate-50' : ''}`}
                  onClick={() => toggleYear(yearData.year)}
                >
                  <td className="py-4 px-6 font-bold text-slate-800 flex items-center gap-2">
                    <button className="p-1 rounded-full hover:bg-slate-200 transition-colors">
                      <svg 
                        className={`w-4 h-4 text-slate-500 transition-transform ${expandedYears[yearData.year] ? 'rotate-90' : ''}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    Year {yearData.year}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 text-right">{formatCurrency(yearData.payment, currencyCode)}</td>
                  <td className="py-4 px-6 font-medium text-slate-700 text-right">{formatCurrency(yearData.principal, currencyCode)}</td>
                  <td className="py-4 px-6 font-medium text-slate-700 text-right">{formatCurrency(yearData.interest, currencyCode)}</td>
                  <td className="py-4 px-6 font-bold text-indigo-600 text-right">{formatCurrency(yearData.balance, currencyCode)}</td>
                </tr>
                
                {/* Monthly Details */}
                {expandedYears[yearData.year] && (
                  <tr>
                    <td colSpan="5" className="p-0 bg-slate-50/50">
                      <div className="overflow-hidden bg-slate-50/80 inner-shadow-sm p-4">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-xs text-slate-400 border-b border-slate-200/50">
                              <th className="py-2 px-6 font-semibold text-left">Period</th>
                              <th className="py-2 px-6 font-semibold text-right">Payment</th>
                              <th className="py-2 px-6 font-semibold text-right">Principal</th>
                              <th className="py-2 px-6 font-semibold text-right">Interest</th>
                              <th className="py-2 px-6 font-semibold text-right">Balance</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200/50">
                            {yearData.months.map((month) => (
                              <tr key={`month-${month.period}`} className="hover:bg-slate-100 transition-colors">
                                <td className="py-2 px-6 text-slate-600 font-medium">#{month.period}</td>
                                <td className="py-2 px-6 text-slate-600 text-right">{formatCurrency(month.payment, currencyCode)}</td>
                                <td className="py-2 px-6 text-slate-600 text-right">{formatCurrency(month.principal, currencyCode)}</td>
                                <td className="py-2 px-6 text-slate-600 text-right">{formatCurrency(month.interest, currencyCode)}</td>
                                <td className="py-2 px-6 text-slate-700 font-semibold text-right">{formatCurrency(month.balance, currencyCode)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
