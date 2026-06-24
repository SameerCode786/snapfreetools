import Link from "next/link";
import * as Icons from "lucide-react";

export default function MegaMenuColumn({ title, items, onItemClick }) {
  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => {
          const IconComponent = Icons[item.icon] || Icons.HelpCircle;
          
          return (
            <li key={item.slug}>
              {item.future ? (
                <div className="flex items-start gap-3 p-2 rounded-xl text-slate-400 cursor-not-allowed select-none">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-300 shrink-0 mt-0.5 border border-slate-100">
                    <IconComponent size={15} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold flex items-center gap-1.5 text-slate-400">
                      {item.name}
                      <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200/60 px-1.5 py-0.5 rounded font-extrabold uppercase tracking-wider scale-95 origin-left">Soon</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed block mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/${item.slug}`}
                  onClick={onItemClick}
                  className="flex items-start gap-3 p-2 -m-2 rounded-xl hover:bg-slate-50 group/item transition-all duration-200 outline-none focus-visible:bg-slate-50 focus-visible:ring-2 focus-visible:ring-amber-500/20"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-50/80 border border-slate-100 group-hover/item:bg-amber-50 group-hover/item:border-amber-100 flex items-center justify-center text-slate-500 group-hover/item:text-amber-600 transition-all shrink-0 mt-0.5">
                    <IconComponent size={15} className="transition-transform duration-200 group-hover/item:scale-105" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-800 group-hover/item:text-amber-600 transition-colors leading-snug">
                      {item.name}
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed block mt-0.5 max-w-[280px]">
                      {item.description}
                    </p>
                  </div>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

