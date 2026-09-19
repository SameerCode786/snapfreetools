"use client";

import React, { useState } from "react";
import {
  X,
  FileCheck,
  Users,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Save,
  Clock,
  ShieldCheck,
  AlertCircle
} from "lucide-react";

export default function PreparationSummaryModal({
  isOpen,
  onClose,
  file,
  recipients = [],
  fieldsByPage = {},
  signingOrderMode = "sequential",
  onSavePreparation
}) {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const allFields = Object.values(fieldsByPage).flat().filter(Boolean);
  const requiredCount = allFields.filter((f) => f.required !== false).length;
  const optionalCount = allFields.length - requiredCount;

  // Group fields by recipient
  const fieldsByRecipient = {};
  recipients.forEach((rec) => {
    fieldsByRecipient[rec.id] = allFields.filter((f) => f.recipientId === rec.id);
  });

  const handleSave = () => {
    if (onSavePreparation) {
      onSavePreparation();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleContinue = () => {
    handleSave();
    setIsFinished(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">
                Document Preparation Summary
              </h3>
              <p className="text-xs text-slate-500">
                Review assigned fields and signing sequence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-xl border border-emerald-200 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Preparation state saved locally to browser session!</span>
            </div>
          )}

          {isFinished ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-slate-900">
                  Document Ready for Multi-Recipient Dispatch
                </h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your PDF fields, recipient assignments, and signing sequence have been successfully prepared and preserved locally.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 max-w-md mx-auto text-xs text-slate-600">
                <p className="font-semibold text-slate-800">Next Steps Information:</p>
                <p>
                  • Document preparation is saved in your browser session.
                </p>
                <p>
                  • Direct email invitation links and recipient signing sessions will be connected in Phase 3.
                </p>
              </div>

              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                Close & Return to Editor
              </button>
            </div>
          ) : (
            <>
              {/* Document Stats Overview */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Pages</span>
                  <span className="text-base font-bold text-slate-800">{file?.pageCount || 1}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Recipients</span>
                  <span className="text-base font-bold text-slate-800">{recipients.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Total Fields</span>
                  <span className="text-base font-bold text-slate-800">{allFields.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">Signing Order</span>
                  <span className="text-xs font-bold text-blue-600 capitalize block mt-0.5">
                    {signingOrderMode}
                  </span>
                </div>
              </div>

              {/* Recipient Breakdown List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Recipient Field Allocation
                </h4>

                <div className="space-y-2.5">
                  {recipients.map((rec, idx) => {
                    const assignedFields = fieldsByRecipient[rec.id] || [];
                    const colorObj = rec.color;

                    return (
                      <div
                        key={rec.id}
                        className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                              style={{ backgroundColor: colorObj?.primary || "#2563eb" }}
                            >
                              {signingOrderMode === "sequential" ? rec.order : idx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-900">
                              {rec.name || `Recipient ${idx + 1}`}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ({rec.email || "No email entered"})
                            </span>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                            {rec.role}
                          </span>
                        </div>

                        {/* Fields Assigned to This Recipient */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {assignedFields.length > 0 ? (
                            assignedFields.map((fld) => (
                              <span
                                key={fld.id}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold border flex items-center gap-1"
                                style={{
                                  backgroundColor: colorObj?.bg || "#eff6ff",
                                  borderColor: colorObj?.border || "#bfdbfe",
                                  color: colorObj?.text || "#1e40af"
                                }}
                              >
                                <span>{fld.type.toUpperCase()}</span>
                                <span className="text-[9px] opacity-75">(P.{fld.pageNumber || 1})</span>
                                {fld.required !== false && <span className="text-red-500 font-bold">*</span>}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-amber-600 font-medium italic">
                              ⚠️ No fields assigned yet to this recipient
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isFinished && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Back to Edit
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-xs transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Preparation</span>
              </button>

              <button
                onClick={handleContinue}
                className="flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
