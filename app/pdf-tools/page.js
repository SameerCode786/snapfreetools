import Link from "next/link";
import * as Icons from "lucide-react";
import { PDF_TOOLS } from "@/features/pdf-tools/constants/pdfToolsList";
import { JsonLd } from "@/seo/structured-data";

export const metadata = {
  title: "Free Online PDF Tools - Convert, Merge, Compress & Organize PDFs",
  description: "Use free online PDF tools to convert, merge, split, compress, rotate, unlock, and protect PDF files quickly and securely in your browser.",
  alternates: {
    canonical: "https://www.snapfreetools.com/pdf-tools"
  }
};

export default function Page() {
  const liveTools = PDF_TOOLS.filter((t) => t.status === "live");

  // Structured Data schema (indexing only Live functional tools)
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/pdf-tools/#webpage",
        "url": "https://www.snapfreetools.com/pdf-tools",
        "name": "Free Online PDF Tools - Convert, Merge & Compress PDFs",
        "description": "Use free online PDF tools to convert, merge, split, compress, rotate, unlock, and protect PDF files quickly and securely.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/pdf-tools/#breadcrumb"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/pdf-tools/#breadcrumb",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "PDF Tools",
            "item": "https://www.snapfreetools.com/pdf-tools"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "@id": "https://www.snapfreetools.com/pdf-tools/#collection",
        "name": "Free Online PDF Tools",
        "description": "Convert, merge, compress, split, rotate, and manage PDF files online with fast, privacy-focused tools.",
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": liveTools.map((tool, idx) => ({
            "@type": "ListItem",
            "position": idx + 1,
            "name": tool.name,
            "url": `https://www.snapfreetools.com/${tool.slug}`
          }))
        }
      }
    ]
  };

  // Section Groupings
  const categories = [
    {
      title: "Manage & Organize PDFs",
      description: "Merge, split, compress, rotate, delete, and organize PDF pages.",
      tools: PDF_TOOLS.filter((t) => 
        t.category === "Manage PDFs" || t.slug === "compress-pdf"
      )
    },
    {
      title: "Convert PDFs",
      description: "Convert PDF documents to and from Word, JPG, Excel, and text formats.",
      tools: PDF_TOOLS.filter((t) => 
        t.category === "Convert to PDF" || t.category === "Convert from PDF"
      )
    },
    {
      title: "Edit & Annotate PDFs",
      description: "Watermark, page numbers, electronic signatures, and PDF annotations.",
      tools: PDF_TOOLS.filter((t) => t.category === "Edit & Annotate")
    },
    {
      title: "PDF Security",
      description: "Protect PDF documents with password encryption or unlock file permissions.",
      tools: PDF_TOOLS.filter((t) => t.category === "Security & Access")
    },
    {
      title: "PDF Utilities",
      description: "Extract images, edit metadata, and manage PDF document properties.",
      tools: PDF_TOOLS.filter((t) => t.category === "PDF Utilities")
    }
  ];

  const renderToolCard = (tool) => {
    const IconComponent = Icons[tool.icon] || Icons.FileText;
    const isLive = tool.status === "live";

    if (!isLive) {
      return (
        <div 
          key={tool.id} 
          className="bg-white border border-slate-200/80 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 relative select-none opacity-80"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                <IconComponent size={20} />
              </div>
              <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200/60 px-2 py-0.5 rounded-md uppercase tracking-wider font-extrabold">
                Coming Soon
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-slate-700 text-sm leading-snug">{tool.name}</h3>
              <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{tool.shortDescription}</p>
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
        className="bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md p-6 rounded-3xl transition-all duration-300 flex flex-col justify-between group"
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
            <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-amber-600 transition-colors">{tool.name}</h3>
            <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{tool.shortDescription}</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[11px] font-bold text-amber-500 group-hover:text-amber-600 transition-colors">
          Open Tool
          <Icons.ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </Link>
    );
  };

  return (
    <>
      <JsonLd schema={schema} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        
        {/* Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest select-none">
            PDF ECOSYSTEM
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">
            Free Online PDF Tools
          </h1>
          <p className="text-sm text-slate-500 font-semibold leading-relaxed">
            Convert, merge, compress, split, rotate, and manage PDF files online with fast, 100% privacy-focused tools.
          </p>
        </div>

        {/* Categorized Sections */}
        <div className="space-y-12 max-w-6xl mx-auto">
          {categories.map((cat, idx) => {
            if (!cat.tools || cat.tools.length === 0) return null;
            return (
              <section key={idx} className="space-y-4 text-left">
                <div className="border-b border-slate-200/80 pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">{cat.title}</h2>
                    <p className="text-xs text-slate-500 font-medium">{cat.description}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
                    {cat.tools.filter(t => t.status === "live").length} Live • {cat.tools.filter(t => t.status !== "live").length} Soon
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {cat.tools.map(renderToolCard)}
                </div>
              </section>
            );
          })}
        </div>

      </div>
    </>
  );
}
