export function getBlogPostingSchema(article) {
  if (!article) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.snapfreetools.com/blog/${article.slug}`
    },
    "headline": article.title,
    "description": article.description,
    "datePublished": article.publishedAt,
    "dateModified": article.updatedAt || article.publishedAt,
    "author": {
      "@type": "Organization",
      "name": article.author || "SnapFreeTools"
    },
    "publisher": {
      "@type": "Organization",
      "name": "SnapFreeTools",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.snapfreetools.com/brand/logo.png"
      }
    }
  };
}

export function getCollectionPageSchema(title, description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": title,
    "description": description,
    "url": url
  };
}

export function getBreadcrumbSchema(items) {
  if (!items || items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
