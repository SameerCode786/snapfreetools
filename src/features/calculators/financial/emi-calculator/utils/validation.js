export const safeParseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === 'string') {
    value = value.replace(/,/g, '');
  }
  const num = Number(value);
  return (isNaN(num) || !isFinite(num)) ? fallback : num;
};

export const safeFormatNumber = (value, decimals = 2, fallback = "—") => {
  if (value === null || value === undefined || isNaN(value) || !isFinite(value)) {
    return fallback;
  }
  return Number(value).toFixed(decimals);
};

export const validateStandardEMI = (data) => {
  if (!data.amount || !data.rate || !data.tenure) return { isValid: false };
  
  const amount = safeParseNumber(data.amount);
  const rate = safeParseNumber(data.rate);
  const tenure = safeParseNumber(data.tenure);
  
  if (amount <= 0 || rate < 0 || tenure <= 0) return { isValid: false };
  
  return { isValid: true };
};

export const validateAffordability = (data) => {
  if (!data.income || !data.rate || !data.tenure || !data.dti) return { isValid: false };
  
  const income = safeParseNumber(data.income);
  const rate = safeParseNumber(data.rate);
  const tenure = safeParseNumber(data.tenure);
  const dti = safeParseNumber(data.dti);
  
  if (income <= 0 || rate < 0 || tenure <= 0 || dti <= 0) return { isValid: false };
  
  return { isValid: true };
};

export const validateComparison = (dataA, dataB) => {
  const vA = validateStandardEMI(dataA);
  const vB = validateStandardEMI(dataB);
  
  return { isValid: vA.isValid && vB.isValid };
};

export const validatePrepayment = (data) => {
  if (!data.amount || !data.rate || !data.tenure || (!data.extraPayment && !data.oneTimePrepayment)) return { isValid: false };
  
  const amount = safeParseNumber(data.amount);
  const rate = safeParseNumber(data.rate);
  const tenure = safeParseNumber(data.tenure);
  const extra = safeParseNumber(data.extraPayment);
  const oneTime = safeParseNumber(data.oneTimePrepayment);
  
  if (amount <= 0 || rate < 0 || tenure <= 0 || (extra < 0 && oneTime < 0)) return { isValid: false };
  if (extra === 0 && oneTime === 0) return { isValid: false };
  
  return { isValid: true };
};

export const validateReverseEMI = (data) => {
  if (!data.targetEmi || !data.rate || !data.tenure) return { isValid: false };
  
  const target = safeParseNumber(data.targetEmi);
  const rate = safeParseNumber(data.rate);
  const tenure = safeParseNumber(data.tenure);
  
  if (target <= 0 || rate < 0 || tenure <= 0) return { isValid: false };
  
  return { isValid: true };
};

export const validateRequiredEMI = (data) => {
  if (!data.amount || !data.maxEmi || !data.rate) return { isValid: false };
  
  const amount = safeParseNumber(data.amount);
  const maxEmi = safeParseNumber(data.maxEmi);
  const rate = safeParseNumber(data.rate);
  
  if (amount <= 0 || maxEmi <= 0 || rate < 0) return { isValid: false };
  
  return { isValid: true };
};
