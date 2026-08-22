// A: X% of Y
export const calculatePercentageOfNumber = (p, n) => {
  const result = (p / 100) * n;
  return { result, isEmpty: false };
};

// B: X is what percent of Y
export const calculateWhatPercent = (p, w) => {
  const result = (p / w) * 100;
  return { result, isEmpty: false };
};

// C: Percentage Increase
export const calculatePercentageIncrease = (o, n) => {
  const absoluteChange = n - o;
  const percentChange = (absoluteChange / o) * 100;
  return { absoluteChange, percentChange, isEmpty: false };
};

// D: Percentage Decrease
export const calculatePercentageDecrease = (o, n) => {
  const absoluteChange = o - n;
  const percentChange = (absoluteChange / o) * 100;
  return { absoluteChange, percentChange, isEmpty: false };
};

// E: Percentage Difference
export const calculatePercentageDifference = (a, b, average) => {
  const absoluteDiff = Math.abs(a - b);
  const percentDiff = (absoluteDiff / average) * 100;
  return { absoluteDiff, average, percentDiff, isEmpty: false };
};

// F: Reverse Percentage (If X% of a number is Y, what is the number?)
export const calculateReverse = (p, a) => {
  const original = (a * 100) / p;
  return { original, isEmpty: false };
};

// G: Percentage Change / Growth (same as increase/decrease but handles direction)
export const calculateChange = (o, n) => {
  const absoluteChange = n - o;
  const percentChange = (absoluteChange / o) * 100;
  const isIncrease = percentChange > 0;
  const isDecrease = percentChange < 0;
  return { absoluteChange, percentChange, isIncrease, isDecrease, isEmpty: false };
};

// H: Discount
export const calculateDiscount = (p, d) => {
  const discountAmount = (p * d) / 100;
  const finalPrice = p - discountAmount;
  return { discountAmount, finalPrice, isEmpty: false };
};

// I: Tax
export const calculateTax = (p, t, mode = 'add') => {
  if (mode === 'add') {
    const taxAmount = (p * t) / 100;
    const finalPrice = p + taxAmount;
    return { taxAmount, finalPrice, isEmpty: false };
  } else {
    // Remove tax
    // p = finalPrice = basePrice * (1 + t / 100)
    // basePrice = p / (1 + t / 100)
    const basePrice = p / (1 + (t / 100));
    const taxAmount = p - basePrice;
    return { taxAmount, finalPrice: basePrice, isEmpty: false };
  }
};

// J: Tip
export const calculateTip = (b, t, p) => {
  const tipAmount = (b * t) / 100;
  const totalBill = b + tipAmount;
  const perPerson = totalBill / p;
  const tipPerPerson = tipAmount / p;
  return { tipAmount, totalBill, perPerson, tipPerPerson, isEmpty: false };
};

// K: Percentage Points
export const calculatePoints = (s, e) => {
  const pointChange = e - s;
  const relativeChange = s === 0 ? (e === 0 ? 0 : 'N/A') : ((e - s) / s) * 100;
  return { pointChange, relativeChange, isEmpty: false };
};
