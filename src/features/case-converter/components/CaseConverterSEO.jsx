import React, { useState } from "react";
import { ChevronDown, ShieldCheck, Zap, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";

export default function CaseConverterSEO({ faqs = [] }) {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="mt-16 space-y-12 max-w-5xl mx-auto border-t border-slate-200/60 pt-12">
      
      {/* Privacy Guarantee Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-emerald-400" />
              100% Client-Side & Private
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Your Text Never Leaves Your Browser
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              SnapFreeTools processes all case conversions and text transformations locally inside your web browser RAM using JavaScript. No drafts are uploaded to servers, logged in databases, or tracked anywhere.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/10 shrink-0">
            <Zap size={24} className="text-amber-400 shrink-0" />
            <div className="text-left">
              <div className="text-xs font-black text-white">Zero Server Latency</div>
              <div className="text-[10px] text-slate-300 font-semibold">Instant In-Browser Execution</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Educational Copy */}
      <section className="space-y-8 text-slate-700">
        
        {/* Intro */}
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Sparkles size={22} className="text-amber-500" />
            Online Case Converter
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 font-medium">
            SnapFreeTools Case Converter is a free, ultra-fast online text transformation tool. Whether you are a programmer needing <code className="bg-slate-100 text-amber-800 px-1.5 py-0.5 rounded font-mono text-xs">camelCase</code> variables, a writer formatting headlines in <strong>Title Case</strong>, or a blogger generating clean URL slugs, our tool lets you switch between 16 case formats instantly.
          </p>
        </div>

        {/* Supported Cases Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900">
            Supported Text Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                UPPER CASE & lower case
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Converts all characters to capital letters (<code className="text-amber-700">HELLO WORLD</code>) or lowercase letters (<code className="text-amber-700">hello world</code>).
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Smart Title Case
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Capitalizes principal words in titles while keeping minor articles and prepositions (a, an, the, of, in) lowercase.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Sentence case
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Detects sentence boundaries (<code className="text-amber-700">. ! ?</code>) and capitalizes only the starting letter of each sentence.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                camelCase & PascalCase
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Standard code naming conventions. Creates <code className="text-amber-700">myVariableName</code> and <code className="text-amber-700">MyClassName</code> formats for Java, JS, C#.
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                snake_case & kebab-case
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Ideal for database column names (<code className="text-amber-700">user_profile_id</code>) and CSS class names or URLs (<code className="text-amber-700">header-navigation-bar</code>).
              </p>
            </div>

            <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-1 shadow-xs">
              <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                CONSTANT_CASE & slug-case
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                For environment variables (<code className="text-amber-700">API_SECRET_KEY</code>) and SEO-optimized web page URLs (<code className="text-amber-700">best-case-converter-tool</code>).
              </p>
            </div>

          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
          <h2 className="text-xl font-black text-slate-900">
            How to Use the Case Converter
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900">Enter or Paste Text</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Type or paste your text into the left input editor. You can also click <strong>Sample Text</strong> to see a instant demo.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900">Choose Case Style</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Select your target case format from the 16 conversion modes or click a smart text utility to clean up formatting.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-black text-sm flex items-center justify-center">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900">Copy or Download</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                Click <strong>Copy Output</strong> or <strong>Download .txt</strong> to save your transformed text immediately.
              </p>
            </div>

          </div>
        </div>

      </section>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle className="text-amber-500" size={24} />
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-semibold max-w-xl mx-auto">
              Everything you need to know about online text case conversion and privacy.
            </p>
          </div>

          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left font-bold text-slate-800 text-sm flex justify-between items-center hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      size={16}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                        isOpen ? "rotate-180 text-amber-500" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

    </div>
  );
}
