"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, ArrowRightLeft, Search, CheckCircle2, XCircle, 
  HelpCircle, ShieldCheck, Check, ArrowRight, Copy, Share2, 
  ChevronDown, Layers, Zap, Scale, FileText, Image as ImageIcon,
  Scaling, Lock, Unlock, FileType, Combine, Scissors, FileDown,
  Type, Calculator, GraduationCap, RefreshCw, Twitter, Linkedin, Mail
} from "lucide-react";

import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { 
  TOOL_COMPARISON_METADATA, 
  COMPARISON_CATEGORIES, 
  POPULAR_COMPARISONS, 
  USE_CASE_GUIDES, 
  COMPARISON_FAQS 
} from "./data/comparisonMetadata";

// Helper to get tool icon dynamically
function getToolIcon(iconName, size = 20, className = "") {
  switch (iconName) {
    case "Scaling": return <Scaling size={size} className={className} />;
    case "Image": return <ImageIcon size={size} className={className} />;
    case "Lock": return <Lock size={size} className={className} />;
    case "Unlock": return <Unlock size={size} className={className} />;
    case "FileType": return <FileType size={size} className={className} />;
    case "Combine": return <Combine size={size} className={className} />;
    case "Scissors": return <Scissors size={size} className={className} />;
    case "FileDown": return <FileDown size={size} className={className} />;
    case "CaseSensitive": return <Type size={size} className={className} />;
    case "FileText": return <FileText size={size} className={className} />;
    case "GraduationCap": return <GraduationCap size={size} className={className} />;
    case "Calculator": return <Calculator size={size} className={className} />;
    default: return <Layers size={size} className={className} />;
  }
}

