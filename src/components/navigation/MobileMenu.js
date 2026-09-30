"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, Sparkles, Sliders } from "lucide-react";
import { Icons } from "@/lib/lucide-icons";
import { motion, AnimatePresence } from "motion/react";
import {
  getGroupsByEcosystem,
  getCuratedToolsForGroup,
} from "./navigationIndex";

export default function MobileMenu({ onClose }) {
  const [activeTab, setActiveTab] = useState("utility"); // "utility" | "ai"
  const [activeGroup, setActiveGroup] = useState(null);

  const utilityGroups = getGroupsByEcosystem("utility");
  const aiGroups = getGroupsByEcosystem("ai");
  const currentGroups = activeTab === "utility" ? utilityGroups : aiGroups;

  const toggleGroup = (groupName) => {
    if (activeGroup === groupName) {
      setActiveGroup(null);
    } else {
      setActiveGroup(groupName);
    }
  };

  const getGroupHubPath = (group) => {
    if (group === "PDF Tools") return "/pdf-tools";
    if (group === "Calculators") return "/calculators";
    if (group.includes("AI")) return "/ai-tools";
    return "/calculators";
  };

  return (
    <div className="space-y-3 mt-2 border-t border-slate-100 pt-3">
      {/* Ecosystem Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
        <button
          type="button"
          onClick={() => {
            setActiveTab("utility");
            setActiveGroup(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "utility"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sliders size={13} className="text-amber-500" /> Utility Tools
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("ai");
            setActiveGroup(null);
          }}
          className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === "ai"
              ? "bg-amber-500 text-slate-950 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles size={13} /> AI Tools
        </button>
      </div>

      {/* Drill-down Category Accordion List */}
      <div className="space-y-1">
        {currentGroups.map((group) => {
          const isOpen = activeGroup === group;
          const curatedTools = getCuratedToolsForGroup(group, 6);
          const IconComp =
            group === "PDF Tools"
              ? Icons.FileText
              : group === "Calculators"
              ? Icons.Calculator
              : group === "Text Tools"
              ? Icons.CaseSensitive
              : group === "Image Tools"
              ? Icons.Image
              : group.includes("AI")
              ? Icons.Sparkles
              : Icons.Sliders;

          return (
            <div key={group} className="border-b border-slate-50 last:border-0">
              <button
                type="button"
                onClick={() => toggleGroup(group)}
                aria-expanded={isOpen}
                className="w-full flex justify-between items-center py-2.5 px-3 text-xs font-bold text-slate-700 hover:text-amber-600 transition-colors outline-none"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <IconComp size={15} className="text-amber-500 shrink-0" />
                  <span className="truncate">{group}</span>
                </div>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    role="region"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden pl-3 pr-1 bg-slate-50/50 rounded-xl my-1 border border-slate-100/50"
                  >
                    <div className="py-2.5 space-y-1">
                      {curatedTools.map((item) => {
                        const ItemIcon = Icons[item.icon] || Icons.FileText;
                        const isLive = item.status === "live" && !item.future;

                        return !isLive ? (
                          <div
                            key={item.id}
                            className="flex items-center justify-between py-2 px-2.5 text-xs text-slate-400 cursor-not-allowed font-medium"
                          >
                            <div className="flex items-center gap-2 truncate">
                              <ItemIcon size={14} className="opacity-70 shrink-0" />
                              <span className="truncate">{item.name}</span>
                            </div>
                            <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.2 rounded font-extrabold uppercase shrink-0">
                              Soon
                            </span>
                          </div>
                        ) : (
                          <Link
                            key={item.id}
                            href={`/${item.slug}`}
                            onClick={onClose}
                            className="flex items-center gap-2.5 py-2 px-2.5 text-xs font-semibold text-slate-700 hover:text-amber-600 hover:bg-white rounded-lg transition-all outline-none"
                          >
                            <ItemIcon size={14} className="text-amber-500 shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}

                      {/* Group Hub CTA Button */}
                      <div className="pt-2 border-t border-slate-100 mt-2">
                        <Link
                          href={getGroupHubPath(group)}
                          onClick={onClose}
                          className="block text-center py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-700 font-extrabold text-xs rounded-xl transition-all"
                        >
                          View all {group} &rarr;
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
