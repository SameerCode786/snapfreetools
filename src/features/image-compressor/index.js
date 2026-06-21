"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Image as ImageIcon,
  Upload,
  Download,
  Loader2,
  X,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Info,
  AlertCircle,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Lock,
  Plus,
  Trash2
} from "lucide-react";
import React from "react";
import Link from "next/link";
import ToolLayout from "@/layouts/tool-layout";
import { formatSize } from "./utils/size-formatter";

// --- STATIC CONFIGURATIONS ---

const TARGET_SIZE_OPTIONS = [
  { label: "Auto Optimize", value: "auto" },
  { label: "20 KB", value: 20480 },
  { label: "50 KB", value: 51200 },
  { label: "100 KB", value: 102400 },
  { label: "200 KB", value: 204800 },
  { label: "500 KB", value: 512000 },
  { label: "1 MB", value: 1048576 }
];

const FORMAT_OPTIONS = [
  { label: "JPG", value: "image/jpeg" },
  { label: "PNG", value: "image/png" },
  { label: "WEBP", value: "image/webp" },
  { label: "AVIF", value: "image/avif" }
];

const CONVERTER_QUALITY_OPTIONS = [
  { label: "Maximum Quality", value: 0.95 },
  { label: "High Quality", value: 0.85 },
  { label: "Balanced", value: 0.70 },
  { label: "Maximum Compression", value: 0.55 }
];

const TRUST_BADGES = [
  { label: "100% Browser Based", icon: Shield },
  { label: "Private Processing", icon: Lock },
  { label: "No Upload Required", icon: Shield },
  { label: "No Watermarks", icon: CheckCircle2 },
  { label: "Unlimited Usage", icon: Zap },
  { label: "Free Forever", icon: CheckCircle2 }
];

const FORMAT_EDUCATION = [
  {
    format: "JPG",
    compression: "Lossy",
    quality: "Adjustable (10-100%)",
    transparency: "No",
    speed: "Fastest",
    seo: "Excellent for photographs",
    useCases: "Standard digital photos, complex color images",
    isRecommended: false
  },
  {
    format: "PNG",
    compression: "Lossless",
    quality: "Fixed resolution",
    transparency: "Yes",
    speed: "Moderate",
    seo: "Heavy for large pages",
    useCases: "Logos, screenshots, graphics with transparency",
    isRecommended: false
  },
  {
    format: "WEBP",
    compression: "Lossy / Lossless",
    quality: "Adjustable (10-100%)",
    transparency: "Yes",
    speed: "Fast",
    seo: "Outstanding (Google preferred)",
    useCases: "Optimizing website graphics, blog posts, general UI",
    isRecommended: true
  },
  {
    format: "AVIF",
    compression: "Lossy / Lossless",
    quality: "Adjustable (10-100%)",
    transparency: "Yes",
    speed: "Slow (Heavy encode)",
    seo: "Ultimate speed rankings",
    useCases: "Maximum compression for modern platforms",
    isRecommended: true
  }
];

const GEO_CARDS = [
  {
    q: "What is an image compressor?",
    a: "An image compressor is a software tool that reduces the file size of digital graphics by removing redundant pixel data or utilizing advanced lossy/lossless algorithms, facilitating faster web load speeds."
  },
  {
    q: "How do I compress an image without losing quality?",
    a: "To compress an image without visible quality loss, use modern formats like WebP or AVIF at 80% quality, or use lossless PNG compression, which shrinks files by optimizing code structures."
  },
  {
    q: "What format is best for websites?",
    a: "WebP is the best format for websites. It supports transparency and lossy compression, resulting in file sizes 25-35% smaller than JPEG while maintaining high visual quality across browsers."
  },
  {
    q: "How can I reduce image size to 100KB?",
    a: "Upload your image to SnapFreeTools, select WebP or JPEG, choose the 100KB target size option, and our local browser engine will automatically adjust compression parameters to hit 100KB."
  }
];

const FAQS_DATA = [
  {
    question: "How do I compress an image to 20KB online free?",
    answer: "Upload your image to SnapFreeTools, select '20KB' from the Target File Size option, and click compress. Our binary search engine will automatically adjust quality variables client-side to output a file as close to 20KB as possible."
  },
  {
    question: "Can I compress an image to 50KB without losing quality?",
    answer: "Yes. By choosing the 50KB target size option, our client-side compression algorithm adjusts the parameters to maintain high fidelity while cutting file size down to 50KB. WebP or AVIF are best for this range."
  },
  {
    question: "What is the best way to compress images to 100KB?",
    answer: "Select the '100KB' target size preset. For photos, converting the file to WebP or JPG at 80% quality will usually drop the size below 100KB instantly while preserving high-definition details."
  },
  {
    question: "How can I reduce image size to 200KB for online forms?",
    answer: "Select the '200KB' target size option and compress. The browser will process the image locally and download the optimized version immediately, ensuring you meet strict online upload portals limits."
  },
  {
    question: "Can I compress high-resolution photos to 1MB?",
    answer: "Yes. High-resolution camera photos (often 10MB+) can easily be compressed to 1MB by uploading them in bulk and using our 1MB target preset to clear email or portal submission thresholds."
  },
  {
    question: "What is the difference between JPG and PNG format?",
    answer: "JPG is a lossy format best for photographic images where tiny details can be discarded to save space. PNG is a lossless format that supports transparent backgrounds, making it ideal for logos."
  },
  {
    question: "Why is WebP better than JPG for websites?",
    answer: "WebP is a modern web standard that achieves 25% to 35% smaller file sizes than JPG at equivalent visual quality, helping speed up loading times and improve your Google SEO rankings."
  },
  {
    question: "Should I convert my images to WebP or AVIF?",
    answer: "AVIF provides superior next-generation compression (saving up to 50% over JPG), but WebP has slightly wider browser support. Both are excellent choices for modern SEO image optimization."
  },
  {
    question: "What is the best image format for SEO performance?",
    answer: "WebP is the industry standard for SEO as it is officially recommended by Google PageSpeed tools. AVIF is also highly effective for improving Largest Contentful Paint (LCP) scores."
  },
  {
    question: "How does browser-side image compression work?",
    answer: "Our tool processes your images directly on your device using native browser APIs like HTML5 Canvas and FileReader. This guarantees absolute privacy since your files never leave your computer."
  },
  {
    question: "Is it safe to upload my private photos to SnapFreeTools?",
    answer: "Absolutely. SnapFreeTools works 100% inside your web browser. No files are uploaded to any server, meaning your sensitive images, screenshots, and profiles remain entirely private."
  },
  {
    question: "Can I convert JPG to PNG and PNG to JPG here?",
    answer: "Yes, our online tool works as a robust image converter. You can change JPG to PNG, PNG to JPG, JPG to WebP, WebP to JPG, and convert AVIF formats instantly."
  },
  {
    question: "How do I convert images to WebP on mobile?",
    answer: "Simply open SnapFreeTools on your mobile browser, select WebP as your target format, upload your photos, and download the converted results. It works on all Android and iOS systems."
  },
  {
    question: "What is the difference between lossy and lossless compression?",
    answer: "Lossy compression permanently discards non-critical image data to yield tiny file sizes. Lossless compression shrinks files without removing any data, ensuring identical visual replication."
  },
  {
    question: "Why is PNG recommended for logos and screenshots?",
    answer: "PNG is lossless and preserves sharp edges, text, and transparent backgrounds. Applying lossy compression to logos can cause visual artifacts and blurry boundaries."
  },
  {
    question: "Can I batch compress multiple images at once?",
    answer: "Yes, our suite supports bulk uploads. You can upload multiple images, apply settings globally or individually, and compress or download them all at once."
  },
  {
    question: "What is aspect ratio and why does it matter?",
    answer: "Aspect ratio is the width-to-height proportion (e.g. 16:9). Maintaining the original aspect ratio prevents images from stretching or squeezing during dimensions adjustments."
  },
  {
    question: "Why does my compressed image look blurry?",
    answer: "This happens if you request aggressive compression targets (like 20KB for a large poster). The engine must lower the visual quality to hit your size target, resulting in soft pixelation."
  },
  {
    question: "Does converting PNG to WebP preserve transparency?",
    answer: "Yes, WebP fully supports alpha-channel transparency, allowing you to reduce the file sizes of transparent graphics while maintaining their cut-out backgrounds."
  },
  {
    question: "Is AVIF supported by all web browsers?",
    answer: "AVIF is supported by over 93% of modern browsers, including Chrome, Firefox, Safari, and Edge. If a user's browser does not support AVIF, our tool gracefully falls back to WebP."
  }
];

// --- HELPER UTILITIES ---

function detectFormat(mimeType, filename) {
  if (mimeType) {
    if (mimeType.includes("jpeg") || mimeType.includes("jpg")) return "JPG";
    if (mimeType.includes("png")) return "PNG";
    if (mimeType.includes("webp")) return "WEBP";
    if (mimeType.includes("avif")) return "AVIF";
  }
  if (filename) {
    const ext = filename.split(".").pop().toUpperCase();
    if (ext === "JPEG" || ext === "JPG") return "JPG";
    if (ext === "PNG") return "PNG";
    if (ext === "WEBP") return "WEBP";
    if (ext === "AVIF") return "AVIF";
  }
  return "JPG";
}

function getRecommendedFormat(format, hasTransparency, size) {
  if (size < 100 * 1024) {
    return {
      format: format,
      reason: "No Compression Needed (Already optimized under 100KB)."
    };
  }
  if (format === "PNG") {
    if (hasTransparency) {
      return {
        format: "PNG",
        reason: "PNG or WEBP (Transparencies & lossless details preserved)."
      };
    } else {
      return {
        format: "WEBP",
        reason: "WEBP (Lighter web standard)."
      };
    }
  }
  if (format === "WEBP") {
    return {
      format: "WEBP",
      reason: "Keep WEBP (Format is already highly optimized)."
    };
  }
  if (format === "JPG" && size > 2 * 1024 * 1024) {
    return {
      format: "AVIF",
      reason: "AVIF (Superior optimization for files larger than 2MB)."
    };
  }
  return {
    format: "WEBP",
    reason: "WEBP (Optimal balance of loading speeds & Google SEO)."
  };
}

