import Link from "next/link";
import * as Icons from "lucide-react";
import { PDF_TOOLS } from "@/features/pdf-tools/constants/pdfToolsList";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Free Online PDF Tools - Convert, Merge & Compress PDFs",
  description: "Use free online PDF tools to convert, merge, split, compress, unlock, and protect PDF files quickly and securely.",
  alternates: {
    canonical: "https://snapfreetools.com/pdf-tools"
  }
};

export default function Page() {
  // Structured Data schemas
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://snapfreetools.com/pdf-tools/#webpage",
        "url": "https://snapfreetools.com/pdf-tools",
        "name": "Free Online PDF Tools - Convert, Merge & Compress PDFs",
        "description": "Use free online PDF tools to convert, merge, split, compress, unlock, and protect PDF files quickly and securely.",
        "breadcrumb": {
          "@id": "https://snapfreetools.com/pdf-tools/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://snapfreetools.com/pdf-tools/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PDF Tools",
            "item": "https://snapfreetools.com/pdf-tools"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://snapfreetools.com/pdf-tools/#collection",
        "name": "Free Online PDF Tools",
        "description": "Convert, merge, compress, split, and manage PDF files online with fast, privacy-focused tools.",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": PDF_TOOLS.map((tool, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": tool.name,
            "url": `https://snapfreetools.com/${tool.slug}`
          }))
        }
      }
    ]
  };

  return (
    <>
      <JsonLd schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Free Online PDF Tools
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Convert, merge, compress, split, and manage PDF files online with fast, privacy-focused tools.
          </p>
        </div>

        {/* Tools Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PDF_TOOLS.map((tool) => {
            const IconComponent = Icons[tool.icon] || Icons.FileText;
            const isLive = tool.status === "live";

            if (!isLive) {
              return (
                <div 
                  key={tool.id} 
                  className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between hover:shadow-sm transition-all duration-300 relative select-none opacity-85"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-350 shrink-0">
                        <IconComponent size={20} />
                      </div>
                      <span className="text-[9px] bg-slate-50 text-slate-500 border border-slate-200/50 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                        Soon
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-700 text-sm leading-snug">{tool.name}</h3>
                      <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{tool.shortDescription}</p>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 text-center">
                    <span className="text-[11px] font-bold text-slate-400 cursor-not-allowed">Coming Soon</span>
                  </div>
                </div>
              );
            }

            return (
              <Link 
                key={tool.id}
                href={`/${tool.slug}`}
                className="bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 group-hover:scale-105 flex items-center justify-center text-amber-500 transition-transform duration-300 shrink-0">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100/50 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                      Live
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-850 text-sm leading-snug group-hover:text-amber-600 transition-colors">{tool.name}</h3>
                    <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{tool.shortDescription}</p>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
                  Open Tool
                  <Icons.ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
