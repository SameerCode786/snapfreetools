import React from "react";
import Link from "next/link";
import { CheckCircle, Shield, FileText, AlertTriangle, AlertCircle, Settings, Scale, Search, Server, Globe, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const SECTIONS = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "permitted-use", title: "3. Permitted Use" },
  { id: "prohibited", title: "4. Prohibited Activities" },
  { id: "browser-processing", title: "5. Browser-Based Processing" },
  { id: "file-responsibility", title: "6. File Responsibility" },
  { id: "contact-services", title: "7. Contact Services" },
  { id: "calculator-disclaimer", title: "8. Calculator Disclaimer" },
  { id: "pdf-disclaimer", title: "9. PDF Tools Disclaimer" },
  { id: "image-disclaimer", title: "10. Image Tools Disclaimer" },
  { id: "intellectual-property", title: "11. Intellectual Property" },
  { id: "availability", title: "12. Availability" },
  { id: "third-party", title: "13. Third Party Services" },
  { id: "future-features", title: "14. Future Features" },
  { id: "ai-content", title: "15. AI Generated Content" },
  { id: "limitation", title: "16. Limitation of Liability" },
  { id: "indemnification", title: "17. Indemnification" },
  { id: "governing-law", title: "18. Governing Law" },
  { id: "changes", title: "19. Changes to Terms" },
  { id: "contact-info", title: "20. Contact Information" }
];

