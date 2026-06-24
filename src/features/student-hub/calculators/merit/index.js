"use client";

import { useState, useEffect } from "react";
import CalculatorLayout from "../../shared/components/CalculatorLayout";
import ResultCard from "../../shared/components/ResultCard";
import GeoAnswerCard from "../../shared/components/GeoAnswerCard";
import FormulaCard from "../../shared/components/FormulaCard";
import ExampleGrid from "../../shared/components/ExampleGrid";
import FAQSection from "../../shared/components/FAQSection";
import { MERIT_SCALES, DEFAULT_MERIT_FIELDS } from "../../shared/constants/meritScales";
import { calculateMeritAggregate } from "../../utils/formulaEngine";

export default function MeritCalculatorFeature({ faqs, initialPreset = null }) {
  const [preset, setPreset] = useState(initialPreset || "general");
  const [fields, setFields] = useState({});

  // Initialize fields based on preset selection
  useEffect(() => {
    let scaleFields = [];
    if (preset === "general" || !MERIT_SCALES[preset]) {
      scaleFields = DEFAULT_MERIT_FIELDS;
    } else {
      scaleFields = MERIT_SCALES[preset].fields;
    }

    const initialFields = {};
    scaleFields.forEach(f => {
      initialFields[f.id] = {
        id: f.id,
        label: f.label,
        weight: f.weight,
        value: "",
        min: f.min,
        max: f.max,
        isScore: f.isScore || false,
        outOf: f.outOf || null
      };
    });
    setFields(initialFields);
  }, [preset]);

  const updateFieldValue = (id, val) => {
    setFields(prev => ({
      ...prev,
      [id]: { ...prev[id], value: val }
    }));
  };

  const aggregate = calculateMeritAggregate(fields);
  const formattedAggregate = `${parseFloat(aggregate).toFixed(2)}%`;

  const resetCalculator = () => {
    setFields(prev => {
      const reset = {};
      for (const k in prev) {
        reset[k] = { ...prev[k], value: "" };
      }
      return reset;
    });
  };

  const activePreset = preset === "general" ? { name: "General Aggregate Weightings", university: "Generic Calculator", description: "Standard aggregate weighting calculation model." } : MERIT_SCALES[preset];

  const examples = [
    {
      scenario: "Calculate FAST aggregate merit with Matric score of 85%, FSc score of 80%, and Entry Test score of 72%.",
      solution: `FAST weights: 10% Matric, 40% FSc, 50% Test. Aggregation math: (85 * 0.10) + (80 * 0.40) + (72 * 0.50) = 8.5 + 32.0 + 36.0 = 76.50%.`,
      steps: [
        "Multiply Matric percentage by its weight (0.10).",
        "Multiply FSc percentage by its weight (0.40).",
        "Multiply Entry Test percentage by its weight (0.50).",
        "Sum the results together to compute the aggregate."
      ]
    },
    {
      scenario: "Calculate NUST aggregate merit with Matric score of 88%, FSc score of 82%, and NET Test marks of 145/200.",
      solution: `NUST weights: 10% Matric, 15% FSc, 75% NET. NET conversion to % = (145/200) * 100 = 72.5%. Aggregation: (88 * 0.10) + (82 * 0.15) + (72.5 * 0.75) = 8.8 + 12.3 + 54.375 = 75.475%.`,
      steps: [
        "Convert score-based tests to percentages.",
        "Apply weights and sum to find aggregate percentage."
      ]
    }
  ];

  return (
    <CalculatorLayout 
      title={initialPreset ? `${activePreset.name}` : "Merit Calculator"} 
      description={`Calculate university admissions aggregate merit scores with custom weights or selected university templates.`}
      currentSlug={initialPreset ? `merit-calculator/${preset}` : "merit-calculator"}
    >
      <div className="space-y-8">
        {/* Preset Selector Card (Hide on dedicated preset route) */}
        {!initialPreset && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-bold text-slate-800 text-base">Select Admission System</h2>
              <p className="text-slate-500 text-xs font-semibold">Select a predefined university template or use custom weights.</p>
            </div>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none transition-all cursor-pointer"
            >
              <option value="general">General (Matric 20%, FSc 30%, Entry Test 50%)</option>
              {Object.keys(MERIT_SCALES).map(key => (
                <option key={key} value={key}>{MERIT_SCALES[key].name}</option>
              ))}
            </select>
          </div>
        )}

        {/* Input Card */}
        <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-900">{activePreset.name}</h1>
            <p className="text-slate-500 text-sm font-semibold leading-relaxed">
              {activePreset.university} — {activePreset.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Object.keys(fields).map((k) => {
              const field = fields[k];
              return (
                <div key={field.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {field.label}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min={field.min}
                    max={field.max}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => updateFieldValue(field.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 rounded-xl px-4 py-3 text-sm font-semibold text-slate-700 focus:outline-none transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Card */}
        <ResultCard 
          value={formattedAggregate} 
          label="Admission Aggregate Merit"
          subtext={`Calculated from matching university aggregate standards.`}
          onReset={resetCalculator} 
        />

        {/* GEO Quick Answer */}
        <GeoAnswerCard 
          question="How do you calculate university aggregate merit?"
          answer={`To calculate university aggregate merit, multiply your percentage scores in matric/secondary school, intermediate/high school, and entrance tests by their respective weighting fractions, then sum the weighted averages together. For example, FAST uses a (10% Matric + 40% FSc + 50% Entry Test) formula, whereas NUST uses a (10% Matric + 15% FSc + 75% NET Entry Test) model.`}
        />

        {/* Formula */}
        <FormulaCard 
          formula="Aggregate = \sum (Academic Grade \% \times Weight Factor)"
          explanation="Multiply each academic component by its decimal weighting factor (e.g. 50% weight = 0.50). If the score is marks-based, convert to percentage before multiplication."
        />

        {/* Examples */}
        <ExampleGrid examples={examples} />

        {/* FAQs */}
        <FAQSection faqs={faqs} />
      </div>
    </CalculatorLayout>
  );
}
