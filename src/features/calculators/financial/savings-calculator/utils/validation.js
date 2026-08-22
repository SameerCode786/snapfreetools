import { safeParseNumber, safeFormatNumber } from "./calculations";

export const validateSavingsInput = (data, mode) => {
  const errors = [];
  
  if (mode === 'growth' || mode === 'compound') {
    if (safeParseNumber(data.years) <= 0) {
      errors.push("Investment period must be greater than 0");
    }
  }

  if (mode === 'goal') {
    if (safeParseNumber(data.targetAmount) <= 0) {
      errors.push("Target amount must be greater than 0");
    }
    if (safeParseNumber(data.targetAmount) <= safeParseNumber(data.principal)) {
      errors.push("Target amount must be greater than your initial savings");
    }
    if (safeParseNumber(data.monthlyContribution) <= 0 && safeParseNumber(data.annualRate) <= 0) {
      errors.push("You must have a monthly contribution or an interest rate to reach a goal");
    }
  }

  if (mode === 'required') {
    if (safeParseNumber(data.targetAmount) <= 0) {
      errors.push("Target amount must be greater than 0");
    }
    if (safeParseNumber(data.years) <= 0) {
      errors.push("Target period must be greater than 0");
    }
  }

  if (mode === 'emergency') {
    if (safeParseNumber(data.monthlyExpenses) <= 0) {
      errors.push("Monthly expenses must be greater than 0");
    }
  }

  return errors;
};

// Re-exporting safeFormatNumber so components can import from here if they prefer
export { safeFormatNumber, safeParseNumber };
