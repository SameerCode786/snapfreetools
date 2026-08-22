import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BLOG_CATEGORIES } from "@/features/blog/data/categories";
import { getArticlesByCategory, getCategoryBySlug } from "@/features/blog/utils/articleHelpers";
import ArticleGrid from "@/features/blog/components/ArticleGrid";
import CategoryNav from "@/features/blog/components/CategoryNav";
import { JsonLd } from "@/seo/structured-data";
import { getCollectionPageSchema, getBreadcrumbSchema } from "@/features/blog/utils/seoHelpers";

export async function generateStaticParams() {
  return BLOG_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: `${category.name} Articles & Guides | SnapFreeTools Blog`,
    description: category.description,
    alternates: {
      canonical: `https://www.snapfreetools.com/blog/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory(slug);

  const breadcrumbItems = [
    { name: "Home", url: "https://www.snapfreetools.com" },
    { name: "Blog", url: "https://www.snapfreetools.com/blog" },
    { name: category.name, url: `https://www.snapfreetools.com/blog/category/${category.slug}` }
  ];

  const breadcrumbSchema = getBreadcrumbSchema(breadcrumbItems);
  const collectionSchema = getCollectionPageSchema(
    `${category.name} Articles`,
    category.description,
    `https://www.snapfreetools.com/blog/category/${category.slug}`
  );

  return (
    <main className="min-h-screen bg-white py-12">
      <JsonLd schema={breadcrumbSchema} />
      <JsonLd schema={collectionSchema} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/blog" className="hover:text-amber-500 transition-colors flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Hub
          </Link>
        </div>

        <header className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 sm:p-12 shadow-sm mb-12 text-center max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-6">
            {category.name}
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">
            {category.description}
          </p>
        </header>

        <CategoryNav activeCategorySlug={slug} />

        <div className="mb-16">
          <ArticleGrid 
            articles={articles} 
            emptyMessage={`We're currently writing new guides for ${category.name}. Check back soon!`}
          />
        </div>
      </div>
    </main>
  );
}
