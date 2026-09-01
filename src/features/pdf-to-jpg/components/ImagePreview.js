import React from "react";
import { X } from "lucide-react";

export default function ImagePreview({ url, onClose }) {
  if (!url) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade cursor-zoom-out"
      role="dialog"
      aria-modal="true"
      aria-label="Expanded Image Preview"
    >
      <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
        {/* Close trigger button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-12 right-0 sm:-right-4 bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-full border border-slate-700 shadow-md transition-colors"
          aria-label="Close Preview"
        >
          <X size={16} />
        </button>

        {/* The Expanded Image asset */}
        <img
          src={url}
          alt="Expanded JPG Preview"
          className="object-contain max-h-[80vh] max-w-full rounded-2xl border border-slate-800 shadow-2xl bg-white select-none animate-scale cursor-default"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}
