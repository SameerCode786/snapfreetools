export const safeParseNumber = (val) => {
  if (val === undefined || val === null || val === '') return NaN;
  const num = Number(val);
  return isNaN(num) ? NaN : num;
};

export const safeFormatNumber = (num, decimals = 2) => {
  if (num === undefined || num === null || isNaN(num) || num === Infinity || num === -Infinity) return "—";
  return Number(num).toFixed(decimals);
};

export const getFrequencyDetails = (freqStr) => {
  switch (freqStr) {
    case 'annually': return { periodsPerYear: 1, label: 'Annually' };
    case 'semi-annually': return { periodsPerYear: 2, label: 'Semi-annually' };
    case 'quarterly': return { periodsPerYear: 4, label: 'Quarterly' };
    case 'monthly': return { periodsPerYear: 12, label: 'Monthly' };
    case 'daily': return { periodsPerYear: 365, label: 'Daily' };
    default: return { periodsPerYear: 12, label: 'Monthly' };
  }
};

/**
 * Calculates compound interest and recurring investment future value.
 * Assumption: Contributions are made at the END of each period.
 */
export const calculateInvestmentGrowth = (principal, monthlyContribution, annualReturnRate, years, frequency = 'monthly') => {
  const p = safeParseNumber(principal) || 0;
  const pmt = safeParseNumber(monthlyContribution) || 0;
  const rAnnual = safeParseNumber(annualReturnRate) || 0;
  const t = safeParseNumber(years) || 0;
  
  if (p < 0 || pmt < 0 || t <= 0) return { isEmpty: true };
  if (p === 0 && pmt === 0) return { isEmpty: true };

  const freq = getFrequencyDetails(frequency);
  const n = freq.periodsPerYear;
  const r = rAnnual / 100 / n;
  const totalPeriods = t * n;
  
  // We need to handle monthly contributions even if compounding is different.
  // Standard convention: if user enters "monthly contribution" but compounding is "annually", 
  // it gets mathematically messy. To keep it clean, we assume the contribution frequency matches compounding frequency
  // OR we convert everything to monthly internally if there's a monthly contribution.
  // Since the user specifically asked for "monthly compounding/end-of-month contribution convention" 
  // let's stick to the exact math.
  
  // Actually, let's treat the contribution as occurring at the same frequency as compounding.
  // If they enter $500 monthly contribution, and compounding is monthly (n=12), then periodic pmt = 500.
  // If compounding is annually (n=1), then periodic pmt = 500 * 12 = 6000.
  const periodicContribution = (pmt * 12) / n;

  let futureValue = 0;
  let yearlyBreakdown = [];
  let currentBalance = p;
  
  if (rAnnual === 0) {
    futureValue = p + (pmt * 12 * t);
    
    // Yearly breakdown for 0%
    for (let y = 1; y <= t; y++) {
      const yearStart = currentBalance;
      const yearContrib = pmt * 12;
      currentBalance = yearStart + yearContrib;
      yearlyBreakdown.push({
        year: y,
        startBalance: yearStart,
        contribution: yearContrib,
        growth: 0,
        endBalance: currentBalance
      });
    }
  } else {
    // FV of Principal
    const fvPrincipal = p * Math.pow(1 + r, totalPeriods);
    
    // FV of Series (End of Period)
    const fvSeries = periodicContribution * ((Math.pow(1 + r, totalPeriods) - 1) / r);
    
    futureValue = fvPrincipal + fvSeries;
    
    // Generate Yearly Breakdown
    const effectiveAnnualRate = Math.pow(1 + r, n) - 1;
    let balanceForYear = p;
    
    for (let y = 1; y <= t; y++) {
      const startBalance = balanceForYear;
      const annualContrib = pmt * 12;
      
      // Calculate exact end balance for this year using the same formula
      const periodsSoFar = y * n;
      const fvP = p * Math.pow(1 + r, periodsSoFar);
      const fvS = periodicContribution * ((Math.pow(1 + r, periodsSoFar) - 1) / r);
      const endBalance = fvP + fvS;
      
      const growth = endBalance - startBalance - annualContrib;
      
      yearlyBreakdown.push({
        year: y,
        startBalance,
        contribution: annualContrib,
        growth,
        endBalance
      });
      
      balanceForYear = endBalance;
    }
  }

  const totalContributions = pmt * 12 * t;
  const totalInvested = p + totalContributions;
  const totalGrowth = futureValue - totalInvested;
  const growthPercentage = totalInvested > 0 ? (totalGrowth / totalInvested) * 100 : 0;

  return {
    isEmpty: false,
    achievable: true,
    futureValue,
    totalInvested,
    totalContributions,
    totalGrowth,
    growthPercentage,
    investmentPeriod: t,
    annualReturn: rAnnual,
    monthlyContribution: pmt,
    yearlyBreakdown
  };
};

export const calculateGoal = (targetAmount, initialInvestment, annualReturnRate, years) => {
  const fv = safeParseNumber(targetAmount) || 0;
  const p = safeParseNumber(initialInvestment) || 0;
  const rAnnual = safeParseNumber(annualReturnRate) || 0;
  const t = safeParseNumber(years) || 0;

  if (fv <= 0 || t <= 0) return { isEmpty: true };
  if (fv <= p) return { isEmpty: false, achievable: false, reason: "Your initial investment is already equal to or greater than your target amount." };

  let pmt = 0;
  
  if (rAnnual === 0) {
    pmt = (fv - p) / (t * 12);
  } else {
    // Assuming monthly compounding
    const r = rAnnual / 100 / 12;
    const n = t * 12;
    
    const fvPrincipal = p * Math.pow(1 + r, n);
    if (fvPrincipal >= fv) {
       return { isEmpty: false, achievable: false, reason: "Your initial investment will grow to exceed your target amount without any monthly contributions!" };
    }
    
    // We need to find PMT
    // fv = fvPrincipal + PMT * [ ( (1+r)^n - 1 ) / r ]
    // PMT = (fv - fvPrincipal) / [ ( (1+r)^n - 1 ) / r ]
    
    const seriesFactor = (Math.pow(1 + r, n) - 1) / r;
    pmt = (fv - fvPrincipal) / seriesFactor;
  }
  
  if (pmt < 0) pmt = 0; // Just in case
  
  const totalContributions = pmt * 12 * t;
  const totalInvested = p + totalContributions;
  const totalGrowth = fv - totalInvested;

  return {
    isEmpty: false,
    achievable: true,
    targetAmount: fv,
    requiredMonthlyContribution: pmt,
    totalContributions,
    totalGrowth,
    initialInvestment: p
  };
};

export const calculateInflation = (futureValue, inflationRate, years) => {
  const fv = safeParseNumber(futureValue) || 0;
  const iAnnual = safeParseNumber(inflationRate) || 0;
  const t = safeParseNumber(years) || 0;

  if (fv <= 0 || t <= 0) return { isEmpty: true };

  const i = iAnnual / 100;
  const presentValueEquivalent = fv / Math.pow(1 + i, t);
  const purchasingPowerReduction = fv - presentValueEquivalent;

  return {
    isEmpty: false,
    nominalFutureValue: fv,
    presentValueEquivalent,
    purchasingPowerReduction,
    inflationRate: iAnnual,
    years: t
  };
};
