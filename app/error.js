"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="bg-red-50 text-red-500 p-4 rounded-3xl mb-6">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-3xl font-black text-slate-900 mb-4">Something went wrong!</h1>
      <p className="text-slate-600 max-w-md mb-8">
        An unexpected error occurred while loading this page. Please try again.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-emerald-100 hover:bg-primary-dark transition-all"
        >
          Try Again
        </button>
        <a
          href="/"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-full font-bold transition-all"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
