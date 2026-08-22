import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getAllArticles } from "../utils/articleHelpers";

export default function ArticleNavigation({ currentSlug }) {
  const allArticles = getAllArticles();
  const currentIndex = allArticles.findIndex(a => a.slug === currentSlug);

  if (currentIndex === -1) return null;

  const previousArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;

  if (!previousArticle && !nextArticle) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 border-t border-b border-slate-100 my-12">
      {previousArticle ? (
        <Link 
          href={`/blog/${previousArticle.slug}`}
          className="group flex flex-col w-full sm:w-1/2 p-4 rounded-2xl hover:bg-slate-50 transition-colors text-left"
        >
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Previous Article
          </span>
          <span className="text-slate-900 font-bold group-hover:text-amber-600 transition-colors line-clamp-2">
            {previousArticle.title}
          </span>
        </Link>
      ) : (
        <div className="w-full sm:w-1/2"></div>
      )}

      {previousArticle && nextArticle && (
        <div className="hidden sm:block w-px h-16 bg-slate-100 mx-4"></div>
      )}

      {nextArticle ? (
        <Link 
          href={`/blog/${nextArticle.slug}`}
          className="group flex flex-col w-full sm:w-1/2 p-4 rounded-2xl hover:bg-slate-50 transition-colors sm:text-right"
        >
          <span className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-2 flex items-center sm:justify-end gap-1">
            Next Article <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-slate-900 font-bold group-hover:text-amber-600 transition-colors line-clamp-2">
            {nextArticle.title}
          </span>
        </Link>
      ) : (
        <div className="w-full sm:w-1/2"></div>
      )}
    </div>
  );
}
