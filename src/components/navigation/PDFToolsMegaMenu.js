import Link from "next/link";
import { motion } from "motion/react";
import { Icons } from "@/lib/lucide-icons";
import { PDF_TOOLS } from "@/features/pdf-tools/constants/pdfToolsList";

export default function PDFToolsMegaMenu({ onClose }) {
  // Categorize tools
  const manageTools = PDF_TOOLS.filter(t => t.category === "Manage PDFs" || t.slug === "compress-pdf");
  const convertTools = PDF_TOOLS.filter(t => t.category === "Convert to PDF" || t.category === "Convert from PDF");
  const editSecurityTools = PDF_TOOLS.filter(t => t.category === "Security & Access" || t.category === "Edit & Annotate" || t.category === "PDF Utilities");
  
  // Featured live tool (Rotate PDF)
  const featuredTool = PDF_TOOLS.find(t => t.id === "rotate-pdf") || PDF_TOOLS[0];

  const renderToolLink = (tool) => {
    const IconComponent = Icons[tool.icon] || Icons.FileText;
    const isLive = tool.status === "live";

    if (!isLive) {
      return (
        <div key={tool.id} className="flex items-start gap-2.5 p-1.5 rounded-xl text-slate-400 cursor-not-allowed select-none opacity-80">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 border border-slate-100">
            <IconComponent size={13} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold text-slate-500 flex items-center justify-between gap-1">
              <span className="truncate">{tool.name}</span>
              <span className="text-[7px] bg-slate-100 text-slate-500 border border-slate-200/60 px-1.5 py-0.2 rounded font-extrabold uppercase shrink-0">Soon</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-tight truncate mt-0.5">
              {tool.shortDescription}
            </p>
          </div>
        </div>
      );
    }

    return (
      <li key={tool.id}>
        <Link
          href={`/${tool.slug}`}
          onClick={onClose}
          className="flex items-start gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 group/item transition-all duration-200 outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-amber-500/20"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-50/80 border border-amber-100 group-hover/item:bg-amber-100 flex items-center justify-center text-amber-600 transition-all shrink-0 mt-0.5">
            <IconComponent size={13} className="transition-transform duration-200 group-hover/item:scale-105" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold text-slate-800 group-hover/item:text-amber-600 transition-colors leading-tight flex items-center justify-between gap-1">
              <span className="truncate">{tool.name}</span>
              <span className="text-[7px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1 py-0.2 rounded font-extrabold uppercase shrink-0">Live</span>
            </div>
            <p className="text-[9px] text-slate-400 font-medium leading-tight truncate mt-0.5">
              {tool.shortDescription}
            </p>
          </div>
        </Link>
      </li>
    );
  };

  const FeaturedIcon = Icons[featuredTool.icon] || Icons.FileText;

  return (
    <motion.div 
      id="desktop-pdf-mega-menu"
      role="region"
      aria-label="PDF Tools Directory"
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.99 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-2xl z-50 pointer-events-auto max-h-[calc(100vh-4.5rem)] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 text-left">
        
        {/* Column 1: Featured Promo Card */}
        <div className="flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-amber-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:bg-amber-500/15" />
            
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-105 transition-transform duration-300">
                <FeaturedIcon size={20} />
              </div>
              <div>
                <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-2">
                  New Live Tool
                </span>
                <h4 className="font-extrabold text-white text-base leading-snug">
                  {featuredTool.name}
                </h4>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-2">
                  {featuredTool.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <Link
                href={`/${featuredTool.slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-2xl text-xs transition-all shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 outline-none"
              >
                Open Tool
                <Icons.ArrowRight size={13} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: Manage PDFs */}
        <div className="space-y-3 h-full">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Manage PDFs ({manageTools.filter(t => t.status === "live").length} Live)
          </h3>
          <ul className="space-y-1.5">
            {manageTools.map(renderToolLink)}
          </ul>
        </div>

        {/* Column 3: Convert PDFs */}
        <div className="space-y-3 h-full">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Convert PDFs ({convertTools.filter(t => t.status === "live").length} Live)
          </h3>
          <ul className="space-y-1.5">
            {convertTools.map(renderToolLink)}
          </ul>
        </div>

        {/* Column 4: Edit, Security & Utilities */}
        <div className="flex flex-col justify-between h-full space-y-3">
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Edit, Security & Utilities
            </h3>
            <ul className="space-y-1.5">
              {editSecurityTools.map(renderToolLink)}
            </ul>
          </div>
          
          <div className="pt-3 border-t border-slate-100 mt-auto">
            <Link
              href="/pdf-tools"
              onClick={onClose}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 justify-center py-2 bg-amber-50/40 hover:bg-amber-50 rounded-xl transition-all w-full text-center"
            >
              <Icons.ArrowLeft size={12} className="rotate-180" /> View All 19 PDF Tools
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
