import { safeParseNumber } from "./validation";

export const getFrequencyDetails = (frequency) => {
  switch (frequency) {
    case 'yearly': return { periodsPerYear: 1, label: 'Yearly' };
    case 'half-yearly': return { periodsPerYear: 2, label: 'Half-Yearly' };
    case 'quarterly': return { periodsPerYear: 4, label: 'Quarterly' };
    case 'monthly':
    default: return { periodsPerYear: 12, label: 'Monthly' };
  }
};

export const calculateStandardEMI = (amount, annualRate, tenureValue, tenureUnit, frequency) => {
  const p = safeParseNumber(amount);
  const rAnnual = safeParseNumber(annualRate);
  const t = safeParseNumber(tenureValue);
  const freq = getFrequencyDetails(frequency);
  
  if (p <= 0 || t <= 0) return { isEmpty: true };
  
  const years = tenureUnit === 'months' ? t / 12 : t;
  const n = years * freq.periodsPerYear; // total payments
  
  if (n <= 0) return { isEmpty: true };
  
  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;
  
  if (rAnnual === 0) {
    emi = p / n;
    totalInterest = 0;
    totalPayment = p;
  } else {
    const r = rAnnual / 100 / freq.periodsPerYear; // periodic rate
    emi = p * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    totalPayment = emi * n;
    totalInterest = totalPayment - p;
  }
  
  const principalPercentage = (p / totalPayment) * 100;
  const interestPercentage = (totalInterest / totalPayment) * 100;
  
  return {
    isEmpty: false,
    monthlyPayment: freq.periodsPerYear === 12 ? emi : emi / (12 / freq.periodsPerYear), // normalize to monthly for display if needed
    emi: emi,
    principal: p,
    totalInterest,
    totalPayment,
    numberOfPayments: n,
    principalPercentage,
    interestPercentage,
    annualRate: rAnnual,
    periodsPerYear: freq.periodsPerYear
  };
};

export const generateAmortizationSchedule = (amount, annualRate, tenureValue, tenureUnit, frequency, extraPayment = 0, oneTimePrepayment = 0) => {
  const baseResult = calculateStandardEMI(amount, annualRate, tenureValue, tenureUnit, frequency);
  if (baseResult.isEmpty) return [];
  
  const p = baseResult.principal;
  const rAnnual = baseResult.annualRate;
  const freq = getFrequencyDetails(frequency);
  const r = rAnnual / 100 / freq.periodsPerYear;
  const emi = baseResult.emi;
  
  const schedule = [];
  let balance = p - safeParseNumber(oneTimePrepayment);
  if (balance <= 0) balance = 0;
  
  let period = 1;
  const maxPeriods = 1200; // safety limit (100 years)
  
  while (balance > 0.01 && period <= maxPeriods) {
    const interestForPeriod = balance * r;
    let principalForPeriod = emi - interestForPeriod + safeParseNumber(extraPayment);
    
    // If the payment is more than balance + interest, cap it
    if (principalForPeriod > balance) {
      principalForPeriod = balance;
    }
    
    let actualPayment = principalForPeriod + interestForPeriod;
    
    balance -= principalForPeriod;
    if (balance < 0) balance = 0;
    
    schedule.push({
      period,
      payment: actualPayment,
      principal: principalForPeriod,
      interest: interestForPeriod,
      balance
    });
    
    period++;
    
    // Safety check against infinite loops with negative amortization
    if (principalForPeriod <= 0 && extraPayment <= 0) {
      break; 
    }
  }
  
  return schedule;
};

export const groupAmortizationByYear = (schedule, periodsPerYear) => {
  if (!schedule || schedule.length === 0) return [];
  
  const yearly = [];
  let currentYear = 1;
  let yearData = { year: 1, payment: 0, principal: 0, interest: 0, balance: 0, months: [] };
  
  for (let i = 0; i < schedule.length; i++) {
    const s = schedule[i];
    const year = Math.floor((s.period - 1) / periodsPerYear) + 1;
    
    if (year !== currentYear) {
      yearly.push(yearData);
      currentYear = year;
      yearData = { year, payment: 0, principal: 0, interest: 0, balance: 0, months: [] };
    }
    
    yearData.payment += s.payment;
    yearData.principal += s.principal;
    yearData.interest += s.interest;
    yearData.balance = s.balance; // End of year balance
    yearData.months.push(s);
  }
  
  yearly.push(yearData);
  return yearly;
};

