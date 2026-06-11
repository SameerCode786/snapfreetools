export const GRADE_VALUES = {
  "A+": 4.0, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};

export function calculateGPA(courses) {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(c => {
    const credits = parseFloat(c.credits) || 0;
    const points = GRADE_VALUES[c.grade] || 0;
    totalPoints += points * credits;
    totalCredits += credits;
  });

  return totalCredits === 0 ? "0.00" : (totalPoints / totalCredits).toFixed(2);
}
