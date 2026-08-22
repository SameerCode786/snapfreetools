import { safeParseFloat } from "./formatting";

export const validatePercentageOfNumber = (percentage, number) => {
  const p = safeParseFloat(percentage);
  const n = safeParseFloat(number);

  if (percentage === '' || number === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(p) || isNaN(n)) return { isValid: false, message: 'Please enter valid numbers.' };

  return { isValid: true, p, n };
};

export const validateWhatPercent = (part, whole) => {
  const p = safeParseFloat(part);
  const w = safeParseFloat(whole);

  if (part === '' || whole === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(p) || isNaN(w)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (w === 0) return { isValid: false, message: 'The whole number cannot be zero.' };

  return { isValid: true, p, w };
};

export const validateChange = (original, newNumber) => {
  const o = safeParseFloat(original);
  const n = safeParseFloat(newNumber);

  if (original === '' || newNumber === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(o) || isNaN(n)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (o === 0) return { isValid: false, message: 'Original value cannot be zero for percentage change.' };

  return { isValid: true, o, n };
};

export const validateDifference = (valA, valB) => {
  const a = safeParseFloat(valA);
  const b = safeParseFloat(valB);

  if (valA === '' || valB === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(a) || isNaN(b)) return { isValid: false, message: 'Please enter valid numbers.' };
  
  const average = (a + b) / 2;
  if (average === 0) return { isValid: false, message: 'Average of both values cannot be zero.' };

  return { isValid: true, a, b, average };
};

export const validateReverse = (percentage, amount) => {
  const p = safeParseFloat(percentage);
  const a = safeParseFloat(amount);

  if (percentage === '' || amount === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(p) || isNaN(a)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (p === 0) return { isValid: false, message: 'Percentage cannot be zero.' };

  return { isValid: true, p, a };
};

export const validateDiscount = (price, discountPercent) => {
  const p = safeParseFloat(price);
  const d = safeParseFloat(discountPercent);

  if (price === '' || discountPercent === '') return { isValid: false, message: 'Please enter price and discount.' };
  if (isNaN(p) || isNaN(d)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (p < 0) return { isValid: false, message: 'Price cannot be negative.' };

  return { isValid: true, p, d };
};

export const validateTax = (price, taxPercent) => {
  const p = safeParseFloat(price);
  const t = safeParseFloat(taxPercent);

  if (price === '' || taxPercent === '') return { isValid: false, message: 'Please enter price and tax.' };
  if (isNaN(p) || isNaN(t)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (p < 0) return { isValid: false, message: 'Price cannot be negative.' };

  return { isValid: true, p, t };
};

export const validateTip = (bill, tipPercent, people) => {
  const b = safeParseFloat(bill);
  const t = safeParseFloat(tipPercent);
  const p = safeParseFloat(people);

  if (bill === '' || tipPercent === '' || people === '') return { isValid: false, message: 'Please enter all values.' };
  if (isNaN(b) || isNaN(t) || isNaN(p)) return { isValid: false, message: 'Please enter valid numbers.' };
  if (b < 0) return { isValid: false, message: 'Bill cannot be negative.' };
  if (p <= 0 || !Number.isInteger(p)) return { isValid: false, message: 'People must be a positive whole number.' };

  return { isValid: true, b, t, p };
};

export const validatePoints = (start, end) => {
  const s = safeParseFloat(start);
  const e = safeParseFloat(end);

  if (start === '' || end === '') return { isValid: false, message: 'Please enter both values.' };
  if (isNaN(s) || isNaN(e)) return { isValid: false, message: 'Please enter valid numbers.' };

  return { isValid: true, s, e };
};
