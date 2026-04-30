import { motion } from "motion/react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";
import React from "react";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div id="contact-page" className="max-w-4xl mx-auto px-4 py-16">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm"
      >
        <div className="bg-primary p-12 text-white">
          <h1 className="text-3xl font-bold mb-6">Get in Touch</h1>
          <p className="mb-10 text-blue-100 leading-relaxed">
            Have a suggestion for a new tool? Found a bug? Just want to say hi? 
            We'd love to hear from you.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase font-bold tracking-widest">Email Us</p>
                <p className="font-medium">support@fastfreetools.com</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <MessageSquare size={20} />
              </div>
              <div>
                <p className="text-xs text-blue-200 uppercase font-bold tracking-widest">Support</p>
                <p className="font-medium">Active 24/7 via Ticket</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
              <p className="text-slate-600 italic">We'll get back to you shortly.</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="mt-8 text-primary font-bold hover:underline"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-primary focus:outline-none transition-all"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Message</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:bg-white focus:border-primary focus:outline-none transition-all resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-blue-200"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
