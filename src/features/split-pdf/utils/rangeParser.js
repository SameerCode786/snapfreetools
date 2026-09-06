/**
 * Parses and validates page range strings such as "1,3,5", "1-5", or "1,3,5-10"
 * against the total number of pages in a PDF document.
 * 
 * Returns { isValid: boolean, pageIndices: number[], error: string | null }
 * Note: pageIndices returned are 0-based for pdf-lib compatibility.
 */
export const parsePageRanges = (rangeString, totalPages) => {
  if (!rangeString || typeof rangeString !== "string" || !rangeString.trim()) {
    return {
      isValid: false,
      pageIndices: [],
      error: "Please enter page numbers or ranges (e.g. 1-5, 8, 11-13)."
    };
  }

  const rawTokens = rangeString.split(",").map(t => t.trim()).filter(Boolean);
  if (rawTokens.length === 0) {
    return {
      isValid: false,
      pageIndices: [],
      error: "No page numbers found. Please enter a valid page selection."
    };
  }

  const selectedPagesSet = new Set();
  const duplicateWarnings = [];

  for (const token of rawTokens) {
    // Single page token: e.g. "5"
    if (/^\d+$/.test(token)) {
      const pageNum = parseInt(token, 10);
      if (pageNum === 0) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Invalid page number "0". Page numbers must start from 1.`
        };
      }
      if (pageNum > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page ${pageNum} exceeds total PDF page count (${totalPages}).`
        };
      }
      if (selectedPagesSet.has(pageNum - 1)) {
        duplicateWarnings.push(pageNum);
      }
      selectedPagesSet.add(pageNum - 1);
    } 
    // Range token: e.g. "1-5" or "5-10"
    else if (/^\d+\s*-\s*\d+$/.test(token)) {
      const [startStr, endStr] = token.split("-").map(s => s.trim());
      const startNum = parseInt(startStr, 10);
      const endNum = parseInt(endStr, 10);

      if (startNum === 0 || endNum === 0) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Page numbers must start from 1. Invalid range "${token}".`
        };
      }
      if (startNum > endNum) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Invalid reverse range "${token}". Start page (${startNum}) cannot be greater than end page (${endNum}).`
        };
      }
      if (endNum > totalPages) {
        return {
          isValid: false,
          pageIndices: [],
          error: `Range end ${endNum} exceeds total PDF page count (${totalPages}).`
        };
      }

      for (let p = startNum; p <= endNum; p++) {
        const index = p - 1;
        if (selectedPagesSet.has(index)) {
          duplicateWarnings.push(p);
        }
        selectedPagesSet.add(index);
      }
    } 
    // Invalid token format
    else {
      return {
        isValid: false,
        pageIndices: [],
        error: `Invalid format around "${token}". Use numbers separated by commas or hyphens (e.g. 1-5, 8).`
      };
    }
  }

  const sortedIndices = Array.from(selectedPagesSet).sort((a, b) => a - b);

  if (sortedIndices.length === 0) {
    return {
      isValid: false,
      pageIndices: [],
      error: "No valid pages selected."
    };
  }

  return {
    isValid: true,
    pageIndices: sortedIndices,
    error: null,
    hasDuplicates: duplicateWarnings.length > 0
  };
};

/**
 * Validates custom multi-range groups (Mode 3).
 * Each group has { id, startPage, endPage }.
 * Ensures ranges are within bounds, start <= end, and warns/handles overlap.
 */
export const validateCustomRangeGroups = (groups, totalPages) => {
  if (!groups || groups.length === 0) {
    return { isValid: false, ranges: [], error: "Please add at least one range." };
  }

  const validRanges = [];
  const coveredIndices = new Set();
  let overlapFound = false;

  for (let i = 0; i < groups.length; i++) {
    const g = groups[i];
    const start = parseInt(g.startPage, 10);
    const end = parseInt(g.endPage, 10);

    if (isNaN(start) || isNaN(end)) {
      return {
        isValid: false,
        ranges: [],
        error: `Range #${i + 1} has incomplete page numbers.`
      };
    }
    if (start < 1 || end < 1) {
      return {
        isValid: false,
        ranges: [],
        error: `Range #${i + 1} must use page numbers starting from 1.`
      };
    }
    if (start > end) {
      return {
        isValid: false,
        ranges: [],
        error: `Range #${i + 1} start page (${start}) cannot be greater than end page (${end}).`
      };
    }
    if (end > totalPages) {
      return {
        isValid: false,
        ranges: [],
        error: `Range #${i + 1} end page (${end}) exceeds total document pages (${totalPages}).`
      };
    }

    const groupIndices = [];
    for (let p = start; p <= end; p++) {
      const idx = p - 1;
      if (coveredIndices.has(idx)) {
        overlapFound = true;
      }
      coveredIndices.add(idx);
      groupIndices.push(idx);
    }

    validRanges.push({
      id: g.id || i,
      label: `Pages ${start}–${end}`,
      startPage: start,
      endPage: end,
      pageIndices: groupIndices
    });
  }

  return {
    isValid: true,
    ranges: validRanges,
    overlapFound,
    error: null
  };
};
