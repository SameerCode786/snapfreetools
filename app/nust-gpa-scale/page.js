import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "NUST GPA Scale - National University of Sciences and Technology Grading Map",
    description: "Detailed overview of the official NUST GPA grading scale. Letter grade points, GPA maps, and semester requirements analyzed.",
    alternates: {
      canonical: "https://www.snapfreetools.com/nust-gpa-scale"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What is a B+ grade weight at NUST?",
      answer: "At NUST, a B+ letter grade is assigned 3.50 grade points on the official 4.0 scale."
    },
    {
      question: "What is the weight of a C+ grade at NUST?",
      answer: "A C+ letter grade corresponds to exactly 2.50 grade points at NUST."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      

      <CalculatorLayout
        title="NUST GPA Scale"
        description="A complete guide showing NUST grade points mapping."
        currentSlug="nust-gpa-scale"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">NUST GPA Scale</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              National University of Sciences and Technology (NUST) uses specific grade point distributions for its engineering and computer classes.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is the official NUST GPA scale?"
            answer="NUST uses a standard 4.0 scale with the following letter grade allocations: A = 4.0, B+ = 3.5, B = 3.0, C+ = 2.5, C = 2.0, D = 1.0, F = 0.0."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">Official Grade Point Distribution</h2>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Letter Grade</th>
                    <th className="p-4">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-bold">A</td>
                    <td className="p-4">4.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B+</td>
                    <td className="p-4">3.50</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B</td>
                    <td className="p-4">3.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C+</td>
                    <td className="p-4">2.50</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C</td>
                    <td className="p-4">2.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">D</td>
                    <td className="p-4">1.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">F</td>
                    <td className="p-4">0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">NUST GPA Calculation</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our dynamic NUST GPA calculator to check your semester average:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/gpa-calculator/nust" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  NUST GPA Calculator
                </Link>
              </div>
            </div>
          </article>

          <FAQSection faqs={faqs} />
        </div>
      </CalculatorLayout>
    </>
  );
}
