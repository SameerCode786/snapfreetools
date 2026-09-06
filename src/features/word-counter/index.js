"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileText, Copy, Trash2, Shield, Zap, Sparkles, Clock, 
  ImageIcon, Calculator, FileType, ChevronDown, Search, Info, 
  AlignLeft, BarChart3, Check, ArrowRight, BookOpen, Users, Edit3, ArrowLeft
} from "lucide-react";
import React from "react";
import Link from "next/link";
import { calculateTextStats } from "./utils/counter-engine";
import ShareSystem from "@/components/share";

function Tooltip({ content, align = "center" }) {
  const alignClasses = {
    center: "left-1/2 -translate-x-1/2",
    left: "left-0",
    right: "right-0",
  }[align];

  return (
    <span className="relative group inline-flex items-center select-none leading-none">
      <button
        type="button"
        className="text-slate-400 hover:text-slate-600 transition-colors focus:text-slate-600 focus:outline-none cursor-pointer p-0.5 animate-fade-in"
        aria-label="More information"
      >
        <Info size={14} />
      </button>
      <span
        className={`absolute bottom-full mb-2 w-64 max-w-[85vw] p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-left opacity-0 translate-y-1 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:visible transition-all duration-200 z-50 normal-case tracking-normal text-slate-600 text-[11px] leading-relaxed ${alignClasses}`}
      >
        {content}
      </span>
    </span>
  );
}

