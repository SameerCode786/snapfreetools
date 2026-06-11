"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { FileText, Copy, Trash2 } from "lucide-react";
import React from "react";
import ToolLayout from "@/layouts/tool-layout";
import { calculateTextStats } from "./utils/counter-engine";

export default function WordCounter() {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: 0,
  });

  useEffect(() => {
    const computedStats = calculateTextStats(text);
    setStats(computedStats);
  }, [text]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  const clearText = () => {
    setText("");
  };

  return (
    <ToolLayout>
      <div id="word-counter-page" className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-primary rounded-xl mb-4">
            <FileText size={24} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Word Counter</h1>
          <p className="text-slate-600">Count words, characters, and sentences in real-time.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Words", value: stats.words },
            { label: "Characters", value: stats.characters },
            { label: "Sentences", value: stats.sentences },
            { label: "Paragraphs", value: stats.paragraphs },
            { label: "Read Time", value: `${stats.readingTime} min` },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-2xl font-bold text-primary">{item.value}</div>
              <div className="text-xs text-slate-500 font-medium uppercase tracking-wider">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase">Input Text</span>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="p-1.5 hover:bg-slate-200 rounded-md text-slate-600 transition-colors"
                title="Copy to clipboard"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={clearText}
                className="p-1.5 hover:bg-red-100 hover:text-red-500 rounded-md text-slate-600 transition-colors"
                title="Clear text"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <textarea
            autoFocus
            className="w-full h-80 p-6 focus:outline-none resize-none text-lg text-slate-700 leading-relaxed"
            placeholder="Paste your text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="font-bold mb-2 text-blue-900">About this tool</h3>
          <p className="text-sm text-blue-800 leading-relaxed">
            Word count is important for content creators, students, and writers. 
            Most publishers have specific word limits. Our tool helps you stay within those limits 
            while also providing insights into your writing structure.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
