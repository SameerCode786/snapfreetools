import assert from "node:assert/strict";
import path from "node:path";
import { pathToFileURL } from "node:url";

const projectRoot = process.cwd();
const moduleUrl = pathToFileURL(
  path.join(projectRoot, "src/features/image-compressor/utils/target-compression.js")
).href;

const { compressCanvas, compressPNGScale, compressToTargetSize } = await import(moduleUrl);

function makeSizedBlob(size, type) {
  return {
    size,
    type
  };
}

function setupMockDocument(encoderFn) {
  const calls = [];
  globalThis.document = {
    createElement(tag) {
      assert.equal(tag, "canvas");
      const ops = { fillRectCalled: false, fillStyle: null, drawn: null, width: 0, height: 0 };
      const ctx = {
        set fillStyle(v) {
          ops.fillStyle = v;
        },
        get fillStyle() {
          return ops.fillStyle;
        },
        fillRect(x, y, w, h) {
          ops.fillRectCalled = { x, y, w, h };
        },
        drawImage(img, x, y, w, h) {
          ops.drawn = { x, y, w, h };
        }
      };

      const canvas = {
        _w: 0,
        _h: 0,
        set width(v) {
          this._w = v;
          ops.width = v;
        },
        get width() {
          return this._w;
        },
        set height(v) {
          this._h = v;
          ops.height = v;
        },
        get height() {
          return this._h;
        },
        getContext(kind) {
          assert.equal(kind, "2d");
          return ctx;
        },
        toBlob(cb, mimeType, quality) {
          const entry = {
            width: this._w,
            height: this._h,
            mimeType,
            quality,
            fillRectCalled: ops.fillRectCalled,
            fillStyle: ops.fillStyle
          };
          calls.push(entry);
          queueMicrotask(() => cb(encoderFn(entry)));
        }
      };
      return canvas;
    }
  };
  return calls;
}

console.log("=== Running Image Compressor Target Compliance Unit Tests ===");

// TEST 1: No-inflation when originalFile <= targetBytes in same format
{
  const calls = setupMockDocument(() => {
    throw new Error("Canvas should not be invoked when same-format original <= targetBytes");
  });
  const originalFile = makeSizedBlob(42000, "image/jpeg");
  const res = await compressToTargetSize({
    img: { naturalWidth: 1600, naturalHeight: 1200 },
    originalFile,
    originalFormat: "JPG",
    targetFormat: "image/jpeg",
    targetBytes: 51200
  });
  assert.equal(res.blob, originalFile);
  assert.equal(res.preservedOriginal, true);
  assert.equal(res.targetMet, true);
  assert.equal(res.scaleUsed, 1.0);
  assert.equal(res.qualityUsed, 1.0);
  assert.equal(calls.length, 0);
  console.log("PASS 1: Preserves original file without inflation when <= targetBytes");
}

// TEST 2: PNG transparency preserved (no white fillRect) and strict <= targetBytes achieved
{
  const calls = setupMockDocument(({ width, height, mimeType }) => {
    // Realistic entropy model proportional to pixel count + header
    const bytes = Math.round(450 + width * height * 0.35);
    return makeSizedBlob(bytes, mimeType);
  });
  const res = await compressToTargetSize({
    img: { naturalWidth: 1000, naturalHeight: 1000 },
    originalFile: makeSizedBlob(350450, "image/png"),
    originalFormat: "PNG",
    targetFormat: "image/png",
    targetBytes: 51200
  });
  assert.equal(res.targetMet, true);
  assert.ok(res.blob.size <= 51200, `Expected PNG <= 51200, got ${res.blob.size}`);
  assert.equal(res.actualFormat, "image/png");
  assert.ok(res.scaleUsed < 1.0);
  assert.ok(calls.length > 0);
  for (const call of calls) {
    assert.equal(call.fillRectCalled, false, "PNG compression must never fill background");
    assert.equal(call.quality, undefined, "PNG toBlob quality argument must stay undefined");
  }
  console.log(`PASS 2: PNG transparency preserved and compressed strictly <= 51200 (${res.blob.size} B)`);
}

