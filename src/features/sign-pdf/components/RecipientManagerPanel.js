"use client";

import React from "react";
import {
  Users,
  Plus,
  Trash2,
  ArrowDown,
  Shuffle,
  Shield,
  CheckCircle,
  Eye,
  AlertCircle
} from "lucide-react";
import {
  RECIPIENT_ROLES,
  RECIPIENT_COLORS
} from "../utils/recipientUtils";

export default function RecipientManagerPanel({
  recipients = [],
  onAddRecipient,
  onUpdateRecipient,
  onRemoveRecipient,
  signingOrderMode = "sequential",
  onToggleSigningOrderMode,
  recipientErrors = {},
  activeRecipientId,
  onSelectActiveRecipient
}) {
  const getRoleIcon = (role) => {
    switch (role) {
      case "validator":
        return Eye;
      case "witness":
        return Shield;
      case "signer":
      default:
        return CheckCircle;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Recipients ({recipients.length})
            </h3>
            <p className="text-[11px] text-slate-400">Manage signers, validators & order</p>
          </div>
        </div>

        <button
          onClick={onAddRecipient}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
          title="Add another recipient"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Signing Order Mode Toggle */}
      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
          Signing Order
        </label>
        <div className="grid grid-cols-2 gap-1.5 bg-white p-1 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => onToggleSigningOrderMode("sequential")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
              signingOrderMode === "sequential"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="Recipients will sign one after another in numerical order"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Sequential (1→2→3)</span>
          </button>
          <button
            type="button"
            onClick={() => onToggleSigningOrderMode("parallel")}
            className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs font-semibold transition-all ${
              signingOrderMode === "parallel"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="All recipients can sign at the same time"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Parallel (Any Order)</span>
          </button>
        </div>
      </div>

      {/* Recipient Cards List */}
      <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
        {recipients.map((rec, idx) => {
          const errors = recipientErrors[rec.id] || [];
          const hasError = errors.length > 0;
          const RoleIcon = getRoleIcon(rec.role);
          const colorObj = rec.color || RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length];
          const isSelected = rec.id === activeRecipientId;

          return (
            <div
              key={rec.id}
              onClick={() => onSelectActiveRecipient?.(rec.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                isSelected
                  ? "ring-2 ring-blue-500/40 border-blue-500 bg-blue-50/10 shadow-xs"
                  : "border-slate-200/80 bg-white hover:border-slate-300"
              }`}
            >
              {/* Card Header: Sequence Order & Color Badge */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-xs"
                    style={{ backgroundColor: colorObj.primary }}
                  >
                    {signingOrderMode === "sequential" ? rec.order : idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {rec.name || `Recipient ${idx + 1}`}
                  </span>
                  {isSelected && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-blue-100 text-blue-800">
                      Active
                    </span>
                  )}
                </div>

                {recipients.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveRecipient(rec.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove recipient"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Input Fields */}
              <div className="space-y-2">
                <div>
                  <input
                    type="text"
                    value={rec.name}
                    onChange={(e) => onUpdateRecipient(rec.id, { name: e.target.value })}
                    placeholder="Full Name (e.g. John Doe)"
                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    value={rec.email}
                    onChange={(e) => onUpdateRecipient(rec.id, { email: e.target.value })}
                    placeholder="Email Address (e.g. john@example.com)"
                    className="w-full px-2.5 py-1.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Role Selector */}
                <div className="flex items-center gap-1.5">
                  <select
                    value={rec.role}
                    onChange={(e) => onUpdateRecipient(rec.id, { role: e.target.value })}
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {RECIPIENT_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.label} – {r.desc}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Inline Error Notices */}
              {hasError && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg space-y-1">
                  {errors.map((err, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-red-600 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{err}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Receiver Footer */}
      <button
        onClick={onAddRecipient}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200/80 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>+ Add Receiver</span>
      </button>
    </div>
  );
}
