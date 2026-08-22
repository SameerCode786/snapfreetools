export default function CategoryNav({ categories, selectedCategory, setSelectedCategory }) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 pb-4 overflow-x-auto no-scrollbar mask-fade-right">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
              isSelected 
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/15 border-transparent" 
                : "bg-white text-slate-600 hover:text-amber-500 border border-slate-200 hover:border-amber-200 hover:bg-amber-50/50"
            }`}
            aria-pressed={isSelected}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
