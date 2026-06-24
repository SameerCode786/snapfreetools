import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Share2, RotateCcw } from "lucide-react";

export default function ResultCard({ 
  value, 
  label = "Your Result", 
  subtext,
  onReset,
  onShare,
  className = "" 
}) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleShareClick = async () => {
    if (onShare) {
      const res = await onShare();
      if (res && res.success) {
        setToast({ type: "success", message: res.message });
      } else if (res && res.error) {
        setToast({ type: "error", message: res.error });
      }
    } else {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(`My current ${label} is ${value} - calculated on SnapFreeTools.com`);
          setToast({ type: "success", message: "Result copied to clipboard!" });
        } catch (err) {
          setToast({ type: "error", message: "Failed to copy!" });
        }
      }
    }
  };

  return (
    <div className={`bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 text-white shadow-xl shadow-amber-500/10 flex flex-col md:flex-row justify-between items-center gap-6 ${className}`}>
      <div className="text-center md:text-left">
        <span className="text-xs font-extrabold uppercase tracking-widest text-amber-100 opacity-90 block mb-1">
          {label}
        </span>
        <div className="text-6xl font-black tracking-tight leading-none mb-3">
          {value}
        </div>
        {subtext && (
          <p className="text-sm text-amber-50 font-medium max-w-md">
            {subtext}
          </p>
        )}
      </div>

      <div className="flex gap-3 shrink-0">
        {onReset && (
          <button
            onClick={onReset}
            className="bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white font-bold p-3 rounded-2xl flex items-center justify-center gap-2 text-sm border border-white/10"
            title="Reset calculator inputs"
          >
            <RotateCcw size={18} />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
        <button
          onClick={handleShareClick}
          className="bg-white text-amber-600 hover:bg-amber-50 active:scale-95 transition-all font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-md"
        >
          <Share2 size={18} />
          Share
        </button>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl text-sm font-bold text-white flex items-center gap-2 ${
              toast.type === "error" ? "bg-red-500" : "bg-emerald-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
