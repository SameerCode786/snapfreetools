import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "GPA vs CGPA: Key Differences & Calculations Explained",
    description: "Understand the differences between GPA and CGPA. Learn how semester GPA aggregates into cumulative grade average (CGPA) with examples.",
    alternates: {
      canonical: "https://www.snapfreetools.com/gpa-vs-cgpa"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "Is CGPA calculated from GPA?",
      answer: "Yes, CGPA is the weighted aggregate average of all GPAs scored across all semesters, factoring in the credit hours taken in each term."
    },
    {
      question: "Which grade average is listed on graduation transcripts?",
      answer: "Transcripts typically list both your final term GPA and your overall Cumulative GPA (CGPA). CGPA is the primary metric used for honors divisions."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      

      <CalculatorLayout
        title="GPA vs CGPA"
        description="A clear comparison detailing term GPAs vs cumulative academic tracking."
        currentSlug="gpa-vs-cgpa"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">GPA vs CGPA</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              Academic institutions use both GPA and CGPA to index academic progress. Learn the structural and mathematical differences between these metrics.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is the difference between GPA and CGPA?"
            answer="GPA (Grade Point Average) represents your academic standing for a single semester or term. CGPA (Cumulative Grade Point Average) represents your overall academic standing across your entire college or school career, calculated by combining all semesters' GPAs."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">Key Differences At a Glance</h2>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Feature</th>
                    <th className="p-4">GPA</th>
                    <th className="p-4">CGPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-bold">Scope</td>
                    <td className="p-4">Single term or semester courses.</td>
                    <td className="p-4">Cumulative history of all terms.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Calculation Frequency</td>
                    <td className="p-4">At the end of each semester.</td>
                    <td className="p-4">Updated cumulatively as semesters compile.</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Impact</td>
                    <td className="p-4">Tracks immediate semester progress.</td>
                    <td className="p-4">Determines graduation honors and graduation status.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">Need to calculate?</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our dynamic calculator templates to compute your averages instantly:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/gpa-calculator" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  GPA Calculator
                </Link>
                <Link href="/cgpa-calculator" className="bg-white hover:bg-slate-50 text-amber-600 border border-amber-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  CGPA Calculator
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
