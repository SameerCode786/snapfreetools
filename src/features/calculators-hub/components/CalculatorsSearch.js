import { Search, X } from "lucide-react";

export default function CalculatorsSearch({ searchQuery, setSearchQuery }) {
  return (
    <div className="max-w-xl mx-auto relative pt-4">
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={20} />
        
        <input
          type="text"
          placeholder="Search calculators (e.g. Loan, Math, GPA...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 rounded-2xl pl-12 pr-12 py-4 text-base font-medium focus:outline-none transition-all shadow-sm"
          aria-label="Search calculators"
        />
        
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"
            aria-label="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
