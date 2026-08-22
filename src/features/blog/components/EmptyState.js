import React from "react";
import { FileQuestion } from "lucide-react";

export default function EmptyState({ message = "No articles found." }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 mb-6 shadow-sm">
        <FileQuestion size={32} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">We couldn't find anything</h3>
      <p className="text-slate-500 font-medium max-w-md">
        {message} Try adjusting your search term or browsing a different category.
      </p>
    </div>
  );
}
