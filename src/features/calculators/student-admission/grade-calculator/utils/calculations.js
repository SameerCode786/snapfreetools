export const calculateSingleGrade = (obtained, total, scale, passThreshold) => {
  if (total <= 0 || obtained < 0 || isNaN(obtained) || isNaN(total)) return null;
  
  const percentage = (obtained / total) * 100;
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);
  
  const gradeInfo = scale.grades.find(g => clampedPercentage >= g.min && clampedPercentage <= g.max) || scale.grades[scale.grades.length - 1];
  const isPass = clampedPercentage >= passThreshold;
  const marksLost = Math.max(0, total - obtained);

  return {
    mode: "single",
    percentage: clampedPercentage,
    letterGrade: gradeInfo.letter,
    isPass,
    marksObtained: obtained,
    totalMarks: total,
    marksLost,
    gpa: gradeInfo.gpa,
    gradeInfo
  };
};

export const calculateMultipleSubjects = (subjects, scale, passThreshold) => {
  const validSubjects = subjects.filter(s => s.total > 0 && s.obtained >= 0 && !isNaN(s.total) && !isNaN(s.obtained));
  if (validSubjects.length === 0) return null;

  let marksObtained = 0;
  let totalMarks = 0;
  let highest = validSubjects[0];
  let lowest = validSubjects[0];

  validSubjects.forEach(s => {
    marksObtained += s.obtained;
    totalMarks += s.total;
    
    const perc = (s.obtained / s.total) * 100;
    const highestPerc = (highest.obtained / highest.total) * 100;
    const lowestPerc = (lowest.obtained / lowest.total) * 100;
    
    if (perc > highestPerc) highest = s;
    if (perc < lowestPerc) lowest = s;
  });

  const overallPercentage = (marksObtained / totalMarks) * 100;
  const clampedPercentage = Math.min(Math.max(overallPercentage, 0), 100);
  
  const gradeInfo = scale.grades.find(g => clampedPercentage >= g.min && clampedPercentage <= g.max) || scale.grades[scale.grades.length - 1];
  const isPass = clampedPercentage >= passThreshold;

  return {
    mode: "multiple",
    marksObtained,
    totalMarks,
    percentage: clampedPercentage,
    letterGrade: gradeInfo.letter,
    isPass,
    highestSubject: highest,
    lowestSubject: lowest,
    averagePercentage: validSubjects.reduce((sum, s) => sum + (s.obtained / s.total) * 100, 0) / validSubjects.length,
    subjectCount: validSubjects.length
  };
};

export const calculateWeighted = (assessments, scale, passThreshold) => {
  const validAssessments = assessments.filter(a => a.maxScore > 0 && a.score >= 0 && a.weight > 0 && !isNaN(a.maxScore) && !isNaN(a.score) && !isNaN(a.weight));
  if (validAssessments.length === 0) return null;

  let totalWeight = 0;
  let weightedScoreSum = 0;

  validAssessments.forEach(a => {
    totalWeight += a.weight;
    const percentage = (a.score / a.maxScore);
    weightedScoreSum += percentage * a.weight; // e.g. 0.8 * 20 = 16
  });

  // Scale based on weight out of 100 (if sum is 100)
  const overallPercentage = totalWeight > 0 ? (weightedScoreSum / totalWeight) * 100 : 0;
  const clampedPercentage = Math.min(Math.max(overallPercentage, 0), 100);

  const gradeInfo = scale.grades.find(g => clampedPercentage >= g.min && clampedPercentage <= g.max) || scale.grades[scale.grades.length - 1];
  const isPass = clampedPercentage >= passThreshold;

  return {
    mode: "weighted",
    percentage: clampedPercentage,
    letterGrade: gradeInfo.letter,
    isPass,
    totalWeight,
    isValidWeight: Math.abs(totalWeight - 100) < 0.001
  };
};

export const calculateRequired = (currentObtained, currentTotal, remainingTotal, targetPercentage) => {
  if (isNaN(currentObtained) || isNaN(currentTotal) || isNaN(remainingTotal) || isNaN(targetPercentage)) return null;
  if (currentTotal < 0 || remainingTotal <= 0 || targetPercentage < 0 || targetPercentage > 100) return null;

  const finalTotal = currentTotal + remainingTotal;
  const targetTotalMarks = (targetPercentage / 100) * finalTotal;
  const marksNeeded = targetTotalMarks - currentObtained;
  
  const percentageNeeded = (marksNeeded / remainingTotal) * 100;
  const isAchievable = marksNeeded <= remainingTotal;
  
  let difficulty = "Impossible";
  if (isAchievable) {
    if (percentageNeeded <= 50) difficulty = "Easy";
    else if (percentageNeeded <= 75) difficulty = "Moderate";
    else if (percentageNeeded <= 90) difficulty = "Hard";
    else difficulty = "Nearly Impossible";
  }

  return {
    mode: "required",
    marksNeeded: Math.max(0, marksNeeded),
    percentageNeeded: Math.max(0, percentageNeeded),
    isAchievable,
    difficulty
  };
};
