import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fs from "fs";
import path from "path";
import zlib from "zlib";

// Simple PNG Creator in Pure Node.js (no native deps required)
function createPngBuffer(width, height, drawFn) {
  // RGBA buffer: width * height * 4
  const pixels = Buffer.alloc(width * height * 4, 255); // initialize white

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    const idx = (y * width + x) * 4;
    pixels[idx] = r;
    pixels[idx + 1] = g;
    pixels[idx + 2] = b;
    pixels[idx + 3] = a;
  }

  // Basic font rendering for digits & ASCII uppercase
  function drawChar(char, startX, startY, color = [0, 0, 0], scale = 3) {
    const glyphs = {
      'A': [" 0 ", "0 0", "000", "0 0", "0 0"],
      'B': ["00 ", "0 0", "00 ", "0 0", "00 "],
      'C': [" 00", "0  ", "0  ", "0  ", " 00"],
      'D': ["00 ", "0 0", "0 0", "0 0", "00 "],
      'E': ["000", "0  ", "00 ", "0  ", "000"],
      'F': ["000", "0  ", "00 ", "0  ", "0  "],
      'G': [" 00", "0  ", "0 0", "0 0", " 00"],
      'H': ["0 0", "0 0", "000", "0 0", "0 0"],
      'I': ["000", " 0 ", " 0 ", " 0 ", "000"],
      'L': ["0  ", "0  ", "0  ", "0  ", "000"],
      'M': ["0 0", "000", "0 0", "0 0", "0 0"],
      'N': ["0 0", "000", "000", "0 0", "0 0"],
      'O': [" 0 ", "0 0", "0 0", "0 0", " 0 "],
      'P': ["00 ", "0 0", "00 ", "0  ", "0  "],
      'R': ["00 ", "0 0", "00 ", "0 0", "0 0"],
      'S': [" 00", "0  ", " 0 ", "  0", "00 "],
      'T': ["000", " 0 ", " 0 ", " 0 ", " 0 "],
      'U': ["0 0", "0 0", "0 0", "0 0", " 00"],
      'W': ["0 0", "0 0", "0 0", "000", "0 0"],
      '1': [" 0 ", "00 ", " 0 ", " 0 ", "000"],
      '2': ["00 ", "  0", " 0 ", "0  ", "000"],
      '3': ["00 ", "  0", " 00", "  0", "00 "],
      '4': ["0 0", "0 0", "000", "  0", "  0"],
      '5': ["000", "0  ", "00 ", "  0", "00 "],
      ' ': ["   ", "   ", "   ", "   ", "   "]
    };

    const pattern = glyphs[char] || glyphs[' '];
    for (let r = 0; r < pattern.length; r++) {
      for (let c = 0; c < pattern[r].length; c++) {
        if (pattern[r][c] !== ' ') {
          for (let sx = 0; sx < scale; sx++) {
            for (let sy = 0; sy < scale; sy++) {
              setPixel(startX + c * scale + sx, startY + r * scale + sy, color[0], color[1], color[2]);
            }
          }
        }
      }
    }
  }

  function drawText(text, x, y, color = [0, 0, 0], scale = 3) {
    let curX = x;
    for (const char of text.toUpperCase()) {
      drawChar(char, curX, y, color, scale);
      curX += 4 * scale + 2;
    }
  }

  drawFn({ setPixel, drawText });

  // Encode raw PNG with zlib
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    scanlines[y * (width * 4 + 1)] = 0; // Filter type None
    pixels.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressedData = zlib.deflateSync(scanlines);

  function writeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    
    // CRC-32 calculation
    let crc = 0xFFFFFFFF;
    const buf = Buffer.concat([typeBuf, data]);
    for (let i = 0; i < buf.length; i++) {
      crc ^= buf[i];
      for (let j = 0; j < 8; j++) {
        crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
      }
    }
    crc = (crc ^ 0xFFFFFFFF) >>> 0;
    crcBuf.writeUInt32BE(crc, 0);

    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type RGBA
  ihdr[10] = 0; // Compression
  ihdr[11] = 0; // Filter
  ihdr[12] = 0; // Interlace

  const ihdrChunk = writeChunk("IHDR", ihdr);
  const idatChunk = writeChunk("IDAT", compressedData);
  const iendChunk = writeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

