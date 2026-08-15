import { formatCurrency } from "./currency";
import { safeFormatNumber } from "./validation";

export const generateStandardRecommendations = (result, currencyCode) => {
  if (!result || result.isEmpty) return [];
  
  const recommendations = [];
  
  if (result.interestPercentage > 50) {
    recommendations.push({
      type: 'warning',
      title: 'High Interest Cost',
      message: `Interest forms approximately ${safeFormatNumber(result.interestPercentage, 1)}% of your total repayment. Consider a shorter loan term or finding a lower interest rate to reduce costs.`
    });
  } else if (result.interestPercentage > 30) {
    recommendations.push({
      type: 'info',
      title: 'Interest Insight',
      message: `Interest makes up ${safeFormatNumber(result.interestPercentage, 1)}% of your total repayment.`
    });
  }
  
  if (result.numberOfPayments > 60) {
    const extraPmt = result.emi * 0.1;
    recommendations.push({
      type: 'success',
      title: 'Potential Savings',
      message: `Adding just ${formatCurrency(extraPmt, currencyCode)} to your EMI could significantly reduce your payoff time and total interest.`
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
      title: 'Limit Exceeded',
      message: `Based on your desired Debt-to-Income ratio limit (${safeFormatNumber(result.maxDti, 1)}%), you do not have enough remaining monthly income to afford a new EMI.`
    });
  } else {
    if (result.dti > 43) {
      recommendations.push({
        type: 'warning',
        title: 'High DTI Warning',
        message: `Your estimated Debt-to-Income ratio is ${safeFormatNumber(result.dti, 1)}%. Many lenders prefer a DTI below 43% for loan approval.`
      });
    } else {
      recommendations.push({
        type: 'success',
        title: 'Healthy DTI',
        message: `Your estimated Debt-to-Income ratio of ${safeFormatNumber(result.dti, 1)}% is generally considered healthy by lenders.`
      });
    }
  }
  
  return recommendations;
};
