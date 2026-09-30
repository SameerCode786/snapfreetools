"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Search, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import MobileMenu from "@/components/navigation/MobileMenu";
import ToolsMegaMenu from "@/components/navigation/ToolsMegaMenu";
import AIToolsMegaMenu from "@/components/navigation/AIToolsMegaMenu";
import ResourcesDropdown from "@/components/navigation/ResourcesDropdown";

const SearchModal = dynamic(() => import("@/components/navigation/SearchModal"));

const navLinks = [{ name: "Home", path: "/" }];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // null, "tools", "ai-tools", "resources"
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const pathname = usePathname();

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setActiveMenu(null);
        setIsOpen(false);
        setIsSearchOpen(false);
        setIsMobileResourcesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMenuEnter = (menuName) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu(menuName);
  };

  const handleMenuLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150); // 150ms buffer to prevent accidental menu closures
  };

  return (
    <>
      <nav id="navbar" className="bg-white border-b border-slate-200 sticky top-0 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center w-full">
            {/* Left: Brand Logo */}
            <div className="flex-shrink-0 md:flex-1 flex items-center justify-start">
              <Link
                href="/"
                className="flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-xl p-1"
              >
                <img src="/brand/logo.svg" alt="SnapFreeTools Logo" className="h-10 w-auto" />
              </Link>
            </div>

            {/* Center: Primary Desktop Navigation */}
            <div className="hidden md:flex flex-none justify-center items-center gap-7 h-full">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 rounded-md px-2 py-1 ${
                    pathname === link.path ? "text-amber-500 font-semibold" : "text-slate-600"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Tools Mega Menu Trigger */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => handleMenuEnter("tools")}
                onMouseLeave={handleMenuLeave}
              >
                <Link
                  href="/calculators"
                  aria-expanded={activeMenu === "tools"}
                  aria-haspopup="true"
                  aria-controls="desktop-tools-mega-menu"
                  className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1 h-full outline-none focus-visible:text-amber-500 rounded-md px-2 ${
                    activeMenu === "tools" ||
                    pathname === "/calculators" ||
                    pathname === "/pdf-tools" ||
                    pathname.includes("calculator") ||
                    pathname.includes("pdf")
                      ? "text-amber-500 font-semibold border-b-2 border-amber-500"
                      : "text-slate-600"
                  }`}
                >
                  Tools <ChevronDown size={14} />
                </Link>
                <AnimatePresence>
                  {activeMenu === "tools" && (
                    <ToolsMegaMenu onClose={() => setActiveMenu(null)} />
                  )}
                </AnimatePresence>
              </div>

              {/* AI Tools Mega Menu Trigger */}
              <div
                className="h-full flex items-center"
                onMouseEnter={() => handleMenuEnter("ai-tools")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  aria-expanded={activeMenu === "ai-tools"}
                  aria-haspopup="true"
                  aria-controls="desktop-ai-tools-mega-menu"
                  className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1.5 h-full outline-none focus-visible:text-amber-500 rounded-md px-2 ${
                    activeMenu === "ai-tools" || pathname.includes("ai-tools")
                      ? "text-amber-500 font-semibold border-b-2 border-amber-500"
                      : "text-slate-600"
                  }`}
                >
                  <Sparkles size={13} className="text-amber-500" />
                  AI Tools <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {activeMenu === "ai-tools" && (
                    <AIToolsMegaMenu onClose={() => setActiveMenu(null)} />
                  )}
                </AnimatePresence>
              </div>

              {/* Resources Dropdown Trigger */}
              <div
                className="h-full flex items-center relative"
                onMouseEnter={() => handleMenuEnter("resources")}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  type="button"
                  aria-expanded={activeMenu === "resources"}
                  aria-haspopup="true"
                  className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1 h-full outline-none focus-visible:text-amber-500 rounded-md px-2 ${
                    activeMenu === "resources"
                      ? "text-amber-500 font-semibold border-b-2 border-amber-500"
                      : "text-slate-600"
                  }`}
                >
                  Resources <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {activeMenu === "resources" && (
                    <ResourcesDropdown />
                  )}
                </AnimatePresence>
              </div>

              <Link
                key="/about"
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 rounded-md px-2 py-1 ${
                  pathname === "/about" ? "text-amber-500 font-semibold" : "text-slate-600"
                }`}
              >
                About
              </Link>

              <Link
                key="/contact"
                href="/contact"
                className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 rounded-md px-2 py-1 ${
                  pathname === "/contact" ? "text-amber-500 font-semibold" : "text-slate-600"
                }`}
              >
                Contact
              </Link>
            </div>

            {/* Right: Actions Cluster (Search & Get Started) */}
            <div className="hidden md:flex items-center justify-end md:flex-1 gap-3">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search tools (Press Cmd+K or Ctrl+K)"
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-800 py-2 px-3.5 rounded-full text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
              >
                <Search size={15} className="text-amber-500" />
                <span>Search...</span>
                <span className="text-[9px] font-black text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md uppercase">
                  ⌘K
                </span>
              </button>

              <Link
                href="/calculators"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-full text-xs font-extrabold transition-all shadow-md shadow-amber-500/10 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu toggle button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close main menu" : "Open main menu"}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-menu"
                className="text-slate-600 hover:text-amber-500 p-2"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation-menu"
              role="navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                {/* Mobile Search Input Trigger */}
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-2xl text-xs font-bold text-slate-500"
                >
                  <span className="flex items-center gap-2">
                    <Search size={16} className="text-amber-500" /> Search 40+ Tools...
                  </span>
                  <span className="text-[9px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-black text-slate-400">
                    ⌘K
                  </span>
                </button>

                {/* Mobile Tools & AI Tools Accordions */}
                <MobileMenu onClose={() => setIsOpen(false)} />

                <Link
                  href="/about"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${
                    pathname === "/about"
                      ? "text-amber-500 font-semibold bg-slate-50"
                      : "text-slate-600 hover:text-amber-500"
                  }`}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${
                    pathname === "/contact"
                      ? "text-amber-500 font-semibold bg-slate-50"
                      : "text-slate-600 hover:text-amber-500"
                  }`}
                >
                  Contact
                </Link>

                <div className="pt-2">
                  <Link
                    href="/calculators"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-amber-500 text-slate-950 px-4 py-3 rounded-xl font-extrabold text-sm shadow-md"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Global Search Modal Overlay */}
      {isSearchOpen && (
        <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      )}
    </>
  );
}
