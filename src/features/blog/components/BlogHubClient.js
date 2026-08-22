"use client";

import React, { useState } from "react";
import BlogHero from "./BlogHero";
import CategoryNav from "./CategoryNav";
import ArticleGrid from "./ArticleGrid";
import ArticleCard from "./ArticleCard";
import { ArrowRight, Calculator } from "lucide-react";
import Link from "next/link";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { BLOG_HUB_FAQS } from "../content/faqs";

export default function BlogHubClient({ 
  allArticles, 
  featuredArticle, 
  latestArticles, 
  popularArticles 
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Search Filtering
  const filteredArticles = searchQuery 
    ? allArticles.filter(article => {
        const query = searchQuery.toLowerCase();
        return (
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.toLowerCase().includes(query) ||
          (article.tags && article.tags.some(tag => tag.toLowerCase().includes(query)))
        );
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero & Search */}
      <BlogHero onSearch={setSearchQuery} />

      {/* Conditional Rendering based on Search */}
      {searchQuery ? (
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Search Results for "{searchQuery}"</h2>
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold">
              {filteredArticles.length} found
            </span>
          </div>
          <ArticleGrid articles={filteredArticles} emptyMessage={`No articles matched "${searchQuery}".`} />
        </div>
      ) : (
        <>
          {/* Navigation */}
          <CategoryNav />

          {/* Featured Article */}
          {featuredArticle && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-amber-500 rounded-full inline-block"></span>
                Featured Guide
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white border border-slate-200 rounded-[2rem] p-4 sm:p-8 shadow-sm">
                <div className="bg-slate-50 rounded-3xl flex flex-col items-center justify-center p-8 border border-slate-100 min-h-[250px] lg:min-h-full">
                  {/* Decorative placeholder for a featured image */}
                  <div className="w-24 h-24 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                    <Calculator size={48} />
                  </div>
                  <div className="text-slate-400 font-bold tracking-widest uppercase text-sm">SnapFreeTools Insight</div>
                </div>
                <div className="flex flex-col justify-center py-4 lg:py-8 lg:pr-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold uppercase tracking-wider">
                      {featuredArticle.category}
                    </span>
                    <span className="text-slate-400 text-sm font-medium">
                      {featuredArticle.readingTime}
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-4 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                    {featuredArticle.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3.5 rounded-xl transition-all w-max shadow-md shadow-slate-900/20"
                  >
                    Read the Full Guide <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Latest Articles */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full inline-block"></span>
              Latest from the Blog
            </h2>
            <ArticleGrid articles={latestArticles} />
          </div>

          {/* Educational Calculator Section */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[2rem] p-8 sm:p-12 mb-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">Put Your Knowledge to Work</h2>
              <p className="text-indigo-100 text-lg mb-8">
                Reading about finances and academics is a great first step. Using our free, premium calculators helps you turn that knowledge into actionable plans.
              </p>
              <Link 
                href="/calculators"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-amber-500/25"
              >
                Explore All Calculators <ArrowRight size={20} />
              </Link>
            </div>
          </div>

          {/* Popular Articles */}
          {popularArticles && popularArticles.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-rose-500 rounded-full inline-block"></span>
                Popular Reading
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularArticles.map(article => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* FAQ Section */}
          <div className="mb-8">
            <FAQSection 
              title="Frequently Asked Questions" 
              description="Learn more about the SnapFreeTools Blog and the topics we cover."
              faqs={BLOG_HUB_FAQS} 
            />
          </div>
        </>
      )}
    </div>
  );
}
