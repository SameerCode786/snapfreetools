import Link from "next/link";
import * as Icons from "lucide-react";
import { getToolsByEcosystem } from "@/components/navigation/navigationIndex";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "AI Tools Directory - Free AI Writing, PDF & Developer Tools | SnapFreeTools",
  description: "Discover free AI-powered online tools for writing, document analysis, PDF chatting, code explanations, and content optimization.",
  alternates: {
    canonical: "https://www.snapfreetools.com/ai-tools",
  },
};

export default function Page() {
  const aiTools = getToolsByEcosystem("ai");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/ai-tools/#webpage",
        "url": "https://www.snapfreetools.com/ai-tools",
        "name": "AI Tools Directory | SnapFreeTools",
        "description": "Discover free AI-powered online tools for writing, document analysis, PDF chatting, and coding.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/ai-tools/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/ai-tools/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com",
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "AI Tools",
            "item": "https://www.snapfreetools.com/ai-tools",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[10px] font-black uppercase tracking-widest">
            <Icons.Sparkles size={12} className="text-amber-500" /> AI ECOSYSTEM
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Free Online AI Tools
          </h1>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Boost your productivity with artificial intelligence tools for writing, document interaction, and code analysis.
          </p>
        </div>

        {/* AI Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {aiTools.map((tool) => {
            const IconComp = Icons[tool.icon] || Icons.Sparkles;
            const isLive = tool.status === "live" && !tool.future;

            if (!isLive) {
              return (
                <div
                  key={tool.id}
                  className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between select-none opacity-85"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
                        <IconComp size={20} />
                      </div>
                      <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                        Coming Soon
                      </span>
                    </div>
                    <div className="space-y-1 text-left">
                      <h3 className="font-extrabold text-slate-800 text-sm leading-snug">{tool.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{tool.description}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                    <span className="text-[11px] font-bold text-slate-400 cursor-not-allowed">
                      In Development
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={tool.id}
                href={`/${tool.slug}`}
                className="bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group text-left"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
                      <IconComp size={20} />
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                      Live AI
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-amber-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
                  Open AI Tool &rarr;
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
