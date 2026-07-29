"use client";

import React from "react";
import { Icons } from "@/lib/lucide-icons";
import CircularProgressRing from "./CircularProgressRing";
import SmartProgressBar from "./SmartProgressBar";

export default function AttendanceStatusCard({ percentage, total, attended, missed, target }) {
  const isTargetMode = target !== undefined;
  
  let status = "Unknown";
  let statusColor = "text-slate-600";
  let statusBg = "bg-slate-100";
  let ringColor = "text-slate-500";
  let bgColorClass = "bg-slate-500";
  let Icon = Icons.HelpCircle;

  if (isTargetMode) {
    const diff = percentage - target;
    if (diff >= 10) {
      status = "Excellent";
      statusColor = "text-green-700";
      statusBg = "bg-green-50";
      ringColor = "text-green-500";
      bgColorClass = "bg-green-500";
      Icon = Icons.CheckCircle2;
    } else if (diff >= 0) {
      status = "Safe";
      statusColor = "text-emerald-700";
      statusBg = "bg-emerald-50";
      ringColor = "text-emerald-500";
      bgColorClass = "bg-emerald-500";
      Icon = Icons.Shield;
    } else if (diff >= -5) {
      status = "At Risk";
      statusColor = "text-amber-700";
      statusBg = "bg-amber-50";
      ringColor = "text-amber-500";
      bgColorClass = "bg-amber-500";
      Icon = Icons.AlertTriangle;
    } else if (diff >= -15) {
      status = "Below Target";
      statusColor = "text-red-700";
      statusBg = "bg-red-50";
      ringColor = "text-red-500";
      bgColorClass = "bg-red-500";
      Icon = Icons.TrendingDown;
    } else {
      status = "Critical";
      statusColor = "text-rose-800";
      statusBg = "bg-rose-100";
      ringColor = "text-rose-600";
      bgColorClass = "bg-rose-600";
      Icon = Icons.AlertTriangle;
    }
  } else {
    if (percentage >= 85) {
      status = "Excellent";
      statusColor = "text-green-700";
      statusBg = "bg-green-50";
      ringColor = "text-green-500";
      bgColorClass = "bg-green-500";
      Icon = Icons.CheckCircle2;
    } else if (percentage >= 75) {
      status = "Good";
      statusColor = "text-emerald-700";
      statusBg = "bg-emerald-50";
      ringColor = "text-emerald-500";
      bgColorClass = "bg-emerald-500";
      Icon = Icons.CheckCircle2;
    } else if (percentage >= 60) {
      status = "Warning";
      statusColor = "text-amber-700";
      statusBg = "bg-amber-50";
      ringColor = "text-amber-500";
      bgColorClass = "bg-amber-500";
      Icon = Icons.AlertTriangle;
    } else {
      status = "Critical";
      statusColor = "text-red-700";
      statusBg = "bg-red-50";
      ringColor = "text-red-500";
      bgColorClass = "bg-red-500";
      Icon = Icons.TrendingDown;
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm flex flex-col items-center gap-6 md:gap-10 transition-all">
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Left Side: Circular Ring & Status */}
        <div className="flex flex-col items-center text-center">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">
            Current Attendance
          </span>
          
          <CircularProgressRing 
            percentage={percentage} 
            size={140} 
            strokeWidth={12} 
            colorClass={ringColor} 
          />
          
          <div className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-sm mt-5 border border-white/50 shadow-sm ${statusBg} ${statusColor}`}>
            <Icon size={16} />
            {status}
          </div>
        </div>

        {/* Right Side: Stats & Linear Progress */}
        <div className="w-full md:w-3/5 flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">TOTAL</div>
              <div className="text-2xl font-black text-slate-700">{total}</div>
            </div>
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold text-emerald-600/70 uppercase tracking-widest mb-1.5">ATTENDED</div>
              <div className="text-2xl font-black text-emerald-700">{attended}</div>
            </div>
            <div className="bg-red-50/50 border border-red-100/50 rounded-2xl p-4">
              <div className="text-[10px] font-extrabold text-red-600/70 uppercase tracking-widest mb-1.5">MISSED</div>
              <div className="text-2xl font-black text-red-700">{missed}</div>
            </div>
          </div>
          
          <SmartProgressBar 
            currentPercentage={percentage}
            targetPercentage={target}
            showTarget={isTargetMode}
            colorClass={bgColorClass}
          />
        </div>
      </div>
    </div>
  );
}
