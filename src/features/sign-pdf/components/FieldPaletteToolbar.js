"use client";

import React from "react";
import {
  PenTool,
  Type,
  User,
  Calendar,
  FileText,
  Award,
  Users,
  ChevronDown
} from "lucide-react";

export const AVAILABLE_FIELDS = [
  {
    type: "signature",
    label: "Signature",
    desc: "Draw, type, or upload signature",
    icon: PenTool,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100/60"
  },
  {
    type: "initials",
    label: "Initials",
    desc: "Monogram or short script",
    icon: Type,
    color: "text-teal-600 bg-teal-50 border-teal-200 hover:border-teal-400 hover:bg-teal-100/60"
  },
  {
    type: "name",
    label: "Name",
    desc: "Signer full name",
    icon: User,
    color: "text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100/60"
  },
  {
    type: "date",
    label: "Date",
    desc: "Today or custom date",
    icon: Calendar,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100/60"
  },
  {
    type: "text",
    label: "Text Field",
    desc: "Custom notes or remarks",
    icon: FileText,
    color: "text-slate-700 bg-slate-100 border-slate-200 hover:border-slate-400 hover:bg-slate-200/60"
  },
  {
    type: "stamp",
    label: "Company Stamp",
    desc: "Official seal or logo",
    icon: Award,
    color: "text-amber-700 bg-amber-50 border-amber-200 hover:border-amber-400 hover:bg-amber-100/60"
  }
];

export default function FieldPaletteToolbar({
  onAddField,
  activeFieldCount = 0,
  mode = "only-me",
  recipients = [],
  activeRecipientId,
  onSelectActiveRecipient
}) {
  const activeRecipient = recipients.find((r) => r.id === activeRecipientId) || recipients[0];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-3 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Add PDF Form Fields
        </span>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
          {activeFieldCount} {activeFieldCount === 1 ? "field" : "fields"} placed
        </span>
      </div>

      {/* Recipient Quick Selector in Several People Mode */}
      {mode === "several-people" && recipients.length > 0 && (
        <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Assigning To Recipient:
          </label>
          <div className="relative">
            <select
              value={activeRecipient?.id || ""}
              onChange={(e) => onSelectActiveRecipient?.(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs font-bold rounded-lg border focus:outline-none focus:ring-1 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
              style={{
                color: activeRecipient?.color?.text || "#1e40af",
                borderColor: activeRecipient?.color?.border || "#93c5fd"
              }}
            >
              {recipients.map((rec) => (
                <option key={rec.id} value={rec.id}>
                  {rec.order}. {rec.name || "Unnamed"} ({rec.role})
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Field Buttons Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-3 gap-2">
        {AVAILABLE_FIELDS.map((f) => {
          const IconComp = f.icon;
          return (
            <button
              key={f.type}
              onClick={() => onAddField(f.type, activeRecipient?.id)}
              className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center group ${f.color}`}
              title={`Add ${f.label} to current page`}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <IconComp className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold leading-tight text-slate-800">
                {f.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