export default function WordCounter({ faqs = [] }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [excludeStopWords, setExcludeStopWords] = useState(true);
  const [keywordSearch, setKeywordSearch] = useState("");
  const [showAllKeywords, setShowAllKeywords] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Advanced density/sorting states
  const [activeTab, setActiveTab] = useState("words"); // 'words', 'phrases2', 'phrases3'
  const [sortField, setSortField] = useState("count"); // 'count', 'density'
  const [sortDirection, setSortDirection] = useState("desc"); // 'desc', 'asc'

  // Memoize computing stats to handle large texts (50,000+ words) efficiently
  const stats = useMemo(() => {
    return calculateTextStats(text);
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearText = () => {
    setText("");
  };

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Memoize base density list extraction
  const densityList = useMemo(() => {
    const listSource = excludeStopWords ? stats.densityClean : stats.densityAll;
    return listSource?.[activeTab] || [];
  }, [stats, excludeStopWords, activeTab]);

  // Memoize search filtering
  const filteredDensity = useMemo(() => {
    const query = keywordSearch.trim().toLowerCase();
    if (!query) return densityList;
    return densityList.filter(item => item.word.includes(query));
  }, [densityList, keywordSearch]);

  // Memoize sorting
  const sortedDensity = useMemo(() => {
    const list = [...filteredDensity];
    list.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      
      if (valA === valB) {
        return a.word.localeCompare(b.word);
      }
      
      if (sortDirection === "asc") {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });
    return list;
  }, [filteredDensity, sortField, sortDirection]);

  // Handle column sorting toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const keywordsToShow = showAllKeywords ? sortedDensity : sortedDensity.slice(0, 20);

  // Limit FAQs displayed in the UI to the first 10
  const visibleFaqs = faqs.slice(0, 10);

  const trustMessaging = [
    { label: "100% Free", icon: Sparkles },
    { label: "No Registration Required", icon: Users },
    { label: "Privacy Focused", icon: Shield },
    { label: "Browser-Based Processing", icon: Zap },
    { label: "Instant Results", icon: Clock }
  ];

  const features = [
    {
      title: "Real-Time Word Count",
      desc: "Our high-performance word count tool tracks characters, words, sentences, and paragraphs in real-time as you type or paste text.",
      icon: FileText
    },
    {
      title: "Character Counter",
      desc: "Instantly check total characters with spaces, or view the character count without spaces to meet strict social media or publishing limits.",
      icon: AlignLeft
    },
    {
      title: "Sentence & Paragraph Count",
      desc: "Analyze your writing structure by monitoring sentence counts and paragraph counts, which helps maintain academic and professional readability standards.",
      icon: BarChart3
    },
    {
      title: "Reading & Speaking Estimator",
      desc: "Utilize our built-in reading time calculator (275 WPM average) and speaking time estimator (180 WPM average) for speech preparation or content budgeting.",
      icon: Clock
    },
    {
      title: "Keyword Density Checker",
      desc: "Inspect keyword frequency and density metrics. Identify overused words to optimize for search engines and prevent keyword stuffing.",
      icon: Search
    },
    {
      title: "Text Analyzer Statistics",
      desc: "Review advanced stats like average word length and average sentence length to easily diagnose and improve the readability of your content.",
      icon: Info
    }
  ];

  const steps = [
    {
      step: "Step 1",
      title: "Paste or Type Text",
      desc: "Copy your content from any document editor and paste it directly into our secure, browser-based input box, or write it directly from scratch."
    },
    {
      step: "Step 2",
      title: "Real-Time Analysis",
      desc: "Our text analyzer parses your content instantly. Watch the statistics and counts update dynamically with zero lag as you edit."
    },
    {
      step: "Step 3",
      title: "Review Statistics",
      desc: "Analyze standard counts alongside advanced text statistics, including average word length, speaking time, and keyword density percentages."
    },
    {
      step: "Step 4",
      title: "Optimize & Copy",
      desc: "Refine your content based on insights, click the copy button to capture your updated writing, and publish it safely."
    }
  ];

  const benefits = [
    {
      title: "Students & Academic Writers",
      desc: "Meet strict assignment constraints for essays, research papers, and applications. Ensure your arguments are balanced across paragraphs without going over target word budgets.",
      icon: BookOpen,
      color: "border-slate-200 bg-white"
    },
    {
      title: "Bloggers & Content Creators",
      desc: "Draft perfectly sized articles that maintain reader engagement. Keep track of estimated reading times to set expectations and improve user retention on your blog posts.",
      icon: Edit3,
      color: "border-slate-200 bg-white"
    },
    {
      title: "SEO Writers & Copywriters",
      desc: "Optimize copy to compete on Google. Use the keyword density checker to distribute semantic keywords naturally, avoid over-optimization, and check title/meta character lengths.",
      icon: Sparkles,
      color: "border-slate-200 bg-white"
    },
    {
      title: "Freelancers & Translators",
      desc: "Calculate precise word counts for client invoicing or translation quotes. Monitor character constraints for internationalization, marketing campaigns, and ad copy.",
      icon: Users,
      color: "border-slate-200 bg-white"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      
      {/* 1. Full Width Centered Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 text-center">
        {/* Back button */}
        <div className="text-left mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Tools
          </Link>
        </div>

        {/* Hero text content */}
        <div className="space-y-3 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
            Premium Web Tool
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Free Word Counter Tool – Count Words, Characters & Reading Time
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed max-w-2xl mx-auto">
            Instantly count words, characters, sentences, paragraphs, reading time, and keyword density. Secure, private browser-side text analysis with zero data uploads.
          </p>
        </div>
      </div>

      {/* 2. Main Workspace Layout (Sidebar removed) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="w-full space-y-6">
            
            {/* Live Statistics Dashboard */}
             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                { label: "Words", value: stats.words, bg: "bg-slate-50 border-slate-200" },
                { label: "Characters", value: stats.characters, bg: "bg-slate-50 border-slate-200" },
                { label: "Chars (No Space)", value: stats.charsNoSpaces, bg: "bg-slate-50 border-slate-200" },
                { label: "Sentences", value: stats.sentences, bg: "bg-slate-50 border-slate-200" },
                { label: "Paragraphs", value: stats.paragraphs, bg: "bg-slate-50 border-slate-200" },
                { 
                  label: "Reading Time", 
                  value: stats.readingTime, 
                  bg: "bg-slate-50 border-slate-200",
                  hasTooltip: true,
                  tooltipContent: "Based on an average reading speed of 275 words per minute.",
                  tooltipAlign: "right"
                },
              ].map((item, idx) => (
                <div key={idx} className={`bg-white p-4 rounded-xl border text-center transition-all ${item.bg} relative`}>
                  <div className="text-2xl font-black text-slate-800">{item.value}</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1 flex items-center justify-center gap-1">
                    <span>{item.label}</span>
                    {item.hasTooltip && (
                      <Tooltip 
                        content={item.tooltipContent}
                        align={item.tooltipAlign}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Editor */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden focus-within:border-slate-500 focus-within:ring-1 focus-within:ring-slate-200 transition-all">
              <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Input Editor</span>
                <div className="flex gap-2">
                  <button
                    onClick={copyToClipboard}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      copied 
                      ? "bg-slate-800 text-white" 
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200 shadow-3xs"
                    }`}
                    title="Copy to clipboard"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? "Copied!" : "Copy"}
                  </button>
                  <button
                    onClick={clearText}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-600 transition-all shadow-3xs"
                    title="Clear text"
                  >
                    <Trash2 size={14} />
                    Clear
                  </button>
                </div>
              </div>
              <textarea
                autoFocus
                className="w-full h-80 p-6 focus:outline-none resize-none text-base text-slate-700 leading-relaxed font-sans"
                placeholder="Paste your content here or start typing to analyze..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              ></textarea>
            </div>

            {/* Trust & Conversion Section */}
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-semibold text-slate-500 py-2">
              {trustMessaging.map((badge, idx) => (
                <div key={idx} className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-3xs text-slate-600">
                  <badge.icon size={12} className="text-slate-500" />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Keyword Density & Advanced Analytics side-by-side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Keyword Density Checker */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <Search size={18} className="text-slate-700" />
                    Keyword Density Checker
                  </h3>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={excludeStopWords}
                      onChange={(e) => setExcludeStopWords(e.target.checked)}
                      className="rounded border-slate-300 text-slate-800 focus:ring-slate-500"
                    />
                    Exclude Stop Words
                  </label>
                </div>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input
                    type="text"
                    placeholder="Filter keywords..."
                    value={keywordSearch}
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-200 focus:border-slate-500"
                  />
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-200">
                  {[
                    { id: "words", label: "Words (1-Gram)" },
                    { id: "phrases2", label: "Phrases (2 Words)" },
                    { id: "phrases3", label: "Phrases (3 Words)" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setShowAllKeywords(false); // Reset expand on tab switch
                      }}
                      className={`py-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer -mb-px ${
                        activeTab === tab.id
                          ? "border-slate-800 text-slate-900 font-extrabold"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto min-h-[220px]">
                  {!text.trim() || densityList.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      Enter more text to analyze keyword density.
                    </div>
                  ) : filteredDensity.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-xs font-semibold">
                      No keywords found matching "{keywordSearch}".
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="py-2.5 px-1 text-left font-bold">Keyword</th>
                          <th 
                            onClick={() => handleSort("count")}
                            className="py-2.5 px-1 text-right font-bold cursor-pointer select-none hover:text-slate-600 transition-colors"
                          >
                            <span className="inline-flex items-center gap-1">
                              Count
                              {sortField === "count" && (sortDirection === "asc" ? " ▲" : " ▼")}
                            </span>
                          </th>
                          <th 
                            onClick={() => handleSort("density")}
                            className="py-2.5 px-1 text-right font-bold w-1/3 cursor-pointer select-none hover:text-slate-600 transition-colors"
                          >
                            <span className="inline-flex items-center gap-1">
                              Density %
                              {sortField === "density" && (sortDirection === "asc" ? " ▲" : " ▼")}
                            </span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-slate-700">
                        {keywordsToShow.map((item, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 font-medium text-slate-800">{item.word}</td>
                            <td className="py-2 text-right font-semibold">{item.count}</td>
                            <td className="py-2 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-bold text-slate-900">{item.density.toFixed(1)}%</span>
                                <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-slate-800 h-full rounded-full" 
                                    style={{ width: `${Math.min(item.density * 5, 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {text.trim() && filteredDensity.length > 20 && (
                  <button
                    onClick={() => setShowAllKeywords(!showAllKeywords)}
                    className="w-full text-center text-xs text-slate-600 hover:text-slate-800 font-bold transition-colors py-2 border-t border-slate-100 mt-2 block cursor-pointer"
                  >
                    {showAllKeywords ? "Show Less" : "Show More"}
                  </button>
                )}

                {/* Keyword Density Guide */}
                <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Keyword Density Guide
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Keyword density measures how often a term appears relative to the total word count. 
                    While once a major ranking factor, repeating search terms excessively ("keyword stuffing") 
                    harms readability and can trigger search engine spam filters. For optimal SEO performance, 
                    aim for a natural range of <strong className="font-semibold text-slate-700">1%–2%</strong>, 
                    and always prioritize writing clear, helpful content for your audience.
                  </p>
                </div>
              </div>

              {/* Advanced Text Analytics */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 size={18} className="text-slate-700" />
                  Advanced Text Statistics
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { 
                      label: "Speaking Time", 
                      value: stats.speakingTime, 
                      hasTooltip: true,
                      tooltipContent: "Estimated speaking time based on a standard conversational speed of 180 words per minute (WPM).",
                      tooltipAlign: "left"
                    },
                    { label: "Avg Word Length", value: `${stats.avgWordLength} chars`, desc: "Average character count per word" },
                    { label: "Avg Sentence Length", value: `${stats.avgSentenceLength} words`, desc: "Average word count per sentence" },
                    { 
                      label: "Longest Word", 
                      value: stats.longestWord ? `${stats.longestWord} (${stats.longestWord.length} chars)` : "-", 
                      desc: "Longest word found in text and its length" 
                    },
                    { 
                      label: "Top Keywords", 
                      value: stats.topKeywords && stats.topKeywords.length > 0 ? stats.topKeywords.join(", ") : "-", 
                      desc: "Top 3 clean semantic terms used in text" 
                    },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 relative">
                      <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {item.hasTooltip && (
                          <Tooltip 
                            content={item.tooltipContent}
                            align={item.tooltipAlign}
                          />
                        )}
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 mt-1 truncate" title={item.value}>{item.value}</div>
                      {item.desc && <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</div>}
                    </div>
                  ))}
                </div>

            </div>

          </div>
        </div>
      </div>

        {/* Centralized Share & Feedback System - Immediately after workspace */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ShareSystem
          toolName="Word Counter"
          result={(text && text.trim().length > 0 && stats.words > 0) ? {
            summary: `Word Count Analysis: ${stats.words} words, ${stats.characters} characters (${stats.sentences} sentences, ${stats.readingTimeMinutes} min read).`
          } : null}
        />
      </div>

      {/* 3. Full-width Centered Informational Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 border-t border-slate-100">
        
        {/* Features Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Advanced Tool Features</h2>
            <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full"></div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">Everything you need to write and optimize copy efficiently without leaving the browser.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
                <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200">
                  <item.icon size={20} />
                </div>
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works (4 Steps) */}
        <section className="space-y-8 bg-slate-50 p-8 rounded-2xl border border-slate-200">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">How It Works</h2>
            <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full"></div>
            <p className="text-xs text-slate-500">A simple, step-by-step roadmap to check and optimize your content.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            {steps.map((item, idx) => (
              <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 space-y-3 relative overflow-hidden">
                <span className="absolute -right-3 -top-3 text-4xl font-black text-slate-50">{idx + 1}</span>
                <span className="inline-block px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase">
                  {item.step}
                </span>
                <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* About SnapFreeTools Word Counter */}
        <section className="space-y-8 max-w-3xl mx-auto pt-4">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">About SnapFreeTools Word Counter</h2>
            <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full"></div>
          </div>

          {/* Spaced inline callouts for trust elements */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "100% Private", desc: "Text never leaves your device" },
              { title: "Browser-Based", desc: "Client-side processing only" },
              { title: "No Registration", desc: "Free access, no account needed" },
              { title: "Instant Results", icon: Sparkles, desc: "Real-time stats as you type" }
            ].map((box, idx) => (
              <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                <div className="font-bold text-slate-900 text-[10px] uppercase tracking-wider">{box.title}</div>
                <div className="text-[10px] text-slate-500 leading-snug">{box.desc}</div>
              </div>
            ))}
          </div>

          <div className="prose prose-slate max-w-none text-slate-700 space-y-6 text-xs leading-relaxed pt-2">
            <p>
              Drafting high-quality content requires a balance of creative flow and structural discipline. The SnapFreeTools <span className="font-semibold text-slate-900">Word Counter</span> serves as an online <span className="font-semibold text-slate-900">text analyzer</span> designed to help writers audit their content's metrics instantly.
            </p>
            <p>
              By offering immediate counts for words, characters, sentences, and paragraphs, this utility becomes a core component of any writing workspace. Unlike traditional offline programs where stats are hidden inside menu configurations, our <span className="font-semibold text-slate-900">free word counter</span> provides real-time feedback right inside your browser window.
            </p>
            <p>
              A primary metric for any document is the character count. Knowing whether you need to track characters including spaces or characters excluding spaces is critical when working under strict layout constraints.
            </p>
            <p>
              For example, a social media manager crafting short-form posts for platforms like Twitter or Instagram must stay within strict character limits (such as <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">280 characters</strong> for tweets) to prevent truncation.
            </p>
            <p>
              Similarly, SEO specialists must write meta titles under <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">60 characters</strong> and meta descriptions under <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">160 characters</strong> to ensure search snippets display correctly. Our <span className="font-semibold text-slate-900">character counter</span> tracks both metrics simultaneously, letting you edit layout configurations without manual math.
            </p>
            <p>
              For creators budgeting readability and user attention, the <span className="font-semibold text-slate-900">reading time calculator</span> provides an essential estimate. By using a standard rate of <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">275 WPM</strong> (words per minute), the tool estimates how long it takes an average adult to read your draft.
            </p>
            <p>
              Freelancers creating newsletters or blog posts can add these reading time estimates to headers (e.g., &ldquo;5-min read&rdquo;) to boost click-through rates. Bloggers use this parameter to align with reader habits, matching their post length to the targeted context—such as a quick 2-minute update for mobile readers or a comprehensive 10-minute guide for deep research.
            </p>
            <p>
              Keyword optimization is another critical step, managed by our <span className="font-semibold text-slate-900">keyword density checker</span>. It calculates the percentage of times each word appears relative to the total word count. If a writer mentions a term too often, the content can look unnatural or trigger keyword stuffing warnings.
            </p>
            <p>
              For example, an SEO writer optimizing an article for a search term like &ldquo;<span className="font-semibold text-slate-900">online word counter</span>&rdquo; can verify keyword density stays within the target <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">1%–2% keyword density</strong> range. If the frequency exceeds 2.5%, the checker alerts you so you can replace repetitive terms with natural synonyms, maintaining quality.
            </p>
            <p>
              Students and academic writers face strict constraints when composing essays and research papers. College admissions, such as the Common App personal statement, enforce a strict limit of <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">250–650 words</strong>. In these formats, every word must contribute to the overall narrative.
            </p>
            <p>
              For longer term papers or graduate research essays (often ranging from <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">1500–2500 words</strong>), staying close to the limit is key. Exceeding boundaries indicates poor editing, while falling short suggests a lack of depth. Using a <span className="font-semibold text-slate-900">word count tool</span> helps students track paragraphs and sentences, helping them budget their arguments across sections.
            </p>
            <p>
              For bloggers and digital publishers, word count directly correlates with visitor retention and social sharing rates. Short posts are fine for news, but comprehensive posts between <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">1500–2500 words</strong> rank higher because search engines prefer detailed, helpful answers.
            </p>
            <p>
              A blogger can draft long-form guides, using paragraph counters and average word length statistics to ensure the readability remains accessible. This technical editing ensures search visibility while offering real value to readers.
            </p>
            <p>
              Additionally, our advanced text statistics provide insights into reading ease. The tool measures average word length and average sentence length. Writing that features excessively long sentences can feel heavy. By maintaining an average sentence rating of 15 to 20 words, writers can improve readability.
            </p>
            <p>
              Public speakers and scriptwriters prepared for presentations can use the speaking time calculator, which estimates conversational speed at <strong className="font-semibold text-slate-900 bg-slate-100 px-1 py-0.5 rounded text-[10px]">180 WPM</strong>, to time scripts and keep speeches on pace.
            </p>
            <p>
              In summary, the SnapFreeTools <span className="font-semibold text-slate-900">Word Counter</span> is a privacy-focused text analysis platform built to meet professional writing requirements. Because all text calculations run client-side inside your browser, your drafts are never uploaded, keeping your work 100% private.
            </p>
            <p>
              Whether you are a student editing an essay, a blogger optimizing search visibility, a copywriter refining title tags, or a freelancer invoicing clients based on word volume, this utility provides the accurate metrics you need to publish content with confidence.
            </p>
          </div>
        </section>

        {/* AI Quick Answers / GEO Box */}
        <section className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Sparkles size={16} className="text-slate-600" />
            <span>AI Search & Quick Answers</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-700">
            <div className="space-y-1 bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900">What is a Word Counter?</div>
              <p className="leading-relaxed">
                A word counter is a digital tool that counts the number of words, characters, sentences, and paragraphs in a text block, helping writers monitor document length.
              </p>
            </div>
            <div className="space-y-1 bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900">How does a Word Counter work?</div>
              <p className="leading-relaxed">
                It splits the input text by whitespace delimiters to calculate words, counts individual string letters for characters, and runs punctuation checks for sentences and paragraphs.
              </p>
            </div>
            <div className="space-y-1 bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900">What is Keyword Density?</div>
              <p className="leading-relaxed">
                Keyword density is the frequency percentage of a word relative to the total word count, indicating how focused a text is on a search term.
              </p>
            </div>
            <div className="space-y-1 bg-white p-4 rounded-lg border border-slate-200">
              <div className="font-bold text-slate-900">How is Reading Time calculated?</div>
              <p className="leading-relaxed">
                Reading time is estimated by dividing the total word count by 275, which is the average words read per minute by a typical adult reader.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full"></div>
            <p className="text-xs text-slate-500">Quick answers to common questions about using our online word calculator.</p>
          </div>

          <div className="space-y-4">
            {visibleFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left font-bold text-slate-800 hover:bg-slate-50 transition-colors text-sm"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      size={16} 
                      className={`text-slate-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-6 pb-4 text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
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

        {/* Related Tools Section */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Related Productivity Tools</h2>
            <div className="w-12 h-1 bg-slate-800 mx-auto rounded-full"></div>
            <p className="text-xs text-slate-500">Explore more free, fast, and secure tools from SnapFreeTools.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link 
              href="/image-compressor" 
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-400 transition-all space-y-3 group block"
            >
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200">
                <ImageIcon size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-800 transition-colors">
                Free Image Compressor
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Compress JPEG, PNG, WEBP, and AVIF images up to 90% without losing quality using fast browser-side processing.
              </p>
              <div className="text-slate-700 text-xs font-bold flex items-center gap-1 transition-all">
                Compress Images <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/gpa-calculator" 
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-400 transition-all space-y-3 group block"
            >
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200">
                <Calculator size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-800 transition-colors">
                Online GPA Calculator
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Calculate college or school GPA on a 4.0 scale. Log grades, credit weights, and calculate semester averages.
              </p>
              <div className="text-slate-700 text-xs font-bold flex items-center gap-1 transition-all">
                Calculate GPA <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            <Link 
              href="/pdf-to-word" 
              className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-400 transition-all space-y-3 group block"
            >
              <div className="w-10 h-10 bg-slate-50 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200">
                <FileType size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-slate-800 transition-colors">
                PDF to Word Converter
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Convert your PDF documents into editable Word DOCX files with formatting structure kept intact. Coming soon!
              </p>
              <div className="text-slate-700 text-xs font-bold flex items-center gap-1 transition-all">
                Convert PDF <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </section>

      </div>

    </div>
  );
}
