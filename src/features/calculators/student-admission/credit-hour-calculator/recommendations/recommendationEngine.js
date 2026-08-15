export function getCourseListRecommendations(result) {
  if (result.isEmpty) return [];

  const recommendations = [];

  if (result.totalCredits > 0) {
    recommendations.push({
      type: "info",
      text: `You have planned a total of ${result.totalCredits} credit hours across ${result.numCourses} course${result.numCourses !== 1 ? 's' : ''}.`
    });
  }

  if (result.workload) {
    let workloadText = `This is considered a ${result.workload.label} workload.`;
    if (result.workload.label.includes("Heavy")) {
      workloadText += " Be prepared for a significant time commitment and check your institution's maximum credit policy.";
    } else if (result.workload.label.includes("Light")) {
      workloadText += " You may need to take additional credits in future semesters to stay on track for graduation.";
    }
    
    recommendations.push({
      type: result.workload.label.includes("Heavy") ? "warning" : "success",
      text: workloadText
    });
  }

  return recommendations;
}

export function getDegreeProgressRecommendations(result) {
  if (result.isEmpty) return [];

  const recommendations = [];

  // Completion Status
  if (result.completionPercentage >= 100) {
    recommendations.push({
      type: "success",
      text: "Congratulations! You have met or exceeded your degree's credit requirements."
    });
    return recommendations;
  }

  // Progress update
  recommendations.push({
    type: "info",
    text: `You have completed ${result.completionPercentage.toFixed(1)}% of your degree requirements. You need ${result.remainingCredits} more credit hours to complete your degree.`
  });

  // Future planning
  if (result.remainingSemesters > 0) {
    const required = result.requiredAveragePerSemester;
    let type = "success";
    let message = `To graduate in ${result.remainingSemesters} semesters, you need to average ${required.toFixed(1)} credits per semester.`;
    
    if (required > 18) {
      type = "warning";
      message += " This is a very heavy workload. You may want to consider extending your graduation timeline or taking summer courses.";
    } else if (required < 12) {
      message += " This is a light workload, giving you flexibility for internships or part-time work.";
    }
    
    recommendations.push({ type, text: message });
  } else if (result.remainingCredits > 0) {
    recommendations.push({
      type: "warning",
      text: `At a typical full-time pace of 15 credits per semester, you would need approximately ${result.estimatedSemestersAt15} more semesters to finish.`
    });
  }

  return recommendations;
}
