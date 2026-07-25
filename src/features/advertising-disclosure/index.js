import React from "react";
import Link from "next/link";
import { Eye, Shield, Scale, ArrowRight, HelpCircle, FileText, Settings, AlertTriangle } from "lucide-react";

export default function AdvertisingDisclosureFeature() {
  const currentDate = "July 19, 2026";

  return (
    <div className="bg-slate-50 min-h-screen pb-24 text-slate-800">
      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">
          TRANSPARENCY
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
          Advertising Disclosure
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          SnapFreeTools believes in transparency regarding how we plan to fund and operate our free productivity platform.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium text-slate-500 mb-8">
          <span>Last updated: {currentDate}</span>
          <span className="hidden sm:inline">•</span>
          <span>Effective date: {currentDate}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Eye size={16} className="text-emerald-500" /> Clear Disclosures
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Scale size={16} className="text-emerald-500" /> Editorial Independence
          </span>
          <span className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
            <Shield size={16} className="text-emerald-500" /> User Privacy Respected
          </span>
        </div>
      </section>

      {/* Quick Summary Cards */}
      <section className="max-w-6xl mx-auto px-4 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Eye className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Transparency</h3>
            <p className="text-sm text-slate-600 leading-relaxed">We openly declare our planned funding sources and advertising intentions before they are implemented.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Scale className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Editorial Independence</h3>
            <p className="text-sm text-slate-600 leading-relaxed">Future advertisements will not influence the design, accuracy, or availability of our free tools.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Shield className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">User Choice</h3>
            <p className="text-sm text-slate-600 leading-relaxed">You will retain control over optional tracking and personalized advertising preferences.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <Settings className="text-emerald-600 mb-4" size={24} />
            <h3 className="font-bold text-slate-900 mb-2">Future Ready</h3>
            <p className="text-sm text-slate-600 leading-relaxed">This disclosure applies to our current state and prepares you for upcoming features and integrations.</p>
          </div>
        </div>
      </section>

      {/* Main Layout */}
      <main className="max-w-4xl mx-auto px-4">
        <article className="bg-white rounded-3xl p-6 md:p-12 border border-slate-200 shadow-sm min-w-0">
          
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Providing high-quality online tools requires ongoing investment in server infrastructure, development, and maintenance. To keep SnapFreeTools free for everyone, we plan to support the platform through advertising in the future. We are committed to ensuring these advertisements remain transparent, safe, and unintrusive.
            </p>
          </section>

          {/* Current Advertising Status Table */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Current Advertising Status</h2>
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-50 text-slate-700">
                  <tr>
                    <th className="p-4 font-bold border-b border-slate-200">Advertising Type</th>
                    <th className="p-4 font-bold border-b border-slate-200">Status</th>
                    <th className="p-4 font-bold border-b border-slate-200">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-4 font-medium text-slate-800">Google AdSense</td>
                    <td className="p-4"><span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold">Planned</span></td>
                    <td className="p-4">Pending future integration</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-800">Affiliate Links</td>
                    <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not Active</span></td>
                    <td className="p-4">No affiliate programs currently used</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-800">Sponsored Content</td>
                    <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not Active</span></td>
                    <td className="p-4">No sponsored posts or reviews</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-medium text-slate-800">Direct Advertising</td>
                    <td className="p-4"><span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">Not Active</span></td>
                    <td className="p-4">No direct ad placements sold</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Highlighted Notice */}
          <section className="mb-10">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-amber-900 mb-2">
                <AlertTriangle size={20} className="text-amber-600" /> Important Notice
              </h3>
              <p className="text-amber-800 leading-relaxed">
                Advertising technologies, including Google AdSense, are <strong>not currently active</strong> on SnapFreeTools. They may be introduced in the future. This page explains how those systems will operate once enabled.
              </p>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Google AdSense (Future)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              In the future, SnapFreeTools plans to use Google AdSense to display advertisements. When activated, Google and third-party vendors may use cookies to serve ads based on your prior visits to our website or other websites. Where applicable, we will request appropriate consent before enabling personalized advertising.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Affiliate Links (Future)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              While not currently active, we may include affiliate links in the future. If enabled, we may earn a small commission if you click an affiliate link and make a purchase. Any future affiliate links will be clearly disclosed near the link itself.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Sponsored Content (Future)</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not currently accept sponsored content, paid reviews, or paid tool placements. If we choose to publish sponsored material in the future, it will be prominently labeled as "Sponsored" or "Advertisement" to ensure clear distinction from our organic content.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Editorial Independence</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              SnapFreeTools maintains strict editorial independence. Future advertisers, sponsors, or affiliate partners will have no influence over the design, functionality, or results produced by our calculators, converters, and utilities.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Privacy & User Choice</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We respect your privacy. Before any optional advertising technologies are activated, we will provide appropriate consent controls allowing you to accept, reject, or customize your preferences. You can review our current storage and consent architecture in our <Link href="/cookie-policy" className="text-emerald-600 hover:underline">Cookie Policy</Link> and <Link href="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

        </article>
      </main>

      {/* Final Contact Section */}
      <section className="max-w-4xl mx-auto px-4 mt-16 text-center">
        <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-lg">
          <HelpCircle className="text-emerald-400 mx-auto mb-4" size={32} />
          <h2 className="text-xl font-bold mb-3">Questions about advertising?</h2>
          <p className="text-slate-300 mb-6 text-sm max-w-xl mx-auto">
            Contact SnapFreeTools if you have questions about our planned advertising integrations or this disclosure.
          </p>
          <div className="flex justify-center mb-6">
            <Link href="/contact" className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors text-sm shadow-sm">
              Contact Support
            </Link>
          </div>
          <div className="flex justify-center gap-6 text-xs text-slate-400 font-semibold">
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </section>

    </div>
  );
}
