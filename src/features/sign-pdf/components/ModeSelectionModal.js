"use client";

import React from "react";
import { User, Users, ShieldCheck, ArrowRight, Zap, Clock, Mail, CheckCircle2 } from "lucide-react";

export default function ModeSelectionModal({
  isOpen,
  onSelectOnlyMe,
  onSelectSeveralPeople,
  fileName = "document.pdf"
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-8 pt-8 pb-4 text-center border-b border-slate-100 bg-linear-to-b from-slate-50 to-white">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            Document Ready for Signing
          </span>
          <h3 className="text-2xl font-bold text-slate-900">Who will sign this document?</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Choose whether you want to sign <span className="font-semibold text-slate-700">{fileName}</span> yourself or prepare it for multiple recipients.
          </p>
        </div>

        {/* Options Cards */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Option A: Only Me */}
          <div
            onClick={onSelectOnlyMe}
            className="group relative p-6 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/20 hover:bg-emerald-50/40 hover:border-emerald-600 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">Only Me</h4>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md bg-emerald-100 text-emerald-800">
                    Instant
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Sign this document yourself. Place signatures, initials, dates, names, text, and stamps right now.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-emerald-100/60 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% in-browser processing</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Zero file uploads to any server</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectOnlyMe();
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all"
            >
              <span>Sign Document Myself</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Option B: Several People */}
          <div
            onClick={onSelectSeveralPeople}
            className="group relative p-6 rounded-2xl border-2 border-blue-500/80 bg-blue-50/20 hover:bg-blue-50/40 hover:border-blue-600 transition-all cursor-pointer flex flex-col justify-between shadow-sm hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-slate-900">Several People</h4>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide rounded-md bg-blue-100 text-blue-800">
                    Prepare
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Prepare document for multiple recipients. Add signers, validators, set signing sequence, and assign fields.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-blue-100/60 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Signer, Validator & Witness roles</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Color-coded field assignment</span>
                </div>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectSeveralPeople();
              }}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all"
            >
              <span>Prepare for Several People</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="px-8 py-4 bg-slate-50/80 border-t border-slate-100 text-center text-[11px] text-slate-400">
          🔒 SnapFreeTools preserves your original document structure and never alters original page text.
        </div>
      </div>
    </div>
  );
}
