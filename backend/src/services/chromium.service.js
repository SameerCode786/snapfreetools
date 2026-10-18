const fs = require('fs');
const http = require('http');
const path = require('path');
const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const limits = require('../constants/htmlToPdfLimits');
const { validateUrl, isPrivateIp } = require('./ssrfValidator.service');
const { normalizeRenderSettings } = require('../utils/sharedSettingsNormalizer');
const logger = require('../utils/logger');

let browserInstance = null;
let activeCount = 0;
const waitingQueue = [];

/**
 * Creates an ephemeral local HTTP server bound strictly to 127.0.0.1 on an OS-assigned port
 * to serve ONLY the extracted package directory for the current request.
 */
function createPackageServer(tempDir) {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      try {
        const host = req.headers.host || '127.0.0.1';
        const parsedUrl = new URL(req.url, `http://${host}`);
        let reqPath = decodeURIComponent(parsedUrl.pathname);
        if (reqPath.startsWith('/')) reqPath = reqPath.slice(1);

        const safePath = path.normalize(path.join(tempDir, reqPath));
        const relative = path.relative(tempDir, safePath);

        // Path traversal defense in local HTTP server
        if (relative.startsWith('..') || path.isAbsolute(relative)) {
          res.statusCode = 403;
          return res.end('Access Denied');
        }

        if (!fs.existsSync(safePath) || fs.statSync(safePath).isDirectory()) {
          res.statusCode = 404;
          return res.end('Not Found');
        }

        const ext = path.extname(safePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html; charset=utf-8',
          '.htm': 'text/html; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.jpeg': 'image/jpeg',
          '.gif': 'image/gif',
          '.svg': 'image/svg+xml',
          '.webp': 'image/webp',
          '.woff': 'font/woff',
          '.woff2': 'font/woff2',
          '.ttf': 'font/ttf',
          '.otf': 'font/otf',
          '.json': 'application/json; charset=utf-8'
        };

        res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
        res.setHeader('Cache-Control', 'no-store, private');
        const fileStream = fs.createReadStream(safePath);
        fileStream.pipe(res);
      } catch (e) {
        res.statusCode = 500;
        res.end('Server Error');
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      resolve({ server, port });
    });

    server.on('error', (err) => reject(err));
  });
}

