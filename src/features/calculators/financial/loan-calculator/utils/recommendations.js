import { formatCurrency } from "./currency";
import { safeFormatNumber } from "./validation";

export const generateStandardRecommendations = (result, currencyCode) => {
  if (!result || result.isEmpty) return [];
  
  const recommendations = [];
  
  // High Interest Warning
  if (result.interestPercentage > 50) {
    recommendations.push({
      type: 'warning',
      title: 'High Interest Cost',
      message: `Your total interest is approximately ${safeFormatNumber(result.interestPercentage, 1)}% of your total repayment. Consider a shorter loan term or finding a lower interest rate to reduce costs.`
    });
  } else if (result.interestPercentage > 30) {
    recommendations.push({
      type: 'info',
      title: 'Interest Insight',
      message: `Interest makes up ${safeFormatNumber(result.interestPercentage, 1)}% of your total repayment.`
    });
  }
  
  // Early payoff suggestion
  if (result.originalPeriods > 60) { // If > 5 years
    const extraPmt = result.regularPayment * 0.1; // 10% extra
    recommendations.push({
      type: 'success',
      title: 'Potential Savings',
      message: `Adding just ${formatCurrency(extraPmt, currencyCode)} to your monthly payment could significantly reduce your payoff time and total interest.`
    });
  }
  
  return recommendations;
};

export const generateAffordabilityRecommendations = (result, currencyCode) => {
  if (!result || result.isEmpty) return [];
  
  const recommendations = [];
  
  if (!result.isAffordable) {
    recommendations.push({
      type: 'error',
      title: 'DTI Limit Exceeded',
      message: `Based on your desired Debt-to-Income ratio, you do not have enough remaining monthly income to afford a new loan.`
    });
  } else {
    if (result.estimatedDti > 43) {
      recommendations.push({
        type: 'warning',
        title: 'High DTI Warning',
        message: `Your estimated Debt-to-Income ratio is ${safeFormatNumber(result.estimatedDti, 1)}%. Many lenders prefer a DTI below 43% for approval.`
      });
    } else {
      recommendations.push({
        type: 'success',
        title: 'Healthy DTI',
        message: `Your estimated Debt-to-Income ratio of ${safeFormatNumber(result.estimatedDti, 1)}% is generally considered healthy by lenders.`
      });
    }
  }
  
  return recommendations;
};
