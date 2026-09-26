import React from "react";
import Link from "next/link";
import { 
  FileText, Shield, Zap, Sparkles, HelpCircle, Eye, AlertTriangle, 
  FileCheck, Cpu, Code2, Lock, BookOpen, Layers, CheckCircle, RotateCcw
} from "lucide-react";

export const FAQS_DATA = [
  {
    question: "What is a PDF to Text converter?",
    answer: "A PDF to Text converter is a utility that parses Portable Document Format (.pdf) files—both digital vector documents and scanned image PDFs—and extracts written character strings into plain text (.txt). It isolates selectable body text and OCR recognized text from visual formatting, graphics, and margins."
  },
  {
    question: "How do I extract text from a PDF file for free?",
    answer: "Drag and drop your PDF file into our converter above. The tool automatically extracts digital text instantly. If no selectable text is found, you can click 'Extract Text with Free OCR' to perform local image-to-text recognition directly in your browser."
  },
  {
    question: "Can I extract text from a scanned PDF?",
    answer: "Yes! SnapFreeTools includes a 100% Free Browser-Based OCR (Optical Character Recognition) engine. If your PDF is a scanned paper document, photograph, or flattened image PDF, click 'Extract Text with Free OCR' to process each page using local Tesseract.js pattern recognition inside your browser."
  },
  {
    question: "How accurate is the browser-based OCR engine?",
    answer: "OCR accuracy depends on document scan clarity, lighting contrast, font style, and image resolution. For clean, high-DPI scans, accuracy is typically over 90–95%. If average recognition confidence falls below 70%, our tool displays a low-confidence warning so you can double-check extracted text for typos."
  },
  {
    question: "Are my PDF files or scanned images uploaded to a server?",
    answer: "No. SnapFreeTools processes both native text extraction and OCR 100% client-side inside your web browser using Web Workers and WebAssembly (WASM). Your document bytes, page canvases, and extracted text never leave your device."
  },
  {
    question: "What languages does the free OCR engine support?",
    answer: "Our in-browser OCR engine utilizes pre-bundled local English language models (eng) loaded directly from browser assets. This guarantees instant offline processing without external API requests or subscription fees."
  },
  {
    question: "Can I cancel OCR processing while it is running?",
    answer: "Yes. You can click the 'Cancel OCR' button at any point during page rendering or text recognition. Cancellation immediately terminates the background Tesseract.js worker, cleans up memory, and resets the interface safely."
  },
  {
    question: "How do I convert PDF to TXT?",
    answer: "Upload your PDF document to the converter. After native extraction or free OCR completes, click the 'Download .TXT' button to save the entire document text as a standard plain-text (.txt) file."
  },
  {
    question: "Can I extract text from a password-protected PDF?",
    answer: "Password-protected or encrypted PDFs cannot be processed until decrypted. You can first remove security restrictions using our free Unlock PDF tool, then upload the unlocked file to extract text."
  },
  {
    question: "What is the difference between native PDF text extraction and OCR?",
    answer: "Native PDF text extraction reads existing digital font codes embedded inside a vector PDF file in milliseconds. Optical Character Recognition (OCR) renders page images and uses neural pattern matching to translate visual pixel shapes of letters into editable text."
  },
  {
    question: "Does PDF to Text preserve original document formatting?",
    answer: "No. Plain text (.txt) format is unformatted and does not support font sizes, bold styles, tables, columns, or embedded images. If you need to preserve exact visual layouts, headings, and tables, use our PDF to Word converter instead."
  },
  {
    question: "Is there a file size or page limit?",
    answer: "Because all processing takes place locally inside your browser memory, there are no artificial file upload caps or daily quotas. You can convert documents of any size as long as your device has sufficient RAM."
  },
  {
    question: "Can I view extracted text page-by-page?",
    answer: "Yes. Our result viewer allows you to toggle between the full document text view and an individual Page-by-Page preview to inspect text extracted from specific pages."
  },
  {
    question: "How do I copy extracted text to my clipboard?",
    answer: "Click the 'Copy Text' button above the result window to instantly copy all extracted text to your device clipboard for pasting into Word, Google Docs, or text editors."
  },
  {
    question: "Does this tool work on mobile devices?",
    answer: "Yes. The PDF to Text converter is fully responsive and operates smoothly on mobile web browsers across iOS, Android, macOS, and Windows."
  },
  {
    question: "Can I convert extracted PDF text to edit in Microsoft Word?",
    answer: "Yes, you can copy plain text directly into Word or text editors. If you want structured tables and formatting in a native DOCX file, use our dedicated PDF to Word converter."
  }
];

