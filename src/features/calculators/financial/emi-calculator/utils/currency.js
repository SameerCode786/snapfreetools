export const CURRENCIES = [
  { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  { code: "PKR", symbol: "Rs", locale: "ur-PK", name: "Pakistani Rupee" },
  { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
  { code: "EUR", symbol: "€", locale: "en-IE", name: "Euro" },
  { code: "CAD", symbol: "CA$", locale: "en-CA", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", locale: "en-AU", name: "Australian Dollar" },
  { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
  { code: "AED", symbol: "AED", locale: "ar-AE", name: "UAE Dirham" },
  { code: "SAR", symbol: "SAR", locale: "ar-SA", name: "Saudi Riyal" }
];

export const formatCurrency = (amount, currencyCode = "USD") => {
  if (amount === undefined || amount === null || isNaN(amount) || amount === Infinity || amount === -Infinity) {
    return "—";
  }

  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];

  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (e) {
    return `${currency.symbol}${Number(amount).toFixed(2)}`;
  }
};
