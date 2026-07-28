import Link from "next/link";
import { motion } from "motion/react";
import { Icons } from "@/lib/lucide-icons";
import { PDF_TOOLS } from "@/features/pdf-tools/constants/pdfToolsList";

export default function PDFToolsMegaMenu({ onClose }) {
  // Categorize tools
  const manageTools = PDF_TOOLS.filter(t => t.category === "Manage PDFs");
  const convertTools = PDF_TOOLS.filter(t => t.category === "Convert to PDF" || t.slug === "pdf-to-jpg");
  const securityTools = PDF_TOOLS.filter(t => t.category === "Security & Access");
  
  // Featured live tool (PDF to Word)
  const featuredTool = PDF_TOOLS.find(t => t.id === "pdf-to-word") || PDF_TOOLS[0];

  const renderToolLink = (tool) => {
    const IconComponent = Icons[tool.icon] || Icons.FileText;
    const isLive = tool.status === "live";

    if (!isLive) {
      return (
        <div key={tool.id} className="flex items-start gap-3 p-2 rounded-xl text-slate-400 cursor-not-allowed select-none">
          <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 border border-slate-100">
            <IconComponent size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-400">
              {tool.name}
              <span className="text-[8px] bg-slate-50 text-slate-500 border border-slate-200/60 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider scale-95 origin-left">Soon</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
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
          className="flex items-start gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 group/item transition-all duration-200 outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-amber-500/20"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-50/80 border border-slate-100 group-hover/item:bg-amber-50 group-hover/item:border-amber-100 flex items-center justify-center text-slate-500 group-hover/item:text-amber-600 transition-all shrink-0 mt-0.5">
            <IconComponent size={15} className="transition-transform duration-200 group-hover/item:scale-105" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-800 group-hover/item:text-amber-600 transition-colors leading-snug">
              {tool.name}
            </div>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed block mt-0.5 max-w-[280px]">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        
        {/* Column 1: Featured Promo Card */}
        <div className="flex flex-col h-full">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300 hover:border-amber-500/30">
            {/* Decorative gradient background blur */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300 group-hover:bg-amber-500/15" />
            
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/15 group-hover:scale-105 transition-transform duration-300">
                <FeaturedIcon size={24} />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block mb-3">
                  Live Tool
                </span>
                <h4 className="font-extrabold text-white text-lg leading-snug">
                  {featuredTool.name}
                </h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-2.5">
                  {featuredTool.shortDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-5 border-t border-slate-800">
              <Link
                href={`/${featuredTool.slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-2xl text-xs transition-all shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Open Tool
                <Icons.ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Column 2: Manage PDFs */}
        <div className="space-y-4 h-full">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Manage PDFs
          </h3>
          <ul className="space-y-3">
            {manageTools.map(renderToolLink)}
          </ul>
        </div>

        {/* Column 3: Convert PDFs */}
        <div className="space-y-4 h-full">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Convert PDFs
          </h3>
          <ul className="space-y-3">
            {convertTools.map(renderToolLink)}
          </ul>
        </div>

        {/* Column 4: Security & Access */}
        <div className="flex flex-col gap-6 h-full justify-between">
          <div className="space-y-4">
            <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
              Security & Access
            </h3>
            <ul className="space-y-3">
              {securityTools.map(renderToolLink)}
            </ul>
          </div>
          
          <div className="pt-4 border-t border-slate-100 mt-auto">
            <Link
              href="/pdf-tools"
              onClick={onClose}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 justify-center py-2 bg-amber-50/40 hover:bg-amber-50 rounded-xl transition-all w-full text-center"
            >
              <Icons.ArrowLeft size={12} className="rotate-180" /> View All PDF Tools
            </Link>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