export default function ComparisonsFeature() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Read URL query params on initial load
  const initialTool1 = searchParams.get("tool1") || "image-resizer";
  const initialTool2 = searchParams.get("tool2") || "image-compressor";

  const [tool1Slug, setTool1Slug] = useState(initialTool1);
  const [tool2Slug, setTool2Slug] = useState(initialTool2);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Sync state with URL without triggering full page reloads
  const updateSelectedTools = (t1, t2) => {
    setTool1Slug(t1);
    setTool2Slug(t2);
    const newUrl = `/comparisons?tool1=${t1}&tool2=${t2}`;
    window.history.replaceState(null, "", newUrl);
  };

  // Swap Tool A and Tool B
  const handleSwapTools = () => {
    updateSelectedTools(tool2Slug, tool1Slug);
  };

  // Available tools from registry
  const liveTools = useMemo(() => {
    return ALL_TOOLS.filter((t) => t.status === "live");
  }, []);

  // Filtered tools list for selector search
  const filteredTools = useMemo(() => {
    return liveTools.filter((t) => {
      const matchCat = activeCategory === "all" || 
        (activeCategory === "image" && t.group === "Image Tools") ||
        (activeCategory === "pdf" && t.group === "PDF Tools") ||
        (activeCategory === "text" && t.group === "Text Tools") ||
        (activeCategory === "calculators" && t.group === "Calculators");

      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        t.name.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q);

      return matchCat && matchSearch;
    });
  }, [liveTools, activeCategory, searchQuery]);

  // Derived Tool metadata
  const meta1 = TOOL_COMPARISON_METADATA[tool1Slug] || TOOL_COMPARISON_METADATA["image-resizer"];
  const meta2 = TOOL_COMPARISON_METADATA[tool2Slug] || TOOL_COMPARISON_METADATA["image-compressor"];

  const tool1Obj = liveTools.find((t) => t.slug === tool1Slug) || liveTools[0];
  const tool2Obj = liveTools.find((t) => t.slug === tool2Slug) || liveTools[1];

  const isSameTool = tool1Slug === tool2Slug;

  // Copy share URL
  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

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
          className="max-w-4xl mx-auto space-y-6 relative z-10"
        >
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-extrabold uppercase tracking-widest select-none">
            <Scale size={12} className="text-amber-500" />
            COMPARE TOOLS
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
            Find the Right Tool for the <span className="text-amber-500 italic font-serif">Job</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto font-semibold leading-relaxed">
            Compare SnapFreeTools tools side by side to quickly find the best solution for your files, images, PDFs, and everyday tasks.
          </p>

          {/* Facing Tool Cards Visual Preview */}
          <div className="pt-4 max-w-2xl mx-auto">
            <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              
              {/* Tool A Card Preview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full sm:w-1/2 text-left flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  {getToolIcon(meta1.icon, 20)}
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-amber-700 tracking-wider">Tool A</span>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{meta1.name}</h3>
                </div>
              </div>

              {/* VS Indicator Badge & Swap Button */}
              <button
                type="button"
                onClick={handleSwapTools}
                title="Swap tools"
                aria-label="Swap Tool A and Tool B"
                className="w-10 h-10 rounded-full bg-slate-900 text-white font-black text-xs flex items-center justify-center shadow-md hover:bg-amber-500 transition-all shrink-0 cursor-pointer group"
              >
                <ArrowRightLeft size={16} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>

              {/* Tool B Card Preview */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 w-full sm:w-1/2 text-left flex items-center gap-3 shadow-2xs">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                  {getToolIcon(meta2.icon, 20)}
                </div>
                <div>
                  <span className="text-[9px] font-extrabold uppercase text-amber-700 tracking-wider">Tool B</span>
                  <h3 className="text-sm font-black text-slate-900 leading-tight">{meta2.name}</h3>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-14">

        {/* 4. COMPARISON SELECTOR AREA */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-left">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers size={18} className="text-amber-500" />
              Select Tools to Compare
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Choose any two tools from our platform to view side-by-side specs, privacy levels, and use cases.
            </p>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            <div className="sm:col-span-6 relative flex items-center rounded-2xl bg-slate-50 border border-slate-200 px-3.5 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/10 transition-all">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools to compare..."
                className="w-full text-xs font-semibold text-slate-900 bg-transparent placeholder-slate-400 focus:outline-none"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery("")} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={16} />
                </button>
              )}
            </div>

            <div className="sm:col-span-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none select-none">
              {COMPARISON_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 hover:bg-slate-200/80 text-slate-600 border border-slate-200/60"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dual Dropdown Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2">
            
            {/* Tool A Selector */}
            <div className="md:col-span-5 space-y-2 text-left">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Tool A
              </label>
              <select
                value={tool1Slug}
                onChange={(e) => updateSelectedTools(e.target.value, tool2Slug)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {filteredTools.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} ({t.group})
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-2 flex justify-center pt-4 md:pt-6">
              <button
                type="button"
                onClick={handleSwapTools}
                className="px-4 py-2.5 bg-slate-100 hover:bg-amber-100 hover:text-amber-800 text-slate-700 text-xs font-extrabold rounded-2xl border border-slate-200/80 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowRightLeft size={14} />
                <span>Swap</span>
              </button>
            </div>

            {/* Tool B Selector */}
            <div className="md:col-span-5 space-y-2 text-left">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                Tool B
              </label>
              <select
                value={tool2Slug}
                onChange={(e) => updateSelectedTools(tool1Slug, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
              >
                {filteredTools.map((t) => (
                  <option key={t.slug} value={t.slug}>
                    {t.name} ({t.group})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Same Tool Warning Banner */}
          {isSameTool && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center text-amber-800 text-xs font-bold flex items-center justify-center gap-2">
              <HelpCircle size={16} className="text-amber-600 shrink-0" />
              <span>Choose two different tools to compare side-by-side features.</span>
            </div>
          )}
        </section>

        {/* 6. SELECTED TOOL CARDS */}
        {!isSameTool && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tool A Card */}
            <div className="bg-white border-2 border-amber-400/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-800 px-3 py-1 rounded-full">
                TOOL A
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-2xs">
                  {getToolIcon(meta1.icon, 24)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{meta1.name}</h3>
                  <span className="text-xs font-bold text-slate-400">{meta1.group}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {meta1.description}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Processing:</span>
                  <span className="font-extrabold text-emerald-600">{meta1.privacyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Formats:</span>
                  <span className="font-extrabold text-slate-700">{meta1.outputFormats}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${tool1Slug}`}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-2xl shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open {meta1.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Tool B Card */}
            <div className="bg-white border-2 border-slate-300 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4 relative overflow-hidden">
              <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-700 px-3 py-1 rounded-full">
                TOOL B
              </span>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shadow-2xs">
                  {getToolIcon(meta2.icon, 24)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{meta2.name}</h3>
                  <span className="text-xs font-bold text-slate-400">{meta2.group}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                {meta2.description}
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Processing:</span>
                  <span className="font-extrabold text-emerald-600">{meta2.privacyLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Formats:</span>
                  <span className="font-extrabold text-slate-700">{meta2.outputFormats}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/${tool2Slug}`}
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Open {meta2.name}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </section>
        )}

        {/* 7. COMPARISON RESULT TABLE */}
        {!isSameTool && (
          <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 overflow-hidden">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <CheckCircle2 size={20} className="text-amber-500" />
                Detailed Feature Matrix
              </h2>
              <span className="text-xs font-bold text-slate-400">Side-by-side Specs</span>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80">
                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-500 w-1/3">Feature</th>
                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-amber-700 w-1/3 bg-amber-50/40">{meta1.name}</th>
                    <th className="py-4 px-4 text-xs font-black uppercase tracking-wider text-slate-700 w-1/3">{meta2.name}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  
                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Primary Purpose / Best For</td>
                    <td className="py-4 px-4 font-bold text-slate-800 bg-amber-50/20">{meta1.bestFor}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">{meta2.bestFor}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Processing Method</td>
                    <td className="py-4 px-4 bg-amber-50/20">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        <CheckCircle2 size={12} />
                        100% In-Browser (WASM/Canvas)
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                        <CheckCircle2 size={12} />
                        100% In-Browser (WASM/Canvas)
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Server File Upload Required</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">No (0% File Upload)</td>
                    <td className="py-4 px-4 font-bold text-slate-700">No (0% File Upload)</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Data Privacy Level</td>
                    <td className="py-4 px-4 font-bold text-emerald-600 bg-amber-50/20">{meta1.privacyLevel}</td>
                    <td className="py-4 px-4 font-bold text-emerald-600">{meta2.privacyLevel}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Supported Input Formats</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.inputFormats}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.inputFormats}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Supported Output Formats</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.outputFormats}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.outputFormats}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Batch Processing</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.batchProcessing}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.batchProcessing}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Custom Controls & Options</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.customControls}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.customControls}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Presets & Quick Templates</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.presets}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.presets}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Quality / Resolution Slider</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.qualitySlider}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.qualitySlider}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Maximum File Size Limit</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">{meta1.maxFileSize}</td>
                    <td className="py-4 px-4 font-bold text-slate-700">{meta2.maxFileSize}</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Account & Signup Required</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">No Signup Required</td>
                    <td className="py-4 px-4 font-bold text-slate-700">No Signup Required</td>
                  </tr>

                  <tr>
                    <td className="py-4 px-4 font-extrabold text-slate-900 bg-slate-50/30">Cost & Usage Restrictions</td>
                    <td className="py-4 px-4 font-bold text-slate-700 bg-amber-50/20">100% Free & Unlimited</td>
                    <td className="py-4 px-4 font-bold text-slate-700">100% Free & Unlimited</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 8. RECOMMENDATION ENGINE */}
        {!isSameTool && (
          <section className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
            <div aria-hidden="true" className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-2 text-left relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles size={12} className="text-amber-400" />
                RECOMMENDATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Which tool should you choose?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              
              {/* Tool A Strengths */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 space-y-4 backdrop-blur-md text-left">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <span>Choose {meta1.name} if:</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                  {meta1.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                  {meta1.keyFeatures.slice(0, 2).map((feat, idx) => (
                    <li key={`feat-${idx}`} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>Features {feat.toLowerCase()}.</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    href={`/${tool1Slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300 hover:text-white transition-colors"
                  >
                    <span>Launch {meta1.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Tool B Strengths */}
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 space-y-4 backdrop-blur-md text-left">
                <h3 className="text-lg font-black text-emerald-400 flex items-center gap-2">
                  <span>Choose {meta2.name} if:</span>
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                  {meta2.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{str}</span>
                    </li>
                  ))}
                  {meta2.keyFeatures.slice(0, 2).map((feat, idx) => (
                    <li key={`feat-${idx}`} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>Features {feat.toLowerCase()}.</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2">
                  <Link
                    href={`/${tool2Slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-300 hover:text-white transition-colors"
                  >
                    <span>Launch {meta2.name}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

            </div>
          </section>
        )}

        {/* 9. PRIVACY FIRST SPOTLIGHT */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4 text-left">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-1">
              <ShieldCheck size={24} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                100% Client-Side Privacy
              </span>
              <h3 className="text-lg font-black text-slate-900">Your Files Never Leave Your Browser</h3>
              <p className="text-xs text-slate-500 font-semibold max-w-xl leading-relaxed">
                Both {meta1.name} and {meta2.name} execute inside local browser memory via JavaScript, WASM, and HTML5 APIs. No files are uploaded to our or any third-party servers.
              </p>
            </div>
          </div>

          <Link
            href="/privacy-policy"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold rounded-xl border border-slate-200 transition-all shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <span>Read Privacy Policy</span>
            <ArrowRight size={13} />
          </Link>
        </section>

        {/* 10. BEST USE CASE CARDS */}
        <section className="space-y-4">
          <div className="space-y-1 text-left">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Choose Based on Your Goal
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Find quick recommendations for common file and document requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {USE_CASE_GUIDES.map((uc, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 hover:border-amber-300 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all text-left flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <h3 className="text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                    {uc.goal}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                    {uc.reason}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/50">
                    {uc.toolName}
                  </span>
                  <Link
                    href={`/${uc.toolSlug}`}
                    className="inline-flex items-center gap-1 text-xs font-black text-slate-900 group-hover:text-amber-600 transition-colors"
                  >
                    <span>Use Tool</span>
                    <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 11. POPULAR COMPARISONS */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-left">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap size={18} className="text-amber-500" />
              Popular Tool Comparisons
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Explore preset comparisons between frequently compared tools.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {POPULAR_COMPARISONS.map((pop) => (
              <button
                key={pop.id}
                type="button"
                onClick={() => updateSelectedTools(pop.tool1, pop.tool2)}
                className={`bg-slate-50 hover:bg-amber-50/50 border p-5 rounded-2xl transition-all text-left flex flex-col justify-between space-y-3 group cursor-pointer ${
                  (tool1Slug === pop.tool1 && tool2Slug === pop.tool2) || (tool1Slug === pop.tool2 && tool2Slug === pop.tool1)
                    ? "border-amber-400 bg-amber-50/60 shadow-xs"
                    : "border-slate-200/80 hover:border-amber-300"
                }`}
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black uppercase text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-200/60">
                    {pop.badge}
                  </span>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                    {pop.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                    {pop.summary}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-black text-amber-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Compare Tools</span>
                  <ArrowRight size={13} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 13. SHARE COMPARISON SECTION */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div aria-hidden="true" className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1 text-left relative z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400">
              SHARE COMPARISON
            </span>
            <h3 className="text-xl font-black text-white">Found this comparison helpful?</h3>
            <p className="text-xs text-slate-300 font-medium">
              Share this {meta1.name} vs {meta2.name} comparison link with your team or friends.
            </p>
          </div>

          <div className="flex items-center gap-2 relative z-10 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Copy size={14} />
              <span>{copiedLink ? "Copied Link!" : "Copy Link"}</span>
            </button>

            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Compare ${meta1.name} vs ${meta2.name} on SnapFreeTools`)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-colors cursor-pointer"
              title="Share on Twitter/X"
            >
              <Twitter size={16} />
            </a>

            <a
              href={`mailto:?subject=${encodeURIComponent(`${meta1.name} vs ${meta2.name} Comparison`)}&body=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-white rounded-xl transition-colors cursor-pointer"
              title="Share via Email"
            >
              <Mail size={16} />
            </a>
          </div>
        </section>

        {/* 19. FAQ ACCORDION SECTION */}
        <section className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1 text-left">
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <HelpCircle size={18} className="text-amber-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-semibold">
              Got questions about tool comparisons or browser privacy? Find quick answers below.
            </p>
          </div>

          <div className="space-y-3">
            {COMPARISON_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isOpen ? "border-amber-300 bg-amber-50/20" : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer outline-none group"
                  >
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition-colors">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-amber-600" : ""}`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-slate-100 text-xs text-slate-600 font-medium leading-relaxed">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
