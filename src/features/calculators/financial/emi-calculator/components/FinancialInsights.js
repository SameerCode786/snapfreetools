export default function FinancialInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-slate-50">
        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Financial Insights</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl border ${
                insight.type === 'warning' ? 'bg-orange-50 border-orange-100' :
                insight.type === 'success' ? 'bg-emerald-50 border-emerald-100' :
                insight.type === 'error' ? 'bg-red-50 border-red-100' :
                'bg-blue-50 border-blue-100'
              }`}
            >
              <h4 className={`text-sm font-bold mb-1 ${
                insight.type === 'warning' ? 'text-orange-800' :
                insight.type === 'success' ? 'text-emerald-800' :
                insight.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {insight.title}
              </h4>
              <p className={`text-sm ${
                insight.type === 'warning' ? 'text-orange-700' :
                insight.type === 'success' ? 'text-emerald-700' :
                insight.type === 'error' ? 'text-red-700' :
                'text-blue-700'
              }`}>
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
