import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/seo/structured-data";
import { getSoftwareApplicationSchema, getFAQSchema } from "@/features/student-hub/utils/schemaMappers";
import GPACalculatorFeature from "@/features/student-hub/calculators/gpa";
import GeoAnswerCard from "@/features/student-hub/shared/components/GeoAnswerCard";
import { GRADE_SCALES } from "@/features/student-hub/shared/constants/gradeScales";
import { BookOpen, ExternalLink, GraduationCap } from "lucide-react";

// Dynamic configuration mapping for each university route slug
const UNIVERSITY_CONTENT = {
  fast: {
    title: "FAST GPA Calculator & Official Grading Scale | SnapFreeTools",
    h1: "FAST GPA Calculator",
    subheading: "Compute your FAST-NUCES semester GPA (SGPA) and cumulative GPA (CGPA) with the official 4.00 grade point scale.",
    description: "Calculate your FAST NUCES SGPA and CGPA using the official 4.00 grading scale (BS & BBA). Includes credit-weighted formula, warning rules, and FAQs.",
    faqs: [
      {
        question: "What is the official FAST-NUCES GPA grading scale?",
        answer: "Under Section 6 of the FAST-NUCES Academic Rules & Regulations (BS & BBA programs), letter grades map to grade points on a 4.00 scale: A+ = 4.00, A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00, B- = 2.67, C+ = 2.33, C = 2.00, C- = 1.67, D+ = 1.33, D = 1.00, and F = 0.00. MS/MBA and PhD programs use different letter-grade tables."
      },
      {
        question: "How is GPA calculated at FAST-NUCES?",
        answer: "Under Section 7 of the FAST-NUCES Academic Rules & Regulations, SGPA is the weighted average of grade points earned in a semester, where the weights are the ratio of course credit hours to total credit hours taken. For repeated courses, only the most recent grade points are used (even if they are less than earlier attempts)."
      },
      {
        question: "What is the minimum CGPA to avoid academic warning at FAST?",
        answer: "Under Section 11 of the FAST-NUCES Academic Rules & Regulations, the minimum CGPA required to avoid academic warning is 2.00 for BS/BBA programs, 2.50 for MS/MBA programs, and 3.00 for PhD programs. If the Warning Count becomes three, admission of the student in the University is closed."
      },
      {
        question: "Does FAST publish a CGPA to percentage formula?",
        answer: "In the FAST-NUCES Academic Rules and Regulations we reviewed, we did not find a CGPA to percentage conversion formula. Students needing an official percentage equivalence should contact the FAST-NUCES examination branch."
      }
    ]
  },
  nust: {
    title: "NUST GPA Calculator & Grading Scale | SnapFreeTools",
    h1: "NUST GPA Calculator",
    subheading: "Calculate your NUST semester and cumulative GPA using the 4.00 grade point scale (PNEC copy, 2020).",
    description: "Calculate your NUST SGPA and CGPA with the 4.00 grading scale (PNEC copy, 2020). Includes relative grading overview, probation rules, and FAQs.",
    faqs: [
      {
        question: "What grading scale does NUST use?",
        answer: "According to Section 4 (Academic Standards for Award of Degrees, Page 2) of the NUST Academic Rules Regarding Students (PNEC copy, 2020), course performance is graded on a 4.00 scale: A = 4.00, B+ = 3.50, B = 3.00, C+ = 2.50, C = 2.00, D+ (for UG only) = 1.50, D (for UG only) = 1.00, and F = 0.00. Always confirm current rules directly with NUST."
      },
      {
        question: "Does NUST use relative or absolute grading?",
        answer: "Under Section 5 (Academic Standards for Award of Degrees, Page 2) of the NUST Academic Rules Regarding Students (PNEC copy, 2020), Grade Point Average (GPA) is worked out by awarding relative grading on a scale of 4.00 points according to the distribution gap method on the performance of a particular class."
      },
      {
        question: "What CGPA is required to graduate at NUST?",
        answer: "Under Section 7 (Academic Standards for Award of Degrees, Page 2) of the NUST Academic Rules (PNEC copy, 2020), a student must obtain a minimum CGPA of 2.00 for Bachelors, 3.00 for Masters/MPhil, and 3.50 for PhD degrees. Always confirm current rules with NUST."
      },
      {
        question: "When is a NUST student placed on academic probation?",
        answer: "One of the conditions listed in the PNEC copy (2020) under Section 5 (Probation, Award of Bachelors' Degree and Academic Deficiencies, Page 5) is a CGPA below 2.00 for a student who does not qualify for withdrawal; this clause does not apply to the first semester. Check the full rules with NUST."
      },
      {
        question: "Does NUST publish a CGPA to percentage formula?",
        answer: "In the NUST Academic Rules Regarding Students (PNEC copy, 2020) we reviewed, we did not find a CGPA to percentage conversion formula. Contact the NUST examinations branch to confirm current equivalence policies."
      }
    ]
  },
  comsats: {
    title: "COMSATS GPA Calculator - Calculate COMSATS GPA Online",
    h1: "COMSATS GPA Calculator",
    subheading: "Calculate your COMSATS semester GPA using a preset 4.00 grading scale.",
    description: "Calculate your semester GPA for COMSATS University Islamabad using a preset 4.00 scale. Confirm your campus grading table with your examination branch.",
    faqs: [
      {
        question: "What is the COMSATS GPA scale?",
        answer: "COMSATS uses a 4.00 grading scale: A=4.0, A-=3.7, B+=3.4, B=3.0, B-=2.7, C+=2.4, C=2.0, C-=1.7, D=1.0, F=0.0. These values are used to compute your semester SGPA."
      },
      {
        question: "What CGPA is required to graduate from COMSATS?",
        answer: "A minimum Cumulative GPA of 2.00 is required to successfully qualify for graduation and degree award at COMSATS University."
      }
    ]
  },
  uet: {
    title: "UET GPA Calculator & Grading Scale | SnapFreeTools",
    h1: "UET GPA Calculator",
    subheading: "Calculate your UET Lahore semester GPA (SGPA) and cumulative GPA (CGPA) on the 4.00 grading scale (UG Prospectus 2021).",
    description: "Calculate your UET Lahore SGPA and CGPA using the 4.00 grading scale (UG Prospectus 2021). Includes repetition, probation, and graduation CGPA rules.",
    faqs: [
      {
        question: "What grading scale does UET Lahore use?",
        answer: "Under Section 10.0 (Page 169) of the UET Lahore Undergraduate Prospectus 2021, letter grades map to grade points on a 4.0 scale: A+ = 4.0, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, and F = 0. Confirm current rules directly with UET."
      },
      {
        question: "What is the minimum CGPA to graduate from UET Lahore?",
        answer: "Under Section 16.0(b) (Page 171) of the UET Lahore Undergraduate Prospectus 2021, students shall qualify for the award of undergraduate degree if they earn a minimum CGPA of 2.0 and satisfy the prescribed credit and subject completion conditions. For 18-year M.Sc./M.Phil. degrees, the PG Rules (Section 16.0(b), Page 8) specify a minimum CGPA of 2.5."
      },
      {
        question: "When is a UET student placed on academic probation?",
        answer: "Under Section 14.1 (Page 170) of the UET Lahore Undergraduate Prospectus 2021, a student will be placed on academic probation if his CGPA falls below 2.0 after any semester. Confirm current rules directly with UET."
      },
      {
        question: "How does repeating a course affect CGPA at UET Lahore?",
        answer: "Under Section 13.0(c) (Page 170) of the UET Lahore Undergraduate Prospectus 2021, in case of repetition of a subject, the new grade earned shall replace the previous grade, whether high or low in calculation of CGPA."
      }
    ]
  },
  lums: {
    title: "LUMS GPA Calculator - Calculate LUMS GPA Online Free",
    h1: "LUMS GPA Calculator",
    description: "Online GPA calculator for Lahore University of Management Sciences (LUMS) students. Calculate your GPA using the official LUMS letter-grade point system.",
    faqs: [
      {
        question: "What grading scale does LUMS use?",
        answer: "LUMS uses a standard 4.00 scale: A+=4.0, A=4.0, A-=3.7, B+=3.3, B=3.0, B-=2.7, C+=2.3, C=2.0, C-=1.7, D+=1.3, D=1.0, F=0.0. This pre-loaded scale will calculate your average instantly."
      },
      {
        question: "What is a good GPA at LUMS?",
        answer: "A GPA of 3.50 or above is considered excellent and typically qualifies undergraduate students for the Dean's Honor List at LUMS."
      }
    ]
  },
  pakistan: {
    title: "GPA Calculator Pakistan - HEC GPA Calculator Online",
    h1: "GPA Calculator Pakistan",
    description: "Calculate your academic GPA using the official Higher Education Commission (HEC) Pakistan standard grading scale online.",
    faqs: [
      {
        question: "What is the HEC GPA scale in Pakistan?",
        answer: "The Higher Education Commission (HEC) Pakistan standardized scale maps: A=4.0, A-=3.67, B+=3.33, B=3.0, B-=2.67, C+=2.33, C=2.0, C-=1.67, D+=1.30, D=1.00, F=0.00."
      },
      {
        question: "Why is HEC standard GPA important?",
        answer: "The HEC scale is used as a benchmark for equivalence certificates and national scholarship qualification processes inside Pakistan."
      }
    ]
  }
};

