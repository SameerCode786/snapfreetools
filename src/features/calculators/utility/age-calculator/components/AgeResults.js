"use client";

import { CalendarHeart, CalendarDays, Hash, Clock, Gift, AlertCircle } from "lucide-react";

export default function AgeResults({ result, dob }) {
  if (!dob || result.isEmpty || !result.isValid) {
    if (result.error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
          <div className="w-16 h-16 bg-white border border-red-200 rounded-2xl flex items-center justify-center text-red-400 mb-4 shadow-sm">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-red-800 mb-2">Calculation Error</h3>
          <p className="text-red-600 font-medium max-w-sm">
            {result.error}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
        <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-4 shadow-sm">
          <CalendarDays size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">Age Results</h3>
        <p className="text-slate-500 font-medium max-w-sm">
          Enter your Date of Birth to calculate your exact age in years, months, and days.
        </p>
      </div>
    );
  }



  const { exact, total, nextBirthday, bornOn } = result;

  return (
    <div className="space-y-6">
      {/* Exact Age Cards */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-amber-500/20">
        <h3 className="text-amber-100 font-bold uppercase tracking-wider text-sm mb-6 flex items-center gap-2">
          <CalendarDays size={16} /> Exact Age
        </h3>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl sm:text-4xl font-black mb-1">{exact.years}</div>
            <div className="text-amber-100 text-xs sm:text-sm font-bold uppercase tracking-wide">Years</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl sm:text-4xl font-black mb-1">{exact.months}</div>
            <div className="text-amber-100 text-xs sm:text-sm font-bold uppercase tracking-wide">Months</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20">
            <div className="text-3xl sm:text-4xl font-black mb-1">{exact.days}</div>
            <div className="text-amber-100 text-xs sm:text-sm font-bold uppercase tracking-wide">Days</div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-amber-50 font-medium">
          <div>You were born on a <strong className="text-white">{bornOn}</strong>.</div>
        </div>
      </div>

      {/* Grid for Total Statistics and Next Birthday */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Next Birthday */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
              <Gift size={16} className="text-amber-500" /> Next Birthday
            </h3>
            <div className="text-4xl font-black text-slate-900 mb-1">
              {nextBirthday.daysRemaining}
            </div>
            <div className="text-slate-500 font-medium">days remaining</div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="text-sm font-bold text-slate-700">
              Turning {nextBirthday.nextAge} years old
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1">
              {nextBirthday.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Total Statistics */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h3 className="text-slate-500 font-bold uppercase tracking-wider text-sm mb-4 flex items-center gap-2">
            <Hash size={16} className="text-slate-400" /> Total Statistics
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium text-sm">Total Months</span>
              <span className="text-slate-900 font-bold">{total.months.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium text-sm">Total Weeks</span>
              <span className="text-slate-900 font-bold">{total.weeks.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium text-sm">Total Days</span>
              <span className="text-slate-900 font-bold">{total.days.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-slate-500 font-medium text-sm">Total Hours</span>
              <span className="text-slate-900 font-bold">{total.hours.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium text-sm">Total Minutes</span>
              <span className="text-slate-900 font-bold">{total.minutes.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
