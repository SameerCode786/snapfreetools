import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "What is GPA? Grade Point Average Explained for Students",
    description: "Learn what GPA is, the difference between weighted and unweighted scales, how letter grades map to GPA points, and why tracking your average matters.",
    alternates: {
      canonical: "https://www.snapfreetools.com/what-is-gpa"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What does GPA stand for?",
      answer: "GPA stands for Grade Point Average. It is a standard numerical representation of your academic performance over a semester or entire program of study."
    },
    {
      question: "What is the difference between weighted and unweighted GPA?",
      answer: "Unweighted GPA calculates your average on a standard 4.0 scale regardless of class rigor. Weighted GPA awards extra points (+0.5 for honors, +1.0 for AP/IB courses) to reflect course difficulty, capping at 5.0."
    },
    {
      question: "Why is tracking your GPA important?",
      answer: "GPA is used by college admissions officers, scholarship providers, honors programs, and employers to evaluate your academic consistency and qualifications."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      

      <CalculatorLayout
        title="What is GPA?"
        description="A complete guide explaining Grade Point Average, scale differences, and points mapping."
        currentSlug="what-is-gpa"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">What is GPA?</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              Grade Point Average (GPA) is the standardized metric used by schools, colleges, and global institutions to summarize your overall academic achievement.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is GPA and how is it calculated?"
            answer="GPA (Grade Point Average) is a number that represents the average value of your accumulated final grades. It is calculated by translating letter grades into numerical points (A=4, B=3, C=2, D=1, F=0), multiplying those points by course credit hours, summing them up, and dividing by total credit hours completed."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">Standard Grade Point Mapping Table</h2>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">Letter Grade</th>
                    <th className="p-4">Percentage Range</th>
                    <th className="p-4">Unweighted GPA Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-bold">A / A+</td>
                    <td className="p-4">93 - 100%</td>
                    <td className="p-4">4.0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">A-</td>
                    <td className="p-4">90 - 92%</td>
                    <td className="p-4">3.7</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B+</td>
                    <td className="p-4">87 - 89%</td>
                    <td className="p-4">3.3</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">B</td>
                    <td className="p-4">83 - 86%</td>
                    <td className="p-4">3.0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">C</td>
                    <td className="p-4">73 - 76%</td>
                    <td className="p-4">2.0</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">F</td>
                    <td className="p-4">Below 60%</td>
                    <td className="p-4">0.0</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-xl font-bold text-slate-800 pt-4">Weighted vs Unweighted GPA</h2>
            <p>
              An <strong>unweighted GPA</strong> does not take the difficulty of your classes into account. An 'A' in an advanced AP Calculus course earns the same 4.0 points as an 'A' in a standard level course. 
            </p>
            <p>
              In contrast, a <strong>weighted GPA</strong> awards extra numerical credit for honors, Advanced Placement (AP), or International Baccalaureate (IB) coursework. Typically, an A in an AP class is mapped to 5.0 points, acknowledging the increased difficulty.
            </p>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">Need to calculate your GPA?</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our interactive GPA calculators to determine your current standing:
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
