const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const express = require('express');
const request = require('supertest');
const AdmZip = require('adm-zip');
const { PDFDocument } = require('pdf-lib');
const app = require('../src/app');
const {
  VIEWPORT_PRESETS,
  DEFAULT_VIEWPORT,
  MARGIN_PRESETS,
  resolveViewport,
  resolveMargins,
  normalizeRenderSettings
} = require('../src/utils/sharedSettingsNormalizer');

process.env.NODE_ENV = 'test';

const binaryParser = (res, callback) => {
  res.setEncoding('binary');
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { callback(null, Buffer.from(data, 'binary')); });
};

let fixtureServer = null;
let fixturePort = 0;

test.before(async () => {
  return new Promise((resolve) => {
    const fixtureApp = express();
    fixtureApp.get('/phase4b-test-page', (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Phase 4B Fixture</title></head>
        <body style="margin: 0; padding: 20px;">
          <h1>Phase 4B Viewport & Page Test Page</h1>
          <p>Testing viewport responsive styles and page rendering.</p>
        </body>
        </html>
      `);
    });

    fixtureServer = http.createServer(fixtureApp);
    fixtureServer.listen(0, '127.0.0.1', () => {
      fixturePort = fixtureServer.address().port;
      process.env.TEST_FIXTURE_PORT = String(fixturePort);
      resolve();
    });
  });
});

test.after(async () => {
  return new Promise((resolve) => {
    if (fixtureServer) {
      fixtureServer.close(() => resolve());
    } else {
      resolve();
    }
  });
});

/* -------------------------------------------------------------------------- */
/* 1. SHARED SETTINGS NORMALIZER UNIT TESTS                                  */
/* -------------------------------------------------------------------------- */

test('Phase 4B Normalizer: Default settings backward compatibility', () => {
  const normalized = normalizeRenderSettings({});
  assert.strictEqual(normalized.pageSize, 'A4');
  assert.strictEqual(normalized.orientation, 'portrait');
  assert.strictEqual(normalized.mediaType, 'print');
  assert.strictEqual(normalized.scale, 1.0);
  assert.strictEqual(normalized.printBackground, true);
  assert.strictEqual(normalized.showFooter, false);
  assert.strictEqual(normalized.respectCssPageSize, false);
  assert.deepStrictEqual(normalized.viewport, DEFAULT_VIEWPORT);
  assert.deepStrictEqual(normalized.margins, { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' });
});

test('Phase 4B Normalizer: Viewport Presets mapping (desktop_hd, desktop, tablet, mobile)', () => {
  assert.deepStrictEqual(resolveViewport('desktop_hd'), VIEWPORT_PRESETS.desktop_hd);
  assert.deepStrictEqual(resolveViewport('desktop'), VIEWPORT_PRESETS.desktop);
  assert.deepStrictEqual(resolveViewport('tablet'), VIEWPORT_PRESETS.tablet);
  assert.deepStrictEqual(resolveViewport('mobile'), VIEWPORT_PRESETS.mobile);
});

test('Phase 4B Normalizer: "your_screen" preset with customScreenWidth bounds', () => {
  // Valid custom width within bounds
  const validScreen = resolveViewport('your_screen', 1600);
  assert.strictEqual(validScreen.width, 1600);
  assert.strictEqual(validScreen.height, 800);

  // Out of bounds (< 320 or > 2560) fallback to default 1280
  assert.strictEqual(resolveViewport('your_screen', 100).width, 1280);
  assert.strictEqual(resolveViewport('your_screen', 5000).width, 1280);

  // Omitted custom width fallback
  assert.strictEqual(resolveViewport('your_screen').width, 1280);
});

test('Phase 4B Normalizer: Margin presets (none, small, big, custom) & precedence rules', () => {
  // Preset overrides individual margins
  const presetSmall = normalizeRenderSettings({
    marginPreset: 'small',
    marginTop: '50mm',
    marginLeft: '50mm'
  });
  assert.deepStrictEqual(presetSmall.margins, MARGIN_PRESETS.small);

  const presetNone = normalizeRenderSettings({ marginPreset: 'none' });
  assert.deepStrictEqual(presetNone.margins, MARGIN_PRESETS.none);

  const presetBig = normalizeRenderSettings({ marginPreset: 'big' });
  assert.deepStrictEqual(presetBig.margins, MARGIN_PRESETS.big);

  // Custom margin preset or omitted preset uses individual validated margins
  const customMargins = normalizeRenderSettings({
    marginPreset: 'custom',
    marginTop: '15mm',
    marginRight: '20mm',
    marginBottom: '15mm',
    marginLeft: '20mm'
  });
  assert.deepStrictEqual(customMargins.margins, { top: '15mm', right: '20mm', bottom: '15mm', left: '20mm' });
});

test('Phase 4B Normalizer: Malformed or invalid margin strings fallback to 10mm', () => {
  const invalidMargins = resolveMargins({
    marginTop: 'invalid',
    marginRight: '-5mm',
    marginBottom: 'NaN',
    marginLeft: '999xyz'
  });
  assert.deepStrictEqual(invalidMargins, { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' });
});

test('Phase 4B Normalizer: A5 and OneLongPage page sizes', () => {
  const a5Settings = normalizeRenderSettings({ pageSize: 'A5', orientation: 'landscape' });
  assert.strictEqual(a5Settings.pageSize, 'A5');
  assert.strictEqual(a5Settings.orientation, 'landscape');

  const longPage = normalizeRenderSettings({ pageSize: 'OneLongPage', orientation: 'landscape', respectCssPageSize: true });
  assert.strictEqual(longPage.pageSize, 'OneLongPage');
  assert.strictEqual(longPage.isOneLongPage, true);
  // OneLongPage normalizes orientation to portrait and forces respectCssPageSize to false
  assert.strictEqual(longPage.orientation, 'portrait');
  assert.strictEqual(longPage.respectCssPageSize, false);
});

test('Phase 4B Normalizer: Scale boundary & non-finite checks', () => {
  assert.strictEqual(normalizeRenderSettings({ scale: 0.05 }).scale, 0.1);
  assert.strictEqual(normalizeRenderSettings({ scale: 3.5 }).scale, 2.0);
  assert.strictEqual(normalizeRenderSettings({ scale: 1.5 }).scale, 1.5);
  assert.strictEqual(normalizeRenderSettings({ scale: NaN }).scale, 1.0);
});

/* -------------------------------------------------------------------------- */
/* 2. REAL PDF ARTIFACT DIMENSION VERIFICATION (A5, ONE LONG PAGE, MARGINS)    */
/* -------------------------------------------------------------------------- */

test('Phase 4B Output: A5 Portrait actual PDF page dimensions (148 x 210 mm = ~419.5 x ~595.3 pt)', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: '<h1>A5 Portrait Document</h1>',
      settings: { pageSize: 'A5', orientation: 'portrait' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  const size = pdfDoc.getPage(0).getSize();

  // A5 dimensions in PDF points (72 points per inch): 148mm = 419.53 pt, 210mm = 595.28 pt
  assert.ok(Math.abs(size.width - 419.53) < 5, `Expected width ~419.53, got ${size.width}`);
  assert.ok(Math.abs(size.height - 595.28) < 5, `Expected height ~595.28, got ${size.height}`);
});

test('Phase 4B Output: A5 Landscape actual PDF page dimensions (210 x 148 mm = ~595.3 x ~419.5 pt)', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: '<h1>A5 Landscape Document</h1>',
      settings: { pageSize: 'A5', orientation: 'landscape' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  const size = pdfDoc.getPage(0).getSize();

  assert.ok(Math.abs(size.width - 595.28) < 5, `Expected width ~595.28, got ${size.width}`);
  assert.ok(Math.abs(size.height - 419.53) < 5, `Expected height ~419.53, got ${size.height}`);
});

test('Phase 4B Output: Margin Presets (none vs small vs big vs custom) produce valid PDFs', async () => {
  const getPdf = async (marginPreset, custom = {}) => {
    const res = await request(app)
      .post('/api/v1/convert/html-to-pdf')
      .parse(binaryParser)
      .send({
        mode: 'html_paste',
        htmlContent: '<p>Margin Test</p>',
        settings: { pageSize: 'A4', marginPreset, ...custom }
      });
    assert.strictEqual(res.status, 200);
    return PDFDocument.load(res.body);
  };

  const docNone = await getPdf('none');
  const docSmall = await getPdf('small');
  const docBig = await getPdf('big');
  const docCustom = await getPdf('custom', { marginTop: '15mm', marginLeft: '25mm' });

  assert.strictEqual(docNone.getPageCount(), 1);
  assert.strictEqual(docSmall.getPageCount(), 1);
  assert.strictEqual(docBig.getPageCount(), 1);
  assert.strictEqual(docCustom.getPageCount(), 1);
});

test('Phase 4B Output: One Long Page renders single continuous page without vertical split', async () => {
  const longContent = `
    <h1>Continuous Long Page Document</h1>
    <p>${'Line of text content. '.repeat(50)}</p>
    <div style="height: 1200px; background: #eee;">Tall Div Section</div>
    <p>End of continuous page.</p>
  `;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: longContent,
      settings: { pageSize: 'OneLongPage', screenSize: 'desktop' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);

  // Crucial check: Exactly 1 page continuous document!
  assert.strictEqual(pdfDoc.getPageCount(), 1);
  const size = pdfDoc.getPage(0).getSize();
  assert.ok(size.height > 1000, `Expected continuous height > 1000pt, got ${size.height}`);
});

test('Phase 4B Safety: One Long Page rejects excessive content exceeding 15,000px limit', async () => {
  const extremeHtml = `
    <h1>Extreme Height Page</h1>
    <div style="height: 16000px; background: red;">Oversized Block</div>
  `;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .send({
      mode: 'html_paste',
      htmlContent: extremeHtml,
      settings: { pageSize: 'OneLongPage' }
    });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_ONE_LONG_PAGE_EXCEEDED');
  assert.ok(res.body.message.includes('exceeds maximum allowed continuous height limit'));
});

/* -------------------------------------------------------------------------- */
/* 3. FOUR MODES REGRESSION TESTS WITH PHASE 4B SETTINGS                      */
/* -------------------------------------------------------------------------- */

test('Phase 4B Regression: URL Mode with Screen Size & Margin Preset', async () => {
  const fixtureUrl = `http://127.0.0.1:${fixturePort}/phase4b-test-page`;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'url',
      url: fixtureUrl,
      settings: { screenSize: 'mobile', pageSize: 'A5', marginPreset: 'small' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.ok(pdfDoc.getPageCount() > 0);
});

test('Phase 4B Regression: Paste HTML Mode with Tablet Screen Size & A5 Page Size', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: '<h1>Tablet View HTML</h1>',
      settings: { screenSize: 'tablet', pageSize: 'A5', orientation: 'landscape' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});

test('Phase 4B Regression: Upload HTML Mode with Desktop HD Viewport & Custom Margins', async () => {
  const htmlBuffer = Buffer.from('<html><body><h1>Uploaded Desktop HD Page</h1></body></html>');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', htmlBuffer, 'desktop.html')
    .field('settings', JSON.stringify({ screenSize: 'desktop_hd', pageSize: 'A4', marginPreset: 'small' }));

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});

test('Phase 4B Regression: ZIP Package Mode with Screen Size & A5 Page Size', async () => {
  const zip = new AdmZip();
  zip.addFile('index.html', Buffer.from('<html><body><h1>ZIP Package Phase 4B Test</h1></body></html>'));
  const zipBuffer = zip.toBuffer();

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'phase4b.zip')
    .field('settings', JSON.stringify({ screenSize: 'desktop', pageSize: 'A5', marginPreset: 'big' }));

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});
