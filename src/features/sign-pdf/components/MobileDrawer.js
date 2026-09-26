"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * MobileDrawer
 * Accessible slide-over drawer / bottom-sheet for mobile and tablet screens.
 * Includes backdrop blur, escape key support, body scroll locking, and ARIA dialog semantics.
 */
export default function MobileDrawer({
  isOpen,
  onClose,
  title,
  icon: Icon,
  badge,
  position = "bottom", // 'bottom' | 'right' | 'left'
  children
}) {
  // Lock body scroll when drawer is open and restore on unmount/close
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isBottom = position === "bottom";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="mobile-drawer-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
    >
      {/* Semi-transparent backdrop with click-to-dismiss */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel Container */}
      <div
        className={`relative z-10 w-full bg-white shadow-2xl border border-slate-200/80 flex flex-col transition-transform ${
          isBottom
            ? "max-h-[85vh] sm:max-h-[80vh] sm:max-w-lg rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom duration-250"
            : "h-full max-w-sm sm:max-w-md rounded-l-3xl animate-in slide-in-from-right duration-250 ml-auto"
        }`}
      >
        {/* Drag Handle indicator for bottom sheets on mobile */}
        {isBottom && (
          <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />
        )}

        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <div>
              <h3 id="mobile-drawer-title" className="text-sm font-bold text-slate-800">
                {title}
              </h3>
            </div>
            {badge && (
              <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200/60 ml-1">
                {badge}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-4 overflow-y-auto overscroll-contain flex-1 max-h-[calc(85vh-80px)] sm:max-h-[calc(80vh-80px)] space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
