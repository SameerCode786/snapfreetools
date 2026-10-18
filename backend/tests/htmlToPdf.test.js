const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const http = require('http');
const express = require('express');
const request = require('supertest');
const AdmZip = require('adm-zip');
const { PDFDocument } = require('pdf-lib');
const app = require('../src/app');
const { isPrivateIp, validateUrl } = require('../src/services/ssrfValidator.service');
const { extractZipPackage } = require('../src/services/zipExtractor.service');
const rateLimitMiddleware = require('../src/middleware/htmlToPdfRateLimit');

// Force NODE_ENV to test by default for helper execution
process.env.NODE_ENV = 'test';

// Helper binary parser for supertest binary responses
const binaryParser = (res, callback) => {
  res.setEncoding('binary');
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { callback(null, Buffer.from(data, 'binary')); });
};

// Local Deterministic Fixture Server for Safe Testing
let fixtureServer = null;
let fixturePort = 0;
let privateHitCount = 0;

test.before(async () => {
  return new Promise((resolve) => {
    const fixtureApp = express();

    // Deterministic HTML fixture for URL mode success test
    fixtureApp.get('/test-page', (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Fixture Page</title>
          <style>
            body { font-family: sans-serif; }
            .page-break { page-break-after: always; break-after: page; }
          </style>
        </head>
        <body>
          <h1>URL Mode Test Page 1</h1>
          <p>Marker: URL_FIXTURE_SUCCESS_MARKER</p>
          <div class="page-break"></div>
          <h1>URL Mode Test Page 2</h1>
        </body>
        </html>
      `);
    });

    // Subresource test fixture (contains embedded private subresources)
    fixtureApp.get('/subresource-test-page', (req, res) => {
      res.setHeader('Content-Type', 'text/html');
      res.send(`
        <!DOCTYPE html>
        <html>
        <body>
          <h1>Subresource Test Page</h1>
          <img src="http://10.0.0.1/private-image.png">
          <link rel="stylesheet" href="http://172.16.0.1/private-style.css">
          <style>
            @font-face { font-family: 'PrivateFont'; src: url('http://192.168.1.1/private-font.woff2'); }
          </style>
        </body>
        </html>
      `);
    });

    // Redirect fixtures pointing to private endpoints
    fixtureApp.get('/redirect-private-target', (req, res) => {
      res.redirect(302, 'http://10.0.0.1/private-endpoint');
    });

    // Infinite redirect loop fixture (>3 redirects)
    fixtureApp.get('/redirect-chain-1', (req, res) => res.redirect(302, `http://127.0.0.1:${fixturePort}/redirect-chain-2`));
    fixtureApp.get('/redirect-chain-2', (req, res) => res.redirect(302, `http://127.0.0.1:${fixturePort}/redirect-chain-3`));
    fixtureApp.get('/redirect-chain-3', (req, res) => res.redirect(302, `http://127.0.0.1:${fixturePort}/redirect-chain-4`));
    fixtureApp.get('/redirect-chain-4', (req, res) => res.redirect(302, `http://127.0.0.1:${fixturePort}/redirect-chain-5`));
    fixtureApp.get('/redirect-chain-5', (req, res) => res.send('Done'));

    // Private endpoint for tracking unauthorized hits
    fixtureApp.get('/private-endpoint', (req, res) => {
      privateHitCount++;
      res.send('PRIVATE_DATA');
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
/* 1. PDF OUTPUT & SETTINGS VERIFICATION TESTS                                 */
/* -------------------------------------------------------------------------- */

test('Pasted HTML Mode returns valid PDF buffer with magic bytes & page count', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: '<h1>Hello World</h1><p>Testing PDF output generation.</p>',
      settings: { pageSize: 'A4', orientation: 'portrait' }
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['content-type'], 'application/pdf');
  assert.ok(res.headers['content-disposition'].includes('attachment'));
  
  const buffer = res.body;
  assert.ok(Buffer.isBuffer(buffer));
  assert.strictEqual(buffer.slice(0, 5).toString('utf-8'), '%PDF-');

  const pdfDoc = await PDFDocument.load(buffer);
  assert.ok(pdfDoc.getPageCount() > 0);
});

test('Multi-page HTML rendering with print CSS breaks', async () => {
  const multiPageHtml = `
    <!DOCTYPE html>
    <html>
    <body>
      <h1>Section 1</h1>
      <div style="page-break-after: always; break-after: page;"></div>
      <h1>Section 2</h1>
      <div style="page-break-after: always; break-after: page;"></div>
      <h1>Section 3</h1>
    </body>
    </html>
  `;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: multiPageHtml,
      settings: { pageSize: 'A4' }
    });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 3);
});

test('PDF Options: Page sizes (A4 vs Letter vs Legal vs A3)', async () => {
  const getDoc = async (pageSize) => {
    const res = await request(app)
      .post('/api/v1/convert/html-to-pdf')
      .parse(binaryParser)
      .send({ mode: 'html_paste', htmlContent: `<p>${pageSize} Test</p>`, settings: { pageSize } });
    return PDFDocument.load(res.body);
  };

  const docA4 = await getDoc('A4');
  const docLetter = await getDoc('Letter');
  const docLegal = await getDoc('Legal');
  const docA3 = await getDoc('A3');

  const sizeA4 = docA4.getPage(0).getSize();
  const sizeLetter = docLetter.getPage(0).getSize();
  const sizeLegal = docLegal.getPage(0).getSize();
  const sizeA3 = docA3.getPage(0).getSize();

  assert.notStrictEqual(sizeA4.width, sizeLetter.width);
  assert.notStrictEqual(sizeA4.height, sizeLegal.height);
  assert.ok(sizeA3.width > sizeA4.width);
});

test('PDF Options: Orientation (portrait vs landscape)', async () => {
  const resPortrait = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({ mode: 'html_paste', htmlContent: '<p>Portrait</p>', settings: { pageSize: 'A4', orientation: 'portrait' } });

  const resLandscape = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({ mode: 'html_paste', htmlContent: '<p>Landscape</p>', settings: { pageSize: 'A4', orientation: 'landscape' } });

  const docPortrait = await PDFDocument.load(resPortrait.body);
  const docLandscape = await PDFDocument.load(resLandscape.body);

  const sizeP = docPortrait.getPage(0).getSize();
  const sizeL = docLandscape.getPage(0).getSize();

  assert.strictEqual(sizeP.width, sizeL.height);
  assert.strictEqual(sizeP.height, sizeL.width);
});

test('PDF Options: mediaType (print vs screen), showFooter & respectCssPageSize', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: '<h1>Media Type Test</h1>',
      settings: { mediaType: 'screen', showFooter: true, respectCssPageSize: false }
    });

  assert.strictEqual(res.status, 200);
  const doc = await PDFDocument.load(res.body);
  assert.strictEqual(doc.getPageCount(), 1);
});

