// Prototype for Region-Based Table Reconstruction & Prose Rejection

function reconstructTableFromTextNodesProto(textNodes, options = {}) {
  const { isCanvasCoords = false, returnDiagnostics = false } = options;

  if (!textNodes || textNodes.length === 0) return null;

  // 1. Clean and normalize nodes
  const nodes = textNodes
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
      return { str, x0, y0, x1, y1, width, height, centerY, confidence: typeof n.confidence === "number" ? n.confidence : 100 };
    })
    .filter((n) => n.str.length > 0);

  if (nodes.length < 2) return null;

  // Geometry stats
  const sortedHeights = [...nodes.map((n) => n.height)].sort((a, b) => a - b);
  const medianHeight = sortedHeights[Math.floor(sortedHeights.length / 2)] || 10;

  const charWidths = nodes
    .map((n) => n.width / Math.max(1, n.str.length))
    .sort((a, b) => a - b);
  const medianCharWidth = charWidths[Math.floor(charWidths.length / 2)] || (medianHeight * 0.5);

  const yTolerance = medianHeight * 1.15;
  const wordGapThreshold = Math.max(medianCharWidth * 2.2, medianHeight * 0.5);
  const colAnchorTolerance = Math.max(medianCharWidth * 3.0, medianHeight * 1.0);

  // 2. Row Grouping
  if (isCanvasCoords) {
    nodes.sort((a, b) => a.centerY - b.centerY || a.x0 - b.x0);
  } else {
    nodes.sort((a, b) => b.centerY - a.centerY || a.x0 - b.x0);
  }

  const rowGroups = [];
  nodes.forEach((node) => {
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

  if (rowGroups.length === 0) return null;

  if (isCanvasCoords) {
    rowGroups.sort((a, b) => a.anchorCenterY - b.anchorCenterY);
  } else {
    rowGroups.sort((a, b) => b.anchorCenterY - a.anchorCenterY);
  }

  // 3. Form Candidate Phrases within each Row
  rowGroups.forEach((group) => {
    group.nodes.sort((a, b) => a.x0 - b.x0);
    const phrases = [];
    group.nodes.forEach((node) => {
      if (phrases.length === 0) {
        phrases.push({ x0: node.x0, x1: node.x1, text: node.str });
      } else {
        const prev = phrases[phrases.length - 1];
        const gap = node.x0 - prev.x1;
        if (gap <= wordGapThreshold) {
          prev.text += ` ${node.str}`;
          prev.x1 = Math.max(prev.x1, node.x1);
        } else {
          phrases.push({ x0: node.x0, x1: node.x1, text: node.str });
        }
      }
    });
    group.phrases = phrases;
  });

  // 4. Region Segmentation (Split by vertical gaps > 2.5 * medianHeight or structural boundaries)
  const regions = [];
  let currentRegionRows = [];

  rowGroups.forEach((group, idx) => {
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

  // 5. Evaluate Each Region Independently
  const acceptedTables = [];

  regions.forEach((regionRows, regionIdx) => {
    if (regionRows.length < 2) return;

    // Detect Phrase x0 Column Anchors within THIS region
    const x0Candidates = [];
    regionRows.forEach((g) => {
      g.phrases.forEach((p) => {
        x0Candidates.push({ x0: p.x0, rowId: g });
      });
    });

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

    // Valid Column Anchors MUST be supported across >= 2 distinct rows in this region
    const validAnchors = rawClusters.filter((c) => c.rows.size >= 2);

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

    // Count Multi-cell rows in region
    let multiCellRows = 0;
    let fullWidthRows = 0;

    regionRows.forEach((g) => {
      if (g.phrases.length >= 2) {
        // Check if phrases align to distinct column anchors
        const uniqueCols = new Set();
        g.phrases.forEach((p) => {
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
        });
        if (uniqueCols.size >= 2) multiCellRows++;
      }
      if (g.phrases.length === 1 && g.phrases[0].text.length > 35) {
        fullWidthRows++;
      }
    });

    const candidateRowCount = regionRows.length;
    const fullWidthRowRatio = fullWidthRows / candidateRowCount;
    const columnOccupancy = candidateRowCount > 0 ? multiCellRows / candidateRowCount : 0;

    // Calculate Prose Likelihood:
    // High if repeatedAnchorCount < 2 OR if most lines are continuous single phrases wrapping without column gaps
    let proseLikelihood = 0;
    if (repeatedAnchorCount <= 1) {
      proseLikelihood = 1.0;
    } else if (fullWidthRowRatio > 0.6 && multiCellRows <= 1) {
      proseLikelihood = 0.85;
    } else {
      proseLikelihood = Math.max(0, 0.5 - (multiCellRows * 0.2));
    }

    const tableEvidenceScore = Math.round(
      (repeatedAnchorCount * 25) +
      (multiCellRows * 20) +
      (columnOccupancy * 30) -
      (proseLikelihood * 50) -
      (fullWidthRowRatio * 20)
    );

    let rejectionReason = null;
    if (repeatedAnchorCount < 2) {
      rejectionReason = `Fewer than 2 valid column anchors supported across >= 2 rows (repeatedAnchorCount: ${repeatedAnchorCount})`;
    } else if (multiCellRows < 1) {
      rejectionReason = `Zero rows with multi-column phrase alignment (multiCellRows: ${multiCellRows})`;
    } else if (proseLikelihood >= 0.55) {
      rejectionReason = `Region classified as continuous prose text (proseLikelihood: ${proseLikelihood.toFixed(2)})`;
    } else if (tableEvidenceScore < 35) {
      rejectionReason = `Table evidence score below threshold (score: ${tableEvidenceScore} < 35)`;
    }

    console.log(`
==================================================
[TABLE EVIDENCE ANALYSIS] REGION ${regionIdx + 1}
==================================================
candidateRegionCount: ${regions.length}
candidateRowCount: ${candidateRowCount}
multiCellRows: ${multiCellRows}
repeatedAnchorCount: ${repeatedAnchorCount}
anchorSupport: ${colAnchors.map(a => a.rowSupport).join(", ") || "none"}
columnOccupancy: ${columnOccupancy.toFixed(2)}
proseLikelihood: ${proseLikelihood.toFixed(2)}
fullWidthRowRatio: ${fullWidthRowRatio.toFixed(2)}
tableEvidenceScore: ${tableEvidenceScore}
status: ${rejectionReason ? "REJECTED" : "ACCEPTED"}
rejectionReason: ${rejectionReason || "PASSED"}
`);

    if (!rejectionReason && repeatedAnchorCount >= 2) {
      // Reconstruct table grid for accepted region
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

  if (acceptedTables.length === 0) return null;
  return acceptedTables[0];
}

// -------------------------------------------------------------
// TEST FIXTURES FOR REAL-WORLD BEHAVIOR
// -------------------------------------------------------------
// vu.pdf simulated words
const vuWords = [
  // Header / Metadata region (Region 1 - Vertical gap)
  { text: "7124/26,", x0: 24.5, y0: 20, x1: 45, y1: 34 },
  { text: "12:57", x0: 46.5, y0: 20, x1: 70, y1: 34 },
  { text: "AM", x0: 74.3, y0: 20, x1: 90, y1: 34 },

  { text: "Virtual", x0: 173, y0: 45, x1: 215, y1: 59 },
  { text: "University", x0: 220, y0: 45, x1: 285, y1: 59 },
  { text: "of", x0: 290, y0: 45, x1: 305, y1: 59 },
  { text: "Pakistan", x0: 310, y0: 45, x1: 365, y1: 59 },
  { text: "--", x0: 370, y0: 45, x1: 380, y1: 59 },
  { text: "Thanks", x0: 385, y0: 45, x1: 430, y1: 59 },

  // Large vertical gap to Tabular Key-Value Section (Region 2)
  { text: "PAYMENT", x0: 50, y0: 120, x1: 115, y1: 134 },
  { text: "SUMMARY", x0: 120, y0: 120, x1: 190, y1: 134 },

  { text: "Name", x0: 50, y0: 150, x1: 85, y1: 164 },
  { text: "on", x0: 90, y0: 150, x1: 105, y1: 164 },
  { text: "Card", x0: 110, y0: 150, x1: 140, y1: 164 },
  { text: "MUHAMMAD", x0: 260, y0: 150, x1: 340, y1: 164 },
  { text: "SAMEER", x0: 345, y0: 150, x1: 400, y1: 164 },
  { text: "CHAUDHARY", x0: 405, y0: 150, x1: 490, y1: 164 },

  { text: "Card", x0: 50, y0: 180, x1: 80, y1: 194 },
  { text: "Type", x0: 85, y0: 180, x1: 115, y1: 194 },
  { text: "VISA", x0: 260, y0: 180, x1: 295, y1: 194 },

  { text: "Amount", x0: 50, y0: 210, x1: 105, y1: 224 },
  { text: "500", x0: 260, y0: 214, x1: 285, y1: 228 },
  { text: "PKR", x0: 290, y0: 214, x1: 315, y1: 228 },

  { text: "Transaction", x0: 50, y0: 240, x1: 130, y1: 254 },
  { text: "Date", x0: 135, y0: 240, x1: 165, y1: 254 },
  { text: "24/07/2026", x0: 260, y0: 242, x1: 335, y1: 256 },
  { text: "12:56:45", x0: 340, y0: 242, x1: 395, y1: 256 },
  { text: "AM", x0: 400, y0: 242, x1: 420, y1: 256 }
];

// images.pdf simulated prose words (11 lines of continuous prose text)
const imagesProseWords = [
  { text: "The", x0: 50, y0: 50, x1: 75, y1: 64 },
  { text: "quick", x0: 80, y0: 50, x1: 115, y1: 64 },
  { text: "brown", x0: 120, y0: 50, x1: 160, y1: 64 },
  { text: "fox", x0: 165, y0: 50, x1: 185, y1: 64 },
  { text: "jumps", x0: 190, y0: 50, x1: 230, y1: 64 },
  { text: "over", x0: 235, y0: 50, x1: 265, y1: 64 },
  { text: "the", x0: 270, y0: 50, x1: 290, y1: 64 },
  { text: "lazy", x0: 295, y0: 50, x1: 320, y1: 64 },
  { text: "dog.", x0: 325, y0: 50, x1: 355, y1: 64 },

  { text: "This", x0: 50, y0: 75, x1: 80, y1: 89 },
  { text: "is", x0: 85, y0: 75, x1: 95, y1: 89 },
  { text: "a", x0: 100, y0: 75, x1: 108, y1: 89 },
  { text: "sample", x0: 113, y0: 75, x1: 160, y1: 89 },
  { text: "paragraph", x0: 165, y0: 75, x1: 235, y1: 89 },
  { text: "of", x0: 240, y0: 75, x1: 252, y1: 89 },
  { text: "article", x0: 257, y0: 75, y1: 89, x1: 295 },
  { text: "prose", x0: 300, y0: 75, x1: 335, y1: 89 },

  { text: "It", x0: 50, y0: 100, x1: 60, y1: 114 },
  { text: "contains", x0: 65, y0: 100, x1: 120, y1: 114 },
  { text: "multiple", x0: 125, y0: 100, x1: 175, y1: 114 },
  { text: "lines", x0: 180, y0: 100, x1: 210, y1: 114 },
  { text: "without", x0: 215, y0: 100, x1: 265, y1: 114 },
  { text: "table", x0: 270, y0: 100, x1: 305, y1: 114 },
  { text: "structure.", x0: 310, y0: 100, x1: 375, y1: 114 }
];

console.log("=== REGION-BASED TABLE EVIDENCE RECONSTRUCTION TEST ===");
console.log("\n--- EVALUATING vu.pdf FIXTURE ---");
const vuResult = reconstructTableFromTextNodesProto(vuWords, { isCanvasCoords: true });
console.log("vuResult:\n", JSON.stringify(vuResult, null, 2));

console.log("\n--- EVALUATING images.pdf PROSE FIXTURE ---");
const imagesResult = reconstructTableFromTextNodesProto(imagesProseWords, { isCanvasCoords: true });
console.log("imagesResult:\n", JSON.stringify(imagesResult, null, 2));
