import { BLOG_ARTICLES } from "../data/articles";
import { BLOG_CATEGORIES } from "../data/categories";

export function getAllArticles() {
  return BLOG_ARTICLES.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
}

export function getArticleBySlug(slug) {
  return BLOG_ARTICLES.find(article => article.slug === slug);
}

export function getFeaturedArticle() {
  return BLOG_ARTICLES.find(article => article.featured) || BLOG_ARTICLES[0];
}

export function getLatestArticles(limit = 6) {
  return getAllArticles().slice(0, limit);
}

export function getPopularArticles(limit = 4) {
  return BLOG_ARTICLES.filter(article => article.popular).slice(0, limit);
}

export function getArticlesByCategory(categorySlug) {
  return getAllArticles().filter(article => article.category === categorySlug);
}

export function getCategoryBySlug(slug) {
  return BLOG_CATEGORIES.find(cat => cat.slug === slug);
}

export function getRelatedArticles(currentArticle, limit = 3) {
  if (!currentArticle) return [];
  
  return getAllArticles()
    .filter(article => 
      article.slug !== currentArticle.slug && 
      (article.category === currentArticle.category || 
       article.tags?.some(tag => currentArticle.tags?.includes(tag)))
    )
    .slice(0, limit);
}
