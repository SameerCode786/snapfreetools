/**
 * Advanced Table Reconstruction Algorithm for Native & OCR Text Nodes
 */

export function reconstructTableFromTextNodes(textNodes, options = {}) {
  const { isCanvasCoords = false } = options;

  if (!textNodes || textNodes.length === 0) return null;

  // Filter valid nodes
  const nodes = textNodes
    .filter((n) => n && (n.str || n.text))
    .map((n) => {
      const str = (n.str || n.text || "").trim();
      const x0 = typeof n.x0 === "number" ? n.x0 : n.x;
      const y0 = typeof n.y0 === "number" ? n.y0 : n.y;
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
        confidence: n.confidence
      };
    })
    .filter((n) => n.str.length > 0);

  if (nodes.length < 2) return null;

  // Compute median height for adaptive thresholds
  const sortedHeights = [...nodes.map((n) => n.height)].sort((a, b) => a - b);
  const medianHeight = sortedHeights[Math.floor(sortedHeights.length / 2)] || 10;
  const yTolerance = Math.max(4, medianHeight * 0.6);

  // 1. Group nodes into rows using vertical center clustering
  // Sort nodes vertically first
  if (isCanvasCoords) {
    nodes.sort((a, b) => a.centerY - b.centerY || a.x0 - b.x0);
  } else {
    // PDF coordinates: Y increases upwards, so top of page has highest Y
    nodes.sort((a, b) => b.centerY - a.centerY || a.x0 - b.x0);
  }

  const rowGroups = [];
  nodes.forEach((node) => {
    let matchedGroup = rowGroups.find((g) => Math.abs(g.meanCenterY - node.centerY) <= yTolerance);
    if (matchedGroup) {
      matchedGroup.nodes.push(node);
      // Update running mean center Y
      matchedGroup.meanCenterY =
        (matchedGroup.meanCenterY * (matchedGroup.nodes.length - 1) + node.centerY) /
        matchedGroup.nodes.length;
    } else {
      rowGroups.push({
        meanCenterY: node.centerY,
        nodes: [node]
      });
    }
  });

  if (rowGroups.length === 0) return null;

  // 2. Sort rows top-to-bottom
  if (isCanvasCoords) {
    rowGroups.sort((a, b) => a.meanCenterY - b.meanCenterY);
  } else {
    rowGroups.sort((a, b) => b.meanCenterY - a.meanCenterY);
  }

  // 3. For each row, sort words horizontally and merge words into cell tokens
  // A standard space between words in the same cell is typically 4-9px.
  // Column gaps between separate table cells are typically >= 15px.
  const cellGapThreshold = Math.max(8, Math.min(14, medianHeight * 0.9));

  const rawRowsWithCells = rowGroups.map((group) => {
    group.nodes.sort((a, b) => a.x0 - b.x0);

    const cells = [];
    group.nodes.forEach((node) => {
      if (cells.length === 0) {
        cells.push({
          x0: node.x0,
          x1: node.x1,
          text: node.str
        });
      } else {
        const prev = cells[cells.length - 1];
        const gap = node.x0 - prev.x1;

        if (gap <= cellGapThreshold) {
          prev.text += ` ${node.str}`;
          prev.x1 = Math.max(prev.x1, node.x1);
        } else {
          cells.push({
            x0: node.x0,
            x1: node.x1,
            text: node.str
          });
        }
      }
    });
    return cells;
  }).filter((cells) => cells.length > 0);

  if (rawRowsWithCells.length < 2) {
    // If only 1 row exists, return it as a single row table
    if (rawRowsWithCells.length === 1 && rawRowsWithCells[0].length >= 2) {
      return [rawRowsWithCells[0].map((c) => c.text)];
    }
    return null;
  }

  // 4. Discover column boundaries across all rows
  // Collect all cell starting x0 coordinates
  const allX0s = [];
  rawRowsWithCells.forEach((row) => {
    row.forEach((cell) => {
      allX0s.push(cell.x0);
    });
  });

  allX0s.sort((a, b) => a - b);

  // Cluster column start positions
  const colClusters = [];
  const colClusteringTolerance = Math.max(18, medianHeight * 1.8);

  allX0s.forEach((x) => {
    let cluster = colClusters.find((c) => Math.abs(c.mean - x) <= colClusteringTolerance);
    if (cluster) {
      cluster.count++;
      cluster.mean = (cluster.mean * (cluster.count - 1) + x) / cluster.count;
    } else {
      colClusters.push({ mean: x, count: 1 });
    }
  });

  colClusters.sort((a, b) => a.mean - b.mean);
  const colBounds = colClusters.map((c) => c.mean);

  // If we have at least 1 column boundary
  const effectiveColCount = Math.max(colBounds.length, Math.max(...rawRowsWithCells.map((r) => r.length)));

  if (effectiveColCount < 1) return null;

  // 5. Map each row's cells into the detected column slots
  const tableRows = rawRowsWithCells.map((row) => {
    if (colBounds.length >= 2) {
      const rowSlots = new Array(colBounds.length).fill("");

      row.forEach((cell) => {
        // Find closest column slot that does not overwrite an existing cell in this row if possible
        let bestColIdx = 0;
        let minDiff = Math.abs(colBounds[0] - cell.x0);

        for (let c = 1; c < colBounds.length; c++) {
          const diff = Math.abs(colBounds[c] - cell.x0);
          if (diff < minDiff) {
            minDiff = diff;
            bestColIdx = c;
          }
        }

        if (rowSlots[bestColIdx]) {
          rowSlots[bestColIdx] += ` ${cell.text}`;
        } else {
          rowSlots[bestColIdx] = cell.text;
        }
      });

      return rowSlots;
    } else {
      // Direct cells if single column
      return row.map((c) => c.text);
    }
  });

  // Filter out completely blank rows
  const finalTable = tableRows.filter((row) => row.some((cell) => (cell || "").trim().length > 0));

  return finalTable.length >= 1 ? finalTable : null;
}
