export const safeFormatNumber = (num, decimals = 2) => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return "0.00";
  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

export const safeParseNumber = (val) => {
  if (!val && val !== 0) return 0;
  if (typeof val === 'number') return val;
  const parsed = parseFloat(val.toString().replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

// Pure calculation functions for savings
export const calculateSavingsGrowth = ({ initial, monthly, annualRate, years, frequency = 'monthly' }) => {
  const p = safeParseNumber(initial);
  const pmt = safeParseNumber(monthly);
  const r = safeParseNumber(annualRate) / 100;
  const t = safeParseNumber(years);
  
  // Compounding periods per year
  const nMap = {
    'daily': 365,
    'weekly': 52,
    'monthly': 12,
    'quarterly': 4,
    'semi-annually': 2,
    'annually': 1
  };
  
  const n = nMap[frequency] || 12;
  const totalMonths = Math.floor(t * 12);
  const totalPeriods = Math.floor(t * n);
  
  if (t <= 0) return { isValid: false, isEmpty: true };
  if (p === 0 && pmt === 0) return { isValid: false, isEmpty: true };

  const yearlyData = [];
  let futureValue = 0;
  let totalContributions = p;

  if (r === 0) {
    // 0% interest case
    futureValue = p + (pmt * totalMonths);
    totalContributions = futureValue;
    
    for (let year = 1; year <= t; year++) {
      const yearContributions = pmt * 12;
      const endBalance = p + (pmt * year * 12);
      yearlyData.push({
        year,
        startBalance: p + (pmt * (year - 1) * 12),
        contributions: yearContributions,
        interest: 0,
        endBalance
      });
    }
  } else {
    // Compound interest
    const monthlyRate = Math.pow(1 + r/n, n/12) - 1;
    let currentBalance = p;
    
    for (let month = 1; month <= totalMonths; month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + pmt;
      totalContributions += pmt;
      
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyData.push({
          year,
          startBalance: year === 1 ? p : yearlyData[year - 2].endBalance,
          contributions: pmt * 12,
          interest: currentBalance - (year === 1 ? p + (pmt * 12) : yearlyData[year - 2].endBalance + (pmt * 12)),
          endBalance: currentBalance
        });
      }
    }
    
    futureValue = currentBalance;
  }

  const totalInterest = Math.max(0, futureValue - totalContributions);
  const growthPercentage = totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0;

  return {
    isValid: true,
    isEmpty: false,
    futureValue,
    totalContributions,
    totalInterest,
    growthPercentage,
    yearlyData
  };
};

export const calculateSavingsGoal = ({ current, target, monthly, annualRate, frequency = 'monthly' }) => {
  const p = safeParseNumber(current);
  const fv = safeParseNumber(target);
  const pmt = safeParseNumber(monthly);
  const r = safeParseNumber(annualRate) / 100;
  
  if (fv <= 0) return { isValid: false, isEmpty: true };
  if (p >= fv) return { isValid: true, isEmpty: false, isReached: true, futureValue: p, totalContributions: p, totalInterest: 0 };
  
  // Simple iteration for Goal (find time)
  let months = 0;
  let balance = p;
  
  const nMap = { 'daily': 365, 'monthly': 12, 'quarterly': 4, 'semi-annually': 2, 'annually': 1 };
  const n = nMap[frequency] || 12;
  const monthlyRate = r === 0 ? 0 : Math.pow(1 + r/n, n/12) - 1;

  if (r === 0) {
    if (pmt <= 0) return { isValid: false, isEmpty: true }; // Impossible
    months = Math.ceil((fv - p) / pmt);
    balance = p + (months * pmt);
  } else {
    if (pmt <= 0 && (balance * monthlyRate <= 0)) return { isValid: false, isEmpty: true };
    
    while (balance < fv && months < 1200) { // Max 100 years to prevent infinite loop
      balance = balance * (1 + monthlyRate) + pmt;
      months++;
    }
  }

  const totalContributions = p + (months * pmt);
  const totalInterest = Math.max(0, balance - totalContributions);

  return {
    isValid: true,
    isEmpty: false,
    isReached: false,
    months,
    years: +(months / 12).toFixed(1),
    futureValue: balance,
    totalContributions,
    totalInterest,
    growthPercentage: totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0
  };
};

export const calculateRequiredMonthly = ({ current, target, annualRate, years, frequency = 'monthly' }) => {
  const p = safeParseNumber(current);
  const fv = safeParseNumber(target);
  const t = safeParseNumber(years);
  const r = safeParseNumber(annualRate) / 100;
  
  if (fv <= 0 || t <= 0) return { isValid: false, isEmpty: true };
  if (p >= fv) return { isValid: true, isEmpty: false, requiredMonthly: 0 };
  
  const totalMonths = Math.floor(t * 12);
  const nMap = { 'daily': 365, 'monthly': 12, 'quarterly': 4, 'semi-annually': 2, 'annually': 1 };
  const n = nMap[frequency] || 12;
  const monthlyRate = r === 0 ? 0 : Math.pow(1 + r/n, n/12) - 1;

  let requiredMonthly = 0;
  
  if (r === 0) {
    requiredMonthly = (fv - p) / totalMonths;
  } else {
    const compoundFactor = Math.pow(1 + monthlyRate, totalMonths);
    const fvPrincipal = p * compoundFactor;
    
    if (fvPrincipal >= fv) {
      requiredMonthly = 0;
    } else {
      requiredMonthly = (fv - fvPrincipal) / ((compoundFactor - 1) / monthlyRate);
    }
  }

  return {
    isValid: true,
    isEmpty: false,
    requiredMonthly: Math.max(0, requiredMonthly),
    totalMonths
  };
};

export const calculateEmergencyFund = ({ expenses, current, targetMonths }) => {
  const e = safeParseNumber(expenses);
  const p = safeParseNumber(current);
  const m = safeParseNumber(targetMonths);
  
  if (e <= 0 || m <= 0) return { isValid: false, isEmpty: true };
  
  const targetFund = e * m;
  const remaining = Math.max(0, targetFund - p);
  const currentCoverageMonths = e > 0 ? (p / e) : 0;
  const progressPercentage = Math.min(100, (p / targetFund) * 100);

  return {
    isValid: true,
    isEmpty: false,
    targetFund,
    currentFund: p,
    remaining,
    currentCoverageMonths,
    progressPercentage
  };
};
