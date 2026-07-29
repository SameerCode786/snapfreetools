import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "FAST GPA Scale - FAST NUCES Grading Criteria Explained",
    description: "Detailed overview of the official FAST NUCES GPA grading scale. Letter grade points, GPA maps, and semester requirements analyzed.",
    alternates: {
      canonical: "https://www.snapfreetools.com/fast-gpa-scale"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What is an A grade weight at FAST NUCES?",
      answer: "At FAST NUCES, both A and A+ grades are assigned 4.00 grade points on the official 4.0 scale."
    },
    {
      question: "What is the weight of a B- grade at FAST?",
      answer: "A B- letter grade corresponds to exactly 2.67 grade points at FAST NUCES."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      

      <CalculatorLayout
        title="FAST GPA Scale"
        description="A complete guide showing FAST NUCES grade points mapping."
        currentSlug="fast-gpa-scale"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">FAST GPA Scale</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              FAST National University uses specific grade point distributions for its computer science and engineering classes.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is the official FAST NUCES GPA scale?"
            answer="FAST NUCES uses a standard 4.0 scale with the following letter grade allocations: A/A+ = 4.0, A- = 3.67, B+ = 3.33, B = 3.0, B- = 2.67, C+ = 2.33, C = 2.0, C- = 1.67, D+ = 1.33, D = 1.0, F = 0.0."
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
                    <td className="p-4 font-bold">A+ / A</td>
                    <td className="p-4">4.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">A-</td>
                    <td className="p-4">3.67</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B+</td>
                    <td className="p-4">3.33</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B</td>
                    <td className="p-4">3.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B-</td>
                    <td className="p-4">2.67</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C+</td>
                    <td className="p-4">2.33</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C</td>
                    <td className="p-4">2.00</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C-</td>
                    <td className="p-4">1.67</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">D+</td>
                    <td className="p-4">1.33</td>
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
              <h3 className="font-bold text-amber-900">FAST NUCES GPA Calculation</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our dynamic FAST GPA calculator to check your semester average:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/gpa-calculator/fast" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  FAST GPA Calculator
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
