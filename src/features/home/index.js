"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import * as Icons from "lucide-react";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { getFAQSchema, JsonLd } from "@/seo/structured-data";

export default function HomeFeature() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [openFaqIndex, setOpenFaqIndex] = useState(0); // Accordion state, first FAQ open by default
  const searchInputRef = useRef(null);
  const searchContainerRef = useRef(null);

  // Dynamic counts from registry
  const pdfCount = ALL_TOOLS.filter(t => t.group === "PDF Tools" && t.status === "live").length;
  const calculatorsCount = ALL_TOOLS.filter(t => t.group === "Calculators" && t.status === "live").length;
  const textCount = ALL_TOOLS.filter(t => t.group === "Text Tools" && t.status === "live").length;
  const imageCount = ALL_TOOLS.filter(t => t.group === "Image Tools" && t.status === "live").length;

  // Filter tools by popular/featured
  const featuredTools = ALL_TOOLS.filter(t => 
    t.status === "live" && ["pdf-to-word", "gpa-calculator", "word-counter", "image-compressor"].includes(t.id)
  );

  const popularCalculators = ALL_TOOLS.filter(t => 
    t.group === "Calculators" && t.status === "live" && ["gpa-calculator", "cgpa-calculator", "sgpa-calculator", "merit-calculator", "required-gpa-calculator"].includes(t.id)
  );

  // Search filter effect
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setFocusedIndex(-1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const matches = ALL_TOOLS.filter(tool => {
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descMatch = (tool.description || "").toLowerCase().includes(query);
      const groupMatch = tool.group.toLowerCase().includes(query);
      const catMatch = (tool.category || "").toLowerCase().includes(query);
      const kwMatch = (tool.keywords || "").toLowerCase().includes(query);
      
      return nameMatch || descMatch || groupMatch || catMatch || kwMatch;
    });

    // Sort live tools first
    const sortedMatches = matches.sort((a, b) => {
      if (a.status === "live" && b.status !== "live") return -1;
      if (a.status !== "live" && b.status === "live") return 1;
      return 0;
    });

    setSearchResults(sortedMatches);
    setFocusedIndex(-1);
  }, [searchQuery]);

  // Click outside search container to close/clear
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSearchQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Keyboard controls
  const handleKeyDown = (e) => {
    if (searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === "Enter") {
      if (focusedIndex >= 0 && focusedIndex < searchResults.length) {
        e.preventDefault();
        const selectedTool = searchResults[focusedIndex];
        if (selectedTool.status === "live") {
          window.location.href = `/${selectedTool.slug}`;
        }
      }
    } else if (e.key === "Escape") {
      setSearchQuery("");
      searchInputRef.current?.blur();
    }
  };

  const getDynamicIcon = (iconName, size = 20, className = "") => {
    const IconComp = Icons[iconName] || Icons.FileText;
    return <IconComp size={size} className={className} />;
  };

  // FAQ Schema content
  const faqs = [
    {
      question: "Is SnapFreeTools free to use?",
      answer: "Yes, SnapFreeTools is completely free to use. All of our utility calculators, image compressors, PDF converters, and text tools are available without any subscriptions, hidden fees, or registration requirements."
    },
    {
      question: "Do I need to create an account?",
      answer: "No registration is required. You can start using any of our tools immediately without providing your email address or creating an account."
    },
    {
      question: "Are uploaded files stored?",
      answer: "Privacy is a core priority of our platform. For many browser-based tools, files are processed locally on your device and are never uploaded to a server. For tools that require server-side conversion or analysis, files are kept temporarily in memory and deleted immediately after processing."
    },
    {
      question: "Which tools are currently available?",
      answer: "Our live tools include the PDF to Word converter, semester GPA and CGPA calculators, character and word counter, and the browser-based image compressor. Additional tools in each category are currently in active development."
    },
    {
      question: "Can I use SnapFreeTools on mobile?",
      answer: "Yes, SnapFreeTools is fully responsive and optimized for mobile devices, tablets, and desktop viewports alike."
    },
    {
      question: "Does PDF to Word support scanned documents and OCR?",
      answer: "Yes, our PDF to Word converter detects scanned pages and provides a local English OCR option to extract text content, converting it into editable DOCX format where possible."
    }
  ];

  return (
    <>
      <JsonLd schema={getFAQSchema(faqs)} />
      <div id="home-page" className="bg-slate-50/50 min-h-screen pb-16">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-10 text-center px-4 overflow-hidden border-b border-slate-200/50 bg-white">
          <div aria-hidden="true" className="absolute top-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div aria-hidden="true" className="absolute bottom-0 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest select-none">
              <Icons.Zap size={10} className="fill-emerald-500 text-emerald-500" />
              Free Online Productivity Tools
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Free Online Tools for <br />
              <span className="text-amber-500 italic font-serif">Faster, Smarter Work</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-semibold md:line-clamp-2">
              Convert PDFs, calculate grades, compress images, and analyze text with fast, simple, and accessible online tools.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-2">
              <Link
                href="/calculators"
                className="w-full sm:w-auto px-6 py-3 bg-[#08111F] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Browse Calculators
                <Icons.ArrowRight size={14} />
              </Link>
              <Link
                href="/pdf-to-word"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200 flex items-center justify-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Try PDF to Word
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex justify-center items-center gap-5 pt-3 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                Free to use
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                Privacy focused
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                No signup required
              </div>
            </div>

            {/* SEARCH EXPERIENCES */}
            <div ref={searchContainerRef} className="max-w-2xl mx-auto pt-6 relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Search SnapFreeTools Directory"
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-800 placeholder-slate-455 focus:outline-none focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all text-sm font-semibold shadow-sm"
                />
                <Icons.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 text-xs font-extrabold"
                  >
                    ESC
                  </button>
                )}
              </div>

              {/* Suggestions dropdown */}
              <AnimatePresence>
                {searchQuery.trim().length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-250/60 shadow-2xl rounded-2xl z-30 max-h-72 overflow-y-auto text-left"
                  >
                    {searchResults.length > 0 ? (
                      <div className="p-2 space-y-1">
                        {searchResults.map((tool, idx) => {
                          const isLive = tool.status === "live";
                          const isFocused = idx === focusedIndex;
                          
                          if (isLive) {
                            return (
                              <Link
                                key={tool.id}
                                href={`/${tool.slug}`}
                                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${isFocused ? "bg-amber-50 text-amber-900" : "hover:bg-slate-50 text-slate-700"}`}
                              >
                                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                  {getDynamicIcon(tool.icon, 16)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-bold truncate">{tool.name}</h4>
                                  <p className="text-[10px] text-slate-450 truncate">{tool.description}</p>
                                </div>
                                <Icons.ArrowRight size={14} className="text-slate-350" />
                              </Link>
                            );
                          }

                          return (
                            <div
                              key={tool.id}
                              className="flex items-center gap-3 p-2.5 rounded-xl cursor-not-allowed select-none opacity-60 text-slate-400"
                            >
                              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                {getDynamicIcon(tool.icon, 16)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold truncate">{tool.name}</h4>
                                <p className="text-[10px] text-slate-455 truncate">{tool.description}</p>
                              </div>
                              <span className="text-[8px] font-extrabold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 tracking-wider">Soon</span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-slate-450 text-xs font-bold">
                        No matching tools found.
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* FEATURED TOOLS GRID */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 pt-4 pb-10">
          <div className="text-center md:text-left mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Featured Tools</h2>
              <h3 className="text-xl font-black text-slate-900 mt-1">Start with our most popular free tools.</h3>
            </div>
            <Link href="/calculators" className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 outline-none focus-visible:text-amber-600">
              Browse Calculators &arr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredTools.map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.slug}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-amber-200/60 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-550 group-hover:text-amber-500 group-hover:border-amber-300 group-hover:bg-white transition-all shrink-0 mb-3.5">
                  {getDynamicIcon(tool.icon, 20)}
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">{tool.group}</span>
                  <h4 className="text-sm font-black text-slate-800 group-hover:text-amber-600 transition-colors flex items-center gap-1.5">
                    {tool.name}
                    <Icons.ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0 duration-150" />
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-semibold line-clamp-2 pt-0.5">
                    {tool.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* BROWSE BY CATEGORY */}
        <section className="bg-white border-y border-slate-200/50 py-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Ecosystem Categories</h2>
              <h3 className="text-xl font-black text-slate-900 mt-1">Browse Tools by Workspace</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* PDF Category */}
              <Link
                href="/pdf-tools"
                className="bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-250 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-250/60 flex items-center justify-center text-slate-550 group-hover:text-amber-500 shadow-sm shrink-0 mb-3.5">
                  <Icons.FileType size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-855">PDF Tools</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed font-semibold line-clamp-2">
                  Convert, merge, split, and compress PDF documents securely.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-500">
                  <span>{pdfCount} Live Tools</span>
                  <Icons.ArrowRight size={12} />
                </div>
              </Link>

              {/* Calculators Category */}
              <Link
                href="/calculators"
                className="bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-250 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-250/60 flex items-center justify-center text-slate-550 group-hover:text-amber-550 shadow-sm shrink-0 mb-3.5">
                  <Icons.Calculator size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-855">Calculators</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed font-semibold line-clamp-2">
                  Calculate semester GPA, cumulative scores, merit aggregates, and target grades.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-500">
                  <span>{calculatorsCount} Live Tools</span>
                  <Icons.ArrowRight size={12} />
                </div>
              </Link>

              {/* Text Category */}
              <Link
                href="/word-counter"
                className="bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-250 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-250/60 flex items-center justify-center text-slate-550 group-hover:text-amber-500 shadow-sm shrink-0 mb-3.5">
                  <Icons.FileText size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-855">Text Tools</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed font-semibold line-clamp-2">
                  Analyze sentence density, characters count, reading times, and casing structures.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-500">
                  <span>{textCount} Live Tool</span>
                  <Icons.ArrowRight size={12} />
                </div>
              </Link>

              {/* Image Category */}
              <Link
                href="/image-compressor"
                className="bg-slate-50/50 hover:bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-250 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-250/60 flex items-center justify-center text-slate-550 group-hover:text-amber-500 shadow-sm shrink-0 mb-3.5">
                  <Icons.Image size={20} />
                </div>
                <h4 className="text-sm font-black text-slate-855">Image Tools</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed font-semibold line-clamp-2">
                  Compress sizes, convert scales, and adjust dimensions inside the browser.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-500">
                  <span>{imageCount} Live Tool</span>
                  <Icons.ArrowRight size={12} />
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* WHY SNAPFREETOOLS */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div className="space-y-3">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Why SnapFreeTools</h2>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">Fast, private utility tools without boundaries</h3>
            <p className="text-sm text-slate-500 leading-relaxed font-semibold">
              We design premium and fast browser-side utility widgets to minimize server uploads and preserve file control.
            </p>
            <div className="pt-1">
              <Link href="/about" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#08111F] hover:text-amber-600 transition-colors">
                Read our mission &rarr;
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:col-span-2">
            
            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.Zap size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-800">Fast and Simple</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Clean interfaces calculate values instantly directly inside your browser.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.Shield size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-800">Privacy-Conscious</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Data is processed directly on your device, ensuring maximum privacy.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.UserCheck size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-800">No Unnecessary Signup</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                All tools are free to use instantly without registration barriers.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.MonitorSmartphone size={16} />
              </div>
              <h4 className="text-xs font-black text-slate-800">Works Across Devices</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Access calculators and tools seamlessly on mobile, tablet, and desktop.
              </p>
            </div>

          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white border-y border-slate-200/50 py-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
            <div className="mb-8">
              <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Workflow</h2>
              <h3 className="text-xl font-black text-slate-900 mt-1">Three Simple Steps</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="space-y-2.5 relative">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-xs font-extrabold text-slate-700 select-none">
                  1
                </div>
                <h4 className="text-sm font-black text-slate-800">Choose a Tool</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto font-semibold">
                  Select a category or search our directory to find your target tool.
                </p>
              </div>

              <div className="space-y-2.5 relative">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-xs font-extrabold text-slate-700 select-none">
                  2
                </div>
                <h4 className="text-sm font-black text-slate-800">Add Information or File</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto font-semibold">
                  Paste raw text, input grade parameters, or select your document.
                </p>
              </div>

              <div className="space-y-2.5 relative">
                <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-xs font-extrabold text-slate-700 select-none">
                  3
                </div>
                <h4 className="text-sm font-black text-slate-800">Download Result</h4>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto font-semibold">
                  Get converted outputs or calculated scores instantly.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* AUDIENCE USE CASES */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Made for Everyone</h2>
            <h3 className="text-xl font-black text-slate-900 mt-1">Tailored for Diverse Workflows</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.GraduationCap size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Students</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Calculate semester GPA, CGPA, SGPA, and admission aggregate merits.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Briefcase size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Professionals</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Execute document workflows including layout-friendly PDF conversions.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Palette size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Creators</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Optimize assets using browser-side quality compression and text casing analysis.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Heart size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Everyday Users</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Access quick utility widgets without installation or memberships.
              </p>
            </div>

          </div>
        </section>

        {/* PDF TO WORD SPOTLIGHT */}
        <section className="bg-white border-y border-slate-200/50 py-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <span className="inline-flex items-center gap-1 py-1 px-3 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-extrabold uppercase tracking-wider select-none">
                Popular Converter Feature
              </span>
              <h3 className="text-2xl font-black text-slate-900 leading-tight">
                PDF to Word Converter
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-semibold">
                Convert PDFs into editable Word files while preserving text and page flow where possible. All conversions operate under browser controls.
              </p>
              
              <ul className="space-y-2 text-xs text-slate-600 font-bold">
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={14} className="text-emerald-500" />
                  Text-based PDF conversion
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={14} className="text-emerald-500" />
                  Scanned PDF detection
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={14} className="text-emerald-500" />
                  Convert scanned pages as images
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={14} className="text-emerald-500" />
                  Local English OCR
                </li>
                <li className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={14} className="text-emerald-500" />
                  Editable DOCX output
                </li>
              </ul>

              <div className="pt-1">
                <Link
                  href="/pdf-to-word"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#08111F] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow"
                >
                  Try PDF to Word
                  <Icons.ArrowRight size={14} />
                </Link>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-center items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shadow-sm select-none">
                <Icons.FileType size={28} />
              </div>
              <h4 className="text-sm font-black text-slate-850">Scanned PDF Detection</h4>
              <p className="text-xs text-slate-550 max-w-sm font-semibold leading-relaxed">
                Upload image-only PDFs to extract readable text.
              </p>
            </div>
          </div>
        </section>

        {/* POPULAR CALCULATORS */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10">
          <div className="text-center md:text-left mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
              <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">GPA Scales</h2>
              <h3 className="text-xl font-black text-slate-900 mt-1">Popular Student Calculators</h3>
            </div>
            <Link href="/calculators" className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 outline-none focus-visible:text-amber-600">
              View All Calculators &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCalculators.map((tool) => (
              <Link
                key={tool.id}
                href={`/${tool.slug}`}
                className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-200/60 shadow-sm transition-all group flex items-center gap-3.5 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-550 group-hover:text-amber-500 group-hover:bg-white group-hover:border-amber-300 transition-all shrink-0">
                  {getDynamicIcon(tool.icon, 16)}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-800 group-hover:text-amber-600 transition-colors truncate">{tool.name}</h4>
                  <p className="text-[13px] text-slate-500 font-semibold leading-relaxed mt-0.5 truncate">{tool.description}</p>
                </div>
                <Icons.ArrowRight size={14} className="text-slate-350 group-hover:text-amber-500 transition-colors shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* PRIVACY FEATURE SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-6">
          <div className="bg-[#08111F] text-white p-8 rounded-2xl relative overflow-hidden border border-slate-800/80 shadow-2xl">
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center select-none">
                <Icons.Lock size={16} />
              </div>
              <h3 className="text-xl font-black tracking-tight leading-tight text-white">
                Your work stays under your control
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Many SnapFreeTools utilities process data locally in your browser, helping reduce unnecessary uploads and complicated workflows.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 select-none">
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Browser-based processing where supported
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  No unnecessary registration
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Clear file and tool limits
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Simple downloadable results
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-10 space-y-6">
          <div className="text-center">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Support FAQ</h2>
            <h3 className="text-xl font-black text-slate-900 mt-1">Frequently Asked Questions</h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = idx === openFaqIndex;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200">
                  <h4 className="m-0">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      className="w-full px-5 py-4 text-left font-black text-slate-900 text-xs sm:text-sm flex justify-between items-center gap-4 hover:text-amber-500 transition-colors focus:outline-none outline-none"
                    >
                      <span className="flex items-center gap-2.5">
                        <Icons.HelpCircle size={15} className="text-amber-500 shrink-0" />
                        {faq.question}
                      </span>
                      <Icons.ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                  </h4>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${idx}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-4 text-xs text-slate-500 leading-relaxed font-semibold pl-10">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 text-center pb-8">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">Ready to get more done?</h3>
              <p className="text-xs text-slate-550 font-semibold">Choose a free tool and start instantly.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
              <Link
                href="/calculators"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#08111F] hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-all shadow"
              >
                Browse Calculators
              </Link>
              <Link
                href="/pdf-to-word"
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-200"
              >
                Try PDF to Word
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
