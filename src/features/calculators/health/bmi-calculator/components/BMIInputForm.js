import React from 'react';

const InputField = ({ id, label, value, onChange, suffix, placeholder, type = "text", inputMode = "decimal", min }) => (
  <div className="flex-1 min-w-[140px]">
    <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        type={type}
        inputMode={inputMode}
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        min={min}
        className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 block p-4 transition-all ${suffix ? 'pr-14' : ''}`}
      />
      {suffix && (
        <div className="absolute right-4 text-slate-400 font-medium text-sm pointer-events-none">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

const GenderButton = ({ value, label, selected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(value)}
    aria-pressed={selected}
    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
      selected
        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
    }`}
  >
    {label}
  </button>
);

export default function BMIInputForm({ unit, data, handleChange }) {
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 mb-8 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-40 -mr-14 -mt-14 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Height */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Height</div>
          {unit === 'metric' ? (
            <div className="flex gap-4 flex-wrap">
              <InputField
                id="heightCm"
                label="Height"
                value={data.heightCm}
                onChange={handleChange}
                suffix="cm"
                placeholder="175"
              />
            </div>
          ) : (
            <div className="flex gap-4 flex-wrap">
              <InputField
                id="heightFt"
                label="Feet"
                value={data.heightFt}
                onChange={handleChange}
                suffix="ft"
                placeholder="5"
                inputMode="numeric"
              />
              <InputField
                id="heightIn"
                label="Inches"
                value={data.heightIn}
                onChange={handleChange}
                suffix="in"
                placeholder="9"
                inputMode="decimal"
              />
            </div>
          )}
        </div>

        {/* Weight */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Weight</div>
          <div className="flex gap-4 flex-wrap">
            <InputField
              id={unit === 'metric' ? 'weightKg' : 'weightLb'}
              label="Weight"
              value={unit === 'metric' ? data.weightKg : data.weightLb}
              onChange={handleChange}
              suffix={unit === 'metric' ? 'kg' : 'lb'}
              placeholder={unit === 'metric' ? '70' : '154'}
            />
          </div>
        </div>

        {/* Age + Gender row */}
        <div className="flex flex-wrap gap-6">
          <div className="flex-1 min-w-[140px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Age <span className="normal-case font-normal">(optional)</span></div>
            <InputField
              id="age"
              label="Age"
              value={data.age}
              onChange={handleChange}
              suffix="yrs"
              placeholder="25"
              inputMode="numeric"
            />
          </div>
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Gender <span className="normal-case font-normal">(optional)</span></div>
            <div className="flex gap-3 mt-2">
              <GenderButton value="male" label="Male" selected={data.gender === 'male'} onSelect={(v) => handleChange('gender', v === data.gender ? '' : v)} />
              <GenderButton value="female" label="Female" selected={data.gender === 'female'} onSelect={(v) => handleChange('gender', v === data.gender ? '' : v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
