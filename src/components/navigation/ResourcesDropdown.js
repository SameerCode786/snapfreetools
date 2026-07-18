import { BookOpen, HelpCircle, FileCheck, Layers } from "lucide-react";
import { motion } from "motion/react";

export default function ResourcesDropdown() {
  const links = [
    { name: "Blog", icon: BookOpen, status: "soon" },
    { name: "Guides", icon: HelpCircle, status: "soon" },
    { name: "FAQs", icon: FileCheck, status: "soon" },
    { name: "Comparisons", icon: Layers, status: "soon" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute top-full left-0 bg-white border border-slate-250 shadow-xl rounded-2xl p-3 min-w-[180px] z-50 mt-1"
    >
      <ul className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <li key={link.name} className="flex items-center justify-between p-2 rounded-xl text-slate-400 cursor-not-allowed select-none bg-slate-50/10">
              <div className="flex items-center gap-2">
                <Icon size={14} className="opacity-70" />
                <span className="text-xs font-semibold">{link.name}</span>
              </div>
              <span className="text-[7px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.2 rounded font-extrabold uppercase scale-90">Soon</span>
            </li>
          );
        })}
      </ul>
    </motion.div>
  );
}
