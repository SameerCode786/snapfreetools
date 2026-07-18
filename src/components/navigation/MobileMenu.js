import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as Icons from "lucide-react";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { motion, AnimatePresence } from "motion/react";

export default function MobileMenu({ onClose }) {
  const [activeCategory, setActiveCategory] = useState(null);

  const categories = [
    { 
      name: "Featured Tools", 
      items: ALL_TOOLS.filter(t => t.featured && t.status === "live"),
      key: "featured"
    },
    { 
      name: "Calculators", 
      items: ALL_TOOLS.filter(t => t.group === "Calculators"),
      key: "calculators"
    },
    { 
      name: "PDF Tools", 
      items: ALL_TOOLS.filter(t => t.group === "PDF Tools"),
      key: "pdf"
    },
    { 
      name: "Text Tools", 
      items: ALL_TOOLS.filter(t => t.group === "Text Tools"),
      key: "text"
    },
    { 
      name: "Image Tools", 
      items: ALL_TOOLS.filter(t => t.group === "Image Tools"),
      key: "image"
    }
  ];

  const toggleCategory = (catKey) => {
    if (activeCategory === catKey) {
      setActiveCategory(null);
    } else {
      setActiveCategory(catKey);
    }
  };

  return (
    <div className="space-y-2 mt-2 border-t border-slate-100 pt-2">
      <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-3 mb-2">
        Tools Directories
      </div>
      {categories.map((category) => {
        const isOpen = activeCategory === category.key;
        const buttonId = `mobile-menu-btn-${category.key}`;
        const contentId = `mobile-menu-content-${category.key}`;
        
        return (
          <div key={category.key} className="border-b border-slate-50 last:border-0">
            <button
              id={buttonId}
              onClick={() => toggleCategory(category.key)}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className="w-full flex justify-between items-center py-2 px-3 text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors outline-none focus-visible:text-amber-600"
            >
              <span>{category.name}</span>
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
                    {category.items.map((item) => {
                      const IconComponent = Icons[item.icon] || Icons.HelpCircle;
                      const isLive = item.status === "live";
                      
                      return !isLive ? (
                        <div
                          key={item.id}
                          className="flex items-center gap-2.5 py-2 px-2.5 text-xs text-slate-400 cursor-not-allowed font-medium"
                        >
                          <IconComponent size={14} className="opacity-70" />
                          <span>{item.name}</span>
                          <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.5 rounded font-extrabold uppercase scale-90 origin-left">Soon</span>
                        </div>
                      ) : (
                        <Link
                          key={item.id}
                          href={`/${item.slug}`}
                          onClick={onClose}
                          className="flex items-center gap-2.5 py-2 px-2.5 text-xs font-semibold text-slate-600 hover:text-amber-600 hover:bg-white rounded-lg transition-all outline-none focus-visible:bg-white focus-visible:text-amber-600"
                        >
                          <IconComponent size={14} className="text-slate-400" />
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
