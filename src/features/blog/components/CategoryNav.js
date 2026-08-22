import React from "react";
import Link from "next/link";
import { BLOG_CATEGORIES } from "../data/categories";

export default function CategoryNav({ activeCategorySlug }) {
  return (
    <div className="mb-10 sm:mb-12">
      <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x">
        <Link
          href="/blog"
          className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
            !activeCategorySlug
              ? "bg-slate-900 text-white shadow-md"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          All Topics
        </Link>
        
        {BLOG_CATEGORIES.map((category) => {
          const isActive = activeCategorySlug === category.slug;
          return (
            <Link
              key={category.id}
              href={`/blog/category/${category.slug}`}
              className={`flex-shrink-0 snap-start px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                isActive
                  ? "bg-slate-900 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {category.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
