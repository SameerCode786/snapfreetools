import { formatCurrency } from "../utils/currency";

export default function LoanComparison({ resultA, resultB, currencyCode }) {
  if (!resultA || !resultB || resultA.isEmpty || resultB.isEmpty) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Loan Comparison</h3>
        <p className="text-sm text-slate-500 max-w-sm">Enter details for both Loan A and Loan B above to compare their monthly payments, total interest, and overall cost.</p>
      </div>
    );
  }

  const diffPayment = resultB.regularPayment - resultA.regularPayment;
  const diffInterest = resultB.totalInterest - resultA.totalInterest;
  const diffTotal = resultB.totalAmountPaid - resultA.totalAmountPaid;

  const renderRow = (label, valA, valB, isDiff = false) => {
    let diffClass = "text-slate-700";
    if (isDiff) {
      if (valB < valA) diffClass = "text-green-600";
      else if (valB > valA) diffClass = "text-red-500";
    }

    return (
      <tr className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
        <td className="px-4 py-3 text-sm font-semibold text-slate-600 w-1/3">{label}</td>
        <td className="px-4 py-3 text-sm font-bold text-slate-800 text-center">{formatCurrency(valA, currencyCode)}</td>
        <td className={`px-4 py-3 text-sm font-bold text-center ${isDiff ? diffClass : 'text-slate-800'}`}>
          {formatCurrency(valB, currencyCode)}
        </td>
      </tr>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-800">Comparison Result</h3>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <table className="w-full text-left min-w-[500px]">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Metric</th>
              <th className="px-4 py-3 text-center">Loan A</th>
              <th className="px-4 py-3 text-center rounded-tr-lg">Loan B</th>
            </tr>
          </thead>
          <tbody>
            {renderRow("Loan Amount", resultA.principal, resultB.principal)}
            {renderRow("Monthly Payment", resultA.regularPayment, resultB.regularPayment)}
            {renderRow("Total Interest", resultA.totalInterest, resultB.totalInterest)}
            {renderRow("Total Amount Paid", resultA.totalAmountPaid, resultB.totalAmountPaid)}
          </tbody>
        </table>
        
        <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm text-center">
          <p className="font-semibold text-slate-700 mb-2">Comparison Summary</p>
          <p className="text-slate-600">
            Loan B's monthly payment is <strong className={diffPayment > 0 ? "text-red-500" : "text-green-600"}>{formatCurrency(Math.abs(diffPayment), currencyCode)}</strong> {diffPayment > 0 ? 'higher' : 'lower'} than Loan A's.
          </p>
          <p className="text-slate-600 mt-1">
            Overall, Loan B will cost <strong className={diffTotal > 0 ? "text-red-500" : "text-green-600"}>{formatCurrency(Math.abs(diffTotal), currencyCode)}</strong> {diffTotal > 0 ? 'more' : 'less'} in total than Loan A.
          </p>
        </div>
      </div>
    </div>
  );
}
