"use client";

import React, { useState, useEffect } from "react";
import ToolLayout from "@/layouts/tool-layout";

import UploadState from "./components/UploadState.js";
import Workspace from "./components/Workspace.js";
import ProcessingState from "./components/ProcessingState.js";
import SuccessState from "./components/SuccessState.js";

import {
  validatePngFile,
  parsePngHeaderDimensions,
  createPdfFromPngs,
  PNG_SAFETY_LIMITS
} from "./utils/pngToPdfEngine.js";

export default function PngToPdfFeature() {
  // Step state machine: 'upload' | 'workspace' | 'processing' | 'success'
  const [stage, setStage] = useState("upload");
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  // PDF Page Settings
  const [settings, setSettings] = useState({
    pageSize: "a4",
    orientation: "auto",
    fitMode: "FIT_TO_PAGE",
    margin: "none"
  });

  // Progress & Execution State
  const [progress, setProgress] = useState({ current: 0, total: 0, stage: "" });
  const [result, setResult] = useState(null);

  // Clean up object URLs on change or unmount
  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.url) {
          try {
            URL.revokeObjectURL(img.url);
          } catch (e) {}
        }
      });
    };
  }, []);

  useEffect(() => {
    return () => {
      if (result && result.downloadUrl) {
        try {
          URL.revokeObjectURL(result.downloadUrl);
        } catch (e) {}
      }
    };
  }, [result]);

  // Helper to extract dimensions & validate each PNG file
  const processFiles = async (fileList, currentImagesList = images) => {
    setError(null);

    if (!fileList || fileList.length === 0) return;

    const remainingCapacity = PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT - currentImagesList.length;

    if (remainingCapacity <= 0) {
      setError(`Maximum batch limit of ${PNG_SAFETY_LIMITS.MAX_BATCH_IMAGE_COUNT} images has been reached.`);
      return;
    }

    let filesToProcess = Array.from(fileList);
    let capExceeded = false;

    if (filesToProcess.length > remainingCapacity) {
      filesToProcess = filesToProcess.slice(0, remainingCapacity);
      capExceeded = true;
    }

    const processedNewImages = [];
    let validationErrorMessage = null;

    for (const file of filesToProcess) {
      // Basic check
      if (!file.name.toLowerCase().endsWith(".png") && file.type && file.type !== "image/png") {
        validationErrorMessage = `File "${file.name}" is not a valid PNG image.`;
        continue;
      }

      // Check size
      const sizeValidation = validatePngFile(file, file.name);
      if (!sizeValidation.isValid) {
        validationErrorMessage = sizeValidation.error;
        continue;
      }

      try {
        const arrayBuffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);

        const headerDims = parsePngHeaderDimensions(uint8Array);

        let width = headerDims?.width;
        let height = headerDims?.height;

        // Fallback to browser Image decoding if header parsing unavailable
        if (!width || !height) {
          if (typeof window !== "undefined" && typeof document !== "undefined") {
            const tempUrl = URL.createObjectURL(file);
            const imgEl = new Image();
            await new Promise((resolve) => {
              imgEl.onload = () => {
                width = imgEl.naturalWidth || imgEl.width;
                height = imgEl.naturalHeight || imgEl.height;
                resolve();
              };
              imgEl.onerror = () => resolve();
              imgEl.src = tempUrl;
            });
            URL.revokeObjectURL(tempUrl);
          }
        }

        if (!width || !height) {
          validationErrorMessage = `Could not determine dimensions for PNG file "${file.name}". The file may be corrupted.`;
          continue;
        }

        const pixelCount = width * height;
        if (pixelCount > PNG_SAFETY_LIMITS.MAX_CANVAS_PIXELS) {
          validationErrorMessage = `Image "${file.name}" (${width}×${height} px) exceeds the maximum 12 Megapixel safety cap.`;
          continue;
        }

        const previewUrl = URL.createObjectURL(file);

        processedNewImages.push({
          id: Math.random().toString(36).substring(2, 9) + Date.now(),
          file,
          bytes: uint8Array,
          url: previewUrl,
          name: file.name,
          size: file.size,
          width,
          height
        });
      } catch (err) {
        validationErrorMessage = `Failed to process image "${file.name}": ${err.message}`;
      }
    }

    if (processedNewImages.length > 0) {
      const updatedList = [...currentImagesList, ...processedNewImages];
      setImages(updatedList);
      setStage("workspace");

      if (capExceeded) {
        setError(`Added ${processedNewImages.length} images. Remaining files were skipped to maintain the 100 image batch limit.`);
      } else if (validationErrorMessage) {
        setError(validationErrorMessage);
      }
    } else if (validationErrorMessage) {
      setError(validationErrorMessage);
    }
  };

  const handleFilesSelected = (selectedFiles) => {
    processFiles(selectedFiles, images);
  };

  const handleAddImages = (newFiles) => {
    processFiles(newFiles, images);
  };

  const handleSettingsChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleMoveImage = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const reordered = [...images];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);
    setImages(reordered);
  };

  const handleRemoveImage = (index) => {
    const target = images[index];
    if (target && target.url) {
      try {
        URL.revokeObjectURL(target.url);
      } catch (e) {}
    }
    const updated = images.filter((_, idx) => idx !== index);
    setImages(updated);

    if (updated.length === 0) {
      setStage("upload");
    }
  };

  const handleClearAll = () => {
    images.forEach((img) => {
      if (img.url) {
        try {
          URL.revokeObjectURL(img.url);
        } catch (e) {}
      }
    });
    setImages([]);
    setError(null);
    if (result && result.downloadUrl) {
      try {
        URL.revokeObjectURL(result.downloadUrl);
      } catch (e) {}
    }
    setResult(null);
    setStage("upload");
  };

  const handleConvert = async () => {
    if (images.length === 0) return;

    setStage("processing");
    setError(null);
    setProgress({ current: 0, total: images.length, stage: "Preparing PNG images for conversion..." });

    try {
      const pdfOutput = await createPdfFromPngs({
        images,
        settings,
        onProgress: (prog) => {
          setProgress(prog);
        }
      });

      const pdfBlob = new Blob([pdfOutput.pdfBytes], { type: "application/pdf" });
      const downloadUrl = URL.createObjectURL(pdfBlob);

      setResult({
        downloadUrl,
        filename: pdfOutput.filename,
        pageCount: pdfOutput.pageCount,
        fileSize: pdfOutput.pdfBytes.byteLength
      });

      setStage("success");
    } catch (err) {
      console.error("PNG to PDF Conversion Error:", err);
      setError(err.message || "Failed to convert PNG images to PDF. Please try again.");
      setStage("workspace");
    }
  };

  const handleReset = () => {
    if (result && result.downloadUrl) {
      try {
        URL.revokeObjectURL(result.downloadUrl);
      } catch (e) {}
    }
    setResult(null);
    setError(null);
    setStage("workspace");
  };

  return (
    <ToolLayout
      title="PNG to PDF Converter — Convert PNG Images to PDF Online"
      description="Convert PNG images into a single PDF document directly in your browser."
    >
      <div className="space-y-8">
        <section className="min-h-[420px] flex flex-col justify-center">
          {stage === "upload" && (
            <UploadState
              onFilesSelected={handleFilesSelected}
              error={error}
            />
          )}

          {stage === "workspace" && (
            <Workspace
              images={images}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              onAddImages={handleAddImages}
              onRemoveImage={handleRemoveImage}
              onMoveImage={handleMoveImage}
              onClearAll={handleClearAll}
              onConvert={handleConvert}
              error={error}
            />
          )}

          {stage === "processing" && (
            <ProcessingState progress={progress} />
          )}

          {stage === "success" && result && (
            <SuccessState
              result={result}
              onReset={handleReset}
            />
          )}
        </section>
      </div>
    </ToolLayout>
  );
}