// TEST 3: JPEG background fill and Phase 3 validation loop never inflates dimensions back to 1.0
{
  // Make full-res always > 51200 even at q=0.12; at scale=0.5 q=0.65 slightly > 51200 so Phase 3 kicks in
  const calls = setupMockDocument(({ width, height, mimeType, quality }) => {
    const areaRatio = (width * height) / (2000 * 1500);
    const bytes = Math.round(700 + areaRatio * (35000 + quality * 280000));
    return makeSizedBlob(bytes, mimeType);
  });
  const res = await compressToTargetSize({
    img: { naturalWidth: 2000, naturalHeight: 1500 },
    originalFile: makeSizedBlob(500000, "image/jpeg"),
    originalFormat: "JPG",
    targetFormat: "image/jpeg",
    targetBytes: 20480
  });
  assert.equal(res.targetMet, true);
  assert.ok(res.blob.size <= 20480, `Expected JPEG <= 20480, got ${res.blob.size}`);
  assert.ok(res.scaleUsed < 1.0, "Expected dimension scale < 1.0 after Phase 2/3");
  assert.ok(calls.every((c) => c.fillStyle === "#FFFFFF" && c.fillRectCalled !== false));

  // Verify Phase 3 never jumped dimensions back up to 2000x1500 once Phase 2 started scaling
  const firstScaledIdx = calls.findIndex((c) => c.width < 2000);
  assert.ok(firstScaledIdx > 0);
  const laterCalls = calls.slice(firstScaledIdx);
  assert.ok(
    laterCalls.every((c) => c.width < 2000 && c.height < 1500),
    "Phase 3 must never reset dimensions back to native resolution"
  );
  console.log(`PASS 3: JPEG Phase 2/3 validation kept strict limit (${res.blob.size} B) without dimension reset`);
}

// TEST 4: AVIF silent PNG fallback detected & cleanly routed to WebP
{
  setupMockDocument(({ width, height, mimeType, quality }) => {
    if (mimeType === "image/avif") {
      // Simulate browsers that ignore image/avif and emit large lossless PNG instead
      return makeSizedBlob(300000, "image/png");
    }
    const q = quality ?? 0.8;
    const areaRatio = (width * height) / (1200 * 900);
    return makeSizedBlob(Math.round(600 + areaRatio * (12000 + q * 95000)), mimeType);
  });

  await assert.rejects(
    () => compressCanvas({ naturalWidth: 100, naturalHeight: 100 }, 0.8, "image/avif"),
    /AVIF encoding unsupported/
  );

  const res = await compressToTargetSize({
    img: { naturalWidth: 1200, naturalHeight: 900 },
    originalFile: makeSizedBlob(220000, "image/png"),
    originalFormat: "PNG",
    targetFormat: "image/avif",
    targetBytes: 51200
  });
  assert.equal(res.avifFallback, true);
  assert.equal(res.actualFormat, "image/webp");
  assert.equal(res.targetMet, true);
  assert.ok(res.blob.size <= 51200, `Expected fallback WebP <= 51200, got ${res.blob.size}`);
  console.log(`PASS 4: AVIF silent-PNG fallback redirected to WebP <= 51200 (${res.blob.size} B)`);
}

// TEST 5: Exact boundary (output === targetBytes) passes strictly
{
  setupMockDocument(({ mimeType }) => makeSizedBlob(51200, mimeType));
  const res = await compressToTargetSize({
    img: { naturalWidth: 800, naturalHeight: 600 },
    originalFile: makeSizedBlob(120000, "image/jpeg"),
    originalFormat: "JPG",
    targetFormat: "image/jpeg",
    targetBytes: 51200
  });
  assert.equal(res.blob.size, 51200);
  assert.equal(res.targetMet, true);
  console.log("PASS 5: Exact byte boundary (51200 === 51200) marks targetMet = true");
}

// TEST 6: Impossible tiny target sets targetMet = false honestly without crashing
{
  setupMockDocument(({ width, height, mimeType, quality }) => {
    // Minimum container header 750 bytes even at 1x1
    return makeSizedBlob(750 + Math.round(width * height * (quality ?? 1) * 0.5), mimeType);
  });
  const res = await compressToTargetSize({
    img: { naturalWidth: 1600, naturalHeight: 1200 },
    originalFile: makeSizedBlob(250000, "image/jpeg"),
    originalFormat: "JPG",
    targetFormat: "image/jpeg",
    targetBytes: 200
  });
  assert.equal(res.targetMet, false);
  assert.ok(res.blob.size > 200);
  assert.ok(res.blob.size < 1000);
  console.log(`PASS 6: Impossible 200 B target honestly flags targetMet = false (smallest: ${res.blob.size} B)`);
}

// TEST 7: compressPNGScale gracefully returns null if canvas fails
{
  setupMockDocument(() => null);
  const res = await compressPNGScale({ naturalWidth: 400, naturalHeight: 400 }, 0.5);
  assert.equal(res, null);
  console.log("PASS 7: compressPNGScale returns null gracefully on encoder failure");
}

console.log("=== ALL 7 IMAGE COMPRESSOR TARGET COMPLIANCE UNIT TESTS PASSED ===");

