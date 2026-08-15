import { Plus, Trash2 } from "lucide-react";

export default function CourseListForm({ courses, setCourses }) {

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), name: "", credits: "" }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter((c) => c.id !== id));
    } else {
      // If it's the last row, just clear it instead of removing
      setCourses([{ id: Date.now(), name: "", credits: "" }]);
    }
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  return (
    <div className="space-y-4">
      <div className="hidden sm:grid grid-cols-12 gap-3 mb-2 px-2 text-sm font-semibold text-slate-600">
        <div className="col-span-8">Course Name (Optional)</div>
        <div className="col-span-3">Credit Hours</div>
        <div className="col-span-1 text-center">Action</div>
      </div>

      <div className="space-y-3">
        {courses.map((course, index) => (
          <div key={course.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start bg-slate-50 p-3 sm:p-0 sm:bg-transparent rounded-lg sm:rounded-none border sm:border-0 border-slate-200">
            <div className="sm:col-span-8">
              <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Course Name</label>
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(course.id, "name", e.target.value)}
                placeholder={`e.g., Course ${index + 1}`}
                className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors bg-white shadow-sm"
              />
            </div>
            
            <div className="sm:col-span-3">
              <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Credit Hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={course.credits}
                onChange={(e) => updateCourse(course.id, "credits", e.target.value)}
                placeholder="e.g., 3"
                className="w-full h-11 px-4 rounded-lg border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors bg-white shadow-sm"
              />
            </div>

            <div className="sm:col-span-1 flex items-center justify-end sm:justify-center sm:h-11 mt-2 sm:mt-0">
              <button
                type="button"
                onClick={() => removeCourse(course.id)}
                className="text-slate-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label="Remove course"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={addCourse}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          Add Another Course
        </button>
      </div>
    </div>
  );
}
