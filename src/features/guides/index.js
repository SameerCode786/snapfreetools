"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { 
  BookOpen, ArrowRight, Sparkles, Layers, Scaling, Lock, Unlock, 
  Type, Image as ImageIcon, FileDown, Zap, Sliders, HelpCircle, 
  FileText, ShieldCheck, CheckCircle2, ChevronRight, Compass
} from "lucide-react";

import { GUIDE_CATEGORIES, GUIDES_DATA, POPULAR_GUIDES_QUICK } from "./data/guides";

// Dynamic Icon Renderer Helper
function getGuideIcon(iconName, size = 20, className = "") {
  switch (iconName) {
    case "Scaling": return <Scaling size={size} className={className} />;
    case "Image": return <ImageIcon size={size} className={className} />;
    case "FileDown": return <FileDown size={size} className={className} />;
    case "Lock": return <Lock size={size} className={className} />;
    case "Unlock": return <Unlock size={size} className={className} />;
    case "Maximize": return <Scaling size={size} className={className} />;
    case "Zap": return <Zap size={size} className={className} />;
    case "Sliders": return <Sliders size={size} className={className} />;
    case "Type": return <Type size={size} className={className} />;
    case "HelpCircle": return <HelpCircle size={size} className={className} />;
    default: return <BookOpen size={size} className={className} />;
  }
}

