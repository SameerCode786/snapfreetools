import { calculatePercentage } from "../utils/calculations";

const Section = ({ title, prefix, data, updateData }) => {
  const obtained = data[`${prefix}Obtained`];
  const total = data[`${prefix}Total`];
  const percentage = calculatePercentage(obtained, total);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold text-slate-700 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Obtained Marks</label>
          <input
            type="number"
            min="0"
            step="any"
            value={obtained}
            onChange={(e) => updateData(`${prefix}Obtained`, e.target.value)}
            placeholder="e.g., 850"
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Total Marks</label>
          <input
            type="number"
            min="1"
            step="any"
            value={total}
            onChange={(e) => updateData(`${prefix}Total`, e.target.value)}
            placeholder="e.g., 1100"
            className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wider">Percentage</label>
          <div className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center text-slate-600 font-medium">
            {percentage > 0 ? `${percentage.toFixed(2)}%` : "0.00%"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdmissionInputForm({ data, updateData }) {
  return (
    <div className="space-y-2">
      <Section title="SSC / Matriculation" prefix="ssc" data={data} updateData={updateData} />
      <div className="h-px w-full bg-slate-100 my-4"></div>
      <Section title="HSSC / Intermediate" prefix="hssc" data={data} updateData={updateData} />
      <div className="h-px w-full bg-slate-100 my-4"></div>
      <Section title="Entry Test" prefix="et" data={data} updateData={updateData} />
    </div>
  );
}
