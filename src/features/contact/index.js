"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, PlusCircle, Briefcase, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import Link from "next/link";
import { submitContactForm } from "./contact.service";

const CATEGORIES = [
  { value: "general-question", label: "General Question" },
  { value: "bug-report", label: "Bug Report" },
  { value: "tool-support", label: "Tool Support" },
  { value: "feature-request", label: "Feature Request" },
  { value: "new-tool-suggestion", label: "New Tool Suggestion" },
  { value: "advertising", label: "Advertising Inquiry" },
  { value: "partnership", label: "Partnership Inquiry" },
  { value: "business-inquiry", label: "Business Inquiry" },
  { value: "privacy-request", label: "Privacy Request" },
  { value: "copyright-request", label: "Copyright Request" }
];

export default function ContactFeature() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
    privacyAccepted: false,
    _contact_identifier: "", // honeypot
    submissionStartedAt: Date.now()
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [referenceId, setReferenceId] = useState("");
  const [openFaq, setOpenFaq] = useState(0);

  const fieldRefs = {
    name: useRef(null),
    email: useRef(null),
    subject: useRef(null),
    category: useRef(null),
    message: useRef(null),
    privacyAccepted: useRef(null)
  };

  const validateField = (name, value) => {
    let error = "";
    const trimmed = typeof value === "string" ? value.trim() : value;
    switch (name) {
      case "name":
        if (!trimmed) error = "Enter your name.";
        else if (trimmed.length < 2 || trimmed.length > 80) error = "Name must be between 2 and 80 characters.";
        else if (/^[^a-zA-Z]*$/.test(trimmed)) error = "Please enter a valid name.";
        break;
      case "email":
        if (!trimmed) error = "Enter a valid email address.";
        else if (trimmed.length > 254) error = "Email is too long.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) error = "Enter a valid email address.";
        break;
      case "subject":
        if (!trimmed) error = "Enter a short subject.";
        else if (trimmed.length < 5 || trimmed.length > 120) error = "Subject must be between 5 and 120 characters.";
        else if (/^[^\w]+$/.test(trimmed)) error = "Please enter a valid subject.";
        break;
      case "category":
        if (!trimmed) error = "Choose a contact category.";
        break;
      case "message":
        if (!trimmed) error = "Enter at least 20 characters.";
        else if (trimmed.length < 20 || trimmed.length > 2000) error = "Message must be between 20 and 2000 characters.";
        else if (/^(.)\1+$/.test(trimmed)) error = "Please enter a meaningful message.";
        break;
      case "privacyAccepted":
        if (!value) error = "Please review and accept the Privacy Policy acknowledgement.";
        break;
      default:
        break;
    }
    return error;
  };

  const handleBlur = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === "checkbox" ? checked : value;
    const error = validateField(name, val);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      const error = validateField(name, val);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData._contact_identifier) return;

    if (!process.env.NEXT_PUBLIC_CONTACT_API_URL) {
      if (process.env.NODE_ENV === "development") {
        console.error("Configuration Error: NEXT_PUBLIC_CONTACT_API_URL is missing.");
      }
      setStatus("temporary-fallback");
      return;
    }

    const newErrors = {};
    let firstInvalid = null;
    
    Object.keys(formData).forEach(key => {
      if (key === "_contact_identifier" || key === "submissionStartedAt") return;
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        if (!firstInvalid) firstInvalid = key;
      }
    });

    setErrors(newErrors);

    if (firstInvalid) {
      fieldRefs[firstInvalid]?.current?.focus();
      return;
    }

    setStatus("submitting");

    try {
      const payload = { ...formData };
      delete payload.submissionStartedAt;

      const res = await submitContactForm(payload);
      setStatus("success");
      setReferenceId(res.referenceId);
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
        privacyAccepted: false,
        _contact_identifier: "",
        submissionStartedAt: Date.now()
      });
    } catch (err) {
      if (err.status === 400 && err.data) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Contact API rejected request with code: ${err.data.code}`);
        }
        
        if (err.data.code === 'VALIDATION_ERROR' && err.data.errors) {
          if (process.env.NODE_ENV === "development") {
            console.error(`Contact API validation failed for fields: ${Object.keys(err.data.errors).join(', ')}`);
          }
          setErrors(err.data.errors);
          const firstErr = Object.keys(err.data.errors)[0];
          if (firstErr && fieldRefs[firstErr]?.current) {
            fieldRefs[firstErr].current.focus();
          }
          setStatus("idle");
        } else {
          setStatus("error");
        }
      } else if (err.status === 429) {
        setStatus("rate-limited");
      } else {
        setStatus("error");
      }
    }
  };

  const faqs = [
    { q: "How quickly are messages reviewed?", a: "Messages are reviewed as soon as reasonably possible, but response times may vary." },
    { q: "Can I request a new tool?", a: "Yes. Select Tool Suggestion or Feature Request and explain the problem the tool should solve." },
    { q: "How should I report a bug?", a: "Include the tool name, what you entered or uploaded, what you expected, and what happened instead. Do not send sensitive information." },
    { q: "Can I contact SnapFreeTools about advertising or partnerships?", a: "Yes. Choose Advertising Inquiry or Partnership Inquiry in the contact form." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      <section className="pt-20 pb-12 px-4 text-center max-w-4xl mx-auto">
        <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-4 block">CONTACT SNAPFREETOOLS</span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">How can we help?</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
          Have a question, found a bug, or want to suggest a new tool? Send us a message and we’ll review it as soon as possible.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-700">
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Clear communication</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Privacy-conscious handling</span>
          <span className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Helpful feedback welcome</span>
        </div>
        <p className="text-sm text-slate-500 mt-6">We usually review messages within a reasonable timeframe.</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm relative p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h2 className="text-xl font-bold text-slate-900 mb-8">Support Information</h2>
              
              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Us</p>
                <a href="mailto:sameerwebdeveloper41@gmail.com" className="text-emerald-600 font-medium hover:underline flex items-center gap-2">
                  <Mail size={18} /> sameerwebdeveloper41@gmail.com
                </a>
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Contact Topics</p>
                <div className="flex flex-wrap gap-2">
                  {["Tool Support", "Bug Reports", "Feature Requests", "Advertising", "Partnerships", "Privacy"].map(topic => (
                    <span key={topic} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-8 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <h3 className="font-bold text-emerald-900 mb-2">Help us respond clearly</h3>
                <ul className="text-sm text-emerald-800 space-y-1 list-disc pl-4">
                  <li>Mention the tool name</li>
                  <li>Explain what happened</li>
                  <li>Include relevant steps</li>
                  <li>Do not include passwords or sensitive files</li>
                </ul>
              </div>

              <p className="text-xs text-slate-500 mb-8">Only share information necessary to explain your request.</p>

              <div className="space-y-3 pt-6 border-t border-slate-100">
                <Link href="/calculators" className="block text-sm font-medium text-slate-600 hover:text-emerald-600">Browse Tools</Link>
                <Link href="/privacy-policy" className="block text-sm font-medium text-slate-600 hover:text-emerald-600">Privacy Policy</Link>
                <Link href="/terms" className="block text-sm font-medium text-slate-600 hover:text-emerald-600">Terms of Use</Link>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            {status === "success" && (
              <div className="text-center py-16 px-4" aria-live="polite">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Message received</h2>
                <p className="text-slate-600 mb-4 max-w-md mx-auto leading-relaxed">
                  Thank you for contacting SnapFreeTools. Your message has been received and will be reviewed as soon as reasonably possible.
                </p>
                {referenceId && (
                  <p className="text-sm font-mono text-slate-500 mb-8 bg-slate-50 py-2 px-4 rounded inline-block">
                    Reference ID: {referenceId}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    Send another message
                  </button>
                  <Link 
                    href="/calculators"
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center"
                  >
                    Browse Tools
                  </Link>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-16 px-4" aria-live="polite">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">We couldn’t send your message</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  Please try again or contact us directly at <strong className="text-slate-800">sameerwebdeveloper41@gmail.com</strong>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center"
                  >
                    Try again
                  </button>
                  <a 
                    href={`mailto:sameerwebdeveloper41@gmail.com?subject=${encodeURIComponent(formData.subject || "Contact from SnapFreeTools")}&body=${encodeURIComponent(formData.message)}`}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={18} /> Email us directly
                  </a>
                </div>
              </div>
            )}

            {status === "rate-limited" && (
              <div className="text-center py-16 px-4" aria-live="polite">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Too many requests</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  You have submitted too many messages recently. Please try again later.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                >
                  Return to form
                </button>
              </div>
            )}

            {status === "temporary-fallback" && (
              <div className="text-center py-16 px-4" aria-live="polite">
                <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Message delivery is unavailable</h2>
                <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
                  We could not connect to the contact service. Please try again later or email us directly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a 
                    href={`mailto:sameerwebdeveloper41@gmail.com?subject=${encodeURIComponent(formData.subject || "Contact from SnapFreeTools")}&body=${encodeURIComponent(formData.message)}`}
                    className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Mail size={18} /> Email us directly
                  </a>
                  <button 
                    onClick={() => setStatus("idle")}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Return to form
                  </button>
                </div>
              </div>
            )}

            {(status === "idle" || status === "submitting") && (
              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input 
                      id="name"
                      name="name"
                      type="text" 
                      ref={fieldRefs.name}
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={status === "submitting"}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:bg-white focus:outline-none transition-all ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} disabled:opacity-50`}
                      placeholder="Your name"
                    />
                    {errors.name && <p id="name-error" className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input 
                      id="email"
                      name="email"
                      type="email" 
                      ref={fieldRefs.email}
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={status === "submitting"}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:bg-white focus:outline-none transition-all ${errors.email ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} disabled:opacity-50`}
                      placeholder="you@example.com"
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                  <input 
                    id="subject"
                    name="subject"
                    type="text" 
                    ref={fieldRefs.subject}
                    value={formData.subject}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.subject}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:bg-white focus:outline-none transition-all ${errors.subject ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} disabled:opacity-50`}
                    placeholder="Briefly describe your request"
                  />
                  {errors.subject && <p id="subject-error" className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                  <select 
                    id="category"
                    name="category"
                    ref={fieldRefs.category}
                    value={formData.category}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.category}
                    aria-describedby={errors.category ? "category-error" : undefined}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:bg-white focus:outline-none transition-all appearance-none ${errors.category ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} disabled:opacity-50`}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                  {errors.category && <p id="category-error" className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <div className="flex justify-between items-end mb-2">
                    <label htmlFor="message" className="block text-sm font-bold text-slate-700">Message</label>
                    <span className="text-xs text-slate-500">{formData.message.length} / 2000</span>
                  </div>
                  <textarea 
                    id="message"
                    name="message"
                    rows={6}
                    ref={fieldRefs.message}
                    value={formData.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={status === "submitting"}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "message-error" : "message-help"}
                    className={`w-full bg-slate-50 border rounded-xl px-4 py-3 focus:bg-white focus:outline-none transition-all resize-y ${errors.message ? 'border-red-500 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'} disabled:opacity-50`}
                    placeholder="Tell us how we can help. For a bug report, include the tool name and the steps that caused the issue."
                  ></textarea>
                  {errors.message ? (
                    <p id="message-error" className="text-red-500 text-sm mt-1">{errors.message}</p>
                  ) : (
                    <p id="message-help" className="text-slate-500 text-sm mt-1">Do not include passwords, payment details, or sensitive personal information.</p>
                  )}
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex items-center h-5 mt-1">
                    <input 
                      id="privacyAccepted"
                      name="privacyAccepted"
                      type="checkbox" 
                      ref={fieldRefs.privacyAccepted}
                      checked={formData.privacyAccepted}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={status === "submitting"}
                      aria-invalid={!!errors.privacyAccepted}
                      aria-describedby={errors.privacyAccepted ? "privacy-error" : undefined}
                      className="w-4 h-4 text-emerald-600 bg-slate-100 border-slate-300 rounded focus:ring-emerald-500 disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="privacyAccepted" className="text-sm text-slate-700">
                      I have read the <Link href="/privacy-policy" className="text-emerald-600 hover:underline">Privacy Policy</Link> and agree that my information may be used to respond to this request.
                    </label>
                    {errors.privacyAccepted && <p id="privacy-error" className="text-red-500 text-sm mt-1">{errors.privacyAccepted}</p>}
                  </div>
                </div>

                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <label htmlFor="_contact_identifier">Website</label>
                  <input type="text" id="_contact_identifier" name="_contact_identifier" tabIndex="-1" autoComplete="off" value={formData._contact_identifier} onChange={handleChange} disabled={status === "submitting"} />
                </div>

                <button 
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md focus:ring-4 focus:ring-slate-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Sending message...
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mb-4">
            <AlertCircle size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Report a problem</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Found an issue with a tool? Include the tool name and clear steps.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
            <PlusCircle size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Suggest a tool</h3>
          <p className="text-sm text-slate-600 leading-relaxed">Tell us what task you want to complete and how the tool should work.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <Briefcase size={20} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Business inquiries</h3>
          <p className="text-sm text-slate-600 leading-relaxed">For advertising or partnerships, select the matching category in the form.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mb-20">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <button 
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  className="w-full text-left px-6 py-4 flex justify-between items-center focus:bg-slate-50 focus:outline-none"
                >
                  <span className="font-bold text-slate-800">{faq.q}</span>
                  {isOpen ? <ChevronUp size={20} className="text-slate-400" /> : <ChevronDown size={20} className="text-slate-400" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div 
                      id={`faq-answer-${idx}`}
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-4 pt-2 text-slate-600 border-t border-slate-100">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mb-20">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Your message deserves careful handling</h2>
            <p className="text-slate-300 mb-8 max-w-2xl leading-relaxed">
              Contact details are used to review and respond to your request. Avoid sharing passwords, financial information, or sensitive documents.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle size={18} className="text-emerald-400" /> No automatic marketing signup
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle size={18} className="text-emerald-400" /> Clear privacy information
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle size={18} className="text-emerald-400" /> No public message display
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle size={18} className="text-emerald-400" /> Rate limiting and spam checks enabled
              </div>
              <div className="flex items-center gap-3 text-slate-200">
                <CheckCircle size={18} className="text-emerald-400" /> Server-side validation enabled
              </div>
            </div>
            <div className="flex gap-4 text-sm">
              <Link href="/privacy-policy" className="text-emerald-400 hover:text-emerald-300 underline font-medium">Privacy Policy</Link>
              <span className="text-slate-600">•</span>
              <Link href="/cookie-policy" className="text-emerald-400 hover:text-emerald-300 underline font-medium">Cookie Policy</Link>
              <span className="text-slate-600">•</span>
              <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 underline font-medium">Terms of Use</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center px-4 mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Looking for a tool instead?</h2>
        <p className="text-slate-600 mb-6">Browse available calculators, PDF tools, text tools, and image utilities.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/calculators" className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            Browse Calculators
          </Link>
          <Link href="/pdf-to-word" className="px-6 py-3 bg-emerald-50 text-emerald-700 rounded-xl font-bold hover:bg-emerald-100 transition-all flex items-center justify-center gap-2">
            Try PDF to Word <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
