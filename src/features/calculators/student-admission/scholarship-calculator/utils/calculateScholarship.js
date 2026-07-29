export function calculateScholarship({
  tuitionFee,
  feeCycle,
  scholarshipType,
  scholarshipValue,
  monthsPerYear = 12,
  semestersPerYear = 2,
  totalSemesters = 0,
  studyYears = 0
}) {
  let fee = parseFloat(tuitionFee);
  let value = parseFloat(scholarshipValue);

  if (isNaN(fee) || fee <= 0) {
    throw new Error("Please enter a valid tuition fee greater than 0.");
  }
  if (isNaN(value) || value < 0) {
    throw new Error("Please enter a valid scholarship value.");
  }

  let scholarshipAmount = 0;
  let remainingFee = fee;
  let effectivePercentage = 0;

  if (scholarshipType === "percentage") {
    if (value > 100) {
      throw new Error("Percentage cannot exceed 100%.");
    }
    scholarshipAmount = (fee * value) / 100;
    remainingFee = fee - scholarshipAmount;
    effectivePercentage = value;
  } else if (scholarshipType === "fixed") {
    if (value > fee) {
      throw new Error("Fixed scholarship cannot exceed the tuition fee.");
    }
    scholarshipAmount = value;
    remainingFee = fee - value;
    effectivePercentage = (scholarshipAmount / fee) * 100;
  }

  // Projection
  let annualTuition = 0;
  let annualScholarship = 0;
  let annualPayable = 0;
  let programTuition = 0;
  let programScholarship = 0;
  let programPayable = 0;

  let hasAnnual = false;
  let hasProgram = false;

  if (feeCycle === "month") {
    annualTuition = fee * monthsPerYear;
    annualScholarship = scholarshipAmount * monthsPerYear;
    annualPayable = remainingFee * monthsPerYear;
    hasAnnual = true;
    
    if (studyYears > 0) {
      programTuition = annualTuition * studyYears;
      programScholarship = annualScholarship * studyYears;
      programPayable = annualPayable * studyYears;
      hasProgram = true;
    }
  } else if (feeCycle === "semester") {
    annualTuition = fee * semestersPerYear;
    annualScholarship = scholarshipAmount * semestersPerYear;
    annualPayable = remainingFee * semestersPerYear;
    hasAnnual = true;

    if (totalSemesters > 0) {
      programTuition = fee * totalSemesters;
      programScholarship = scholarshipAmount * totalSemesters;
      programPayable = remainingFee * totalSemesters;
      hasProgram = true;
    }
  } else if (feeCycle === "year") {
    annualTuition = fee;
    annualScholarship = scholarshipAmount;
    annualPayable = remainingFee;
    hasAnnual = true;

    if (studyYears > 0) {
      programTuition = fee * studyYears;
      programScholarship = scholarshipAmount * studyYears;
      programPayable = remainingFee * studyYears;
      hasProgram = true;
    }
  } else if (feeCycle === "total") {
    programTuition = fee;
    programScholarship = scholarshipAmount;
    programPayable = remainingFee;
    hasProgram = true;
  }

  return {
    base: {
      tuition: fee,
      scholarship: scholarshipAmount,
      payable: remainingFee,
      effectivePercentage
    },
    annual: hasAnnual ? {
      tuition: annualTuition,
      scholarship: annualScholarship,
      payable: annualPayable
    } : null,
    program: hasProgram ? {
      tuition: programTuition,
      scholarship: programScholarship,
      payable: programPayable
    } : null
  };
}
