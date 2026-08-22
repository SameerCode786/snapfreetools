import React from 'react';
import QuickPercentageButtons from './QuickPercentageButtons';
import { ArrowLeftRight } from 'lucide-react';

const InputField = ({ id, label, value, prefix, suffix, placeholder, onChange }) => (
  <div className="flex flex-col flex-1 min-w-[150px] sm:min-w-[200px]">
    <label htmlFor={id} className="text-sm font-bold text-slate-700 mb-2">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-4 text-slate-400 font-bold">{prefix}</span>
      )}
      <input
        id={id}
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder || "0.00"}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-shadow ${prefix ? 'pl-8' : 'pl-4'} ${suffix ? 'pr-10' : 'pr-4'}`}
      />
      {suffix && (
        <span className="absolute right-4 text-slate-400 font-bold">{suffix}</span>
      )}
    </div>
  </div>
);

const SwapButton = ({ onSwap }) => (
  <button 
    onClick={(e) => { e.preventDefault(); onSwap(); }}
    className="hidden md:flex mt-6 w-10 h-10 rounded-full bg-slate-100 border border-slate-200 items-center justify-center text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors shrink-0"
    title="Swap values"
  >
    <ArrowLeftRight size={18} />
  </button>
);

export default function PercentageInputForm({ mode, data, handleChange, onSwap }) {

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 mb-8 border border-slate-200 shadow-sm">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="flex flex-col md:flex-row gap-6 md:items-center">
          
          {mode === 'percentageOf' && (
            <>
              <InputField id="percentage" label="Percentage" value={data.percentage} suffix="%" onChange={handleChange} />
              <SwapButton onSwap={onSwap} />
              <InputField id="number" label="Of Number" value={data.number} onChange={handleChange} />
            </>
          )}

          {mode === 'whatPercent' && (
            <>
              <InputField id="part" label="What % is" value={data.part} onChange={handleChange} />
              <SwapButton onSwap={onSwap} />
              <InputField id="whole" label="Of" value={data.whole} onChange={handleChange} />
            </>
          )}

          {(mode === 'increase' || mode === 'decrease' || mode === 'change') && (
            <>
              <InputField id="original" label="Original Value" value={data.original} onChange={handleChange} />
              <SwapButton onSwap={onSwap} />
              <InputField id="newNumber" label="New Value" value={data.newNumber} onChange={handleChange} />
            </>
          )}

          {mode === 'difference' && (
            <>
              <InputField id="valA" label="Value A" value={data.valA} onChange={handleChange} />
              <SwapButton onSwap={onSwap} />
              <InputField id="valB" label="Value B" value={data.valB} onChange={handleChange} />
            </>
          )}

          {mode === 'reverse' && (
            <>
              <InputField id="percentage" label="Percentage" value={data.percentage} suffix="%" onChange={handleChange} />
              <div className="text-slate-400 font-bold text-center mt-6 hidden md:block">of original is</div>
              <InputField id="amount" label="Amount" value={data.amount} onChange={handleChange} />
            </>
          )}

          {mode === 'discount' && (
            <>
              <InputField id="price" label="Original Price" value={data.price} prefix="$" onChange={handleChange} />
              <InputField id="discountPercent" label="Discount" value={data.discountPercent} suffix="%" onChange={handleChange} />
            </>
          )}

          {mode === 'tax' && (
            <>
              <InputField id="price" label="Base Price" value={data.price} prefix="$" onChange={handleChange} />
              <InputField id="taxPercent" label="Tax Rate" value={data.taxPercent} suffix="%" onChange={handleChange} />
            </>
          )}

          {mode === 'tip' && (
            <>
              <InputField id="bill" label="Bill Amount" value={data.bill} prefix="$" onChange={handleChange} />
              <InputField id="tipPercent" label="Tip" value={data.tipPercent} suffix="%" onChange={handleChange} />
              <InputField id="people" label="Split Between" value={data.people} placeholder="1" onChange={handleChange} />
            </>
          )}

          {mode === 'points' && (
            <>
              <InputField id="start" label="Starting Percentage" value={data.start} suffix="%" onChange={handleChange} />
              <SwapButton onSwap={onSwap} />
              <InputField id="end" label="Ending Percentage" value={data.end} suffix="%" onChange={handleChange} />
            </>
          )}

        </div>

        {['percentageOf', 'reverse', 'discount', 'tax', 'tip'].includes(mode) && (
          <QuickPercentageButtons 
            mode={mode} 
            onSelect={(val) => {
              if (mode === 'percentageOf' || mode === 'reverse') handleChange('percentage', val);
              if (mode === 'discount') handleChange('discountPercent', val);
              if (mode === 'tax') handleChange('taxPercent', val);
              if (mode === 'tip') handleChange('tipPercent', val);
            }} 
          />
        )}
      </form>
    </div>
  );
}
