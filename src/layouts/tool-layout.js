import Link from "next/link";
import { ArrowLeft, Star, FileImage, GraduationCap, Edit3 } from "lucide-react";

import { ShareToolCard, FeedbackCard } from "@/components/share";

export default function ToolLayout({ 
  title, 
  description, 
  hideShare = false,
  hideFeedback = false,
  children 
}) {
  const relatedTools = [
    { 
      name: "Image Compressor", 
      href: "/image-compressor", 
      desc: "Compress JPEG, PNG, and WebP images without losing quality.", 
      icon: FileImage 
    },
    { 
      name: "GPA Calculator", 
      href: "/gpa-calculator", 
      desc: "Calculate your semester and cumulative grade point average.", 
      icon: GraduationCap 
    },
    { 
      name: "Word Counter", 
      href: "/word-counter", 
      desc: "Analyze word count, keyword density, and text readability instantly.", 
      icon: Edit3 
    }
  ];

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

      {/* Main Content Area */}
      <div className="w-full">
        {children}
      </div>

      {/* Centralized Share & Feedback Module */}
      {(!hideShare || !hideFeedback) && (
        <div className="space-y-6 pt-4">
          {!hideShare && <ShareToolCard toolName={title} />}
          {!hideFeedback && <FeedbackCard toolName={title} />}
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
