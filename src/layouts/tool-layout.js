import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ToolLayout({ title, description, children }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-primary transition-colors"
        >
          <ArrowLeft size={16} /> Back to Tools
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Tool Area */}
        <div className="lg:col-span-9">
          {children}
        </div>

        {/* Sidebar Panel for Adsense and Scaling Navigation */}
        <aside className="lg:col-span-3 space-y-8">
          {/* Ad slot placeholder */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 text-center min-h-[250px] flex flex-col justify-center items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Advertisement</span>
            <div className="w-full h-48 bg-slate-50 border border-dashed border-slate-200 rounded-2xl flex items-center justify-center text-slate-300 text-sm font-medium">
              Ad Banner Slot
            </div>
          </div>

          {/* Quick links to other tools */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">Other Free Tools</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/image-compressor" className="text-slate-600 hover:text-primary transition-colors block py-1 font-medium">
                  🖼️ Image Compressor
                </Link>
              </li>
              <li>
                <Link href="/gpa-calculator" className="text-slate-600 hover:text-primary transition-colors block py-1 font-medium">
                  🎓 GPA Calculator
                </Link>
              </li>
              <li>
                <Link href="/word-counter" className="text-slate-600 hover:text-primary transition-colors block py-1 font-medium">
                  ✍️ Word Counter
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-word" className="text-slate-600 hover:text-primary transition-colors block py-1 font-medium">
                  📄 PDF to Word Converter
                </Link>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
