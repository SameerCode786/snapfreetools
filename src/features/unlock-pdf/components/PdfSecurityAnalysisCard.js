import React from "react";
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, HelpCircle, FileText } from "lucide-react";
import { formatFileSize } from "../utils/formatters";

export default function PdfSecurityAnalysisCard({ fileInfo }) {
  if (!fileInfo) return null;

  const {
    name,
    size,
    pageCount,
    isProtected,
    hasRestrictions,
    protectionType,
    securityLabel,
    encryptionAlgorithm,
    recommendation,
    isSupported
  } = fileInfo;

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-5 max-w-3xl mx-auto">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 shadow-xs border border-amber-100/50">
            <Shield size={22} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base tracking-tight">
              PDF Security Analysis
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold">
              Local browser security inspection
            </p>
          </div>
        </div>

        <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
          Client-Side Audit
        </span>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* File Info */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            File Name
          </span>
          <p className="font-extrabold text-slate-900 truncate text-sm" title={name}>
            {name}
          </p>
          <p className="text-slate-500 font-semibold text-[11px]">
            {formatFileSize(size)} {pageCount !== null && `• ${pageCount} ${pageCount === 1 ? "page" : "pages"}`}
          </p>
        </div>

        {/* Security Encryption */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Security Status
          </span>
          <div className="flex items-center gap-2 pt-0.5">
            {isProtected ? (
              <span className="inline-flex items-center gap-1.5 font-extrabold text-amber-700 bg-amber-100/90 px-2.5 py-0.5 rounded-full text-[11px] border border-amber-200">
                <Lock size={12} /> {encryptionAlgorithm} Encrypted
              </span>
            ) : hasRestrictions ? (
              <span className="inline-flex items-center gap-1.5 font-extrabold text-blue-700 bg-blue-100/90 px-2.5 py-0.5 rounded-full text-[11px] border border-blue-200">
                <Lock size={12} /> {encryptionAlgorithm} Restricted
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-700 bg-emerald-100/90 px-2.5 py-0.5 rounded-full text-[11px] border border-emerald-200">
                <Unlock size={12} /> Unprotected PDF
              </span>
            )}
          </div>
          <p className="text-slate-500 font-semibold text-[11px] pt-1">
            Algorithm: <strong className="text-slate-700">{encryptionAlgorithm}</strong>
          </p>
        </div>

        {/* Protection Type */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Protection Type
          </span>
          <p className="font-extrabold text-slate-900 text-xs">
            {protectionType}
          </p>
        </div>

        {/* Action Recommendation */}
        <div className="bg-slate-50/80 border border-slate-200/70 rounded-2xl p-4 space-y-1">
          <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
            Recommendation
          </span>
          <p className={`font-extrabold text-xs ${isProtected ? 'text-amber-800' : hasRestrictions ? 'text-blue-800' : 'text-emerald-800'}`}>
            {recommendation}
          </p>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-emerald-50/80 border border-emerald-100 rounded-2xl p-3 flex items-center gap-2.5 text-xs text-emerald-800 font-semibold">
        <Shield size={16} className="text-emerald-600 shrink-0" />
        <span>Your files never leave your device. All PDF security analysis and processing happen locally in your browser.</span>
      </div>
    </div>
  );
}
