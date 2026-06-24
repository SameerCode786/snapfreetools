import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "How to Calculate GPA - Step-by-Step Grade Calculation Guide",
    description: "Learn how to calculate your GPA manually with this step-by-step educational guide. Formula, credit weights, and worked examples explained clearly.",
    alternates: {
      canonical: "https://snapfreetools.com/how-to-calculate-gpa"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What is the formula for calculating GPA?",
      answer: "The basic formula is: GPA = Total Grade Points Earned / Total Attempted Credit Hours. Grade points are calculated by multiplying each course grade's numerical value by its credit hours."
    },
    {
      question: "Do fail grades impact your GPA calculation?",
      answer: "Yes, an F grade yields 0.0 grade points, but the credit hours of the course are still added to your total attempted credit hours, which significantly lowers your average."
    },
    {
      question: "Are pass/fail classes included in GPA?",
      answer: "Pass/Fail (P/F) classes are typically excluded from your Grade Point Average calculations, though you still earn completion credit."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "How to Calculate GPA", url: "https://snapfreetools.com/how-to-calculate-gpa" }
  ]);

  return (
    <>
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <CalculatorLayout
        title="How to Calculate GPA"
        description="A step-by-step guide explaining how to compute semester and cumulative grade averages manually."
        currentSlug="how-to-calculate-gpa"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">How to Calculate GPA</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              Manually calculating your Grade Point Average is a simple process of multiplying grades by course weightings. Follow this guide to see how the math works.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="How do you calculate your GPA step-by-step?"
            answer="1. Identify the numerical value of your letter grades (e.g. A=4.0, B=3.0).\n2. Multiply each grade point value by the course credit hours to find the grade points for each course.\n3. Add all individual course grade points together to find your total points.\n4. Add all course credit hours together to find total credits.\n5. Divide total points by total credits (GPA = Points / Credits)."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">The Core GPA Formula</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-center">
              <code className="text-slate-800 font-mono text-base md:text-lg font-bold">
                GPA = Total Grade Points / Total Credits
              </code>
            </div>

            <h2 className="text-xl font-bold text-slate-800 pt-4">Walkthrough Example Calculation</h2>
            <p>
              Imagine a student takes the following courses in a single semester:
            </p>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Course</th>
                    <th className="p-4">Grade</th>
                    <th className="p-4">Value</th>
                    <th className="p-4">Credits</th>
                    <th className="p-4">Grade Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-bold">Math</td>
                    <td className="p-4">A (4.0)</td>
                    <td className="p-4">4.0</td>
                    <td className="p-4">4</td>
                    <td className="p-4">4.0 * 4 = 16.0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Physics</td>
                    <td className="p-4">B (3.0)</td>
                    <td className="p-4">3.0</td>
                    <td className="p-4">3</td>
                    <td className="p-4">3.0 * 3 = 9.0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">English</td>
                    <td className="p-4">A- (3.7)</td>
                    <td className="p-4">3.7</td>
                    <td className="p-4">3</td>
                    <td className="p-4">3.7 * 3 = 11.1</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-4" colSpan="3">Total Accumulations:</td>
                    <td className="p-4">10 Credits</td>
                    <td className="p-4">36.1 Points</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              Dividing the total points by total credits:
              <br />
              <strong>GPA = 36.1 / 10 = 3.61</strong>.
            </p>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">Skip the manual math!</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Input your classes directly into our automated system to calculate your term averages instantly:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/gpa-calculator" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  GPA Calculator
                </Link>
                <Link href="/sgpa-calculator" className="bg-white hover:bg-slate-50 text-amber-600 border border-amber-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  SGPA Calculator
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
