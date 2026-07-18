import Link from "next/link";
import { Lock, ArrowLeft, FileText, ImageIcon, FileEdit } from "lucide-react";

export const metadata = {
  title: "Protect PDF Online - Add Password to PDF Free",
  description: "Protect PDF online free. Add strong password protection and restrict permissions for printing, editing, and copying secure documents.",
  robots: {
    index: false,
    follow: true
  },
  alternates: {
    canonical: "https://snapfreetools.com/protect-pdf"
  }
};

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-amber-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/pdf-tools" className="hover:text-amber-600 transition-colors">PDF Tools</Link>
        <span>/</span>
        <span className="text-slate-800">Protect PDF</span>
      </nav>

      {/* Main Layout Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-6">
        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <Lock size={28} />
        </div>

        <div className="space-y-2">
          <span className="inline-block text-[10px] font-extrabold text-amber-500 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Coming Soon
          </span>
          <h1 className="text-2xl font-black text-slate-900">Protect PDF Online</h1>
          <p className="text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
            Add strong password protection and encryption keys to secure PDF documents. This feature is currently under development.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-4">
          <Link 
            href="/pdf-tools"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-amber-500 transition-colors"
          >
            <ArrowLeft size={14} /> Back to PDF Tools
          </Link>
        </div>
      </div>

      {/* Alternative Live Tools */}
      <div className="space-y-4 pt-4">
        <h3 className="font-extrabold text-slate-900 text-sm text-center">Try our other live tools:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link 
            href="/pdf-to-word" 
            className="p-5 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-2xl transition-all space-y-2 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
              <FileEdit size={16} />
            </div>
            <h4 className="font-bold text-slate-850 text-xs">PDF to Word</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Convert PDF to editable Word document locally.</p>
          </Link>

          <Link 
            href="/image-compressor" 
            className="p-5 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-2xl transition-all space-y-2 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <ImageIcon size={16} />
            </div>
            <h4 className="font-bold text-slate-850 text-xs">Image Compressor</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Compress JPG and PNG images instantly inside browser.</p>
          </Link>

          <Link 
            href="/word-counter" 
            className="p-5 bg-white border border-slate-200 hover:border-amber-400 hover:shadow-sm rounded-2xl transition-all space-y-2 group block"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
              <FileText size={16} />
            </div>
            <h4 className="font-bold text-slate-850 text-xs">Word Counter</h4>
            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">Count words and track keywords density in real time.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
