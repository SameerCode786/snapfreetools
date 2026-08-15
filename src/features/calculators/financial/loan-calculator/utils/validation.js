/**
 * Safely parses a number from a string/number input, returning a fallback if invalid.
 */
export const safeParseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  return (isNaN(num) || !isFinite(num)) ? fallback : num;
};

export const safeFormatNumber = (value, decimals = 2, fallback = "—") => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return Number(value).toFixed(decimals);
};

export const validateLoanInput = (data) => {
  const errors = {};

  const amount = safeParseNumber(data.amount, -1);
  if (amount <= 0) {
    errors.amount = "Loan amount must be greater than zero";
  }

  const interest = safeParseNumber(data.interest, -1);
  if (interest < 0 || interest > 200) {
    errors.interest = "Interest rate must be between 0 and 200";
  }

  const term = safeParseNumber(data.term, 0);
  if (term <= 0 || !Number.isInteger(term) || term > 1200) {
    errors.term = "Loan term must be a valid number of periods (max 100 years)";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateAffordabilityInput = (data) => {
  const errors = {};
  
  const income = safeParseNumber(data.income, -1);
  if (income <= 0) errors.income = "Income must be greater than zero";

  const expenses = safeParseNumber(data.expenses, -1);
  if (expenses < 0) errors.expenses = "Expenses cannot be negative";

  if (income > 0 && expenses >= income) {
    errors.expenses = "Expenses cannot exceed income";
  }
  
  const term = safeParseNumber(data.term, 0);
  if (term <= 0 || !Number.isInteger(term) || term > 1200) {
    errors.term = "Loan term must be a valid number of periods (max 100 years)";
  }

  const interest = safeParseNumber(data.interest, -1);
  if (interest < 0 || interest > 200) {
    errors.interest = "Interest rate must be between 0 and 200";
  }

  const desiredDti = safeParseNumber(data.desiredDti, -1);
  if (desiredDti <= 0 || desiredDti > 100) {
    errors.desiredDti = "Desired DTI must be between 1 and 100";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateExtraPaymentInput = (data, minPayment) => {
  const errors = {};
  const extra = safeParseNumber(data.extraPayment, -1);
  
  if (extra < 0) {
    errors.extraPayment = "Extra payment cannot be negative";
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