function getExecutablePath() {
  if (process.env.CHROMIUM_PATH && fs.existsSync(process.env.CHROMIUM_PATH)) {
    return process.env.CHROMIUM_PATH;
  }
  const candidatePaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium'
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

/**
 * Initialize or get active Puppeteer Browser instance
 */
async function getBrowser() {
  const isConnected = browserInstance && (
    typeof browserInstance.isConnected === 'function' 
      ? browserInstance.isConnected() 
      : Boolean(browserInstance.connected)
  );

  if (isConnected) {
    return browserInstance;
  }

  logger.info('Initializing Puppeteer Chromium browser process...');

  const launchOptions = {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  };

  const sysPath = getExecutablePath();
  if (sysPath) {
    launchOptions.executablePath = sysPath;
  }

  try {
    browserInstance = await puppeteer.launch(launchOptions);
  } catch (err) {
    if (launchOptions.executablePath) {
      delete launchOptions.executablePath;
      browserInstance = await puppeteer.launch(launchOptions);
    } else {
      throw err;
    }
  }

  browserInstance.on('disconnected', () => {
    logger.warn('Puppeteer browser process disconnected.');
    browserInstance = null;
  });

  return browserInstance;
}

/**
 * Acquire concurrency slot or queue request
 */
function acquireSlot() {
  return new Promise((resolve, reject) => {
    if (activeCount < limits.MAX_CONCURRENT_JOBS) {
      activeCount++;
      return resolve();
    }

    if (waitingQueue.length >= limits.MAX_QUEUE_SIZE) {
      const err = new Error('Server busy. Maximum queue limit reached.');
      err.code = 'ERR_SERVER_BUSY';
      err.statusCode = 503;
      return reject(err);
    }

    let timeoutId;
    const queueItem = {
      resolve: () => {
        clearTimeout(timeoutId);
        activeCount++;
        resolve();
      },
      reject: (err) => {
        clearTimeout(timeoutId);
        reject(err);
      }
    };

    timeoutId = setTimeout(() => {
      const idx = waitingQueue.indexOf(queueItem);
      if (idx !== -1) {
        waitingQueue.splice(idx, 1);
      }
      const err = new Error('Request queue timeout.');
      err.code = 'ERR_QUEUE_TIMEOUT';
      err.statusCode = 503;
      reject(err);
    }, limits.QUEUE_TIMEOUT_MS);

    waitingQueue.push(queueItem);
  });
}

/**
 * Release concurrency slot and process next queued item
 */
function releaseSlot() {
  activeCount = Math.max(0, activeCount - 1);
  if (waitingQueue.length > 0) {
    const nextItem = waitingQueue.shift();
    nextItem.resolve();
  }
}

/**
 * Application-level outbound destination validation and request interception are enforced.
 * Chromium's underlying socket/DNS resolution is not kernel-level pinned by this service.
 * 
 * Security Distinction Architecture:
 * 1. Hostname/IP Validation: Resolves A and AAAA DNS records and validates IPs against CIDR blocklists.
 * 2. Request-Level Interception: Uses Puppeteer page.setRequestInterception(true) to inspect outbound requests, redirects, images, stylesheets, fonts, and subresources.
 * 3. Kernel Socket Binding: Low-level C++ socket destination binding is managed by Chromium's network stack below the DevTools protocol layer.
 */
async function configureNetworkPolicy(page, options = {}) {
  const { allowJs = true, isZipMode = false, packagePort = null } = options;

  await page.setRequestInterception(true);

  page.on('request', async (req) => {
    try {
      const reqUrl = req.url();
      const resourceType = req.resourceType();

      // Enforce max redirect chain limit (3 redirects max)
      if (req.redirectChain().length > 3) {
        page._tooManyRedirects = true;
        return req.abort('failed');
      }

      // Check scheme
      let parsed;
      try {
        parsed = new URL(reqUrl);
      } catch (e) {
        return req.abort('failed');
      }

      const protocol = parsed.protocol.toLowerCase();

      // Block dangerous protocols
      if (protocol !== 'http:' && protocol !== 'https:' && protocol !== 'data:') {
        return req.abort('accessdenied');
      }

      // Allow data: URIs for inline images/fonts only if safe
      if (protocol === 'data:') {
        if (reqUrl.startsWith('data:image/') || reqUrl.startsWith('data:font/')) {
          return req.continue();
        }
        return req.abort('accessdenied');
      }

      if (isZipMode) {
        // ZIP mode policy: Only local package server requests (http://127.0.0.1:packagePort) are allowed.
        // Block all external HTTP/HTTPS requests and requests to other local ports.
        if (parsed.hostname === '127.0.0.1' && Number(parsed.port) === packagePort) {
          return req.continue();
        }
        page._externalBlockedInZipMode = true;
        return req.abort('accessdenied');
      }

      // Block external scripts, iframes, objects in HTML modes
      if (!allowJs) {
        if (resourceType === 'script' || resourceType === 'document' || resourceType === 'object' || resourceType === 'media') {
          // Allow main frame document loading
          if (req.isNavigationRequest() && req.frame() === page.mainFrame()) {
            // Main frame navigation proceed to IP check
          } else {
            return req.abort('accessdenied');
          }
        }
      }

      // Validate destination host & IP for network calls
      const validation = await validateUrl(reqUrl);
      if (!validation.valid) {
        page._ssrfBlocked = true;
        return req.abort('accessdenied');
      }

      req.continue();
    } catch (err) {
      req.abort('failed');
    }
  });
}

/**
 * Validate generated PDF buffer structure
 */
async function validatePdfBuffer(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    const err = new Error('Generated PDF buffer is empty.');
    err.code = 'ERR_OUTPUT_INVALID';
    throw err;
  }

  // Check PDF magic header bytes (%PDF-)
  const header = buffer.slice(0, 5).toString('utf-8');
  if (header !== '%PDF-') {
    const err = new Error('Generated output does not have a valid PDF header.');
    err.code = 'ERR_OUTPUT_INVALID';
    throw err;
  }

  try {
    const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
    if (pdfDoc.getPageCount() === 0) {
      const err = new Error('Generated PDF has 0 pages.');
      err.code = 'ERR_OUTPUT_INVALID';
      throw err;
    }
  } catch (err) {
    const pdfErr = new Error(`Failed to parse generated PDF: ${err.message}`);
    pdfErr.code = 'ERR_OUTPUT_INVALID';
    throw pdfErr;
  }
}