function getCompressionRecommendation(size, mp, width, height) {
  if (size < 150 * 1024 && mp < 1.5 && width < 1600 && height < 1600) {
    return {
      label: "Already Optimized",
      reason: "This image is already efficiently optimized for web delivery."
    };
  }
  if (size > 1.5 * 1024 * 1024 || mp >= 3.0 || width > 2500 || height > 2500) {
    return {
      label: "High Impact Compression Available",
      reason: "Large image detected. Significant file size reduction is possible."
    };
  }
  return {
    label: "Compression Recommended",
    reason: "This image can be compressed to improve loading performance."
  };
}

function getRecommendedTargetLabel(size) {
  if (size < 200 * 1024) {
    return "No Compression Needed";
  }
  if (size <= 1024 * 1024) {
    return "Recommended: 200 KB (Best for websites)";
  }
  if (size <= 3 * 1024 * 1024) {
    return "Recommended: 500 KB (Balanced quality & size)";
  }
  if (size <= 10 * 1024 * 1024) {
    return "Recommended: 1 MB (High quality optimization)";
  }
  return "Recommended: 1 MB (Large file detected)";
}

function getSliderExplanation(q) {
  if (q <= 0.4) return "Aggressive: Maximum reduction, lower quality";
  if (q <= 0.6) return "Balanced: Best balance between quality and size";
  if (q <= 0.8) return "High: Recommended for websites";
  return "Maximum: Near-original quality";
}

function getCompressionEstimates(originalSize, quality, targetSizeOption) {
  if (targetSizeOption !== "auto") {
    const targetBytes = Number(targetSizeOption);
    const estSize = Math.min(originalSize, targetBytes);
    const estSavings = Math.max(0, Math.round((1 - estSize / originalSize) * 100));
    return {
      size: estSize,
      savings: estSavings
    };
  } else {
    const factor = 0.15 + (quality * quality * 0.70);
    const estSize = Math.round(originalSize * factor);
    const estSavings = Math.max(5, Math.round((1 - factor) * 100));
    return {
      size: estSize,
      savings: estSavings
    };
  }
}

function getQualityPresetLabel(q) {
  if (q <= 0.4) return "Aggressive (40% Quality)";
  if (q <= 0.6) return "Balanced (60% Quality)";
  if (q <= 0.8) return "High (80% Quality)";
  return "Maximum Quality (100% Quality)";
}

function getQualityGrade(q) {
  if (q >= 0.9) return { grade: "A+", color: "bg-emerald-100 text-emerald-800 border-emerald-200" };
  if (q >= 0.8) return { grade: "A", color: "bg-teal-100 text-teal-800 border-teal-200" };
  if (q >= 0.6) return { grade: "B", color: "bg-amber-100 text-amber-800 border-amber-200" };
  return { grade: "C", color: "bg-rose-100 text-rose-800 border-rose-200" };
}

function getAspectRatio(width, height) {
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const divisor = gcd(width, height);
  const wRatio = width / divisor;
  const hRatio = height / divisor;

  const decimal = width / height;
  if (Math.abs(decimal - 1.777) < 0.02) return "16:9";
  if (Math.abs(decimal - 1.333) < 0.02) return "4:3";
  if (Math.abs(decimal - 1.5) < 0.02) return "3:2";
  if (Math.abs(decimal - 1.0) < 0.02) return "1:1";
  if (Math.abs(decimal - 1.6) < 0.02) return "16:10";
  if (Math.abs(decimal - 2.333) < 0.02) return "21:9";
  if (Math.abs(decimal - 1.25) < 0.02) return "5:4";

  return wRatio < 50 && hRatio < 50 ? `${wRatio}:${hRatio}` : `${decimal.toFixed(2)}:1`;
}

// Native Canvas Compress helper
async function compressCanvas(img, quality, mimeType) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return reject(new Error("Canvas context extraction failed"));

    // Set white background for JPEGs to avoid black fill transparency
    if (mimeType === "image/jpeg") {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("toBlob output empty"));
      },
      mimeType,
      quality
    );
  });
}

// Native dimensions-resizing compressor for PNG target sizes
async function compressPNGScale(img, scale) {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return resolve(null);

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      resolve(blob);
    }, "image/png");
  });
}

