import React from "react";
import Link from "next/link";
import { CheckCircle, Shield, FileText, BarChart, Bell, Settings, Lock, Server, Globe, HelpCircle } from "lucide-react";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction & Scope" },
  { id: "information-provided", title: "2. Information Users Provide" },
  { id: "tool-processing", title: "3. Tool and File Processing" },
  { id: "automatic-information", title: "4. Information Collected Automatically" },
  { id: "cookies", title: "5. Cookies and Similar Technologies" },
  { id: "analytics", title: "6. Google Analytics" },
  { id: "advertising", title: "7. Advertising and Google AdSense" },
  { id: "consent", title: "8. Consent and Cookie Preferences" },
  { id: "data-use", title: "9. How Information is Used" },
  { id: "legal-bases", title: "10. Legal Bases" },
  { id: "sharing", title: "11. Sharing and Service Providers" },
  { id: "retention", title: "12. Data Retention" },
  { id: "security", title: "13. Security" },
  { id: "international", title: "14. International Processing" },
  { id: "user-rights", title: "15. User Rights" },
  { id: "children", title: "16. Children's Privacy" },
  { id: "external-links", title: "17. External Links" },
  { id: "changes", title: "18. Policy Changes" },
  { id: "services-table", title: "19. Current vs Future Services Table" }
];

