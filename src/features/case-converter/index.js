"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { 
  Copy, Check, Download, Trash2, ArrowRightLeft, Sparkles, 
  FileText, Clipboard, Scissors, ShieldCheck, Zap, RotateCcw, 
  CheckCircle2, Info
} from "lucide-react";

import { convertTextCase } from "./utils/caseConverter";
import * as textTransformations from "./utils/textTransformations";
import { calculateTextStats } from "./utils/textStats";

import CaseSelector from "./components/CaseSelector";
import TransformationsMenu from "./components/TransformationsMenu";
import TextStats from "./components/TextStats";
import CaseConverterSEO from "./components/CaseConverterSEO";
import ShareSystem from "@/components/share";

const SAMPLE_TEXT = `hello world! welcome to SnapFreeTools.
this is a PRIVACY-FIRST client-side case converter tool.
convert text between UPPERCASE, lowercase, Title Case, camelCase, and snake_case instantly!`;

export default function CaseConverterFeature({ faqs = [] }) {
  const [inputText, setInputText] = useState("");
  const [activeMode, setActiveMode] = useState("uppercase");
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const [preserveSpaces, setPreserveSpaces] = useState(true);

  // Copy feedback & toast notifications
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const inputRef = useRef(null);
  const outputRef = useRef(null);

  // Show temporary toast message
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Convert text on the fly
  const outputText = useMemo(() => {
    if (!inputText) return "";
    let processed = inputText;

    if (!preserveSpaces) {
      processed = textTransformations.removeExtraSpaces(processed);
    }

    return convertTextCase(processed, activeMode, { preserveLineBreaks });
  }, [inputText, activeMode, preserveLineBreaks, preserveSpaces]);

  // Calculate text statistics for input
  const stats = useMemo(() => {
    return calculateTextStats(inputText);
  }, [inputText]);

  // Handle Clipboard Paste into Input
  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        setInputText(text);
        showToast("Pasted text from clipboard!");
      } else {
        showToast("Clipboard read not supported by browser. Use Ctrl+V.");
      }
    } catch {
      showToast("Clipboard access permission denied.");
    }
  };

  // Handle Copy Output
  const handleCopyOutput = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiedOutput(true);
      showToast("Converted text copied to clipboard!");
      setTimeout(() => setCopiedOutput(false), 2000);
    } catch {
      showToast("Failed to copy text.");
    }
  };

  // Handle Copy Input
  const handleCopyInput = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
      setCopiedInput(true);
      showToast("Input text copied to clipboard!");
      setTimeout(() => setCopiedInput(false), 2000);
    } catch {
      showToast("Failed to copy text.");
    }
  };

  // Handle Download Output as .txt
  const handleDownload = () => {
    if (!outputText) return;
    try {
      const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeFilename = `${activeMode.toLowerCase()}-text.txt`;
      link.download = safeFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`Downloaded as ${safeFilename}`);
    } catch {
      showToast("Failed to download file.");
    }
  };

  // Handle Clear Input
  const handleClear = () => {
    if (!inputText) return;
    if (inputText.length > 800) {
      if (!window.confirm("Are you sure you want to clear your text?")) return;
    }
    setInputText("");
    showToast("Text cleared!");
  };

  // Handle Swap (Output -> Input)
  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    showToast("Output swapped into input!");
  };

  // Handle Select All Output
  const handleSelectAllOutput = () => {
    if (outputRef.current) {
      outputRef.current.select();
      showToast("Output selected!");
    }
  };

  // Apply Smart Text Transformation
  const handleApplyTransformation = (type) => {
    if (!inputText) return;
    let result = inputText;
    switch (type) {
      case "remove-extra-spaces":
        result = textTransformations.removeExtraSpaces(result);
        break;
      case "trim-lines":
        result = textTransformations.trimEveryLine(result);
        break;
      case "remove-blank-lines":
        result = textTransformations.removeDuplicateBlankLines(result);
        break;
      case "remove-line-breaks":
        result = textTransformations.removeLineBreaks(result);
        break;
      case "remove-all-spaces":
        result = textTransformations.removeAllWhitespace(result);
        break;
      case "tabs-to-spaces":
        result = textTransformations.convertTabsToSpaces(result);
        break;
      case "remove-punctuation":
        result = textTransformations.removePunctuation(result);
        break;
      case "remove-numbers":
        result = textTransformations.removeNumbers(result);
        break;
      case "keep-numbers":
        result = textTransformations.keepOnlyNumbers(result);
        break;
      case "keep-letters":
        result = textTransformations.keepOnlyLetters(result);
        break;
      case "reverse-text":
        result = textTransformations.reverseText(result);
        break;
      case "reverse-words":
        result = textTransformations.reverseWords(result);
        break;
      default:
        break;
    }
    setInputText(result);
    showToast("Transformation applied to input!");
  };

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl/Cmd + Shift + C -> Copy Output
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handleCopyOutput();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [outputText]);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      
      {/* Toast Notification Floating Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative pt-12 pb-8 text-center px-4 bg-white border-b border-slate-200/50">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest select-none">
            <Sparkles size={12} className="text-amber-500" />
            100% Client-Side Text Tool
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Online <span className="text-amber-500 italic font-serif">Case Converter</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
            Convert text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and more in real time. Private and in-browser.
          </p>

          <div className="flex justify-center items-center gap-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none pt-1">
            <div className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              100% Private
            </div>
            <div className="flex items-center gap-1">
              <Zap size={13} className="text-amber-500" />
              Instant Live Preview
            </div>
            <div className="flex items-center gap-1">
              <FileText size={13} className="text-blue-500" />
              16 Case Modes
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Case Mode Selector */}
        <CaseSelector activeMode={activeMode} setActiveMode={setActiveMode} />

        {/* Conversion Preferences & Smart Utilities */}
        <TransformationsMenu
          preserveLineBreaks={preserveLineBreaks}
          setPreserveLineBreaks={setPreserveLineBreaks}
          preserveSpaces={preserveSpaces}
          setPreserveSpaces={setPreserveSpaces}
          onApplyTransformation={handleApplyTransformation}
        />

        {/* Two Panel Text Editor (Desktop: Side-by-side; Mobile: Vertical stack) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* LEFT PANEL: Input Textarea */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            
            {/* Input Toolbar Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Original Input Text
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePaste}
                  title="Paste from clipboard"
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200/60 flex items-center gap-1 cursor-pointer"
                >
                  <Clipboard size={13} />
                  <span className="hidden sm:inline">Paste</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInputText(SAMPLE_TEXT)}
                  title="Load sample text"
                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200/60 flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles size={13} className="text-amber-500" />
                  <span className="hidden sm:inline">Sample</span>
                </button>

                {inputText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    title="Clear input text"
                    className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 size={13} />
                    <span className="hidden sm:inline">Clear</span>
                  </button>
                )}
              </div>
            </div>

            {/* Input Textarea */}
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here to convert text case..."
                aria-label="Input text to convert case"
                className="w-full h-full min-h-[300px] p-4 bg-slate-50/50 hover:bg-white focus:bg-white border border-slate-200/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none transition-all resize-y leading-relaxed font-sans"
              />
            </div>

            {/* Input Footer Badges */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pt-1">
              <div className="flex items-center gap-3">
                <span>{stats.words} Words</span>
                <span>•</span>
                <span>{stats.characters} Characters</span>
              </div>

              {inputText && (
                <button
                  type="button"
                  onClick={handleCopyInput}
                  className="text-amber-600 hover:text-amber-700 font-extrabold flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  {copiedInput ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedInput ? "Copied Input!" : "Copy Input"}</span>
                </button>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: Converted Output Textarea */}
          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            
            {/* Output Toolbar Header */}
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Converted Output Result
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5">
                {outputText && (
                  <>
                    <button
                      type="button"
                      onClick={handleSwap}
                      title="Swap output back to input"
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold transition-all border border-amber-200/60 flex items-center gap-1 cursor-pointer"
                    >
                      <ArrowRightLeft size={13} />
                      <span className="hidden sm:inline">Swap</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSelectAllOutput}
                      title="Select all output text"
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold transition-all border border-slate-200/60 flex items-center gap-1 cursor-pointer"
                    >
                      <Scissors size={13} />
                      <span className="hidden sm:inline">Select All</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Output Textarea */}
            <div className="relative flex-1">
              <textarea
                ref={outputRef}
                readOnly
                value={outputText}
                placeholder="Converted text will appear here automatically..."
                aria-label="Converted text output"
                className="w-full h-full min-h-[300px] p-4 bg-slate-50/80 border border-slate-200/80 rounded-2xl text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none transition-all resize-y leading-relaxed font-sans cursor-text"
              />
            </div>

            {/* Output Footer Actions: Copy & Download */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              
              <div className="text-xs font-bold text-slate-400">
                {outputText ? `${stats.characters} Chars (${stats.words} Words)` : "Empty"}
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  disabled={!outputText}
                  onClick={handleDownload}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Download size={14} />
                  <span>Download .txt</span>
                </button>

                <button
                  type="button"
                  disabled={!outputText}
                  onClick={handleCopyOutput}
                  className="flex-1 sm:flex-none px-5 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-white text-xs font-black rounded-xl shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {copiedOutput ? <Check size={15} /> : <Copy size={15} />}
                  <span>{copiedOutput ? "Copied!" : "Copy Output"}</span>
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Live Text Statistics Panel */}
        <TextStats stats={stats} />

        {/* Centralized Share System */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ShareSystem
            toolName="Case Converter"
            toolSlug="/case-converter"
            result={outputText ? {
              summary: `Transformed ${stats.words} words (${stats.characters} characters) into ${activeMode.toUpperCase()} format!`
            } : null}
          />
        </div>

        {/* SEO Educational Content & FAQ */}
        <CaseConverterSEO faqs={faqs} />

      </main>
    </div>
  );
}
