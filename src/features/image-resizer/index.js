"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Scaling, ShieldCheck, Zap, Image as ImageIcon, Sparkles } from "lucide-react";

import {
  loadImageFromFile,
  calculateTargetDimensions,
  processImageResize
} from "./utils/imageResizer";

import ImageUploader from "./components/ImageUploader";
import ResizeControls from "./components/ResizeControls";
import BeforeAfterPreview from "./components/BeforeAfterPreview";
import BatchResizer from "./components/BatchResizer";
import ImageResizerSEO from "./components/ImageResizerSEO";
import ShareSystem from "@/components/share";

export default function ImageResizerFeature({ faqs = [] }) {
  // Single image mode states
  const [singleImage, setSingleImage] = useState(null);
  const [singleResult, setSingleResult] = useState(null);

  // Batch mode states
  const [batchItems, setBatchItems] = useState([]);
  const [isBatch, setIsBatch] = useState(false);

  // Control states
  const [mode, setMode] = useState("custom");
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(800);
  const [percentage, setPercentage] = useState(100);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState("custom");
  const [quality, setQuality] = useState(0.90);
  const [outputFormat, setOutputFormat] = useState("original");
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [targetSizeKb, setTargetSizeKb] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Track last changed dimension field for aspect ratio lock math
  const [lastChangedField, setLastChangedField] = useState("width");

  // Revoke object URLs on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (singleImage?.objectUrl) URL.revokeObjectURL(singleImage.objectUrl);
      if (singleResult?.blobUrl) URL.revokeObjectURL(singleResult.blobUrl);
      batchItems.forEach(item => {
        if (item.original?.objectUrl) URL.revokeObjectURL(item.original.objectUrl);
        if (item.result?.blobUrl) URL.revokeObjectURL(item.result.blobUrl);
      });
    };
  }, []);

  // Handle Width change with Aspect Ratio Lock
  const handleWidthChange = (newWidth) => {
    setLastChangedField("width");
    setWidth(newWidth);
    if (lockAspectRatio && singleImage?.aspectRatio) {
      setHeight(Math.max(1, Math.round(newWidth / singleImage.aspectRatio)));
    }
  };

  // Handle Height change with Aspect Ratio Lock
  const handleHeightChange = (newHeight) => {
    setLastChangedField("height");
    setHeight(newHeight);
    if (lockAspectRatio && singleImage?.aspectRatio) {
      setWidth(Math.max(1, Math.round(newHeight * singleImage.aspectRatio)));
    }
  };

  // Handle File Selection
  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;
    setError(null);

    if (files.length === 1) {
      // Single Image Mode
      try {
        const loaded = await loadImageFromFile(files[0]);
        if (singleImage?.objectUrl) URL.revokeObjectURL(singleImage.objectUrl);
        if (singleResult?.blobUrl) URL.revokeObjectURL(singleResult.blobUrl);
        
        setSingleImage(loaded);
        setSingleResult(null);
        setIsBatch(false);
        setWidth(loaded.width);
        setHeight(loaded.height);
        setPercentage(100);
      } catch (err) {
        setError(err.message || "Failed to load image.");
      }
    } else {
      // Batch Mode
      setIsBatch(true);
      try {
        const loadedList = await Promise.all(
          files.map(f => loadImageFromFile(f).catch(() => null))
        );
        const validList = loadedList.filter(Boolean).map(orig => ({
          original: orig,
          result: null,
          isProcessing: false,
          error: null
        }));
        if (validList.length === 0) {
          setError("Failed to decode the selected batch of images.");
          return;
        }
        setBatchItems(validList);
      } catch (err) {
        setError(err.message || "Failed to load batch images.");
      }
    }
  };

  // Main Single Image Resize Executor
  const executeSingleResize = useCallback(async () => {
    if (!singleImage) return;
    setIsProcessing(true);
    setError(null);

    try {
      const targetDims = calculateTargetDimensions(
        singleImage.width,
        singleImage.height,
        mode,
        {
          width,
          height,
          percentage,
          lockAspectRatio,
          lastChanged: lastChangedField,
          fitWidth: width,
          fitHeight: height
        }
      );

      const res = await processImageResize({
        imgElement: singleImage.imgElement,
        originalFile: singleImage.file,
        targetWidth: targetDims.width,
        targetHeight: targetDims.height,
        outputFormat,
        quality,
        backgroundColor,
        crop: targetDims.crop || false,
        targetSizeKb: targetSizeKb ? Number(targetSizeKb) : null
      });

      if (singleResult?.blobUrl) URL.revokeObjectURL(singleResult.blobUrl);
      setSingleResult(res);
    } catch (err) {
      setError(err.message || "An error occurred while resizing image.");
    } finally {
      setIsProcessing(false);
    }
  }, [singleImage, mode, width, height, percentage, lockAspectRatio, lastChangedField, outputFormat, quality, backgroundColor, targetSizeKb]);

  // Main Batch Resize Executor
  const executeBatchResize = useCallback(async () => {
    if (!batchItems || batchItems.length === 0) return;
    setIsProcessing(true);

    const updated = await Promise.all(
      batchItems.map(async (item) => {
        try {
          const targetDims = calculateTargetDimensions(
            item.original.width,
            item.original.height,
            mode,
            {
              width,
              height,
              percentage,
              lockAspectRatio,
              lastChanged: lastChangedField,
              fitWidth: width,
              fitHeight: height
            }
          );

          const res = await processImageResize({
            imgElement: item.original.imgElement,
            originalFile: item.original.file,
            targetWidth: targetDims.width,
            targetHeight: targetDims.height,
            outputFormat,
            quality,
            backgroundColor,
            crop: targetDims.crop || false,
            targetSizeKb: targetSizeKb ? Number(targetSizeKb) : null
          });

          if (item.result?.blobUrl) URL.revokeObjectURL(item.result.blobUrl);
          return { ...item, result: res, isProcessing: false, error: null };
        } catch (err) {
          return { ...item, isProcessing: false, error: err.message };
        }
      })
    );

    setBatchItems(updated);
    setIsProcessing(false);
  }, [batchItems, mode, width, height, percentage, lockAspectRatio, lastChangedField, outputFormat, quality, backgroundColor, targetSizeKb]);

  // Trigger processing on settings change (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isBatch && singleImage) {
        executeSingleResize();
      } else if (isBatch && batchItems.length > 0) {
        executeBatchResize();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [singleImage, isBatch, mode, width, height, percentage, lockAspectRatio, outputFormat, quality, backgroundColor, targetSizeKb]);

  // Download Handlers
  const handleDownloadSingle = () => {
    if (!singleResult) return;
    const a = document.createElement("a");
    a.href = singleResult.blobUrl;
    a.download = singleResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadBatchItem = (item) => {
    if (!item.result) return;
    const a = document.createElement("a");
    a.href = item.result.blobUrl;
    a.download = item.result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadAllBatch = () => {
    batchItems.forEach(item => {
      if (item.result) {
        handleDownloadBatchItem(item);
      }
    });
  };

  // Reset Controls
  const handleResetSettings = () => {
    setMode("custom");
    setSelectedPreset("custom");
    setPercentage(100);
    setLockAspectRatio(true);
    setQuality(0.90);
    setOutputFormat("original");
    setBackgroundColor("#FFFFFF");
    setTargetSizeKb("");
    if (singleImage) {
      setWidth(singleImage.width);
      setHeight(singleImage.height);
    }
  };

  // Remove Active Single Image
  const handleRemoveSingleImage = () => {
    if (singleImage?.objectUrl) URL.revokeObjectURL(singleImage.objectUrl);
    if (singleResult?.blobUrl) URL.revokeObjectURL(singleResult.blobUrl);
    setSingleImage(null);
    setSingleResult(null);
    setError(null);
  };

  // Clear Batch
  const handleClearBatch = () => {
    batchItems.forEach(item => {
      if (item.original?.objectUrl) URL.revokeObjectURL(item.original.objectUrl);
      if (item.result?.blobUrl) URL.revokeObjectURL(item.result.blobUrl);
    });
    setBatchItems([]);
    setIsBatch(false);
  };

  return (
    <div className="bg-slate-50/50 min-h-screen pb-16">
      
      {/* Hero Header */}
      <section className="relative pt-12 pb-8 text-center px-4 bg-white border-b border-slate-200/50">
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-widest select-none">
            <Sparkles size={12} className="text-amber-500" />
            100% In-Browser Image Tool
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Online <span className="text-amber-500 italic font-serif">Image Resizer</span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto font-semibold leading-relaxed">
            Resize, optimize, and convert JPG, PNG, and WebP images to custom dimensions or social media presets with 100% client-side privacy.
          </p>

          <div className="flex justify-center items-center gap-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider select-none pt-1">
            <div className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-emerald-500" />
              100% Private
            </div>
            <div className="flex items-center gap-1">
              <Zap size={13} className="text-amber-500" />
              Instant Canvas Engine
            </div>
            <div className="flex items-center gap-1">
              <Scaling size={13} className="text-blue-500" />
              Batch & Presets
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Upload Zone (shown when no images are active) */}
        {!singleImage && batchItems.length === 0 && (
          <ImageUploader onFilesSelected={handleFilesSelected} error={error} />
        )}

        {/* Work Area (shown when image is loaded) */}
        {(singleImage || batchItems.length > 0) && (
          <div className="space-y-6">
            
            {/* Resize Settings Controls */}
            <ResizeControls
              mode={mode}
              setMode={setMode}
              width={width}
              setWidth={handleWidthChange}
              height={height}
              setHeight={handleHeightChange}
              percentage={percentage}
              setPercentage={setPercentage}
              lockAspectRatio={lockAspectRatio}
              setLockAspectRatio={setLockAspectRatio}
              selectedPreset={selectedPreset}
              setSelectedPreset={setSelectedPreset}
              quality={quality}
              setQuality={setQuality}
              outputFormat={outputFormat}
              setOutputFormat={setOutputFormat}
              backgroundColor={backgroundColor}
              setBackgroundColor={setBackgroundColor}
              targetSizeKb={targetSizeKb}
              setTargetSizeKb={setTargetSizeKb}
              originalWidth={singleImage?.width || 1200}
              originalHeight={singleImage?.height || 800}
              originalType={singleImage?.type || "image/jpeg"}
              onReset={handleResetSettings}
            />

            {/* Render Preview according to Single or Batch mode */}
            {!isBatch && singleImage && (
              <BeforeAfterPreview
                original={singleImage}
                result={singleResult}
                isProcessing={isProcessing}
                onDownload={handleDownloadSingle}
                onRemove={handleRemoveSingleImage}
                onReset={handleResetSettings}
              />
            )}

            {isBatch && (
              <BatchResizer
                batchItems={batchItems}
                onRemoveItem={(idx) => {
                  const item = batchItems[idx];
                  if (item?.original?.objectUrl) URL.revokeObjectURL(item.original.objectUrl);
                  if (item?.result?.blobUrl) URL.revokeObjectURL(item.result.blobUrl);
                  const updated = batchItems.filter((_, i) => i !== idx);
                  if (updated.length === 0) setIsBatch(false);
                  setBatchItems(updated);
                }}
                onDownloadItem={handleDownloadBatchItem}
                onDownloadAll={handleDownloadAllBatch}
                onClearAll={handleClearBatch}
                onAddMore={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.multiple = true;
                  input.onchange = (e) => {
                    if (e.target.files) handleFilesSelected(Array.from(e.target.files));
                  };
                  input.click();
                }}
              />
            )}
          </div>
        )}

        {/* Centralized Share System */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <ShareSystem
            toolName="Image Resizer"
            toolSlug="/image-resizer"
            result={singleResult ? {
              summary: `Resized image to ${singleResult.width}×${singleResult.height} px using SnapFreeTools!`
            } : null}
          />
        </div>

        {/* SEO Educational Content & FAQ */}
        <ImageResizerSEO faqs={faqs} />

      </main>
    </div>
  );
}
