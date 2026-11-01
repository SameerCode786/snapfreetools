import Link from "next/link";
import { ArrowLeft, Star, FileText } from "lucide-react";
import { ALL_TOOLS } from "@/features/tools-hub/constants/allToolsRegistry";
import { Icons } from "@/lib/lucide-icons";

import ShareSystem from "@/components/share";

function getRelatedTools(currentSlug) {
  const liveTools = ALL_TOOLS.filter((t) => t.status === "live" && !t.future);
  const currentTool = liveTools.find((t) => t.slug === currentSlug);

  let candidates = [];

  if (currentTool) {
    if (currentTool.group === "Image Tools") {
      candidates = liveTools.filter(
        (t) =>
          t.slug !== currentSlug &&
          (t.group === "Image Tools" || t.slug === "png-to-pdf" || t.slug === "jpg-to-pdf")
      );
    } else if (currentTool.group === "Text Tools") {
      candidates = liveTools.filter(
        (t) =>
          t.slug !== currentSlug &&
          (t.group === "Text Tools" || t.slug === "pdf-to-text" || t.slug === "word-to-pdf")
      );
    } else {
      // Prioritize same category first, then same group
      const sameCategory = liveTools.filter(
        (t) =>
          t.slug !== currentSlug &&
          t.group === currentTool.group &&
          t.category === currentTool.category
      );
      const sameGroup = liveTools.filter(
        (t) =>
          t.slug !== currentSlug &&
          t.group === currentTool.group &&
          t.category !== currentTool.category
      );
      candidates = [...sameCategory, ...sameGroup];
    }
  }

  // Fallback if fewer than 3 candidates
  if (candidates.length < 3) {
    const fallbacks = liveTools.filter(
      (t) => t.slug !== currentSlug && !candidates.some((c) => c.slug === t.slug)
    );
    candidates = [...candidates, ...fallbacks];
  }

  return candidates.slice(0, 3).map((tool) => ({
    name: tool.name,
    href: `/${tool.slug}`,
    desc: tool.description,
    icon: Icons[tool.icon] || Icons.FileText || FileText,
  }));
}

export default function ToolLayout({ 
  title, 
  description, 
  currentSlug = "",
  result = null,
  activeResult = null,
  hideShare = false,
  hideFeedback = false,
  seoContent = null,
  children 
}) {
  const relatedTools = getRelatedTools(currentSlug);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </div>

      {/* Main Workspace / Result Area */}
      <div className="w-full">
        {children}
      </div>

      {/* Centralized Share System - Immediately below workspace/result */}
      {!hideShare && (
        <ShareSystem
          toolName={title}
          toolSlug={currentSlug}
          result={result || activeResult}
        />
      )}

      {/* Educational / SEO Content (rendered after ShareSystem) */}
      {seoContent && (
        <div className="w-full space-y-12 pt-4 border-t border-slate-100">
          {seoContent}
        </div>
      )}

      {/* Explore Related Tools (UX & SEO) */}
      <div className="border-t border-slate-100 pt-10 mt-12 space-y-6">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-amber-500 fill-amber-500 animate-pulse" />
          <h3 className="font-extrabold text-slate-800 text-base">Explore Related Tools</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-start gap-4 p-5 bg-white border border-slate-200 rounded-3xl shadow-sm hover:border-amber-300 hover:shadow-md hover:shadow-amber-50/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-2xl bg-slate-50 group-hover:bg-amber-50 flex items-center justify-center text-slate-500 group-hover:text-amber-600 transition-colors shrink-0">
                  <Icon size={20} />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">
                    {tool.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
