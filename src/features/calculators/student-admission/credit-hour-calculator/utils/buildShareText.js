export function buildShareText(mode, result) {
  let text = "Credit Hour Calculator Result\n\n";

  if (mode === "core" || mode === "semester") {
    text += `Total Credits: ${result.totalCredits.toFixed(1).replace(/\.0$/, '')}\n`;
    text += `Number of Courses: ${result.numCourses}\n`;
    text += `Avg. Credits per Course: ${result.averageCredits.toFixed(1)}\n`;
    if (result.workload) {
      text += `Workload Level: ${result.workload.label}\n`;
    }
  } else if (mode === "degree") {
    text += `Total Degree Credits Required: ${result.target}\n`;
    text += `Completed Credits: ${result.totalWithCurrent}\n`;
    text += `Remaining Credits: ${result.remainingCredits}\n`;
    text += `Degree Progress: ${result.completionPercentage.toFixed(1)}%\n`;
    if (result.requiredAveragePerSemester > 0) {
      text += `Required per Semester: ${result.requiredAveragePerSemester.toFixed(1)} credits\n`;
    }
  }

  text += "\nCalculate yours at: https://www.snapfreetools.com/credit-hour-calculator";
  return text;
}
