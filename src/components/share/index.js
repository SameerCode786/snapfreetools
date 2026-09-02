"use client";

import React from "react";
import ShareToolCard from "./components/ShareToolCard";
import ShareResultCard from "./components/ShareResultCard";
import FeedbackCard from "./components/FeedbackCard";

export { ShareToolCard, ShareResultCard, FeedbackCard };

export default function ShareSystem({
  toolName = "Tool",
  toolSlug,
  result,
  customFormatter,
  hideShareTool = false,
  hideFeedback = false,
  onFeedbackSubmit
}) {
  return (
    <div className="w-full space-y-8 my-10">
      
      {/* 1. Share Tool Card (Always Visible unless explicitly hidden) */}
      {!hideShareTool && (
        <ShareToolCard
          toolName={toolName}
          toolUrl={toolSlug}
        />
      )}

      {/* 2. Share Result Card (Result-Aware: Appears only when valid result exists) */}
      <ShareResultCard
        toolName={toolName}
        toolUrl={toolSlug}
        result={result}
        customFormatter={customFormatter}
      />

      {/* 3. Give Your Feedback Card (Always Visible unless explicitly hidden) */}
      {!hideFeedback && (
        <FeedbackCard
          toolName={toolName}
          onFeedbackSubmit={onFeedbackSubmit}
        />
      )}

    </div>
  );
}
