import { CURRENCIES } from "../utils/currency";

export default function LoanInputForm({ currentMode, data, updateData, validation }) {
  
  const renderInput = (label, id, placeholder, type = "number", min = "0") => {
    const hasError = validation?.errors?.[id];
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
        <input
          type={type}
          min={min}
          step="any"
          value={data[id] !== undefined ? data[id] : ""}
          onChange={(e) => updateData(id, e.target.value)}
          placeholder={placeholder}
          className={`w-full h-11 px-4 rounded-lg focus:ring-indigo-500 transition-colors shadow-sm ${
            hasError 
              ? "border-red-300 focus:border-red-500 bg-red-50" 
              : "border-slate-300 focus:border-indigo-500"
          }`}
        />
        {hasError && <p className="mt-1.5 text-xs font-medium text-red-600">{hasError}</p>}
      </div>
    );
  };

  const renderSelect = (label, id, options) => (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">{label}</label>
      <select
        value={data[id] || ""}
        onChange={(e) => updateData(id, e.target.value)}
        className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm bg-white"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-slate-800">
          {currentMode === 'standard' && "Loan Details"}
          {currentMode === 'affordability' && "Affordability Details"}
          {currentMode === 'reverse' && "Reverse Loan Search"}
          {currentMode === 'extra' && "Extra Payment Details"}
        </h2>
        <div>
          <select 
            value={data.currencyCode || "USD"}
            onChange={(e) => updateData("currencyCode", e.target.value)}
            className="h-8 px-3 rounded-md border-slate-300 text-sm font-medium focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {currentMode === 'standard' && (
          <>
            {renderInput("Loan Amount", "amount", "e.g., 100000")}
            {renderInput("Interest Rate (%)", "interest", "e.g., 5.0")}
            {renderInput("Loan Term", "term", "e.g., 30")}
            {renderSelect("Term Unit", "termUnit", [
              { value: "years", label: "Years" },
              { value: "months", label: "Months" }
            ])}
            {renderSelect("Payment Frequency", "frequency", [
              { value: "monthly", label: "Monthly" },
              { value: "biweekly", label: "Biweekly" },
              { value: "weekly", label: "Weekly" }
            ])}
          </>
        )}

        {currentMode === 'affordability' && (
          <>
            {renderInput("Monthly Income (Gross)", "income", "e.g., 6000")}
            {renderInput("Existing Monthly Debt", "expenses", "e.g., 500")}
            {renderInput("Desired Loan Term (Months)", "term", "e.g., 360")}
            {renderInput("Interest Rate (%)", "interest", "e.g., 5.0")}
            {renderInput("Max Target DTI (%)", "desiredDti", "e.g., 36")}
          </>
        )}

        {currentMode === 'reverse' && (
          <>
            {renderInput("Desired Monthly Payment", "payment", "e.g., 1000")}
            {renderInput("Interest Rate (%)", "interest", "e.g., 5.0")}
            {renderInput("Loan Term (Months)", "term", "e.g., 360")}
          </>
        )}

        {currentMode === 'extra' && (
          <>
            {renderInput("Current Loan Balance", "amount", "e.g., 50000")}
            {renderInput("Interest Rate (%)", "interest", "e.g., 5.0")}
            {renderInput("Remaining Term (Months)", "term", "e.g., 120")}
            {renderInput("Extra Monthly Payment", "extraPayment", "e.g., 100")}
          </>
        )}
      </div>
    </div>
  );
}
