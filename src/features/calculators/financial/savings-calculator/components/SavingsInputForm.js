import React from "react";
import { Icons } from "@/lib/lucide-icons";
import { CURRENCIES } from "@/features/calculators/financial/emi-calculator/utils/currency";

const FormSection = ({ title, icon, children, controls }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
    <div className="bg-slate-50/50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        {icon && <div className="text-indigo-500">{icon}</div>}
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      {controls && <div className="shrink-0">{controls}</div>}
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

export default function SavingsInputForm({ 
  mode, 
  data, setData, 
  dataB, setDataB, 
  currencyCode, setCurrencyCode 
}) {

  const handleChange = (e, isB = false) => {
    const { name, value } = e.target;
    // Allow empty string, or digits and optional one decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      if (isB) {
        setDataB({ ...dataB, [name]: value });
      } else {
        setData({ ...data, [name]: value });
      }
    }
  };

  const renderCurrencySelector = () => (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Currency</span>
      <select 
        value={currencyCode}
        onChange={(e) => setCurrencyCode(e.target.value)}
        className="bg-slate-50 border-none text-sm font-semibold text-slate-700 py-1.5 px-3 rounded-lg focus:ring-2 focus:ring-indigo-100 outline-none cursor-pointer"
      >
        {CURRENCIES.map(c => (
          <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
        ))}
      </select>
    </div>
  );

  const renderInput = (label, name, value, isB = false, type = 'number', addon = null, min = "0", step = "any") => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center justify-between">
        {label}
      </label>
      <div className="relative flex items-center">
        {addon && type === 'currency' && (
          <div className="absolute left-4 text-slate-400 font-semibold pointer-events-none">
            {CURRENCIES.find(c => c.code === currencyCode)?.symbol || '$'}
          </div>
        )}
        <input 
          type="text" 
          inputMode="decimal"
          name={name}
          value={value}
          onChange={(e) => handleChange(e, isB)}
          placeholder="0"
          className={`w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all py-3.5 ${type === 'currency' ? 'pl-8' : 'pl-4'} pr-12`}
        />
        {addon && type !== 'currency' && (
          <div className="absolute right-4 text-slate-400 font-bold pointer-events-none">
            {addon}
          </div>
        )}
      </div>
    </div>
  );

  const renderSelect = (label, name, value, options, isB = false) => (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <div className="relative">
        <select 
          name={name}
          value={value}
          onChange={(e) => isB ? setDataB({...dataB, [name]: e.target.value}) : setData({...data, [name]: e.target.value})}
          className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all py-3.5 pl-4 pr-10 appearance-none cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
          <Icons.ChevronDown size={16} />
        </div>
      </div>
    </div>
  );

  const freqOptions = [
    { value: 'annually', label: 'Annually' },
    { value: 'semi-annually', label: 'Semi-Annually' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'daily', label: 'Daily' },
  ];

  // Common fields
  const principalField = (isB = false) => renderInput("Initial Savings", "principal", isB ? dataB.principal : data.principal, isB, 'currency', true);
  const contributionField = (isB = false) => renderInput("Monthly Contribution", "monthlyContribution", isB ? dataB.monthlyContribution : data.monthlyContribution, isB, 'currency', true);
  const returnField = (isB = false) => renderInput("Annual Interest Rate", "annualRate", isB ? dataB.annualRate : data.annualRate, isB, 'percentage', '%');
  const yearsField = (isB = false) => renderInput("Savings Period", "years", isB ? dataB.years : data.years, isB, 'number', 'Years');
  const freqField = (isB = false) => renderSelect("Compounding Frequency", "frequency", isB ? dataB.frequency : data.frequency, freqOptions, isB);
  
  // Specific fields
  const targetAmountField = () => renderInput("Target Goal Amount", "targetAmount", data.targetAmount, false, 'currency', true);
  const monthlyExpensesField = () => renderInput("Monthly Expenses", "monthlyExpenses", data.monthlyExpenses, false, 'currency', true);
  const targetMonthsField = () => renderSelect("Target Months", "targetMonths", data.targetMonths, [
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '9', label: '9 Months' },
    { value: '12', label: '12 Months' }
  ]);

  if (mode === 'comparison') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FormSection title="Savings Scenario A" icon={<Icons.TrendingUp size={20} />} controls={renderCurrencySelector()}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principalField(false)}
            {contributionField(false)}
            {returnField(false)}
            {yearsField(false)}
          </div>
        </FormSection>
        
        <FormSection title="Savings Scenario B" icon={<Icons.ArrowRightLeft size={20} />}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {principalField(true)}
            {contributionField(true)}
            {returnField(true)}
            {yearsField(true)}
          </div>
        </FormSection>
      </div>
    );
  }

  return (
    <FormSection 
      title="Savings Details" 
      icon={<Icons.Calculator size={20} />} 
      controls={renderCurrencySelector()}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mode === 'growth' && (
          <>
            {principalField()}
            {contributionField()}
            {returnField()}
            {yearsField()}
          </>
        )}
        
        {mode === 'goal' && (
          <>
            {principalField()}
            {targetAmountField()}
            {contributionField()}
            {returnField()}
          </>
        )}
        
        {mode === 'required' && (
          <>
            {principalField()}
            {targetAmountField()}
            {returnField()}
            {yearsField()}
          </>
        )}
        
        {mode === 'compound' && (
          <>
            {principalField()}
            {contributionField()}
            {returnField()}
            {freqField()}
            {yearsField()}
          </>
        )}

        {mode === 'emergency' && (
          <>
            {monthlyExpensesField()}
            {principalField()}
            {targetMonthsField()}
          </>
        )}
      </div>
    </FormSection>
  );
}
