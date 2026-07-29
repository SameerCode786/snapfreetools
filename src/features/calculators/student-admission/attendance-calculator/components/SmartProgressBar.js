"use client";

import React from "react";
import { Icons } from "@/lib/lucide-icons";

export default function SmartProgressBar({ 
  currentPercentage, 
  targetPercentage, 
  colorClass = "bg-emerald-500",
  showTarget = false
}) {
  const clampedCurrent = Math.min(100, Math.max(0, currentPercentage));
  const clampedTarget = targetPercentage !== undefined 
    ? Math.min(100, Math.max(0, targetPercentage)) 
    : 75;

  const formattedCurrent = Number.isInteger(currentPercentage) 
    ? currentPercentage.toString() 
    : currentPercentage.toFixed(2).replace(/\.00$/, '');

  const formattedTarget = Number.isInteger(targetPercentage) 
    ? targetPercentage.toString() 
    : (targetPercentage || 75).toFixed(2).replace(/\.00$/, '');

  // To prevent label overlapping, calculate relative positions
  const labelOverlap = showTarget && Math.abs(clampedCurrent - clampedTarget) < 15;
  const isCurrentBeforeTarget = clampedCurrent <= clampedTarget;

  return (
    <div className="w-full pt-8 pb-4" role="progressbar" aria-valuenow={clampedCurrent} aria-valuemin="0" aria-valuemax="100">
      
      {/* Top Labels (Target) */}
      <div className="relative h-6 w-full mb-2">
        {showTarget && (
          <div 
            className="absolute top-0 flex flex-col items-center transform -translate-x-1/2 transition-all duration-700 ease-out z-10"
            style={{ 
              left: `${clampedTarget}%`,
              // If they overlap and current is before target, push target label right
              transform: labelOverlap && isCurrentBeforeTarget ? 'translateX(0%)' : '-translate-x-1/2'
            }}
          >
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap bg-white/80 px-1 rounded">Target</span>
            <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{formattedTarget}%</span>
            <Icons.ChevronDown size={14} className="text-slate-300 mt-0.5" />
          </div>
        )}
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full bg-slate-100 rounded-full overflow-hidden">
        {showTarget && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-slate-400/50 z-20" 
            style={{ left: `${clampedTarget}%` }}
          />
        )}
        <div 
          className={`h-full rounded-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${clampedCurrent}%` }}
        />
      </div>

      {/* Bottom Labels (Current) */}
      <div className="relative h-8 w-full mt-2">
        <div className="absolute left-0 text-[10px] font-bold text-slate-400 top-1">0%</div>
        <div className="absolute right-0 text-[10px] font-bold text-slate-400 top-1">100%</div>
        
        <div 
          className="absolute top-0 flex flex-col items-center transform -translate-x-1/2 transition-all duration-700 ease-out z-20"
          style={{ 
            left: `${clampedCurrent}%`,
            // If they overlap and current is before target, push current label left
            transform: labelOverlap && !isCurrentBeforeTarget ? 'translateX(-100%)' : '-translate-x-1/2'
          }}
        >
          <div className="w-2.5 h-2.5 rotate-45 border-l border-t border-slate-200 bg-white -mt-1.5 mb-0.5 z-10" />
          <div className="bg-white border border-slate-200 shadow-sm rounded-lg px-2 py-1 flex flex-col items-center z-20 whitespace-nowrap relative -mt-1.5">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none mb-1">Current</span>
            <span className={`text-xs font-bold leading-none ${colorClass.replace('bg-', 'text-')}`}>
              {formattedCurrent}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
