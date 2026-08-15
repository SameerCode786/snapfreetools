import { CURRENCIES } from "../utils/currency";

const InputGroup = ({ label, name, value, onChange, placeholder, prefix, suffix, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-slate-500 font-medium select-none">{prefix}</span>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all ${prefix ? 'pl-8' : ''} ${suffix ? 'pr-16' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3 text-slate-500 font-medium select-none">{suffix}</span>
      )}
    </div>
  </div>
);

export default function EMIInputForm({ 
  mode, 
  data, 
  setData, 
  dataB,
  setDataB,
  currencyCode, 
  setCurrencyCode 
}) {

  const handleChange = (e, targetSetData) => {
    const { name, value } = e.target;
    // Allow empty string, numbers, and decimals
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      targetSetData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (e, targetSetData) => {
    const { name, value } = e.target;
    targetSetData(prev => ({ ...prev, [name]: value }));
  };

  const renderStandardInputs = (dataset, setter, prefixLabel = "") => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputGroup 
          label={`${prefixLabel} Loan Amount`}
          name="amount"
          value={dataset.amount}
          onChange={(e) => handleChange(e, setter)}
          placeholder="e.g. 100000"
        />
        <InputGroup 
          label={`${prefixLabel} Interest Rate`}
          name="rate"
          value={dataset.rate}
          onChange={(e) => handleChange(e, setter)}
          placeholder="e.g. 7.5"
          suffix="% per yr"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-700">{prefixLabel} Loan Tenure</label>
          <div className="flex rounded-xl overflow-hidden border border-slate-200">
            <input
              type="text"
              name="tenure"
              value={dataset.tenure}
              onChange={(e) => handleChange(e, setter)}
              placeholder="e.g. 5"
              className="w-full bg-slate-50 px-4 py-3 text-slate-800 font-medium focus:outline-none focus:bg-white flex-1"
            />
            <select
              name="tenureUnit"
              value={dataset.tenureUnit}
              onChange={(e) => handleSelectChange(e, setter)}
              className="bg-slate-100 border-l border-slate-200 px-3 py-3 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="years">Years</option>
              <option value="months">Months</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-700">{prefixLabel} Payment Frequency</label>
          <select
            name="frequency"
            value={dataset.frequency}
            onChange={(e) => handleSelectChange(e, setter)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="half-yearly">Half-Yearly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Loan Details
        </h2>
        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase">Currency</label>
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="p-6">
        {(mode === 'standard' || mode === 'prepayment') && renderStandardInputs(data, setData)}
        
        {mode === 'affordability' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup 
                label="Monthly Income"
                name="income"
                value={data.income}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 5000"
              />
              <InputGroup 
                label="Existing Monthly Debt"
                name="debt"
                value={data.debt}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <InputGroup 
                label="Interest Rate"
                name="rate"
                value={data.rate}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 7.5"
                suffix="% per yr"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Loan Tenure</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  <input
                    type="text"
                    name="tenure"
                    value={data.tenure}
                    onChange={(e) => handleChange(e, setData)}
                    placeholder="e.g. 5"
                    className="w-full bg-slate-50 px-4 py-3 text-slate-800 font-medium focus:outline-none focus:bg-white flex-1"
                  />
                  <select
                    name="tenureUnit"
                    value={data.tenureUnit}
                    onChange={(e) => handleSelectChange(e, setData)}
                    className="bg-slate-100 border-l border-slate-200 px-3 py-3 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <InputGroup 
                label="Max DTI Ratio"
                name="dti"
                value={data.dti}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 40"
                suffix="%"
              />
            </div>
          </div>
        )}
        
        {mode === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div>
              <h3 className="text-sm font-bold text-indigo-600 mb-4 bg-indigo-50 inline-block px-3 py-1 rounded-full">Loan Option A</h3>
              {renderStandardInputs(data, setData)}
            </div>
            <div className="pt-8 lg:pt-0 lg:pl-8">
              <h3 className="text-sm font-bold text-purple-600 mb-4 bg-purple-50 inline-block px-3 py-1 rounded-full">Loan Option B</h3>
              {renderStandardInputs(dataB, setDataB)}
            </div>
          </div>
        )}
        
        {mode === 'reverse' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup 
                label="Target EMI"
                name="targetEmi"
                value={data.targetEmi}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 1000"
              />
              <InputGroup 
                label="Interest Rate"
                name="rate"
                value={data.rate}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 7.5"
                suffix="% per yr"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Loan Tenure</label>
                <div className="flex rounded-xl overflow-hidden border border-slate-200">
                  <input
                    type="text"
                    name="tenure"
                    value={data.tenure}
                    onChange={(e) => handleChange(e, setData)}
                    placeholder="e.g. 5"
                    className="w-full bg-slate-50 px-4 py-3 text-slate-800 font-medium focus:outline-none focus:bg-white flex-1"
                  />
                  <select
                    name="tenureUnit"
                    value={data.tenureUnit}
                    onChange={(e) => handleSelectChange(e, setData)}
                    className="bg-slate-100 border-l border-slate-200 px-3 py-3 text-slate-700 font-semibold focus:outline-none cursor-pointer"
                  >
                    <option value="years">Years</option>
                    <option value="months">Months</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Payment Frequency</label>
                <select
                  name="frequency"
                  value={data.frequency}
                  onChange={(e) => handleSelectChange(e, setData)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {mode === 'required' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup 
                label="Target Loan Amount"
                name="amount"
                value={data.amount}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 100000"
              />
              <InputGroup 
                label="Max Affordable EMI"
                name="maxEmi"
                value={data.maxEmi}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 1500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputGroup 
                label="Interest Rate"
                name="rate"
                value={data.rate}
                onChange={(e) => handleChange(e, setData)}
                placeholder="e.g. 7.5"
                suffix="% per yr"
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-bold text-slate-700">Payment Frequency</label>
                <select
                  name="frequency"
                  value={data.frequency}
                  onChange={(e) => handleSelectChange(e, setData)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="half-yearly">Half-Yearly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
