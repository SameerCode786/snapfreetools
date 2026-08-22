import React from "react";
import BlogSearch from "./BlogSearch";

export default function BlogHero({ onSearch }) {
  return (
    <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden mb-12 sm:mb-16">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[100%] rounded-full bg-amber-500/10 blur-[100px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[80%] rounded-full bg-blue-500/10 blur-[100px]"></div>
      </div>

      <div className="relative z-10 px-6 py-16 sm:py-20 md:py-24 max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-sm tracking-wide mb-6 border border-amber-500/20">
          The Hub
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
          SnapFreeTools Blog
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
          Practical guides, financial insights, calculator tips, and educational resources to help you make smarter everyday decisions.
        </p>
        
        <div className="max-w-2xl mx-auto">
          <BlogSearch onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}
