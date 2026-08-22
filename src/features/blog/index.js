import React from "react";
import BlogHubClient from "./components/BlogHubClient";
import { 
  getAllArticles, 
  getFeaturedArticle, 
  getLatestArticles, 
  getPopularArticles 
} from "./utils/articleHelpers";

// Strip the 'Component' property which is a function and cannot be serialized to Client Components
const stripComponent = (article) => {
  if (!article) return null;
  const { Component, ...rest } = article;
  return rest;
};

export default function BlogHubFeature() {
  const allArticles = getAllArticles().map(stripComponent);
  const featuredArticle = stripComponent(getFeaturedArticle());
  
  // Filter out the featured article from the latest articles to avoid duplication right below it
  const latestArticlesRaw = getLatestArticles(7).map(stripComponent);
  const latestArticles = latestArticlesRaw
    .filter(article => article.slug !== featuredArticle?.slug)
    .slice(0, 6);

  const popularArticles = getPopularArticles(4).map(stripComponent);

  return (
    <BlogHubClient 
      allArticles={allArticles}
      featuredArticle={featuredArticle}
      latestArticles={latestArticles}
      popularArticles={popularArticles}
    />
  );
}