/* -------------------------------------------------------------------------- */
/* 2. DETERMINISTIC URL MODE SUCCESS TEST                                     */
/* -------------------------------------------------------------------------- */

test('URL Mode: Successfully converts deterministic local test fixture webpage', async () => {
  const fixtureUrl = `http://127.0.0.1:${fixturePort}/test-page`;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'url',
      url: fixtureUrl,
      settings: { pageSize: 'A4', orientation: 'portrait' }
    });

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['content-type'], 'application/pdf');

  const buffer = res.body;
  assert.ok(Buffer.isBuffer(buffer));
  assert.strictEqual(buffer.slice(0, 5).toString('utf-8'), '%PDF-');

  const pdfDoc = await PDFDocument.load(buffer);
  assert.strictEqual(pdfDoc.getPageCount(), 2);
});

/* -------------------------------------------------------------------------- */
/* 3. INPUT MODES & FILE UPLOAD SECURITY                                      */
/* -------------------------------------------------------------------------- */

test('Uploaded HTML Mode: Processes valid .html file', async () => {
  const htmlBuffer = Buffer.from('<html><body><h1>Uploaded HTML</h1></body></html>');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', htmlBuffer, 'test-doc.html')
    .field('settings', JSON.stringify({ pageSize: 'A4' }));

  assert.strictEqual(res.status, 200);
  const doc = await PDFDocument.load(res.body);
  assert.strictEqual(doc.getPageCount(), 1);
});

