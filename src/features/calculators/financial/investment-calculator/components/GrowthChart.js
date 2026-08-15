import React from "react";
import { formatCurrency } from "@/features/calculators/financial/emi-calculator/utils/currency";

export default function GrowthChart({ result, currencyCode }) {
  if (!result || !result.yearlyBreakdown || result.yearlyBreakdown.length === 0) return null;

  const data = result.yearlyBreakdown;
  const maxEndBalance = Math.max(...data.map(d => d.endBalance));
  
  if (maxEndBalance <= 0) return null;

  const height = 240;
  
  // Calculate relative heights for each year
  // A bar has two parts: The base (contributions/principal) and the top (growth)
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800">Investment Growth Over Time</h3>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-slate-300"></div>
            <span className="text-slate-600">Invested</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-emerald-400"></div>
            <span className="text-slate-600">Growth</span>
          </div>
        </div>
      </div>
      
      <div className="relative w-full overflow-x-auto hide-scrollbar" style={{ height: `${height}px` }}>
        <div className="absolute inset-0 flex items-end justify-between min-w-[600px] px-2">
          {data.map((yearData, index) => {
            const totalHeightPercentage = (yearData.endBalance / maxEndBalance) * 100;
            const investedAmount = yearData.startBalance + yearData.contribution - yearData.growth; 
            // Actually, total invested up to this year:
            // Since it's a breakdown, total invested at end of year y is Principal + (y * annual_contrib)
            const cumulativeInvested = result.initialInvestment !== undefined ? result.initialInvestment + (yearData.contribution * yearData.year) : (yearData.endBalance - yearData.growth); // approximation if initialInvestment not available directly on result
            
            // Re-calculate accurately based on the fact that growth accumulates.
            // A simpler way: The bottom part is always total invested, the top part is always total growth.
            // Wait, in yearlyBreakdown, `growth` is the growth FOR THAT YEAR, not cumulative growth.
            // Let's calculate cumulative growth up to this year.
            
            // To be accurate, we can just track it manually.
            let cumulativeG = 0;
            for(let i=0; i<=index; i++) {
              cumulativeG += data[i].growth;
            }
            
            const cumulativeI = yearData.endBalance - cumulativeG;
            
            const investedHeightPct = (cumulativeI / maxEndBalance) * 100;
            const growthHeightPct = (cumulativeG / maxEndBalance) * 100;
            
            // Render every year, or skip labels if too many
            const showLabel = data.length <= 15 || index % Math.ceil(data.length / 10) === 0 || index === data.length - 1;

            return (
              <div key={yearData.year} className="flex flex-col items-center justify-end h-full w-full mx-0.5 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10 transition-opacity">
                  <div className="font-bold mb-1">Year {yearData.year}</div>
                  <div>Value: {formatCurrency(yearData.endBalance, currencyCode)}</div>
                  <div className="text-emerald-300">Growth: {formatCurrency(cumulativeG, currencyCode)}</div>
                </div>
                
                {/* Bar */}
                <div className="w-full max-w-[40px] flex flex-col justify-end" style={{ height: '100%' }}>
                  <div className="w-full bg-emerald-400 rounded-t-sm transition-all" style={{ height: `${growthHeightPct}%` }}></div>
                  <div className="w-full bg-slate-300 transition-all" style={{ height: `${investedHeightPct}%`, borderTopLeftRadius: growthHeightPct === 0 ? '0.125rem' : '0', borderTopRightRadius: growthHeightPct === 0 ? '0.125rem' : '0' }}></div>
                </div>
                
                {/* Label */}
                <div className="h-6 mt-2 flex items-center justify-center">
                  <span className={`text-[10px] font-bold text-slate-400 ${!showLabel && 'hidden'}`}>
                    Yr {yearData.year}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
