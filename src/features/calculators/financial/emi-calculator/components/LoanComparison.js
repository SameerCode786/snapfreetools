import { formatCurrency } from "../utils/currency";
import { safeFormatNumber } from "../utils/validation";

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

  const diffPayment = resultB.monthlyPayment - resultA.monthlyPayment;
  const diffInterest = resultB.totalInterest - resultA.totalInterest;
  const diffTotal = resultB.totalPayment - resultA.totalPayment;
  
  const winner = diffTotal < 0 ? 'B' : (diffTotal > 0 ? 'A' : 'Tie');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">Comparison Results</h3>
        {winner !== 'Tie' && (
          <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            Loan {winner} is cheaper overall
          </span>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-200">
              <th className="py-4 px-6 font-bold text-slate-500 text-xs uppercase tracking-wider w-1/3">Metric</th>
              <th className="py-4 px-6 font-bold text-indigo-700 w-1/3 text-center">Loan A</th>
              <th className="py-4 px-6 font-bold text-purple-700 w-1/3 text-center">Loan B</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-700">Monthly EMI</td>
              <td className={`py-4 px-6 text-center font-medium ${diffPayment > 0 ? 'text-emerald-600 font-bold bg-emerald-50/30' : 'text-slate-700'}`}>
                {formatCurrency(resultA.monthlyPayment, currencyCode)}
              </td>
              <td className={`py-4 px-6 text-center font-medium ${diffPayment < 0 ? 'text-emerald-600 font-bold bg-emerald-50/30' : 'text-slate-700'}`}>
                {formatCurrency(resultB.monthlyPayment, currencyCode)}
                {diffPayment !== 0 && (
                  <span className="block text-xs text-slate-400 mt-1">
                    ({diffPayment > 0 ? '+' : ''}{formatCurrency(diffPayment, currencyCode)})
                  </span>
                )}
              </td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-700">Principal Amount</td>
              <td className="py-4 px-6 text-center text-slate-700">{formatCurrency(resultA.principal, currencyCode)}</td>
              <td className="py-4 px-6 text-center text-slate-700">{formatCurrency(resultB.principal, currencyCode)}</td>
            </tr>
            <tr className="hover:bg-slate-50 transition-colors">
              <td className="py-4 px-6 font-bold text-slate-700">Total Interest</td>
              <td className={`py-4 px-6 text-center font-medium ${diffInterest > 0 ? 'text-emerald-600 font-bold bg-emerald-50/30' : 'text-slate-700'}`}>
                {formatCurrency(resultA.totalInterest, currencyCode)}
              </td>
              <td className={`py-4 px-6 text-center font-medium ${diffInterest < 0 ? 'text-emerald-600 font-bold bg-emerald-50/30' : 'text-slate-700'}`}>
                {formatCurrency(resultB.totalInterest, currencyCode)}
                {diffInterest !== 0 && (
                  <span className="block text-xs text-slate-400 mt-1">
                    ({diffInterest > 0 ? '+' : ''}{formatCurrency(diffInterest, currencyCode)})
                  </span>
                )}
              </td>
            </tr>
            <tr className="bg-slate-50/50 border-t-2 border-slate-200">
              <td className="py-4 px-6 font-black text-slate-800">Total Payable</td>
              <td className={`py-4 px-6 text-center text-lg ${diffTotal > 0 ? 'text-emerald-700 font-black bg-emerald-100/50' : 'text-slate-800 font-bold'}`}>
                {formatCurrency(resultA.totalPayment, currencyCode)}
              </td>
              <td className={`py-4 px-6 text-center text-lg ${diffTotal < 0 ? 'text-emerald-700 font-black bg-emerald-100/50' : 'text-slate-800 font-bold'}`}>
                {formatCurrency(resultB.totalPayment, currencyCode)}
                {diffTotal !== 0 && (
                  <span className="block text-sm text-slate-500 mt-1 font-semibold">
                    ({diffTotal > 0 ? '+' : ''}{formatCurrency(diffTotal, currencyCode)})
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
