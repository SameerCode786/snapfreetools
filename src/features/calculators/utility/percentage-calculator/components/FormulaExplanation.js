import React from 'react';
import { formatNumber } from '../utils/formatting';

export default function FormulaExplanation({ mode, data, result }) {
  if (!result || result.isEmpty) return null;

  let formula = '';
  let calculation = '';

  if (mode === 'percentageOf') {
    formula = 'Result = (Percentage ÷ 100) × Number';
    calculation = `(${data.percentage} ÷ 100) × ${data.number} = ${formatNumber(result.result, 4)}`;
  } else if (mode === 'whatPercent') {
    formula = 'Percentage = (Part ÷ Whole) × 100';
    calculation = `(${data.part} ÷ ${data.whole}) × 100 = ${formatNumber(result.result, 4)}%`;
  } else if (mode === 'increase' || mode === 'decrease' || mode === 'change') {
    formula = 'Percentage Change = ((New - Old) ÷ Old) × 100';
    calculation = `((${data.newNumber} - ${data.original}) ÷ ${data.original}) × 100 = ${formatNumber(result.percentChange, 4)}%`;
  } else if (mode === 'difference') {
    formula = 'Percentage Difference = |A - B| ÷ ((A + B) ÷ 2) × 100';
    calculation = `|${data.valA} - ${data.valB}| ÷ ((${data.valA} + ${data.valB}) ÷ 2) × 100 = ${formatNumber(result.percentDiff, 4)}%`;
  } else if (mode === 'reverse') {
    formula = 'Original = (Amount × 100) ÷ Percentage';
    calculation = `(${data.amount} × 100) ÷ ${data.percentage} = ${formatNumber(result.original, 4)}`;
  } else if (mode === 'discount') {
    formula = 'Final Price = Original - (Original × (Discount ÷ 100))';
    calculation = `${data.price} - (${data.price} × (${data.discountPercent} ÷ 100)) = ${formatNumber(result.finalPrice, 2)}`;
  } else if (mode === 'tax') {
    formula = 'Final Price = Base + (Base × (Tax Rate ÷ 100))';
    calculation = `${data.price} + (${data.price} × (${data.taxPercent} ÷ 100)) = ${formatNumber(result.finalPrice, 2)}`;
  } else if (mode === 'tip') {
    formula = 'Tip = Bill × (Tip% ÷ 100)';
    calculation = `${data.bill} × (${data.tipPercent} ÷ 100) = ${formatNumber(result.tipAmount, 2)}`;
  } else if (mode === 'points') {
    formula = 'Percentage Points = End% - Start%';
    calculation = `${data.end} - ${data.start} = ${formatNumber(result.pointChange, 4)}`;
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 sm:p-8 mb-8">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Calculation Explanation</h3>
      <div className="space-y-4">
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Formula</div>
          <div className="font-mono text-slate-700 bg-white border border-slate-200 py-2 px-4 rounded-xl inline-block overflow-x-auto max-w-full">
            {formula}
          </div>
        </div>
        <div>
          <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Calculation</div>
          <div className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 py-2 px-4 rounded-xl inline-block overflow-x-auto max-w-full">
            {calculation}
          </div>
        </div>
      </div>
    </div>
  );
}
