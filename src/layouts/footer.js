import Link from "next/link";
import { Facebook, Twitter, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="mb-4 block">
              <img src="/brand/logo.svg" alt="SnapFreeTools Logo" className="h-10 w-auto brightness-0 invert" />
            </Link>
            <p className="text-slate-400 max-w-sm mb-6">
              Our mission is to provide the fastest, cleanest, and most accessible online tools for everyone. 
              No signups, no fees, just productivity.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Mail size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Popular Tools</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/word-counter" className="hover:text-white">Word Counter</Link></li>
              <li><Link href="/image-compressor" className="hover:text-white">Image Compressor</Link></li>
              <li><Link href="/gpa-calculator" className="hover:text-white">GPA Calculator</Link></li>
              <li><Link href="/pdf-to-word" className="hover:text-white">PDF to Word</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© 2026 SnapFreeTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
