import React from "react";

export default function CalculatorInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  min,
  max,
  step,
  required = false,
  className = ""
}) {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        required={required}
        className="w-full min-w-0 bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-3 outline-none font-semibold transition-all hover:bg-slate-100"
      />
    </div>
  );
}
