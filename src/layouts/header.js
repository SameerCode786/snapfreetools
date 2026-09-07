"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ChevronUp, Search } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import MobileMenu from "@/components/navigation/MobileMenu";
import ToolsMegaMenu from "@/components/navigation/ToolsMegaMenu";
import ResourcesDropdown from "@/components/navigation/ResourcesDropdown";

const navLinks = [
  { name: "Home", path: "/" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null); // null, "tools", "resources"
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const menuTimeoutRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setIsOpen(false);
        setIsMobileResourcesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToolsEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu("tools");
  };

  const handleToolsLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150); // 150ms buffer to prevent accidental menu closures
  };

  const handleResourcesEnter = () => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setActiveMenu("resources");
  };

  const handleResourcesLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
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

            {/* Tools Mega Menu Trigger (No relative class) */}
            <div 
              className="h-full flex items-center"
              onMouseEnter={handleToolsEnter}
              onMouseLeave={handleToolsLeave}
            >
              <Link
                href="/calculators"
                aria-expanded={activeMenu === "tools"}
                aria-haspopup="true"
                aria-controls="desktop-tools-mega-menu"
                className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1 h-full outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 ${
                  activeMenu === "tools" || pathname === "/calculators" || pathname === "/pdf-tools" || pathname.includes("calculator") || pathname.includes("pdf") || pathname.includes("word-counter") || pathname.includes("image-compressor")
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

            {/* Resources Dropdown Trigger (Relative container is needed for dropdown position) */}
            <div 
              className="h-full flex items-center relative"
              onMouseEnter={handleResourcesEnter}
              onMouseLeave={handleResourcesLeave}
            >
              <button
                aria-expanded={activeMenu === "resources"}
                aria-haspopup="true"
                className={`text-sm font-medium transition-colors hover:text-amber-500 flex items-center gap-1 h-full outline-none focus-visible:text-amber-500 focus-visible:ring-2 focus-visible:ring-amber-500/20 rounded-md px-2 ${
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
          <div className="hidden md:flex items-center justify-end md:flex-1 gap-4">
            <button 
              aria-label="Search tools"
              className="text-slate-500 hover:text-amber-500 p-2 rounded-full hover:bg-slate-50 transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer"
            >
              <Search size={18} />
            </button>
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

              {/* Mobile Tools Menu Accordion */}
              <MobileMenu onClose={() => setIsOpen(false)} />

              {/* Mobile Resources Menu Accordion */}
              <div className="border-b border-slate-50 last:border-0">
                <button
                  onClick={() => setIsMobileResourcesOpen(!isMobileResourcesOpen)}
                  aria-expanded={isMobileResourcesOpen}
                  aria-controls="mobile-resources-content"
                  className="w-full flex justify-between items-center py-2 px-3 text-sm font-bold text-slate-700 hover:text-amber-600 transition-colors outline-none"
                >
                  <span>Resources</span>
                  {isMobileResourcesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence initial={false}>
                  {isMobileResourcesOpen && (
                    <motion.div
                      id="mobile-resources-content"
                      role="region"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden pl-3 pr-1 bg-slate-50/50 rounded-xl my-1 border border-slate-100/50"
                    >
                      <div className="py-2.5 space-y-2">
                        {[
                          { name: "Blog", href: "/blog", isLive: true },
                          { name: "Guides", href: "/guides", isLive: true },
                          { name: "FAQs", href: "/faqs", isLive: true },
                          { name: "Comparisons", href: "/comparisons", isLive: true }
                        ].map((item) => {
                          if (item.isLive) {
                            return (
                              <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-between py-1.5 px-2.5 text-xs text-slate-700 hover:text-amber-600 font-semibold rounded-lg hover:bg-slate-100/50 transition-colors"
                              >
                                <span>{item.name}</span>
                              </Link>
                            );
                          }
                          return (
                            <div
                              key={item.name}
                              className="flex items-center justify-between py-1.5 px-2.5 text-xs text-slate-400 cursor-not-allowed font-semibold"
                            >
                              <span>{item.name}</span>
                              <span className="text-[7px] bg-slate-100 text-slate-500 border border-slate-200/50 px-1 py-0.2 rounded font-extrabold uppercase scale-90">Soon</span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

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
