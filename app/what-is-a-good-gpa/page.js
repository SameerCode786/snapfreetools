import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import { getFAQSchema, getBreadcrumbSchema } from "@/features/student-hub/utils/schemaMappers";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";

export function generateMetadata() {
  return {
    title: "What is a Good GPA in College and High School?",
    description: "Discover what is considered a good GPA for college admissions, high school rankings, honors societies, graduate applications, and employment.",
    alternates: {
      canonical: "https://snapfreetools.com/what-is-a-good-gpa"
    }
  };
}

export default function Page() {
  const faqs = [
    {
      question: "Is a 3.0 GPA considered good?",
      answer: "Yes, a 3.0 GPA represents a 'B' average and is generally considered good. It meets the minimum admission criteria for many standard colleges and university degree paths."
    },
    {
      question: "What GPA is typically required for Ivy League admissions?",
      answer: "Ivy League and highly competitive colleges generally expect applicants to have a GPA of 3.80 or above unweighted, alongside rigorous course selections."
    },
    {
      question: "Can a good GPA help you win academic scholarships?",
      answer: "Yes, merit-based scholarships often require a minimum cumulative GPA of 3.20 to 3.50 to qualify and maintain funding eligibility."
    }
  ];

  const faqSchema = getFAQSchema(faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://snapfreetools.com" },
    { name: "Calculators", url: "https://snapfreetools.com/calculators" },
    { name: "What is a Good GPA?", url: "https://snapfreetools.com/what-is-a-good-gpa" }
  ]);

  return (
    <>
      <JsonLd schema={faqSchema} />
      <JsonLd schema={breadcrumbSchema} />

      <CalculatorLayout
        title="What is a Good GPA?"
        description="A comprehensive guide evaluating average grade expectations across academic levels."
        currentSlug="what-is-a-good-gpa"
      >
        <div className="space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h1 className="text-3xl font-black text-slate-900 leading-tight">What is a Good GPA?</h1>
            <p className="text-slate-600 text-sm font-semibold leading-relaxed">
              Evaluating what counts as a 'good' GPA depends on your academic tier, target universities, and future professional goals.
            </p>
          </div>

          {/* GEO Card */}
          <GeoAnswerCard
            question="What is considered a good GPA in high school and college?"
            answer="In high school, a good GPA is generally a 3.0 (B average) or higher, while a 3.5+ is excellent for college applications. In college, maintaining a 3.0+ is good for career paths, but a 3.5+ is typically required for graduate school, law school, or medical programs."
          />

          {/* Main Content Article */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-600 leading-relaxed font-medium text-sm md:text-base">
            <h2 className="text-xl font-bold text-slate-800">GPA Benchmarks & Tier Guide</h2>
            <div className="space-y-4 text-slate-700">
              <p>
                Here is a breakdown of how grade averages are evaluated across standard applications:
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li>
                  <strong>GPA 3.7 - 4.0 (A average)</strong>: Excellent. Qualifies for top-tier university entrance, selective scholarships, and honors distinction list.
                </li>
                <li>
                  <strong>GPA 3.3 - 3.6 (B+ average)</strong>: Very Good. Strong standing for competitive state colleges and regular graduate programs.
                </li>
                <li>
                  <strong>GPA 3.0 - 3.2 (B average)</strong>: Good. Meets baseline eligibility for average universities and most professional internship tracks.
                </li>
                <li>
                  <strong>GPA Below 2.0 (C/D average)</strong>: Low. May trigger academic probation warnings.
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 space-y-3 mt-6">
              <h3 className="font-bold text-amber-900">Want to raise your current average?</h3>
              <p className="text-amber-800 text-xs md:text-sm font-semibold">
                Use our dynamic Required GPA calculator to plan exactly what term averages you must achieve to reach your target:
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/required-gpa-calculator" className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  Required GPA Calculator
                </Link>
                <Link href="/gpa-calculator" className="bg-white hover:bg-slate-50 text-amber-600 border border-amber-200 font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm">
                  GPA Calculator
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
