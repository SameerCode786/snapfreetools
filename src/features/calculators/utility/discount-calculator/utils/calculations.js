export const calculateBasicDiscount = (original, discount) => {
  const discountAmount = original * (discount / 100);
  const finalPrice = original - discountAmount;
  
  return {
    discountAmount,
    finalPrice,
    original,
    discount,
    savingsAmount: discountAmount,
    isEmpty: false
  };
};

export const calculateReverseDiscount = (original, sale) => {
  const discountAmount = original - sale;
  const discount = original === 0 ? 0 : (discountAmount / original) * 100;
  
  return {
    discountAmount,
    discount,
    original,
    sale,
    savingsAmount: discountAmount,
    isEmpty: false
  };
};

export const calculateFindOriginal = (sale, discount) => {
  const original = sale / (1 - (discount / 100));
  const discountAmount = original - sale;
  
  return {
    original,
    discountAmount,
    sale,
    discount,
    savingsAmount: discountAmount,
    isEmpty: false
  };
};

export const calculateStackedDiscounts = (original, d1, d2, d3) => {
  let currentPrice = original;
  
  const discountAmount1 = currentPrice * (d1 / 100);
  currentPrice -= discountAmount1;
  
  const discountAmount2 = currentPrice * (d2 / 100);
  currentPrice -= discountAmount2;
  
  const discountAmount3 = currentPrice * (d3 / 100);
  currentPrice -= discountAmount3;
  
  const finalPrice = currentPrice;
  const totalSavings = original - finalPrice;
  const effectiveDiscount = original === 0 ? 0 : (totalSavings / original) * 100;
  
  return {
    original,
    d1, d2, d3,
    discountAmount1, discountAmount2, discountAmount3,
    finalPrice,
    totalSavings,
    effectiveDiscount,
    isEmpty: false
  };
};

export const calculateDiscountAndTax = (original, discount, tax) => {
  const discountAmount = original * (discount / 100);
  const discountedPrice = original - discountAmount;
  const taxAmount = discountedPrice * (tax / 100);
  const finalPrice = discountedPrice + taxAmount;
  
  return {
    original,
    discountAmount,
    discountedPrice,
    taxAmount,
    finalPrice,
    isEmpty: false
  };
};

export const calculateDiscountAndTip = (bill, discount, tip, people) => {
  const discountAmount = bill * (discount / 100);
  const discountedBill = bill - discountAmount;
  const tipAmount = discountedBill * (tip / 100);
  const finalBill = discountedBill + tipAmount;
  const perPerson = people > 0 ? finalBill / people : finalBill;
  const tipPerPerson = people > 0 ? tipAmount / people : tipAmount;
  
  return {
    bill,
    discountAmount,
    discountedBill,
    tipAmount,
    finalBill,
    perPerson,
    tipPerPerson,
    isEmpty: false
  };
};

export const calculateCompareDiscounts = (pa, da, pb, db) => {
  const discountAmountA = pa * (da / 100);
  const finalPriceA = pa - discountAmountA;
  
  const discountAmountB = pb * (db / 100);
  const finalPriceB = pb - discountAmountB;
  
  const difference = Math.abs(finalPriceA - finalPriceB);
  let bestDeal = 'none';
  if (finalPriceA < finalPriceB) bestDeal = 'A';
  if (finalPriceB < finalPriceA) bestDeal = 'B';
  
  return {
    finalPriceA,
    finalPriceB,
    difference,
    bestDeal,
    savingsA: discountAmountA,
    savingsB: discountAmountB,
    isEmpty: false
  };
};

export const calculateTargetPrice = (original, target) => {
  const savingsAmount = original - target;
  let requiredDiscount = original === 0 ? 0 : (savingsAmount / original) * 100;
  
  // If target > original, discount is negative (price increase), but we still display it
  return {
    savingsAmount,
    requiredDiscount,
    original,
    target,
    isEmpty: false
  };
};
