import React from "react";
import { ArrowRight, Sparkles, Check } from "lucide-react";

export default function MetadataDiffPreview({
  originalMetadata,
  currentMetadata,
}) {
  const fields = [
    { key: "title", label: "Title" },
    { key: "author", label: "Author" },
    { key: "subject", label: "Subject" },
    { key: "keywords", label: "Keywords" },
    { key: "creator", label: "Creator" },
    { key: "producer", label: "Producer" },
  ];

  const changedFields = fields.filter((f) => {
    const origVal = (originalMetadata[f.key] || "").trim();
    const currVal = (currentMetadata[f.key] || "").trim();
    return origVal !== currVal;
  });

  if (changedFields.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-amber-50/40 border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-4 animate-fade">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-extrabold text-amber-900 flex items-center gap-2">
          <Sparkles size={16} className="text-amber-500" />
          Metadata Comparison Summary
        </h4>
        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-lg uppercase">
          {changedFields.length} field{changedFields.length !== 1 ? "s" : ""} modified
        </span>
      </div>

      {/* Diff Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-amber-200/60 text-[10px] font-black text-amber-800 uppercase tracking-wider">
              <th className="py-2 px-3">Property</th>
              <th className="py-2 px-3">Original Value</th>
              <th className="py-2 px-3"></th>
              <th className="py-2 px-3">Updated Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-amber-200/40">
            {changedFields.map((f) => {
              const orig = originalMetadata[f.key] || "(empty)";
              const curr = currentMetadata[f.key] || "(cleared)";
              return (
                <tr key={f.key} className="hover:bg-amber-100/30">
                  <td className="py-2.5 px-3 font-extrabold text-amber-950">
                    {f.label}
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 font-medium truncate max-w-[200px]">
                    {orig}
                  </td>
                  <td className="py-2.5 px-1 text-amber-500">
                    <ArrowRight size={12} />
                  </td>
                  <td className="py-2.5 px-3 font-bold text-amber-700 truncate max-w-[200px]">
                    {curr}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
