import React from "react";
import { Shield, Lock, Printer, Copy, Edit, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

export default function SecurityOptionsCard({
  keyLength,
  setKeyLength,
  permissions,
  setPermissions,
  isAdvancedOpen,
  setIsAdvancedOpen
}) {
  const togglePermission = (key) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0 shadow-xs border border-amber-100/50">
            <Shield size={20} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base tracking-tight">
              Security & Permissions Settings
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold">
              Configure encryption algorithm and document restrictions
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
        >
          <span>{isAdvancedOpen ? "Basic Settings" : "Advanced Options"}</span>
          {isAdvancedOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Encryption Algorithm Selection */}
      <div className="space-y-3">
        <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
          Encryption Algorithm
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* AES-256 */}
          <div
            onClick={() => setKeyLength("256")}
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex items-start gap-3 ${
              keyLength === "256"
                ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-100"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="encryption-algo"
              checked={keyLength === "256"}
              onChange={() => setKeyLength("256")}
              className="mt-0.5 text-amber-500 focus:ring-amber-400"
            />
            <div>
              <div className="font-black text-slate-900 flex items-center gap-1.5">
                <span>AES-256</span>
                <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded-full border border-amber-200">Recommended</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold pt-1">
                ISO 32000 Revision 6 maximum security encryption (PDF 1.7 / 2.0).
              </p>
            </div>
          </div>

          {/* AES-128 */}
          <div
            onClick={() => setKeyLength("128")}
            className={`border rounded-2xl p-4 cursor-pointer transition-all flex items-start gap-3 ${
              keyLength === "128"
                ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-100"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
          >
            <input
              type="radio"
              name="encryption-algo"
              checked={keyLength === "128"}
              onChange={() => setKeyLength("128")}
              className="mt-0.5 text-amber-500 focus:ring-amber-400"
            />
            <div>
              <div className="font-black text-slate-900 flex items-center gap-1.5">
                <span>AES-128</span>
                <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full border border-slate-200">High Compatibility</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold pt-1">
                Standard 128-bit AES encryption for legacy PDF readers (PDF 1.5+).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Granular Permissions */}
      {isAdvancedOpen && (
        <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
          <div className="space-y-1">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              Document Usage Restrictions
            </label>
            <p className="text-[11px] text-slate-500 font-semibold">
              Select which actions are allowed or restricted when opening this PDF:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Printing */}
            <label className="border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Printer size={16} className="text-slate-500 shrink-0" />
                <span className="font-bold text-slate-800">Allow Printing</span>
              </div>
              <input
                type="checkbox"
                checked={permissions.printing}
                onChange={() => togglePermission("printing")}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            {/* Copying */}
            <label className="border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Copy size={16} className="text-slate-500 shrink-0" />
                <span className="font-bold text-slate-800">Allow Text & Graphics Copying</span>
              </div>
              <input
                type="checkbox"
                checked={permissions.copying}
                onChange={() => togglePermission("copying")}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            {/* Editing */}
            <label className="border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <Edit size={16} className="text-slate-500 shrink-0" />
                <span className="font-bold text-slate-800">Allow Page Editing & Modifications</span>
              </div>
              <input
                type="checkbox"
                checked={permissions.modifying}
                onChange={() => togglePermission("modifying")}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>

            {/* Annotations */}
            <label className="border border-slate-200 hover:border-slate-300 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <MessageSquare size={16} className="text-slate-500 shrink-0" />
                <span className="font-bold text-slate-800">Allow Comments & Form Filling</span>
              </div>
              <input
                type="checkbox"
                checked={permissions.annotating}
                onChange={() => togglePermission("annotating")}
                className="w-4 h-4 text-amber-500 rounded focus:ring-amber-400"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
