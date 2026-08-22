// BMI Categories (standard adult WHO classification)
export const BMI_CATEGORIES = [
  { label: 'Underweight',       min: 0,    max: 18.5,  color: '#3b82f6', bg: '#eff6ff', text: '#1d4ed8' },
  { label: 'Healthy Weight',    min: 18.5, max: 25.0,  color: '#22c55e', bg: '#f0fdf4', text: '#166534' },
  { label: 'Overweight',        min: 25.0, max: 30.0,  color: '#f59e0b', bg: '#fffbeb', text: '#92400e' },
  { label: 'Obesity Class I',   min: 30.0, max: 35.0,  color: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  { label: 'Obesity Class II',  min: 35.0, max: 40.0,  color: '#ef4444', bg: '#fef2f2', text: '#991b1b' },
  { label: 'Obesity Class III', min: 40.0, max: Infinity, color: '#dc2626', bg: '#fef2f2', text: '#7f1d1d' },
];

export const getBMICategory = (bmi) => {
  if (!isFinite(bmi) || isNaN(bmi)) return null;
  return BMI_CATEGORIES.find(c => bmi >= c.min && bmi < c.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
};

// Metric BMI: weight(kg) / height(m)^2
export const calculateMetricBMI = ({ weightKg, heightM, age, isMinor }) => {
  if (!weightKg || !heightM || heightM === 0) return { isEmpty: true };
  const bmi = weightKg / (heightM * heightM);

  if (!isFinite(bmi) || isNaN(bmi)) return { isEmpty: true };

  const category = getBMICategory(bmi);
  const minHealthy = 18.5 * heightM * heightM;
  const maxHealthy = 24.9 * heightM * heightM;
  const weightDiff = weightKg < minHealthy
    ? minHealthy - weightKg
    : weightKg > maxHealthy
      ? weightKg - maxHealthy
      : 0;
  const weightStatus = weightKg < minHealthy ? 'below' : weightKg > maxHealthy ? 'above' : 'within';

  return {
    isEmpty: false,
    isMinor,
    bmi: Math.round(bmi * 10) / 10,
    category,
    heightM,
    weightKg,
    age,
    minHealthyWeight: Math.round(minHealthy * 10) / 10,
    maxHealthyWeight: Math.round(maxHealthy * 10) / 10,
    weightDiff: Math.round(weightDiff * 10) / 10,
    weightStatus,
    unit: 'metric',
  };
};

// Imperial BMI: 703 × weight(lb) / height(in)^2
export const calculateImperialBMI = ({ weightLb, totalInches, age, isMinor }) => {
  if (!weightLb || !totalInches || totalInches === 0) return { isEmpty: true };
  const bmi = (703 * weightLb) / (totalInches * totalInches);

  if (!isFinite(bmi) || isNaN(bmi)) return { isEmpty: true };

  const category = getBMICategory(bmi);
  // Healthy weight range in lbs
  const minHealthyLb = (18.5 * totalInches * totalInches) / 703;
  const maxHealthyLb = (24.9 * totalInches * totalInches) / 703;
  const weightDiff = weightLb < minHealthyLb
    ? minHealthyLb - weightLb
    : weightLb > maxHealthyLb
      ? weightLb - maxHealthyLb
      : 0;
  const weightStatus = weightLb < minHealthyLb ? 'below' : weightLb > maxHealthyLb ? 'above' : 'within';

  return {
    isEmpty: false,
    isMinor,
    bmi: Math.round(bmi * 10) / 10,
    category,
    totalInches,
    weightLb,
    age,
    minHealthyWeight: Math.round(minHealthyLb * 10) / 10,
    maxHealthyWeight: Math.round(maxHealthyLb * 10) / 10,
    weightDiff: Math.round(weightDiff * 10) / 10,
    weightStatus,
    unit: 'imperial',
  };
};

// Calculate BMI for what-if weight
export const calculateWhatIfBMI = (result, newWeight) => {
  if (!result || result.isEmpty || !newWeight || newWeight <= 0) return null;

  let bmi;
  if (result.unit === 'metric') {
    const hm = result.heightM;
    bmi = newWeight / (hm * hm);
  } else {
    const inch = result.totalInches;
    bmi = (703 * newWeight) / (inch * inch);
  }

  if (!isFinite(bmi) || isNaN(bmi)) return null;

  return {
    bmi: Math.round(bmi * 10) / 10,
    category: getBMICategory(bmi),
    diff: Math.round((bmi - result.bmi) * 10) / 10,
  };
};
