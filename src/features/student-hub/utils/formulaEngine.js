/**
 * Shared mathematical engines for the Student Calculator Hub
 */
import { GRADE_SCALES } from "../shared/constants/gradeScales";

// Calculate GPA/SGPA based on courses and a selected grade scale
export function calculateGPA(courses, scale = "standard-4", customScaleObj = null) {
  if (!courses || courses.length === 0) return "0.00";

  let totalPoints = 0;
  let totalCredits = 0;
  let validCourses = 0;

  // Resolve scale max limit
  const scaleObj = customScaleObj || GRADE_SCALES[scale];
  const maxScaleLimit = scaleObj?.max || 4.0;

  courses.forEach(course => {
    const credits = parseFloat(course.credits);
    if (!isNaN(credits) && credits > 0) {
      let gradeValue = null;

      if (customScaleObj) {
        if (course.grade in customScaleObj.grades) {
          gradeValue = customScaleObj.grades[course.grade];
        }
      } else {
        // Fallback default
        const parsedGrade = parseFloat(course.grade);
        if (!isNaN(parsedGrade)) {
          gradeValue = parsedGrade;
        } else if (scaleObj && course.grade in scaleObj.grades) {
          gradeValue = scaleObj.grades[course.grade];
        }
      }

      // Skip unrecognized grades entirely
      if (gradeValue !== null && gradeValue !== undefined) {
        // Clamp grade to [0, maxScaleLimit]
        const clampedGrade = Math.max(0, Math.min(maxScaleLimit, gradeValue));
        totalPoints += clampedGrade * credits;
        totalCredits += credits;
        validCourses++;
      }
    }
  });

  if (totalCredits === 0) return "0.00";
  const finalGPA = totalPoints / totalCredits;
  const rounded = Math.round((finalGPA + 1e-9) * 100) / 100;
  return rounded.toFixed(2);
}

// Calculate Cumulative GPA (CGPA) from previous semester averages
export function calculateCGPA(semesters) {
  if (!semesters || semesters.length === 0) return "0.00";

  let totalPoints = 0;
  let totalCredits = 0;

  semesters.forEach(sem => {
    const gpa = parseFloat(sem.gpa);
    const credits = parseFloat(sem.credits);
    if (!isNaN(gpa) && !isNaN(credits) && credits > 0) {
      // Clamp GPA to >= 0
      const clampedGPA = Math.max(0, gpa);
      totalPoints += clampedGPA * credits;
      totalCredits += credits;
    }
  });

  if (totalCredits === 0) return "0.00";
  const finalCGPA = totalPoints / totalCredits;
  const rounded = Math.round((finalCGPA + 1e-9) * 100) / 100;
  return rounded.toFixed(2);
}

// Convert GPA to Percentage
// Supports standard ratio (e.g. 4.0 GPA -> 100%) and the common linear conversion formula (GPA * 20) + 20
export function gpaToPercentage(gpaVal, maxScale = 4.0, method = "linear") {
  const gpa = parseFloat(gpaVal);
  if (isNaN(gpa)) return 0;

  // Clamp GPA to [0, maxScale]
  const clampedGPA = Math.max(0, Math.min(maxScale, gpa));

  let pct = 0;
  if (method === "linear" && maxScale === 4.0) {
    pct = clampedGPA * 20 + 20;
  } else {
    pct = (clampedGPA / maxScale) * 100;
  }

  // Clamp result to [0, 100]
  const clampedPct = Math.max(0, Math.min(100, pct));
  return Math.round((clampedPct + 1e-9) * 100) / 100;
}

// Convert Percentage to GPA
export function percentageToGPAMath(percentageVal, maxScale = 4.0, method = "linear") {
  const pct = parseFloat(percentageVal);
  if (isNaN(pct)) return 0;

  // Clamp percentage to [0, 100]
  const clampedPct = Math.max(0, Math.min(100, pct));

  let gpa = 0;
  if (method === "linear" && maxScale === 4.0) {
    gpa = (clampedPct - 20) / 20;
  } else {
    gpa = (clampedPct / 100) * maxScale;
  }

  // Clamp result to [0, maxScale]
  const clampedGPA = Math.max(0, Math.min(maxScale, gpa));
  return Math.round((clampedGPA + 1e-9) * 100) / 100;
}

// Calculate required GPA next semester to reach a target cumulative GPA
export function calculateRequiredGPA(currentCGPA, currentCredits, targetCGPA, futureCredits) {
  const cgpa = parseFloat(currentCGPA);
  const curCred = parseFloat(currentCredits);
  const target = parseFloat(targetCGPA);
  const futCred = parseFloat(futureCredits);

  if (
    isNaN(cgpa) || cgpa < 0 ||
    isNaN(curCred) || curCred < 0 ||
    isNaN(target) || target < 0 ||
    isNaN(futCred) || futCred <= 0
  ) {
    return null;
  }

  // Clamp inputs to maximum scale limit (5.0 scale support)
  const clampedCGPA = Math.min(5.0, cgpa);
  const clampedTarget = Math.min(5.0, target);

  const totalCredits = curCred + futCred;
  const totalPointsNeeded = clampedTarget * totalCredits;
  const currentPoints = clampedCGPA * curCred;
  const pointsNeeded = totalPointsNeeded - currentPoints;
  const reqGPA = pointsNeeded / futCred;

  return {
    requiredGPA: Math.round((reqGPA + 1e-9) * 100) / 100,
    pointsNeeded: Math.round((pointsNeeded + 1e-9) * 100) / 100,
    totalCredits
  };
}

// Calculate grade needed on a final exam
export function calculateFinalGradeNeeded(currentGrade, targetGrade, finalExamWeight) {
  const current = parseFloat(currentGrade);
  const target = parseFloat(targetGrade);
  const weight = parseFloat(finalExamWeight) / 100;

  if (
    isNaN(current) || current < 0 ||
    isNaN(target) || target < 0 ||
    isNaN(weight) || weight <= 0 || weight > 1
  ) {
    return null;
  }

  // Clamp current/target values up to 150% (allow extra credit)
  const clampedCurrent = Math.max(0, Math.min(150, current));
  const clampedTarget = Math.max(0, Math.min(150, target));

  const needed = (clampedTarget - clampedCurrent * (1 - weight)) / weight;
  return Math.round((needed + 1e-9) * 100) / 100;
}

// Calculate merit aggregate scores based on inputs with custom weights
export function calculateMeritAggregate(fields) {
  let totalAggregate = 0;
  let totalWeight = 0;

  for (const key in fields) {
    const field = fields[key];
    let val = parseFloat(field.value);
    if (!isNaN(val)) {
      // Clamp inputs between min and max limits
      const minVal = field.min !== undefined && field.min !== null ? parseFloat(field.min) : 0;
      const maxVal = field.max !== undefined && field.max !== null ? parseFloat(field.max) : (field.outOf ? parseFloat(field.outOf) : 100);
      
      val = Math.max(minVal, Math.min(maxVal, val));

      let percentVal = val;
      if (field.isScore && field.outOf) {
        const outOfVal = parseFloat(field.outOf) || 100;
        percentVal = (val / outOfVal) * 100;
      }

      // Normalize component percentage to max 100%
      percentVal = Math.max(0, Math.min(100, percentVal));

      totalAggregate += percentVal * field.weight;
      totalWeight += field.weight;
    }
  }

  if (totalWeight === 0) return "0.00";
  const finalAggregate = totalAggregate / totalWeight;
  const rounded = Math.round((finalAggregate + 1e-9) * 100) / 100;
  return rounded.toFixed(2);
}

export { calculateGPA as calculateSGPA };

