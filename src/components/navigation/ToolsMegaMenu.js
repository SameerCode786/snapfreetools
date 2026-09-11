import Link from "next/link";
import { motion } from "motion/react";
import { Icons } from "@/lib/lucide-icons";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";

export default function ToolsMegaMenu({ onClose }) {
  // Extract Tools groups
  const featuredTools = ALL_TOOLS.filter(t => t.featured && t.status === "live");
  
  const calculators = ALL_TOOLS.filter(t => t.group === "Calculators");
  const pdfTools = ALL_TOOLS.filter(t => t.group === "PDF Tools");
  const textTools = ALL_TOOLS.filter(t => t.group === "Text Tools");
  const imageTools = ALL_TOOLS.filter(t => t.group === "Image Tools");

  const renderToolLink = (tool) => {
    const IconComponent = Icons[tool.icon] || Icons.FileText;
    const isLive = tool.status === "live";

    if (!isLive) {
      return (
        <div key={tool.id} className="flex items-center gap-2 py-1 text-slate-400 cursor-not-allowed select-none">
          <IconComponent size={14} className="opacity-70 shrink-0" />
          <span className="text-xs font-semibold">{tool.name}</span>
          <span className="text-[7px] bg-slate-50 text-slate-500 border border-slate-200/50 px-1 py-0.2 rounded font-extrabold uppercase scale-90 origin-left">Soon</span>
        </div>
      );
    }

    return (
      <li key={tool.id}>
        <Link
          href={`/${tool.slug}`}
          onClick={onClose}
          className="flex items-center gap-2 py-1 text-slate-600 hover:text-amber-500 transition-colors font-medium text-xs outline-none focus-visible:text-amber-500"
        >
          <IconComponent size={14} className="text-slate-405 shrink-0 group-hover:text-amber-500" />
          <span>{tool.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <motion.div 
      id="desktop-tools-mega-menu"
      role="region"
      aria-label="Tools Directory Menu"
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.99 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-2xl z-50 pointer-events-auto max-h-[calc(100vh-5rem)] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Column 1: Featured Tools Cards */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Featured Tools
          </h3>
          <div className="grid grid-cols-1 gap-3.5">
            {featuredTools.map((tool) => {
              const IconComponent = Icons[tool.icon] || Icons.FileText;
              return (
                <Link
                  key={tool.id}
                  href={`/${tool.slug}`}
                  onClick={onClose}
                  className="bg-slate-50 hover:bg-amber-50/50 border border-slate-100 hover:border-amber-200/60 p-3 rounded-2xl flex items-center gap-3 transition-all outline-none group"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/60 flex items-center justify-center text-slate-550 group-hover:bg-white group-hover:border-amber-300 group-hover:text-amber-500 shadow-sm shrink-0">
                    <IconComponent size={15} />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 group-hover:text-amber-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-[9px] text-slate-400 leading-relaxed font-medium mt-0.5 max-w-[180px] line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Column 2: Calculators */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Calculators
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Left Calculator Sub-column */}
            <div className="space-y-4">
              {/* Academic Section */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Academic</h4>
                <ul className="space-y-1.5">
                  {calculators.filter(c => c.category === "Academic Calculators").map(renderToolLink)}
                </ul>
              </div>
            </div>

            {/* Right Calculator Sub-column */}
            <div className="space-y-4">
              {/* Admissions Section */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Student & Admission</h4>
                <ul className="space-y-1.5">
                  {calculators.filter(c => c.category === "Student & Admission Tools").map(renderToolLink)}
                </ul>
              </div>

              {/* Financial Section */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Financial Tools</h4>
                <ul className="space-y-1.5">
                  {calculators.filter(c => c.category === "Financial Calculators").map(renderToolLink)}
                </ul>
              </div>

              {/* Utility Section */}
              <div className="space-y-1.5">
                <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Utility Tools</h4>
                <ul className="space-y-1.5">
                  {calculators.filter(c => c.category === "Utility Calculators").map(renderToolLink)}
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Link */}
          <div className="pt-3 border-t border-slate-100 mt-2">
            <Link
              href="/calculators"
              onClick={onClose}
              className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 transition-colors outline-none"
            >
              View All Calculators &rarr;
            </Link>
          </div>
        </div>

        {/* Column 3: PDF Tools */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            PDF Tools
          </h3>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Convert</h4>
              <ul className="space-y-1.5">
                {pdfTools.filter(t => t.category.includes("Convert")).map(renderToolLink)}
              </ul>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Manage</h4>
              <ul className="space-y-1.5">
                {pdfTools.filter(t => t.category.includes("Manage")).map(renderToolLink)}
              </ul>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Security</h4>
              <ul className="space-y-1.5">
                {pdfTools.filter(t => t.category.includes("Security")).map(renderToolLink)}
              </ul>
            </div>
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Edit & Utilities</h4>
              <ul className="space-y-1.5">
                {pdfTools.filter(t => t.category.includes("Edit") || t.category.includes("Utilities")).map(renderToolLink)}
              </ul>
            </div>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <Link
                href="/pdf-tools"
                onClick={onClose}
                className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 transition-colors outline-none"
              >
                View All PDF Tools &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Column 4: Text & Image Tools */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
            Text & Image Tools
          </h3>
          
          <div className="space-y-4">
            {/* Text Tools */}
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Text Tools</h4>
              <ul className="space-y-1.5">
                {textTools.map(renderToolLink)}
              </ul>
            </div>

            {/* Image Tools */}
            <div className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Image Tools</h4>
              <ul className="space-y-1.5">
                {imageTools.map(renderToolLink)}
              </ul>
            </div>

            {/* Footer Link */}
            <div className="pt-3 border-t border-slate-100 mt-2">
              <Link
                href="/calculators"
                onClick={onClose}
                className="text-xs font-bold text-amber-500 hover:text-amber-600 flex items-center gap-1.5 transition-colors outline-none"
              >
                View All Tools &rarr;
              </Link>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
