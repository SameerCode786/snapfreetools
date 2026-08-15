/**
 * Safely parses a number, preventing NaN and Infinity.
 */
export function safeParseNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  if (isNaN(num) || !isFinite(num) || num < 0) return fallback;
  return num;
}

/**
 * Validates a single course object for Core and Semester modes.
 */
export function isValidCourse(course) {
  if (!course) return false;
  const credits = safeParseNumber(course.credits);
  return credits > 0 && credits <= 30; // Max reasonable credits for a single course
}

/**
 * Validates degree progress inputs.
 */
export function validateDegreeProgress(target, completed, currentSemester) {
  const safeTarget = safeParseNumber(target);
  const safeCompleted = safeParseNumber(completed);
  const safeCurrent = safeParseNumber(currentSemester);

  let errors = [];

  if (safeTarget <= 0) {
    errors.push("Degree requirement must be greater than 0.");
  }
  
  if (safeCompleted > safeTarget && safeTarget > 0) {
    errors.push("Completed credits cannot exceed total required credits.");
  }

  if (safeCurrent > 40) {
    errors.push("Current semester credits seem unusually high. Max allowed is 40.");
  }

  if (safeCompleted + safeCurrent > safeTarget && safeTarget > 0) {
    errors.push("Total projected credits exceed the degree requirement.");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
