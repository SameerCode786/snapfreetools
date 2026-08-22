import React from 'react';
import { DollarSign, Percent, Users } from 'lucide-react';
import QuickDiscountButtons from './QuickDiscountButtons';

const InputField = ({ id, label, value, onChange, prefix, suffix, placeholder, type = "text", inputMode = "decimal" }) => (
  <div className="flex-1 min-w-[200px]">
    <label htmlFor={id} className="block text-sm font-bold text-slate-700 mb-2">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <div className="absolute left-4 text-slate-400">
          {prefix}
        </div>
      )}
      <input
        type={type}
        inputMode={inputMode}
        id={id}
        value={value}
        onChange={(e) => onChange(id, e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border border-slate-200 text-slate-900 text-lg rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 block p-4 transition-all ${prefix ? 'pl-11' : ''} ${suffix ? 'pr-11' : ''}`}
      />
      {suffix && (
        <div className="absolute right-4 text-slate-400">
          {suffix}
        </div>
      )}
    </div>
  </div>
);

export default function DiscountInputForm({ mode, data, handleChange }) {
  const showQuickSelect = ['basic', 'findOriginal', 'tax'].includes(mode);

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 mb-8 border border-slate-200 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full blur-3xl opacity-50 -mr-10 -mt-10 pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-wrap items-end gap-6">
        
        {mode === 'basic' && (
          <>
            <InputField id="original" label="Original Price" value={data.original} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
            <InputField id="discount" label="Discount" value={data.discount} onChange={handleChange} suffix={<Percent size={20} />} placeholder="20" />
          </>
        )}

        {mode === 'reverse' && (
          <>
            <InputField id="original" label="Original Price" value={data.original} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
            <InputField id="sale" label="Sale Price" value={data.sale} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="80" />
          </>
        )}

        {mode === 'findOriginal' && (
          <>
            <InputField id="sale" label="Sale Price" value={data.sale} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="80" />
            <InputField id="discount" label="Discount" value={data.discount} onChange={handleChange} suffix={<Percent size={20} />} placeholder="20" />
          </>
        )}

        {mode === 'stacked' && (
          <>
            <div className="w-full flex flex-wrap gap-6 mb-2">
              <InputField id="original" label="Original Price" value={data.original} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
            </div>
            <InputField id="d1" label="Discount 1" value={data.d1} onChange={handleChange} suffix={<Percent size={20} />} placeholder="20" />
            <InputField id="d2" label="Discount 2" value={data.d2} onChange={handleChange} suffix={<Percent size={20} />} placeholder="10" />
            <InputField id="d3" label="Discount 3 (Optional)" value={data.d3} onChange={handleChange} suffix={<Percent size={20} />} placeholder="5" />
          </>
        )}

        {mode === 'tax' && (
          <>
            <InputField id="original" label="Original Price" value={data.original} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
            <InputField id="discount" label="Discount" value={data.discount} onChange={handleChange} suffix={<Percent size={20} />} placeholder="20" />
            <InputField id="tax" label="Tax Rate" value={data.tax} onChange={handleChange} suffix={<Percent size={20} />} placeholder="8.5" />
          </>
        )}

        {mode === 'tip' && (
          <>
            <InputField id="bill" label="Bill Amount" value={data.bill} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
            <InputField id="discount" label="Discount" value={data.discount} onChange={handleChange} suffix={<Percent size={20} />} placeholder="10" />
            <InputField id="tip" label="Tip Rate" value={data.tip} onChange={handleChange} suffix={<Percent size={20} />} placeholder="15" />
            <InputField id="people" label="People" value={data.people} onChange={handleChange} prefix={<Users size={20} />} placeholder="1" inputMode="numeric" />
          </>
        )}

        {mode === 'compare' && (
          <>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-100 pb-8">
              <div className="space-y-6">
                <div className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 border-b border-amber-100 pb-2">Option A</div>
                <InputField id="priceA" label="Original Price" value={data.priceA} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="120" />
                <InputField id="discountA" label="Discount" value={data.discountA} onChange={handleChange} suffix={<Percent size={20} />} placeholder="30" />
              </div>
              <div className="space-y-6">
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-4 border-b border-emerald-100 pb-2">Option B</div>
                <InputField id="priceB" label="Original Price" value={data.priceB} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="100" />
                <InputField id="discountB" label="Discount" value={data.discountB} onChange={handleChange} suffix={<Percent size={20} />} placeholder="15" />
              </div>
            </div>
          </>
        )}

        {mode === 'target' && (
          <>
            <InputField id="original" label="Original Price" value={data.original} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="120" />
            <InputField id="target" label="Desired Final Price" value={data.target} onChange={handleChange} prefix={<DollarSign size={20} />} placeholder="90" />
          </>
        )}
      </div>

      {showQuickSelect && (
        <QuickDiscountButtons 
          onSelect={(val) => {
            if (mode === 'stacked') {
               handleChange('d1', val);
            } else {
               handleChange('discount', val);
            }
          }} 
        />
      )}
    </div>
  );
}
