import { safeParseFloat } from './formatting';

// Validate metric inputs: weight (kg), height (cm)
export const validateMetric = (weightKg, heightCm, age) => {
  const w = safeParseFloat(weightKg);
  const h = safeParseFloat(heightCm);

  if (weightKg === '' || heightCm === '') return { isValid: false, message: 'Please enter your height and weight.' };
  if (isNaN(w) || isNaN(h)) return { isValid: false, message: 'Please enter valid numbers for height and weight.' };
  if (w <= 0) return { isValid: false, message: 'Weight must be greater than 0.' };
  if (h <= 0) return { isValid: false, message: 'Height must be greater than 0.' };
  if (w > 700) return { isValid: false, message: 'Please enter a realistic weight.' };
  if (h > 300) return { isValid: false, message: 'Please enter a realistic height in centimeters.' };
  if (h < 50) return { isValid: false, message: 'Height seems too low. Enter in centimeters (e.g., 175).' };

  const ageVal = age !== '' ? safeParseFloat(age) : null;
  const isMinor = ageVal !== null && !isNaN(ageVal) && ageVal < 18 && ageVal > 0;

  return { isValid: true, weightKg: w, heightM: h / 100, age: ageVal, isMinor };
};

// Validate imperial inputs: weight (lb), height feet + inches
export const validateImperial = (weightLb, heightFt, heightIn, age) => {
  const w = safeParseFloat(weightLb);
  const ft = safeParseFloat(heightFt);
  const inches = heightIn === '' ? 0 : safeParseFloat(heightIn);

  if (weightLb === '' || heightFt === '') return { isValid: false, message: 'Please enter your height and weight.' };
  if (isNaN(w) || isNaN(ft)) return { isValid: false, message: 'Please enter valid numbers for height and weight.' };
  if (w <= 0) return { isValid: false, message: 'Weight must be greater than 0.' };
  if (ft < 0) return { isValid: false, message: 'Height must be greater than 0.' };
  if (isNaN(inches)) return { isValid: false, message: 'Please enter a valid number for inches.' };
  if (ft === 0 && inches === 0) return { isValid: false, message: 'Height must be greater than 0.' };
  if (w > 1500) return { isValid: false, message: 'Please enter a realistic weight in pounds.' };

  const totalInches = ft * 12 + inches;
  if (totalInches < 20) return { isValid: false, message: 'Height seems too low. Check your feet and inches.' };
  if (totalInches > 120) return { isValid: false, message: 'Please enter a realistic height.' };

  const ageVal = age !== '' ? safeParseFloat(age) : null;
  const isMinor = ageVal !== null && !isNaN(ageVal) && ageVal < 18 && ageVal > 0;

  return { isValid: true, weightLb: w, totalInches, age: ageVal, isMinor };
};
