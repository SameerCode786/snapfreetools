export const generateRecommendations = (percentage, scale, totalMarks) => {
  const currentGradeIndex = scale.grades.findIndex(g => percentage >= g.min && percentage <= g.max);
  if (currentGradeIndex === -1) return null;

  const currentGrade = scale.grades[currentGradeIndex];
  
  // If they are already at the highest grade
  if (currentGradeIndex === 0) {
    return {
      message: "You already achieved the highest possible grade range!",
      nextGrade: null,
      marksNeeded: 0,
      percentNeeded: 0,
      type: "success"
    };
  }

  const nextGrade = scale.grades[currentGradeIndex - 1];
  const percentNeeded = Math.max(0, nextGrade.min - percentage);
  
  let marksNeeded = null;
  if (totalMarks && totalMarks > 0) {
    // Current obtained
    const currentObtained = (percentage / 100) * totalMarks;
    // Target obtained
    const targetObtained = (nextGrade.min / 100) * totalMarks;
    marksNeeded = Math.max(0, targetObtained - currentObtained);
  }

  return {
    message: `You are approximately ${percentNeeded.toFixed(1)} percentage points away from reaching a ${nextGrade.letter}.`,
    nextGrade: nextGrade.letter,
    nextGradeMin: nextGrade.min,
    marksNeeded: marksNeeded !== null ? Number(marksNeeded.toFixed(1)) : null,
    percentNeeded: Number(percentNeeded.toFixed(1)),
    type: "info"
  };
};

export const getMultipleSubjectsRecommendations = (result) => {
  if (!result || result.subjectCount === 0) return [];

  const recs = [];
  
  if (result.lowestSubject) {
    recs.push({
      title: "Lowest Subject",
      message: `Improving your score in ${result.lowestSubject.name || "your weakest subject"} would have the greatest impact on your overall percentage.`
    });
  }

  if (result.highestSubject) {
    recs.push({
      title: "Strongest Subject",
      message: `Your best performance is in ${result.highestSubject.name || "your strongest subject"} (${((result.highestSubject.obtained / result.highestSubject.total) * 100).toFixed(1)}%).`
    });
  }

  return recs;
};
