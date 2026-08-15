import { calculateStandardEMI } from './src/features/calculators/financial/emi-calculator/utils/calculations.js';

const test1 = calculateStandardEMI(100000, 5, 30, 'years', 'monthly');
console.log('Test 1 (100k, 5%, 30yr):');
console.log(`EMI: ${test1.emi.toFixed(2)} (Expected: 536.82)`);
console.log(`Total Payments: ${test1.numberOfPayments} (Expected: 360)`);
console.log(`Total Interest: ${test1.totalInterest.toFixed(2)} (Expected: 93255.78)`);

console.log('\n---');

const test2 = calculateStandardEMI(100000, 0, 30, 'years', 'monthly');
console.log('Test 2 (100k, 0%, 30yr):');
console.log(`EMI: ${test2.emi.toFixed(2)} (Expected: 277.78)`);

