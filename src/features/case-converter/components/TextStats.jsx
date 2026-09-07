import React from "react";
import { Hash, AlignLeft, FileText, Layers, Clock, HardDrive, ListOrdered } from "lucide-react";

export default function TextStats({ stats }) {
  const statItems = [
    { label: "Characters", value: stats.characters.toLocaleString(), icon: Hash, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Chars (no space)", value: stats.charactersNoSpaces.toLocaleString(), icon: AlignLeft, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Words", value: stats.words.toLocaleString(), icon: FileText, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Sentences", value: stats.sentences.toLocaleString(), icon: ListOrdered, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString(), icon: Layers, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
    { label: "Reading Time", value: stats.readingTimeFormatted, icon: Clock, color: "text-rose-600 bg-rose-50 border-rose-100" },
    { label: "File Size", value: `${stats.bytes.toLocaleString()} B`, icon: HardDrive, color: "text-slate-600 bg-slate-100 border-slate-200" }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {statItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-2xl p-3.5 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all"
          >
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 truncate">
                {item.label}
              </span>
              <div className={`p-1.5 rounded-lg border shrink-0 ${item.color}`}>
                <Icon size={12} />
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 truncate">
              {item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