export default function ImageCompressor() {
  const [queue, setQueue] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  // Global settings overrides
  const [activeTab, setActiveTab] = useState("compressor");
  const [globalQuality, setGlobalQuality] = useState(0.8);
  const [globalFormat, setGlobalFormat] = useState("auto"); // auto maps to source format
  const [globalTargetSize, setGlobalTargetSize] = useState("auto");
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState(null);

  // AVIF encoding capability flag
  const [avifSupported, setAvifSupported] = useState(false);

  useEffect(() => {
    const checkAVIF = async () => {
      const supported = await new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        canvas.toBlob((blob) => {
          resolve(blob && blob.type === "image/avif");
        }, "image/avif");
      });
      setAvifSupported(supported);
    };
    checkAVIF();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "compressor") {
      setGlobalFormat("auto");
      setGlobalQuality(0.8);
      setQueue((prev) =>
        prev.map((item) => ({
          ...item,
          targetFormat: item.file.type || "image/jpeg",
          quality: 0.8,
          status: "idle"
        }))
      );
    } else {
      setGlobalTargetSize("auto");
      setGlobalQuality(0.85);
      const currentGlobalMime = globalFormat === "auto" ? "image/webp" : globalFormat;
      if (globalFormat === "auto") {
        setGlobalFormat("image/webp");
      }
      setQueue((prev) =>
        prev.map((item) => {
          const origMime = item.file.type || "image/jpeg";
          let tFormat = currentGlobalMime;
          if (tFormat === origMime) {
            // Target format cannot match the source format
            tFormat = origMime === "image/webp" ? "image/png" : "image/webp";
          }
          return {
            ...item,
            targetSizeOption: "auto",
            targetFormat: tFormat,
            quality: 0.85,
            status: "idle"
          };
        })
      );
    }
  };

  // Before/After comparison settings
  const [sliderPos, setSliderPos] = useState(50);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingPan, setIsDraggingPan] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const fileInputRef = useRef(null);
  const sliderRef = useRef(null);

  // Auto-clear toast alert
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Clean up Object URLs when queue changes or component unmounts to prevent memory leaks
  const queueRef = useRef(queue);
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    return () => {
      queueRef.current.forEach((item) => {
        if (item.originalPreview) URL.revokeObjectURL(item.originalPreview);
        if (item.processedPreview) URL.revokeObjectURL(item.processedPreview);
      });
    };
  }, []);

  // Lock viewport scroll on touch-move when dragging comparison slider or panning
  useEffect(() => {
    const sliderEl = sliderRef.current;
    if (!sliderEl) return;

    const handleTouchMove = (e) => {
      e.preventDefault();
    };

    sliderEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => {
      sliderEl.removeEventListener("touchmove", handleTouchMove);
    };
  }, [queue, selectedId]);



  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (e) => {
    const uploadedFiles = Array.from(e.target.files || []);
    if (uploadedFiles.length === 0) return;

    const newQueueItems = [];

    for (const file of uploadedFiles) {
      if (file.size > 15 * 1024 * 1024) {
        setToast({ type: "error", message: `File "${file.name}" exceeds the 15MB limit. Please compress smaller files.` });
        continue;
      }

      // Read image meta
      const fileUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = fileUrl;

      await new Promise((resolve) => {
        img.onload = () => {
          const w = img.naturalWidth;
          const h = img.naturalHeight;
          const hasAlpha = checkTransparency(img);
          const rawFormat = detectFormat(file.type, file.name);
          const recommendation = getRecommendedFormat(rawFormat, hasAlpha, file.size);
          const mp = parseFloat(((w * h) / 1000000).toFixed(2));
          const compRec = getCompressionRecommendation(file.size, mp, w, h);

          newQueueItems.push({
            id: crypto.randomUUID(),
            file,
            name: file.name,
            originalSize: file.size,
            originalWidth: w,
            originalHeight: h,
            originalAspectRatio: getAspectRatio(w, h),
            originalMegapixels: mp,
            originalFormat: rawFormat,
            originalPreview: fileUrl,
            hasTransparency: hasAlpha,

            processedFile: null,
            processedSize: 0,
            processedWidth: w,
            processedHeight: h,
            processedAspectRatio: getAspectRatio(w, h),
            processedMegapixels: mp,
            processedPreview: null,
            savingsPercent: 0,
            savingsBytes: 0,
            ratio: "1:1",
            accuracy: 0,
            status: "idle",

            targetFormat: activeTab === "converter" 
              ? (FORMAT_OPTIONS.find((f) => f.value !== (file.type || "image/jpeg"))?.value || "image/webp")
              : (file.type || "image/jpeg"),
            targetSizeOption: "auto",
            quality: 0.8,
            recommendedFormat: recommendation.format,
            recommendationReason: recommendation.reason,
            compressionRecommendation: compRec.label,
            compressionReason: compRec.reason,
            finalQuality: 0.8,
            conversionProgress: 0,
            conversionStage: "",
            isAvifFallbackActive: false
          });
          resolve();
        };
        img.onerror = () => {
          setToast({ type: "error", message: `Could not parse image "${file.name}".` });
          URL.revokeObjectURL(fileUrl);
          resolve();
        };
      });
    }

    if (newQueueItems.length > 0) {
      setQueue((prev) => [...prev, ...newQueueItems]);
      // Select the first uploaded file for preview by default if none is selected
      if (!selectedId) {
        setSelectedId(newQueueItems[0].id);
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const checkTransparency = (img) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.min(img.naturalWidth, 50);
    canvas.height = Math.min(img.naturalHeight, 50);
    const ctx = canvas.getContext("2d");
    if (!ctx) return false;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      for (let i = 3; i < imgData.length; i += 4) {
        if (imgData[i] < 254) return true;
      }
    } catch {
      // ignore security exceptions
    }
    return false;
  };

  // Sync global settings changes to all queue items
  const applyGlobalSettings = (quality, format, targetSize) => {
    setQueue((prev) =>
      prev.map((item) => {
        let tFormat = item.targetFormat;
        if (format !== "auto") {
          tFormat = format;
        } else {
          tFormat = item.file.type || "image/jpeg";
        }

        // Converter rules: target format cannot match source format
        if (activeTab === "converter") {
          const origMime = item.file.type || "image/jpeg";
          if (tFormat === origMime) {
            tFormat = origMime === "image/webp" ? "image/png" : "image/webp";
          }
        }

        return {
          ...item,
          quality,
          targetFormat: tFormat,
          targetSizeOption: targetSize,
          status: "idle" // resets to idle so the useEffect triggers re-compression instantly
        };
      })
    );
  };

  const handleSingleConfigChange = (id, fields) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...fields, status: "idle" } : item))
    );
  };

  const deleteItem = (id) => {
    const item = queue.find((i) => i.id === id);
    if (item) {
      if (item.originalPreview) URL.revokeObjectURL(item.originalPreview);
      if (item.processedPreview) URL.revokeObjectURL(item.processedPreview);
    }
    setQueue((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) {
      const remaining = queue.filter((item) => item.id !== id);
      setSelectedId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const clearQueue = () => {
    queue.forEach((item) => {
      if (item.originalPreview) URL.revokeObjectURL(item.originalPreview);
      if (item.processedPreview) URL.revokeObjectURL(item.processedPreview);
    });
    setQueue([]);
    setSelectedId(null);
  };

  // Perform client-side compression operations
  const processQueue = async () => {
    setIsProcessing(true);

    const updatedQueue = [...queue];

    for (let i = 0; i < updatedQueue.length; i++) {
      const item = updatedQueue[i];
      if (item.status !== "idle") continue;

      updatedQueue[i] = { ...item, status: "processing" };
      setQueue([...updatedQueue]);

      try {
        const img = new Image();
        img.src = item.originalPreview;
        await new Promise((res) => (img.onload = res));

        let compressedBlob = null;
        const targetFormatStr = item.targetFormat;
        let actualFormat = targetFormatStr;
        let finalQualityUsed = item.quality;

        if (item.targetSizeOption === "auto") {
          // Standard quality adjustment
          try {
            compressedBlob = await compressCanvas(img, item.quality, targetFormatStr);
          } catch {
            if (targetFormatStr === "image/avif") {
              setToast({ type: "warning", message: "AVIF export unsupported by browser. Falling back to WebP." });
              actualFormat = "image/webp";
              compressedBlob = await compressCanvas(img, item.quality, "image/webp");
            } else {
              throw new Error("Canvas compilation error");
            }
          }
        } else {
          // Target size mode requested (Bisection Binary Search)
          const targetBytes = Number(item.targetSizeOption);
          const isSameFormat = (targetFormatStr === "image/jpeg" && item.originalFormat === "JPG") ||
            (targetFormatStr === "image/png" && item.originalFormat === "PNG") ||
            (targetFormatStr === "image/webp" && item.originalFormat === "WEBP") ||
            (targetFormatStr === "image/avif" && item.originalFormat === "AVIF");

          if (item.originalSize <= targetBytes) {
            if (isSameFormat) {
              compressedBlob = item.file;
              finalQualityUsed = 1.0;
            } else {
              try {
                if (targetFormatStr === "image/png") {
                  compressedBlob = await compressPNGScale(img, 1.0);
                } else {
                  compressedBlob = await compressCanvas(img, 0.95, targetFormatStr);
                }
              } catch {
                if (targetFormatStr === "image/avif") {
                  actualFormat = "image/webp";
                  compressedBlob = await compressCanvas(img, 0.95, "image/webp");
                }
              }
              finalQualityUsed = 0.95;
            }
          } else if (targetFormatStr === "image/png") {
            // PNG is lossless; scale dimensions down to hit target size
            compressedBlob = await compressPNGScale(img, 1.0);
            if (compressedBlob && compressedBlob.size > targetBytes) {
              let minScale = 0.05;
              let maxScale = 0.98;
              let bestBlob = compressedBlob;
              let bestDiff = Math.abs(compressedBlob.size - targetBytes);

              for (let step = 0; step < 6; step++) {
                const mid = (minScale + maxScale) / 2;
                const tempBlob = await compressPNGScale(img, mid);
                if (tempBlob) {
                  const diff = Math.abs(tempBlob.size - targetBytes);
                  if (diff < bestDiff) {
                    bestDiff = diff;
                    bestBlob = tempBlob;
                  }
                  if (tempBlob.size > targetBytes) {
                    maxScale = mid;
                  } else {
                    minScale = mid;
                  }
                }
              }
              compressedBlob = bestBlob;
              finalQualityUsed = maxScale; // dimension scale factor acts as quality rating
            }
          } else {
            // Lossy JPG/WEBP/AVIF: Binary Search on Canvas quality setting
            let currentFormat = targetFormatStr;
            let minQ = 0.02;
            let maxQ = 1.0;
            let bestBlob = null;
            let bestDiff = Infinity;
            let bestQ = 0.8;

            for (let step = 0; step < 6; step++) {
              const q = (minQ + maxQ) / 2;
              let tempBlob = null;
              try {
                tempBlob = await compressCanvas(img, q, currentFormat);
              } catch {
                if (currentFormat === "image/avif") {
                  currentFormat = "image/webp";
                  actualFormat = "image/webp";
                  tempBlob = await compressCanvas(img, q, currentFormat);
                }
              }

              if (tempBlob) {
                const diff = Math.abs(tempBlob.size - targetBytes);
                if (diff < bestDiff) {
                  bestDiff = diff;
                  bestBlob = tempBlob;
                  bestQ = q;
                }
                if (tempBlob.size > targetBytes) {
                  maxQ = q;
                } else {
                  minQ = q;
                }
              }
            }

            // Fallback: If still slightly exceeding size limit, perform minor scaling
            if (bestBlob && bestBlob.size > targetBytes * 1.1) {
              let scaleMin = 0.2;
              let scaleMax = 0.95;
              let scaledBest = bestBlob;
              let scaledDiff = Math.abs(bestBlob.size - targetBytes);

              for (let s = 0; s < 4; s++) {
                const scale = (scaleMin + scaleMax) / 2;
                const canvas = document.createElement("canvas");
                canvas.width = Math.max(1, Math.round(img.naturalWidth * scale));
                canvas.height = Math.max(1, Math.round(img.naturalHeight * scale));
                const ctx = canvas.getContext("2d");
                if (ctx) {
                  if (actualFormat === "image/jpeg") {
                    ctx.fillStyle = "#FFFFFF";
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                  }
                  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                  const sBlob = await new Promise((res) => {
                    canvas.toBlob(res, actualFormat, 0.65);
                  });
                  if (sBlob) {
                    const diff = Math.abs(sBlob.size - targetBytes);
                    if (diff < scaledDiff) {
                      scaledDiff = diff;
                      scaledBest = sBlob;
                    }
                    if (sBlob.size > targetBytes) {
                      scaleMax = scale;
                    } else {
                      scaleMin = scale;
                    }
                  }
                }
              }
              compressedBlob = scaledBest;
              finalQualityUsed = 0.5; // fallback scaling reduces quality rank
            } else {
              compressedBlob = bestBlob;
              finalQualityUsed = bestQ;
            }
          }
        }

        if (compressedBlob) {
          // Fetch output dimensions
          let outW = item.originalWidth;
          let outH = item.originalHeight;
          if (item.processedPreview) {
            URL.revokeObjectURL(item.processedPreview);
          }
          const outUrl = URL.createObjectURL(compressedBlob);

          if (item.targetSizeOption !== "auto" || actualFormat === "image/png") {
            const outImg = new Image();
            outImg.src = outUrl;
            await new Promise((r) => (outImg.onload = r));
            outW = outImg.naturalWidth;
            outH = outImg.naturalHeight;
          }

          const savedBytes = Math.max(0, item.originalSize - compressedBlob.size);
          const savedPercent = parseFloat(((savedBytes / item.originalSize) * 100).toFixed(1));
          const compressionRatio = (item.originalSize / compressedBlob.size).toFixed(1);

          let accuracy = 100;
          if (item.targetSizeOption !== "auto") {
            const target = Number(item.targetSizeOption);
            const deviation = Math.abs(target - compressedBlob.size);
            accuracy = Math.max(0, Math.round((1 - deviation / target) * 100));
          }

          updatedQueue[i] = {
            ...item,
            status: "done",
            processedFile: compressedBlob,
            processedSize: compressedBlob.size,
            processedWidth: outW,
            processedHeight: outH,
            processedAspectRatio: getAspectRatio(outW, outH),
            processedMegapixels: parseFloat(((outW * outH) / 1000000).toFixed(2)),
            processedPreview: outUrl,
            savingsBytes: savedBytes,
            savingsPercent: savedPercent,
            ratio: `${compressionRatio}:1`,
            accuracy,
            finalQuality: finalQualityUsed,
            targetFormat: actualFormat
          };
        } else {
          updatedQueue[i] = { ...item, status: "failed" };
        }
      } catch (err) {
        console.error(err);
        updatedQueue[i] = { ...item, status: "failed" };
      }
      setQueue([...updatedQueue]);
    }

    setIsProcessing(false);
  };

  // Perform client-side format conversions with simulated progress tracking
  const processConversionQueue = async () => {
    setIsProcessing(true);
    const updatedQueue = [...queue];

    for (let i = 0; i < updatedQueue.length; i++) {
      const item = updatedQueue[i];
      if (item.status !== "idle") continue;

      updatedQueue[i] = {
        ...item,
        status: "processing",
        conversionStage: "Preparing Image...",
        conversionProgress: 10,
        isAvifFallbackActive: false
      };
      setQueue([...updatedQueue]);

      try {
        // Stage 1: Load Image
        const img = new Image();
        img.src = item.originalPreview;
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error("Failed to load image resource"));
        });

        // Stage 2: Analyze Pixels
        await new Promise(r => setTimeout(r, 250));
        updatedQueue[i] = {
          ...updatedQueue[i],
          conversionStage: "Analyzing Pixels...",
          conversionProgress: 35
        };
        setQueue([...updatedQueue]);

        // Stage 3: Generate Format
        await new Promise(r => setTimeout(r, 250));
        const targetFormatMime = item.targetFormat;
        let actualFormatMime = targetFormatMime;
        let isFallback = false;

        // Check AVIF encoding support
        if (targetFormatMime === "image/avif" && !avifSupported) {
          actualFormatMime = "image/webp";
          isFallback = true;
        }

        updatedQueue[i] = {
          ...updatedQueue[i],
          conversionStage: `Generating ${actualFormatMime.split("/")[1].toUpperCase().replace("JPEG", "JPG")}...`,
          conversionProgress: 70
        };
        setQueue([...updatedQueue]);

        // Canvas Rendering
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not extract canvas 2D context");

        // Clear alpha transparency for JPEG targets
        if (actualFormatMime === "image/jpeg") {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        // Convert context to blob
        const qualityUsed = 0.90; // High premium quality preset for conversion
        const convertedBlob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("toBlob returned empty"));
            },
            actualFormatMime,
            actualFormatMime === "image/png" ? undefined : qualityUsed
          );
        });

        // Verify blob matches target format MIME
        let finalBlob = convertedBlob;
        let finalMime = convertedBlob.type;

        if (actualFormatMime === "image/avif" && convertedBlob.type !== "image/avif") {
          isFallback = true;
          finalMime = "image/webp";
          const fallbackBlob = await new Promise((resolve, reject) => {
            canvas.toBlob(
              (blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Fallback WebP conversion failed"));
              },
              "image/webp",
              qualityUsed
            );
          });
          finalBlob = fallbackBlob;
        }

        // Stage 4: Finalizing
        await new Promise(r => setTimeout(r, 200));
        updatedQueue[i] = {
          ...updatedQueue[i],
          conversionStage: "Finalizing...",
          conversionProgress: 90
        };
        setQueue([...updatedQueue]);

        // URL management: revoke old converted previews
        if (item.processedPreview) {
          URL.revokeObjectURL(item.processedPreview);
        }
        const outUrl = URL.createObjectURL(finalBlob);

        const savedBytes = item.originalSize - finalBlob.size;
        const savedPercent = parseFloat(((savedBytes / item.originalSize) * 100).toFixed(1));
        const ratio = (item.originalSize / finalBlob.size).toFixed(1);

        updatedQueue[i] = {
          ...updatedQueue[i],
          status: "done",
          processedFile: finalBlob,
          processedSize: finalBlob.size,
          processedWidth: img.naturalWidth,
          processedHeight: img.naturalHeight,
          processedAspectRatio: getAspectRatio(img.naturalWidth, img.naturalHeight),
          processedMegapixels: parseFloat(((img.naturalWidth * img.naturalHeight) / 1000000).toFixed(2)),
          processedPreview: outUrl,
          savingsBytes: savedBytes,
          savingsPercent: savedPercent,
          ratio: `${ratio}:1`,
          targetFormat: finalMime,
          isAvifFallbackActive: isFallback,
          conversionStage: "Conversion Completed",
          conversionProgress: 100
        };

      } catch (err) {
        console.error(err);
        updatedQueue[i] = {
          ...item,
          status: "failed",
          conversionStage: "Conversion Failed",
          conversionProgress: 0
        };
      }
      setQueue([...updatedQueue]);
    }

    setIsProcessing(false);
  };

  const downloadSingle = (item) => {
    const isIncrease = item.processedFile && item.processedSize >= item.originalSize;
    const useOriginal = isIncrease && activeTab === "compressor";

    if (useOriginal) {
      const link = document.createElement("a");
      link.href = item.originalPreview;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      if (!item.processedFile) return;
      const ext = item.targetFormat.split("/")[1].replace("jpeg", "jpg");
      const newName = activeTab === "converter" 
        ? getConvertedFileName(item.name, ext)
        : getNewFileName(item.name, ext);
      const link = document.createElement("a");
      link.href = item.processedPreview;
      link.download = newName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getNewFileName = (origName, ext) => {
    const base = origName.substring(0, origName.lastIndexOf("."));
    return `${base}._compressed.${ext}`;
  };

  const getConvertedFileName = (origName, ext) => {
    const lastDotIdx = origName.lastIndexOf(".");
    const base = lastDotIdx !== -1 ? origName.substring(0, lastDotIdx) : origName;
    return `${base}.${ext}`;
  };

  const downloadAll = () => {
    const completed = queue.filter((item) => item.status === "done");
    if (completed.length === 0) return;

    completed.forEach((item, idx) => {
      setTimeout(() => {
        downloadSingle(item);
      }, idx * 300);
    });
  };

  // Drag and drop event handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFiles({ target: { files: e.dataTransfer.files } });
    }
  };

  // Compare slider drag handler
  const handleSliderMove = (e) => {
    if (zoom > 1) return;
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const pos = ((clientX - rect.left) / rect.width) * 100;
    setSliderPos(Math.min(100, Math.max(0, pos)));
  };

  // Pan handlers for zoomed views
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDraggingPan(true);
    setDragStart({
      x: (e.touches ? e.touches[0].clientX : e.clientX) - pan.x,
      y: (e.touches ? e.touches[0].clientY : e.clientY) - pan.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDraggingPan || zoom <= 1) return;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setPan({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDraggingPan(false);
  };

  const activeCompareItem = queue.find((item) => item.id === selectedId);
  const isWorkflowFinished = queue.length > 0 && queue.every((item) => item.status === "done" || item.status === "failed");

  // Total summary calculations
  const totalOriginal = queue.reduce((sum, item) => sum + item.originalSize, 0);
  const totalCompressed = queue.reduce((sum, item) => sum + (item.processedSize || item.originalSize), 0);
  const totalSavingsBytes = Math.max(0, totalOriginal - totalCompressed);
  const totalSavingsPercent = totalOriginal > 0 ? parseFloat(((totalSavingsBytes / totalOriginal) * 100).toFixed(1)) : 0;
  const isAnyCompleted = queue.some((item) => item.status === "done");

  // JSON-LD schema objects (SoftwareApplication, FAQPage, WebPage, BreadcrumbList)
  const softwareAppSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "SnapFree Tools Image Compressor & Converter",
    "operatingSystem": "All",
    "applicationCategory": "MultimediaApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Natively compress, optimize, and convert JPG, PNG, WEBP, and AVIF files directly inside your browser window. Zero upload required."
  };

  const faqPageSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS_DATA.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://snapfreetools.com/image-compressor#webpage",
    "url": "https://snapfreetools.com/image-compressor",
    "name": "Image Compressor & Converter",
    "description": "Compress and convert images online free. Natively compress JPG, PNG, WebP, and AVIF images to 20KB, 50KB, 100KB, or 200KB.",
    "breadcrumb": {
      "@id": "https://snapfreetools.com/image-compressor#breadcrumb"
    }
  };

  const breadcrumbListSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://snapfreetools.com/image-compressor#breadcrumb",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://snapfreetools.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Image Compressor",
        "item": "https://snapfreetools.com/image-compressor"
      }
    ]
  };

  return (
    <ToolLayout>
      {/* Schemas rendered inside head */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema) }}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <div className="max-w-6xl mx-auto px-2 md:px-4 space-y-12 text-slate-800 antialiased">

        {/* HERO HEADER - Strict single H1 element */}
        <div className="text-center space-y-4 pt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-200">
            <Sparkles size={13} className="animate-pulse" />
            Premium SaaS Tool Suite
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
            Image Compressor & Converter
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mx-auto font-medium">
            Reduce image size and convert file formats instantly with our private 100% browser-based engine. No registration, no watermarks, unlimited processing.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-2xl shadow-sm max-w-md w-full sm:w-auto">
            <button
              onClick={() => handleTabChange("compressor")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs md:text-sm font-bold tracking-tight transition-all duration-200 ${activeTab === "compressor"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <ImageIcon size={16} className={activeTab === "compressor" ? "text-emerald-500" : ""} />
              Image Compressor
            </button>
            <button
              onClick={() => handleTabChange("converter")}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs md:text-sm font-bold tracking-tight transition-all duration-200 ${activeTab === "converter"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-500 hover:text-slate-800"
                }`}
            >
              <ArrowRight size={16} className={activeTab === "converter" ? "text-emerald-500" : ""} />
              Image Converter
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 font-medium max-w-md">
            {activeTab === "compressor"
              ? "Reduce image file size for websites, email, and faster loading."
              : "Convert JPG, PNG, WEBP, and AVIF formats instantly in your browser."}
          </p>
        </div>

        {/* TOAST SYSTEM */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-xl border flex items-start gap-3 shadow-md max-w-xl mx-auto text-sm font-semibold ${toast.type === "error"
                  ? "bg-rose-50 border-rose-200 text-rose-700"
                  : toast.type === "warning"
                    ? "bg-amber-50 border-amber-200 text-amber-700"
                    : toast.type === "success"
                      ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
            >
              {toast.type === "error" ? (
                <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-500" />
              ) : (
                <Info size={18} className="shrink-0 mt-0.5 text-emerald-500" />
              )}
              <div className="flex-1">{toast.message}</div>
              <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-650 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SAVINGS HIGHLIGHT CARD (PROMINENT SUCCESS CARD) */}
        <AnimatePresence>
          {isAnyCompleted && totalSavingsBytes > 0 && activeTab === "compressor" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-2 shadow-sm max-w-2xl mx-auto"
            >
              <CheckCircle2 size={36} className="text-emerald-500 mx-auto" />
              <h3 className="text-2xl md:text-3xl font-black text-emerald-950">
                You saved {formatSize(totalSavingsBytes)} ({totalSavingsPercent}%)
              </h3>
              <p className="text-emerald-800 text-xs font-semibold">
                Your images were optimized securely locally in your browser. Average compression ratio is {(totalOriginal / totalCompressed).toFixed(1)}x.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN TOOL WORKSPACE CONTAINER - H2 Heading */}
        <div className="bg-white rounded-3xl border border-slate-250 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-700 tracking-tight m-0">
              {activeTab === "compressor" ? "Compress Image Online" : "Convert JPG, PNG, WEBP & AVIF"}
            </h2>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Local Browser Processing
            </div>
          </div>

          {queue.length === 0 ? (
            /* EMPTY STATE UX & UPLOAD DROPZONE */
            <div className="flex-1 flex flex-col">
              <div
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={triggerUpload}
                className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 border-4 border-dashed border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/10 transition-all cursor-pointer group m-6 rounded-2xl text-center"
              >
                <div className="w-16 h-16 bg-slate-50 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-500 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-sm border border-slate-100">
                  <Upload size={28} className="group-hover:-translate-y-1 transition-transform" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1">
                  Drag & drop your images here
                </h3>
                <p className="text-slate-400 text-xs md:text-sm font-medium mb-6">
                  Browse your computer to upload
                </p>
                <button className="px-6 py-2.5 bg-emerald-500 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-emerald-600 active:scale-95 transition-all">
                  Browse Files
                </button>

                <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto pt-6 border-t border-slate-100 w-full mt-8 text-xs font-semibold text-slate-500 text-center">
                  <div>
                    <span className="block text-[10px] uppercase text-slate-450 font-bold tracking-wider mb-1">Max Upload Size</span>
                    15 MB per image
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-slate-450 font-bold tracking-wider mb-1">Supported Formats</span>
                    JPG, JPEG, PNG, WEBP, AVIF
                  </div>
                  <div className="col-span-2 pt-2 text-[10px] text-slate-400 font-medium">
                    Files never leave your browser. Processing is 100% local.
                  </div>
                </div>
              </div>

              {/* Trust signals directly below upload zone */}
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pb-6 px-4 text-[10px] font-bold text-slate-500 max-w-2xl mx-auto border-t border-slate-100 w-full pt-4">
                {TRUST_BADGES.map((badge, idx) => (
                  <span key={idx} className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                    <badge.icon size={12} className="text-emerald-500 shrink-0" />
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            /* ACTIVE QUEUE WORKSPACE (Results-First UX) */
            <div className="flex flex-col lg:grid lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

              {/* LEFT COLUMN: FILE PROCESSING QUEUE LIST */}
              <div className="lg:col-span-8 p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs md:text-sm">
                    <span>Uploaded Files ({queue.length})</span>
                  </h3>
                  <button
                    onClick={triggerUpload}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-emerald-500 hover:border-emerald-300 hover:bg-emerald-50/20 transition-all"
                  >
                    <Plus size={14} /> Add More
                  </button>
                </div>

                <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                  {queue.map((item) => {
                    const isSelected = item.id === selectedId;
                    const gradeInfo = getQualityGrade(item.finalQuality);
                    const ext = item.targetFormat.split("/")[1].replace("jpeg", "jpg");
                    const newName = activeTab === "converter"
                      ? getConvertedFileName(item.name, ext)
                      : getNewFileName(item.name, ext);

                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative group flex flex-col md:flex-row gap-4 ${isSelected
                            ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                            : "border-slate-200 hover:border-slate-350 bg-white"
                          }`}
                      >
                        {/* Thumbnail View */}
                        <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center relative">
                          <img src={item.originalPreview} alt="upload preview" className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 right-0 bg-slate-900/70 text-white px-1 text-[8px] font-bold uppercase">
                            {item.originalFormat}
                          </span>
                        </div>

                        {/* File details & options */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-xs md:text-sm truncate" title={item.name}>
                                {item.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-medium">
                                {activeTab === "compressor" ? (
                                  `Original: ${formatSize(item.originalSize)} (${item.originalWidth}×${item.originalHeight}px • ${item.originalMegapixels}MP • ${item.originalAspectRatio})`
                                ) : (
                                  `Original Format: ${item.originalFormat} • Dimensions: ${item.originalWidth}×${item.originalHeight}px`
                                )}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(item.id);
                              }}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-650"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          {/* Recommendation Badge */}
                          <div className="flex flex-col gap-1.5 items-start">
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-emerald-100">
                              <Sparkles size={11} className="shrink-0" />
                              {activeTab === "compressor" ? (
                                item.originalSize > 500 * 1024 ? (
                                  <span>Image size is above 500 KB. Compression is recommended for faster web performance.</span>
                                ) : (
                                  <span>Image size is already optimized. Additional compression is usually not required.</span>
                                )
                              ) : (
                                <span>Recommended: {item.recommendedFormat}</span>
                              )}
                            </div>
                          </div>

                          {/* Individual Controls */}
                          <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 pt-1 border-t border-slate-100/60 pt-2">
                            {activeTab === "compressor" ? (
                              /* Detected Format Badge instead of dropdown */
                              <div className="flex flex-col gap-0.5">
                                <label className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                                  Detected Format
                                </label>
                                <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 border border-slate-200 rounded text-slate-700 uppercase">
                                  {item.originalFormat}
                                </span>
                              </div>
                            ) : (
                              /* Redesigned Premium SaaS Target Selector */
                              <div className="flex flex-col gap-2 w-full">
                                <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-2">
                                  {/* Original Format Locked */}
                                  <div className="flex flex-col gap-0.5">
                                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">
                                      Your Image Format
                                    </span>
                                    <span className="inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold bg-slate-100 border border-slate-200 rounded-lg text-slate-700 uppercase">
                                      {item.originalFormat}
                                    </span>
                                  </div>

                                  <div className="hidden md:flex items-center text-slate-300 self-end mb-1 font-bold">→</div>

                                  {/* Target Format Buttons */}
                                  <div className="flex flex-col gap-1">
                                    <span className="text-[9px] uppercase font-black text-slate-450 tracking-wider">
                                      Convert To
                                    </span>
                                    <div className="flex flex-wrap gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      {FORMAT_OPTIONS.filter((f) => {
                                        const fName = f.label === "JPG" ? "JPG" : f.label;
                                        return fName !== item.originalFormat;
                                      }).map((f) => {
                                        const isSelected = item.targetFormat === f.value;
                                        return (
                                          <button
                                            key={f.value}
                                            onClick={() => handleSingleConfigChange(item.id, { targetFormat: f.value })}
                                            className={`px-3 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                                              isSelected
                                                ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                                                : "bg-white border-slate-200 text-slate-600 hover:border-emerald-350 hover:bg-emerald-50/5 active:scale-95"
                                            }`}
                                          >
                                            {f.label}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                          </div>

                          {/* INITIAL UPLOAD / READY TO COMPRESS STATE (Hides calculated values until completed) */}
                          {item.status !== "done" && item.status !== "failed" && activeTab === "compressor" && (
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs font-semibold space-y-3">
                              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-slate-650">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Status</span>
                                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                    {item.status === "processing" ? (
                                      <>
                                        <Loader2 size={12} className="animate-spin text-emerald-500" />
                                        <span>Compressing...</span>
                                      </>
                                    ) : (
                                      <span>Ready to Compress</span>
                                    )}
                                  </span>
                                  <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">
                                    {item.status === "processing"
                                      ? "Running local optimization..."
                                      : "Compression settings selected and ready to process."}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Original Size</span>
                                  <span className="font-bold text-slate-850">{formatSize(item.originalSize)}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Original Format</span>
                                  <span className="font-bold text-slate-850 uppercase">{item.originalFormat}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Dimensions</span>
                                  <span className="font-bold text-slate-850">{item.originalWidth} × {item.originalHeight}</span>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* DOWNLOAD EXPERIENCE (Details card on completion) */}
                          {item.status === "done" && item.processedFile && (
                            <div className="bg-emerald-50/40 rounded-xl p-3 border border-emerald-100 text-xs font-semibold space-y-3">
                              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-x-6 gap-y-2 text-[11px] text-slate-650">
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">Original Name</span>
                                  <span className="truncate block font-bold text-slate-800">{item.name}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] font-black uppercase text-slate-400 block">New Name</span>
                                  <span className="truncate block font-bold text-slate-800">
                                    {item.processedSize >= item.originalSize && activeTab === "compressor" ? item.name : newName}
                                  </span>
                                </div>
                                {activeTab === "compressor" ? (
                                  <>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Status</span>
                                      <span className="font-bold text-emerald-700">Compression Complete</span>
                                      <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">
                                        Image optimized successfully.
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Optimized Size</span>
                                      <span className="font-bold text-slate-800">
                                        {formatSize(Math.min(item.originalSize, item.processedSize))}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Bytes Saved</span>
                                      <span className="font-bold text-slate-800">
                                        {formatSize(Math.max(0, item.originalSize - item.processedSize))}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Savings %</span>
                                      <span className="font-bold text-emerald-755">
                                        {Math.max(0, item.savingsPercent)}%
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Compression Ratio</span>
                                      <span className="font-bold text-slate-700">
                                        {item.processedSize >= item.originalSize ? "1:1" : item.ratio}
                                      </span>
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Status</span>
                                      <span className="font-bold text-emerald-700">Conversion Complete</span>
                                    </div>
                                    <div>
                                      <span className="text-[9px] font-black uppercase text-slate-400 block">Output Format</span>
                                      <span className="font-bold text-slate-800 uppercase">
                                        {item.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>

                              <div className="flex items-center justify-between border-t border-emerald-100/60 pt-2 text-[10px]">
                                {activeTab === "compressor" ? (
                                  <div className="text-emerald-800 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                                    Compression Complete
                                  </div>
                                ) : (
                                  <div className="text-emerald-800 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md">
                                    Format Converted
                                  </div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    downloadSingle(item);
                                  }}
                                  className="flex items-center gap-1 text-[11px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-1.5 rounded-lg shadow-sm hover:shadow active:scale-95 transition-all"
                                >
                                  <Download size={12} /> Download Image
                                </button>
                              </div>
                            </div>
                          )}

                          {item.status === "failed" && (
                            <div className="bg-rose-50 border border-rose-100 rounded-lg p-2.5 flex items-center gap-2 text-xs font-semibold text-rose-700">
                              <AlertCircle size={14} className="text-rose-500 shrink-0" />
                              <span>Unable to compress this image. Try another format or reduce image dimensions.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Permanent Upload Guidelines Notice */}
                <div className="mt-6 border-t border-slate-100 pt-4 text-center sm:text-left text-xs font-semibold text-slate-400 space-y-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 justify-center sm:justify-start">
                    <span>• <strong>Maximum upload size:</strong> 15 MB per image</span>
                    <span className="hidden sm:inline">|</span>
                    <span>• <strong>Supported formats:</strong> JPG, JPEG, PNG, WEBP, AVIF</span>
                  </p>
                  <p className="text-slate-450">
                    Files never leave your browser. Processing is 100% local.
                  </p>
                </div>
              </div>

              {/* RIGHT COLUMN: GLOBAL SaaS CONTROL PANEL & STATS */}
              <div className="lg:col-span-4 p-4 md:p-6 bg-slate-50/50 flex flex-col justify-between space-y-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2 text-xs md:text-sm">
                      SaaS Controls
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                      Adjust configuration options applied across the queue.
                    </p>
                  </div>

                  {/* Preset Quick Settings */}
                  <div className="space-y-4">
                    {/* Format Target (Converter mode only) */}
                    {activeTab === "converter" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                          Batch Output Format
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {["image/webp", "image/avif", "image/jpeg", "image/png"].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => {
                                setGlobalFormat(opt);
                                applyGlobalSettings(globalQuality, opt, globalTargetSize);
                              }}
                              className={`px-3 py-1.5 text-[10px] font-bold rounded border transition-all ${globalFormat === opt
                                  ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                                  : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300"
                                }`}
                            >
                              {opt.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Target Size Select (Compressor mode only) */}
                    {activeTab === "compressor" && (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                          Batch Target File Size
                        </label>
                        <div className="relative">
                          <select
                            value={globalTargetSize}
                            onChange={(e) => {
                              setGlobalTargetSize(e.target.value);
                              applyGlobalSettings(globalQuality, globalFormat, e.target.value);
                            }}
                            className="appearance-none w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 pr-8 hover:border-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                          >
                            {TARGET_SIZE_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label}</option>
                            ))}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                        </div>
                        {queue.length > 0 && (
                          <span className="text-[10px] font-bold text-slate-500 mt-1 block">
                            {getRecommendedTargetLabel(queue[0].originalSize)}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quality selector (Compressor mode only) */}
                    {activeTab === "compressor" && (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] uppercase font-black text-slate-400 tracking-wider">
                          <span>Quality preset: {Math.round(globalQuality * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min="0.10"
                          max="1.0"
                          step="0.10"
                          value={globalQuality}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setGlobalQuality(val);
                            applyGlobalSettings(val, globalFormat, globalTargetSize);
                          }}
                          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                        />
                        <div className="flex justify-between text-[8px] text-slate-400 font-bold uppercase">
                          <span>Aggressive (40%)</span>
                          <span>Balanced (60%)</span>
                          <span>High (80%)</span>
                          <span>Max (100%)</span>
                        </div>
                        <div className="bg-slate-100 border border-slate-200/60 rounded-lg p-2 text-[10px] font-bold text-slate-600 mt-1.5 text-center">
                          {getSliderExplanation(globalQuality)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Batch Summary Stats card */}
                  {activeTab === "compressor" && queue.some((i) => i.status === "done") && totalSavingsBytes > 0 && (
                    <div className="bg-slate-900 text-white rounded-xl p-4 space-y-3 shadow-md border border-slate-950">
                      <h4 className="text-[10px] uppercase font-black text-slate-500 tracking-widest">
                        Compression Savings Meter
                      </h4>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-2xl font-black text-emerald-400">-{totalSavingsPercent}%</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            Saved {formatSize(totalSavingsBytes)} in total
                          </p>
                        </div>
                        <div className="text-right text-[10px] text-slate-400 font-medium">
                          <p>Original: {formatSize(totalOriginal)}</p>
                          <p>Optimized: {formatSize(totalCompressed)}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-400 transition-all duration-500"
                          style={{ width: `${totalSavingsPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-6 border-t border-slate-200 lg:border-t-0">
                  {activeTab === "compressor" ? (
                    !isWorkflowFinished ? (
                      <button
                        onClick={processQueue}
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Compressing...
                          </>
                        ) : (
                          <>
                            <Zap size={16} /> Compress Image
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={queue.length > 1 ? downloadAll : () => downloadSingle(queue[0])}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        <Download size={16} /> {queue.length > 1 ? "Download All" : "Download Image"}
                      </button>
                    )
                  ) : (
                    /* Converter actions button */
                    !isWorkflowFinished ? (
                      <button
                        onClick={processConversionQueue}
                        disabled={isProcessing}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" /> Converting...
                          </>
                        ) : (
                          <>
                            <Zap size={16} /> Convert Image
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={queue.length > 1 ? downloadAll : () => downloadSingle(queue[0])}
                        className="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-500/10 hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                      >
                        <Download size={16} /> {queue.length > 1 ? "Download All Converted" : `Download ${queue[0].targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")} Image`}
                      </button>
                    )
                  )}

                  <button
                    onClick={clearQueue}
                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-950 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={13} /> {activeTab === "compressor" ? "Compress Another Image" : "Convert Another Image"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* COMPARISON METRICS DASHBOARD (COMPRESSOR) OR PREMIUM CONVERSION PREVIEW CARD (CONVERTER) */}
        {activeCompareItem && (
          activeTab === "compressor" ? (
            <div className="bg-white rounded-3xl border border-slate-250 shadow-sm p-4 md:p-6 space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-xs md:text-sm">
                    Visual Quality & Performance Dashboard
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Select a queue image to preview visual details and adjust zoom ratios.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-1">
                  Active: {activeCompareItem.name}
                </div>
              </div>

              {/* Split Comparison Frame */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Visual Split Frame */}
                <div className="lg:col-span-7 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
                    <span>Drag Slider to Compare Quality</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setZoom((z) => Math.max(1, z - 0.5)); setPan({ x: 0, y: 0 }); }}
                        disabled={zoom <= 1}
                        className="p-1 border border-slate-250 rounded hover:border-emerald-300 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        title="Zoom Out"
                      >
                        <Minimize2 size={13} />
                      </button>
                      <span className="text-[10px] font-black text-slate-600 min-w-[30px] text-center">
                        {zoom.toFixed(1)}x
                      </span>
                      <button
                        onClick={() => setZoom((z) => Math.min(5, z + 0.5))}
                        disabled={zoom >= 5}
                        className="p-1 border border-slate-250 rounded hover:border-emerald-300 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        title="Zoom In"
                      >
                        <Maximize2 size={13} />
                      </button>
                      <button
                        onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                        disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
                        className="p-1 border border-slate-250 rounded hover:border-emerald-300 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                        title="Reset View"
                      >
                        <RotateCcw size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Compare View Box */}
                  <div
                    ref={sliderRef}
                    onMouseMove={handleSliderMove}
                    onTouchMove={handleSliderMove}
                    onMouseDown={handleMouseDown}
                    onMouseMoveCapture={handleMouseMove}
                    onTouchStart={handleMouseDown}
                    onTouchMoveCapture={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                    className={`aspect-video w-full border border-slate-200 rounded-2xl bg-slate-900 overflow-hidden relative select-none ${zoom > 1 ? "cursor-grab active:cursor-grabbing" : ""
                      }`}
                  >
                    {/* Underlay container */}
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transition: isDraggingPan ? "none" : "transform 0.15s ease-out"
                      }}
                    >
                      {/* Processed (Right Side) */}
                      <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-950/20">
                        {activeCompareItem.processedPreview ? (
                          <img
                            src={activeCompareItem.processedPreview}
                            alt="Processed View"
                            className="w-full h-full object-contain pointer-events-none"
                          />
                        ) : (
                          <div className="text-center text-slate-400 text-xs">
                            <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                            <p>Compress image to preview optimization quality</p>
                          </div>
                        )}
                      </div>

                      {/* Original (Left Side, Clipped) */}
                      <div
                        className="absolute inset-0 flex items-center justify-center p-2 bg-slate-950/20"
                        style={{
                          clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
                        }}
                      >
                        <img
                          src={activeCompareItem.originalPreview}
                          alt="Original View"
                          className="w-full h-full object-contain pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Vertical drag handle line */}
                    <div
                      className="absolute inset-y-0 w-0.5 bg-white shadow-lg pointer-events-none"
                      style={{ left: `${sliderPos}%` }}
                    >
                      <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-white border border-slate-350 rounded-full flex items-center justify-center shadow-lg pointer-events-none">
                        <span className="text-[10px] text-slate-500 font-black flex gap-0.5">
                          <span>‹</span><span>›</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Sub-Comparison size indicators */}
                  <div className="flex justify-between text-xs font-bold text-slate-500 px-1 pt-1">
                    <div>Original: {formatSize(activeCompareItem.originalSize)}</div>
                    {activeCompareItem.status === "done" && activeCompareItem.processedFile ? (
                      <div className={activeCompareItem.processedSize >= activeCompareItem.originalSize ? "text-slate-500" : "text-emerald-500"}>
                        Optimized: {formatSize(Math.min(activeCompareItem.originalSize, activeCompareItem.processedSize))} ({activeCompareItem.processedSize >= activeCompareItem.originalSize ? "0%" : `-${activeCompareItem.savingsPercent}%`})
                      </div>
                    ) : (
                      <div>Optimized: Waiting for Compression</div>
                    )}
                  </div>
                </div>

                {/* Right Column: Comparison Stats Dashboard Metrics */}
                <div className="lg:col-span-5 space-y-4">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    Premium SaaS Metrics Dashboard
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {(() => {
                      const isDone = activeCompareItem.status === "done" && activeCompareItem.processedFile;
                      const isProcessing = activeCompareItem.status === "processing";
                      const isIncrease = isDone && activeCompareItem.processedSize >= activeCompareItem.originalSize;

                      const stats = !isDone ? [
                        {
                          label: "Original Size",
                          value: formatSize(activeCompareItem.originalSize),
                          tip: "Raw byte size of the uploaded image before browser optimization."
                        },
                        {
                          label: "Original Format",
                          value: activeCompareItem.originalFormat,
                          tip: "The detected original image format."
                        },
                        {
                          label: "Dimensions",
                          value: `${activeCompareItem.originalWidth} × ${activeCompareItem.originalHeight}`,
                          tip: "Pixel width and height resolution of the original file."
                        },
                        {
                          label: "Aspect Ratio",
                          value: activeCompareItem.originalAspectRatio,
                          tip: "Proportional relation between the pixel width and height."
                        },
                        {
                          label: "Megapixels",
                          value: `${activeCompareItem.originalMegapixels} MP`,
                          tip: "Calculated image resolution density indicator (width * height in millions)."
                        },
                        {
                          label: "Status",
                          value: isProcessing ? "Compressing..." : "Ready to Compress",
                          tip: "Current processing status of the image."
                        }
                      ] : [
                        {
                          label: "Original Size",
                          value: formatSize(activeCompareItem.originalSize),
                          tip: "Raw byte size of the uploaded image before browser optimization."
                        },
                        {
                          label: "Optimized Size",
                          value: formatSize(Math.min(activeCompareItem.originalSize, activeCompareItem.processedSize)),
                          tip: "Resulting byte weight after processing inside the canvas thread."
                        },
                        {
                          label: "Bytes Saved",
                          value: formatSize(Math.max(0, activeCompareItem.originalSize - activeCompareItem.processedSize)),
                          tip: "Amount of memory space cleared off the file footprint."
                        },
                        {
                          label: "Savings %",
                          value: `-${Math.max(0, activeCompareItem.savingsPercent)}%`,
                          tip: "Percentage decrease compared to the original image dimensions."
                        },
                        {
                          label: "Compression Ratio",
                          value: isIncrease ? "1:1" : activeCompareItem.ratio,
                          tip: "Proportional compression multiplier (e.g., 2.5 times smaller)."
                        },
                        {
                          label: "Output Format",
                          value: activeCompareItem.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG"),
                          tip: "Target export type of the resulting image asset."
                        },
                        {
                          label: "Dimensions",
                          value: `${activeCompareItem.processedWidth} × ${activeCompareItem.processedHeight}`,
                          tip: "Pixel width and height resolution of the generated file."
                        },
                        {
                          label: "Aspect Ratio",
                          value: activeCompareItem.processedAspectRatio,
                          tip: "Proportional relation between the pixel width and height."
                        },
                        {
                          label: "Megapixels",
                          value: `${activeCompareItem.processedMegapixels} MP`,
                          tip: "Calculated image resolution density indicator (width * height in millions)."
                        },
                        {
                          label: "Status",
                          value: "Compression Complete",
                          tip: "Current processing status of the image."
                        }
                      ];

                      return stats;
                    })().map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1 relative group hover:border-emerald-300 transition-colors">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider flex items-center gap-1">
                          {stat.label}
                          <Info
                            size={11}
                            className="text-slate-300 hover:text-emerald-500 cursor-help shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 rounded"
                            title={stat.tip}
                            tabIndex={0}
                            role="img"
                            aria-label={stat.tip}
                          />
                        </p>
                        <p className="text-sm font-black text-slate-800">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Extra advice box for lossless targets */}
                  {activeCompareItem.originalFormat === "PNG" && activeCompareItem.targetSizeOption !== "auto" && activeCompareItem.targetFormat === "image/png" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs text-amber-800 font-semibold leading-relaxed">
                      <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold mb-0.5">PNG Compression Constraints</p>
                        PNG is a lossless format. For maximum compression, convert this PNG to WebP or JPG.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Dedicated SaaS Conversion Preview Workspace */
            <div className="bg-white rounded-3xl border border-slate-250 shadow-sm overflow-hidden flex flex-col">
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-700 tracking-tight m-0">
                    Format Conversion Workspace
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium m-0 mt-0.5">
                    Select a format, preview, and download your converted file.
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-500 bg-slate-50 border border-slate-100 rounded-md px-2 py-1">
                  Active: {activeCompareItem.name}
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Panel: Original */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Original Image</span>
                    <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
                      <img
                        src={activeCompareItem.originalPreview}
                        alt="Original Preview"
                        className="w-full h-full object-contain pointer-events-none"
                      />
                      <span className="absolute top-3 left-3 bg-slate-900/80 text-white px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border border-slate-800">
                        {activeCompareItem.originalFormat}
                      </span>
                      <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-xs px-4 py-2.5 text-white text-xs truncate font-medium border-t border-white/5">
                        {activeCompareItem.name}
                      </div>
                    </div>
                  </div>

                  {/* Right Panel: Converted Preview */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Converted Preview</span>
                    <div className="relative aspect-video rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-200">
                      <AnimatePresence mode="wait">
                        {activeCompareItem.status === "done" && activeCompareItem.processedPreview ? (
                          <motion.div
                            key="done"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0 flex items-center justify-center bg-slate-900"
                          >
                            <img
                              src={activeCompareItem.processedPreview}
                              alt="Converted Preview"
                              className="w-full h-full object-contain pointer-events-none"
                            />
                            <span className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-lg text-[10px] font-bold shadow-sm animate-pulse">
                              Converted to {activeCompareItem.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                            </span>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex flex-col items-center justify-center"
                          >
                            <img
                              src={activeCompareItem.originalPreview}
                              alt="Original Preview Blurred"
                              className="w-full h-full object-contain blur-md opacity-40 pointer-events-none"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-slate-950/45 text-center">
                              {activeCompareItem.status === "processing" ? (
                                <motion.div
                                  key="processing"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="space-y-4 w-full max-w-[200px] mx-auto text-center"
                                >
                                  <div className="relative w-10 h-10 mx-auto flex items-center justify-center">
                                    <div className="absolute inset-0 border-4 border-emerald-500/20 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-t-emerald-500 rounded-full animate-spin"></div>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-white font-bold text-xs leading-none">{activeCompareItem.conversionStage || "Converting..."}</p>
                                    <p className="text-slate-400 text-[9px] font-semibold">{activeCompareItem.conversionProgress || 0}% completed</p>
                                  </div>
                                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      className="h-full bg-emerald-500"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${activeCompareItem.conversionProgress || 0}%` }}
                                      transition={{ duration: 0.25 }}
                                    />
                                  </div>
                                </motion.div>
                              ) : (
                                <motion.div
                                  key="ready"
                                  initial={{ scale: 0.9, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  className="space-y-2"
                                >
                                  <ImageIcon size={32} className="text-emerald-400 mx-auto opacity-80" />
                                  <p className="text-white font-bold text-sm">Ready to Convert</p>
                                  <p className="text-slate-300 text-[10px]">Select a target format and click Convert Image</p>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {activeCompareItem.isAvifFallbackActive && (
                      <div className="mt-2 bg-amber-50 border border-amber-250 text-amber-850 px-3 py-2.5 rounded-xl flex items-start gap-2 text-xs font-semibold leading-relaxed shadow-xs">
                        <AlertCircle size={14} className="text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                        <div>
                          AVIF export is not supported by your browser. The file was generated as WEBP instead.
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Conversion Results Card (Renders only after successful conversion) */}
                {activeCompareItem.status === "done" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-50/20 border border-emerald-250/60 rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                      <CheckCircle2 size={16} className="text-emerald-500" />
                      <span>✓ Conversion Completed</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 space-y-1">
                        <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Original Format</span>
                        <span className="font-bold text-slate-800 uppercase block">{activeCompareItem.originalFormat}</span>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 space-y-1">
                        <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Converted Format</span>
                        <span className="font-bold text-emerald-700 uppercase block">
                          {activeCompareItem.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                        </span>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 space-y-1">
                        <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Original Size</span>
                        <span className="font-bold text-slate-800 block">{formatSize(activeCompareItem.originalSize)}</span>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 space-y-1">
                        <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">Converted Size</span>
                        <span className="font-bold text-slate-800 block">{formatSize(activeCompareItem.processedSize)}</span>
                      </div>
                      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-3 space-y-1 col-span-2 sm:col-span-1">
                        <span className="text-[9px] text-slate-450 font-black uppercase tracking-wider block">File Difference</span>
                        <span className={`font-bold block ${activeCompareItem.savingsBytes >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                          {activeCompareItem.savingsBytes >= 0 ? "-" : "+"}{formatSize(Math.abs(activeCompareItem.savingsBytes))} ({activeCompareItem.savingsPercent}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-150 pt-3 text-[10px] font-semibold text-slate-400">
                      <div className="flex items-center gap-1">
                        <Shield size={12} className="text-emerald-500" />
                        <span>Output Type: <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-650 font-mono font-bold">{activeCompareItem.targetFormat}</code></span>
                      </div>
                      <div>
                        Secure Browser Execution
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Premium Result Panel Footer */}
              <div className="border-t border-slate-200 p-4 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs font-semibold text-slate-650">
                  <div className="font-bold text-slate-800 truncate max-w-xs" title={activeCompareItem.name}>
                    {activeCompareItem.name}
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 text-[10px] font-black uppercase">
                      {activeCompareItem.originalFormat}
                    </span>
                    <span className="text-slate-400 font-bold">→</span>
                    <span className="px-2 py-0.5 bg-emerald-500 rounded text-white text-[10px] font-black uppercase">
                      {activeCompareItem.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-slate-300">|</span>
                  <div className="text-slate-500">
                    {activeCompareItem.status === "done"
                      ? `${activeCompareItem.processedWidth} × ${activeCompareItem.processedHeight}`
                      : `${activeCompareItem.originalWidth} × ${activeCompareItem.originalHeight}`}
                  </div>
                </div>

                <div>
                  {activeCompareItem.status === "done" ? (
                    <button
                      onClick={() => downloadSingle(activeCompareItem)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Download {activeCompareItem.targetFormat.split("/")[1].toUpperCase().replace("JPEG", "JPG")} Image
                    </button>
                  ) : (
                    <button
                      onClick={processConversionQueue}
                      disabled={isProcessing}
                      className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs shadow-md active:scale-98 transition-all flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 size={14} className="animate-spin" /> Converting...
                        </>
                      ) : (
                        <>
                          Convert Image
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {/* HOW IT WORKS */}
        <div className="space-y-6">
          <h3 className="font-black text-slate-900 text-lg md:text-xl text-center">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { step: "Step 1", title: "Upload your image", text: "Drag-and-drop or select JPG, PNG, WEBP, or AVIF files from your file storage." },
              { step: "Step 2", title: "Adjust quality and format", text: "Select a custom target size constraint or choose an exact output format (e.g. JPG to WebP)." },
              { step: "Step 3", title: "Compress and download", text: "Natively process files inside your browser tab and save the optimized assets instantly." }
            ].map((s, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 text-center space-y-2 relative hover:border-emerald-250 transition-colors">
                <span className="inline-block text-xs font-black bg-emerald-55 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
                  {s.step}
                </span>
                <h4 className="font-bold text-slate-800 text-sm md:text-base">{s.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{s.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* PREMIUM FORMAT COMPARISON TABLE (H2 level) */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="font-black text-slate-900 text-lg md:text-xl">
              Convert JPG, PNG, WEBP & AVIF
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Understand differences in quality, transparency, speed, and search engine optimization.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm bg-white">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-250 font-black text-slate-600 uppercase tracking-widest text-[9px]">
                  <th className="p-4">Format</th>
                  <th className="p-4">Compression</th>
                  <th className="p-4">Quality</th>
                  <th className="p-4">Transparency</th>
                  <th className="p-4">Speed</th>
                  <th className="p-4">SEO</th>
                  <th className="p-4">Best Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-600 font-medium">
                {FORMAT_EDUCATION.map((f, idx) => (
                  <tr key={idx} className={`hover:bg-slate-50/50 ${f.isRecommended ? "bg-emerald-50/20" : ""}`}>
                    <td className="p-4 font-black text-slate-900 flex items-center gap-1.5">
                      {f.format}
                      {f.isRecommended && (
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1 py-0.2 rounded font-black tracking-wide">
                          RECOMMENDED
                        </span>
                      )}
                    </td>
                    <td className="p-4">{f.compression}</td>
                    <td className="p-4">{f.quality}</td>
                    <td className="p-4">{f.transparency}</td>
                    <td className="p-4">{f.speed}</td>
                    <td className="p-4 font-semibold text-emerald-600">{f.seo}</td>
                    <td className="p-4">{f.useCases}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* HIGH-VALUE SEO SIZE TARGETED GUIDES (H2 level) */}
        <div className="space-y-6 border-t border-slate-200 pt-8">
          <div className="text-center">
            <h2 className="font-black text-slate-900 text-lg md:text-xl">
              Image Compression Guides
            </h2>
            <p className="text-xs text-slate-500 font-medium max-w-xl mx-auto">
              Follow our structural guidelines to reduce image size for job boards, government portals, and web assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Compress Image to 20KB",
                desc: "Compressing images to 20KB is a standard requirement for government forms and official online uploads. To compress image to 20KB, start by resizing the width of your image down to under 800px. Convert JPG or PNG format into WebP, which handles lossy compression gracefully without adding blocking artifacts. Select the 20KB target size option; our browser engine will optimize quality settings directly."
              },
              {
                title: "Compress Image to 50KB",
                desc: "A 50KB boundary is ideal for profile avatars, signatures, and light attachments. To compress image to 50KB online, choose WebP or JPEG. Select our 50KB preset in the editor. Our browser tool will compute quality presets iteratively. If you start with a heavy 5MB photo, crop out extra margins beforehand to retain center clarity."
              },
              {
                title: "Compress Image to 100KB",
                desc: "Optimizing website graphics to 100KB is critical for high PageSpeed performance. Compressing images to 100KB helps you balance visual quality and loading speed. Convert standard JPG/PNG files to modern WebP or AVIF. This ensures fast download times on mobile devices, improving your site Core Web Vitals and search engine rankings."
              },
              {
                title: "Compress Image to 200KB",
                desc: "For prominent blog banners and high-resolution product photos, a 200KB limit is recommended. To compress image to 200KB, set our quality slider manually to 80% or select the 200KB target preset. WebP is highly recommended for graphics with transparent details, saving up to 30% file size compared to PNG format."
              },
              {
                title: "Compress Image to 500KB",
                desc: "Photography showcases and PDF attachments usually require file limits under 500KB. Compress image to 500KB to clear this limit easily. AVIF format delivers next-generation structural fidelity, allowing you to showcase vibrant colors at half the weight of traditional JPGs, while automatic processing strips metadata logs."
              },
              {
                title: "Compress Image to 1MB",
                desc: "High-definition camera pictures often exceed 10MB. Compress image to 1MB to clear messaging app limits or email attachment ceilings. Our batch image size reducer scales quality and dimensions smoothly, ensuring that large print-ready photos retain their pixel density and look crystal clear on modern high-DPI displays."
              }
            ].map((g, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 hover:border-slate-350 transition-colors">
                <h4 className="font-bold text-slate-800 text-sm">{g.title}</h4>
                <p className="text-slate-500 text-xs leading-relaxed">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GEO AI ANSWER CARDS */}
        <div className="space-y-6 border-t border-slate-200 pt-8">
          <div className="text-center">
            <h3 className="font-black text-slate-900 text-lg md:text-xl">
              AI & Search Engine Quick Answers
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Direct, factual responses optimized for AI overviews and digital search agents.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {GEO_CARDS.map((card, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 hover:border-emerald-250 transition-colors">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-emerald-500 rounded-full shrink-0" />
                  {card.q}
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed font-medium">
                  {card.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ABOUT SECTION (CONCISE SEO TARGET) */}
        <div className="max-w-3xl mx-auto bg-slate-50 rounded-2xl p-6 border border-slate-200/60 text-xs leading-relaxed space-y-4">
          <h3 className="font-black text-slate-900 text-sm">
            About SnapFreeTools Image Compressor & Converter
          </h3>
          <p className="text-slate-500 font-medium">
            SnapFreeTools Image Compressor is a premium, 100% browser-based utility designed for instant image optimization and format conversion. Large media files slow down website loading speeds, increase server costs, and damage conversion rates. By utilizing native browser APIs (HTML5 Canvas and Web Worker resources), this tool optimizes your visuals client-side. Your photos, screenshots, and logos never touch any external server, guaranteeing absolute privacy and zero risk of data exposure.
          </p>
          <p className="text-slate-500 font-medium">
            Our toolkit functions as both a high-fidelity image compressor and a versatile format converter. Instantly convert png to jpg, jpg to png, and jpg to webp without installing plugins. We support modern image standards like WebP and AVIF to help you meet modern Google PageSpeed standards and improve SEO performance. Whether you need to compress image to 20KB for an official government portal, or compress image to 100KB for your e-commerce storefront, our automated target-size binary search engine scales quality settings dynamically to deliver accurate file sizes. Speed up your web page loading times, reduce bandwidth overhead, and streamline your workflow with SnapFreeTools today.
          </p>
        </div>

        {/* PEOPLE ALSO SEARCH FOR & INTERNAL LINKS */}
        <div className="border-t border-slate-250 pt-8 pb-4 text-center space-y-4">
          <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            People Also Search For
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] font-bold">
            {[
              { label: "Image Compressor to 20KB", path: "/image-compressor" },
              { label: "Image Compressor to 50KB", path: "/image-compressor" },
              { label: "Image Compressor to 100KB", path: "/image-compressor" },
              { label: "Image Compressor to 200KB", path: "/image-compressor" },
              { label: "Image Compressor to 500KB", path: "/image-compressor" },
              { label: "Image Compressor to 1MB", path: "/image-compressor" },
              { label: "Compress JPG Online", path: "/image-compressor" },
              { label: "Compress PNG Online", path: "/image-compressor" },
              { label: "Compress WEBP Online", path: "/image-compressor" },
              { label: "Photo Compressor", path: "/image-compressor" },
              { label: "Image Size Reducer", path: "/image-compressor" },
              { label: "Online Image Converter", path: "/image-compressor" },
              { label: "JPG to WEBP", path: "/image-compressor" },
              { label: "PNG to JPG", path: "/image-compressor" },
              { label: "WEBP to PNG", path: "/image-compressor" },
              { label: "AVIF Converter", path: "/image-compressor" }
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.path}
                className="px-2.5 py-1 bg-white border border-slate-200 text-slate-650 rounded hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-xs font-bold text-slate-500">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Other Utilities:</span>
            <Link href="/word-counter" className="hover:text-emerald-500 transition-colors">✍️ Word Counter</Link>
            <Link href="/gpa-calculator" className="hover:text-emerald-500 transition-colors">🎓 GPA Calculator</Link>
            <Link href="/pdf-to-word" className="hover:text-emerald-500 transition-colors">📄 PDF to Word</Link>
          </div>
        </div>

        {/* ACCORDION FAQ SECTION (H2 level) */}
        <div className="space-y-6 border-t border-slate-200 pt-8 max-w-3xl mx-auto pb-12">
          <div className="text-center">
            <h2 className="font-black text-slate-900 text-lg md:text-xl">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Get detailed answers about local browser processing, file privacy, and modern image formats.
            </p>
          </div>

          <div className="space-y-3">
            {/* Show only first 10 FAQs in UI */}
            {FAQS_DATA.slice(0, 10).map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all duration-200">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 font-bold text-xs md:text-sm text-slate-800 flex items-center justify-between hover:text-emerald-600 focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <span className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                      ▼
                    </span>
                  </button>
                  {isOpen && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-500 leading-relaxed font-medium">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}
