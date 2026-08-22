import { safeParseFloat } from "./formatting";

export const validateBasicDiscount = (original, discount) => {
  const o = safeParseFloat(original);
  const d = safeParseFloat(discount);

  if (original === '' || discount === '') return { isValid: false, message: 'Please enter original price and discount percentage.' };
  if (isNaN(o) || isNaN(d)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (o < 0) return { isValid: false, message: 'Original price cannot be negative.' };

  return { isValid: true, original: o, discount: d };
};

export const validateReverseDiscount = (original, sale) => {
  const o = safeParseFloat(original);
  const s = safeParseFloat(sale);

  if (original === '' || sale === '') return { isValid: false, message: 'Please enter original and sale prices.' };
  if (isNaN(o) || isNaN(s)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (o < 0 || s < 0) return { isValid: false, message: 'Prices cannot be negative.' };
  if (o === 0) return { isValid: false, message: 'Original price cannot be zero when finding discount.' };

  return { isValid: true, original: o, sale: s };
};

export const validateFindOriginal = (sale, discount) => {
  const s = safeParseFloat(sale);
  const d = safeParseFloat(discount);

  if (sale === '' || discount === '') return { isValid: false, message: 'Please enter sale price and discount.' };
  if (isNaN(s) || isNaN(d)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (s < 0) return { isValid: false, message: 'Sale price cannot be negative.' };
  if (d >= 100) return { isValid: false, message: 'Cannot calculate original price from a 100% or greater discount.' };

  return { isValid: true, sale: s, discount: d };
};

export const validateStackedDiscounts = (original, d1, d2, d3) => {
  const o = safeParseFloat(original);
  
  if (original === '') return { isValid: false, message: 'Please enter the original price.' };
  if (isNaN(o)) return { isValid: false, message: 'Please enter a valid original price.' };
  if (o < 0) return { isValid: false, message: 'Original price cannot be negative.' };
  
  const discount1 = d1 === '' ? 0 : safeParseFloat(d1);
  const discount2 = d2 === '' ? 0 : safeParseFloat(d2);
  const discount3 = d3 === '' ? 0 : safeParseFloat(d3);

  if (isNaN(discount1) || isNaN(discount2) || isNaN(discount3)) return { isValid: false, message: 'Please enter valid numbers for discounts.' };
  
  if (d1 === '' && d2 === '' && d3 === '') return { isValid: false, message: 'Please enter at least one discount.' };

  return { isValid: true, original: o, d1: discount1, d2: discount2, d3: discount3 };
};

export const validateDiscountAndTax = (original, discount, tax) => {
  const o = safeParseFloat(original);
  const d = safeParseFloat(discount);
  const t = tax === '' ? 0 : safeParseFloat(tax);

  if (original === '' || discount === '') return { isValid: false, message: 'Please enter original price and discount.' };
  if (isNaN(o) || isNaN(d) || isNaN(t)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (o < 0) return { isValid: false, message: 'Original price cannot be negative.' };

  return { isValid: true, original: o, discount: d, tax: t };
};

export const validateDiscountAndTip = (bill, discount, tip, people) => {
  const b = safeParseFloat(bill);
  const d = safeParseFloat(discount);
  const t = tip === '' ? 0 : safeParseFloat(tip);
  const p = safeParseFloat(people);

  if (bill === '' || discount === '' || people === '') return { isValid: false, message: 'Please enter bill, discount, and people.' };
  if (isNaN(b) || isNaN(d) || isNaN(t) || isNaN(p)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (b < 0) return { isValid: false, message: 'Bill cannot be negative.' };
  if (p <= 0 || !Number.isInteger(p)) return { isValid: false, message: 'People must be a positive whole number.' };

  return { isValid: true, bill: b, discount: d, tip: t, people: p };
};

export const validateCompareDiscounts = (priceA, discountA, priceB, discountB) => {
  const pa = safeParseFloat(priceA);
  const da = safeParseFloat(discountA);
  const pb = safeParseFloat(priceB);
  const db = safeParseFloat(discountB);

  if (priceA === '' || discountA === '' || priceB === '' || discountB === '') return { isValid: false, message: 'Please enter all fields.' };
  if (isNaN(pa) || isNaN(da) || isNaN(pb) || isNaN(db)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (pa < 0 || pb < 0) return { isValid: false, message: 'Prices cannot be negative.' };

  return { isValid: true, pa, da, pb, db };
};

export const validateTargetPrice = (original, target) => {
  const o = safeParseFloat(original);
  const t = safeParseFloat(target);

  if (original === '' || target === '') return { isValid: false, message: 'Please enter original and target prices.' };
  if (isNaN(o) || isNaN(t)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (o < 0 || t < 0) return { isValid: false, message: 'Prices cannot be negative.' };
  if (o === 0) return { isValid: false, message: 'Original price cannot be zero.' };

  return { isValid: true, original: o, target: t };
};
