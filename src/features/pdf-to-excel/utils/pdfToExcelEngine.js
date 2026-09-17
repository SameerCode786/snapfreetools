import JSZip from "jszip";
import { ocrPage } from "./ocrHelper.js";

/**
 * Gets or initializes pdfjs-dist worker engine.
 */
export const getPdfJsEngine = async () => {
  let pdfjsModule;
  if (typeof window !== "undefined") {
    pdfjsModule = await import("pdfjs-dist");
  } else {
    pdfjsModule = await import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  const pdfjs = pdfjsModule.default || pdfjsModule;
  if (typeof window !== "undefined" && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
  }
  return pdfjs;
};

/**
 * Helper to identify password-protected or encrypted PDF errors.
 */
export const isPasswordProtectedError = (err) => {
  if (!err) return false;
  if (err.name === "PasswordException" || err.name === "EncryptedPDFError") return true;
  if (err.code === 1 || err.code === 2) return true; // PDFJS PasswordResponses
  const msg = (err.message || "").toString().toLowerCase();
  return (
    msg.includes("password") ||
    msg.includes("encrypted") ||
    msg.includes("no password given") ||
    msg.includes("passwordexception") ||
    msg.includes("incorrect password")
  );
};

/**
 * Parses user page range input string (e.g., "1-3, 5, 7-10") into 0-based page indices.
 */
export const parsePageRange = (rangeStr, totalPages) => {
  if (!rangeStr || !rangeStr.trim() || rangeStr.trim().toLowerCase() === "all") {
    return {
      validIndices: Array.from({ length: totalPages }, (_, i) => i),
      invalidPages: [],
      warningMessage: null,
      errorMessage: null
    };
  }

  const parts = rangeStr.split(",");
  const selectedIndicesSet = new Set();
  const invalidPagesSet = new Set();

  parts.forEach((part) => {
    const trimmed = part.trim();
    if (!trimmed) return;

    if (trimmed.includes("-")) {
      const [startStr, endStr] = trimmed.split("-").map((s) => s.trim());
      const start = parseInt(startStr, 10);
      const end = parseInt(endStr, 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end < start) {
        return;
      }

      for (let p = start; p <= end; p++) {
        if (p >= 1 && p <= totalPages) {
          selectedIndicesSet.add(p - 1);
        } else {
          invalidPagesSet.add(p);
        }
      }
    } else {
      const p = parseInt(trimmed, 10);
      if (!isNaN(p)) {
        if (p >= 1 && p <= totalPages) {
          selectedIndicesSet.add(p - 1);
        } else {
          invalidPagesSet.add(p);
        }
      }
    }
  });

  const validIndices = Array.from(selectedIndicesSet).sort((a, b) => a - b);
  const invalidPages = Array.from(invalidPagesSet).sort((a, b) => a - b);

  let warningMessage = null;
  let errorMessage = null;

  if (invalidPages.length > 0) {
    warningMessage = `Page ${invalidPages.join(", ")} ${invalidPages.length === 1 ? "is" : "are"} out of document bounds (total pages: ${totalPages}).`;
  }

  if (validIndices.length === 0) {
    errorMessage = `No valid pages selected. Document has ${totalPages} ${totalPages === 1 ? "page" : "pages"}.`;
  }

  return { validIndices, invalidPages, warningMessage, errorMessage };
};

/**
 * Sanitizes worksheet title to comply with Excel limits (max 31 chars, no invalid symbols).
 */
export const sanitizeWorksheetName = (name, index = 1, existingNames = new Set()) => {
  let clean = (name || `Table ${index}`)
    .replace(/[\\/?*:[\]]/g, "_")
    .trim();

  if (!clean) clean = `Table ${index}`;

  if (clean.length > 31) {
    clean = clean.substring(0, 31).trim();
  }

  let finalName = clean;
  let counter = 1;
  while (existingNames.has(finalName.toLowerCase())) {
    const suffix = ` (${counter})`;
    const maxBaseLen = 31 - suffix.length;
    finalName = `${clean.substring(0, maxBaseLen)}${suffix}`;
    counter++;
  }

  existingNames.add(finalName.toLowerCase());
  return finalName;
};

/**
 * Reconstructs a 2D tabular grid from structured positional text nodes.
 * Used for both native PDF.js text items and OCR word-level bounding boxes.
 *
 * @param {Array<{ str?: string, text?: string, x?: number, x0?: number, y?: number, y0?: number, width?: number, height?: number, confidence?: number }>} textNodes
 * @param {Object} options - { isCanvasCoords: boolean, returnDiagnostics: boolean }
 * @returns {Array<Array<string>> | { rows: Array<Array<string>>, diagnostics: Object } | null} 2D array of rows x columns, or null if no table structure found.
 */
export const reconstructTableFromTextNodes = (textNodes, options = {}) => {
  const { isCanvasCoords = false, returnDiagnostics = false, passId = Date.now() } = options;

  if (!textNodes || textNodes.length === 0) {
    if (returnDiagnostics) {
      return {
        rows: null,
        diagnostics: {
          wordCount: 0,
          avgConfidence: 0,
          ranges: { minX0: 0, minY0: 0, maxX1: 0, maxY1: 0 },
          medianHeight: 0,
          reconstructedRowCount: 0,
          cellsPerRow: [],
          detectedColumnPositions: [],
          finalColumnCount: 0,
          rejectionReason: "No text nodes or OCR words provided to engine",
          receivedByDetectedTables: false,
          legacyReconstructionInvoked: false,
          doubleReconstructionDetected: false,
          staleTableStateDetected: false
        }
      };
    }
    return null;
  }

  // 1. Normalize and sanitize text nodes
  const rawNodes = textNodes
    .filter((n) => n && (n.str || n.text))
    .map((n) => {
      const str = (n.str || n.text || "").trim();
      const x0 = typeof n.x0 === "number" ? n.x0 : (typeof n.x === "number" ? n.x : 0);
      const y0 = typeof n.y0 === "number" ? n.y0 : (typeof n.y === "number" ? n.y : 0);
      const width = n.width || Math.max(1, (n.x1 || x0) - x0);
      const height = n.height || Math.max(1, (n.y1 || y0) - y0);
      const x1 = typeof n.x1 === "number" ? n.x1 : x0 + width;
      const y1 = typeof n.y1 === "number" ? n.y1 : y0 + height;
      const centerY = (y0 + y1) / 2;
      return {
        str,
        x0,
        y0,
        x1,
        y1,
        width,
        height,
        centerY,
        confidence: typeof n.confidence === "number" ? n.confidence : 100
      };
    })
    .filter((n) => {
      if (!n.str || n.str.length === 0) return false;
      if (n.confidence < 15 && n.str.length <= 2) return false;
      return true;
    });

  const totalConfSum = rawNodes.reduce((sum, n) => sum + (n.confidence || 0), 0);
  const avgConfidence = rawNodes.length > 0 ? Math.round(totalConfSum / rawNodes.length) : 0;

  const diag = {
    wordCount: rawNodes.length,
    avgConfidence,
    ranges: {
      minX0: rawNodes.length > 0 ? Math.min(...rawNodes.map((n) => n.x0)) : 0,
      maxX0: rawNodes.length > 0 ? Math.max(...rawNodes.map((n) => n.x0)) : 0,
      minY0: rawNodes.length > 0 ? Math.min(...rawNodes.map((n) => n.y0)) : 0,
      maxY0: rawNodes.length > 0 ? Math.max(...rawNodes.map((n) => n.y0)) : 0,
      minX1: rawNodes.length > 0 ? Math.min(...rawNodes.map((n) => n.x1)) : 0,
      maxX1: rawNodes.length > 0 ? Math.max(...rawNodes.map((n) => n.x1)) : 0,
      minY1: rawNodes.length > 0 ? Math.min(...rawNodes.map((n) => n.y1)) : 0,
      maxY1: rawNodes.length > 0 ? Math.max(...rawNodes.map((n) => n.y1)) : 0
    },
    medianHeight: 0,
    reconstructedRowCount: 0,
    cellsPerRow: [],
    detectedColumnPositions: [],
    finalColumnCount: 0,
    rejectionReason: null,
    receivedByDetectedTables: false,
    legacyReconstructionInvoked: false,
    doubleReconstructionDetected: false,
    staleTableStateDetected: false
  };

  if (rawNodes.length < 2) {
    diag.rejectionReason = `Fewer than 2 valid words found on page (word count: ${rawNodes.length})`;
    return returnDiagnostics ? { rows: null, diagnostics: diag } : null;
  }

  // 2. Compute Geometry-Derived Statistics & Local Gap Distributions
  const sortedHeights = [...rawNodes.map((n) => n.height)].sort((a, b) => a - b);
  const medianHeight = sortedHeights[Math.floor(sortedHeights.length / 2)] || 10;
  diag.medianHeight = medianHeight;

  const charWidths = rawNodes
    .map((n) => n.width / Math.max(1, n.str.length))
    .sort((a, b) => a - b);
  const medianCharWidth = charWidths[Math.floor(charWidths.length / 2)] || (medianHeight * 0.5);

  const yTolerance = medianHeight * 1.15;
  const colAnchorTolerance = Math.max(medianCharWidth * 3.0, medianHeight * 0.8);

  // Measure intra-line word gap distribution
  if (isCanvasCoords) {
    rawNodes.sort((a, b) => a.centerY - b.centerY || a.x0 - b.x0);
  } else {
    rawNodes.sort((a, b) => b.centerY - a.centerY || a.x0 - b.x0);
  }

  const intraWordGaps = [];
  for (let i = 0; i < rawNodes.length - 1; i++) {
    const curr = rawNodes[i];
    const next = rawNodes[i + 1];
    if (Math.abs(curr.centerY - next.centerY) <= yTolerance) {
      const gap = next.x0 - curr.x1;
      if (gap >= 0 && gap <= medianCharWidth * 2.2) {
        intraWordGaps.push(gap);
      }
    }
  }
  intraWordGaps.sort((a, b) => a - b);
  const medianIntraLineGap = intraWordGaps.length > 0 ? intraWordGaps[Math.floor(intraWordGaps.length / 2)] : (medianCharWidth * 0.8);

  // Adaptive threshold for merging words into phrase cells (must be smaller than column gutters)
  const localSentenceGapThreshold = Math.min(medianIntraLineGap * 2.0, medianCharWidth * 1.6);

  // 3. Native PDF.js TextItem Chunk Merging & Row Grouping
  const rowGroups = [];
  rawNodes.forEach((node) => {
    let bestGroup = null;
    let minDiff = Infinity;

    for (const group of rowGroups) {
      const diff = Math.abs(group.anchorCenterY - node.centerY);
      const yOverlap = Math.min(group.maxY1, node.y1) - Math.max(group.minY0, node.y0);
      const minH = Math.min(group.minHeight, node.height);

      if ((diff <= yTolerance || yOverlap >= minH * 0.35) && diff < minDiff) {
        minDiff = diff;
        bestGroup = group;
      }
    }

    if (bestGroup) {
      bestGroup.nodes.push(node);
      bestGroup.minY0 = Math.min(bestGroup.minY0, node.y0);
      bestGroup.maxY1 = Math.max(bestGroup.maxY1, node.y1);
      bestGroup.minHeight = Math.min(bestGroup.minHeight, node.height);
    } else {
      rowGroups.push({
        anchorCenterY: node.centerY,
        minY0: node.y0,
        maxY1: node.y1,
        minHeight: node.height,
        nodes: [node]
      });
    }
  });

  if (rowGroups.length === 0) {
    diag.rejectionReason = "Could not cluster words into horizontal row groups";
    return returnDiagnostics ? { rows: null, tables: [], diagnostics: diag } : null;
  }

  if (isCanvasCoords) {
    rowGroups.sort((a, b) => a.anchorCenterY - b.anchorCenterY);
  } else {
    rowGroups.sort((a, b) => b.anchorCenterY - a.anchorCenterY);
  }

  // Form phrase candidates per row using adaptive intra-line gap distribution
  rowGroups.forEach((group) => {
    group.nodes.sort((a, b) => a.x0 - b.x0);
    const phrases = [];
    group.nodes.forEach((node) => {
      if (phrases.length === 0) {
        phrases.push({ x0: node.x0, x1: node.x1, text: node.str });
      } else {
        const prev = phrases[phrases.length - 1];
        const gap = node.x0 - prev.x1;

        // If gap is small, or part of normal text-item chunking, merge into same phrase
        if (gap <= localSentenceGapThreshold) {
          prev.text += ` ${node.str}`;
          prev.x1 = Math.max(prev.x1, node.x1);
        } else {
          phrases.push({ x0: node.x0, x1: node.x1, text: node.str });
        }
      }
    });
    group.phrases = phrases;
  });

  // 4. Vertical Spatial Region Segmentation
  const regions = [];
  let currentRegionRows = [];

  rowGroups.forEach((group) => {
    if (currentRegionRows.length === 0) {
      currentRegionRows.push(group);
    } else {
      const prevGroup = currentRegionRows[currentRegionRows.length - 1];
      const vGap = isCanvasCoords
        ? group.minY0 - prevGroup.maxY1
        : prevGroup.minY0 - group.maxY1;

      if (vGap > medianHeight * 2.5) {
        regions.push(currentRegionRows);
        currentRegionRows = [group];
      } else {
        currentRegionRows.push(group);
      }
    }
  });
  if (currentRegionRows.length > 0) {
    regions.push(currentRegionRows);
  }

  // 5. Evaluate Layout Regions with Structural Table Evidence Pipeline
  const acceptedTables = [];

  regions.forEach((regionRows, regionIdx) => {
    const candidateRowCount = regionRows.length;
    if (candidateRowCount < 2) return;

    // Collect phrase x0 candidates
    const x0Candidates = [];
    regionRows.forEach((g) => {
      g.phrases.forEach((p) => {
        x0Candidates.push({ x0: p.x0, rowId: g });
      });
    });

    // Cluster phrase x0 coordinates into column interval anchors
    const rawClusters = [];
    x0Candidates.forEach((cand) => {
      let best = null;
      let minD = Infinity;

      for (const c of rawClusters) {
        const avg = c.sumX0 / c.count;
        const d = Math.abs(avg - cand.x0);
        if (d <= colAnchorTolerance && d < minD) {
          minD = d;
          best = c;
        }
      }

      if (best) {
        best.count++;
        best.sumX0 += cand.x0;
        best.minX0 = Math.min(best.minX0, cand.x0);
        best.rows.add(cand.rowId);
      } else {
        rawClusters.push({
          sumX0: cand.x0,
          minX0: cand.x0,
          count: 1,
          rows: new Set([cand.rowId])
        });
      }
    });

    rawClusters.sort((a, b) => (a.sumX0 / a.count) - (b.sumX0 / b.count));

    // ADAPTIVE ROW SUPPORT: require columns to have meaningful row support
    // For a 2-column key-value or table, required support is derived dynamically
    const minRowSupportNeeded = Math.max(2, Math.ceil(candidateRowCount * 0.28));
    const validAnchors = rawClusters.filter((c) => c.rows.size >= minRowSupportNeeded);

    const colAnchors = [];
    validAnchors.forEach((a) => {
      const avgX = a.sumX0 / a.count;
      if (colAnchors.length === 0) {
        colAnchors.push({ minX0: a.minX0, avgX0: avgX, rowSupport: a.rows.size });
      } else {
        const prev = colAnchors[colAnchors.length - 1];
        if (Math.abs(avgX - prev.avgX0) <= colAnchorTolerance * 0.75) {
          prev.avgX0 = (prev.avgX0 * prev.rowSupport + avgX * a.rows.size) / (prev.rowSupport + a.rows.size);
          prev.minX0 = Math.min(prev.minX0, a.minX0);
          prev.rowSupport += a.rows.size;
        } else {
          colAnchors.push({ minX0: a.minX0, avgX0: avgX, rowSupport: a.rows.size });
        }
      }
    });

    const repeatedAnchorCount = colAnchors.length;

    // Structural Metrics & Inter-Column Gutter Analysis
    let multiCellRows = 0;
    let fullWidthRows = 0;
    let dominantLeftMarginCount = 0;
    const interColumnGaps = [];
    const rowOccupancyVector = [];

    const dominantLeftX = colAnchors.length > 0 ? colAnchors[0].avgX0 : (rawClusters[0] ? rawClusters[0].sumX0 / rawClusters[0].count : 0);

    regionRows.forEach((g) => {
      let rowOcc = 0;
      if (g.phrases.length >= 1) {
        const firstPhrase = g.phrases[0];
        if (Math.abs(firstPhrase.x0 - dominantLeftX) <= colAnchorTolerance) {
          dominantLeftMarginCount++;
        }
      }

      if (g.phrases.length >= 2) {
        const uniqueCols = new Set();
        g.phrases.forEach((p, pIdx) => {
          let bestIdx = -1;
          let minD = Infinity;
          colAnchors.forEach((anc, k) => {
            const d = Math.abs(p.x0 - anc.avgX0);
            if (d <= colAnchorTolerance && d < minD) {
              minD = d;
              bestIdx = k;
            }
          });
          if (bestIdx >= 0) uniqueCols.add(bestIdx);

          if (pIdx > 0) {
            const prevP = g.phrases[pIdx - 1];
            const gap = p.x0 - prevP.x1;
            if (gap > 0) interColumnGaps.push(gap);
          }
        });
        rowOcc = uniqueCols.size;
        if (uniqueCols.size >= 2) multiCellRows++;
      } else if (g.phrases.length === 1) {
        rowOcc = 1;
      }
      rowOccupancyVector.push(rowOcc);

      const fullText = g.nodes.map((n) => n.str).join(" ");
      if (fullText.length > 40 && g.phrases.length <= 1) {
        fullWidthRows++;
      }
    });

    const fullWidthRowRatio = fullWidthRows / candidateRowCount;
    const dominantLeftMarginRatio = dominantLeftMarginCount / candidateRowCount;
    const multiCellRowRatio = multiCellRows / candidateRowCount;
    const columnOccupancy = candidateRowCount > 0 ? multiCellRows / candidateRowCount : 0;

    // Gutter Median and MAD (Median Absolute Deviation)
    const sortedGaps = [...interColumnGaps].sort((a, b) => a - b);
    const gutterMedian = sortedGaps.length > 0 ? sortedGaps[Math.floor(sortedGaps.length / 2)] : 0;
    const gutterMAD = sortedGaps.length > 0
      ? sortedGaps.map((g) => Math.abs(g - gutterMedian)).sort((a, b) => a - b)[Math.floor(sortedGaps.length / 2)]
      : 0;

    const gutterRecurrence = multiCellRows > 0 ? interColumnGaps.length / multiCellRows : 0;

    // Language-Agnostic Structural Prose Likelihood Classifier
    let proseLikelihood = 0;
    if (repeatedAnchorCount <= 1) {
      proseLikelihood = 1.0;
    } else {
      const col0Support = colAnchors[0].rowSupport;
      const col1Support = colAnchors[1] ? colAnchors[1].rowSupport : 1;
      const supportAsymmetryRatio = col0Support / Math.max(1, col1Support);

      let score = 0;
      if (supportAsymmetryRatio >= 3.0) score += 0.45;
      else if (supportAsymmetryRatio >= 2.0) score += 0.25;

      if (fullWidthRowRatio > 0.45) score += 0.40;
      else if (fullWidthRowRatio > 0.25) score += 0.20;

      if (dominantLeftMarginRatio > 0.85 && multiCellRowRatio < 0.45) score += 0.35;

      if (gutterMedian < medianCharWidth * 1.5) score += 0.35;
      if (gutterRecurrence < 0.40 && fullWidthRowRatio > 0.20) score += 0.35;

      proseLikelihood = Math.min(1.0, score);
    }

    const confPenalty = avgConfidence < 60 ? Math.round((60 - avgConfidence) * 1.5) : 0;

    const tableStructureScore = Math.round(
      (repeatedAnchorCount * 30) +
      (multiCellRows * 25) +
      (columnOccupancy * 35) -
      (proseLikelihood * 120) -
      (fullWidthRowRatio * 40) -
      confPenalty
    );

    let rejectionReason = null;
    if (repeatedAnchorCount < 2) {
      rejectionReason = `Fewer than 2 valid column anchors supported across candidate region (repeatedAnchorCount: ${repeatedAnchorCount})`;
    } else if (multiCellRows < 1) {
      rejectionReason = `Zero rows with multi-column phrase alignment (multiCellRows: ${multiCellRows})`;
    } else if (proseLikelihood >= 0.45) {
      rejectionReason = `Region classified as continuous prose text (proseLikelihood: ${proseLikelihood.toFixed(2)})`;
    } else if (avgConfidence < 50 && tableStructureScore < 60) {
      rejectionReason = `Low OCR confidence page (${avgConfidence}%) failed strict table structure threshold`;
    } else if (tableStructureScore < 45) {
      rejectionReason = `Table structure score below required threshold (score: ${tableStructureScore} < 45)`;
    }

    // MANDATORY DIAGNOSTIC BLOCK LOGGING
    console.log(`
==================================================
[PDF-TO-EXCEL TABLE PIPELINE] REGION ASSESSMENT
==================================================
reconstructionPassId: ${passId}
pageNumber: ${options.pageNum || 1}
candidateRegionId: ${regionIdx + 1}/${regions.length}
candidateRowCount: ${candidateRowCount}
rowOccupancyVector: [${rowOccupancyVector.join(", ")}]
inferredColumnCount: ${repeatedAnchorCount}
columnSupportRatios: [${colAnchors.map((a) => `${a.rowSupport}/${candidateRowCount}`).join(", ")}]
columnBoundaryStability: ${(1 - (gutterMAD / Math.max(1, gutterMedian))).toFixed(2)}
gutterMedian: ${gutterMedian.toFixed(1)}
gutterMAD: ${gutterMAD.toFixed(1)}
gutterRecurrence: ${gutterRecurrence.toFixed(2)}
dominantLeftMarginRatio: ${dominantLeftMarginRatio.toFixed(2)}
fullWidthRowRatio: ${fullWidthRowRatio.toFixed(2)}
textFlowScore: ${(1 - proseLikelihood).toFixed(2)}
tableStructureScore: ${tableStructureScore}
proseLikelihood: ${proseLikelihood.toFixed(2)}
acceptedRegion: ${!rejectionReason}
rejectionReason: ${rejectionReason || "PASSED"}
legacyReconstructionInvoked: false
doubleReconstructionDetected: false
staleTableStateDetected: false
finalAcceptedTableShape: ${!rejectionReason ? `${candidateRowCount}x${repeatedAnchorCount}` : "none"}
`);

    if (!rejectionReason && repeatedAnchorCount >= 2) {
      const gridRows = regionRows.map((g) => {
        const rowSlots = new Array(repeatedAnchorCount).fill("");
        g.phrases.forEach((p) => {
          let bestColIdx = 0;
          let minD = Infinity;
          colAnchors.forEach((anc, k) => {
            const d = Math.abs(p.x0 - anc.avgX0);
            if (d < minD) {
              minD = d;
              bestColIdx = k;
            }
          });
          if (rowSlots[bestColIdx]) {
            rowSlots[bestColIdx] += ` ${p.text}`;
          } else {
            rowSlots[bestColIdx] = p.text;
          }
        });
        return rowSlots;
      }).filter((r) => r.some((c) => (c || "").trim().length > 0));

      acceptedTables.push(gridRows);
    }
  });

  const hasAcceptedTables = acceptedTables.length > 0;
  diag.rejectionReason = hasAcceptedTables ? null : "No layout region met multi-column table evidence requirements";
  diag.receivedByDetectedTables = hasAcceptedTables;

  if (hasAcceptedTables) {
    const mainTable = acceptedTables[0];
    diag.reconstructedRowCount = mainTable.length;
    diag.finalColumnCount = Math.max(...mainTable.map((r) => r.length));
    diag.cellsPerRow = mainTable.map((r) => r.filter((c) => (c || "").trim().length > 0).length);
    diag.detectedColumnPositions = Array.from({ length: diag.finalColumnCount }, (_, i) => i + 1);

    return returnDiagnostics
      ? { rows: mainTable, tables: acceptedTables, diagnostics: diag }
      : mainTable;
  }

  return returnDiagnostics ? { rows: null, tables: [], diagnostics: diag } : null;
};

/**
 * Inspects a PDF and extracts text items, clustering them into tabular rows and columns.
 * Seamlessly supports both selectable-text and scanned pages via Free OCR.
 */
export const inspectAndExtractTablesFromPdf = async (file, options = {}) => {
  const { onProgress, ocrEnabled = false } = options;
  if (onProgress) onProgress("Initializing PDF engine...");

  const pdfjs = await getPdfJsEngine();
  const rawArrayBuffer = await file.arrayBuffer();
  const pdfJsBytes = new Uint8Array(rawArrayBuffer.slice(0));

  let pdfDoc;
  try {
    pdfDoc = await pdfjs.getDocument({ data: pdfJsBytes }).promise;
  } catch (err) {
    if (isPasswordProtectedError(err)) {
      const customErr = new Error("This PDF is password-protected. Please unlock it using our Unlock PDF tool first.");
      customErr.isPasswordProtected = true;
      throw customErr;
    }
    throw err;
  }

  const totalPages = pdfDoc.numPages;
  const detectedTables = [];
  const diagnosticsList = [];
  let scannedPagesCount = 0;
  let ocrPagesCount = 0;
  let totalOcrConfidenceSum = 0;

  // Section 1: Verify Free OCR Path Log
  console.log(`
==================================================
[PDF-TO-EXCEL RUNTIME] FILE INSPECTION STARTED
==================================================
ocrEnabled: ${!!ocrEnabled}
fileName: ${file ? file.name : "unknown"}
fileSize: ${file ? file.size : 0}
totalPages: ${totalPages}
`);

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) {
      onProgress(`Analyzing page ${pageNum} of ${totalPages}...`);
    }

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    const isScanned = items.length < 5;
    const ocrPathEntered = isScanned && !!ocrEnabled;

    console.log(`
==================================================
[PDF-TO-EXCEL RUNTIME] PAGE ${pageNum}/${totalPages} STATUS
==================================================
pageNumber: ${pageNum}
isScanned: ${isScanned}
nativeTextItemCount: ${items.length}
OCR path entered: ${ocrPathEntered}
`);

    if (isScanned && !ocrEnabled) {
      console.warn(`[PDF-TO-EXCEL RUNTIME] Page ${pageNum} is scanned/image-only, but OCR path was NOT entered because ocrEnabled is false.`);
    }

    // Check if page is scanned or lacks selectable text
    if (items.length < 5) {
      scannedPagesCount++;

      if (ocrEnabled) {
        if (onProgress) {
          onProgress(`Running Free OCR on page ${pageNum} of ${totalPages}...`);
        }

        try {
          const ocrResult = await ocrPage(page, {
            onProgress: (ocrMsg) => {
              if (onProgress) onProgress(`Page ${pageNum}/${totalPages}: ${ocrMsg}`);
            }
          });

          if (ocrResult && ocrResult.words && ocrResult.words.length > 0) {
            ocrPagesCount++;
            totalOcrConfidenceSum += ocrResult.avgConfidence || 0;

            // Map OCR word-level bounding boxes into positional text nodes
            const ocrTextNodes = ocrResult.words.map((w) => ({
              str: w.text,
              x0: w.x0,
              y0: w.y0,
              x1: w.x1,
              y1: w.y1,
              width: Math.max(1, w.x1 - w.x0),
              height: Math.max(1, w.y1 - w.y0),
              confidence: w.confidence
            }));

            // Reconstruct table through spatial table engine with diagnostics
            const reconRes = reconstructTableFromTextNodes(ocrTextNodes, {
              isCanvasCoords: true,
              returnDiagnostics: true
            });

            const acceptedTablesList = reconRes && reconRes.tables && reconRes.tables.length > 0
              ? reconRes.tables
              : (reconRes && reconRes.rows ? [reconRes.rows] : []);
            const diag = reconRes ? reconRes.diagnostics : null;

            if (diag) {
              diagnosticsList.push({ pageNum, ...diag });
            }

            const tableAccepted = acceptedTablesList.length > 0;

            // Section 9: Verify detectedTables Pipeline Log
            console.log(`
==================================================
[DETECTED TABLE PIPELINE] STAGE ASSESSMENT
==================================================
tableAccepted: ${tableAccepted}
acceptedTablesCount: ${acceptedTablesList.length}
detectedTablesBefore: ${detectedTables.length}
detectedTablesAfter: ${detectedTables.length + acceptedTablesList.length}
receivedByDetectedTables: ${tableAccepted}
`);

            acceptedTablesList.forEach((tableRows) => {
              if (tableRows && tableRows.length > 0) {
                const colCount = Math.max(...tableRows.map((r) => r.length));
                detectedTables.push({
                  id: `ocr-p${pageNum}-t${detectedTables.length + 1}`,
                  title: `Page ${pageNum} Table ${detectedTables.length + 1}`,
                  pageNum,
                  columnsCount: colCount,
                  rowCount: tableRows.length,
                  rows: tableRows,
                  selected: true,
                  firstRowIsHeader: false,
                  isOcr: true,
                  avgConfidence: ocrResult.avgConfidence
                });
              }
            });
          } else {
            diagnosticsList.push({
              pageNum,
              wordCount: 0,
              avgConfidence: 0,
              rejectionReason: "0 OCR words extracted from canvas image",
              receivedByDetectedTables: false
            });
          }
        } catch (ocrErr) {
          if (ocrErr.message && ocrErr.message.includes("cancelled")) {
            throw ocrErr;
          }
          console.error("OCR error on page", pageNum, ocrErr);
        }
      }
      continue;
    }

    // Native PDF selectable text path
    const textNodes = items
      .map((item) => {
        const str = (item.str || "").trim();
        if (!str) return null;

        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        const x = transform[4];
        const y = transform[5];
        const width = item.width || 0;
        const height = item.height || Math.abs(transform[3]) || 10;

        return { str, x0: x, y0: y, width, height, x1: x + width, y1: y + height };
      })
      .filter(Boolean);

    const tableRows = reconstructTableFromTextNodes(textNodes, {
      isCanvasCoords: false
    });

    if (tableRows && tableRows.length >= 1) {
      const colCount = Math.max(...tableRows.map((r) => r.length));
      detectedTables.push({
        id: `table-p${pageNum}-t${detectedTables.length + 1}`,
        title: `Page ${pageNum} Table`,
        pageNum,
        columnsCount: colCount,
        rowCount: tableRows.length,
        rows: tableRows,
        selected: true,
        firstRowIsHeader: true,
        isOcr: false
      });
    }
  }

  const avgOcrConfidence = ocrPagesCount > 0 ? Math.round(totalOcrConfidenceSum / ocrPagesCount) : 0;
  const isLowConfidence = ocrPagesCount > 0 && avgOcrConfidence < 70;

  return {
    totalPages,
    scannedPagesCount,
    ocrPagesCount,
    avgOcrConfidence,
    isLowConfidence,
    isScannedPdf: scannedPagesCount > 0 && (!ocrEnabled || detectedTables.length === 0),
    detectedTables
  };
};

