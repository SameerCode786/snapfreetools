export const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === '') return NaN;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(parsed) ? NaN : parsed;
};

export const formatNumber = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const formatWeight = (num, unit = 'kg') => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return '';
  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
  return `${formatted} ${unit}`;
};

export const formatBMI = (num) => {
  if (num === null || num === undefined || isNaN(num) || !isFinite(num)) return '';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num);
};
