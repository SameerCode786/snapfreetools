"use client";

import React, { useEffect, useState } from "react";
import { List } from "lucide-react";

export default function TableOfContents({ toc }) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (!toc || toc.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0% -80% 0%" }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  const handleClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Smooth scroll to element, offsetting for fixed header if any
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
      // Update URL hash without jumping
      window.history.pushState(null, "", `#${id}`);
    }
  };

  if (!toc || toc.length === 0) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm sticky top-24">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
        <List size={20} className="text-slate-400" />
        Table of Contents
      </h3>
      <nav aria-label="Table of contents">
        <ul className="space-y-3">
          {toc.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block text-sm font-medium transition-colors hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded-md px-1 py-0.5 ${
                  activeId === item.id ? "text-amber-600" : "text-slate-600"
                }`}
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