async function createTestPdfs() {
  const outDir = path.resolve("./scratch/test_pdfs");
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // 1. Digital Selectable PDF
  const pdf1 = await PDFDocument.create();
  const font1 = await pdf1.embedFont(StandardFonts.Helvetica);
  const page1 = pdf1.addPage([600, 400]);
  page1.drawText("SnapFreeTools Digital PDF Test\nThis is a standard selectable digital text document.", {
    x: 50,
    y: 300,
    size: 16,
    font: font1,
    color: rgb(0, 0, 0)
  });
  fs.writeFileSync(path.join(outDir, "selectable.pdf"), await pdf1.save());
  console.log("Created selectable.pdf");

  // 2. Single-Page Scanned PDF (Pure image embed, zero text stream)
  const pdf2 = await PDFDocument.create();
  const png2 = createPngBuffer(500, 200, ({ drawText }) => {
    drawText("SAMPLE SCANNED OCR TEXT", 30, 70, [0, 0, 0], 4);
  });
  const img2 = await pdf2.embedPng(png2);
  const p2 = pdf2.addPage([500, 200]);
  p2.drawImage(img2, { x: 0, y: 0, width: 500, height: 200 });
  fs.writeFileSync(path.join(outDir, "scanned_single.pdf"), await pdf2.save());
  console.log("Created scanned_single.pdf");

  // 3. Multi-Page Scanned PDF (3 Pages of image text)
  const pdf3 = await PDFDocument.create();
  
  const png3_1 = createPngBuffer(500, 200, ({ drawText }) => {
    drawText("PAGE 1 OCR TEXT CONTENT", 30, 70, [0, 0, 0], 3);
  });
  const img3_1 = await pdf3.embedPng(png3_1);
  const p3_1 = pdf3.addPage([500, 200]);
  p3_1.drawImage(img3_1, { x: 0, y: 0, width: 500, height: 200 });

  const png3_2 = createPngBuffer(500, 200, ({ drawText }) => {
    drawText("PAGE 2 OCR TEXT CONTENT", 30, 70, [0, 0, 0], 3);
  });
  const img3_2 = await pdf3.embedPng(png3_2);
  const p3_2 = pdf3.addPage([500, 200]);
  p3_2.drawImage(img3_2, { x: 0, y: 0, width: 500, height: 200 });

  const png3_3 = createPngBuffer(500, 200, ({ drawText }) => {
    drawText("PAGE 3 OCR TEXT CONTENT", 30, 70, [0, 0, 0], 3);
  });
  const img3_3 = await pdf3.embedPng(png3_3);
  const p3_3 = pdf3.addPage([500, 200]);
  p3_3.drawImage(img3_3, { x: 0, y: 0, width: 500, height: 200 });

  fs.writeFileSync(path.join(outDir, "scanned_multipage.pdf"), await pdf3.save());
  console.log("Created scanned_multipage.pdf");

  // 4. Blank Image PDF (White image with zero text)
  const pdf4 = await PDFDocument.create();
  const png4 = createPngBuffer(400, 200, () => {
    // Blank white canvas
  });
  const img4 = await pdf4.embedPng(png4);
  const p4 = pdf4.addPage([400, 200]);
  p4.drawImage(img4, { x: 0, y: 0, width: 400, height: 200 });
  fs.writeFileSync(path.join(outDir, "scanned_blank.pdf"), await pdf4.save());
  console.log("Created scanned_blank.pdf");

  // 5. Low Quality / Blurry Scan PDF (Low contrast noise pattern)
  const pdf5 = await PDFDocument.create();
  const png5 = createPngBuffer(400, 200, ({ setPixel, drawText }) => {
    // Add gray background noise
    for (let x = 0; x < 400; x += 3) {
      for (let y = 0; y < 200; y += 3) {
        setPixel(x, y, 200, 200, 200);
      }
    }
    // Draw very light low-contrast blurry text
    drawText("LOW QUALITY SCAN TEST", 20, 80, [170, 170, 170], 2);
  });
  const img5 = await pdf5.embedPng(png5);
  const p5 = pdf5.addPage([400, 200]);
  p5.drawImage(img5, { x: 0, y: 0, width: 400, height: 200 });
  fs.writeFileSync(path.join(outDir, "scanned_lowconf.pdf"), await pdf5.save());
  console.log("Created scanned_lowconf.pdf");

  console.log("\nALL TEST PDF FILES GENERATED SUCCESSFULLY IN ./scratch/test_pdfs/\n");
}

createTestPdfs().catch(console.error);
