export const WORKLOAD_THRESHOLDS = {
  VERY_LIGHT: { max: 5, label: "Very Light", color: "text-slate-500", bg: "bg-slate-100" },
  LIGHT: { max: 11, label: "Light", color: "text-emerald-500", bg: "bg-emerald-50" },
  MODERATE: { max: 14, label: "Moderate (Full-Time)", color: "text-blue-500", bg: "bg-blue-50" },
  FULL_TIME: { max: 17, label: "Full-Time (Ideal)", color: "text-indigo-500", bg: "bg-indigo-50" },
  HEAVY: { max: Infinity, label: "Heavy (Overload)", color: "text-amber-500", bg: "bg-amber-50" }
};

export function getWorkloadClassification(credits) {
  if (credits === 0) return { label: "None", color: "text-slate-500", bg: "bg-slate-100" };
  
  for (const key in WORKLOAD_THRESHOLDS) {
    if (credits <= WORKLOAD_THRESHOLDS[key].max) {
      return {
        label: WORKLOAD_THRESHOLDS[key].label,
        color: WORKLOAD_THRESHOLDS[key].color,
        bg: WORKLOAD_THRESHOLDS[key].bg
      };
    }
  }
  return WORKLOAD_THRESHOLDS.HEAVY;
}

export const DEGREE_CONSTANTS = {
  DEFAULT_REQUIRED_CREDITS: 120,
  MAX_ALLOWED_CREDITS: 500,
  MAX_ALLOWED_SEMESTERS: 20,
  MAX_COURSE_CREDITS: 30
};
