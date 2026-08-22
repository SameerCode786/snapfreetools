import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, Calendar, ArrowLeft, ChevronRight } from "lucide-react";
import { getAllArticles, getArticleBySlug, getCategoryBySlug, getRelatedArticles } from "@/features/blog/utils/articleHelpers";
import ShareArticleButton from "@/features/blog/components/ShareArticleButton";
import ArticleGrid from "@/features/blog/components/ArticleGrid";
import ArticleAuthor from "@/features/blog/components/ArticleAuthor";
import TableOfContents from "@/features/blog/components/TableOfContents";
import KeyTakeaways from "@/features/blog/components/KeyTakeaways";
import ArticleNavigation from "@/features/blog/components/ArticleNavigation";
import RelatedCalculatorCard from "@/features/blog/components/RelatedCalculatorCard";
import FAQSection from "@/features/student-hub/shared/components/FAQSection";
import { JsonLd, getFAQSchema } from "@/seo/structured-data";
import { getBlogPostingSchema, getBreadcrumbSchema } from "@/features/blog/utils/seoHelpers";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: `${article.title} | SnapFreeTools Blog`,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `https://www.snapfreetools.com/blog/${article.slug}`,
    },
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      url: `https://www.snapfreetools.com/blog/${article.slug}`,
    }
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const category = getCategoryBySlug(article.category);
  const relatedArticles = getRelatedArticles(article, 3);
  const Content = article.Component;

  const breadcrumbItems = [
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Blog", url: "https://www.snapfreetools.com/blog" },
    { name: category ? category.name : article.category, url: `https://www.snapfreetools.com/blog/category/${article.category}` },
    { name: article.title, url: `https://www.snapfreetools.com/blog/${article.slug}` }
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const articleSchema = getBlogPostingSchema(article);
  const faqSchema = article.faqs ? getFAQSchema(article.faqs) : null;

  return (
    <main className="min-h-screen bg-white">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={articleSchema} />
      {faqSchema && <JsonLd schema={faqSchema} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* PREMIUM ARTICLE HEADER */}
        <header className="max-w-4xl mx-auto mb-16 text-center">
          {/* Breadcrumbs */}
          <div className="mb-8 flex items-center justify-center flex-wrap gap-2 text-sm font-medium text-slate-500">
            <Link href="/" className="hover:text-amber-500 transition-colors">Home</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link href="/blog" className="hover:text-amber-500 transition-colors">Blog</Link>
            <ChevronRight size={14} className="text-slate-300" />
            <Link href={`/blog/category/${article.category}`} className="hover:text-amber-500 transition-colors">
              {category ? category.name : article.category}
            </Link>
          </div>

          <Link 
            href={`/blog/category/${article.category}`}
            className="inline-block px-4 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-sm font-bold uppercase tracking-wider mb-6 hover:bg-amber-100 transition-colors"
          >
            {category ? category.name : article.category}
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
            {article.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 font-medium mb-8 max-w-3xl mx-auto leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-slate-500 font-medium mb-8">
            {article.author && (
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold">
                  {article.author.charAt(0)}
                </span>
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <time dateTime={article.publishedAt}>
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </time>
            </div>
            {article.updatedAt && article.updatedAt !== article.publishedAt && (
              <div className="flex items-center gap-2">
                <span className="text-sm border border-slate-200 rounded px-2 py-0.5">Updated</span>
                <time dateTime={article.updatedAt}>
                  {new Date(article.updatedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </time>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{article.readingTime}</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <ShareArticleButton 
              title={article.title}
              excerpt={article.excerpt}
              url={`https://www.snapfreetools.com/blog/${article.slug}`}
            />
          </div>
        </header>

        {/* TWO-COLUMN LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* MAIN ARTICLE CONTENT */}
          <article className="w-full lg:w-2/3 max-w-3xl mx-auto lg:mx-0">
            <KeyTakeaways takeaways={article.keyTakeaways} />
            
            <div className="bg-white border border-slate-200 rounded-[2rem] p-6 sm:p-10 shadow-sm mb-12">
              {Content ? <Content /> : <p>Article content missing.</p>}
            </div>

            {/* FAQs if present */}
            {article.faqs && article.faqs.length > 0 && (
              <div className="mb-12">
                <FAQSection 
                  title="Frequently Asked Questions" 
                  faqs={article.faqs} 
                />
              </div>
            )}

            {/* AUTHOR BLOCK */}
            <ArticleAuthor authorKey={article.author} />

            {/* ARTICLE FOOTER / NAVIGATION */}
            <div className="border-t border-slate-100 pt-8 mt-12">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-slate-500 font-bold mr-2">Topics:</span>
                  {article.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                <ShareArticleButton 
                  title={article.title}
                  excerpt={article.excerpt}
                  url={`https://www.snapfreetools.com/blog/${article.slug}`}
                />
              </div>

              <ArticleNavigation currentSlug={slug} />
            </div>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="w-full lg:w-1/3 flex flex-col gap-8">
            <TableOfContents toc={article.tableOfContents} />
            
            {/* Contextual Calculator CTA in Sidebar */}
            {article.relatedCalculators && article.relatedCalculators.length > 0 && (
              <div className="sticky top-[calc(6rem+120px)] mt-8 hidden lg:block">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Try Our Tools</h3>
                {article.relatedCalculators.slice(0, 2).map((calcSlug) => (
                  <RelatedCalculatorCard key={calcSlug} calculatorSlug={calcSlug} />
                ))}
              </div>
            )}
          </aside>

        </div>

        {/* RELATED ARTICLES FOOTER */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-16 pt-16 border-t border-slate-100 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-black text-slate-900">Keep Reading</h2>
              <Link href="/blog" className="hidden sm:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition-colors">
                View All Guides <ArrowLeft size={16} className="rotate-180" />
              </Link>
            </div>
            <ArticleGrid articles={relatedArticles} />
            <div className="mt-8 text-center sm:hidden">
              <Link href="/blog" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-bold rounded-xl transition-all w-full">
                View All Guides
              </Link>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
