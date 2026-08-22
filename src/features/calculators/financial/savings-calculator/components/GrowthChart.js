import React from "react";
import { Icons } from "@/lib/lucide-icons";
import { safeFormatNumber } from "../utils/calculations";

export default function GrowthChart({ data, currencySymbol }) {
  if (!data || data.length === 0) return null;

  const height = 240;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  
  // Find max value to scale chart
  const maxBalance = Math.max(...data.map(d => d.endBalance));
  
  // If no growth/balance, don't show a broken chart
  if (maxBalance <= 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
      <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icons.BarChart3 size={20} className="text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-800">Savings Growth Over Time</h2>
        </div>
      </div>
      
      <div className="p-6 overflow-x-auto">
        <div className="min-w-[600px] h-[240px] relative">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const y = padding.top + (height - padding.top - padding.bottom) * (1 - ratio);
              return (
                <g key={i}>
                  <line 
                    x1={padding.left} 
                    y1={y} 
                    x2="100%" 
                    y2={y} 
                    stroke="#e2e8f0" 
                    strokeDasharray="4 4"
                  />
                  <text 
                    x={padding.left - 10} 
                    y={y + 4} 
                    textAnchor="end" 
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    {safeFormatNumber(maxBalance * ratio, 0)}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {data.map((point, i) => {
              const usableWidth = 100 - (padding.left / 600 * 100) - (padding.right / 600 * 100);
              const barWidth = Math.max((usableWidth / data.length) * 0.6, 2);
              const spacing = usableWidth / data.length;
              const x = (padding.left / 600 * 100) + (i * spacing) + (spacing / 2) - (barWidth / 2);
              
              const totalHeight = height - padding.top - padding.bottom;
              
              const startRatio = point.startBalance / maxBalance;
              const contribRatio = point.contributions / maxBalance;
              const intRatio = point.interest / maxBalance;
              
              const startH = startRatio * totalHeight;
              const contribH = contribRatio * totalHeight;
              const intH = intRatio * totalHeight;
              
              const baseY = height - padding.bottom;

              return (
                <g key={point.year} className="group">
                  {/* Base/Start Balance */}
                  <rect 
                    x={`${x}%`} 
                    y={baseY - startH} 
                    width={`${barWidth}%`} 
                    height={Math.max(0, startH)} 
                    fill="#e2e8f0" 
                    rx={0}
                  />
                  {/* Contributions this year */}
                  <rect 
                    x={`${x}%`} 
                    y={baseY - startH - contribH} 
                    width={`${barWidth}%`} 
                    height={Math.max(0, contribH)} 
                    fill="#94a3b8" 
                    rx={0}
                  />
                  {/* Interest this year */}
                  <rect 
                    x={`${x}%`} 
                    y={baseY - startH - contribH - intH} 
                    width={`${barWidth}%`} 
                    height={Math.max(0, intH)} 
                    fill="#4f46e5" 
                    rx={0}
                    className="transition-all duration-300 group-hover:fill-indigo-400"
                  />
                  
                  {/* Year Label */}
                  <text 
                    x={`${x + (barWidth / 2)}%`} 
                    y={height - 10} 
                    textAnchor="middle" 
                    className="text-[10px] fill-slate-400 font-medium"
                  >
                    Yr {point.year}
                  </text>
                  
                  {/* Tooltip trigger area */}
                  <rect
                    x={`${x - (spacing*0.1)}%`}
                    y={padding.top}
                    width={`${barWidth + (spacing*0.2)}%`}
                    height={totalHeight}
                    fill="transparent"
                    className="cursor-pointer"
                  >
                    <title>
                      Year {point.year}&#10;
                      Balance: {currencySymbol}{safeFormatNumber(point.endBalance, 0)}&#10;
                      Contributions: {currencySymbol}{safeFormatNumber(point.contributions, 0)}&#10;
                      Interest: {currencySymbol}{safeFormatNumber(point.interest, 0)}
                    </title>
                  </rect>
                </g>
              );
            })}
          </svg>
        </div>
        
        <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-indigo-500"></div>
            <span className="text-xs font-semibold text-slate-600">Interest Earned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-slate-400"></div>
            <span className="text-xs font-semibold text-slate-600">Contributions</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-600">Starting Balance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
