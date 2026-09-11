import JSZip from "jszip";
import { ocrPage } from "./ocrHelper";

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
 * Inspects a PDF and extracts text items, clustering them into tabular rows and columns.
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
  let scannedPagesCount = 0;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    if (onProgress) {
      onProgress(`Analyzing page ${pageNum} of ${totalPages}...`);
    }

    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    const items = textContent.items || [];

    if (items.length < 5) {
      scannedPagesCount++;
      if (ocrEnabled) {
        // Perform OCR on scanned page
        try {
          const ocrRows = await ocrPage(page);
          if (ocrRows && ocrRows.length > 0) {
            const colCount = Math.max(...ocrRows.map(r => r.length));
            detectedTables.push({
              id: `ocr-page-${pageNum}`,
              title: `Page ${pageNum} OCR Table`,
              pageNum,
              columnsCount: colCount,
              rowCount: ocrRows.length,
              rows: ocrRows,
              selected: true,
              firstRowIsHeader: false
            });
          }
        } catch (ocrErr) {
          console.error("OCR error on page", pageNum, ocrErr);
        }
      }
      continue;
    }

    // Filter non-empty text items and extract positional coordinates
    const textNodes = items
      .map((item) => {
        const str = (item.str || "").trim();
        if (!str) return null;

        const transform = item.transform || [1, 0, 0, 1, 0, 0];
        const x = transform[4];
        const y = transform[5];
        const width = item.width || 0;
        const height = item.height || Math.abs(transform[3]) || 10;

        return { str, x, y, width, height };
      })
      .filter(Boolean);

    if (textNodes.length < 3) continue;

    // Group text items into rows based on Y-coordinate proximity (tolerance ±4pt)
    const rowGroups = [];
    const yTolerance = 4;

    textNodes.forEach((node) => {
      let matchedGroup = rowGroups.find((group) => Math.abs(group.y - node.y) <= yTolerance);
      if (matchedGroup) {
        matchedGroup.nodes.push(node);
      } else {
        rowGroups.push({ y: node.y, nodes: [node] });
      }
    });

    // Sort rows from top to bottom (Y decreases down the page in PDF coords)
    rowGroups.sort((a, b) => b.y - a.y);

    // Filter rows with multiple cells or tabular alignment
    const validRows = [];
    rowGroups.forEach((group) => {
      // Sort items horizontally left to right
      group.nodes.sort((a, b) => a.x - b.x);

      // Merge items that are horizontally adjacent within a small gap (gap <= 8pt)
      const mergedCells = [];
      group.nodes.forEach((node) => {
        if (mergedCells.length === 0) {
          mergedCells.push({ x: node.x, width: node.width, text: node.str });
        } else {
          const prevCell = mergedCells[mergedCells.length - 1];
          const gap = node.x - (prevCell.x + prevCell.width);
          if (gap <= 8) {
            prevCell.text += ` ${node.str}`;
            prevCell.width = node.x + node.width - prevCell.x;
          } else {
            mergedCells.push({ x: node.x, width: node.width, text: node.str });
          }
        }
      });

      if (mergedCells.length > 0) {
        validRows.push(mergedCells);
      }
    });

    if (validRows.length < 2) continue;

    // Determine column boundaries across rows
    const xPositions = [];
    validRows.forEach((row) => {
      row.forEach((cell) => {
        xPositions.push(cell.x);
      });
    });

    xPositions.sort((a, b) => a - b);

    // Cluster X coordinates to define column boundaries
    const colClusters = [];
    const xTolerance = 15;

    xPositions.forEach((x) => {
      let cluster = colClusters.find((c) => Math.abs(c.mean - x) <= xTolerance);
      if (cluster) {
        cluster.count++;
        cluster.mean = (cluster.mean * (cluster.count - 1) + x) / cluster.count;
      } else {
        colClusters.push({ mean: x, count: 1 });
      }
    });

    colClusters.sort((a, b) => a.mean - b.mean);
    const colBounds = colClusters.map((c) => c.mean);

    if (colBounds.length < 2) continue;

    // Map each row's cells into table columns
    const tableRows = validRows.map((row) => {
      const rowCells = new Array(colBounds.length).fill("");

      row.forEach((cell) => {
        // Find best column index for cell
        let bestColIdx = 0;
        let minDiff = Math.abs(colBounds[0] - cell.x);

        for (let c = 1; c < colBounds.length; c++) {
          const diff = Math.abs(colBounds[c] - cell.x);
          if (diff < minDiff) {
            minDiff = diff;
            bestColIdx = c;
          }
        }

        if (rowCells[bestColIdx]) {
          rowCells[bestColIdx] += ` ${cell.text}`;
        } else {
          rowCells[bestColIdx] = cell.text;
        }
      });

      return rowCells;
    });

    if (tableRows.length >= 2) {
      detectedTables.push({
        id: `table-p${pageNum}-t${detectedTables.length + 1}`,
        title: `Page ${pageNum} Table`,
        pageNum,
        columnsCount: colBounds.length,
        rowCount: tableRows.length,
        rows: tableRows,
        selected: true,
        firstRowIsHeader: true
      });
    }
  }

  return {
    totalPages,
    scannedPagesCount,
    isScannedPdf: scannedPagesCount > 0 && detectedTables.length === 0,
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
    throw new Error("No tables selected for Excel conversion.");
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

        // Check if numeric or identifier
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
