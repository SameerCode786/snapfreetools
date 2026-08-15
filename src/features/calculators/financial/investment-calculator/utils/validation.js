export const validateInvestmentData = (data, mode) => {
  const errors = {};
  
  if (data.principal === undefined || data.principal === null || data.principal === "") {
    errors.principal = "Required";
  } else if (Number(data.principal) < 0) {
    errors.principal = "Cannot be negative";
  }

  if (mode !== 'compound') {
    if (data.monthlyContribution === undefined || data.monthlyContribution === null || data.monthlyContribution === "") {
      errors.monthlyContribution = "Required";
    } else if (Number(data.monthlyContribution) < 0) {
      errors.monthlyContribution = "Cannot be negative";
    }
  }
  
  if (data.annualRate === undefined || data.annualRate === null || data.annualRate === "") {
    errors.annualRate = "Required";
  }
  
  if (data.years === undefined || data.years === null || data.years === "") {
    errors.years = "Required";
  } else if (Number(data.years) <= 0) {
    errors.years = "Must be greater than 0";
  }

  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    errors
  };
};

export const validateGoalData = (data) => {
  const errors = {};
  
  if (data.targetAmount === undefined || data.targetAmount === null || data.targetAmount === "") {
    errors.targetAmount = "Required";
  } else if (Number(data.targetAmount) <= 0) {
    errors.targetAmount = "Must be greater than 0";
  }
  
  if (data.initialInvestment === undefined || data.initialInvestment === null || data.initialInvestment === "") {
    errors.initialInvestment = "Required";
  } else if (Number(data.initialInvestment) < 0) {
    errors.initialInvestment = "Cannot be negative";
  }

  if (data.annualRate === undefined || data.annualRate === null || data.annualRate === "") {
    errors.annualRate = "Required";
  }
  
  if (data.years === undefined || data.years === null || data.years === "") {
    errors.years = "Required";
  } else if (Number(data.years) <= 0) {
    errors.years = "Must be greater than 0";
  }

  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    errors
  };
};

export const validateInflationData = (data) => {
  const errors = {};
  
  if (data.futureValue === undefined || data.futureValue === null || data.futureValue === "") {
    errors.futureValue = "Required";
  } else if (Number(data.futureValue) <= 0) {
    errors.futureValue = "Must be greater than 0";
  }

  if (data.inflationRate === undefined || data.inflationRate === null || data.inflationRate === "") {
    errors.inflationRate = "Required";
  }
  
  if (data.years === undefined || data.years === null || data.years === "") {
    errors.years = "Required";
  } else if (Number(data.years) <= 0) {
    errors.years = "Must be greater than 0";
  }

  const isValid = Object.keys(errors).length === 0;
  
  return {
    isValid,
    errors
  };
};
