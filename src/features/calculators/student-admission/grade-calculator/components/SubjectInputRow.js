import { Trash2, Plus, AlertCircle } from "lucide-react";
import CalculatorInput from "@/features/student-hub/shared/components/CalculatorInput";
import { motion, AnimatePresence } from "motion/react";

export default function SubjectInputRow({ 
  subjects, 
  setSubjects, 
  mode = "multiple" // "multiple" or "weighted"
}) {
  const addRow = () => {
    setSubjects([...subjects, { id: Date.now(), name: "", obtained: "", total: "", weight: "" }]);
  };

  const removeRow = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  const updateRow = (id, field, value) => {
    setSubjects(subjects.map(s => {
      if (s.id === id) {
        return { ...s, [field]: value };
      }
      return s;
    }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-700">Subjects / Assessments</h3>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: "auto", scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-50 border border-slate-200 p-4 rounded-xl grid grid-cols-12 gap-2 items-center"
            >
              <div className={mode === "weighted" ? "col-span-12 sm:col-span-4" : "col-span-12 sm:col-span-5"}>
                <CalculatorInput
                  label="Name (Optional)"
                  type="text"
                  placeholder={`Subject ${index + 1}`}
                  value={subject.name}
                  onChange={(e) => updateRow(subject.id, "name", e.target.value)}
                />
              </div>
              
              <div className={mode === "weighted" ? "col-span-5 sm:col-span-2" : "col-span-5 sm:col-span-3"}>
                <CalculatorInput
                  label={mode === "weighted" ? "Score" : "Obtained"}
                  type="number"
                  placeholder="e.g. 85"
                  value={subject.obtained}
                  onChange={(e) => updateRow(subject.id, "obtained", e.target.value)}
                  min="0"
                />
              </div>

              <div className={mode === "weighted" ? "col-span-5 sm:col-span-2" : "col-span-5 sm:col-span-3"}>
                <CalculatorInput
                  label={mode === "weighted" ? "Max Score" : "Total Marks"}
                  type="number"
                  placeholder="e.g. 100"
                  value={subject.total}
                  onChange={(e) => updateRow(subject.id, "total", e.target.value)}
                  min="0"
                />
              </div>

              {mode === "weighted" && (
                <div className="col-span-10 sm:col-span-3">
                  <CalculatorInput
                    label="Weight %"
                    type="number"
                    placeholder="e.g. 20"
                    value={subject.weight}
                    onChange={(e) => updateRow(subject.id, "weight", e.target.value)}
                    min="0"
                    max="100"
                  />
                </div>
              )}

              <div className="col-span-2 sm:col-span-1 flex justify-center items-end h-full pb-1">
                <button
                  onClick={() => removeRow(subject.id)}
                  disabled={subjects.length === 1}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove subject"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={addRow}
        className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50 rounded-xl text-slate-500 hover:text-amber-600 font-semibold flex items-center justify-center gap-2 transition-all"
      >
        <Plus size={18} />
        Add Another Subject
      </button>
    </div>
  );
}
