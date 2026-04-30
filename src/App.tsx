/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import WordCounter from "./pages/WordCounter";
import ImageCompressor from "./pages/ImageCompressor";
import GPACalculator from "./pages/GPACalculator";
import PDFToWord from "./pages/PDFToWord";
import About from "./pages/About";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import { motion, AnimatePresence } from "motion/react";
import React from "react";

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.main
    initial={{ opacity: 0, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -10 }}
    transition={{ duration: 0.3, ease: "easeOut" }}
    className="min-h-[calc(100vh-140px)]"
  >
    {children}
  </motion.main>
);

export default function App() {
  return (
    <Router>
      <div id="app-container" className="flex flex-col min-h-screen">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/word-counter" element={<PageTransition><WordCounter /></PageTransition>} />
            <Route path="/image-compressor" element={<PageTransition><ImageCompressor /></PageTransition>} />
            <Route path="/gpa-calculator" element={<PageTransition><GPACalculator /></PageTransition>} />
            <Route path="/pdf-to-word" element={<PageTransition><PDFToWord /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/privacy-policy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </Router>
  );
}

