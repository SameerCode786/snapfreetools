/**
 * Safely parses a number from a string/number input, returning a fallback if invalid.
 */
export const safeParseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

/**
 * Formats a number to a fixed precision safely without crashing on undefined/NaN.
 */
export const safeFormatNumber = (value, precision = 2, fallback = "0.00") => {
  const num = safeParseNumber(value, null);
  if (num === null) return fallback;
  return num.toFixed(precision);
};

export const validateWeights = (sscWeight, hsscWeight, entryTestWeight) => {
  const ssc = safeParseNumber(sscWeight);
  const hssc = safeParseNumber(hsscWeight);
  const et = safeParseNumber(entryTestWeight);
  
  const total = ssc + hssc + et;
  
  // Floating point precision fix for validation
  const isValid = Math.abs(total - 100) < 0.01;
  
  return {
    isValid,
    total,
    difference: total - 100
  };
};

export const validateMarks = (obtained, total) => {
  const obs = safeParseNumber(obtained);
  const tot = safeParseNumber(total);

  if (tot <= 0 && obs > 0) {
    return { isValid: false, error: "Total marks must be greater than 0" };
  }
  if (obs < 0 || tot < 0) {
    return { isValid: false, error: "Marks cannot be negative" };
  }
  if (obs > tot && tot > 0) {
    return { isValid: false, error: "Obtained marks cannot exceed total marks" };
  }
  
  return { isValid: true };
};

export const validateAdmissionInput = (data) => {
  const errors = [];
  
  const sscVal = validateMarks(data.sscObtained, data.sscTotal);
  if (!sscVal.isValid) errors.push(`SSC: ${sscVal.error}`);
  
  const hsscVal = validateMarks(data.hsscObtained, data.hsscTotal);
  if (!hsscVal.isValid) errors.push(`HSSC: ${hsscVal.error}`);
  
  const etVal = validateMarks(data.etObtained, data.etTotal);
  if (!etVal.isValid) errors.push(`Entry Test: ${etVal.error}`);
  
  const weightVal = validateWeights(data.sscWeight, data.hsscWeight, data.etWeight);
  if (!weightVal.isValid) {
    if (weightVal.difference > 0) {
      errors.push(`Weights exceed 100% by ${safeFormatNumber(weightVal.difference)}%`);
    } else {
      errors.push(`Weights are short of 100% by ${safeFormatNumber(Math.abs(weightVal.difference))}%`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    weightValidation: weightVal
  };
};
