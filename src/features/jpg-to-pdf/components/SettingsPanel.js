import React from "react";
import { FileText, Compass, Layout, Sliders, Trash2, Plus } from "lucide-react";

export default function SettingsPanel({
  settings,
  onChangeSetting,
  onAddImages,
  onClearAll,
  onConvert,
  isConverting,
  imageCount
}) {
  const pageSizes = [
    { value: "fit", label: "Fit Image" },
    { value: "a4", label: "A4 (210 x 297 mm)" },
    { value: "letter", label: "US Letter (215.9 x 279.4 mm)" }
  ];

  const orientations = [
    { value: "auto", label: "Auto" },
    { value: "portrait", label: "Portrait" },
    { value: "landscape", label: "Landscape" }
  ];

  const margins = [
    { value: "none", label: "None" },
    { value: "small", label: "Small" },
    { value: "large", label: "Large" }
  ];

  return (
    <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Sliders className="text-slate-500" size={18} />
        <h3 className="font-extrabold text-slate-800 text-sm">PDF Settings</h3>
      </div>

      {/* Page Size */}
      <div className="space-y-2">
        <label htmlFor="pdf-page-size" className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
          <FileText size={14} className="text-slate-400" />
          Page Size
        </label>
        <div className="relative">
          <select
            id="pdf-page-size"
            value={settings.pageSize}
            onChange={(e) => onChangeSetting("pageSize", e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl p-3.5 pr-10 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.65rem_auto] bg-[right_1rem_center] bg-no-repeat focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all cursor-pointer outline-none"
          >
            {pageSizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orientation */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
          <Compass size={14} className="text-slate-400" />
          Orientation
        </label>
        <div className="grid grid-cols-3 gap-2">
          {orientations.map((orientation) => {
            const isActive = settings.orientation === orientation.value;
            
            return (
              <button
                key={orientation.value}
                type="button"
                onClick={() => onChangeSetting("orientation", orientation.value)}
                className={`py-2 px-1.5 rounded-xl text-center text-[10px] font-bold border transition-all ${
                  isActive
                    ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {orientation.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Margin */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-600 uppercase tracking-wide flex items-center gap-1.5">
          <Layout size={14} className="text-slate-400" />
          Page Margin
        </label>
        <div className="grid grid-cols-3 gap-2">
          {margins.map((margin) => (
            <button
              key={margin.value}
              type="button"
              onClick={() => onChangeSetting("margin", margin.value)}
              className={`py-2 px-1.5 rounded-xl text-center text-[10px] font-bold border transition-all ${
                settings.margin === margin.value
                  ? "bg-amber-50 border-amber-300 text-amber-700 shadow-sm"
                  : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {margin.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-200 space-y-3">
        <button
          type="button"
          onClick={onAddImages}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-sm transition-all"
        >
          <Plus size={16} className="text-slate-500" />
          Add More Images
        </button>

        <button
          type="button"
          onClick={onClearAll}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-red-200 bg-white hover:bg-red-50 text-red-600 font-bold text-xs transition-all"
        >
          <Trash2 size={16} />
          Clear All ({imageCount})
        </button>

        <button
          type="button"
          disabled={isConverting}
          onClick={onConvert}
          className={`w-full flex items-center justify-center gap-2 py-4 px-4 rounded-xl font-bold text-sm text-white shadow-md transition-all ${
            isConverting
              ? "bg-slate-400 cursor-not-allowed shadow-none"
              : "bg-amber-500 hover:bg-amber-600 active:scale-[0.98]"
          }`}
        >
          {isConverting ? "Creating PDF..." : "Convert to PDF"}
        </button>
      </div>
    </div>
  );
}
