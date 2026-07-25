import React from "react";
import Link from "next/link";
import { CheckCircle, Server, BarChart3, Settings, HelpCircle, ArrowLeft, Cookie, Shield, Database, LayoutTemplate } from "lucide-react";

const SECTIONS = [
  { id: "introduction", title: "1. Introduction" },
  { id: "what-cookies-are", title: "2. What Cookies Are" },
  { id: "storage-distinction", title: "3. Cookies vs Other Storage" },
  { id: "technology-status", title: "4. Current Technology Status" },
  { id: "strictly-necessary", title: "5. Strictly Necessary Technologies" },
  { id: "preferences", title: "6. Preference Storage" },
  { id: "analytics", title: "7. Analytics Technologies" },
  { id: "advertising", title: "8. Advertising & Google AdSense" },
  { id: "cmp", title: "9. Consent Management Platform" },
  { id: "consent-mode", title: "10. Google Consent Mode" },
  { id: "cookie-categories", title: "11. Cookie Categories" },
  { id: "session-persistent", title: "12. Session & Persistent Storage" },
  { id: "third-parties", title: "13. Third-Party Providers" },
  { id: "user-controls", title: "14. User Cookie Controls" },
  { id: "browser-settings", title: "15. Browser-Specific Controls" },
  { id: "gpc-dnt", title: "16. GPC & Do Not Track" },
  { id: "children", title: "17. Children and Cookies" },
  { id: "data-sharing", title: "18. Data Sharing Through Cookies" },
  { id: "retention", title: "19. Retention" },
  { id: "changes", title: "20. Policy Changes" }
];

