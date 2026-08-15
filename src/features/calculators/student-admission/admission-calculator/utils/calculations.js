import { safeParseNumber } from "./validation";

export const calculatePercentage = (obtained, total) => {
  const obs = safeParseNumber(obtained);
  const tot = safeParseNumber(total);
  if (tot === 0 || obs === 0) return 0;
  return Math.min((obs / tot) * 100, 100);
};

export const calculateAggregate = (data) => {
  const sscObtained = safeParseNumber(data.sscObtained);
  const sscTotal = safeParseNumber(data.sscTotal, 1); // Avoid division by zero
  const hsscObtained = safeParseNumber(data.hsscObtained);
  const hsscTotal = safeParseNumber(data.hsscTotal, 1);
  const etObtained = safeParseNumber(data.etObtained);
  const etTotal = safeParseNumber(data.etTotal, 1);

  const sscWeight = safeParseNumber(data.sscWeight) / 100;
  const hsscWeight = safeParseNumber(data.hsscWeight) / 100;
  const etWeight = safeParseNumber(data.etWeight) / 100;

  const sscPercentage = sscObtained > 0 ? (sscObtained / sscTotal) * 100 : 0;
  const hsscPercentage = hsscObtained > 0 ? (hsscObtained / hsscTotal) * 100 : 0;
  const etPercentage = etObtained > 0 ? (etObtained / etTotal) * 100 : 0;

  const sscContribution = sscPercentage * sscWeight;
  const hsscContribution = hsscPercentage * hsscWeight;
  const etContribution = etPercentage * etWeight;

  const finalAggregate = sscContribution + hsscContribution + etContribution;

  const isEmpty = sscObtained === 0 && hsscObtained === 0 && etObtained === 0;

  return {
    isEmpty,
    sscPercentage,
    hsscPercentage,
    etPercentage,
    sscContribution,
    hsscContribution,
    etContribution,
    finalAggregate,
    academicContribution: sscContribution + hsscContribution
  };
};

export const calculateRequiredEntryTestScore = (data, targetAggregate) => {
  const target = safeParseNumber(targetAggregate);
  
  const sscObtained = safeParseNumber(data.sscObtained);
  const sscTotal = safeParseNumber(data.sscTotal, 1);
  const hsscObtained = safeParseNumber(data.hsscObtained);
  const hsscTotal = safeParseNumber(data.hsscTotal, 1);
  
  const sscWeight = safeParseNumber(data.sscWeight) / 100;
  const hsscWeight = safeParseNumber(data.hsscWeight) / 100;
  const etWeight = safeParseNumber(data.etWeight) / 100;
  
  const etTotal = safeParseNumber(data.etTotal);

  if (etWeight === 0) {
    return { isAchievable: false, requiredPercentage: 0, requiredMarks: 0, message: "Entry test weight is 0%." };
  }

  const sscPercentage = sscObtained > 0 ? (sscObtained / sscTotal) * 100 : 0;
  const hsscPercentage = hsscObtained > 0 ? (hsscObtained / hsscTotal) * 100 : 0;
  
  const academicContribution = (sscPercentage * sscWeight) + (hsscPercentage * hsscWeight);
  
  const requiredEtContribution = target - academicContribution;
  const requiredPercentage = (requiredEtContribution / (etWeight * 100)) * 100;
  
  const requiredMarks = etTotal > 0 ? (requiredPercentage / 100) * etTotal : 0;
  
  let isAchievable = true;
  let message = "";
  
  if (requiredPercentage > 100) {
    isAchievable = false;
    message = "Your requested target requires more than 100% in the entry test and is therefore not mathematically achievable.";
  } else if (requiredPercentage <= 0) {
    message = "You are already at or above your target aggregate with just your academic score.";
  }
  
  return {
    isAchievable,
    requiredPercentage,
    requiredMarks,
    message,
    academicContribution
  };
};

export const getMeritStatus = (aggregate) => {
  const score = safeParseNumber(aggregate);
  if (score >= 90) return { label: "Excellent Aggregate", color: "text-emerald-600" };
  if (score >= 80) return { label: "Strong Aggregate", color: "text-blue-600" };
  if (score >= 70) return { label: "Competitive Aggregate", color: "text-indigo-600" };
  if (score >= 60) return { label: "Moderate Aggregate", color: "text-amber-600" };
  return { label: "Needs Improvement", color: "text-red-600" };
};
