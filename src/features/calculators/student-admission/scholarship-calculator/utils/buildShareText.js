export function buildShareText(result, formatCurrency, feeCycle, scholarshipType, scholarshipValue) {
  const url = "https://www.snapfreetools.com/scholarship-calculator";
  
  let text = `Scholarship Calculator Result\n\n`;
  
  text += `Tuition Fee: ${formatCurrency(result.base.tuition)} per ${feeCycle}\n`;
  
  if (scholarshipType === "percentage") {
    text += `Scholarship: ${scholarshipValue}%\n`;
  } else {
    text += `Scholarship: Fixed Amount\n`;
  }

  text += `Scholarship Amount: ${formatCurrency(result.base.scholarship)}\n`;
  text += `Fee After Scholarship: ${formatCurrency(result.base.payable)}\n`;
  
  if (result.annual) {
    text += `Estimated Annual Savings: ${formatCurrency(result.annual.scholarship)}\n`;
    text += `Estimated Annual Payable: ${formatCurrency(result.annual.payable)}\n`;
  }

  if (result.program) {
    text += `Estimated Total Program Savings: ${formatCurrency(result.program.scholarship)}\n`;
    text += `Estimated Total Program Payable: ${formatCurrency(result.program.payable)}\n`;
  }

  text += `\nCalculated with SnapFreeTools Scholarship Calculator:\n${url}`;
  
  return text;
}
