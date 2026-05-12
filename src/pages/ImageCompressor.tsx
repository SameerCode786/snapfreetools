import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Image as ImageIcon, Upload, Download, Loader2, X, Shield, Zap, FileJson, RefreshCcw, Layers } from "lucide-react";
import imageCompression from "browser-image-compression";
import React from "react";
import { Link } from "react-router-dom";

type Tab = "compressor" | "converter";
type ImageFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export default function ImageCompressor() {
  const [activeTab, setActiveTab] = useState<Tab>("compressor");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [targetFormat, setTargetFormat] = useState<ImageFormat>("image/jpeg");

  useEffect(() => {
    document.title = "Image Compressor & Converter – Compress and Convert Images Online Free | SnapFreeTools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Compress and convert JPG, PNG, WEBP, and AVIF images online free without losing quality using SnapFreeTools. Safe, secure, and fast browser-side processing.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setProcessedFile(null);

      // Auto activate target format tab based on uploaded file type for converter
      if (activeTab === "converter") {
        if (file.type === "image/png") setTargetFormat("image/jpeg");
        else if (file.type === "image/jpeg") setTargetFormat("image/png");
        else setTargetFormat("image/jpeg");
      }
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };
      
      const compressed = await imageCompression(selectedFile, options);
      setProcessedFile(compressed);
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise<Blob | null>((resolve) => 
        canvas.toBlob((b) => resolve(b), targetFormat, quality)
      );

      if (blob) {
        const ext = targetFormat.split("/")[1];
        const newFile = new File([blob], `${selectedFile.name.split(".")[0]}.${ext}`, { type: targetFormat });
        setProcessedFile(newFile);
      }
    } catch (error) {
      console.error("Conversion failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = processedFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const clear = () => {
    setSelectedFile(null);
    setProcessedFile(null);
    setPreview(null);
  };

  const switchTab = (tab: Tab) => {
    setActiveTab(tab);
    clear();
  };

  return (
    <div id="image-tools-page" className="max-w-5xl mx-auto px-4 py-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 text-primary rounded-xl mb-4">
          <ImageIcon size={24} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Image Compressor & Converter</h1>
        <p className="text-slate-600">Securely compress and convert your images directly in your browser.</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="bg-slate-100 p-1 rounded-2xl flex gap-1">
          <button
            onClick={() => switchTab("compressor")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "compressor" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Compressor
          </button>
          <button
            onClick={() => switchTab("converter")}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "converter" ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Converter
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div 
            key={activeTab + "-upload"}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center hover:border-primary transition-colors cursor-pointer group relative"
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <Upload className="text-slate-400 group-hover:text-primary" size={32} />
            </div>
            <p className="text-xl font-bold text-slate-800 mb-2">
              Click or drag image to {activeTab === "compressor" ? "compress" : "convert"}
            </p>
            <p className="text-slate-500 text-sm">Supports PNG, JPG, WebP, AVIF • Processed locally in browser</p>
          </motion.div>
        ) : (
          <motion.div 
            key={activeTab + "-editor"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm transition-all"
          >
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-50 text-primary flex items-center justify-center text-sm">1</span>
                {activeTab === "compressor" ? "Step 2: Optimize Settings" : "Step 2: Choose Format"}
              </h3>
              <button onClick={clear} className="text-slate-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors"><X size={24} /></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column: Preview */}
              <div className="space-y-6">
                <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-square md:aspect-video flex items-center justify-center relative group">
                  <img src={preview!} alt="Preview" className="max-h-full object-contain" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold uppercase tracking-widest px-3 py-1 border border-white/40 rounded-full">Preview</span>
                  </div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center text-sm border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-slate-500 font-medium">Original File</span>
                    <span className="font-bold text-slate-700">{selectedFile.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 font-medium tracking-tight">Size:</span>
                    <span className="ml-2 px-2 py-0.5 bg-white border border-slate-200 rounded-md font-bold">{formatSize(selectedFile.size)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: controls */}
              <div className="space-y-8">
                {activeTab === "compressor" ? (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-sm font-bold text-slate-700">Quality: {Math.round(quality * 100)}%</label>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Adjust Slider</span>
                    </div>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1" 
                      step="0.05" 
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-bold uppercase">
                      <span>Performance</span>
                      <span>Best Quality</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-4">Select Target Format</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { label: "JPG", value: "image/jpeg" },
                        { label: "PNG", value: "image/png" },
                        { label: "WEBP", value: "image/webp" },
                        { label: "AVIF", value: "image/avif" }
                      ] as const).map((format) => (
                        <button
                          key={format.value}
                          onClick={() => setTargetFormat(format.value)}
                          className={`py-3 px-4 rounded-xl border-2 font-bold transition-all text-center ${
                            targetFormat === format.value 
                            ? "border-primary bg-blue-50 text-primary shadow-sm" 
                            : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
                          }`}
                        >
                          {format.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {processedFile ? (
                    <motion.div 
                      key="processed"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 bg-blue-50 border border-blue-100 rounded-2xl relative overflow-hidden"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-blue-800 text-sm font-bold flex items-center gap-1.5 uppercase tracking-wide">
                          <Zap size={14} /> Ready for Download
                        </span>
                        <span className="text-primary font-black text-lg">{formatSize(processedFile.size)}</span>
                      </div>

                      {activeTab === "compressor" && (
                        <div className="space-y-2 mb-6">
                          <div className="bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(processedFile.size / selectedFile.size) * 100}%` }}
                              className="bg-primary h-full"
                            ></motion.div>
                          </div>
                          <p className="text-xs text-blue-600 font-bold flex justify-between items-center">
                            <span>Efficiency</span>
                            <span>-{Math.round((1 - processedFile.size / selectedFile.size) * 100)}% Smaller</span>
                          </p>
                        </div>
                      )}

                      <button
                        onClick={downloadImage}
                        className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
                      >
                        <Download size={20} />
                        Download {processedFile.name.split(".").pop()?.toUpperCase()}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.button
                      key="action"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={activeTab === "compressor" ? compressImage : convertImage}
                      disabled={isProcessing}
                      className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Processing Image...
                        </>
                      ) : (
                        <>
                          <RefreshCcw size={20} />
                          {activeTab === "compressor" ? "Compress Image Now" : `Convert to ${targetFormat.split("/")[1].toUpperCase()}`}
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Features / SEO Section */}
      <div className="mt-24 space-y-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield size={28} />
            </div>
            <h3 className="text-lg font-bold mb-3">Privacy First</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We never upload your images to our servers. All processing happens locally in your browser.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-lg font-bold mb-3">Lightning Fast</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Experience instant compression and conversion without wait times or server latency.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Layers size={28} />
            </div>
            <h3 className="text-lg font-bold mb-3">Multi-Format Support</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Seamlessly handle JPG, PNG, WEBP, and even the modern AVIF format in one tool.
            </p>
          </div>
        </div>

        {/* SEO Long Content */}
        <section className="bg-white p-10 md:p-16 rounded-[40px] border border-slate-100 shadow-sm prose prose-slate max-w-none">
          <h2 className="text-3xl font-black text-slate-900 mb-8 border-b border-slate-100 pb-4">
            Master Your Visual Assets with SnapFreeTools
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                What is Image Compression?
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Image compression is the process of reducing the file size of a digital image without significantly compromising its visual quality. At SnapFreeTools, we use advanced algorithms that identify and remove redundant data patterns. This results in faster loading websites, reduced storage costs, and better SEO performance for your digital projects.
              </p>

              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                How Image Conversion Works
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Conversion is the act of changing an image from one encoded format to another (e.g., transforming a PNG to a WEBP). Our tool decodes the original pixel data and re-encodes it into the target format of your choice, ensuring transparency, color depth, and metadata are handled according to your preferences.
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2 text-primary">
                <span className="w-2 h-6 bg-primary rounded-full"></span>
                Why Choose SnapFreeTools?
              </h3>
              <ul className="space-y-3 list-none p-0">
                {[
                  "100% Free: No subscriptions or hidden fees ever.",
                  "Zero Uploads: Your sensitive data stays on your machine.",
                  "Professional Grade: High-quality output suitable for production use.",
                  "Batch-Ready: Designed for speed and minimal clicks."
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 items-start text-slate-600">
                    <CheckCircle className="text-emerald-500 mt-1 flex-shrink-0" size={18} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <p className="text-sm font-bold text-blue-900 mb-2">Pro Tip:</p>
                <p className="text-xs text-blue-800">
                  Use the <strong>WEBP</strong> format for web development to get the best of both worlds: small file sizes and transparency support similar to PNG.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">Supported Formats</h3>
              <div className="flex flex-wrap gap-2">
                {["JPG", "PNG", "WEBP", "AVIF", "SVG", "GIF"].map(fmt => (
                  <span key={fmt} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">{fmt}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Related Tools</h3>
              <div className="flex flex-wrap gap-4">
                <Link to="/word-counter" className="text-sm text-primary font-bold hover:underline">Word Counter</Link>
                <Link to="/gpa-calculator" className="text-sm text-primary font-bold hover:underline">GPA Calculator</Link>
                <Link to="/pdf-to-word" className="text-sm text-primary font-bold hover:underline">PDF to Word</Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CheckCircle({ className, size }: { className?: string, size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

