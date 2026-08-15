import { calculateInvestmentGrowth } from './src/features/calculators/financial/investment-calculator/utils/calculations.js';

// TEST 1: Initial $10000, Monthly $500, Return 8%, 10 years
const test1 = calculateInvestmentGrowth(10000, 500, 8, 10, 'monthly');
console.log("TEST 1 - Standard Growth");
console.log(`Expected FV: ~114,299 (varies slightly based on compounding)`);
console.log(`Actual FV:`, test1.futureValue.toFixed(2));
console.log(`Total Invested:`, test1.totalInvested);
console.log(`Total Growth:`, test1.totalGrowth.toFixed(2));
console.log('---');

// TEST 2: Initial $10000, Monthly $0, Return 0%, 10 years
const test2 = calculateInvestmentGrowth(10000, 0, 0, 10, 'monthly');
console.log("TEST 2 - 0% Return, No Contribs");
console.log(`Expected FV: 10000`);
console.log(`Actual FV:`, test2.futureValue);
console.log('---');

// TEST 3: Initial $0, Monthly $500, Return 0%, 10 years
const test3 = calculateInvestmentGrowth(0, 500, 0, 10, 'monthly');
console.log("TEST 3 - 0% Return, Only Contribs");
console.log(`Expected FV: 60000`);
console.log(`Actual FV:`, test3.futureValue);
console.log('---');