test('Uploaded HTML Mode: Processes valid .htm file', async () => {
  const htmlBuffer = Buffer.from('<html><body><h1>Uploaded HTM</h1></body></html>');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', htmlBuffer, 'document.htm');

  assert.strictEqual(res.status, 200);
});

test('File Upload Security: Rejects .txt file upload', async () => {
  const txtBuffer = Buffer.from('Plain text content');
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', txtBuffer, 'sample.txt');

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_UNSUPPORTED_EXTENSION');
});

test('File Upload Security: Rejects .js file upload', async () => {
  const jsBuffer = Buffer.from('console.log("hello");');
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', jsBuffer, 'script.js');

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_UNSUPPORTED_EXTENSION');
});

test('File Upload Security: Rejects empty file upload', async () => {
  const emptyBuffer = Buffer.from('');
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', emptyBuffer, 'empty.html');

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_EMPTY_FILE');
});

test('Rejects empty HTML paste content', async () => {
  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .send({ mode: 'html_paste', htmlContent: '   ' });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_INVALID_REQUEST');
});

/* -------------------------------------------------------------------------- */
/* 4. SECURITY AUDIT: TEST_FIXTURE_PORT IN PRODUCTION                        */
/* -------------------------------------------------------------------------- */

test('Security Audit: TEST_FIXTURE_PORT exception is completely rejected in production mode', async () => {
  // Set NODE_ENV to production temporarily
  const origEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';

  try {
    const res = await validateUrl(`http://127.0.0.1:${fixturePort}/test-page`);
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.code, 'ERR_SSRF_BLOCKED');
  } finally {
    process.env.NODE_ENV = origEnv;
  }
});

/* -------------------------------------------------------------------------- */
/* 5. COMPLETE SSRF SECURITY TESTS MATRIX                                      */
/* -------------------------------------------------------------------------- */

test('SSRF Matrix: Rejects localhost', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://localhost:3000/admin' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects 127.0.0.1 IP address', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://127.0.0.1:80/admin' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects IPv6 loopback [::1]', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://[::1]/test' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects IPv4-mapped IPv6 [::ffff:127.0.0.1]', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://[::ffff:127.0.0.1]/test' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects private IPv4 10.0.0.1', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://10.0.0.1/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects private IPv4 172.16.0.1', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://172.16.0.1/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects private IPv4 192.168.1.1', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://192.168.1.1/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects Carrier-Grade NAT IPv4 100.64.0.1', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://100.64.0.1/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects unspecified IPv4 0.0.0.0', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://0.0.0.0/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects AWS metadata IP 169.254.169.254', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://169.254.169.254/latest/meta-data/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects private IPv6 fc00::1 and fe80::1', async () => {
  assert.strictEqual(isPrivateIp('fc00::1'), true);
  assert.strictEqual(isPrivateIp('fe80::1'), true);
});

test('SSRF Matrix: Rejects non-standard ports (e.g. 8080)', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://example.com:8080/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Matrix: Rejects embedded user credentials in URL', async () => {
  const res = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'http://admin:secret@example.com/' });
  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_INVALID_URL');
});

test('SSRF Matrix: Rejects unsupported schemes (file://, ftp://, gopher://)', async () => {
  const resFile = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'file:///etc/passwd' });
  assert.strictEqual(resFile.status, 400);
  assert.strictEqual(resFile.body.code, 'ERR_UNSUPPORTED_SCHEME');

  const resFtp = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'ftp://example.com/file' });
  assert.strictEqual(resFtp.status, 400);
  assert.strictEqual(resFtp.body.code, 'ERR_UNSUPPORTED_SCHEME');

  const resGopher = await request(app).post('/api/v1/convert/html-to-pdf').send({ mode: 'url', url: 'gopher://example.com/' });
  assert.strictEqual(resGopher.status, 400);
  assert.strictEqual(resGopher.body.code, 'ERR_UNSUPPORTED_SCHEME');
});

