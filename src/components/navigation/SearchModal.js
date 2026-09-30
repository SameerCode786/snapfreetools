"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, ArrowRight, CornerDownLeft, Sparkles, Sliders } from "lucide-react";
import { Icons } from "@/lib/lucide-icons";
import { searchToolsIndex } from "./navigationIndex";

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  // Search results
  const results = searchToolsIndex(query, 8);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const selected = results[selectedIndex] || results[0];
        if (selected) {
          router.push(`/${selected.slug}`);
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, router, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs">
        {/* Backdrop click to close */}
        <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search tools modal"
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden pointer-events-auto z-10"
        >
          {/* Search Input Field Header */}
          <div className="flex items-center px-5 py-4 border-b border-slate-100 gap-3">
            <Search size={20} className="text-amber-500 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search 40+ tools (e.g. compress pdf, gpa, word count)..."
              className="w-full bg-transparent text-sm font-extrabold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
            <span className="hidden sm:inline-block text-[10px] font-black text-slate-400 bg-slate-100 border border-slate-200/60 px-2 py-1 rounded-lg uppercase">
              ESC
            </span>
          </div>

          {/* Results List */}
          <div className="max-h-[380px] overflow-y-auto p-3 space-y-2">
            {query.trim() === "" ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <Search size={28} className="mx-auto text-slate-300" />
                <p className="text-xs font-semibold">Type a tool name, category, or keyword to search...</p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="text-[10px] text-slate-400 font-bold">Popular:</span>
                  {["GPA Calculator", "Edit PDF Metadata", "Word Counter", "PDF to Word"].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="text-[10px] bg-slate-100 hover:bg-amber-50 hover:text-amber-600 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md font-bold transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-1">
                <p className="text-xs font-bold text-slate-600">No matching tools found for "{query}"</p>
                <p className="text-[11px]">Try searching for PDF, Calculator, Image, or Text tools.</p>
              </div>
            ) : (
              <ul className="space-y-1">
                {results.map((item, idx) => {
                  const IconComp = Icons[item.icon] || Icons.FileText;
                  const isSelected = idx === selectedIndex;
                  const isAi = item.ecosystem === "ai";

                  return (
                    <li key={item.id}>
                      <Link
                        href={`/${item.slug}`}
                        onClick={onClose}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between p-3 rounded-2xl transition-all outline-none ${
                          isSelected
                            ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10"
                            : "bg-slate-50/60 hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-slate-950 text-amber-400"
                                : isAi
                                ? "bg-amber-100 text-amber-700"
                                : "bg-white border border-slate-200 text-slate-600"
                            }`}
                          >
                            <IconComp size={15} />
                          </div>
                          <div className="truncate">
                            <h5 className="text-xs font-extrabold truncate flex items-center gap-1.5">
                              {item.name}
                              {isAi && (
                                <span className="text-[8px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-black uppercase">
                                  AI
                                </span>
                              )}
                            </h5>
                            <p
                              className={`text-[10px] truncate ${
                                isSelected ? "text-slate-900 font-medium" : "text-slate-400 font-medium"
                              }`}
                            >
                              {item.group} &rarr; {item.subcategory || item.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isSelected && (
                            <span className="text-[10px] font-black flex items-center gap-1 opacity-80">
                              Open <CornerDownLeft size={10} />
                            </span>
                          )}
                          <ArrowRight
                            size={14}
                            className={isSelected ? "text-slate-950" : "text-slate-400"}
                          />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer Instructions */}
          <div className="bg-slate-50 px-5 py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-bold">
            <div className="flex items-center gap-3">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>ESC Close</span>
            </div>
            <span className="text-amber-600 font-extrabold">SnapFreeTools Search</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
