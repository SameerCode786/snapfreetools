"use client";

import React, { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown, Send, CheckCircle2, MessageSquare } from "lucide-react";

export default function FeedbackCard({ toolName = "Tool", onFeedbackSubmit }) {
  const [voted, setVoted] = useState(null); // 'yes' or 'no'
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const storageKey = `sft_feedback_${toolName.toLowerCase().replace(/\s+/g, "_")}`;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setVoted(saved);
        setSubmitted(true);
      }
    }
  }, [storageKey]);

  const handleVote = (choice) => {
    setVoted(choice);
    if (typeof window !== "undefined") {
      localStorage.setItem(storageKey, choice);
    }

    if (choice === "yes") {
      setSubmitted(true);
      if (typeof onFeedbackSubmit === "function") {
        onFeedbackSubmit({ toolName, vote: "yes", comment: "" });
      }
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (typeof onFeedbackSubmit === "function") {
      onFeedbackSubmit({ toolName, vote: voted, comment });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-50/70 border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xs">
      
      <div className="flex items-center justify-center gap-2 text-slate-800">
        <MessageSquare size={18} className="text-amber-500 shrink-0" />
        <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider text-slate-900">
          Give Your Feedback
        </h3>
      </div>

      {!submitted ? (
        <div className="space-y-4 max-w-md mx-auto">
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            Was this {toolName} helpful?
          </p>

          {/* Yes / No Rating Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => handleVote("yes")}
              aria-label="Vote Yes, tool was helpful"
              className={`py-2.5 px-6 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98] ${
                voted === "yes"
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              <ThumbsUp size={16} /> Yes
            </button>

            <button
              type="button"
              onClick={() => handleVote("no")}
              aria-label="Vote No, tool needs improvement"
              className={`py-2.5 px-6 rounded-xl border font-bold text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-[0.98] ${
                voted === "no"
                  ? "bg-rose-50 border-rose-300 text-rose-700"
                  : "bg-white border-slate-200 text-slate-700 hover:border-rose-300 hover:text-rose-600"
              }`}
            >
              <ThumbsDown size={16} /> No
            </button>
          </div>

          {/* Optional Textarea if No is selected */}
          {voted === "no" && (
            <form onSubmit={handleSubmitComment} className="space-y-3 pt-2 animate-fade">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us how we can improve this tool..."
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white text-slate-800 placeholder-slate-400"
              />
              <button
                type="submit"
                className="py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <Send size={14} /> Submit Feedback
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs sm:text-sm animate-fade py-2">
          <CheckCircle2 size={18} />
          <span>Thank you for helping us improve SnapFreeTools!</span>
        </div>
      )}

    </div>
  );
}