export default function PrivacyPolicyFeature() {
  const currentDate = "July 18, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">
          PRIVACY & DATA
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          This Privacy Policy explains what information SnapFreeTools may process, why it is used, how long it may be retained, and the choices available to users.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective date: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><Shield size={16} className="text-emerald-500" /> Clear data practices</span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><Server size={16} className="text-emerald-500" /> Browser-side processing where supported</span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><BarChart size={16} className="text-emerald-500" /> Advertising transparency</span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm"><Settings size={16} className="text-emerald-500" /> User choices</span>
        </div>
      </section>

      {/* Privacy Summary */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Privacy Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Settings className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Tool processing</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Many tools process information directly in the browser. Processing behavior varies by tool and is explained on individual tool pages.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <FileText className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Contact messages</h3>
              <p className="text-sm text-slate-600 leading-relaxed">When users contact SnapFreeTools, their name, email address, subject, category and message may be processed to review and respond.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <BarChart className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Analytics and technical data</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Basic technical, usage and analytics data may be processed to operate, secure and improve the website.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Globe className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Advertising</h3>
              <p className="text-sm text-slate-600 leading-relaxed">The website may display advertisements and may use Google AdSense or other advertising providers, subject to user consent where legally required.</p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 italic">This summary is provided for convenience. The full policy below contains the complete details.</p>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Mobile/Tablet TOC (Horizontal Scroll) */}
          <nav aria-label="Privacy Policy sections mobile" className="lg:hidden w-full overflow-x-auto pb-4 -mb-4 flex gap-2 snap-x">
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
          <nav aria-label="Privacy Policy sections" className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
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
            
            <section id="introduction" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Introduction & Scope</h2>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">Introduction</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools provides online PDF, calculator, image, text and productivity tools.
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">Scope</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                This policy applies to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>The SnapFreeTools website</li>
                <li>Tool pages</li>
                <li>Contact forms</li>
                <li>Future accounts where introduced</li>
                <li>Analytics and advertising technologies used on the site</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                External websites linked from SnapFreeTools have their own policies. SnapFreeTools is not responsible for the privacy practices or content of third-party websites.
              </p>
            </section>

            <section id="information-provided" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. Information Users Provide</h2>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">A. Contact form data</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                When the contact backend is active, information submitted via the contact form may include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Full name</li>
                <li>Email address</li>
                <li>Subject</li>
                <li>Selected category</li>
                <li>Message</li>
                <li>Privacy acknowledgement</li>
                <li>Technical anti-spam signals</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-4">
                This information is processed for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Responding to questions</li>
                <li>Investigating bugs</li>
                <li>Reviewing feature suggestions</li>
                <li>Handling advertising or partnership inquiries</li>
                <li>Handling privacy, accessibility or legal requests</li>
                <li>Preventing abuse</li>
              </ul>
              <p className="text-slate-600 leading-relaxed mb-4">
                The contact form backend is currently active. Submitted name, email, subject, category, and message are sent to the backend. Data is validated and used for responding to requests. The message is delivered by the configured email provider. Contact data may remain in the sender/receiver email account according to account retention settings.
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">B. Email communications</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Direct emails sent to us are retained by our email provider and inbox until deleted according to operational needs.
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">C. Future account data <span className="inline-block ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium align-middle">Conditional</span></h3>
              <p className="text-slate-600 leading-relaxed">
                If account features are introduced, this policy will be updated before account-related personal information is collected.
              </p>
            </section>

            <section id="tool-processing" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Tool and File Processing</h2>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">A. Browser-side tools</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Many current tools process content in browser memory on the user’s device. Examples may include the Word Counter, Image Compressor, Calculators, and PDF to Word converters (where currently implemented locally).
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Files or values may remain in temporary browser memory during processing.</li>
                <li>Downloaded outputs are saved by the user’s browser.</li>
                <li>Browser storage may retain preferences where implemented.</li>
                <li>Closing or refreshing the page usually clears transient state, but browser behavior may vary.</li>
              </ul>
              
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">B. Tool-specific differences</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Processing behavior may differ between tools. Any future server-side tool must disclose upload, processing, deletion and retention behavior on its page and in this policy. Users should review tool-specific notices.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">C. OCR processing</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                The current PDF OCR feature uses local browser-side OCR where verified. We do not guarantee perfect accuracy, zero memory usage, all-language OCR, or no temporary browser caching under all circumstances.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">D. Future server-side processing <span className="inline-block ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium align-middle">Conditional</span></h3>
              <p className="text-slate-600 leading-relaxed">
                If SnapFreeTools later introduces server-side conversions, this policy and the relevant tool page will be updated before launch to explain transfer, storage, providers and deletion periods.
              </p>
            </section>

            <section id="automatic-information" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">4. Information Collected Automatically</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Web hosting, security, analytics and advertising systems may process technical information such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>IP address <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Currently active (Hosting/Security)</span></li>
                <li>Browser type <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Currently active</span></li>
                <li>Device type <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Currently active</span></li>
                <li>Operating system <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Currently active</span></li>
                <li>Referring page <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
                <li>Pages viewed <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
                <li>Approximate timestamps <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Currently active</span></li>
                <li>Error and performance data <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
                <li>Cookie or consent identifiers <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
                <li>General geographic region derived from IP where used <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
                <li>Advertising interaction data where advertising is active <span className="text-xs ml-2 px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded">Planned</span></li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                The exact data depends on enabled providers at the time of access.
              </p>
            </section>

            <section id="cookies" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Cookies and Similar Technologies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We may use cookies and similar technologies (like <code className="text-sm bg-slate-100 px-1 rounded">localStorage</code> or <code className="text-sm bg-slate-100 px-1 rounded">sessionStorage</code>) for several purposes:
              </p>
              
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">A. Strictly necessary technologies</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Used for security, consent choices, session stability, and load balancing where applicable.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">B. Preference storage</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Used for remembering tool settings, compression options, UI preferences, and consent selections. This is commonly stored in your browser&apos;s local storage.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">C. Analytics technologies <span className="inline-block ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium align-middle">Planned</span></h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Used for aggregated usage and performance measurement.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">D. Advertising technologies <span className="inline-block ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded font-medium align-middle">Planned</span></h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Used for ad delivery, frequency limiting, fraud prevention, aggregated reporting, and personalized advertising where permitted and consented.
              </p>

              <p className="text-slate-600 leading-relaxed">
                For more details, please review our <Link href="/cookie-policy" className="text-emerald-600 hover:underline font-medium">Cookie Policy</Link>.
              </p>
              {/* Future-ready placeholder for CMP invocation - NOT rendered as an active fake button */}

            </section>

            <section id="analytics" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Google Analytics</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-800">
                <strong>Status:</strong> SnapFreeTools may use analytics services such as Google Analytics in the future. This policy and consent controls will be updated when such services are activated.
              </div>
            </section>

            <section id="advertising" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Advertising and Google AdSense</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools may display advertisements to support free access to its tools.
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Google and other third-party advertising vendors may use cookies or similar technologies to serve and measure ads.</li>
                <li>Advertising technologies may support ad delivery, frequency capping, aggregated reporting, fraud prevention and, where allowed, personalized advertising.</li>
                <li>Personalized advertising may be based on visits to this or other websites.</li>
                <li>Non-personalized ads may still use cookies or identifiers for limited purposes such as frequency capping, reporting and fraud prevention.</li>
                <li>Where legally required, advertising cookies or identifiers will not be activated until appropriate consent is obtained.</li>
                <li>Users may be offered controls to accept, reject or manage advertising preferences when the consent system is implemented.</li>
                <li>Users can also manage advertising choices through relevant provider controls.</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Please review our <Link href="/advertising-disclosure" className="text-emerald-600 hover:underline font-medium">Advertising Disclosure</Link> and <Link href="/cookie-policy" className="text-emerald-600 hover:underline font-medium">Cookie Policy</Link> for additional details once these systems become active.
              </p>
            </section>

            <section id="consent" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Consent and Cookie Preferences</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Consent may be requested for analytics or advertising where required by law. Necessary technologies may operate without optional consent where legally permitted. Users should be able to withdraw or update consent as easily as it was given.
              </p>
              <p className="text-slate-600 leading-relaxed">
                A first-party consent interface is currently active to capture and securely store your privacy preferences in your browser's local storage. You can manage these preferences at any time using the "Cookie Settings" control in the website footer.
              </p>
            </section>

            <section id="data-use" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">9. How Information is Used</h2>
              <p className="text-slate-600 leading-relaxed mb-4">Information is utilized to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600">
                <li>Provide tool functionality</li>
                <li>Generate user-requested results</li>
                <li>Respond to contact messages</li>
                <li>Maintain security</li>
                <li>Prevent spam, fraud and abuse</li>
                <li>Diagnose technical errors</li>
                <li>Improve usability and performance</li>
                <li>Measure website usage where analytics is enabled</li>
                <li>Display and measure ads where advertising is enabled</li>
                <li>Meet legal obligations</li>
                <li>Enforce Terms of Use</li>
              </ul>
            </section>

            <section id="legal-bases" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">10. Legal Bases</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Depending on the user’s location and the processing activity, SnapFreeTools may rely on one or more lawful grounds. Potential bases include:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li><strong>Consent</strong> (which can be withdrawn where processing relies on consent)</li>
                <li><strong>Performance of a requested service</strong></li>
                <li><strong>Legitimate interests</strong> in operating, improving and securing the platform</li>
                <li><strong>Compliance with legal obligations</strong></li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                The applicable basis depends on context. Legitimate interests do not override user rights.
              </p>
            </section>

            <section id="sharing" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">11. Sharing and Service Providers</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Information may be processed by providers used to operate the site, such as:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Hosting providers</li>
                <li>Email providers</li>
                <li>Security and anti-abuse providers</li>
                <li>Analytics providers where enabled</li>
                <li>Advertising providers where enabled</li>
                <li>Consent management providers where enabled</li>
                <li>Professional advisers where necessary</li>
                <li>Authorities where legally required</li>
              </ul>
              <p className="text-slate-600 leading-relaxed">
                Personal information is not sold as a standalone product. Advertising providers may process data under their own policies. Providers receive only information reasonably required for their role.
              </p>
            </section>

            <section id="retention" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">12. Data Retention</h2>
              
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">A. Browser-processed tool content</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Generally retained only in browser memory for the processing session unless the user downloads or the browser stores preferences.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">B. Contact messages</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Retained in the receiving email inbox for as long as reasonably needed to respond, maintain records, prevent abuse or meet legal obligations.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">C. Security logs</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Hosting/security providers may retain limited logs according to their settings and policies.
              </p>

              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">D. Analytics and advertising</h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Retention depends on configured provider settings and user consent.
              </p>

              <p className="text-slate-600 leading-relaxed font-medium">
                Retention periods will be reviewed and unnecessary information will be deleted or anonymized where reasonably possible.
              </p>
            </section>

            <section id="security" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">13. Security</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement reasonable safeguards to protect information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>HTTPS in production</li>
                <li>Server-side validation for contact requests when backend is active</li>
                <li>Rate limiting and spam protection</li>
                <li>Restricted credential access</li>
                <li>Environment-variable secret management</li>
                <li>Dependency updates</li>
                <li>Minimal data collection</li>
                <li>Browser-side processing where appropriate</li>
              </ul>
              <p className="text-slate-600 leading-relaxed font-medium text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-100">
                No online service can guarantee complete security.
              </p>
            </section>

            <section id="international" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">14. International Processing</h2>
              <p className="text-slate-600 leading-relaxed">
                Service providers may process information in countries different from the user’s country. Appropriate safeguards will be used where legally required.
              </p>
            </section>

            <section id="user-rights" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">15. User Rights</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Rights vary by location and may include: Access, Correction, Deletion, Restriction, Objection, Portability, Withdrawal of consent, and the right to complain to a relevant data protection authority.
              </p>
              <h3 className="text-lg font-bold text-slate-800 mt-6 mb-2">How to submit a request:</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 mb-4">
                <li>Use our <Link href="/contact" className="text-emerald-600 hover:underline">Contact page</Link></li>
                <li>Email us at: <a href="mailto:sameerwebdeveloper41@gmail.com" className="text-emerald-600 hover:underline">sameerwebdeveloper41@gmail.com</a></li>
              </ul>
              <p className="text-slate-600 leading-relaxed text-sm">
                Identity verification may be required. Some requests may be limited by legal or operational obligations. Responses will be handled within applicable legal timeframes.
              </p>
            </section>

            <section id="children" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">16. Children&apos;s Privacy</h2>
              <p className="text-slate-600 leading-relaxed">
                SnapFreeTools is a general productivity platform. It is not intentionally designed to collect personal information from children. Users should avoid submitting unnecessary personal information. A parent or guardian may contact SnapFreeTools regarding a child’s information.
              </p>
            </section>

            <section id="external-links" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">17. External Links</h2>
              <p className="text-slate-600 leading-relaxed">
                Links to third-party websites may be provided. Third parties control their own privacy practices. Users should review third-party policies. SnapFreeTools is not responsible for external-site privacy practices.
              </p>
            </section>

            <section id="changes" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">18. Policy Changes</h2>
              <p className="text-slate-600 leading-relaxed">
                The policy may be updated as tools, accounts, analytics, ads or legal requirements change. The &quot;Last updated&quot; date will be revised. Material changes may be highlighted through the website where appropriate.
              </p>
            </section>

            {/* Current vs Future Services Table */}
            <section id="services-table" className="mb-16 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">19. Current vs Future Services</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-4 font-bold border-b border-slate-200">Service</th>
                      <th className="p-4 font-bold border-b border-slate-200">Current Status</th>
                      <th className="p-4 font-bold border-b border-slate-200">Privacy Treatment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Browser-based calculators</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Values processed in browser memory</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Word Counter</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Text processed locally in browser</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Image Compressor</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Images processed locally in browser where verified</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">PDF to Word and local OCR</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">PDF and OCR processing occurs locally in browser where verified</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Contact form backend</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Validates contact submissions and sends them to the configured support email.</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google Analytics</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Pending activation and consent management</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google AdSense</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Pending activation and consent management</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">User accounts</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not currently available</span></td>
                      <td className="p-4">Pending future implementation</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Contact Card */}
            <section className="bg-slate-900 text-white rounded-2xl p-8 mt-12">
              <div className="flex items-start gap-4">
                <HelpCircle className="text-emerald-400 shrink-0 mt-1" size={32} />
                <div>
                  <h2 className="text-xl font-bold mb-2">Questions about your privacy?</h2>
                  <p className="text-slate-300 mb-6 text-sm">
                    Contact SnapFreeTools to ask about this policy or request help with your information. Do not send passwords, financial information, government identification or sensitive documents by email.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/contact" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-center text-sm">
                      Contact form
                    </Link>
                    <a href="mailto:sameerwebdeveloper41@gmail.com" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-colors text-center text-sm">
                      Email us
                    </a>
                  </div>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>

      <div className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <p className="text-xs text-slate-400">
          This Privacy Policy is intended to explain SnapFreeTools’ data practices in clear language. It does not constitute legal advice.
        </p>
      </div>

    </div>
  );
}