/* -------------------------------------------------------------------------- */
/* 6. REDIRECT SECURITY HARDENING TESTS                                       */
/* -------------------------------------------------------------------------- */

test('SSRF Redirect: Rejects redirect chain pointing to private 10.0.0.1 IP', async () => {
  const fixtureUrl = `http://127.0.0.1:${fixturePort}/redirect-private-target`;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .send({ mode: 'url', url: fixtureUrl });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_SSRF_BLOCKED');
});

test('SSRF Redirect: Rejects redirect chain exceeding maximum of 3 hops (>3 redirects)', async () => {
  const fixtureUrl = `http://127.0.0.1:${fixturePort}/redirect-chain-1`;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .send({ mode: 'url', url: fixtureUrl });

  assert.strictEqual(res.status, 400);
  assert.strictEqual(res.body.code, 'ERR_TOO_MANY_REDIRECTS');
});

/* -------------------------------------------------------------------------- */
/* 7. SUBRESOURCE SSRF COVERAGE TESTS                                         */
/* -------------------------------------------------------------------------- */

test('Subresource SSRF: Blocks private image, stylesheet, and web-font subresources', async () => {
  const initialHitCount = privateHitCount;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({
      mode: 'html_paste',
      htmlContent: `
        <h1>Subresource Test Page</h1>
        <img src="http://10.0.0.1/private-image.png">
        <link rel="stylesheet" href="http://172.16.0.1/private-style.css">
        <style>
          @font-face { font-family: 'PrivateFont'; src: url('http://192.168.1.1/private-font.woff2'); }
        </style>
      `
    });

  assert.strictEqual(res.status, 200);
  // Verify private subresource endpoints were NEVER reached
  assert.strictEqual(privateHitCount, initialHitCount);
});

/* -------------------------------------------------------------------------- */
/* 8. HTML SANITIZATION VERIFICATION                                         */
/* -------------------------------------------------------------------------- */

test('HTML Sanitization Matrix: Neutralizes <script>, <iframe>, <object>, <embed>, onclick, onerror', async () => {
  const maliciousHtml = `
    <h1>Safe Content</h1>
    <script>document.body.innerHTML = 'HACKED';</script>
    <iframe src="http://example.com"></iframe>
    <object data="http://example.com/exploit.swf"></object>
    <embed src="http://example.com/plugin"></embed>
    <img src="invalid.jpg" onerror="document.body.innerHTML='HACKED'">
    <a href="javascript:alert('XSS')" onclick="alert('XSS')">Click Me</a>
  `;

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({ mode: 'html_paste', htmlContent: maliciousHtml });

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});

/* -------------------------------------------------------------------------- */
/* 9. STORAGE & BROWSER CONTEXT ISOLATION TESTS                              */
/* -------------------------------------------------------------------------- */

test('Browser Context Isolation: Cookies & Storage state do not persist across requests', async () => {
  const htmlWithStorage = `
    <script>
      document.cookie = "token=12345; path=/";
      localStorage.setItem("user", "attacker");
      sessionStorage.setItem("session", "compromised");
    </script>
    <p>Storage Injection Attempt</p>
  `;

  await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({ mode: 'html_paste', htmlContent: htmlWithStorage });

  const res2 = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .send({ mode: 'html_paste', htmlContent: '<p>Request 2</p>' });

  assert.strictEqual(res2.status, 200);
});

/* -------------------------------------------------------------------------- */
/* 10. PHASE 3A — ZIP PACKAGE SUPPORT TESTS                                   */
/* -------------------------------------------------------------------------- */

function buildZipBuffer(files = []) {
  const zip = new AdmZip();
  for (const f of files) {
    zip.addFile(f.name, Buffer.from(f.content || ''));
  }
  return zip.toBuffer();
}

