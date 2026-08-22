import React from "react";
import ArticleCard from "./ArticleCard";
import EmptyState from "./EmptyState";

export default function ArticleGrid({ articles, emptyMessage = "No articles found." }) {
  if (!articles || articles.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
