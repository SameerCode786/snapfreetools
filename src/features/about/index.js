"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import * as Icons from "lucide-react";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { getAboutSchema, getAboutBreadcrumbSchema, JsonLd } from "@/seo/structured-data";

export default function AboutFeature() {
  // Dynamic counts from registry
  const pdfCount = ALL_TOOLS.filter(t => t.group === "PDF Tools" && t.status === "live").length;
  const calculatorsCount = ALL_TOOLS.filter(t => t.group === "Calculators" && t.status === "live").length;
  const textCount = ALL_TOOLS.filter(t => t.group === "Text Tools" && t.status === "live").length;
  const imageCount = ALL_TOOLS.filter(t => t.group === "Image Tools" && t.status === "live").length;

  return (
    <>
      <JsonLd schema={getAboutSchema()} />
      <JsonLd schema={getAboutBreadcrumbSchema()} />
      
      <div id="about-page" className="bg-slate-50/50 min-h-screen pb-16">
        
        {/* HERO SECTION */}
        <section className="relative pt-16 pb-12 text-center px-4 overflow-hidden border-b border-slate-200/50 bg-white">
          <div aria-hidden="true" className="absolute top-0 left-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div aria-hidden="true" className="absolute bottom-0 right-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-4xl mx-auto space-y-5 relative z-10">
            <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-extrabold uppercase tracking-widest select-none">
              <Icons.Info size={10} className="text-emerald-500" />
              About SnapFreeTools
            </span>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Simple tools. <br />
              <span className="text-amber-500 italic font-serif">Smarter everyday work.</span>
            </h1>
            
            <p className="text-sm sm:text-base text-slate-500 max-w-2xl mx-auto leading-relaxed font-semibold md:line-clamp-2">
              SnapFreeTools brings practical online utilities into one fast, accessible, and easy-to-use platform for students, professionals, creators, and everyday users.
            </p>

            {/* Trust Row */}
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 pt-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none">
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                Free tools
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                Privacy-conscious
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                No unnecessary signup
              </div>
              <div className="flex items-center gap-1.5">
                <Icons.CheckCircle2 size={12} className="text-emerald-500" />
                Built for everyday tasks
              </div>
            </div>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Our Story</h2>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              Why SnapFreeTools was created
            </h3>
            <p className="text-sm text-slate-550 leading-relaxed font-semibold">
              SnapFreeTools was created to make common digital tasks easier. Many online tools are cluttered, confusing, or hidden behind unnecessary registrations. The platform focuses on clear workflows, useful results, and simple access.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-slate-450 uppercase tracking-wider">Primary Operations Supported</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-500 select-none">
                  <Icons.FileText size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800">Convert documents</h5>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Word format, PDF documents.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-500 select-none">
                  <Icons.Calculator size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800">Calculate academic results</h5>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">GPA, SGPA, CGPA scales.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-500 select-none">
                  <Icons.Image size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800">Compress images</h5>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Quality scaling, custom browser sizes.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center shrink-0 text-amber-500 select-none">
                  <Icons.Type size={14} />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-800">Analyze text</h5>
                  <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Word density limits, characters casing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.Target size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-850">Our Mission</h4>
              <p className="text-sm text-slate-550 leading-relaxed font-semibold">
                Make useful online tools easier to access, understand, and use.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center select-none">
                <Icons.Eye size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Our Vision</h4>
              <p className="text-sm text-slate-550 leading-relaxed font-semibold">
                Build a trusted productivity platform where users can quickly find practical tools for everyday digital tasks.
              </p>
            </div>
          </div>
        </section>

        {/* WHO IT IS BUILT FOR */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Audience</h2>
            <h3 className="text-xl font-black text-slate-900 mt-1">Who it is built for</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.GraduationCap size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Students</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                GPA, CGPA, SGPA, merit, and academic tools.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Briefcase size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Professionals</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Document conversion and productivity tools.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Palette size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Creators</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Image compression and text analysis.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200/80 rounded-xl space-y-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 select-none">
                <Icons.Heart size={16} />
              </div>
              <h4 className="text-sm font-black text-slate-855">Everyday Users</h4>
              <p className="text-[13.5px] text-slate-500 leading-relaxed font-semibold">
                Simple utilities without complicated setup.
              </p>
            </div>
          </div>
        </section>

        {/* CORE PRINCIPLES */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Values</h2>
            <h3 className="text-xl font-black text-slate-900 mt-1">Core Principles</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">1. Simplicity</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Clear interfaces and easy workflows.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">2. Accessibility</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Useful tools designed for different devices and users.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">3. Privacy-conscious design</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Browser-side processing is used where supported.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">4. Honest functionality</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                No fake results, fake progress, or unsupported claims.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">5. Free access</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Core tools remain available without unnecessary barriers.
              </p>
            </div>

            <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-2">
              <h4 className="text-sm font-black text-slate-800">6. Continuous improvement</h4>
              <p className="text-[13px] text-slate-500 font-semibold leading-relaxed">
                Tools and guidance improve based on real user needs.
              </p>
            </div>
          </div>
        </section>

        {/* HOW THE PLATFORM WORKS */}
        <section className="bg-white border-y border-slate-200/50 py-12">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 text-center">
            <div className="mb-8">
              <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Process</h2>
              <h3 className="text-xl font-black text-slate-900 mt-1">How the platform works</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-xs font-black select-none">
                  1
                </div>
                <h4 className="text-sm font-black text-slate-850">Choose a tool</h4>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                  Browse category routes or use the instant index directory.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-xs font-black select-none">
                  2
                </div>
                <h4 className="text-sm font-black text-slate-855">Add file or info</h4>
                <p className="text-xs text-slate-550 leading-relaxed font-semibold">
                  Input text, set values, or upload the target processing file.
                </p>
              </div>

              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto text-xs font-black select-none">
                  3
                </div>
                <h4 className="text-sm font-black text-slate-855">Get result</h4>
                <p className="text-xs text-slate-555 leading-relaxed font-semibold">
                  Preview computed results and click download instantly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRIVACY & TRUST SECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-6">
          <div className="bg-[#08111F] text-white p-8 rounded-2xl relative overflow-hidden border border-slate-800/80 shadow-2xl">
            <div aria-hidden="true" className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center select-none">
                <Icons.Lock size={16} />
              </div>
              <h3 className="text-xl font-black tracking-tight leading-tight text-white">
                Designed with trust in mind
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                Many SnapFreeTools utilities process data directly in the browser, helping reduce unnecessary uploads and complicated workflows. Processing behavior and limits are explained clearly on individual tool pages.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-300 select-none">
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Clear tool limits
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  No unnecessary signup
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Browser-side processing where supported
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  Transparent legal policies
                </div>
                <div className="flex items-center gap-2">
                  <Icons.CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                  No fake claims
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-800/80 text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
                <span>&bull;</span>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
                <span>&bull;</span>
                <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM CATEGORIES */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10">
          <div className="text-center mb-8">
            <h2 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Ecosystem</h2>
            <h3 className="text-xl font-black text-slate-900 mt-1">Platform Categories</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* PDF Category */}
            <Link
              href="/pdf-tools"
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-200/60 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-550 group-hover:text-amber-500 group-hover:bg-white transition-all shrink-0 mb-3.5">
                <Icons.FileType size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-850">PDF Tools</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
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
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-200/60 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-550 group-hover:text-amber-500 group-hover:bg-white transition-all shrink-0 mb-3.5">
                <Icons.Calculator size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-850">Calculators</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
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
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-200/60 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-555 group-hover:text-amber-500 group-hover:bg-white transition-all shrink-0 mb-3.5">
                <Icons.FileText size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-850">Text Tools</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
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
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-amber-200/60 shadow-sm hover:shadow transition-all group outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-555 group-hover:text-amber-500 group-hover:bg-white transition-all shrink-0 mb-3.5">
                <Icons.Image size={20} />
              </div>
              <h4 className="text-sm font-black text-slate-850">Image Tools</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed font-semibold">
                Compress sizes, convert scales, and adjust dimensions inside the browser.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] font-extrabold uppercase tracking-wider text-slate-400 group-hover:text-amber-500">
                <span>{imageCount} Live Tool</span>
                <Icons.ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </section>

        {/* FUTURE DIRECTION */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-8 py-10">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-xs font-extrabold text-amber-500 uppercase tracking-widest">Roadmap</h4>
            <h3 className="text-xl font-black text-slate-900 leading-tight">Growing with useful tools</h3>
            <p className="text-sm text-slate-550 leading-relaxed font-semibold max-w-2xl">
              SnapFreeTools will continue expanding into document utilities, productivity calculators, text tools, image tools, and helpful learning resources.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 select-none">
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">More PDF tools</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">More calculators</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">Text utilities</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">Image utilities</span>
              <span className="text-[9px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">Guides and resources</span>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 text-center pt-8 pb-8">
          <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl space-y-4">
            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">Explore tools built for everyday work</h3>
              <p className="text-xs text-slate-550 font-semibold">Choose a free tool and get started without unnecessary setup.</p>
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