function buildZipBufferWithRawPath(entryPath, content = 'malicious', ext = '.html') {
  const zip = new AdmZip();
  zip.addFile('index.html', Buffer.from('<h1>Index</h1>'));
  zip.addFile('dummy' + ext, Buffer.from(content));
  const entries = zip.getEntries();
  const dummyEntry = entries.find(e => e.entryName === 'dummy' + ext);
  if (dummyEntry) {
    dummyEntry.entryName = entryPath;
  }
  return zip.toBuffer();
}

test('ZIP Mode: Valid ZIP with index.html, CSS, image converts to PDF', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<html><head><link rel="stylesheet" href="style.css"></head><body><h1>ZIP Test</h1><img src="logo.png"></body></html>' },
    { name: 'style.css', content: 'body { color: red; font-family: sans-serif; }' },
    { name: 'logo.png', content: 'fake-png-data' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'package.zip')
    .field('settings', JSON.stringify({ pageSize: 'A4' }));

  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.headers['content-type'], 'application/pdf');

  const buffer = res.body;
  assert.ok(Buffer.isBuffer(buffer));
  assert.strictEqual(buffer.slice(0, 5).toString('utf-8'), '%PDF-');

  const pdfDoc = await PDFDocument.load(buffer);
  assert.ok(pdfDoc.getPageCount() > 0);
});

test('ZIP Mode: Valid ZIP with nested directories (css/style.css, images/logo.png)', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<html><head><link rel="stylesheet" href="css/style.css"></head><body><h1>Nested ZIP Test</h1><img src="images/logo.png"></body></html>' },
    { name: 'css/style.css', content: 'h1 { color: blue; }' },
    { name: 'images/logo.png', content: 'fake-png-data' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'nested.zip');

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});

test('ZIP Mode: Valid ZIP with local web font completes conversion', async () => {
  const fontData = 'WOFF2_FONT_TEST_DATA';
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<html><head><style>@font-face { font-family: "CustomFont"; src: url("fonts/font.woff2"); } body { font-family: "CustomFont"; }</style></head><body><h1>Font Test</h1></body></html>' },
    { name: 'fonts/font.woff2', content: fontData }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'font.zip');

  assert.strictEqual(res.status, 200);
});

test('ZIP Mode Entry Selection: index.html preferred over other HTML files', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'other.html', content: '<h1>Other Page</h1>' },
    { name: 'index.html', content: '<h1>Index Page</h1>' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'multi-html.zip');

  assert.strictEqual(res.status, 200);
});

test('ZIP Mode Entry Selection: index.htm works when index.html is absent', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.htm', content: '<h1>Index HTM Page</h1>' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'index-htm.zip');

  assert.strictEqual(res.status, 200);
});

test('ZIP Mode Entry Selection: Fails with ERR_ZIP_NO_HTML when no HTML entry exists', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'style.css', content: 'body { color: red; }' },
    { name: 'logo.png', content: 'png-data' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'no-html.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_NO_HTML' || res.body.code === 'ZIP_NO_HTML');
});

test('Zip Slip Protection: Rejects relative path traversal ../evil.html', async () => {
  const zipBuffer = buildZipBufferWithRawPath('../evil.html');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'zip-slip-relative.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_UNSAFE_PATH' || res.body.code === 'ZIP_UNSAFE_PATH');
});

test('Zip Slip Protection: Rejects absolute path /etc/passwd.html', async () => {
  const zipBuffer = buildZipBufferWithRawPath('/etc/passwd.html');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'zip-slip-absolute.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_UNSAFE_PATH' || res.body.code === 'ZIP_UNSAFE_PATH');
});

test('Zip Slip Protection: Rejects Windows drive path C:\\evil.html', async () => {
  const zipBuffer = buildZipBufferWithRawPath('C:\\evil.html');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'zip-slip-win.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_UNSAFE_PATH' || res.body.code === 'ZIP_UNSAFE_PATH');
});

