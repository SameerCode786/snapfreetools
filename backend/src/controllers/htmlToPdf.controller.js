const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const { htmlToPdfSchema } = require('../validators/htmlToPdf.validator');
const { validateUrl } = require('../services/ssrfValidator.service');
const { renderToPdf } = require('../services/chromium.service');
const { extractZipPackage } = require('../services/zipExtractor.service');
const logger = require('../utils/logger');
const limits = require('../constants/htmlToPdfLimits');

/**
 * Configure sanitize-html options for uploaded/pasted HTML
 */
const sanitizeOptions = {
  allowVulnerableTags: true,
  allowedTags: [
    'html', 'head', 'body', 'meta', 'title', 'style', 'link',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
    'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'span',
    'img', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside',
    'figure', 'figcaption', 'details', 'summary', 'mark', 'time', 'small'
  ],
  allowedAttributes: {
    '*': ['style', 'class', 'id', 'dir', 'lang', 'title', 'width', 'height', 'align', 'valign'],
    'a': ['href', 'name', 'target', 'rel'],
    'img': ['src', 'alt', 'width', 'height', 'loading'],
    'link': ['rel', 'href', 'type', 'media'],
    'meta': ['charset', 'name', 'content']
  },
  allowedSchemes: ['http', 'https', 'data'],
  allowedSchemesByTag: {
    img: ['http', 'https', 'data']
  },
  disallowedTagsMode: 'discard',
  exclusiveFilter: (frame) => {
    return ['script', 'iframe', 'object', 'embed', 'applet', 'base', 'form', 'button', 'input'].includes(frame.tag);
  }
};

/**
 * Main Controller Handler for POST /api/v1/convert/html-to-pdf
 */
async function convert(req, res) {
  const startTime = Date.now();
  const abortController = new AbortController();
  let zipTempDir = null;

  // Attach idempotent abort handling on client disconnect
  let isCompleted = false;
  req.on('close', () => {
    if (!isCompleted && !res.writableEnded) {
      abortController.abort();
    }
  });

  try {
    // 1. Zod Body Validation
    const validationResult = htmlToPdfSchema.safeParse(req.body);
    if (!validationResult.success) {
      const issue = validationResult.error.issues[0];
      return res.status(400).json({
        success: false,
        code: 'ERR_INVALID_REQUEST',
        message: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid request payload'
      });
    }

    const { mode, url, htmlContent, settings } = validationResult.data;

    let targetUrl = null;
    let sanitizedHtml = null;
    let selectedHtmlRelativePath = null;

    // 2. Mode-Specific Validations & Processing
    if (mode === 'url') {
      const urlValidation = await validateUrl(url);
      if (!urlValidation.valid) {
        return res.status(400).json({
          success: false,
          code: urlValidation.code || 'ERR_INVALID_URL',
          message: urlValidation.message
        });
      }
      targetUrl = urlValidation.parsedUrl.toString();
    } else if (mode === 'zip') {
      if (!req.file || !req.file.buffer) {
        return res.status(400).json({
          success: false,
          code: 'ERR_ZIP_REQUIRED',
          message: 'ZIP package file is required for zip mode.'
        });
      }
      const zipExtracted = extractZipPackage(req.file.buffer);
      zipTempDir = zipExtracted.tempDir;
      selectedHtmlRelativePath = zipExtracted.selectedHtmlRelativePath;
    } else {
      // html_paste or html_upload mode
      if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim() === '') {
        return res.status(400).json({
          success: false,
          code: 'ERR_INVALID_REQUEST',
          message: 'HTML content is empty.'
        });
      }

      if (Buffer.byteLength(htmlContent, 'utf-8') > limits.MAX_HTML_SIZE_BYTES) {
        return res.status(400).json({
          success: false,
          code: 'ERR_FILE_TOO_LARGE',
          message: `HTML content exceeds maximum allowed limit of ${limits.MAX_FILE_SIZE_MB}MB.`
        });
      }

      // Sanitize raw HTML markup
      sanitizedHtml = sanitizeHtml(htmlContent, sanitizeOptions);
    }

    // 3. Render to PDF via Chromium Service
    let pdfBuffer;
    try {
      pdfBuffer = await renderToPdf({
        mode,
        targetUrl,
        htmlContent: sanitizedHtml,
        tempDir: zipTempDir,
        selectedHtmlRelativePath,
        settings,
        signal: abortController.signal
      });
    } finally {
      if (zipTempDir) {
        try {
          if (fs.existsSync(zipTempDir)) {
            fs.rmSync(zipTempDir, { recursive: true, force: true });
          }
        } catch (e) {}
        zipTempDir = null;
      }
    }

    isCompleted = true;

    // 4. Log Operational Metadata (No sensitive content or buffers logged)
    const durationMs = Date.now() - startTime;
    logger.info('HTML to PDF conversion completed', {
      mode,
      domain: targetUrl ? new URL(targetUrl).hostname : 'local_html',
      durationMs,
      pdfSizeBytes: pdfBuffer.length
    });

    // 5. Send PDF Stream Response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="converted-document.pdf"');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Content-Length', pdfBuffer.length);

    return res.status(200).send(pdfBuffer);

  } catch (err) {
    if (zipTempDir) {
      try {
        if (fs.existsSync(zipTempDir)) {
          fs.rmSync(zipTempDir, { recursive: true, force: true });
        }
      } catch (e) {}
      zipTempDir = null;
    }

    isCompleted = true;
    const durationMs = Date.now() - startTime;
    logger.error('HTML to PDF conversion error', { error: err.message, code: err.code, durationMs });

    const isBadRequest = err.statusCode === 400 || (
      err.code && (
        err.code.startsWith('ERR_ZIP_') ||
        err.code.startsWith('ZIP_') ||
        err.code === 'ERR_INVALID_URL' ||
        err.code === 'ERR_SSRF_BLOCKED' ||
        err.code === 'ERR_INVALID_REQUEST' ||
        err.code === 'ERR_UNSUPPORTED_EXTENSION' ||
        err.code === 'ERR_FILE_TOO_LARGE' ||
        err.code === 'ERR_EMPTY_FILE'
      )
    );

    const statusCode = isBadRequest ? 400 : (err.statusCode || 500);

    return res.status(statusCode).json({
      success: false,
      code: err.code || 'ERR_PDF_GENERATION_FAILED',
      message: err.message || 'Failed to generate PDF document.'
    });
  }
}

module.exports = {
  convert
};
