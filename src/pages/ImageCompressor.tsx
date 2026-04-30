import { useState } from "react";
import { motion } from "motion/react";
import { Image as ImageIcon, Upload, Download, Loader2, X, Shield, Zap } from "lucide-react";
import imageCompression from "browser-image-compression";
import React from "react";

export default function ImageCompressor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.8);

  React.useEffect(() => {
    document.title = "Image Compressor – Free Online Tool | SnapFreeTools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Compress JPG, PNG, and WebP images online for free without losing quality. Your images never leave your browser for maximum privacy.");
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setCompressedFile(null);
    }
  };

  const compressImage = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: quality,
      };
      
      const compressed = await imageCompression(selectedFile, options);
      setCompressedFile(compressed);
    } catch (error) {
      console.error("Compression failed:", error);
    } finally {
      setIsCompressing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;
    const url = URL.createObjectURL(compressedFile);
    const link = document.createElement("a");
    link.href = url;
    link.download = `compressed_${selectedFile?.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatSize = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + " KB";
  };

  const clear = () => {
    setSelectedFile(null);
    setCompressedFile(null);
    setPreview(null);
  };

  return (
    <div id="image-compressor-page" className="max-w-4xl mx-auto px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl mb-4">
          <ImageIcon size={24} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Image Compressor</h1>
        <p className="text-slate-600">Securely compress your images in the browser.</p>
      </motion.div>

      {!selectedFile ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center hover:border-emerald-500 transition-colors cursor-pointer group relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-slate-400 group-hover:text-emerald-500" />
          </div>
          <p className="text-lg font-medium text-slate-700">Click or drag image to upload</p>
          <p className="text-slate-500 text-sm mt-1">Supports PNG, JPG, WebP</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Image Preview</h3>
            <button onClick={clear} className="text-slate-400 hover:text-red-500"><X size={24} /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 aspect-video flex items-center justify-center">
                <img src={preview!} alt="Preview" className="max-h-full object-contain" />
              </div>
              <div className="flex justify-between text-sm px-2">
                <span className="text-slate-500">Original Size:</span>
                <span className="font-bold">{formatSize(selectedFile.size)}</span>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Compression Quality: {Math.round(quality * 100)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1" 
                  step="0.1" 
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {compressedFile ? (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-emerald-800 text-sm font-medium">New Size:</span>
                    <span className="text-emerald-600 font-bold">{formatSize(compressedFile.size)}</span>
                  </div>
                  <div className="bg-emerald-200 h-1 rounded-full mb-1">
                    <div 
                      className="bg-emerald-600 h-full rounded-full" 
                      style={{ width: `${(compressedFile.size / selectedFile.size) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-emerald-700 uppercase tracking-widest font-bold">
                    Reduced by {Math.round((1 - compressedFile.size / selectedFile.size) * 100)}%
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                {!compressedFile ? (
                  <button
                    onClick={compressImage}
                    disabled={isCompressing}
                    className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                  >
                    {isCompressing ? <Loader2 className="animate-spin" /> : <Loader2 className="hidden" />}
                    {isCompressing ? "Compressing..." : "Apply Compression"}
                  </button>
                ) : (
                  <button
                    onClick={downloadImage}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-emerald-600">
            <Shield size={18} />
            Privacy First
          </h4>
          <p className="text-sm text-slate-600">
            Your images are processed entirely in your browser. We never upload your files to our servers.
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h4 className="font-bold mb-3 flex items-center gap-2 text-emerald-600">
            <Zap size={18} />
            Lossless Options
          </h4>
          <p className="text-sm text-slate-600">
            Adjust the quality slider to find the perfect balance between file size and visual clarity.
          </p>
        </div>
      </div>
    </div>
  );
}
