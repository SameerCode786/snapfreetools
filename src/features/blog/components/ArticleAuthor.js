import React from "react";
import { AUTHOR_PROFILES } from "../data/articles";
import { PenTool } from "lucide-react";

export default function ArticleAuthor({ authorKey }) {
  const authorInfo = AUTHOR_PROFILES[authorKey];

  if (!authorInfo) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 mt-16 mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
      <div className="w-20 h-20 bg-white border border-slate-200 text-slate-400 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
        <PenTool size={32} />
      </div>
      <div>
        <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Written By</div>
        <h3 className="text-xl font-bold text-slate-900 mb-1">{authorInfo.name}</h3>
        <p className="text-sm font-medium text-amber-600 mb-4">{authorInfo.role}</p>
        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl">
          {authorInfo.bio}
        </p>
      </div>
    </div>
  );
}