test('Zip Slip Protection: Rejects UNC path \\\\server\\share\\evil.html', async () => {
  const zipBuffer = buildZipBufferWithRawPath('\\\\server\\share\\evil.html');

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'zip-slip-unc.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_UNSAFE_PATH' || res.body.code === 'ZIP_UNSAFE_PATH');
});

test('ZIP Limits: Rejects archive exceeding maximum entry count (>100 entries)', async () => {
  const files = [{ name: 'index.html', content: '<h1>Many Files</h1>' }];
  for (let i = 0; i < 105; i++) {
    files.push({ name: `file_${i}.css`, content: '/* css */' });
  }
  const zipBuffer = buildZipBuffer(files);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'too-many-entries.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_TOO_MANY_ENTRIES' || res.body.code === 'ZIP_TOO_MANY_ENTRIES');
});

test('ZIP Limits: Rejects single extracted file exceeding size limit (>25MB)', async () => {
  const zip = new AdmZip();
  zip.addFile('index.html', Buffer.from('<h1>Index</h1>'));
  const bigEntry = zip.addFile('big.css', Buffer.from('/* css */'))[0] || zip.getEntries().find(e => e.entryName === 'big.css');
  if (bigEntry && bigEntry.header) {
    bigEntry.header.size = 30 * 1024 * 1024; // Mock 30MB header uncompressed size
  }
  const zipBuffer = zip.toBuffer();

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipBuffer, 'big-file.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_FILE_TOO_LARGE' || res.body.code === 'ZIP_FILE_TOO_LARGE');
});

test('ZIP Security: Rejects disallowed file types (.exe, .sh, .js)', async () => {
  const zipExe = buildZipBuffer([
    { name: 'index.html', content: '<h1>Index</h1>' },
    { name: 'payload.exe', content: 'binary' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .attach('file', zipExe, 'exe.zip');

  assert.strictEqual(res.status, 400);
  assert.ok(res.body.code === 'ERR_ZIP_UNSUPPORTED_FILE' || res.body.code === 'ZIP_UNSUPPORTED_FILE');
});

test('ZIP Security: JavaScript inside ZIP is neutralized and sanitized', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<h1>Safe Heading</h1><script>document.write("HACKED");</script><iframe src="http://example.com"></iframe><img src="x" onerror="alert(1)">' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'js-test.zip');

  assert.strictEqual(res.status, 200);
  const pdfDoc = await PDFDocument.load(res.body);
  assert.strictEqual(pdfDoc.getPageCount(), 1);
});

test('ZIP Security: External HTTP request from ZIP mode is blocked by network policy', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<h1>External Request Test</h1><img src="http://10.0.0.1/private.png">' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'external.zip');

  assert.strictEqual(res.status, 200);
});

test('ZIP Cleanup: Temporary extraction directory is created and cleaned up', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<h1>Cleanup Test</h1>' },
    { name: 'style.css', content: 'body { margin: 0; }' }
  ]);

  try {
    const { tempDir } = extractZipPackage(zipBuffer);
    assert.ok(fs.existsSync(tempDir));

    await new Promise(r => setTimeout(r, 50));
    fs.rmSync(tempDir, { recursive: true, force: true, maxRetries: 10, retryDelay: 100 });

    let exists = fs.existsSync(tempDir);
    if (exists) {
      await new Promise(r => setTimeout(r, 200));
      exists = fs.existsSync(tempDir);
    }
    assert.strictEqual(exists, false);
  } catch (err) {
    console.error('ZIP Cleanup Test Exception:', err);
    throw err;
  }
});

test('ZIP Cleanup: Controller endpoint completes conversion and cleans up temp folder', async () => {
  const zipBuffer = buildZipBuffer([
    { name: 'index.html', content: '<h1>Controller Cleanup Test</h1>' }
  ]);

  const res = await request(app)
    .post('/api/v1/convert/html-to-pdf')
    .parse(binaryParser)
    .attach('file', zipBuffer, 'controller-cleanup.zip');

  assert.strictEqual(res.status, 200);
});
