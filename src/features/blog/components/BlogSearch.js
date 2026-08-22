"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

export default function BlogSearch({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Debounce the search input
    const timer = setTimeout(() => {
      if (onSearch) {
        onSearch(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search size={20} className="text-slate-400 group-focus-within:text-amber-500 transition-colors" />
      </div>
      <input
        type="text"
        className="w-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-300 text-base sm:text-lg rounded-2xl focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 block w-full pl-12 pr-12 py-4 shadow-lg transition-all"
        placeholder="Search articles, guides, or topics..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-white transition-colors focus:outline-none"
          aria-label="Clear search"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
