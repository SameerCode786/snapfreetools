import { safeFormatNumber } from "./validation";

export const getAdmissionRecommendations = (result, data) => {
  if (!result || result.isEmpty) return [];

  const recommendations = [];

  const sscWeight = data.sscWeight || 0;
  const hsscWeight = data.hsscWeight || 0;
  const etWeight = data.etWeight || 0;
  const academicWeight = Number(sscWeight) + Number(hsscWeight);

  if (academicWeight > etWeight) {
    recommendations.push({
      type: "info",
      text: `Your academic history (SSC & HSSC) contributes ${safeFormatNumber(academicWeight)}% to your aggregate, making it the most significant factor.`
    });
  } else if (etWeight > academicWeight) {
    recommendations.push({
      type: "info",
      text: `The entry test contributes ${safeFormatNumber(etWeight)}% to your aggregate, making it the single most important factor for admission.`
    });
  }

  if (result.finalAggregate >= 85) {
    recommendations.push({
      type: "success",
      text: "You have a highly competitive aggregate. Focus on preparing any required university-specific documents."
    });
  } else if (result.finalAggregate >= 70) {
    if (result.etPercentage < 70 && etWeight >= 30) {
      recommendations.push({
        type: "warning",
        text: "Your entry test score is pulling your aggregate down. Improving your test performance will have the largest positive impact."
      });
    }
  }

  return recommendations;
};

export const getTargetRecommendations = (targetResult) => {
  if (!targetResult) return [];
  const recommendations = [];

  if (targetResult.requiredPercentage <= 0) {
    recommendations.push({
      type: "success",
      text: "You are already at or above your target aggregate with just your academic score! Any entry test marks will simply improve your buffer."
    });
  } else if (!targetResult.isAchievable) {
    recommendations.push({
      type: "warning",
      text: "Your requested target requires more than 100% in the entry test and is therefore not achievable with the current academic scores and weights."
    });
  } else {
    recommendations.push({
      type: "info",
      text: `To achieve your target, you need approximately ${safeFormatNumber(targetResult.requiredMarks, 1)} marks out of the total entry test marks.`
    });
  }

  return recommendations;
};
