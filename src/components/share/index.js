"use client";

import React from "react";
import ShareToolCard from "./components/ShareToolCard";
import ShareResultCard from "./components/ShareResultCard";

const FeedbackCard = () => null;

export { ShareToolCard, ShareResultCard, FeedbackCard };

export function isResultValid(result) {
  if (!result) return false;
  if (typeof result === "object") {
    if (result.isEmpty) return false;
    if (Object.keys(result).length === 0) return false;
    if (result.summary !== undefined && (!result.summary || (typeof result.summary === "string" && !result.summary.trim()))) {
      return false;
    }
    return true;
  }
  if (typeof result === "string" && !result.trim()) return false;
  return Boolean(result);
}

export default function ShareSystem({
  toolName = "Tool",
  toolSlug,
  result,
  customFormatter,
  hideShareTool = false,
  hideFeedback = false,
  onFeedbackSubmit
}) {
  const hasResult = isResultValid(result);

  return (
    <div className="w-full space-y-8 my-10">
      {hasResult ? (
        <ShareResultCard
          toolName={toolName}
          toolUrl={toolSlug}
          result={result}
          customFormatter={customFormatter}
        />
      ) : (
        !hideShareTool && (
          <ShareToolCard
            toolName={toolName}
            toolUrl={toolSlug}
          />
        )
      )}
    </div>
  );
}

