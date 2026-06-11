"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Image as ImageIcon, 
  Upload, 
  Download, 
  Loader2, 
  X, 
  Shield, 
  Zap, 
  RefreshCcw, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  Info,
  AlertCircle
} from "lucide-react";
import imageCompression from "browser-image-compression";
import React from "react";
import Link from "next/link";
import ToolLayout from "@/layouts/tool-layout";
import { formatSize } from "./utils/size-formatter";

export default function ImageCompressor() {
  const [activeTab, setActiveTab] = useState("compressor");
  const [selectedFile, setSelectedFile] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalPreview, setOriginalPreview] = useState(null);
  const [processedPreview, setProcessedPreview] = useState(null);
  const [quality, setQuality] = useState(0.8);
  const [targetFormat, setTargetFormat] = useState("image/jpeg");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError("File size exceeds 15MB limit. Please upload a smaller image.");
      return;
    }

    setError(null);
    setSuccess(false);
    setSelectedFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setProcessedFile(null);
    setProcessedPreview(null);

    // Auto-detect format for converter
    if (activeTab === "converter") {
      const mime = file.type;
      // If uploading same format, suggest conversion to something else
      if (mime === "image/png") setTargetFormat("image/jpeg");
      else if (mime === "image/jpeg") setTargetFormat("image/webp");
      else setTargetFormat("image/jpeg");
    }
    
    // Reset file input value to allow re-upload of same file
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setSuccess(false);
    setError(null);

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };
      
      const compressed = await imageCompression(selectedFile, options);
      setProcessedFile(compressed);
      setProcessedPreview(URL.createObjectURL(compressed));
      setSuccess(true);
    } catch (err) {
      setError("Compression failed. Please try a different image.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setSuccess(false);
    setError(null);

    try {
      const img = new Image();
      img.src = URL.createObjectURL(selectedFile);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not get canvas context");
      
      ctx.drawImage(img, 0, 0);

      const blob = await new Promise((resolve) => 
        canvas.toBlob((b) => resolve(b), targetFormat, quality)
      );

      if (blob) {
        const ext = targetFormat.split("/")[1];
        const newFile = new File([blob], `${selectedFile.name.split(".")[0]}.${ext}`, { type: targetFormat });
        setProcessedFile(newFile);
        setProcessedPreview(URL.createObjectURL(newFile));
        setSuccess(true);
      } else {
        throw new Error("Conversion resulted in an empty blob");
      }
    } catch (err) {
      setError("Conversion failed. Your browser might not support this specific format transition.");
      console.error(err);
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

  const clear = () => {
    setSelectedFile(null);
    setProcessedFile(null);
    setOriginalPreview(null);
    setProcessedPreview(null);
    setError(null);
    setSuccess(false);
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    clear();
  };

  return (
    <ToolLayout>
      <div id="image-tools-page" className="max-w-6xl mx-auto px-4">
        <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} className="hidden" />

        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-600/10 text-primary rounded-2xl mb-6">
            <ImageIcon size={28} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            SnapFree <span className="text-primary tracking-tighter">Image Tools</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            High-performance, secure, and free tools to optimize your visuals. 100% browser-based processing for maximum privacy.
          </p>
        </motion.div>

        {/* Main Tool Card */}
        <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 overflow-hidden mb-20">
          {/* Navigation Tabs */}
          <div className="flex bg-slate-50 border-b border-slate-200 p-2">
            {[
              { id: "compressor", label: "Compress Image", icon: Zap },
              { id: "converter", label: "Convert Format", icon: Layers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl text-sm font-bold transition-all ${
                  activeTab === tab.id 
                  ? "bg-white text-primary shadow-sm ring-1 ring-slate-200" 
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 md:p-12">
            <AnimatePresence mode="wait">
              {!selectedFile ? (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={triggerUpload}
                  className="group relative h-96 border-4 border-dashed border-slate-100 rounded-[32px] flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-emerald-50/30 transition-all"
                >
                  <div className="w-24 h-24 bg-emerald-50 text-primary rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Upload size={40} className="group-hover:translate-y-[-4px] transition-transform" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">Drop your image here</h2>
                  <p className="text-slate-400 font-medium">PNG, JPG, WEBP, AVIF (Max 15MB)</p>
                  <button className="mt-8 px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg shadow-emerald-100 hover:shadow-emerald-250 transition-all">
                    Browse Files
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                  {/* Left Panel: Preview & Settings */}
                  <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">1</span>
                        <h3 className="font-bold text-xl text-slate-800">Preview & Configure</h3>
                      </div>
                      <button onClick={clear} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                        <X size={24} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Original</p>
                        <div className="aspect-square rounded-3xl bg-slate-100 border border-slate-200 overflow-hidden relative group">
                          <img src={originalPreview} alt="Original" className="w-full h-full object-contain" />
                          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                            <span className="text-white text-xs font-bold">{formatSize(selectedFile?.size || 0)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Processed</p>
                        <div className="aspect-square rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden relative flex items-center justify-center">
                          {processedPreview ? (
                            <>
                              <img src={processedPreview} alt="Processed" className="w-full h-full object-contain" />
                              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-primary/80 to-transparent">
                                 <span className="text-white text-xs font-bold">{formatSize(processedFile?.size || 0)}</span>
                              </div>
                            </>
                          ) : isProcessing ? (
                            <div className="text-center">
                              <Loader2 size={40} className="animate-spin text-primary mx-auto mb-4" />
                              <p className="text-slate-400 font-bold text-sm">Processing...</p>
                            </div>
                          ) : (
                            <div className="text-center p-8">
                              <ImageIcon size={40} className="text-slate-200 mx-auto mb-4" />
                              <p className="text-slate-300 font-bold text-sm">Waiting for action</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel: Controls */}
                  <div className="lg:col-span-5 flex flex-col justify-center">
                    <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200/50">
                      <h3 className="font-bold text-lg mb-8 flex items-center gap-2">
                         <RefreshCcw size={20} className="text-primary" />
                         Settings
                      </h3>

                      {activeTab === "compressor" ? (
                        <div className="space-y-8">
                          <div>
                            <div className="flex justify-between items-center mb-4">
                              <label className="text-sm font-bold text-slate-700">Quality: {Math.round(quality * 100)}%</label>
                              {processedFile && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                  Optimized
                                </span>
                              )}
                            </div>
                            <input 
                              type="range" min="0.1" max="1" step="0.05" value={quality}
                              onChange={(e) => {
                                setQuality(parseFloat(e.target.value));
                                setProcessedFile(null); // Reset when user changes slider
                              }}
                              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between mt-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              <span>Performance</span>
                              <span>High Fidelity</span>
                            </div>
                          </div>

                          {processedFile && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white border border-slate-200 rounded-2xl text-center">
                              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Compression Result</p>
                              <div className="text-3xl font-black text-emerald-500 mb-1">
                                -{Math.round((1 - processedFile.size / selectedFile.size) * 100)}%
                              </div>
                              <p className="text-sm text-slate-600 font-medium tracking-tight">
                                Dropped from {formatSize(selectedFile.size)} to {formatSize(processedFile.size)}
                              </p>
                            </motion.div>
                          )}

                          <button
                            onClick={compressImage}
                            disabled={isProcessing}
                            className="w-full h-16 bg-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-100 hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <Zap size={20} />}
                            {isProcessing ? "Optimizing..." : "Compress Image"}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div>
                            <label className="block text-sm font-bold text-slate-700 mb-4">Target Format</label>
                            <div className="grid grid-cols-2 gap-3">
                              {["image/jpeg", "image/png", "image/webp", "image/avif"].map((fmt) => (
                                <button
                                  key={fmt}
                                  onClick={() => {
                                    setTargetFormat(fmt);
                                    setProcessedFile(null);
                                  }}
                                  className={`py-4 rounded-2xl border-2 font-bold transition-all ${
                                    targetFormat === fmt 
                                    ? "border-primary bg-emerald-50 text-primary shadow-sm" 
                                    : "border-transparent bg-white text-slate-500 hover:bg-slate-100"
                                  }`}
                                >
                                  {fmt.split("/")[1].toUpperCase()}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={convertImage}
                            disabled={isProcessing}
                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                          >
                            {isProcessing ? <Loader2 className="animate-spin" /> : <ArrowRight size={20} />}
                            {isProcessing ? "Converting..." : "Convert Now"}
                          </button>
                        </div>
                      )}

                      {success && processedFile && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={downloadImage}
                          className="w-full mt-4 h-16 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-600 transition-all flex items-center justify-center gap-3"
                        >
                          <Download size={20} />
                          Download {processedFile.name.split(".").pop()?.toUpperCase()}
                        </motion.button>
                      )}

                      {error && (
                        <div className="mt-6 flex items-start gap-2 text-red-500 p-4 bg-red-50 rounded-2xl text-xs font-bold">
                          <AlertCircle size={16} className="shrink-0" />
                          {error}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-24">
          {[
            { 
              icon: Shield, 
              color: "bg-emerald-50 text-emerald-600",
              title: "Private Processing", 
              text: "Your photos never leave your device. All calculations happen within your browser window." 
            },
            { 
              icon: Zap, 
              color: "bg-amber-50 text-amber-600",
              title: "Lightning Fast", 
              text: "Leverage standard browser APIs for near-instant results without the delays of server uploads." 
            },
            { 
              icon: CheckCircle2, 
              color: "bg-emerald-50 text-emerald-600",
              title: "Permanent Access", 
              text: "SnapFreeTools is 100% free forever. No registrations, subscriptions, or hidden limits." 
            }
          ].map((feature, i) => (
            <div key={i} className="text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{feature.text}</p>
            </div>
          ))}
        </div>

        {/* SEO Section */}
        <section className="bg-white p-10 md:p-20 rounded-[60px] border border-slate-100 shadow-sm prose prose-slate max-w-none">
          <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tight text-center md:text-left">
            Deep Dive: Professional <span className="text-primary italic">Image Optimization</span>
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 mb-4 tracking-tighter">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  What is Image Compression?
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Image compression is the science of minimizing the file size of a digital graphic without noticeably sacrificing visual clarity. Using <strong>image compressor online</strong> tools allows for faster website load times and reduced bandwidth consumption. By identifying patterns and discarding non-essential data, we can turn a 5MB photo into a 500KB asset that looks identical to the human eye.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 mb-4 tracking-tighter">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  Why Convert Images?
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Different workflows require different formats. You might need to <strong>convert PNG to JPG</strong> to remove transparency for a print job, or use a <strong>JPG to WebP converter</strong> to optimize your blog for Google PageSpeed. Every format has its strengths: PNG for lossless transparency, JPG for high-detail photos, and WebP for ultimate web performance.
                </p>
              </div>

              <div className="bg-emerald-50 p-8 rounded-[32px] border border-emerald-100">
                <h4 className="text-lg font-black text-emerald-900 mb-4 flex items-center gap-2">
                  <Info size={20} />
                  Format Comparison at a Glance
                </h4>
                <ul className="space-y-4 m-0 p-0 list-none text-emerald-800 font-medium">
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> <strong>JPG:</strong> Best for photographs; universal compatibility.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> <strong>PNG:</strong> Best for logos and graphics requiring transparency.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> <strong>WebP:</strong> The modern web standard; 26% smaller than PNG.</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span> <strong>AVIF:</strong> The next-gen format with 50% better compression than JPG.</li>
                </ul>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 mb-4 tracking-tighter">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  Difference Between JPG, PNG, WEBP and AVIF
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  While JPG is the veteran, newer formats like <strong>AVIF converter</strong> options allow for incredible detail at tiny sizes. PNG handles edges perfectly but produces bulky files. WebP is the sweet spot for modern browsers, supporting both lossy and lossless compression. <strong>Compress image online free</strong> services like SnapFreeTools let you experiment with these formats instantly to see which works best for your specific case.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold flex items-center gap-3 text-slate-800 mb-4 tracking-tighter">
                  <span className="w-2 h-8 bg-primary rounded-full"></span>
                  How SnapFreeTools Works
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our technology stack is built on the browser's native processing power. When you use our tools to optimize photos, you're using your computer's RAM and CPU, not a distant server. This architecture is not only safer but significantly faster because there is zero "waiting for upload" time. 
                </p>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-12">
                <h4 className="text-xl font-bold mb-6 text-slate-900">Recommended Internal Tools</h4>
                <div className="flex flex-wrap gap-4">
                  <Link href="/word-counter" className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all">Word Counter</Link>
                  <Link href="/gpa-calculator" className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all">GPA Calculator</Link>
                  <Link href="/pdf-to-word" className="px-5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:text-primary hover:border-primary/30 transition-all">PDF to Word</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ToolLayout>
  );
}
