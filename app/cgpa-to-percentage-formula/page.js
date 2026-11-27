import Link from "next/link";
import { JsonLd } from "@/seo/structured-data";
import CalculatorLayout from "@/features/student-hub/shared/components/CalculatorLayout";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { ArrowRight, Calculator, CheckCircle2, AlertTriangle, BookOpen, ExternalLink, GraduationCap, School } from "lucide-react";

export function generateMetadata() {
  return {
    title: "CGPA to Percentage Formula: 4.0 & 10.0 Scales Explained | SnapFreeTools",
    description: "Learn how to convert CGPA to percentage on 4.0 and 10.0 scales. Review proportional formulas, HEC guidelines, and university grading rules.",
    alternates: {
      canonical: "https://www.snapfreetools.com/cgpa-to-percentage-formula"
    }
  };
}

export default function Page() {
  // 1. Proportional Estimation Table Data (4.0 Scale: 2.0 to 4.0 in 0.1 steps, computed by code)
  const proportionalTable = Array.from({ length: 21 }, (_, i) => {
    const gpaVal = (2.0 + i * 0.1);
    const gpa = gpaVal.toFixed(1);
    const pct = (gpaVal * 25).toFixed(1);
    return { gpa, pct: `${pct}%` };
  });

  // 2. HEC Draft Policy Guidelines (Section 13.1) Course-Level Grading Table
  const hecGradeTable = [
    { grade: "A", points: "4.00", range: "85% and above", floor: "85%" },
    { grade: "A-", points: "3.66", range: "80% – 84%", floor: "80%" },
    { grade: "B+", points: "3.33", range: "75% – 79%", floor: "75%" },
    { grade: "B", points: "3.00", range: "71% – 74%", floor: "71%" },
    { grade: "B-", points: "2.66", range: "68% – 70%", floor: "68%" },
    { grade: "C+", points: "2.33", range: "64% – 67%", floor: "64%" },
    { grade: "C", points: "2.00", range: "61% – 63%", floor: "61%" },
    { grade: "C-", points: "1.66", range: "58% – 60%", floor: "58%" },
    { grade: "D+", points: "1.30", range: "54% – 57%", floor: "54%" },
    { grade: "D", points: "1.00", range: "50% – 53%", floor: "50% (Passing minimum)" },
    { grade: "F", points: "0.00", range: "Below 50%", floor: "0% (Fail)" }
  ];

  // 3. COMSATS Graduate Handbook 2024-25 (Wah Campus, Section 2.11 for Fall 2021 Onwards)
  const comsatsGradeTable = [
    { grade: "A", points: "4.00", marks: "85 & above" },
    { grade: "A-", points: "3.66", marks: "80 – 84" },
    { grade: "B+", points: "3.33", marks: "75 – 79" },
    { grade: "B", points: "3.00", marks: "71 – 74" },
    { grade: "B-", points: "2.66", marks: "68 – 70" },
    { grade: "C+", points: "2.33", marks: "64 – 67" },
    { grade: "C", points: "2.00", marks: "61 – 63" },
    { grade: "C-", points: "1.66", marks: "58 – 60" },
    { grade: "D+", points: "1.30", marks: "54 – 57" },
    { grade: "D", points: "1.00", marks: "50 – 53 (Passing grade)" },
    { grade: "F", points: "0.00", marks: "Below 50" }
  ];

  // 4. CBSE 10.0 Scale Indicative Conversion Table (Circular 24/2010: CGPA * 9.5, computed with two decimals)
  const cbseTable = Array.from({ length: 9 }, (_, i) => {
    const cgpaVal = (6.0 + i * 0.5);
    const cgpa = cgpaVal.toFixed(1);
    const pct = (cgpaVal * 9.5).toFixed(2);
    return { cgpa, pct: `${pct}%` };
  });

  // Approved FAQs incorporating all evidence-table verified facts and user revisions
  const faqs = [
    {
      question: "Does HEC Pakistan have an official formula to convert CGPA to percentage?",
      answer: "The HEC draft policy guidelines provide grade-point-to-percentage bands for course grading (under Section 13.1, mapping letter grades to percentage intervals, where a CGPA is associated with the minimum percentage of the corresponding band). However, HEC does not prescribe a universal linear mathematical formula (such as CGPA * 25). Under official HEC Notification No. 8-65/HEC/A&A/2007 (dated January 14, 2008), the HEC formally notified that it stopped converting CGPA into percentages on degree equivalence certificates because universities have differing conversion formulas. Readers should confirm current policy directly with HEC or their university."
    },
    {
      question: "What is the standard formula to convert a 4.0 CGPA to a percentage?",
      answer: "The most common mathematical estimate is the proportional formula: Percentage = (CGPA / 4.0) * 100, or simply CGPA * 25. For example, a 3.20 CGPA yields 3.20 * 25 = 80.0%. This is an informal mathematical approximation and is not an official HEC or university regulation. Always verify whether your institution provides an approved formula."
    },
    {
      question: "What does a 3.00 CGPA equal in percentage?",
      answer: "Under the informal proportional estimate (CGPA * 25), a 3.00 CGPA equals 75.0%. In contrast, under the HEC draft policy guidelines for semester examination systems (Section 13.1), a 3.00 grade point corresponds to a letter grade of B (71%–74% range), with a minimum tier value of 71%. Because individual institutions establish their own policies, confirm with your university's examination branch."
    },
    {
      question: "How do you convert a 10.0 scale CGPA to percentage?",
      answer: "For secondary school grades evaluated under the Central Board of Secondary Education (CBSE), CBSE Circular No. 24/2010 defines the indicative equivalence as: Indicative Percentage = CGPA * 9.5. For example, an 8.0 CGPA equals 8.0 * 9.5 = 76.0%. At the university level, other boards and institutions follow their own independent methods and conversion tables."
    },
    {
      question: "What is the formula Percentage = (GPA * 20) + 20 and should I use it?",
      answer: "Percentage = (GPA * 20) + 20 is an informal online heuristic designed to map a 2.0 GPA to 60% and a 4.0 GPA to 100%. It is not recognized by HEC, accredited universities, or academic boards. It is mathematically arbitrary (a 0.0 GPA calculates as 20%) and should not be treated as an official conversion."
    },
    {
      question: "What should I do if an employer or admissions portal requires a percentage?",
      answer: "Check the reverse side of your official university transcript or Detailed Marks Certificate (DMC), where universities usually print their approved grading scale. If an official percentage is required and your transcript reports only CGPA, contact your university's examination branch. Some universities, such as UET Lahore, issue an official CGPA to percentage equivalence certificate on application."
    },
    {
      question: "Do NUST and FAST publish a CGPA to percentage formula?",
      answer: "In the regulations we reviewed for NUST (Academic Rules Regarding Students, PNEC copy, 2020) and FAST-NUCES (Academic Rules and Regulations), we did not find an official CGPA to percentage conversion formula. NUST evaluates coursework using relative grading according to the distribution gap method, while FAST computes Semester and Cumulative GPAs on a continuous 0.00 to 4.00 scale. Students who require an official percentage equivalence should contact their university's examination branch."
    },
    {
      question: "Can I accurately convert my percentage back to CGPA?",
      answer: "You can compute a rough proportional estimate by dividing your percentage by 25 on a 4.0 scale (or by 9.5 on a CBSE 10.0 scale). However, an exact reverse conversion is impossible because cumulative CGPA is calculated from credit-hour-weighted course grade points across semesters, not from an aggregate percentage."
    },
    {
      question: "Where can I find my university's official conversion rules?",
      answer: "Check the reverse side or legend of your official academic transcript or Detailed Marks Certificate (DMC). Universities usually print their grading scale and grade point definitions there. If no conversion formula is provided, consult your university examination branch or registrar."
    }
  ];

  // Unified single JSON-LD @graph containing WebPage, BreadcrumbList, and FAQPage
  const singleGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/cgpa-to-percentage-formula#webpage",
        "url": "https://www.snapfreetools.com/cgpa-to-percentage-formula",
        "name": "CGPA to Percentage Formula: 4.0 & 10.0 Scales Explained | SnapFreeTools",
        "description": "Learn how to convert CGPA to percentage on 4.0 and 10.0 scales. Review proportional formulas, HEC guidelines, and university grading rules.",
        "inLanguage": "en-US",
        "dateModified": "2026-11-22",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.snapfreetools.com/#website",
          "name": "SnapFreeTools",
          "url": "https://www.snapfreetools.com"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/cgpa-to-percentage-formula#breadcrumb",
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
            "name": "CGPA to Percentage Formula",
            "item": "https://www.snapfreetools.com/cgpa-to-percentage-formula"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.snapfreetools.com/cgpa-to-percentage-formula#faq",
        "mainEntity": faqs.map(f => ({
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

  return (
    <>
      <JsonLd schema={singleGraphSchema} />

      <CalculatorLayout
        title="CGPA to Percentage Formula"
        description="Understand the math behind translating GPA averages into percentage grades."
        currentSlug="cgpa-to-percentage-formula"
        disableSchema={true}
      >
        <div className="space-y-10">
          {/* Header Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60 w-fit">
                Academic Grading Guide
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Last reviewed: 22 November 2026
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
              CGPA to Percentage Conversion Formulas &amp; Grading Guide
            </h1>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              Converting a Cumulative Grade Point Average (CGPA) to an aggregate percentage is frequently needed for government recruitment, scholarship applications, and university admissions. However, because semester systems assess courses through credit-hour weighted quality points rather than simple averages, universal mathematical conversions are estimates unless officially defined by your degree-granting institution.
            </p>
          </div>

          {/* Quick Reference Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <Calculator className="w-5 h-5 text-amber-600" />
                <span>4.0 Scale: Proportional Estimate</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-amber-100 font-mono text-base font-bold text-amber-950">
                Percentage = CGPA × 25
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Status:</strong> Informal mathematical estimate. Derived from <span className="font-mono text-xs">(CGPA / 4.0) × 100</span>. This is <em>not</em> an official HEC formula.
              </p>
            </div>

            <div className="bg-sky-50/70 border border-sky-200/80 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-sky-900 font-bold text-sm">
                <School className="w-5 h-5 text-sky-600" />
                <span>10.0 Scale: CBSE Secondary School Standard</span>
              </div>
              <div className="bg-white p-3 rounded-2xl border border-sky-100 font-mono text-base font-bold text-sky-950">
                Indicative % = CGPA × 9.5
              </div>
              <p className="text-xs text-sky-800 leading-relaxed">
                <strong>Status:</strong> Official for secondary school grading under CBSE Circular No. 24/2010. Other boards and universities set their own methods.
              </p>
            </div>
          </div>

          {/* Section 1: Core Problem */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5 text-slate-700 leading-relaxed text-sm md:text-base">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <BookOpen className="w-6 h-6 text-amber-600" />
              The Core Difference: Why CGPA and Percentage Are Not Directly Equal
            </h2>
            <p>
              In annual educational models, your aggregate percentage is calculated by summing all marks obtained across subjects and dividing by the total maximum marks. In contrast, modern semester systems operate on <strong>Credit-Weighted Quality Points</strong>:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
              CGPA = Total Quality Points Earned Across All Semesters / Total Credit Hours Attempted
            </div>
            <p>
              This structural difference creates two key complications when attempting to reverse a CGPA into a percentage:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-600 pl-1">
              <li>
                <strong>Credit Hour Weighting:</strong> A 4-credit engineering course exerts four times the mathematical weight on your CGPA as a 1-credit laboratory course, even if both were scored on the same 0–100% exam scale.
              </li>
              <li>
                <strong>Relative vs. Absolute Grading:</strong> Many institutions (such as NUST) determine course letter grades using a relative grading curve based on class distribution rather than rigid percentage brackets. In relative grading, identical raw exam scores can yield different letter grades depending on cohort performance.
              </li>
            </ul>
          </article>

          {/* Section 2: Conversion Formulas in Common Use */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm md:text-base">
            <h2 className="text-2xl font-bold text-slate-900">
              Commonly Used Conversion Formulas Explained
            </h2>
            
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800">1. Proportional Ratio Method (CGPA × 25)</h3>
              <p>
                The proportional ratio formula is the most common informal calculation used by students and evaluators on a 4.0 scale:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
                Percentage = (CGPA / Max Scale) × 100 = (CGPA / 4.0) × 100 = CGPA × 25
              </div>
              <p className="text-xs md:text-sm text-slate-600">
                <strong>Limitation:</strong> This linear proportion assumes that a 0.00 GPA equals 0% and a 2.00 GPA equals 50%. However, in the HEC draft table and the COMSATS table, a grade of D (50%–53%) is defined as the minimum passing grade for a course.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">2. Linear Offset Heuristic ((GPA × 20) + 20)</h3>
              <p>
                Certain online calculators reference the equation <span className="font-mono text-xs font-bold">(GPA × 20) + 20</span>. This formula was devised as an informal online heuristic to map a passing 2.0 GPA to 60% and a maximum 4.0 GPA to 100%:
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 font-mono text-xs md:text-sm text-slate-800">
                Percentage = (GPA × 20) + 20
              </div>
              <p className="text-xs md:text-sm text-slate-600">
                <strong>Status:</strong> This formula is an unverified online heuristic. It is not recognized or endorsed by HEC, accredited universities, or academic examination boards. At lower scores, it produces anomalous results (for instance, a failing 0.0 GPA produces 20%).
              </p>
            </div>
          </article>

          {/* Section 3: HEC Pakistan Guidelines & University Rules */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm md:text-base">
            <h2 className="text-2xl font-bold text-slate-900">
              HEC Pakistan Guidelines &amp; University Rules
            </h2>

            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>HEC Draft Policy Guidelines (Section 13.1)</span>
              </h3>
              <p>
                Under Section 13.1 of the <em>HEC draft policy guidelines for implementation of a uniform semester examination system</em> (
                <a
                  href="https://www.bnu.edu.pk/portals/HEC-Draft-Policy-Guidelines-for-Semester-Examination-System-(Final).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  view BNU-hosted draft PDF <ExternalLink className="w-3.5 h-3.5" />
                </a>
                ), the Higher Education Commission provides a standardized course-level grading matrix that maps semester exam percentages into letter grades and grade points.
              </p>
              <p className="text-xs md:text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <strong>Section 13.1 Guideline Note:</strong> The HEC draft guidelines note that when equating a CGPA in absolute or relative grading, the student is mapped to the minimum percentage of the corresponding bracket. For example, a CGPA of 3.00 maps to the lower boundary of the B grade tier (71%–74%), yielding an equivalent baseline of 71%.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>HEC Notification on Equivalence Conversion (January 14, 2008)</span>
              </h3>
              <p>
                Under official <strong>Notification No. 8-65/HEC/A&amp;A/2007 dated January 14, 2008</strong> (Higher Education Commission, Islamabad;{" "}
                <a
                  href="https://www.hec.gov.pk/english/services/students/DES/Documents/Conversion%20of%20CGPA%20in%20to%20Percentage.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-1"
                >
                  hec.gov.pk <ExternalLink className="w-3.5 h-3.5" />
                </a>
                ), the Higher Education Commission officially notified:
              </p>
              <blockquote className="border-l-4 border-amber-400 pl-4 py-1 text-slate-700 italic text-sm">
                &ldquo;...considering that the Universities both in Public and Private sectors have different formula for conversion of CGPA into percentage of marks/grades/divisions, it has been decided by the Competent Authority that... henceforth the Higher Education Commission would not carry out the job of conversion of CGPA into percentage of marks/grades/divisions.&rdquo;
              </blockquote>
              <p className="text-xs md:text-sm text-slate-600">
                The notification explains that the HEC had previously converted CGPA into percentages using an April 2003 committee formula, but discontinued this practice because universities use differing conversion formulas. Consequently, degree equivalence relies on the specific policies of the awarding university, and universities usually print their grading scale on the transcript.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">University-Specific Regulations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">NUST (Relative Grading – PNEC copy, 2020)</span>
                  <p className="text-slate-600">
                    Section 5 of the NUST Academic Rules Regarding Students (PNEC copy, 2020;{" "}
                    <a
                      href="https://pnec.nust.edu.pk/wp-content/uploads/2020/06/NUST-Academic-Rules-Regarding-Students.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      pnec.nust.edu.pk <ExternalLink className="w-3 h-3" />
                    </a>
                    ) specifies that GPA is worked out by awarding relative grading on a 4.00 scale according to the distribution gap method on the performance of a class. In the regulations we reviewed, we did not find a CGPA to percentage formula.
                  </p>
                  <Link href="/gpa-calculator/nust" className="text-amber-600 font-bold hover:underline inline-block pt-1">
                    NUST GPA Calculator &amp; Grading Scale &rarr;
                  </Link>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">FAST-NUCES (Continuous 4.00 Scale)</span>
                  <p className="text-slate-600">
                    Section 7 of the FAST-NUCES Academic Rules and Regulations (
                    <a
                      href="https://www.nu.edu.pk/Admissions/ProspectusUpload/Academic%20Rules%20and%20Regulations.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      nu.edu.pk <ExternalLink className="w-3 h-3" />
                    </a>
                    ) establishes a continuous 0.00 to 4.00 scale for Semester GPA (SGPA) and Cumulative GPA (CGPA). In the regulations we reviewed, we did not find a CGPA to percentage formula.
                  </p>
                  <Link href="/gpa-calculator/fast" className="text-amber-600 font-bold hover:underline inline-block pt-1">
                    FAST GPA Calculator &amp; Grading Scale &rarr;
                  </Link>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">COMSATS University Islamabad</span>
                  <p className="text-slate-600">
                    Section 2.11 of the COMSATS Graduate Handbook 2024-25 (Wah campus;{" "}
                    <a
                      href="https://cuiwah.edu.pk/assets/Downloads/rulesandregulations/Graduate%20Handbook-2025.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 font-semibold hover:underline inline-flex items-center gap-0.5"
                    >
                      cuiwah.edu.pk <ExternalLink className="w-3 h-3" />
                    </a>
                    ) outlines an absolute grading table for students admitted from Fall 2021 onwards (A = 85%+, B = 71–74%, D = 50–53% passing). Specific conversion criteria may differ across individual campuses.
                  </p>
                  <Link href="/gpa-calculator/comsats" className="text-amber-600 font-bold hover:underline inline-block pt-1">
                    COMSATS GPA Calculator &rarr;
                  </Link>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-900 block">UET Lahore (Official Equivalence Certificate)</span>
                  <p className="text-slate-600">
                    Some universities, such as UET Lahore, issue an official CGPA to percentage equivalence certificate on application through their Examinations Branch. Students requiring certified percentages for job portals should consult their university&apos;s examination branch.
                  </p>
                  <Link href="/gpa-calculator/uet" className="text-amber-600 font-bold hover:underline inline-block pt-1">
                    UET GPA Calculator &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </article>

          {/* Section 4: Reference Tables */}
          <article className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed text-sm md:text-base">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Conversion Reference Tables
              </h2>
              <p className="text-xs md:text-sm text-slate-500">
                Every value in the tables below is computed by code or sourced directly from the sources listed on this page.
              </p>
            </div>

            {/* Table 1: Proportional Estimate Table */}
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-slate-800">
                1. 4.0 Scale Proportional Conversion Table (CGPA × 25)
              </h3>
              <p className="text-xs text-slate-500">
                Calculated proportionally via <span className="font-mono text-xs">(CGPA / 4.0) × 100</span>. Marked as an informal mathematical estimate.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="p-3">CGPA (4.0 Scale)</th>
                      <th className="p-3">Proportional Percentage</th>
                      <th className="p-3">Calculation Step</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {proportionalTable.map((row) => (
                      <tr key={row.gpa} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{row.gpa}</td>
                        <td className="p-3 text-amber-700 font-semibold">{row.pct}</td>
                        <td className="p-3 font-mono text-slate-500 text-xs">{row.gpa} × 25</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 2: HEC Draft Policy Guidelines Section 13.1 Table */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                2. HEC Draft Policy Guidelines (Section 13.1) Course-Level Grading Table
              </h3>
              <p className="text-xs text-slate-500">
                Source: <em>HEC Draft Policy Guidelines for the Implementation of Uniform Semester Examination System in HEIs of Pakistan</em>, Section 13.1, Page 18 (
                <a
                  href="https://www.bnu.edu.pk/portals/HEC-Draft-Policy-Guidelines-for-Semester-Examination-System-(Final).pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline inline-flex items-center gap-0.5"
                >
                  BNU-hosted PDF <ExternalLink className="w-3 h-3" />
                </a>
                ).
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="p-3">Letter Grade</th>
                      <th className="p-3">Grade Points</th>
                      <th className="p-3">Percentage Range in Semester System</th>
                      <th className="p-3">Section 13.1 Minimum Tier Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {hecGradeTable.map((row) => (
                      <tr key={row.grade} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{row.grade}</td>
                        <td className="p-3 font-mono text-slate-700">{row.points}</td>
                        <td className="p-3 text-slate-700">{row.range}</td>
                        <td className="p-3 font-semibold text-emerald-700">{row.floor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 3: COMSATS Table */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                3. COMSATS Course Grading Table (Graduate Handbook 2024-25, Wah Campus)
              </h3>
              <p className="text-xs text-slate-500">
                Source: <em>COMSATS Graduate Handbook 2024-2025</em>, Section 2.11 (Page 25) for students admitted from Fall 2021 onwards (
                <a
                  href="https://cuiwah.edu.pk/assets/Downloads/rulesandregulations/Graduate%20Handbook-2025.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline inline-flex items-center gap-0.5"
                >
                  cuiwah.edu.pk Handbook PDF <ExternalLink className="w-3 h-3" />
                </a>
                ).
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="p-3">Letter Grade</th>
                      <th className="p-3">Grade Points</th>
                      <th className="p-3">Percentage Marks Obtained</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {comsatsGradeTable.map((row) => (
                      <tr key={row.grade} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{row.grade}</td>
                        <td className="p-3 font-mono text-slate-700">{row.points}</td>
                        <td className="p-3 text-slate-700">{row.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Table 4: CBSE Secondary School Table */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                4. CBSE Secondary School Indicative Conversion Table (Circular 24/2010)
              </h3>
              <p className="text-xs text-slate-500">
                Source: <em>Central Board of Secondary Education Circular No. 24/2010</em> (Indicative Percentage = CGPA × 9.5;{" "}
                <a
                  href="https://www.cbse.gov.in/circulars/cir24-2010.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-600 hover:underline inline-flex items-center gap-0.5"
                >
                  cbse.gov.in <ExternalLink className="w-3 h-3" />
                </a>
                ). Values are displayed to two decimal places.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase tracking-wider text-[11px]">
                      <th className="p-3">CBSE CGPA (10.0 Scale)</th>
                      <th className="p-3">Indicative Percentage</th>
                      <th className="p-3">Formula</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {cbseTable.map((row) => (
                      <tr key={row.cgpa} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-800">{row.cgpa}</td>
                        <td className="p-3 font-semibold text-sky-700">{row.pct}</td>
                        <td className="p-3 font-mono text-slate-500 text-xs">{row.cgpa} × 9.5</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>

          {/* Section 5: Calculator Bridge */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <Calculator className="w-7 h-7 text-amber-200" />
              <h2 className="text-2xl font-bold">Need Live Numeric Conversion?</h2>
            </div>
            <p className="text-amber-100 text-sm md:text-base leading-relaxed max-w-2xl">
              Use our dedicated, interactive student calculators to compute custom GPA scales, convert percentages into 4.0 GPAs, or calculate cumulative degree averages with semester credit weights:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/gpa-to-percentage"
                className="bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              >
                <span>GPA to Percentage Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/percentage-to-gpa"
                className="bg-amber-700/60 hover:bg-amber-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm border border-amber-400/40 flex items-center gap-1.5"
              >
                <span>Percentage to GPA Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cgpa-calculator"
                className="bg-amber-700/60 hover:bg-amber-700 text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-xl transition-all shadow-sm border border-amber-400/40 flex items-center gap-1.5"
              >
                <span>CGPA Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Section 6: Official Institutional Advice & Disclaimer Box */}
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 md:p-8 space-y-4 border border-slate-800">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base md:text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Official Institutional Advice &amp; Disclaimer</span>
            </div>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Third-party calculators and mathematical ratio formulas provide convenience estimates only. Employers, recruitment agencies, and academic admissions offices may require specific conversion criteria or an official certificate. Always check the specific job advertisement or admission requirements and review the grading legend on your official university transcript or Detailed Marks Certificate (DMC). If an official percentage is required and your transcript awards only CGPA, contact your university&apos;s examination branch to request an official equivalence certificate.
            </p>
          </div>

          {/* Sources & References Card */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Sources &amp; References
            </h3>
            <ul className="text-xs md:text-sm text-slate-600 space-y-2.5 list-disc list-inside">
              <li>
                <strong>HEC Notification No. 8-65/HEC/A&amp;A/2007 (January 14, 2008):</strong> Higher Education Commission, Islamabad (
                <a href="https://www.hec.gov.pk/english/services/students/DES/Documents/Conversion%20of%20CGPA%20in%20to%20Percentage.jpg" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  Notification Image (JPG)
                </a>
                ). Formal notification discontinuing CGPA-to-percentage conversion.
              </li>
              <li>
                <strong>HEC Draft Policy Guidelines (Section 13.1):</strong> Implementation of Uniform Semester Examination System in HEIs of Pakistan (
                <a href="https://www.bnu.edu.pk/portals/HEC-Draft-Policy-Guidelines-for-Semester-Examination-System-(Final).pdf" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  BNU-hosted draft PDF
                </a>
                ). Standardized course-level grading matrix.
              </li>
              <li>
                <strong>COMSATS Graduate Handbook 2024-2025:</strong> Section 2.11, Wah campus (
                <a href="https://cuiwah.edu.pk/assets/Downloads/rulesandregulations/Graduate%20Handbook-2025.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  cuiwah.edu.pk Handbook PDF
                </a>
                ). Course grading table for admissions from Fall 2021 onwards.
              </li>
              <li>
                <strong>CBSE Circular No. 24/2010 (May 17, 2010):</strong> Central Board of Secondary Education (
                <a href="https://www.cbse.gov.in/circulars/cir24-2010.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  Circular 24/2010 PDF
                </a>
                ). Indicative percentage formula (CGPA × 9.5) for secondary education.
              </li>
              <li>
                <strong>NUST Academic Rules Regarding Students (PNEC copy, 2020):</strong> National University of Sciences and Technology (
                <a href="https://pnec.nust.edu.pk/wp-content/uploads/2020/06/NUST-Academic-Rules-Regarding-Students.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  NUST PNEC Rules PDF
                </a>
                ). Relative grading policy (distribution gap method).
              </li>
              <li>
                <strong>FAST-NUCES Academic Rules and Regulations:</strong> National University of Computer and Emerging Sciences (
                <a href="https://www.nu.edu.pk/Admissions/ProspectusUpload/Academic%20Rules%20and%20Regulations.pdf" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline">
                  FAST Rules PDF
                </a>
                ). Continuous 0.00 to 4.00 SGPA/CGPA evaluation framework.
              </li>
            </ul>
            <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
              Last reviewed: 22 November 2026
            </div>
          </div>

          {/* Section 7: Contextual Internal Links */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base md:text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-amber-600" />
              Explore University GPA Scales &amp; Guides
            </h3>
            <p className="text-xs md:text-sm text-slate-600">
              Review specific institutional grading criteria and credit calculations across Pakistani universities:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2 text-xs font-semibold">
              <Link href="/gpa-calculator/fast" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                FAST GPA Calculator &amp; Scale
              </Link>
              <Link href="/gpa-calculator/nust" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                NUST GPA Calculator &amp; Scale
              </Link>
              <Link href="/gpa-calculator/comsats" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                COMSATS GPA Calculator
              </Link>
              <Link href="/gpa-calculator/uet" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                UET GPA Calculator
              </Link>
              <Link href="/gpa-calculator/pakistan" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                HEC Pakistan GPA Scale
              </Link>
              <Link href="/how-to-calculate-gpa" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                How to Calculate GPA
              </Link>
              <Link href="/gpa-vs-cgpa" className="p-3 bg-slate-50 hover:bg-amber-50 hover:text-amber-700 border border-slate-200 rounded-xl transition-all">
                GPA vs CGPA Guide
              </Link>
            </div>
          </div>

          {/* Section 8: FAQ Section */}
          <FAQSection faqs={faqs} />
        </div>
      </CalculatorLayout>
    </>
  );
}
