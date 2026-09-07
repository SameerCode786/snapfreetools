"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, ChevronDown, Sparkles, HelpCircle, CheckCircle2, 
  ArrowRight, ShieldCheck, FileText, Image as ImageIcon, Scaling, 
  Lock, Type, Wrench, RefreshCw, X, BookOpen, ExternalLink, Zap
} from "lucide-react";

import { FAQ_CATEGORIES, FAQS_DATA, POPULAR_FAQS } from "./data/faqs";

// Helper function to render Category/Tool Icon
function getCategoryIcon(catId, size = 18, className = "") {
  switch (catId) {
    case "general": return <HelpCircle size={size} className={className} />;
    case "privacy": return <ShieldCheck size={size} className={className} />;
    case "pdf": return <FileText size={size} className={className} />;
    case "images": return <ImageIcon size={size} className={className} />;
    case "converters": return <Type size={size} className={className} />;
    case "troubleshooting": return <Wrench size={size} className={className} />;
    default: return <Sparkles size={size} className={className} />;
  }
}

// Highlight matching text helper
function HighlightText({ text, query }) {
  if (!query || !query.trim()) return <span>{text}</span>;
  
  const trimmed = query.trim();
  const regex = new RegExp(`(${trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <mark key={index} className="bg-amber-200/80 text-slate-900 rounded px-0.5 font-bold">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
}

export default function FaqsFeature() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedIds, setExpandedIds] = useState(new Set(["what-is-snapfreetools", "are-files-uploaded"]));
  const faqRefs = useRef({});

  // Deep Link Hash Support on Mount & HashChange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const targetFaq = FAQS_DATA.find((f) => f.id === hash);
        if (targetFaq) {
          // Open target FAQ
          setExpandedIds((prev) => new Set([...prev, hash]));
          // Scroll to FAQ smooth after small timeout
          setTimeout(() => {
            if (faqRefs.current[hash]) {
              faqRefs.current[hash].scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 150);
        }
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  // Filtering & Searching Logic
  const filteredFaqs = useMemo(() => {
    let result = FAQS_DATA;

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((item) => item.category === activeCategory);
    }

    // Search query filter (whitespace tolerant, case insensitive across question, answer, category, keywords)
    const cleanQuery = searchQuery.trim().toLowerCase();
    if (cleanQuery) {
      result = result.filter((item) => {
        const matchQuestion = item.question.toLowerCase().includes(cleanQuery);
        const matchAnswer = item.answer.toLowerCase().includes(cleanQuery);
        const matchCategory = item.category.toLowerCase().includes(cleanQuery);
        const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(cleanQuery));

        return matchQuestion || matchAnswer || matchCategory || matchKeywords;
      });
    }

    return result;
  }, [activeCategory, searchQuery]);

  // Toggle FAQ expansion
  const toggleAccordion = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Click popular question -> expand & scroll
  const handlePopularClick = (id) => {
    setExpandedIds((prev) => new Set([...prev, id]));
    // Clear search if popular item might be hidden
    setSearchQuery("");
    setActiveCategory("all");

    setTimeout(() => {
      if (faqRefs.current[id]) {
        faqRefs.current[id].scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  // Clear search input & category
  const handleClearSearch = () => {
    setSearchQuery("");
    setActiveCategory("all");
  };

  // Results count string generator
  const resultCountText = useMemo(() => {
    const total = filteredFaqs.length;
    const catName = FAQ_CATEGORIES.find((c) => c.id === activeCategory)?.name || "All Questions";

    if (searchQuery.trim()) {
      return `${total} ${total === 1 ? "question" : "questions"} matching "${searchQuery.trim()}"`;
    }
    if (activeCategory !== "all") {
      return `Showing ${catName} questions (${total})`;
    }
    return `${total} questions available`;
  }, [filteredFaqs.length, activeCategory, searchQuery]);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-14 text-center px-4 bg-white border-b border-slate-200/60 overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-3xl mx-auto space-y-5 relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold uppercase tracking-widest select-none">
            <Sparkles size={12} className="text-amber-500" />
            HELP CENTER
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Frequently Asked <span className="text-amber-500 italic font-serif">Questions</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
            Find quick answers about SnapFreeTools, our tools, privacy, file processing, supported formats, and more.
          </p>

          {/* Prominent FAQ Search Field */}
          <div className="pt-3 max-w-2xl mx-auto">
            <div className="relative flex items-center shadow-md shadow-slate-200/50 rounded-2xl bg-white border border-slate-300 hover:border-amber-400 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 transition-all">
              <div className="pl-4 pr-2 text-slate-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions..."
                aria-label="Search questions"
                className="w-full py-4 pr-10 text-sm font-semibold text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search text"
                  className="pr-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center items-center gap-5 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              100% In-Browser Privacy
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              No Server File Uploads
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-500" />
              No Account Required
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-12">
        
        {/* 7. POPULAR QUESTIONS SECTION (Shown when not actively searching) */}
        {!searchQuery && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap size={14} className="text-amber-500" />
                Popular Questions
              </h2>
              <span className="text-[11px] font-bold text-slate-400">Quick Access</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {POPULAR_FAQS.slice(0, 4).map((faq) => (
                <button
                  key={faq.id}
                  type="button"
                  onClick={() => handlePopularClick(faq.id)}
                  className="bg-white hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 rounded-2xl p-4 text-left shadow-xs hover:shadow-sm transition-all group cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {getCategoryIcon(faq.category, 14)}
                    </div>
                    <h3 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 leading-snug line-clamp-2">
                      {faq.question}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-extrabold text-amber-600 group-hover:translate-x-0.5 transition-transform pt-1 border-t border-slate-100">
                    <span>View Answer</span>
                    <ArrowRight size={12} />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 3. CATEGORY NAVIGATION BAR */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
              Categories
            </h2>
            {/* 8. FAQ RESULTS COUNT */}
            <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200/80 px-2.5 py-1 rounded-full shadow-2xs">
              {resultCountText}
            </span>
          </div>

          {/* Horizontally scrollable category buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
            {FAQ_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex items-center gap-1.5 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 ring-2 ring-slate-900 ring-offset-1"
                      : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/80"
                  }`}
                >
                  {cat.id !== "all" && getCategoryIcon(cat.id, 14, isActive ? "text-amber-400" : "text-slate-400")}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. FAQ ACCORDION LIST OR EMPTY STATE */}
        <section className="space-y-4">
          {filteredFaqs.length > 0 ? (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isOpen = expandedIds.has(faq.id);
                const categoryObj = FAQ_CATEGORIES.find((c) => c.id === faq.category);

                return (
                  <div
                    key={faq.id}
                    ref={(el) => (faqRefs.current[faq.id] = el)}
                    id={faq.id}
                    className={`bg-white border rounded-2xl transition-all overflow-hidden ${
                      isOpen
                        ? "border-amber-300 shadow-md shadow-amber-500/5 ring-1 ring-amber-200/60"
                        : "border-slate-200/80 hover:border-slate-300 shadow-2xs"
                    }`}
                  >
                    {/* Accordion Header / Trigger */}
                    <button
                      type="button"
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${faq.id}`}
                      id={`faq-header-${faq.id}`}
                      className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 rounded-2xl cursor-pointer group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50 inline-flex items-center gap-1">
                            {getCategoryIcon(faq.category, 11, "text-amber-600")}
                            {categoryObj ? categoryObj.name : faq.category}
                          </span>
                          {faq.popular && (
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                              Popular
                            </span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-amber-600 transition-colors leading-snug">
                          <HighlightText text={faq.question} query={searchQuery} />
                        </h3>
                      </div>

                      <div className={`p-2 rounded-xl bg-slate-50 group-hover:bg-amber-50 transition-colors shrink-0 ${isOpen ? "text-amber-600 bg-amber-50" : "text-slate-400"}`}>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>

                    {/* Accordion Answer Content */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${faq.id}`}
                          role="region"
                          aria-labelledby={`faq-header-${faq.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-0 border-t border-slate-100 space-y-4">
                            <p className="text-sm text-slate-600 font-medium leading-relaxed pt-4">
                              <HighlightText text={faq.answer} query={searchQuery} />
                            </p>

                            {/* Related Tool Direct Link */}
                            {faq.relatedTool && faq.relatedToolRoute && (
                              <div className="pt-2 flex items-center gap-2">
                                <span className="text-xs font-bold text-slate-400">Related Tool:</span>
                                <Link
                                  href={faq.relatedToolRoute}
                                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100/80 px-3 py-1.5 rounded-xl border border-amber-200/60 transition-all"
                                >
                                  <span>{faq.relatedTool}</span>
                                  <ArrowRight size={12} />
                                </Link>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            /* EMPTY SEARCH STATE */
            <div className="bg-white border border-slate-200/80 rounded-3xl p-10 text-center space-y-4 shadow-xs max-w-xl mx-auto my-8">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto">
                <HelpCircle size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  No matching questions found
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Try a different keyword or browse the categories below.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all cursor-pointer inline-flex items-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span>Clear Search</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 9. RELATED TOOLS SECTION */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/50">
              GET THE JOB DONE
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight pt-1">
              Need more than an answer?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold">
              Use our free browser-based tools to get the job done.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <Link
              href="/image-resizer"
              className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 transition-all group text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-amber-500 group-hover:scale-105 transition-transform shadow-2xs">
                  <Scaling size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  Image Resizer
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Resize JPG, PNG, WebP images to custom pixel dimensions or preset social ratios.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-200/60">
                <span>Use Resizer</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/protect-pdf"
              className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 transition-all group text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-emerald-500 group-hover:scale-105 transition-transform shadow-2xs">
                  <Lock size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  Protect PDF
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Encrypt PDF files with AES-256 password protection in your browser.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-200/60">
                <span>Protect PDF Now</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/case-converter"
              className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 transition-all group text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-purple-500 group-hover:scale-105 transition-transform shadow-2xs">
                  <Type size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  Case Converter
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Convert text to UPPERCASE, lowercase, title case, camelCase & 12 other formats.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-200/60">
                <span>Convert Text</span>
                <ArrowRight size={13} />
              </div>
            </Link>

            <Link
              href="/image-compressor"
              className="bg-slate-50 hover:bg-amber-50/50 border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 transition-all group text-left flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-blue-500 group-hover:scale-105 transition-transform shadow-2xs">
                  <ImageIcon size={20} />
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  Image Compressor
                </h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Compress JPG, PNG, and WebP files up to 80% without noticeable quality loss.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-xs font-extrabold text-amber-600 group-hover:translate-x-1 transition-transform pt-2 border-t border-slate-200/60">
                <span>Compress Images</span>
                <ArrowRight size={13} />
              </div>
            </Link>

          </div>
        </section>

        {/* 10. GUIDES CROSS-LINK SECTION */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-2 max-w-xl text-left relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <BookOpen size={12} className="text-amber-400" />
              LEARNING HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Want a step-by-step explanation?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              Explore our practical guides for detailed walkthroughs, tips, and tutorials on file management, image optimization, and privacy.
            </p>
          </div>

          <Link
            href="/guides"
            className="px-7 py-3.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white font-black text-xs rounded-2xl shadow-lg shadow-amber-500/25 transition-all shrink-0 cursor-pointer flex items-center gap-2 relative z-10"
          >
            <span>Browse Guides</span>
            <ArrowRight size={14} />
          </Link>
        </section>

        {/* 11. STILL NEED HELP SECTION */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 text-center space-y-5 shadow-xs max-w-3xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-500 flex items-center justify-center mx-auto">
            <HelpCircle size={24} />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-slate-900">
              Still can't find your answer?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-semibold max-w-md mx-auto leading-relaxed">
              Browse our guides or explore SnapFreeTools to find the right solution for your digital tasks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/guides"
              className="w-full sm:w-auto px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Browse Guides</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/calculators"
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Tools</span>
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
