"use client";

import React, { useEffect, useState } from "react";

export default function CircularProgressRing({ 
  percentage, 
  size = 120, 
  strokeWidth = 10, 
  colorClass = "text-emerald-500",
  trackColorClass = "text-slate-100",
  ariaLabel
}) {
  const [progress, setProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Safe clamp between 0 and 100
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    // Small timeout for entry animation
    const timer = setTimeout(() => {
      setProgress(clampedPercentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedPercentage]);

  const formattedPercent = Number.isInteger(percentage) 
    ? percentage.toString() 
    : percentage.toFixed(2).replace(/\.00$/, '');

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90 transition-transform duration-500"
        role="progressbar"
        aria-valuenow={clampedPercentage}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={ariaLabel || `Progress is ${formattedPercent}%`}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className={trackColorClass}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <div className="flex items-start">
          <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">{formattedPercent}</span>
          <span className="text-sm font-bold text-slate-400 leading-none mt-1">%</span>
        </div>
      </div>
    </div>
  );
}
