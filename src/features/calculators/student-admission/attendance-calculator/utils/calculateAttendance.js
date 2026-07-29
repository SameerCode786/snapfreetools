export function calculateCurrentAttendance(total, attended) {
  if (total <= 0) return { percentage: 0, valid: false };
  const percentage = (attended / total) * 100;
  return {
    percentage: percentage,
    percentageFormatted: Number.isInteger(percentage) ? percentage.toString() : percentage.toFixed(2).replace(/\.00$/, ''),
    total,
    attended,
    missed: total - attended,
    valid: true,
  };
}

export function calculateRequiredClasses(total, attended, targetDecimal) {
  // If target <= current attendance, 0 classes required
  if ((attended / total) >= targetDecimal) {
    return { required: 0 };
  }
  
  // (attended + x) / (total + x) >= target
  // attended + x >= target * total + target * x
  // x - target * x >= target * total - attended
  // x * (1 - target) >= target * total - attended
  // x >= (target * total - attended) / (1 - target)
  
  const required = Math.ceil((targetDecimal * total - attended) / (1 - targetDecimal));
  const newTotal = total + required;
  const newAttended = attended + required;
  const newPercentage = (newAttended / newTotal) * 100;
  
  return {
    required: Math.max(0, required),
    newTotal,
    newAttended,
    newPercentage,
    newPercentageFormatted: Number.isInteger(newPercentage) ? newPercentage.toString() : newPercentage.toFixed(2).replace(/\.00$/, '')
  };
}

export function calculateSafeAbsences(total, attended, targetDecimal) {
  // If already below target, no safe absences
  if ((attended / total) < targetDecimal) {
    return { safeAbsences: 0 };
  }
  
  // attended / (total + m) >= target
  // attended >= target * (total + m)
  // attended >= target * total + target * m
  // attended - target * total >= target * m
  // m <= (attended - target * total) / target
  // m <= (attended / target) - total
  
  const safeAbsences = Math.floor((attended / targetDecimal) - total);
  const result = Math.max(0, safeAbsences);
  
  const newTotal = total + result;
  const newPercentage = (attended / newTotal) * 100;
  
  return {
    safeAbsences: result,
    newTotal,
    newPercentage,
    newPercentageFormatted: Number.isInteger(newPercentage) ? newPercentage.toString() : newPercentage.toFixed(2).replace(/\.00$/, '')
  };
}

export function calculateProjection(currentTotal, currentAttended, futureAttend, futureMiss) {
  const projectedTotal = currentTotal + futureAttend + futureMiss;
  const projectedAttended = currentAttended + futureAttend;
  const projectedMissed = projectedTotal - projectedAttended;
  
  const projectedPercentage = projectedTotal > 0 ? (projectedAttended / projectedTotal) * 100 : 0;
  
  return {
    projectedTotal,
    projectedAttended,
    projectedMissed,
    projectedPercentage,
    projectedPercentageFormatted: Number.isInteger(projectedPercentage) ? projectedPercentage.toString() : projectedPercentage.toFixed(2).replace(/\.00$/, '')
  };
}

export function calculateCourseFeasibility(total, attended, remainingClasses, targetDecimal) {
  const bestCaseAttended = attended + remainingClasses;
  const bestCaseTotal = total + remainingClasses;
  const bestCasePercentage = (bestCaseAttended / bestCaseTotal) * 100;
  
  const worstCaseAttended = attended;
  const worstCaseTotal = total + remainingClasses;
  const worstCasePercentage = (worstCaseAttended / worstCaseTotal) * 100;
  
  const isAchievable = bestCasePercentage >= (targetDecimal * 100);
  
  // Minimum classes required from remaining:
  // (attended + x) / (total + remainingClasses) >= target
  // attended + x >= target * (total + remainingClasses)
  // x >= target * (total + remainingClasses) - attended
  
  const minRequired = Math.ceil(targetDecimal * (total + remainingClasses) - attended);
  
  return {
    isAchievable,
    bestCasePercentage,
    bestCasePercentageFormatted: Number.isInteger(bestCasePercentage) ? bestCasePercentage.toString() : bestCasePercentage.toFixed(2).replace(/\.00$/, ''),
    worstCasePercentage,
    worstCasePercentageFormatted: Number.isInteger(worstCasePercentage) ? worstCasePercentage.toString() : worstCasePercentage.toFixed(2).replace(/\.00$/, ''),
    minRequired: Math.max(0, minRequired),
    maxMissed: Math.max(0, remainingClasses - Math.max(0, minRequired))
  };
}
