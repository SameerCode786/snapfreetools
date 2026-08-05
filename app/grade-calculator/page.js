import { generatePageMetadata } from "@/seo/metadata";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import { JsonLd } from "@/seo/structured-data";
import { GRADE_CALCULATOR_FAQS } from "@/features/calculators/student-admission/grade-calculator/content/faqs";
import GradeCalculatorFeature from "@/features/calculators/student-admission/grade-calculator";

export function generateMetadata() {
  return generatePageMetadata("grade-calculator", {
    title: "Grade Calculator | Calculate Percentage & Weighted Grades Free",
    description: "Calculate your grades, percentages, and weighted scores instantly online. Includes multiple subject and what-if simulators.",
    keywords: ["grade calculator", "calculate grade from percentage", "percentage to grade calculator", "marks to grade calculator", "letter grade calculator", "student grade calculator", "weighted grade calculator"]
  });
}

export default function Page() {
  const appSchema = getSoftwareApplicationSchema(
    "SnapFree Grade Calculator",
    "Compute weighted grades for assignments, quizzes, and exams. Calculate your marks to percentages instantly.",
    "https://www.snapfreetools.com/grade-calculator"
  );
  
  const faqSchema = getFAQSchema(GRADE_CALCULATOR_FAQS);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      <GradeCalculatorFeature faqs={GRADE_CALCULATOR_FAQS} />
      
      {/* Educational SEO Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 prose prose-slate">
        <h2 className="text-2xl font-bold text-slate-800 mt-12 mb-6">What is a Grade Calculator?</h2>
        <p className="text-slate-600 mb-6">
          A grade calculator is a tool designed to help students, teachers, and parents quickly determine academic performance. Whether you need to figure out your grade on a single assignment, track your progress across multiple subjects, or compute a complex weighted final grade, this tool handles the math for you instantly. 
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">How to Calculate Your Grade</h3>
        <p className="text-slate-600 mb-6">
          To calculate your grade manually, simply divide the marks you obtained by the total possible marks, and multiply the result by 100. This provides your percentage. For example, if you scored 85 out of 100, your percentage is 85%. You can then compare this percentage to your school's grading scale to find your letter grade.
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">How Weighted Grades Work</h3>
        <p className="text-slate-600 mb-6">
          In many classes, different assignments are worth different amounts towards your final grade. For instance, homework might be worth 20%, midterms 30%, and the final exam 50%. A weighted grade calculator multiplies your score on each assignment by its respective weight and sums them up to give you an accurate overall percentage. 
        </p>

        <h3 className="text-xl font-bold text-slate-800 mt-8 mb-4">Grade Calculator vs GPA Calculator</h3>
        <p className="text-slate-600 mb-6">
          While a grade calculator focuses on finding your percentage and letter grade for specific assignments or a single class, a GPA calculator averages your final grades across all your classes to give you a single Grade Point Average for the semester or year. SnapFreeTools offers both to ensure you have everything you need for academic success!
        </p>
      </div>
    </>
  );
}