export default function CookiePolicyFeature() {
  const currentDate = "July 19, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">
          COOKIES & STORAGE
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Cookie Policy
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          This Cookie Policy explains how SnapFreeTools currently uses browser storage and how cookies, analytics, advertising technologies, and consent controls may be used in the future.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective date: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Database size={16} className="text-emerald-500" /> Current storage practices
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Shield size={16} className="text-emerald-500" /> Clear user choices
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <LayoutTemplate size={16} className="text-emerald-500" /> Advertising transparency
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Settings size={16} className="text-emerald-500" /> Future consent controls
          </span>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Summary of Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Cookie className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Current Status</h3>
              <p className="text-sm text-slate-600 leading-relaxed">SnapFreeTools does not currently set first-party tracking cookies on your device.</p>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <Database className="text-emerald-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Browser Storage</h3>
              <p className="text-sm text-slate-600 leading-relaxed">We utilize temporary browser memory and caching exclusively for core utility processing.</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <BarChart3 className="text-amber-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Analytics</h3>
              <p className="text-sm text-amber-800 font-medium">Planned</p>
              <p className="text-sm text-amber-700 leading-relaxed mt-1">Analytics will be introduced in the future to monitor errors and usage trends.</p>
            </div>
            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
              <Server className="text-amber-600 mb-4" size={24} />
              <h3 className="font-bold text-slate-900 mb-2">Advertising</h3>
              <p className="text-sm text-amber-800 font-medium">Planned</p>
              <p className="text-sm text-amber-700 leading-relaxed mt-1">AdSense and required consent management systems are not currently active.</p>
            </div>
          </div>
          <p className="text-center text-sm text-slate-500 italic">This summary is provided for convenience. The detailed policy below controls.</p>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Mobile/Tablet TOC (Horizontal Scroll) */}
          <nav aria-label="Cookie Policy sections mobile" className="lg:hidden w-full overflow-x-auto pb-4 -mb-4 flex gap-2 snap-x">
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
          <nav aria-label="Cookie Policy sections" className="hidden lg:block w-72 shrink-0 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">1. Introduction</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools provides online calculators, PDF tools, text tools, image utilities, and related services. This Cookie Policy supplements our <Link href="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</Link> and covers how we handle cookies, local storage, session storage, IndexedDB, similar browser identifiers, analytics, advertising, and consent records.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Third-party websites or services linked from our platform follow their own independent cookie policies.
              </p>
            </section>

            <section id="what-cookies-are" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">2. What Cookies Are</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Cookies are small text records stored by a web browser on your device when you visit a website. They may be "session cookies" (which expire when you close your browser) or "persistent cookies" (which remain until deleted or expired). First-party cookies are set by the website being visited, while third-party cookies may be set by external services embedded on the site.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Cookies may be used to remember preferences, support security, measure usage, or enable advertising. A cookie alone does not necessarily directly identify you as an individual.
              </p>
            </section>

            <section id="storage-distinction" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">3. Cookies vs Other Browser Storage</h2>
              <p className="text-slate-600 leading-relaxed mb-4">It is important to distinguish cookies from other types of browser memory:</p>
              <ul className="list-disc pl-6 space-y-3 text-slate-600 mb-4">
                <li><strong>Cookies:</strong> Sent automatically with relevant web requests to the server.</li>
                <li><strong>localStorage:</strong> Data stored locally in the browser that usually remains until cleared, and is not automatically sent with every request.</li>
                <li><strong>sessionStorage:</strong> Local browser data that usually remains only for the duration of the browser-tab session.</li>
                <li><strong>IndexedDB:</strong> A local database system for storing larger structured data (if utilized).</li>
                <li><strong>Temporary Browser Memory:</strong> Exists only while a page or tool is active in your RAM and is purged immediately when closed. <em>This is not a cookie.</em></li>
                <li><strong>Browser Cache:</strong> Stores static assets (like images or styles) to improve performance, but is not necessarily used to track users.</li>
              </ul>
            </section>

            {/* Status Table */}
            <section id="technology-status" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">4. Current Technology Status</h2>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm">
                The following table represents the verified active state of storage and tracking technologies on SnapFreeTools as of the Effective Date.
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-4 font-bold border-b border-slate-200">Technology</th>
                      <th className="p-4 font-bold border-b border-slate-200">Status</th>
                      <th className="p-4 font-bold border-b border-slate-200">Current Use</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-4 font-medium text-slate-800">First-party cookies</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not currently used</span></td>
                      <td className="p-4">None active in current implementation</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">localStorage</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Stores your privacy consent choices (snapfreetools_cookie_consent)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">sessionStorage</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not currently used</span></td>
                      <td className="p-4">None active in current implementation</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Temporary browser memory</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Client-side tools processing (PDFs, Image, Word Counting)</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Essential hosting logs</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">Vercel standard infrastructure routing & security</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google Analytics</td>
                      <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Future integration for traffic monitoring</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Google AdSense</td>
                      <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Planned</span></td>
                      <td className="p-4">Future integration for monetization</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Consent Management Platform</td>
                      <td className="p-4"><span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">Current</span></td>
                      <td className="p-4">First-party consent interface is active</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">User account sessions</td>
                      <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not currently available</span></td>
                      <td className="p-4">N/A</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="strictly-necessary" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">5. Strictly Necessary Technologies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Strictly necessary technologies support security, request routing, server stability, consent choices, and abuse prevention. SnapFreeTools does not currently rely on a user-account session cookie or any first-party necessary cookies. However, our hosting infrastructure provider processes limited, temporary request information necessary to deliver and protect the website globally.
              </p>
            </section>

            <section id="preferences" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">6. Preference Storage</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We currently store your cookie consent choices in a <code className="bg-slate-100 px-1 py-0.5 rounded text-sm">localStorage</code> record. Future updates may allow you to save tool settings, compression quality targets, or UI themes here as well. Users can remove these at any time by clearing their browser's site data or interacting with the Cookie Settings control. Clearing this storage will reset your consent preferences and require you to choose again.
              </p>
            </section>

            <section id="analytics" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">7. Analytics Technologies</h2>
              <p className="text-slate-600 leading-relaxed mb-4 font-medium">
                SnapFreeTools does not currently have an active Google Analytics or similar analytics script in the inspected frontend code.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Analytics may be introduced later to understand page usage, performance, and errors. Future analytics systems may process page views, device/browser type, referrers, approximate regions, interaction events, and consent states. Consent will be requested where legally required, and this policy will be updated immediately upon activation.
              </p>
            </section>

            <section id="advertising" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">8. Advertising and Google AdSense</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 text-sm text-amber-900">
                <strong>Status:</strong> SnapFreeTools plans to display advertising to support free access. Google AdSense or another provider may be used in the future. These scripts are not currently active.
              </div>
              <p className="text-slate-600 leading-relaxed mb-4">
                When activated, Google and third-party vendors may use cookies or similar technologies to serve, measure, limit frequency, and protect ads. Advertising data may include page context, device/browser information, IP-derived region, consent signals, and ad interactions.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Personalized ads may use prior visits or interests where permitted. Non-personalized ads may still use cookies or identifiers for frequency capping, aggregated reporting, fraud prevention, and abuse prevention. Where legally required, optional advertising technologies will not be activated before appropriate consent. Users will be provided controls to accept, reject, or manage optional categories.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4 text-sm font-bold">
                See our <Link href="/advertising-disclosure" className="text-emerald-600 hover:underline">Advertising Disclosure</Link> for more information.
              </p>
            </section>

            <section id="cmp" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">9. Consent Management Platform</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools operates a first-party consent interface allowing you to manage your choices for optional analytics and advertising technologies. Even though these optional scripts are currently planned and not active, the consent system is already active to securely capture your privacy choices for the future.
              </p>
              <p className="text-slate-600 leading-relaxed">
                You can change these choices at any time by using the "Cookie Settings" link in the website footer.
              </p>
            </section>

            <section id="consent-mode" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">10. Google Consent Mode</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                <em>Conditional/Planned:</em> Google Consent Mode may be used in the future to communicate user consent choices to Google tags. It does not itself collect consent but works together with a real consent interface or CMP. It is not currently active.
              </p>
            </section>

            {/* Cookie Categories */}
            <section id="cookie-categories" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b border-slate-100">11. Cookie Categories</h2>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-slate-50 text-slate-700">
                    <tr>
                      <th className="p-4 font-bold border-b border-slate-200">Category</th>
                      <th className="p-4 font-bold border-b border-slate-200">Purpose</th>
                      <th className="p-4 font-bold border-b border-slate-200">Current Status</th>
                      <th className="p-4 font-bold border-b border-slate-200">Optional?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-600">
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Strictly Necessary</td>
                      <td className="p-4">Required for basic site operation, security, or saving consent state.</td>
                      <td className="p-4">Conditional (Hosting Infra)</td>
                      <td className="p-4"><span className="text-slate-400 font-bold">No</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Preferences</td>
                      <td className="p-4">Remembering UI choices, layout states, or recent calculations.</td>
                      <td className="p-4">Current (Consent)</td>
                      <td className="p-4"><span className="text-slate-400 font-bold">Yes</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Analytics</td>
                      <td className="p-4">Measuring traffic, tracking errors, and analyzing site usage.</td>
                      <td className="p-4">Planned</td>
                      <td className="p-4"><span className="text-emerald-600 font-bold">Yes</span></td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-800">Advertising</td>
                      <td className="p-4">Serving relevant ads, capping ad frequency, measuring revenue.</td>
                      <td className="p-4">Planned</td>
                      <td className="p-4"><span className="text-emerald-600 font-bold">Yes</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section id="session-persistent" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">12. Session and Persistent Storage</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                <strong>Session technologies:</strong> Usually expire automatically when the browser or session ends.<br/>
                <strong>Persistent technologies:</strong> Remain until a predefined expiry date or until manual deletion.<br/>
                <strong>Browser storage:</strong> May remain indefinitely until users manually clear site data.<br/>
                <strong>Provider cookies:</strong> Duration depends entirely on the respective third-party provider's configuration and policies.
              </p>
            </section>

            <section id="third-parties" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">13. Third-Party Providers</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Currently, infrastructure and security are handled via our hosting provider. In the future, third-party providers (such as Google Analytics, Google AdSense, or a CMP provider) may be integrated. Third parties control their own technologies, maintain their own policies, may process data in different regions, and receive data only where relevant to the service provided. 
              </p>
            </section>

            <section id="user-controls" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">14. User Cookie Controls</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                As a user, you always have ultimate control over your browser. You can block cookies, delete cookies, clear site data, use private browsing mode, restrict third-party cookies, and reset website permissions.
              </p>
              <p className="text-slate-600 leading-relaxed mb-4">
                Blocking storage technologies may reset your saved preferences and affect your advertising choices. Our current core calculators and tools process data entirely client-side and do not require cookies to function.
              </p>
            </section>

            <section id="browser-settings" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">15. Browser-Specific Controls</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Cookie and site-data controls are available within the privacy or security settings of all major browsers (such as Chrome, Firefox, Safari, and Edge). You can manage or wipe data on a site-by-site basis.
              </p>
            </section>

            <section id="gpc-dnt" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">16. Global Privacy Control and Do Not Track</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Some browsers send "Do Not Track" or "Global Privacy Control" (GPC) signals. Standards and legal requirements for responding to these signals differ by region. SnapFreeTools will evaluate and respect legally required signals when optional tracking is activated. At present, no optional analytics or advertising scripts are active.
              </p>
            </section>

            <section id="children" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">17. Children and Cookies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                SnapFreeTools is a general productivity platform. We do not intentionally use optional advertising or analytics technologies to profile children in the current implementation. Any future advertising or analytics setup will require appropriate safeguards and consent handling. Parents or guardians may contact SnapFreeTools regarding any concerns.
              </p>
            </section>

            <section id="data-sharing" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">18. Data Sharing Through Cookies</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Browser storage itself does not necessarily mean data is shared. However, third-party scripts may transmit technical or consent data when active. SnapFreeTools does not sell cookie data as a standalone product. Advertising providers may independently process data under their own policies.
              </p>
            </section>

            <section id="retention" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">19. Retention</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Session cookies end according to session behavior. Persistent cookies last until expiry or deletion. Local storage may remain until cleared. If implemented in the future, consent records may be stored to demonstrate user choices, and analytics/advertising retention will depend strictly on the respective provider's configurations.
              </p>
            </section>

            <section id="changes" className="mb-12 scroll-mt-24">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">20. Policy Changes</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                This policy may be updated when Google Analytics is activated, Google AdSense is activated, a CMP is added, accounts are introduced, new storage technologies are used, or laws/provider requirements change. The visible "Last Updated" date will be revised when changes occur.
              </p>
            </section>

            {/* FAQ Section */}
            <section className="mb-16 mt-16 pt-12 border-t border-slate-100">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">1. Does SnapFreeTools currently use cookies?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No. Based on our current frontend code audit, SnapFreeTools does not set any first-party persistent or session cookies.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">2. Is localStorage the same as a cookie?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No. While both store data in your browser, localStorage does not automatically send its data to the server with every web request. We currently use localStorage to securely remember your privacy consent choices.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">3. Does SnapFreeTools currently use Google Analytics?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No. Google Analytics is planned for future performance monitoring but is not currently active in the codebase.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">4. Does SnapFreeTools currently show Google AdSense ads?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">No. Advertising monetization is planned for the future, but AdSense scripts are not currently active.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">5. How can I remove saved preferences?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">You can remove any saved data at any time by using your browser's site-data or cache clearing controls available in its privacy settings.</p>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-2">6. Will I be able to reject advertising cookies?</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">Yes. You can manage your choices right now using the first-party consent interface, even though advertising technologies are not yet active.</p>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>

      {/* Final Contact Section */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <HelpCircle className="text-emerald-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-3">Questions about cookies?</h2>
          <p className="text-slate-300 mb-6 text-sm">
            Contact SnapFreeTools for questions about browser storage, cookies, analytics, advertising technologies, or consent choices. Do not send passwords, financial information, or sensitive documents by email.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
              Contact Support
            </Link>
            <a href="mailto:sameerwebdeveloper41@gmail.com" className="inline-block px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors text-sm border border-slate-700 shadow-sm">
              Email Directly
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