export default function GuidesFeature() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Active category from URL query param e.g. /guides?category=images
  const activeCategory = searchParams.get("category") || "all";

  const handleCategorySelect = (categoryId) => {
    if (categoryId === "all") {
      router.push("/guides", { scroll: false });
    } else {
      router.push(`/guides?category=${categoryId}`, { scroll: false });
    }
  };

  // Filter guides by active category
  const filteredGuides = useMemo(() => {
    if (activeCategory === "all") return GUIDES_DATA;
    return GUIDES_DATA.filter((g) => g.category === activeCategory);
  }, [activeCategory]);

  // Featured guide (first item marked featured)
  const featuredGuide = useMemo(() => {
    return GUIDES_DATA.find((g) => g.featured) || GUIDES_DATA[0];
  }, []);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-16 pb-12 text-center px-4 bg-white border-b border-slate-200/50 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto space-y-4 relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold uppercase tracking-widest select-none">
            <Sparkles size={12} className="text-amber-500" />
            Learn • Create • Optimize
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Guides & <span className="text-amber-500 italic font-serif">Resources</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
            Practical guides to help you work smarter with files, images, PDFs, and everyday digital tasks.
          </p>

          <div className="flex justify-center items-center gap-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none pt-2">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Free Practical Guides
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              In-Browser Tool Workflows
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              100% Privacy-Focused
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">
        
        {/* CATEGORY / FILTER BAR */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Filter by Category
            </h2>
            <span className="text-xs font-bold text-slate-500">
              Showing {filteredGuides.length} {filteredGuides.length === 1 ? "guide" : "guides"}
            </span>
          </div>

          {/* Desktop & Mobile Scrollable Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
            {GUIDE_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-2 ring-slate-900 ring-offset-1"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* FEATURED GUIDE (Shown when on 'all' category or when active matches featured guide) */}
        {activeCategory === "all" && featuredGuide && (
          <section className="space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" />
              Featured Resource
            </span>

            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Visual Area */}
                <div className="lg:col-span-5 bg-gradient-to-br from-amber-50 to-slate-100 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[220px] border border-slate-200/60 relative group-hover:scale-[1.01] transition-transform duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-amber-500 mb-4">
                    {getGuideIcon(featuredGuide.icon, 32)}
                  </div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                    {featuredGuide.categoryLabel}
                  </span>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-7 space-y-4 text-left">
                  <div className="flex items-center gap-3 text-xs font-bold text-slate-400">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                    <span>•</span>
                    <span>{featuredGuide.readingTime}</span>
                    <span>•</span>
                    <span>Updated {featuredGuide.updatedAt}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors leading-tight">
                    {featuredGuide.title}
                  </h3>

                  <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                    {featuredGuide.description}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <Link
                      href={featuredGuide.toolRoute}
                      className="px-6 py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>Try Tool: {featuredGuide.toolName}</span>
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* GUIDE GRID */}
        <section className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">
            {activeCategory === "all" ? "All Practical Guides" : `Guides in ${GUIDE_CATEGORIES.find(c => c.id === activeCategory)?.name}`}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white border border-slate-200/80 hover:border-amber-300/80 rounded-3xl p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  {/* Card Top Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-400 font-bold">
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
                      {guide.categoryLabel}
                    </span>
                    <span>{guide.readingTime}</span>
                  </div>

                  {/* Title & Icon */}
                  <div className="space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 group-hover:text-amber-500 group-hover:bg-amber-50 transition-colors">
                      {getGuideIcon(guide.icon, 20)}
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                      {guide.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                </div>

                {/* Footer CTA Button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-400">
                    Updated {guide.updatedAt}
                  </span>

                  <Link
                    href={guide.toolRoute}
                    className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    <span>Use {guide.toolName}</span>
                    <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* POPULAR GUIDES / QUICK ACCESS */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Compass size={16} className="text-amber-500" />
              Quick Access Popular Topics
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Jump straight to our most popular file optimization and converter tools.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
            {POPULAR_GUIDES_QUICK.map((item, idx) => (
              <Link
                key={idx}
                href={item.route}
                className="bg-slate-50 hover:bg-amber-50 hover:border-amber-200 p-3.5 rounded-2xl border border-slate-200/60 transition-all group text-left flex flex-col justify-between gap-2"
              >
                <div className="font-bold text-xs text-slate-900 group-hover:text-amber-900">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between">
                  <span>{item.desc}</span>
                  <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform text-amber-600" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* TOOLS CONNECTION SECTION ("Learn it. Then do it.") */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-8 relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-2 relative z-10 text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <Zap size={12} className="text-amber-400" />
              Learn It. Then Do It.
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Turn Knowledge Into Action
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Once you know what to do, use our free browser-based tools to compress, resize, protect, or convert files instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            
            <Link
              href="/image-resizer"
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-5 rounded-2xl transition-all group backdrop-blur-md text-left"
            >
              <Scaling size={24} className="text-amber-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-black text-white">Image Resizer</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">Resize JPG, PNG, and WebP images to custom pixels or presets.</p>
            </Link>

            <Link
              href="/unlock-pdf"
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-5 rounded-2xl transition-all group backdrop-blur-md text-left"
            >
              <Unlock size={24} className="text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-black text-white">Unlock PDF</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">Remove PDF passwords and permission restrictions in your browser.</p>
            </Link>

            <Link
              href="/protect-pdf"
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-5 rounded-2xl transition-all group backdrop-blur-md text-left"
            >
              <Lock size={24} className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-black text-white">Protect PDF</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">Encrypt PDF documents with AES-256 password protection.</p>
            </Link>

            <Link
              href="/case-converter"
              className="bg-white/10 hover:bg-white/20 border border-white/15 p-5 rounded-2xl transition-all group backdrop-blur-md text-left"
            >
              <Type size={24} className="text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-sm font-black text-white">Case Converter</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">Convert text between 16 case formats instantly.</p>
            </Link>

          </div>
        </section>

        {/* RESOURCE / NEWSLETTER CTA */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-4 shadow-xs max-w-4xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto">
            <BookOpen size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            More Useful Guides, Less Noise
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-lg mx-auto leading-relaxed">
            Explore practical tips for working with files, images, PDFs, and web documents safely inside your browser.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => handleCategorySelect("all")}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore All Guides</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* FAQ PREVIEW SECTION */}
        <section className="bg-slate-100/60 border border-slate-200/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="space-y-1 text-left">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-500" />
              Have a question about SnapFreeTools?
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Find quick answers to common questions about browser processing, privacy, and file limits.
            </p>
          </div>

          <Link
            href="/faqs"
            className="px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Browse FAQs</span>
            <ArrowRight size={14} />
          </Link>
        </section>

        {/* FINAL CTA SECTION */}
        <section className="text-center space-y-6 pt-4">
          <div className="space-y-2 max-w-xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ready to Get More Done?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Explore SnapFreeTools and turn what you learned into instant action.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/pdf-tools"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore PDF Tools</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/calculators"
              className="w-full sm:w-auto px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-xs rounded-2xl border border-slate-200 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Calculators</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
