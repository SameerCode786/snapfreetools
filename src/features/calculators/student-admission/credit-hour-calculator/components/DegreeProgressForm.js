export default function DegreeProgressForm({ config, setConfig }) {
  
  const updateConfig = (field, value) => {
    setConfig({ ...config, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Total Credits Required for Degree
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={config.targetCredits}
          onChange={(e) => updateConfig("targetCredits", e.target.value)}
          placeholder="e.g., 120"
          className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-1.5">Usually 120 for a US Bachelor's degree.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Credits Already Completed
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={config.completedCredits}
          onChange={(e) => updateConfig("completedCredits", e.target.value)}
          placeholder="e.g., 60"
          className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-1.5">Total earned before the current semester.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Credits In Current Semester
        </label>
        <input
          type="number"
          min="0"
          step="0.5"
          value={config.currentSemesterCredits}
          onChange={(e) => updateConfig("currentSemesterCredits", e.target.value)}
          placeholder="e.g., 15"
          className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-1.5">Credits you are currently taking.</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Remaining Semesters Planned
        </label>
        <input
          type="number"
          min="1"
          step="1"
          value={config.remainingSemesters}
          onChange={(e) => updateConfig("remainingSemesters", e.target.value)}
          placeholder="e.g., 4"
          className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors shadow-sm"
        />
        <p className="text-xs text-slate-500 mt-1.5">How many more semesters you plan to take.</p>
      </div>
    </div>
  );
}
