"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MegaMenu from "@/components/navigation/MegaMenu";
import MobileMenu from "@/components/navigation/MobileMenu";

const navLinks = [
  { name: "Home", path: "/" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const menuTimeoutRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowMegaMenu(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setShowMegaMenu(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setShowMegaMenu(false);
    }, 150); // 150ms buffer to prevent accidental menu closures
  };

  return (
    <nav id="navbar" className="bg-white border-b border-slate-200 sticky top-0 z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center w-full">
          <div className="flex-shrink-0 md:flex-1 flex items-center justify-start">
            <Link href="/" className="flex items-center group outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-xl p-1">
              <img src="/brand/logo.svg" alt="SnapFreeTools Logo" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Nav centered */}
          <div className="hidden md:flex flex-none justify-center items-center gap-8 h-full">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 py-1 ${
                  pathname === link.path ? "text-amber-500 font-semibold" : "text-slate-600"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Calculators Mega Menu Trigger (No relative class) */}
            <div 
              className="h-full flex items-center"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href="/calculators"
                aria-expanded={showMegaMenu}
                aria-haspopup="true"
                aria-controls="desktop-mega-menu"
                className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1 h-full outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 ${
                  pathname.startsWith("/calculators") || pathname.includes("calculator") || pathname.includes("gpa-to-percentage") || pathname.includes("percentage-to-gpa")
                    ? "text-amber-500 font-semibold border-b-2 border-amber-500"
                    : "text-slate-600"
                }`}
              >
                Calculators <ChevronDown size={14} />
              </Link>
              <AnimatePresence>
                {showMegaMenu && (
                  <MegaMenu onClose={() => setShowMegaMenu(false)} />
                )}
              </AnimatePresence>
            </div>

            <Link
              key="/about"
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 py-1 ${
                pathname === "/about" ? "text-amber-500 font-semibold" : "text-slate-600"
              }`}
            >
              About
            </Link>

            <Link
              key="/contact"
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-amber-500 outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 py-1 ${
                pathname === "/contact" ? "text-amber-500 font-semibold" : "text-slate-600"
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Right Action CTA */}
          <div className="hidden md:flex items-center justify-end md:flex-1">
            <Link
              href="/calculators"
              className="bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
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
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-medium ${
                    pathname === link.path ? "text-amber-500 font-semibold bg-slate-50" : "text-slate-600 hover:text-amber-500"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Calculators Menu Accordion */}
              <MobileMenu onClose={() => setIsOpen(false)} />

              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium mt-1 ${
                  pathname === "/about" ? "text-amber-500 font-semibold bg-slate-50" : "text-slate-600 hover:text-amber-500"
                }`}
              >
                About
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  pathname === "/contact" ? "text-amber-500 font-semibold bg-slate-50" : "text-slate-600 hover:text-amber-500"
                }`}
              >
                Contact
              </Link>

              <div className="pt-4">
                <Link
                  href="/calculators"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-amber-500 text-white px-4 py-3 rounded-xl font-semibold shadow-lg shadow-amber-200"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
