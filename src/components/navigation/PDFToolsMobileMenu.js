import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as Icons from "lucide-react";
import { PDF_TOOLS } from "@/features/pdf-tools/constants/pdfToolsList";
import { motion, AnimatePresence } from "motion/react";

export default function PDFToolsMobileMenu({ onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  const buttonId = "mobile-pdf-menu-btn";
  const contentId = "mobile-pdf-menu-content";

  return (
    <div className="border-b border-slate-50 last:border-0">
      <button
        id={buttonId}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="w-full flex justify-between items-center py-2 px-3 text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors outline-none focus-visible:text-amber-600"
      >
        <span>PDF Tools</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={contentId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden pl-3 pr-1 bg-slate-50/50 rounded-xl my-1 border border-slate-100/50"
          >
            <div className="py-2.5 space-y-1">
              {PDF_TOOLS.map((tool) => {
                const IconComponent = Icons[tool.icon] || Icons.FileText;
                const isLive = tool.status === "live";

                if (!isLive) {
                  return (
                    <div
                      key={tool.id}
                      className="flex items-center gap-2.5 py-2 px-2.5 text-xs text-slate-400 cursor-not-allowed font-medium"
                    >
                      <IconComponent size={14} className="opacity-70" />
                      <span>{tool.name}</span>
                      <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.5 rounded font-extrabold uppercase scale-90 origin-left">Soon</span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={tool.id}
                    href={`/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-2.5 py-2 px-2.5 text-xs font-semibold text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-all outline-none focus-visible:bg-white focus-visible:text-amber-600"
                  >
                    <IconComponent size={14} className="text-slate-400" />
                    <span>{tool.name}</span>
                  </Link>
                );
              })}
              
              <Link
                href="/pdf-tools"
                onClick={onClose}
                className="flex items-center gap-2.5 py-2 px-2.5 text-xs font-bold text-amber-500 hover:text-amber-600 rounded-lg transition-all outline-none"
              >
                <Icons.ArrowRight size={12} />
                <span>View All PDF Tools</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
