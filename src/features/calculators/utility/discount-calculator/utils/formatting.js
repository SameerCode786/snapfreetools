export const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === '') return NaN;
  if (typeof value === 'number') return value;
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsed) ? NaN : parsed;
};

export const formatNumber = (num, decimals = 2) => {
  if (num === 'N/A') return 'N/A';
  if (isNaN(num) || num === null || num === undefined) return '';
  if (!isFinite(num)) return 'N/A';
  
  // Use Intl.NumberFormat for safe formatting
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(num);
};

export const formatCurrency = (num, currencyCode = 'USD', decimals = 2) => {
  if (num === 'N/A') return 'N/A';
  if (isNaN(num) || num === null || num === undefined) return '';
  if (!isFinite(num)) return 'N/A';
  
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  
  return formatter.format(num);
};

export const formatPercent = (num, decimals = 2) => {
  if (num === 'N/A') return 'N/A';
  if (isNaN(num) || num === null || num === undefined) return '';
  if (!isFinite(num)) return 'N/A';
  
  return formatNumber(num, decimals) + '%';
};
