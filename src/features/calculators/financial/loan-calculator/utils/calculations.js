import { safeParseNumber } from "./validation";

export const getFrequencyDetails = (frequency) => {
  switch (frequency) {
    case 'weekly': return { periodsPerYear: 52, label: 'Weekly' };
    case 'biweekly': return { periodsPerYear: 26, label: 'Biweekly' };
    case 'monthly':
    default: return { periodsPerYear: 12, label: 'Monthly' };
  }
};

export const calculateStandardAmortization = (principal, annualInterestRate, totalPeriods, periodsPerYear, extraPayment = 0) => {
  const p = safeParseNumber(principal);
  const rAnnual = safeParseNumber(annualInterestRate);
  const n = safeParseNumber(totalPeriods);
  const ppy = safeParseNumber(periodsPerYear, 12);
  const extra = safeParseNumber(extraPayment);
  
  if (p <= 0 || n <= 0) return { isEmpty: true };
  
  const rPeriodic = (rAnnual / 100) / ppy;
  
  let basePayment = 0;
  if (rAnnual === 0) {
    basePayment = p / n;
  } else {
    // P = A * (r(1+r)^n) / ((1+r)^n - 1)
    basePayment = p * (rPeriodic * Math.pow(1 + rPeriodic, n)) / (Math.pow(1 + rPeriodic, n) - 1);
  }
  
  const actualPayment = basePayment + extra;
  
  // Generate schedule
  let balance = p;
  let totalInterest = 0;
  let totalPaid = 0;
  let schedule = [];
  let periodCount = 0;
  
  // Safety limit for while loop (max 1200 periods = 100 years monthly)
  while (balance > 0.001 && periodCount < 1200) {
    periodCount++;
    
    let interestPayment = balance * rPeriodic;
    let principalPayment = actualPayment - interestPayment;
    
    // Final payment might be less than regular actualPayment
    let actualPeriodPayment = actualPayment;
    if (balance + interestPayment < actualPayment) {
      actualPeriodPayment = balance + interestPayment;
      principalPayment = balance;
    }
    
    balance = balance - principalPayment;
    if (balance < 0) balance = 0; // handle floating point issues
    
    totalInterest += interestPayment;
    totalPaid += actualPeriodPayment;
    
    schedule.push({
      period: periodCount,
      payment: actualPeriodPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance
    });
    
    if (balance <= 0) break;
  }
  
  const interestPercentage = (totalInterest / (p + totalInterest)) * 100;
  const principalPercentage = (p / (p + totalInterest)) * 100;
  
  return {
    isEmpty: false,
    principal: p,
    regularPayment: basePayment,
    actualPayment: actualPayment,
    totalInterest: totalInterest,
    totalAmountPaid: totalPaid,
    interestPercentage: interestPercentage,
    principalPercentage: principalPercentage,
    totalPeriodsActual: periodCount,
    originalPeriods: n,
    schedule: schedule,
    periodsPerYear: ppy
  };
};

export const calculateAffordability = (income, expenses, existingDebt, desiredDti, interestRate, termMonths) => {
  const mIncome = safeParseNumber(income);
  const mExpenses = safeParseNumber(expenses); // Note: sometimes DTI only includes debt, but we'll include existing debt explicitly.
  const mDebt = safeParseNumber(existingDebt);
  const dti = safeParseNumber(desiredDti);
  const rAnnual = safeParseNumber(interestRate);
  const n = safeParseNumber(termMonths);
  
  if (mIncome <= 0 || n <= 0) return { isEmpty: true };
  
  const maxTotalDebtPayment = (mIncome * (dti / 100));
  const maxAvailableForLoan = maxTotalDebtPayment - mDebt;
  
  if (maxAvailableForLoan <= 0) {
    return {
      isEmpty: false,
      maxMonthlyPayment: 0,
      maxLoanAmount: 0,
      currentDti: (mDebt / mIncome) * 100,
      estimatedDti: (mDebt / mIncome) * 100,
      isAffordable: false
    };
  }
  
  const rPeriodic = (rAnnual / 100) / 12; // assuming monthly
  let maxLoanAmount = 0;
  
  if (rAnnual === 0) {
    maxLoanAmount = maxAvailableForLoan * n;
  } else {
    // PV = Pmt * (1 - (1+r)^-n) / r
    maxLoanAmount = maxAvailableForLoan * (1 - Math.pow(1 + rPeriodic, -n)) / rPeriodic;
  }
  
  return {
    isEmpty: false,
    maxMonthlyPayment: maxAvailableForLoan,
    maxLoanAmount: maxLoanAmount,
    currentDti: (mDebt / mIncome) * 100,
    estimatedDti: ((mDebt + maxAvailableForLoan) / mIncome) * 100,
    isAffordable: true
  };
};

export const calculateReverseLoan = (payment, interestRate, termMonths) => {
  const pmt = safeParseNumber(payment);
  const rAnnual = safeParseNumber(interestRate);
  const n = safeParseNumber(termMonths);
  
  if (pmt <= 0 || n <= 0) return { isEmpty: true };
  
  const rPeriodic = (rAnnual / 100) / 12; // assuming monthly
  let maxLoanAmount = 0;
  
  if (rAnnual === 0) {
    maxLoanAmount = pmt * n;
  } else {
    maxLoanAmount = pmt * (1 - Math.pow(1 + rPeriodic, -n)) / rPeriodic;
  }
  
  const totalPaid = pmt * n;
  const totalInterest = totalPaid - maxLoanAmount;
  
  return {
    isEmpty: false,
    maxLoanAmount: maxLoanAmount,
    totalInterest: totalInterest,
    totalRepayment: totalPaid,
    payment: pmt,
    termMonths: n
  };
};

export const generateYearlySchedule = (monthlySchedule) => {
  if (!monthlySchedule || monthlySchedule.length === 0) return [];
  
  const yearlySchedule = [];
  let currentYear = 1;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearPayment = 0;
  let yearMonths = [];
  
  monthlySchedule.forEach((month, index) => {
    yearPrincipal += month.principal;
    yearInterest += month.interest;
    yearPayment += month.payment;
    yearMonths.push(month);
    
    if ((index + 1) % 12 === 0 || index === monthlySchedule.length - 1) {
      yearlySchedule.push({
        year: currentYear,
        principal: yearPrincipal,
        interest: yearInterest,
        payment: yearPayment,
        balance: month.balance,
        months: yearMonths
      });
      currentYear++;
      yearPrincipal = 0;
      yearInterest = 0;
      yearPayment = 0;
      yearMonths = [];
    }
  });
  
  return yearlySchedule;
};