export default function TermsFeature() {
  const currentDate = "July 18, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">
          LEGAL
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Terms of Use
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Please read these Terms carefully. They govern your access and use of the SnapFreeTools platform, including its tools, calculators, and future services.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective date: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><Scale size={16} className="text-emerald-500" /> Professional terms</span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><Shield size={16} className="text-emerald-500" /> Clear responsibilities</span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><AlertTriangle size={16} className="text-emerald-500" /> Transparent limitations</span>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Key Takeaways</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <CheckCircle className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Usage is Free</h3>
              <p className="text-sm text-slate-600 leading-relaxed">You may use our available tools freely for personal or professional purposes within reasonable limits.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <FileText className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Your Content</h3>
              <p className="text-sm text-slate-600 leading-relaxed">You remain responsible for the files you process. Ensure you have the rights to use and modify them.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <AlertTriangle className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">No Guarantees</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Tools are provided "as-is". Please independently verify important calculations and conversions.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Settings className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Future Scope</h3>
              <p className="text-sm text-slate-600 leading-relaxed">These terms outline rules for current tools as well as future features like accounts or APIs.</p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 italic">This summary is provided for convenience. The full terms below contain the complete binding agreement.</p>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Mobile/Tablet TOC (Horizontal Scroll) */}
          <nav aria-label="Terms of Use sections mobile" className="lg:hidden w-full overflow-x-auto pb-4 -mb-4 flex gap-2 snap-x">
            {SECTIONS.map((section) => (
              <Link 
                key={section.id} 
                href={`#${section.id}`}
                className="whitespace-nowrap px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-600 hover:text-emerald-600 hover:border-emerald-200 transition-colors snap-start"
              >
                {section.title}
              </Link>
            ))}
          </nav>

          {/* Desktop TOC (Sticky Sidebar) */}
          <nav aria-label="Terms of Use sections" className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
            <div className="space-y-1 border-l-2 border-slate-100 pl-4 py-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contents</h4>
              {SECTIONS.map((section) => (
                <Link 
                  key={section.id} 
                  href={`#${section.id}`}
                  className="block py-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {section.title}
                </Link>
              ))}
            </div>
          </nav>

          {/* Legal Content */}
          <article className="flex-1 bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-sm min-w-0">
            
            <section id="acceptance" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                By accessing or using SnapFreeTools ("we," "our," or "us"), you agree to be bound by these Terms of Use and our associated Privacy Policy. If you do not agree to these Terms, you may not use our services.
              </p>
            </section>

            <section id="eligibility" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Eligibility</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You must be at least 13 years old (or the legal minimum age in your jurisdiction) to use SnapFreeTools. By using our platform, you represent that you meet this requirement. If you are using the tools on behalf of an organization, you agree to these Terms on behalf of that organization.
              </p>
            </section>

            <section id="permitted-use" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Permitted Use</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools grants you a personal, non-exclusive, non-transferable right to access and use the website and its tools for their intended purpose. You may use our converters, calculators, and text utilities for personal, academic, or legitimate professional tasks.
              </p>
            </section>

            <section id="prohibited" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Prohibited Activities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">When using SnapFreeTools, you agree NOT to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Reverse-engineer, decompile, or attempt to extract the source code of our tools.</li>
                <li>Automate interactions, scrape, or programmatically access tools without our explicitly provided Public API (which is currently not available).</li>
                <li>Use the tools to process malicious software, viruses, or illegal materials.</li>
                <li>Attempt to bypass rate limits, security mechanisms, or overwhelm our hosting infrastructure.</li>
                <li>Resell, frame, or embed our tools into commercial products without permission.</li>
              </ul>
            </section>

            <section id="browser-processing" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Browser-Based Processing</h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4 text-sm text-emerald-800">
                <strong>Disclaimer:</strong> Many of our current tools perform operations entirely within your device's browser memory via JavaScript or WebAssembly. We do not guarantee that all tools will always remain local, nor do we guarantee absolute security on compromised local devices.
              </div>
            </section>

            <section id="file-responsibility" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. File Responsibility</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You maintain full ownership of any files, texts, or data you input into our tools. You are entirely responsible for ensuring you hold the necessary rights, licenses, or permissions to process those files. SnapFreeTools claims no ownership over your inputs or generated outputs.
              </p>
            </section>

            <section id="contact-services" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Contact Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                When using our contact features, you agree to provide accurate information and refrain from submitting spam, abusive language, or unauthorized promotional content. We reserve the right to ignore, delete, or block submissions that violate these terms.
              </p>
            </section>

            <section id="calculator-disclaimer" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Calculator Disclaimer</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Educational Use Only:</strong> Academic calculators (GPA, SGPA, CGPA, Merit) are provided for estimation and planning purposes. Results depend on the inputs provided and our generalized mathematical formulas. SnapFreeTools is not affiliated with any specific university or academic institution. Always verify critical academic calculations with your institution's official registrar or official scale.
              </div>
            </section>

            <section id="pdf-disclaimer" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">9. PDF Tools Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                PDF conversion and manipulation tools are provided "as-is." Complex layouts, custom fonts, heavy image layers, or password-protected files may not convert perfectly. We do not guarantee 100% fidelity to the original document structure.
              </p>
            </section>

            <section id="image-disclaimer" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">10. Image Tools Disclaimer</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Image compressors and converters apply optimization algorithms that may alter pixel data. While we aim for lossless or high-quality lossy compression, we are not liable for the degradation of artistic, professional, or critical visual assets. Always keep backups of your original files.
              </p>
            </section>

            <section id="intellectual-property" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">11. Intellectual Property</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                The SnapFreeTools brand, logos, website design, original codebases, and architectural layouts are our exclusive property. You are not granted any rights to use our trademarks, branding, or proprietary code outside of normal web usage.
              </p>
            </section>

            <section id="availability" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">12. Availability</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We aim for high availability, but we do not guarantee uninterrupted or error-free operation. We may modify, suspend, or discontinue any tool or the entire platform at any time without notice or liability.
              </p>
            </section>

            <section id="third-party" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">13. Third Party Services</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Our site may contain links to external websites, or integrate third-party services (such as future analytics or advertising providers). We do not control and are not responsible for the content, terms, or privacy practices of these third parties.
              </p>
            </section>

            <section id="future-features" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">14. Future Features</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may introduce new features such as user accounts, paid tiers, backend APIs, or server-side tools. These Terms will apply to those features unless superseded by specific supplemental terms presented at the time of their introduction.
              </p>
            </section>

            <section id="ai-content" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">15. AI Generated Content</h2>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-sm text-slate-800">
                If SnapFreeTools introduces AI-assisted tools (such as AI text summaries or generative images), you understand that AI output is probabilistic. We do not guarantee the accuracy, factual correctness, or copyright clearance of AI-generated results.
              </div>
            </section>

            <section id="limitation" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">16. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed mb-4 uppercase text-xs font-bold tracking-wider">
                To the maximum extent permitted by applicable law:
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the service; (ii) any conduct or content of any third party on the service; or (iii) unauthorized access, use, or alteration of your transmissions or content.
              </p>
            </section>

            <section id="indemnification" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">17. Indemnification</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless SnapFreeTools from and against any claims, damages, obligations, losses, liabilities, costs, or debt, and expenses arising from your use of and access to the service, or your violation of any term of these Terms.
              </p>
            </section>

            <section id="governing-law" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">18. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                These Terms shall be governed and construed in accordance with standard legal principles of fairness and equity, without regard to conflict of law provisions. Any disputes should first be attempted to be resolved informally by contacting us.
              </p>
            </section>

            <section id="changes" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">19. Changes to Terms</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We reserve the right to modify or replace these Terms at any time. Material changes will be indicated by updating the "Last updated" date. Your continued use of the platform after any such changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section id="contact-info" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">20. Contact Information</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us via our Contact Page or directly via email at sameerwebdeveloper41@gmail.com.
              </p>
            </section>

            {/* Current vs Future Services Table */}
            <section className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">Services Status & Application</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                These terms apply to all services offered by SnapFreeTools. The table below outlines the current status of features described in this document.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-4 font-bold border-b border-slate-200">Service Category</th>
                      <th className="p-4 font-bold border-b border-slate-200">Current Status</th>
                      <th className="p-4 font-bold border-b border-slate-200">Applicability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-4 font-medium text-slate-800">GPA Calculators</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Subject to Calculator Disclaimer</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Word Counter</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Subject to General Terms</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Image Compressor</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Subject to Image Tools Disclaimer</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">PDF Tools</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Subject to PDF Tools Disclaimer</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Contact Backend</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Future Terms Apply upon Activation</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google Analytics</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Subject to Third Party Services</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google AdSense</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Subject to Third Party Services</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">User Accounts</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Subject to Future Features</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Public API</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Subject to Future Features</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">AI Features</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Subject to AI Generated Content</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-12 mt-16 pt-12 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Legal Questions</h2>
              <div className="space-y-6">
                
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">1. Do I need an account to use the tools?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No, currently all tools on SnapFreeTools are available without an account or registration. Future premium or personalized features may require accounts, but our core utilities remain open.</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">2. Can I use the calculators for official university planning?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Our calculators are strict estimates meant for personal planning. You should never rely solely on our tools for critical academic decisions; always consult your official institution registrar.</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">3. Do you claim copyright on the documents I convert?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Absolutely not. You retain full copyright and ownership of all texts, PDFs, and images you process using SnapFreeTools.</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">4. Can I build a commercial app that connects to your tools?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No. We currently do not offer a Public API, and scraping or programmatically accessing our web interfaces for commercial products is prohibited under these Terms.</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">5. Are my files uploaded to a cloud server?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Many of our current utilities run directly in your web browser. However, please review our Privacy Policy and the specific tool pages, as future or complex tools may require temporary server processing.</p>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 mb-2">6. How will I know if these terms change?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">We will update the "Last Updated" date at the top of this page. For significant changes, we may also place a notice on our homepage or within the tools interface.</p>
                </div>

              </div>
            </section>

          </article>
        </div>
      </main>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <HelpCircle className="text-emerald-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-3">Still have questions?</h2>
          <p className="text-slate-300 mb-6 text-sm">
            If any part of these Terms is unclear, please reach out. We aim for transparency and are happy to clarify our policies.
          </p>
          <Link href="/contact" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
            Contact Support
          </Link>
        </div>
      </section>

    </div>
  );
}
