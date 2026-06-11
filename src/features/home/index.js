"use client";

import { FileText, Image as ImageIcon, Calculator, FileType, Zap, Shield, MousePointer2 } from "lucide-react";
import ToolCard from "@/components/ui/tool-card";
import { motion } from "motion/react";
import React from "react";

const tools = [
  {
    name: "Word Counter",
    description: "Instantly count words, characters, and sentences in your text with reading time estimation.",
    icon: FileText,
    path: "/word-counter",
    color: "bg-slate-700",
  },
  {
    name: "Image Compressor",
    description: "Reduce image file size up to 90% without losing quality. Support for JPEG, PNG, and WebP.",
    icon: ImageIcon,
    path: "/image-compressor",
    color: "bg-emerald-500",
  },
  {
    name: "GPA Calculator",
    description: "Calculate your college or high school GPA based on grades and credit hours easily.",
    icon: Calculator,
    path: "/gpa-calculator",
    color: "bg-amber-500",
  },
  {
    name: "PDF to Word",
    description: "Convert your PDF documents into editable Microsoft Word files with perfect formatting.",
    icon: FileType,
    path: "/pdf-to-word",
    color: "bg-rose-500",
  },
];

const features = [
  {
    title: "Lightning Fast",
    description: "Our tools run directly in your browser. No server delays, just instant results.",
    icon: Zap,
  },
  {
    title: "Private & Secure",
    description: "Your files never leave your computer. Everything happens locally for maximum privacy.",
    icon: Shield,
  },
  {
    title: "100% Free",
    description: "All tools are free to use. No hidden costs, no subscriptions, no credit card required.",
    icon: MousePointer2,
  },
];

export default function HomeFeature() {
  return (
    <div id="home-page" className="pb-20">
      {/* Hero Section */}
      <section className="pt-20 pb-16 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-emerald-50 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            Free Online Productivity Tools
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">
            Work Smarter, <br />
            <span className="text-primary italic font-serif">Not Harder.</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            SnapFreeTools provides a collection of clean, fast, and secure tools to help you get your work done faster. Everything you need, all in one place.
          </p>
        </motion.div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <ToolCard 
                key={tool.path} 
                name={tool.name}
                description={tool.description}
                icon={Icon}
                path={tool.path}
                color={tool.color}
                delay={index * 0.1} 
              />
            );
          })}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-white py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why use SnapFreeTools?</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
