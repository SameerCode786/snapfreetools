import React from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import { getCategoryBySlug } from "../utils/articleHelpers";

export default function ArticleCard({ article }) {
  const category = getCategoryBySlug(article.category);

  return (
    <Link 
      href={`/blog/${article.slug}`}
      className="group flex flex-col bg-white border border-slate-200 hover:border-slate-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all h-full"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold uppercase tracking-wider">
          {category ? category.name : article.category}
        </span>
        <span className="text-slate-400 text-xs font-medium flex items-center gap-1">
          <Clock size={12} /> {article.readingTime}
        </span>
      </div>

      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
        {article.title}
      </h3>

      <p className="text-slate-500 font-medium mb-6 line-clamp-3 flex-grow">
        {article.excerpt}
      </p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div className="text-sm font-medium text-slate-400">
          {new Date(article.publishedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </div>
        <div className="flex items-center gap-1 text-sm font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
          Read Guide <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
