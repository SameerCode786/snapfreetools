import Link from "next/link";
import * as Icons from "lucide-react";
import { getLiveTools, getGroupsByEcosystem } from "@/components/navigation/navigationIndex";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Online Tools Directory - Free PDF, Calculators, Images & Text Tools | SnapFreeTools",
  description: "Browse 40+ free online tools for PDF conversion, GPA calculators, image compression, word counting, and productivity.",
  alternates: {
    canonical: "https://www.snapfreetools.com/tools",
  },
};

export default function Page() {
  const liveTools = getLiveTools();
  const groups = getGroupsByEcosystem("utility");

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/tools/#webpage",
        "url": "https://www.snapfreetools.com/tools",
        "name": "Online Tools Directory | SnapFreeTools",
        "description": "Browse free online tools for PDF, calculators, image, and text operations.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/tools/#breadcrumb",
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/tools/#breadcrumb",
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
            "name": "Tools Directory",
            "item": "https://www.snapfreetools.com/tools",
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
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-black uppercase tracking-widest">
            ALL TOOLS DIRECTORY
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Free Online Productivity Tools
          </h1>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Fast, private, 100% browser-based tools for PDF management, academic calculators, text utilities, and image editing.
          </p>
        </div>

        {/* Group Sections */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {groups.map((group) => {
            const groupTools = liveTools.filter((t) => t.group === group);
            if (groupTools.length === 0) return null;

            return (
              <section key={group} className="space-y-4 text-left">
                <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{group}</h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Browser-based tools for {group.toLowerCase()}.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                    {groupTools.length} Live Tools
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {groupTools.map((tool) => {
                    const IconComp = Icons[tool.icon] || Icons.FileText;

                    return (
                      <Link
                        key={tool.id}
                        href={`/${tool.slug}`}
                        className="bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group text-left"
                      >
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 group-hover:scale-105 flex items-center justify-center text-amber-500 transition-transform shrink-0">
                              <IconComp size={20} />
                            </div>
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                              Live
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
                          Open Tool &rarr;
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