/**
 * Execute bounded lazy-loading scroll pass
 */
async function boundedLazyLoad(page) {
  try {
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalDistance = 0;
        const distance = 300;
        const maxDistance = 3000;
        const startTime = Date.now();
        const maxDuration = 2000; // 2 seconds

        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalDistance += distance;

          if (totalDistance >= maxDistance || (Date.now() - startTime) >= maxDuration) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
  } catch (e) {
    // Ignore scroll evaluation errors on unusual pages
  }
}

/**
 * Core PDF Rendering Service Method
 */
async function renderToPdf({ mode, targetUrl, htmlContent, tempDir, selectedHtmlRelativePath, settings = {}, signal }) {
  await acquireSlot();

  let context = null;
  let page = null;
  let packageServerInstance = null;

  try {
    const browser = await getBrowser();
    context = await browser.createBrowserContext();
    page = await context.newPage();

    // Attach signal abort listener
    if (signal) {
      signal.addEventListener('abort', async () => {
        try {
          if (packageServerInstance) packageServerInstance.close();
          if (page && !page.isClosed()) await page.close();
          if (context) await context.close();
        } catch (e) {}
      });
    }

    // Normalize settings using sharedSettingsNormalizer
    const normalized = normalizeRenderSettings(settings);

    // Set viewport dimensions
    await page.setViewport(normalized.viewport);

    // Apply mobile/tablet emulation if specified by viewport preset
    if (normalized.viewport.isMobile) {
      const mobileUa = 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1';
      await page.setUserAgent(mobileUa);
    }

    if (mode === 'url') {
      await page.setJavaScriptEnabled(true);
      await configureNetworkPolicy(page, { allowJs: true, isUrlMode: true });

      // Navigate to target URL
      await page.goto(targetUrl, {
        waitUntil: 'domcontentloaded',
        timeout: limits.NAV_TIMEOUT_MS
      });

      // Bounded network idle opportunity (wait up to 5s max for networkidle2)
      try {
        await page.waitForNetworkIdle({ idleTime: 500, timeout: 5000 });
      } catch (e) {
        // Network didn't go idle within 5s (analytics, websockets, etc.) - continue safely
      }

      // Wait for document.fonts.ready
      try {
        await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());
      } catch (e) {}

      // Bounded lazy-load pass
      await boundedLazyLoad(page);

    } else if (mode === 'zip') {
      // Ephemeral Local Package HTTP Server
      const { server, port } = await createPackageServer(tempDir);
      packageServerInstance = server;

      await page.setJavaScriptEnabled(false);
      await configureNetworkPolicy(page, { allowJs: false, isZipMode: true, packagePort: port });

      const packageUrl = `http://127.0.0.1:${port}/${selectedHtmlRelativePath.split('/').map(encodeURIComponent).join('/')}`;
      await page.goto(packageUrl, {
        waitUntil: 'domcontentloaded',
        timeout: limits.NAV_TIMEOUT_MS
      });

      // Wait for fonts if available
      try {
        await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());
      } catch (e) {}

    } else {
      // Pasted or Uploaded HTML mode
      await page.setJavaScriptEnabled(false);
      await configureNetworkPolicy(page, { allowJs: false, isUrlMode: false });

      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded',
        timeout: limits.NAV_TIMEOUT_MS
      });

      // Wait for fonts if available
      try {
        await page.evaluate(() => document.fonts ? document.fonts.ready : Promise.resolve());
      } catch (e) {}
    }

    // Emulate media type (print or screen)
    await page.emulateMediaType(normalized.mediaType);

    // Build Puppeteer PDF Options
    let pdfOptions;

    if (normalized.isOneLongPage) {
      const contentHeightPx = await page.evaluate(() => Math.max(
        document.body ? document.body.scrollHeight : 0,
        document.documentElement ? document.documentElement.scrollHeight : 0,
        document.body ? document.body.offsetHeight : 0,
        document.documentElement ? document.documentElement.offsetHeight : 0
      ));

      const MAX_ONE_LONG_PAGE_HEIGHT_PX = 15000;

      if (contentHeightPx > MAX_ONE_LONG_PAGE_HEIGHT_PX) {
        const err = new Error(`Content height (${contentHeightPx}px) exceeds maximum allowed continuous height limit of ${MAX_ONE_LONG_PAGE_HEIGHT_PX}px for One Long Page mode.`);
        err.code = 'ERR_ONE_LONG_PAGE_EXCEEDED';
        err.statusCode = 400;
        throw err;
      }

      const targetHeightPx = Math.max(contentHeightPx, normalized.viewport.height || 800);

      pdfOptions = {
        width: `${normalized.viewport.width}px`,
        height: `${targetHeightPx}px`,
        landscape: false,
        margin: {
          top: '0mm',
          right: normalized.margins.right,
          bottom: '0mm',
          left: normalized.margins.left
        },
        scale: normalized.scale,
        printBackground: normalized.printBackground,
        preferCSSPageSize: false,
        displayHeaderFooter: normalized.showFooter,
        pageRanges: '1',
        footerTemplate: normalized.showFooter ? `
          <div style="font-size:9px; font-family:sans-serif; width:100%; text-align:center; color:#666; margin-bottom:5px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        ` : ''
      };
    } else {
      pdfOptions = {
        format: normalized.pageSize,
        landscape: normalized.orientation === 'landscape',
        margin: normalized.margins,
        scale: normalized.scale,
        printBackground: normalized.printBackground,
        preferCSSPageSize: normalized.respectCssPageSize,
        displayHeaderFooter: normalized.showFooter,
        footerTemplate: normalized.showFooter ? `
          <div style="font-size:9px; font-family:sans-serif; width:100%; text-align:center; color:#666; margin-bottom:5px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        ` : ''
      };
    }

    if (normalized.pageRanges && normalized.pageRanges.trim() !== '') {
      pdfOptions.pageRanges = normalized.pageRanges.trim();
    }

    // Render PDF Buffer
    const rawBuffer = await page.pdf(pdfOptions);
    const pdfBuffer = Buffer.from(rawBuffer);

    // Validate PDF output structure
    await validatePdfBuffer(pdfBuffer);

    return pdfBuffer;

  } catch (err) {
    logger.error('Chromium rendering failed', { error: err.message, mode, targetUrl });
    
    if (page && page._tooManyRedirects) {
      err.code = 'ERR_TOO_MANY_REDIRECTS';
      err.statusCode = 400;
      err.message = 'Maximum redirect chain limit (3 redirects) exceeded.';
    } else if (page && page._ssrfBlocked) {
      err.code = 'ERR_SSRF_BLOCKED';
      err.statusCode = 400;
      err.message = 'Access to private or restricted network destination is blocked.';
    } else if (err.message && (err.message.includes('ERR_ACCESS_DENIED') || err.message.includes('accessdenied'))) {
      err.code = 'ERR_SSRF_BLOCKED';
      err.statusCode = 400;
    } else if (err.message && (err.message.includes('ERR_TOO_MANY_REDIRECTS') || err.message.includes('toomanyredirects'))) {
      err.code = 'ERR_TOO_MANY_REDIRECTS';
      err.statusCode = 400;
    } else if (!err.code) {
      err.code = 'ERR_PDF_GENERATION_FAILED';
    }
    throw err;
  } finally {
    if (packageServerInstance) {
      try {
        packageServerInstance.close();
      } catch (e) {}
    }
    try {
      if (page && !page.isClosed()) await page.close();
      if (context) await context.close();
    } catch (e) {}
    releaseSlot();
  }
}

module.exports = {
  getBrowser,
  renderToPdf,
  validatePdfBuffer
};
