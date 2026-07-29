import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "CGPA to Percentage Formula - How to Convert CGPA to % Online",
    description: "Learn how to convert your CGPA to percentage using standard academic formulas. Explanations for 4.0, 5.0, and 10.0 grading scales.",
    alternates: {
      canonical: "https://www.snapfreetools.com/cgpa-to-percentage-formula"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "What is the standard formula to convert 4.0 GPA to percentage?",
      answer: "The standard linear formula is: Percentage = (GPA * 20) + 20. Under this, a 3.0 GPA equals 80%, and a 3.5 GPA equals 90%."
    },
    {
      question: "How do you convert 10.0 scale CGPA to percentage?",
      answer: "To convert a 10.0 scale CGPA (common in India/CBSE) to percentage, multiply the CGPA by 9.5 (Formula: Percentage = CGPA * 9.5)."
    },
    {
      question: "Why does the conversion formula differ between countries?",
      answer: "Varying academic boards define grade margins differently. US universities often use linear conversions, while Indian and European systems use proportional ratios."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  

  return (
    <>
      <JsonLd schema={faqSchema} />
      

      <CalculatorLayout
        title="CGPA to Percentage Formula"
        description="Understand the math behind translating GPA averages into percentage grades."
        currentSlug="cgpa-to-percentage-formula"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">CGPA to Percentage Formula</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              Converting your Cumulative Grade Average to a percentage is essential for university applications and government recruitment processes.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is the CGPA to percentage conversion formula?"
            answer="1. Standard 4.0 Scale (Linear Method): Percentage = (GPA * 20) + 20.\n2. Proportional Method: Percentage = (GPA / Max GPA) * 100.\n3. CBSE 10.0 Scale: Percentage = CGPA * 9.5."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">4.0 GPA Scale Conversion Chart</h2>
            <div className="overflow-x-auto border border-slate-100 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4">GPA Score (4.0 Scale)</th>
                    <th className="p-4">Linear Percentage ((GPA * 20) + 20)</th>
                    <th className="p-4">Proportional Percentage ((GPA / 4) * 100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 font-bold">4.0</td>
                    <td className="p-4">100.0%</td>
                    <td className="p-4">100.0%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">3.5</td>
                    <td className="p-4">90.0%</td>
                    <td className="p-4">87.5%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">3.0</td>
                    <td className="p-4">80.0%</td>
                    <td className="p-4">75.0%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">2.5</td>
                    <td className="p-4">70.0%</td>
                    <td className="p-4">62.5%</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">2.0</td>
                    <td className="p-4">60.0%</td>
                    <td className="p-4">50.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">Run calculations instantly!</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our automated GPA-to-Percentage converter to perform calculations on custom scales:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/gpa-to-percentage" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  GPA to Percentage
                </Link>
                <Link href="/percentage-to-gpa" className="bg-white hover:bg-slate-50 text-amber-600 border border-amber-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  Percentage to GPA
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
