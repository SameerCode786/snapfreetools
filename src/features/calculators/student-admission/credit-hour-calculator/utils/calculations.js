import { safeParseNumber, isValidCourse } from "./validation";
import { getWorkloadClassification } from "../constants/creditHourRules";

/**
 * Calculates total and average credits for a list of courses.
 * Used for both Mode A (Core) and Mode B (Semester).
 */
export function calculateCourseListWorkload(courses) {
  if (!Array.isArray(courses)) return createEmptyCourseResult();

  const validCourses = courses.filter(isValidCourse);
  const numCourses = validCourses.length;

  if (numCourses === 0) return createEmptyCourseResult();

  const totalCredits = validCourses.reduce((sum, course) => sum + safeParseNumber(course.credits), 0);
  const averageCredits = totalCredits / numCourses;
  const workload = getWorkloadClassification(totalCredits);

  return {
    totalCredits,
    numCourses,
    averageCredits,
    workload,
    isEmpty: false
  };
}

function createEmptyCourseResult() {
  return {
    totalCredits: 0,
    numCourses: 0,
    averageCredits: 0,
    workload: getWorkloadClassification(0),
    isEmpty: true
  };
}

/**
 * Calculates degree progress and projected semesters.
 * Used for Mode C (Degree Progress).
 */
export function calculateDegreeProgress(target, completed, currentSemester, remainingSemesters) {
  const safeTarget = safeParseNumber(target, 120);
  const safeCompleted = safeParseNumber(completed, 0);
  const safeCurrent = safeParseNumber(currentSemester, 0);
  const safeRemainingSemesters = safeParseNumber(remainingSemesters, 1);

  const totalEarnedSoFar = safeCompleted;
  const totalWithCurrent = Math.min(safeTarget, safeCompleted + safeCurrent);
  const remainingCredits = Math.max(0, safeTarget - totalWithCurrent);
  
  const completionPercentage = safeTarget > 0 ? (totalWithCurrent / safeTarget) * 100 : 0;
  
  let requiredAveragePerSemester = 0;
  if (remainingCredits > 0 && safeRemainingSemesters > 0) {
    requiredAveragePerSemester = remainingCredits / safeRemainingSemesters;
  }

  // Estimated semesters if they take 15 credits per semester on average
  const estimatedSemestersAt15 = Math.ceil(remainingCredits / 15);

  return {
    target: safeTarget,
    completed: safeCompleted,
    currentSemester: safeCurrent,
    totalWithCurrent,
    remainingCredits,
    completionPercentage: Math.min(100, Math.max(0, completionPercentage)),
    remainingSemesters: safeRemainingSemesters,
    requiredAveragePerSemester,
    estimatedSemestersAt15,
    isEmpty: safeCompleted === 0 && safeCurrent === 0 && remainingCredits === safeTarget
  };
}
