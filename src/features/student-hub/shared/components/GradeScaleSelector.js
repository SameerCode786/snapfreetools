import { GRADE_SCALES } from "../constants/gradeScales";

export default function GradeScaleSelector({ 
  value, 
  onChange, 
  className = "" 
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Select Grading Scale
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:bg-white focus:border-amber-400 focus:outline-none transition-all appearance-none cursor-pointer"
        >
          {Object.keys(GRADE_SCALES).map((key) => (
            <option key={key} value={key} className="font-semibold text-slate-700">
              {GRADE_SCALES[key].name} ({GRADE_SCALES[key].description})
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