export default function EducationalContent({ faqs = FAQS_DATA }) {
  const [openFaq, setOpenFaq] = React.useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-16 text-slate-700 leading-relaxed">
      
      {/* 1. Quick Tool Specifications (GEO / AI Discoverability Table) */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="text-amber-500" size={20} />
          <h2 className="text-lg font-extrabold text-slate-900">Quick Tool Specifications</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Tool Name</span>
            <span className="font-extrabold text-slate-800">SnapFree PDF to Text Converter & Free OCR</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Processing Engine</span>
            <span className="font-extrabold text-slate-800">Client-Side Web Workers & Tesseract.js WASM</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Data Privacy</span>
            <span className="font-extrabold text-emerald-700">100% In-Browser Memory (0 Cloud Uploads)</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Output Formats</span>
            <span className="font-extrabold text-slate-800">Plain Text (.txt) / Clipboard String</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Supported Inputs</span>
            <span className="font-extrabold text-slate-800">Digital Selectable & Scanned Image PDFs</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">Scanned PDF Support</span>
            <span className="font-extrabold text-emerald-700">100% Free In-Browser OCR Mode</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-1 sm:col-span-2">
            <span className="font-bold text-slate-500 uppercase tracking-wider block">OCR Language Support</span>
            <span className="font-extrabold text-slate-800">English (100% Local Offline Assets)</span>
          </div>
        </div>
      </section>

      {/* 2. What Is PDF to Text Extraction & Free OCR? */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="text-amber-500" size={24} />
          PDF Text Extraction & Free In-Browser OCR
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          <strong>PDF to Text conversion</strong> allows you to extract raw written words from Portable Document Format (.pdf) files into unformatted plain text (.txt). Digital PDF documents store font streams directly, enabling instant character parsing. However, scanned paper documents and image PDFs contain only visual picture pixels.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          SnapFreeTools provides a dual-engine workflow: it first attempts fast native digital text extraction. If no selectable text is detected, you can run our built-in <strong>Free Browser-Based OCR</strong> engine powered by local Tesseract.js. The OCR engine renders PDF pages onto high-resolution canvases and recognizes letter shapes entirely inside your browser.
        </p>
      </section>

      {/* 3. Step-by-Step Workflow */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <FileCheck className="text-amber-500" size={24} />
          How to Extract Text from Digital & Scanned PDFs
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">1</div>
            <h3 className="font-bold text-slate-800 text-sm">Upload PDF</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Select or drag your PDF document into the browser drop zone.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">2</div>
            <h3 className="font-bold text-slate-800 text-sm">Native Auto-Extract</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Digital text streams are parsed in milliseconds. Scanned PDFs trigger an OCR option.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">3</div>
            <h3 className="font-bold text-slate-800 text-sm">Free Browser OCR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">For scanned PDFs, click "Extract Text with Free OCR" to run local Tesseract.js recognition.</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-sm">4</div>
            <h3 className="font-bold text-slate-800 text-sm">Copy or Download</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Copy extracted text to clipboard or download a clean .txt document.</p>
          </div>
        </div>
      </section>

      {/* 4. Comparison Table: Native vs Browser OCR vs Cloud Server OCR */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Layers className="text-amber-500" size={24} />
          Native Extraction vs. Free Browser OCR vs. Cloud Servers
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Here is how our dual-engine PDF to Text converter compares to traditional cloud-based OCR services:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse bg-white rounded-2xl overflow-hidden border border-slate-200">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                <th className="p-3.5">Feature</th>
                <th className="p-3.5">Native PDF Extraction</th>
                <th className="p-3.5 text-amber-900 bg-amber-50/80">SnapFree In-Browser OCR</th>
                <th className="p-3.5">Cloud Server OCR Services</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Target PDF Type</td>
                <td className="p-3.5">Digital vector PDFs</td>
                <td className="p-3.5 font-bold text-amber-900 bg-amber-50/40">Scanned images & photos</td>
                <td className="p-3.5">Scanned images & photos</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Cloud File Uploads</td>
                <td className="p-3.5 text-emerald-700 font-bold">Zero (100% Local)</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-amber-50/40">Zero (100% Local)</td>
                <td className="p-3.5 text-red-600 font-semibold">Required (Remote Upload)</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Processing Engine</td>
                <td className="p-3.5">PDF.js Web Workers</td>
                <td className="p-3.5 font-bold text-slate-800 bg-amber-50/40">Tesseract.js WASM</td>
                <td className="p-3.5">Remote Cloud API / GPU</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Privacy & Security</td>
                <td className="p-3.5 text-emerald-700 font-bold">100% Private Memory</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-amber-50/40">100% Private Memory</td>
                <td className="p-3.5 text-amber-700">Risk of Remote Logs</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Cost & Limits</td>
                <td className="p-3.5 text-emerald-700 font-bold">Free & Unlimited</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-amber-50/40">Free & Unlimited</td>
                <td className="p-3.5 text-slate-500">Subscriptions / Paywalls</td>
              </tr>
              <tr>
                <td className="p-3.5 font-semibold text-slate-800">Cancellation Support</td>
                <td className="p-3.5">Instant Reset</td>
                <td className="p-3.5 font-bold text-emerald-700 bg-amber-50/40">Real-Time Cancel Button</td>
                <td className="p-3.5 text-slate-500">Uncancelable API calls</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. OCR Accuracy & Best Practices */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="text-amber-500" size={24} />
          OCR Limitations & Accuracy Factors
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Optical Character Recognition translates picture pixels into character glyphs using mathematical probability algorithms. To achieve maximum OCR accuracy when extracting text from scanned PDFs:
        </p>
        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 leading-relaxed">
          <li><strong>High Image Resolution:</strong> Scans rendered at 300 DPI or higher yield significantly higher accuracy than low-resolution fax documents.</li>
          <li><strong>High Contrast & Clean Backgrounds:</strong> Dark text on bright white paper produces optimal recognition. Heavy background shadows or colored paper can lower confidence scores.</li>
          <li><strong>Straight Orientation:</strong> Skewed or upside-down scans reduce recognition rate. Ensure documents are rotated upright before scanning.</li>
          <li><strong>Confidence Score Monitoring:</strong> Our tool measures average OCR confidence for each document. If confidence drops below 70%, an alert notice is shown recommending manual proofreading.</li>
        </ul>
      </section>

      {/* 6. Privacy & Security */}
      <section className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="text-emerald-600" size={24} />
          <h2 className="text-2xl font-black text-slate-900">100% In-Browser Privacy Assurance</h2>
        </div>
        <p className="text-slate-700 text-sm leading-relaxed">
          Many online PDF OCR tools require uploading your confidential scans, contracts, or tax forms to third-party cloud servers where data breaches can occur.
        </p>
        <p className="text-slate-700 text-sm leading-relaxed font-semibold">
          SnapFreeTools processes both native text extraction and full OCR locally inside your web browser memory space.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium text-slate-700 pt-2">
          <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" /> Zero Cloud Uploads
          </li>
          <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" /> Zero API Key Requirements
          </li>
          <li className="flex items-center gap-2 bg-white p-3 rounded-xl border border-emerald-200">
            <CheckCircle size={16} className="text-emerald-600 shrink-0" /> Instant Cancel Action
          </li>
        </ul>
      </section>

      {/* 7. Technical Limitations */}
      <section className="space-y-4">
        <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <AlertTriangle className="text-amber-500" size={24} />
          Technical Limitations to Keep in Mind
        </h2>
        <ul className="list-disc pl-5 text-xs text-slate-600 space-y-2 leading-relaxed">
          <li><strong>Plain Text Output:</strong> Extracted text (.txt) strips all visual styling, bold typography, and column structures. For layout-preserved document conversions, use our <Link href="/pdf-to-word" className="text-amber-600 underline font-semibold">PDF to Word</Link> tool.</li>
          <li><strong>Language Scope:</strong> The current offline browser OCR worker includes pre-loaded English language models.</li>
          <li><strong>Encrypted PDFs:</strong> Password-locked PDFs must be unlocked prior to text extraction. Use our <Link href="/unlock-pdf" className="text-amber-600 underline font-semibold">Unlock PDF</Link> tool if needed.</li>
        </ul>
      </section>

      {/* 8. FAQ Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="text-amber-500" size={24} />
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 text-left font-bold text-slate-800 text-sm flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <span>{faq.question}</span>
                <span className="text-amber-500 font-extrabold text-base ml-2">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-slate-600 border-t border-slate-100 leading-relaxed bg-slate-50/50">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. Contextual Internal Link Footer Grid */}
      <section className="pt-6 border-t border-slate-200 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Related PDF & Text Tools</h3>
        <div className="flex flex-wrap gap-2 text-xs">
          <Link href="/pdf-to-excel" className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl font-bold transition-all">
            PDF to Excel
          </Link>
          <Link href="/pdf-to-word" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            PDF to Word
          </Link>
          <Link href="/word-counter" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            Word Counter
          </Link>
          <Link href="/case-converter" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            Case Converter
          </Link>
          <Link href="/pdf-to-jpg" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            PDF to JPG
          </Link>
          <Link href="/split-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            Split PDF
          </Link>
          <Link href="/merge-pdf" className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition-all">
            Merge PDF
          </Link>
          <Link href="/pdf-tools" className="px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl font-bold transition-all">
            All PDF Tools →
          </Link>
        </div>
      </section>

    </div>
  );
}