/**
 * Generates an OpenXML .xlsx Excel workbook binary Blob using JSZip.
 */
export const generateExcelWorkbookBlob = async (tables, options = {}) => {
  const { onProgress } = options;
  if (onProgress) onProgress("Generating Excel spreadsheet workbook...");

  const zip = new JSZip();
  const existingNames = new Set();

  const selectedTables = tables.filter((t) => t.selected && t.rows && t.rows.length > 0);

  if (selectedTables.length === 0) {
    throw new Error("No tables selected for Excel conversion. Please select at least one valid table.");
  }

  // 1. [Content_Types].xml
  let contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>`;

  selectedTables.forEach((_, idx) => {
    contentTypesXml += `\n  <Override PartName="/xl/worksheets/sheet${idx + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`;
  });

  contentTypesXml += `\n</Types>`;
  zip.file("[Content_Types].xml", contentTypesXml);

  // 2. _rels/.rels
  const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;
  zip.file("_rels/.rels", rootRelsXml);

  // 3. xl/_rels/workbook.xml.rels
  let workbookRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`;

  selectedTables.forEach((_, idx) => {
    workbookRelsXml += `\n  <Relationship Id="rIdSheet${idx + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${idx + 1}.xml"/>`;
  });

  workbookRelsXml += `\n</Relationships>`;
  zip.folder("xl").file("_rels/workbook.xml.rels", workbookRelsXml);

  // 4. xl/styles.xml
  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="1">
    <font>
      <sz val="11"/>
      <color theme="1"/>
      <name val="Calibri"/>
      <family val="2"/>
    </font>
  </fonts>
  <fills count="1">
    <fill><patternFill fillType="none"/></fill>
  </fills>
  <borders count="1">
    <border><left/><right/><top/><bottom/><diagonal/></border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>`;
  zip.folder("xl").file("styles.xml", stylesXml);

  // 5. xl/workbook.xml
  let workbookXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>`;

  const sheetEntries = selectedTables.map((table, idx) => {
    const sheetName = sanitizeWorksheetName(table.title, idx + 1, existingNames);
    workbookXml += `\n    <sheet name="${escapeXml(sheetName)}" sheetId="${idx + 1}" r:id="rIdSheet${idx + 1}"/>`;
    return { table, sheetName, sheetIndex: idx + 1 };
  });

  workbookXml += `\n  </sheets>\n</workbook>`;
  zip.folder("xl").file("workbook.xml", workbookXml);

  // 6. xl/worksheets/sheet1.xml, sheet2.xml, ...
  const worksheetsFolder = zip.folder("xl").folder("worksheets");

  sheetEntries.forEach(({ table, sheetIndex }) => {
    let sheetXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>`;

    table.rows.forEach((row, rowIdx) => {
      const rNum = rowIdx + 1;
      sheetXml += `\n    <row r="${rNum}">`;

      row.forEach((cellVal, colIdx) => {
        const colLetter = getColumnLetter(colIdx);
        const cellRef = `${colLetter}${rNum}`;
        const strVal = (cellVal || "").trim();

        if (!strVal) return;

        // Check if numeric
        const isNumeric = /^-?\d+(\.\d+)?$/.test(strVal) && !strVal.startsWith("0") || strVal === "0";

        if (isNumeric) {
          sheetXml += `<c r="${cellRef}"><v>${strVal}</v></c>`;
        } else {
          sheetXml += `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(strVal)}</t></is></c>`;
        }
      });

      sheetXml += `</row>`;
    });

    sheetXml += `\n  </sheetData>\n</worksheet>`;
    worksheetsFolder.file(`sheet${sheetIndex}.xml`, sheetXml);
  });

  if (onProgress) onProgress("Compressing Excel workbook binary...");
  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  const totalRows = selectedTables.reduce((acc, t) => acc + (t.rows ? t.rows.length : 0), 0);
  const totalCells = selectedTables.reduce((acc, t) => acc + (t.rows ? t.rows.length * t.columnsCount : 0), 0);

  // Section 11: Verify XLSX Log
  console.log(`
==================================================
[XLSX GENERATION] OUTPUT BINARY SUMMARY
==================================================
xlsxGenerationStarted: true
worksheetCount: ${selectedTables.length}
rowsPerWorksheet: ${JSON.stringify(selectedTables.map((t) => t.rows.length), null, 2)}
cellsPerWorksheet: ${JSON.stringify(selectedTables.map((t) => t.rows.reduce((sum, r) => sum + r.length, 0)), null, 2)}
xlsxBlobSize: ${blob.size} bytes
`);

  return {
    blob,
    filename: "converted-to-excel.xlsx",
    tableCount: selectedTables.length,
    totalRows,
    totalCells
  };
};

/**
 * Converts 0-based column index to Excel column letters (0 -> A, 1 -> B, 25 -> Z, 26 -> AA).
 */
const getColumnLetter = (colIdx) => {
  let temp = colIdx;
  let letter = "";
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
};

/**
 * Escapes XML special characters.
 */
const escapeXml = (str = "") => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};
