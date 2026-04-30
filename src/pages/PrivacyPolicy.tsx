import { motion } from "motion/react";
import React from "react";

export default function PrivacyPolicy() {
  return (
    <div id="privacy-page" className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-3xl border border-slate-200"
      >
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>
            At SnapFreeTools, we prioritize your privacy. This policy outlines how we handle your data when you use our online tools.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">1. Client-Side Processing</h2>
          <p>
            Most of our tools run entirely in your web browser using JavaScript. This means your data (text for counting, images for compression) never leaves your computer and is never uploaded to our servers.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">2. Data Collection</h2>
          <p>
            We do not collect or store any personal data or the content you process using our tools. We use standard web analytics (like Google Analytics) to understand general traffic patterns to improve our service, but this does not include the data you process.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">3. Cookies</h2>
          <p>
            We may use cookies to remember your preferences (like your quality settings in the image compressor) for a better user experience. These are stored locally on your device.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-8">4. External Links</h2>
          <p>
            Our website may contain links to external sites not operated by us. Please be aware that we have no control over the content and practices of these sites.
          </p>

          <p className="mt-12 text-sm italic">
            Last updated: April 28, 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
