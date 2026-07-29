import Link from "next/link";
import { Keyboard, Layout, Maximize, RefreshCw, AlertTriangle, HelpCircle } from "lucide-react";
import { JsonLd } from "@/seo/structured-data";
import { generatePageMetadata } from "@/seo/metadata";

export function generateMetadata() {
  return generatePageMetadata("accessibility");
}

export default function Page() {
  const lastUpdated = "July 14, 2026";
  const effectiveDate = "July 14, 2026";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://www.snapfreetools.com/accessibility/#webpage",
        "url": "https://www.snapfreetools.com/accessibility",
        "name": "Accessibility Statement | SnapFreeTools",
        "description": "Read how SnapFreeTools approaches keyboard access, readable content, responsive design, assistive technology support, known limitations, and accessibility feedback.",
        "breadcrumb": {
          "@id": "https://www.snapfreetools.com/accessibility/#breadcrumb"
        },
        "dateModified": "2026-07-14T00:00:00+00:00"
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://www.snapfreetools.com/accessibility/#breadcrumb",
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
            "name": "Accessibility Statement",
            "item": "https://www.snapfreetools.com/accessibility"
          }
        ]
      }
    ]
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <JsonLd schema={schema} />
      
      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-emerald-400 font-bold uppercase tracking-widest text-xs">Accessibility</span>
          <h1 className="text-4xl md:text-5xl font-black text-white">Accessibility Statement</h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            SnapFreeTools aims to make its online tools clear, usable, and accessible across different devices and assistive technologies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
            <span>Last updated: {lastUpdated}</span>
            <span>Effective date: {effectiveDate}</span>
          </div>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700">
              <Keyboard size={14} aria-hidden="true" /> Keyboard Friendly
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700">
              <Layout size={14} aria-hidden="true" /> Clear Structure
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-300 bg-slate-800 border border-slate-700">
              <HelpCircle size={14} aria-hidden="true" /> Feedback Welcome
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 shrink-0">
              <Keyboard size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Keyboard Access</h2>
              <p className="text-xs text-slate-500 leading-relaxed">Core navigation and interactive controls are designed to support keyboard use.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 shrink-0">
              <Layout size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Readable Content</h2>
              <p className="text-xs text-slate-500 leading-relaxed">We use structured headings, clear labels, and readable contrast across the platform.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 shrink-0">
              <Maximize size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Responsive Layout</h2>
              <p className="text-xs text-slate-500 leading-relaxed">Pages and tools are designed to adapt across desktop, tablet, and mobile screens.</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-600 shrink-0">
              <RefreshCw size={20} aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1">Ongoing Improvement</h2>
              <p className="text-xs text-slate-500 leading-relaxed">We review accessibility issues and improve supported experiences over time.</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          <article className="flex-1 space-y-8">
            {/* 1. Our Accessibility Goal */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. Our Accessibility Goal</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                SnapFreeTools aims to provide practical access to tools for a broad range of users and devices. We work toward integrating accessible design principles into our utilities and calculators to ensure a comfortable experience for visitors.
              </p>
            </section>

            {/* 2. Accessibility Features */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">2. Accessibility Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Semantic HTML landmarks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Keyboard navigation support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Visible focus states where supported</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Logical heading hierarchy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Responsive layouts</span>
                  </li>
                </ul>
                <ul className="space-y-4 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Readable color contrast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Descriptive links and buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Form labels and validation messages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold" aria-hidden="true">✓</span>
                    <span>Accessible accordions and dialogs where used</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* 3. Known Limitations */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. Known Limitations</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                While we strive for a highly accessible experience, there may be some limitations:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600">
                <li>Some complex PDF or OCR output may not be fully accessible to screen readers depending on the original source document.</li>
                <li>Third-party browser extensions, ads, or external content are outside our control and may affect usability.</li>
                <li>Some older devices, legacy browsers, or custom user stylesheets may provide a different experience.</li>
                <li>Newly added tools or features may require further accessibility refinement after launch.</li>
              </ul>
            </section>

            {/* Important Notice Callout */}
            <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-6 flex gap-4">
              <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={24} aria-hidden="true" />
              <div>
                <h3 className="font-bold text-amber-900 mb-1">Accessibility is an ongoing process</h3>
                <p className="text-sm text-amber-800 leading-relaxed">
                  We aim to improve usability continuously, but no website can guarantee a completely barrier-free experience for every user, device, browser, or assistive technology.
                </p>
              </div>
            </div>

            {/* 4. Browser and Assistive Technology Support */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Browser and Assistive Technology Support</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                We work to support modern web standards. Experiences may vary across different combinations of browsers, screen readers, operating systems, and device settings. We recommend using the latest versions of modern web browsers and assistive technologies for the best experience.
              </p>
            </section>

            {/* 5. Feedback and Assistance */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. Feedback and Assistance</h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                If you encounter any accessibility barriers on our site, we want to hear from you. Please let us know about:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-600 mb-6">
                <li>Keyboard navigation issues</li>
                <li>Screen-reader problems</li>
                <li>Contrast or readability concerns</li>
                <li>Form or tool accessibility issues</li>
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link href="/contact" className="inline-flex justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-lg transition-colors">
                  Contact Us
                </Link>
                <a href="mailto:sameerwebdeveloper41@gmail.com" className="inline-flex justify-center px-5 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-bold text-sm rounded-lg transition-colors">
                  Email Support
                </a>
              </div>
            </section>

            {/* 6. Updates to This Statement */}
            <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. Updates to This Statement</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                This accessibility statement may be updated periodically as our tools, web standards, and platform features evolve. We will revise the "Last Updated" date at the top of this page when significant changes are made.
              </p>
            </section>
          </article>

          {/* Right Sidebar - Status Panel */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden lg:sticky lg:top-24">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h2 className="font-bold text-slate-900">Accessibility Status</h2>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Keyboard Navigation</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Supported across core navigation and forms</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Semantic Structure</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Used across major pages</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Responsive Layout</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Current</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Accessible Form Labels</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Current</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Screen Reader Testing</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Ongoing</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Formal Third-Party Audit</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Not currently completed</td>
                    </tr>
                    <tr>
                      <th scope="row" className="py-3 px-6 font-semibold text-slate-700 bg-white">Accessibility Certification</th>
                      <td className="py-3 px-6 text-slate-600 text-xs">Not claimed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </aside>
        </div>
        
        {/* Feedback CTA */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 md:p-12 text-center shadow-lg border border-slate-800">
          <h2 className="text-2xl font-bold text-white mb-3">Need accessibility assistance?</h2>
          <p className="text-slate-300 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
            Tell us which page or tool you were using, what issue occurred, and which device or assistive technology you use.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
            <Link 
              href="/contact" 
              className="inline-flex justify-center px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Report an Accessibility Issue &rarr;
            </Link>
            <a 
              href="mailto:sameerwebdeveloper41@gmail.com" 
              className="inline-flex justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Email Support
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