export const calculateAffordability = (income, debt, rate, tenureValue, tenureUnit, dtiLimit) => {
  const mIncome = safeParseNumber(income);
  const mDebt = safeParseNumber(debt);
  const rAnnual = safeParseNumber(rate);
  const t = safeParseNumber(tenureValue);
  const dLimit = safeParseNumber(dtiLimit);
  
  if (mIncome <= 0 || t <= 0 || dLimit <= 0) return { isEmpty: true };
  
  const maxTotalDebt = mIncome * (dLimit / 100);
  const maxEmi = maxTotalDebt - mDebt;
  
  if (maxEmi <= 0) {
    return {
      isEmpty: false,
      isAffordable: false,
      maxEmi: 0,
      affordableLoan: 0,
      dti: (mDebt / mIncome) * 100,
      remainingIncome: mIncome - mDebt,
      maxDti: dLimit
    };
  }
  
  const years = tenureUnit === 'months' ? t / 12 : t;
  const n = years * 12; // Standard monthly
  
  let maxLoan = 0;
  if (rAnnual === 0) {
    maxLoan = maxEmi * n;
  } else {
    const r = rAnnual / 100 / 12;
    maxLoan = maxEmi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  }
  
  return {
    isEmpty: false,
    isAffordable: true,
    maxEmi,
    affordableLoan: maxLoan,
    dti: ((maxEmi + mDebt) / mIncome) * 100,
    remainingIncome: mIncome - mDebt - maxEmi,
    maxDti: dLimit
  };
};

export const calculateReverseEMI = (targetEmi, rate, tenureValue, tenureUnit, frequency) => {
  const emi = safeParseNumber(targetEmi);
  const rAnnual = safeParseNumber(rate);
  const t = safeParseNumber(tenureValue);
  const freq = getFrequencyDetails(frequency);
  
  if (emi <= 0 || t <= 0) return { isEmpty: true };
  
  const years = tenureUnit === 'months' ? t / 12 : t;
  const n = years * freq.periodsPerYear;
  
  let maxLoan = 0;
  let totalPayment = emi * n;
  
  if (rAnnual === 0) {
    maxLoan = totalPayment;
  } else {
    const r = rAnnual / 100 / freq.periodsPerYear;
    maxLoan = emi * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
  }
  
  const totalInterest = totalPayment - maxLoan;
  
  return {
    isEmpty: false,
    maxLoan,
    totalInterest,
    totalPayment,
    emi,
    numberOfPayments: n
  };
};

export const calculateRequiredEMI = (amount, maxEmi, rate, frequency) => {
  const p = safeParseNumber(amount);
  const emi = safeParseNumber(maxEmi);
  const rAnnual = safeParseNumber(rate);
  const freq = getFrequencyDetails(frequency);
  
  if (p <= 0 || emi <= 0) return { isEmpty: true };
  
  let n = 0;
  if (rAnnual === 0) {
    n = p / emi;
    return {
      isEmpty: false,
      achievable: true,
      requiredPeriods: n,
      requiredYears: n / freq.periodsPerYear,
      totalInterest: 0,
      totalPayment: p,
      emi
    };
  }
  
  const r = rAnnual / 100 / freq.periodsPerYear;
  const interestOnPrincipal = p * r;
  
  // If the EMI doesn't even cover the interest, it's impossible.
  if (emi <= interestOnPrincipal) {
    return {
      isEmpty: false,
      achievable: false,
      reason: "The requested EMI is less than or equal to the periodic interest. The loan would never be paid off (negative amortization)."
    };
  }
  
  n = Math.log(emi / (emi - p * r)) / Math.log(1 + r);
  
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;
  
  return {
    isEmpty: false,
    achievable: true,
    requiredPeriods: n,
    requiredYears: n / freq.periodsPerYear,
    totalInterest,
    totalPayment,
    emi
  };
};