function buildMergedGraphSchema(slug, content, scale) {
  const pageUrl = `https://www.snapfreetools.com/gpa-calculator/${slug}`;
  const dateModified = slug === "uet" ? "2026-11-27" : "2026-11-25";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        "url": pageUrl,
        "name": content.title,
        "description": content.description,
        "inLanguage": "en-US",
        "dateModified": dateModified,
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.snapfreetools.com/#website",
          "name": "SnapFreeTools",
          "url": "https://www.snapfreetools.com"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}#app`,
        "name": content.h1,
        "applicationCategory": "EducationalApplication",
        "operatingSystem": "Web",
        "url": pageUrl,
        "description": content.description,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://www.snapfreetools.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Calculators",
            "item": "https://www.snapfreetools.com/calculators"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": content.h1,
            "item": pageUrl
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        "mainEntity": content.faqs.map(f => ({
          "@type": "Question",
          "name": f.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": f.answer
          }
        }))
      }
    ]
  };
}

function buildFastSeoContent(scale) {
  const gradeEntries = Object.entries(scale.grades);
  const fastPdfUrl = "https://www.nu.edu.pk/Admissions/ProspectusUpload/Academic%20Rules%20and%20Regulations.pdf";

  return (
    <div className="space-y-8">
      {/* Quick Answer Block */}
      <GeoAnswerCard
        question="What is the official FAST-NUCES GPA grading scale?"
        answer="Under Section 6 of the FAST-NUCES Academic Rules & Regulations (BS & BBA programs), grades map on a 4.00 scale: A+ = 4.00, A = 4.00, A- = 3.67, B+ = 3.33, B = 3.00, B- = 2.67, C+ = 2.33, C = 2.00, C- = 1.67, D+ = 1.33, D = 1.00, and F = 0.00. MS/MBA and PhD programs use different tables."
      />

      {/* Scale Table (from GRADE_SCALES.fast) */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900">
            FAST GPA Grading Scale (BS &amp; BBA Programs)
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Last reviewed: 25 November 2026
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          The table below is generated directly from the calculator&apos;s <span className="font-mono text-xs">GRADE_SCALES.fast</span> constant based on Section 6 (Page 1) of the{" "}
          <a href={fastPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1">
            FAST-NUCES Academic Rules &amp; Regulations PDF <ExternalLink className="w-3.5 h-3.5" />
          </a>.
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                <th className="p-3">Letter Grade (BS &amp; BBA)</th>
                <th className="p-3">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gradeEntries.map(([grade, pts]) => (
                <tr key={grade} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-800">{grade}</td>
                  <td className="p-3 font-mono text-amber-700 font-semibold">{pts.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Note: <strong>FA</strong> carries <strong>0.00</strong> points (<em>&ldquo;Fail (attendance shortage)&rdquo;</em>). Section 6 also states: <em>&ldquo;I and W grades are not used in computing GPA.&rdquo;</em> MS/MBA and PhD programs use different letter-grade tables under Section 6.
        </p>
      </article>

      {/* Formula & Verified Rules */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <h2 className="text-2xl font-bold text-slate-900">
          FAST SGPA &amp; CGPA Calculation Rules
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
          GPA = &Sigma; (Course Credit Hours &times; Grade Points) / &Sigma; Total Credit Hours
        </div>
        <p>
          Under Section 7 (Pages 1–2) of the FAST-NUCES Academic Rules &amp; Regulations, <em>&ldquo;SGPA is the weighted average of grade points earned in a semester. The weights are taken as the ratio of course credit hours to the total credit hours taken by the student in the semester.&rdquo;</em>
        </p>
        <ul className="space-y-2 list-disc list-inside text-slate-600 text-xs md:text-sm">
          <li>
            <strong>Repeating Courses (Section 7):</strong> <em>&ldquo;For repeat courses, only the most recent grade points are used (even if they are less than the earlier attempts).&rdquo;</em>
          </li>
          <li>
            <strong>Academic Warning / Probation (Section 11, Page 2):</strong> Minimum CGPA required to avoid academic warning is <strong>2.00</strong> (BS/BBA), <strong>2.50</strong> (MS/MBA), and <strong>3.00</strong> (PhD). <em>&ldquo;If the Warning Count becomes three, admission of the student in the University is closed.&rdquo;</em>
          </li>
        </ul>
      </article>

      {/* Sources & Internal Links */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Sources &amp; References
        </h3>
        <ul className="text-xs md:text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>
            <strong>FAST-NUCES Academic Rules &amp; Regulations (Prospectus 2026, Pages 217–218):</strong> Sections 6, 7, and 11 (
            <a href={fastPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              Official FAST Rules PDF
            </a>
            ).
          </li>
        </ul>
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href="/gpa-calculator/pakistan" className="text-amber-600 hover:underline">Pakistan University Calculators &rarr;</Link>
          <Link href="/cgpa-calculator" className="text-amber-600 hover:underline">CGPA Calculator &rarr;</Link>
          <Link href="/cgpa-to-percentage-formula" className="text-amber-600 hover:underline">CGPA to Percentage Formula &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

function buildNustSeoContent(scale) {
  const gradeEntries = Object.entries(scale.grades);
  const nustPdfUrl = "https://pnec.nust.edu.pk/wp-content/uploads/2020/06/NUST-Academic-Rules-Regarding-Students.pdf";

  return (
    <div className="space-y-8">
      {/* Quick Answer Block */}
      <GeoAnswerCard
        question="What is the NUST GPA grading scale?"
        answer="Under Section 4 (Academic Standards for Award of Degrees, Page 2) of the NUST Academic Rules Regarding Students (PNEC copy, 2020), grades map on a 4.00 scale: A = 4.00, B+ = 3.50, B = 3.00, C+ = 2.50, C = 2.00, D+ (for UG only) = 1.50, D (for UG only) = 1.00, and F = 0.00."
      />

      {/* Scale Table (from GRADE_SCALES.nust) */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900">
            NUST GPA Grading Scale (PNEC copy, 2020)
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Last reviewed: 25 November 2026
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          The table below is generated directly from the calculator&apos;s <span className="font-mono text-xs">GRADE_SCALES.nust</span> constant based on Section 4 (Academic Standards for Award of Degrees, Page 2) of the{" "}
          <a href={nustPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1">
            NUST Academic Rules Regarding Students PDF (PNEC copy, 2020) <ExternalLink className="w-3.5 h-3.5" />
          </a>. Confirm current grading rules directly with NUST.
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                <th className="p-3">Letter Grade</th>
                <th className="p-3">Grade Points</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gradeEntries.map(([grade, pts]) => (
                <tr key={grade} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-800">{grade}</td>
                  <td className="p-3 font-mono text-amber-700 font-semibold">{pts.toFixed(2)}</td>
                  <td className="p-3 text-slate-500 text-xs">
                    {grade === "D+" || grade === "D" ? "For UG only" : "Standard"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-slate-500">
          Note: Section 4 also lists <strong>XF = 0.00</strong> (<em>&ldquo;F Grade due to shortage of attendance&rdquo;</em>).
        </p>
      </article>

      {/* Formula & Verified Rules */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <h2 className="text-2xl font-bold text-slate-900">
          NUST Grading Policy, Probation &amp; Repetition Rules
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
          GPA = &Sigma; (Course Credit Hours &times; Grade Points) / &Sigma; Total Credit Hours
        </div>
        <p>
          Under Section 5 (Academic Standards for Award of Degrees, Page 2) of the NUST Academic Rules (PNEC copy, 2020), <em>&ldquo;Grade Point Average GPA will be worked out by awarding relative grading on a scale of 4.00 points according to distribution gap method on the performance of a particular class by the faculty teaching the course.&rdquo;</em>
        </p>
        <ul className="space-y-2 list-disc list-inside text-slate-600 text-xs md:text-sm">
          <li>
            <strong>Minimum CGPA for Degree Completion (Section 7, Academic Standards for Award of Degrees, Page 2):</strong> <em>&ldquo;To successfully complete the degree requirement, a student must obtain a minimum CGPA of 2.00 for Bachelors, 3.00 for Masters/MPhil, and 3.50 for PhD degree.&rdquo;</em>
          </li>
          <li>
            <strong>Academic Probation (Section 5, Award of Bachelors&apos; Degree and Academic Deficiencies, Page 5):</strong> One of the conditions listed in the PNEC copy (2020) is: <em>&ldquo;(i) His CGPA is less than 2.00, and he does not qualify for withdrawal. This clause will not be applicable to the first semester.&rdquo;</em> Check the full rules with NUST.
          </li>
          <li>
            <strong>Course Repetition (Section 8, Award of Bachelors&apos; Degree and Academic Deficiencies, Page 7):</strong> <em>&ldquo;The students&rsquo; transcript shall show both the old grade and the new earned grade, but the better grade will be used in the computation of CGPA.&rdquo;</em>
          </li>
        </ul>
      </article>

      {/* Sources & Internal Links */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Sources &amp; References
        </h3>
        <ul className="text-xs md:text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>
            <strong>NUST Academic Rules Regarding Students (PNEC copy, June 2020):</strong> Academic Standards for Award of Degrees (Sections 4, 5, 7) and Award of Bachelors&apos; Degree and Academic Deficiencies (Sections 5, 8) (
            <a href={nustPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              NUST PNEC Rules PDF
            </a>
            ). Confirm current regulations with NUST.
          </li>
        </ul>
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href="/gpa-calculator/pakistan" className="text-amber-600 hover:underline">Pakistan University Calculators &rarr;</Link>
          <Link href="/cgpa-calculator" className="text-amber-600 hover:underline">CGPA Calculator &rarr;</Link>
          <Link href="/cgpa-to-percentage-formula" className="text-amber-600 hover:underline">CGPA to Percentage Formula &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

function buildUetSeoContent(scale) {
  const gradeEntries = Object.entries(scale.grades);
  const uetUgPdfUrl = "https://www.uet.edu.pk/.galleries/Admission/UGProspectus2021.pdf";
  const uetPgPdfUrl = "https://mechanical.uet.edu.pk/wp-content/uploads/2021/12/Rules-Regulations-Relating-to-Admission-Examination-and-Discipline.pdf";

  return (
    <div className="space-y-8">
      {/* Quick Answer Block */}
      <GeoAnswerCard
        question="What grading scale does UET Lahore use?"
        answer="Under Section 10.0 (Page 169) of the UET Lahore Undergraduate Prospectus 2021, letter grades map to grade points on a 4.0 scale: A+ = 4.0, A = 4.0, A- = 3.7, B+ = 3.3, B = 3.0, B- = 2.7, C+ = 2.3, C = 2.0, C- = 1.7, D+ = 1.3, D = 1.0, and F = 0."
      />

      {/* Scale Table (from GRADE_SCALES.uet) */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="text-2xl font-bold text-slate-900">
            UET GPA Grading Scale (UG Prospectus 2021)
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            Last reviewed: 27 November 2026
          </span>
        </div>
        <p className="text-xs md:text-sm text-slate-600">
          The table below is generated directly from the calculator&apos;s <span className="font-mono text-xs">GRADE_SCALES.uet</span> constant based on Section 10.0 (Page 169) of the{" "}
          <a href={uetUgPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1">
            UET Lahore Undergraduate Prospectus 2021 PDF <ExternalLink className="w-3.5 h-3.5" />
          </a>. Confirm current grading rules directly with UET.
        </p>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs md:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                <th className="p-3">Letter Grade</th>
                <th className="p-3">Grade Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {gradeEntries.map(([grade, pts]) => (
                <tr key={grade} className="hover:bg-slate-50/50">
                  <td className="p-3 font-bold text-slate-800">{grade}</td>
                  <td className="p-3 font-mono text-amber-700 font-semibold">{pts.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>

      {/* Formula & Verified Rules */}
      <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
        <h2 className="text-2xl font-bold text-slate-900">
          UET Repetition, Probation &amp; Graduation Rules
        </h2>
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
          GPA = &Sigma; (Course Credit Hours &times; Grade Points) / &Sigma; Total Credit Hours
        </div>
        <ul className="space-y-2 list-disc list-inside text-slate-600 text-xs md:text-sm">
          <li>
            <strong>Repetition of Subjects (Section 13.0(c), UG Prospectus 2021, Page 170):</strong> <em>&ldquo;In case of repetition of a subject, the new grade earned shall replace the previous grade, whether high or low in calculation of CGPA.&rdquo;</em>
          </li>
          <li>
            <strong>Academic Probation (Section 14.1, UG Prospectus 2021, Page 170):</strong> <em>&ldquo;A student will be placed on academic probation if his CGPA falls below 2.0 after any semester.&rdquo;</em>
          </li>
          <li>
            <strong>Minimum CGPA for Degree Award (Section 16.0(b), UG Prospectus 2021, Page 171):</strong> <em>&ldquo;Students shall qualify for the award of undergraduate degree if they earn a minimum CGPA of 2.0...&rdquo;</em> (For 18-year M.Sc./Master/M.Phil. degrees, Section 16.0(b), Page 8 of the PG Rules specifies a minimum CGPA of <strong>2.5</strong>).
          </li>
        </ul>
      </article>

      {/* Sources & Internal Links */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Sources &amp; References
        </h3>
        <ul className="text-xs md:text-sm text-slate-600 space-y-2 list-disc list-inside">
          <li>
            <strong>UET Lahore Undergraduate Prospectus 2021 (Pages 169–171):</strong> Sections 10.0, 11.0, 13.0, 14.1, and 16.0 (
            <a href={uetUgPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              UET UG Prospectus 2021 PDF
            </a>
            ). Confirm current regulations with UET.
          </li>
          <li>
            <strong>UET Lahore PG Semester Regulations (Pages 7–8):</strong> Rules &amp; Regulations Relating to Admissions, Examinations &amp; Discipline (
            <a href={uetPgPdfUrl} target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
              UET PG Rules PDF
            </a>
            ).
          </li>
        </ul>
        <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-3 text-xs font-semibold">
          <Link href="/gpa-calculator/pakistan" className="text-amber-600 hover:underline">Pakistan University Calculators &rarr;</Link>
          <Link href="/cgpa-calculator" className="text-amber-600 hover:underline">CGPA Calculator &rarr;</Link>
          <Link href="/cgpa-to-percentage-formula" className="text-amber-600 hover:underline">CGPA to Percentage Formula &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

function buildComsatsNote() {
  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 text-xs md:text-sm text-amber-900 leading-relaxed">
      <strong>Note:</strong> This scale could not be verified against a university-wide COMSATS regulation. The only COMSATS table we verified is the Wah campus Graduate Handbook 2024–2025 (Fall 2021+ admissions), which uses 3.66, 3.33, 2.66, 2.33, 1.66, 1.30 and has no A+ and no D-. Students should confirm with their campus examination branch.
    </div>
  );
}

function buildLumsNote() {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 text-xs md:text-sm text-slate-700 leading-relaxed">
      <strong>Note:</strong> Scale for the LUMS Undergraduate Programme (Student Handbook 2024–2025, Section 21.2). Graduate programmes may use different scales. Confirm with LUMS.
    </div>
  );
}

function buildPakistanUniversitySelector() {
  const universities = [
    { name: "HEC Pakistan Standard", href: "/gpa-calculator/pakistan", active: true },
    { name: "FAST-NUCES", href: "/gpa-calculator/fast", active: false },
    { name: "NUST", href: "/gpa-calculator/nust", active: false },
    { name: "COMSATS", href: "/gpa-calculator/comsats", active: false },
    { name: "UET", href: "/gpa-calculator/uet", active: false }
  ];

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
        <GraduationCap className="w-4 h-4 text-amber-600" />
        <span>Select Your University Calculator</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {universities.map((u) => (
          <Link
            key={u.href}
            href={u.href}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              u.active
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200"
            }`}
          >
            {u.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

// Pre-render static pages at build time
export function generateStaticParams() {
  return [
    { slug: "fast" },
    { slug: "nust" },
    { slug: "comsats" },
    { slug: "uet" },
    { slug: "lums" },
    { slug: "pakistan" }
  ];
}

// Generate dynamic SEO metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const content = UNIVERSITY_CONTENT[slug];
  
  if (!content) return {};

  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical: `https://www.snapfreetools.com/gpa-calculator/${slug}`
    }
  };
}

export default async function Page({ params }) {
  const { slug } = await params;
  const scale = GRADE_SCALES[slug];
  const content = UNIVERSITY_CONTENT[slug];

  if (!scale || !content) {
    notFound();
  }

  const isMergedPage = slug === "fast" || slug === "nust" || slug === "uet";

  if (isMergedPage) {
    const graphSchema = buildMergedGraphSchema(slug, content, scale);
    const seoContent = slug === "fast"
      ? buildFastSeoContent(scale)
      : (slug === "nust" ? buildNustSeoContent(scale) : buildUetSeoContent(scale));

    return (
      <>
        <JsonLd schema={graphSchema} />
        <GPACalculatorFeature
          faqs={content.faqs}
          initialScale={slug}
          h1Title={content.h1}
          subheading={content.subheading}
          seoContent={seoContent}
          disableSchema={true}
        />
      </>
    );
  }

  // Unchanged schema for comsats, lums, and pakistan (comsats/lums add verification notes; pakistan adds university selector links)
  const appSchema = getSoftwareApplicationSchema(
    `${scale.name} Calculator`,
    content.description,
    `https://www.snapfreetools.com/gpa-calculator/${slug}`
  );
  const faqSchema = getFAQSchema(content.faqs);
  const topSlot = slug === "pakistan" ? buildPakistanUniversitySelector() : null;
  const noteSeoContent = slug === "comsats" ? buildComsatsNote() : (slug === "lums" ? buildLumsNote() : null);

  return (
    <>
      <JsonLd schema={appSchema} />
      <JsonLd schema={faqSchema} />
      
      {/* Dynamic Header details passed down to components */}
      <GPACalculatorFeature 
        faqs={content.faqs} 
        initialScale={slug}
        subheading={content.subheading || null}
        seoContent={noteSeoContent}
        topSlot={topSlot}
      />
    </>
  );
}
