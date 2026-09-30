import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Icons } from "@/lib/lucide-icons";
import {
  getGroupsByEcosystem,
  getLiveToolsCountForGroup,
  getSubcategoriesByGroup,
  getCuratedToolsForSubcategory,
  getFeaturedToolForGroup,
} from "./navigationIndex";

export default function AIToolsMegaMenu({ onClose }) {
  // Extract groups for AI ecosystem
  const aiGroups = useMemo(() => {
    const groups = getGroupsByEcosystem("ai");
    return groups.length > 0 ? groups : ["AI Writing & Content", "AI Document & PDF", "AI Developer"];
  }, []);

  const [activeGroup, setActiveGroup] = useState(() => aiGroups[0] || "AI Writing & Content");

  const activeSubcategories = useMemo(
    () => getSubcategoriesByGroup(activeGroup),
    [activeGroup]
  );

  const featuredTool = useMemo(
    () => getFeaturedToolForGroup(activeGroup),
    [activeGroup]
  );

  const totalGroupToolsCount = useMemo(
    () => getLiveToolsCountForGroup(activeGroup),
    [activeGroup]
  );

  const renderToolItem = (tool) => {
    const IconComponent = Icons[tool.icon] || Icons.Sparkles || Icons.FileText;
    const isLive = tool.status === "live" && !tool.future;

    if (!isLive) {
      return (
        <div
          key={tool.id}
          className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg text-slate-400 cursor-not-allowed select-none text-xs"
        >
          <div className="flex items-center gap-2 truncate">
            <IconComponent size={14} className="opacity-60 shrink-0 text-amber-500" />
            <span className="font-semibold truncate">{tool.name}</span>
          </div>
          <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-200/60 px-1 py-0.2 rounded font-extrabold uppercase shrink-0">
            Soon
          </span>
        </div>
      );
    }

    return (
      <li key={tool.id}>
        <Link
          href={`/${tool.slug}`}
          onClick={onClose}
          className="flex items-center gap-2 py-1.5 px-2 rounded-xl text-slate-700 hover:text-amber-600 hover:bg-slate-50 transition-all font-semibold text-xs outline-none focus-visible:bg-slate-100 focus-visible:text-amber-600 group"
        >
          <IconComponent
            size={14}
            className="text-amber-500 group-hover:text-amber-600 transition-colors shrink-0"
          />
          <span className="truncate">{tool.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <motion.div
      id="desktop-ai-tools-mega-menu"
      role="region"
      aria-label="AI Tools Directory Menu"
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.99 }}
      transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="absolute top-full left-0 right-0 bg-white border-b border-slate-200/90 shadow-2xl z-50 pointer-events-auto max-h-[calc(100vh-5rem)] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Pane: Category Selector Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-2 border-r border-slate-100 pr-4">
            <h3 className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest px-2 mb-3 flex items-center gap-1.5">
              <Icons.Sparkles size={12} /> AI Tool Ecosystem
            </h3>
            <div className="space-y-1" role="tablist" aria-label="AI Tool Categories">
              {aiGroups.map((group) => {
                const isActive = activeGroup === group;
                const count = getLiveToolsCountForGroup(group);
                const IconComp =
                  (group.includes("Writing") ? Icons.Sparkles : null) ||
                  (group.includes("Document") || group.includes("PDF") ? Icons.Bot : null) ||
                  Icons.Code ||
                  Icons.FileText;

                return (
                  <button
                    key={group}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-ai-${group.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => setActiveGroup(group)}
                    onMouseEnter={() => setActiveGroup(group)}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left outline-none ${
                      isActive
                        ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/15"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComp
                        size={16}
                        className={isActive ? "text-slate-950" : "text-amber-500"}
                      />
                      <span className="truncate">{group}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold shrink-0 ${
                        isActive
                          ? "bg-slate-950 text-amber-400"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Pane: Dynamic Active AI Category View (9 cols) */}
          <div
            id={`panel-ai-${activeGroup.toLowerCase().replace(/\s+/g, "-")}`}
            role="tabpanel"
            className="lg:col-span-9 space-y-6 pl-2"
          >
            {/* Header Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h4 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  {activeGroup}
                  <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                    {totalGroupToolsCount} AI Tools
                  </span>
                </h4>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  AI-powered tools for writing, document analysis, and coding automation.
                </p>
              </div>

              <Link
                href="/ai-tools"
                onClick={onClose}
                className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-xs"
              >
                View all AI Tools &rarr;
              </Link>
            </div>

            {/* Subcategories Grid & Featured Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Columns for Subcategories */}
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {(activeSubcategories.length > 0 ? activeSubcategories : ["Generation", "Optimization"]).map((subcat) => {
                  const subTools = getCuratedToolsForSubcategory(activeGroup, subcat, 4);
                  return (
                    <div key={subcat} className="space-y-2">
                      <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">
                        {subcat}
                      </h5>
                      <ul className="space-y-1">
                        {subTools.length > 0 ? (
                          subTools.map(renderToolItem)
                        ) : (
                          <div className="text-xs text-slate-400 py-1 font-medium">
                            AI tools launching soon.
                          </div>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Featured AI Tool Promo Card */}
              {featuredTool && (
                <div className="md:col-span-1 bg-slate-900 text-white rounded-3xl p-5 flex flex-col justify-between shadow-lg relative overflow-hidden group border border-slate-800">
                  <div className="space-y-3 relative z-10">
                    <span className="bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[9px] font-black uppercase px-2.5 py-1 rounded-full inline-block">
                      Featured AI Tool
                    </span>
                    <h5 className="font-extrabold text-sm leading-snug text-white group-hover:text-amber-300 transition-colors">
                      {featuredTool.name}
                    </h5>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed line-clamp-3">
                      {featuredTool.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800 relative z-10">
                    <Link
                      href={`/${featuredTool.slug}`}
                      onClick={onClose}
                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      Open AI Tool &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
