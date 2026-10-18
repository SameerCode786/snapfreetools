const fs = require('fs');
const path = require('path');
const os = require('os');
const AdmZip = require('adm-zip');
const sanitizeHtml = require('sanitize-html');
const limits = require('../constants/htmlToPdfLimits');

/**
 * Configure sanitize-html options for ZIP HTML entry
 */
const zipSanitizeOptions = {
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

const DISALLOWED_EXTENSIONS = [
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.ps1', '.js', '.mjs', '.cjs',
  '.php', '.py', '.rb', '.jsp', '.asp', '.cgi', '.vbs', '.jar', '.com', '.scr'
];

/**
 * Validates, extracts, and sanitizes a ZIP package safely into an ephemeral temporary directory.
 */
function extractZipPackage(zipBuffer) {
  if (!zipBuffer || !Buffer.isBuffer(zipBuffer) || zipBuffer.length === 0) {
    const err = new Error('ZIP file buffer is empty or missing.');
    err.code = 'ERR_ZIP_INVALID';
    err.statusCode = 400;
    throw err;
  }

  if (zipBuffer.length > limits.MAX_ZIP_SIZE_BYTES) {
    const err = new Error(`ZIP package size exceeds limit of ${limits.MAX_ZIP_SIZE_BYTES / (1024 * 1024)}MB.`);
    err.code = 'ERR_ZIP_TOO_LARGE';
    err.statusCode = 400;
    throw err;
  }

  let zip;
  try {
    zip = new AdmZip(zipBuffer);
  } catch (e) {
    const err = new Error('Invalid or corrupted ZIP archive.');
    err.code = 'ERR_ZIP_INVALID';
    err.statusCode = 400;
    throw err;
  }

  let entries;
  try {
    entries = zip.getEntries();
  } catch (e) {
    const err = new Error('Failed to read ZIP entries.');
    err.code = 'ERR_ZIP_INVALID';
    err.statusCode = 400;
    throw err;
  }

  if (!entries || entries.length === 0) {
    const err = new Error('ZIP archive is empty.');
    err.code = 'ERR_ZIP_INVALID';
    err.statusCode = 400;
    throw err;
  }

  if (entries.length > limits.MAX_ZIP_ENTRY_COUNT) {
    const err = new Error(`ZIP package contains ${entries.length} entries, exceeding maximum limit of ${limits.MAX_ZIP_ENTRY_COUNT}.`);
    err.code = 'ERR_ZIP_TOO_MANY_ENTRIES';
    err.statusCode = 400;
    throw err;
  }

  let totalExtractedBytes = 0;
  const safeEntries = [];
  const htmlEntries = [];

  // Pass 1: Security Validation & Path Verification
  for (const entry of entries) {
    const rawName = entry.entryName || '';
    const normalizedPath = rawName.replace(/\\/g, '/');

    // Path Traversal & Unsafe Paths Checks
    const segments = normalizedPath.split('/');
    if (
      segments.includes('..') ||
      normalizedPath.includes('../') ||
      normalizedPath.includes('/..') ||
      normalizedPath.startsWith('/') ||
      normalizedPath.startsWith('\\') ||
      /^[a-zA-Z]:/.test(normalizedPath) ||
      normalizedPath.startsWith('//') ||
      normalizedPath.startsWith('\\\\') ||
      normalizedPath.includes('\0')
    ) {
      const err = new Error(`Unsafe path traversal detected in ZIP entry: ${rawName}`);
      err.code = 'ERR_ZIP_UNSAFE_PATH';
      err.statusCode = 400;
      throw err;
    }

    // Symlink / Link entry detection check
    if (entry.attr && (entry.attr & 0o120000) === 0o120000) {
      const err = new Error(`Symlink entries are not allowed in ZIP package: ${rawName}`);
      err.code = 'ERR_ZIP_UNSAFE_PATH';
      err.statusCode = 400;
      throw err;
    }

    if (entry.isDirectory) {
      safeEntries.push({ entry, normalizedPath, isDirectory: true });
      continue;
    }

    const uncompressedSize = entry.header ? entry.header.size : 0;
    if (uncompressedSize > limits.MAX_ZIP_SINGLE_FILE_BYTES) {
      const err = new Error(`ZIP entry ${rawName} size (${Math.round(uncompressedSize / 1024 / 1024)}MB) exceeds max single file limit of 25MB.`);
      err.code = 'ERR_ZIP_FILE_TOO_LARGE';
      err.statusCode = 400;
      throw err;
    }

    totalExtractedBytes += uncompressedSize;
    if (totalExtractedBytes > limits.MAX_ZIP_EXTRACTED_BYTES) {
      const err = new Error(`ZIP total uncompressed size exceeds maximum allowed limit of ${limits.MAX_ZIP_EXTRACTED_BYTES / (1024 * 1024)}MB.`);
      err.code = 'ERR_ZIP_EXTRACTED_SIZE_LIMIT';
      err.statusCode = 400;
      throw err;
    }

    const ext = path.extname(normalizedPath).toLowerCase();
    if (DISALLOWED_EXTENSIONS.includes(ext)) {
      const err = new Error(`ZIP package contains disallowed file type: ${ext}`);
      err.code = 'ERR_ZIP_UNSUPPORTED_FILE';
      err.statusCode = 400;
      throw err;
    }

    if (!limits.ALLOWED_ASSET_EXTENSIONS.includes(ext)) {
      const err = new Error(`File extension ${ext} is not allowed in ZIP package.`);
      err.code = 'ERR_ZIP_UNSUPPORTED_FILE';
      err.statusCode = 400;
      throw err;
    }

    if (ext === '.html' || ext === '.htm') {
      htmlEntries.push(normalizedPath);
    }

    safeEntries.push({ entry, normalizedPath, isDirectory: false });
  }

  // Pass 2: Select Main HTML Entry
  if (htmlEntries.length === 0) {
    const err = new Error('ZIP archive does not contain any valid index.html or index.htm entry.');
    err.code = 'ERR_ZIP_NO_HTML';
    err.statusCode = 400;
    throw err;
  }

  let selectedHtmlPath = null;
  // 1. Root index.html
  selectedHtmlPath = htmlEntries.find(p => p.toLowerCase() === 'index.html');
  // 2. Nested index.html
  if (!selectedHtmlPath) {
    selectedHtmlPath = htmlEntries.find(p => p.toLowerCase().endsWith('/index.html'));
  }
  // 3. Root index.htm
  if (!selectedHtmlPath) {
    selectedHtmlPath = htmlEntries.find(p => p.toLowerCase() === 'index.htm');
  }
  // 4. Nested index.htm
  if (!selectedHtmlPath) {
    selectedHtmlPath = htmlEntries.find(p => p.toLowerCase().endsWith('/index.htm'));
  }

  if (!selectedHtmlPath) {
    const err = new Error('ZIP package must contain index.html or index.htm.');
    err.code = 'ERR_ZIP_NO_HTML';
    err.statusCode = 400;
    throw err;
  }

  // Pass 3: Create Temp Directory & Safely Extract Files
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'html-to-pdf-zip-'));

  try {
    for (const item of safeEntries) {
      const targetPath = path.normalize(path.join(tempDir, item.normalizedPath));
      const relative = path.relative(tempDir, targetPath);

      if (relative.startsWith('..') || path.isAbsolute(relative)) {
        const err = new Error(`Zip Slip path traversal blocked: ${item.normalizedPath}`);
        err.code = 'ERR_ZIP_UNSAFE_PATH';
        err.statusCode = 400;
        throw err;
      }

      if (item.isDirectory) {
        fs.mkdirSync(targetPath, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        const content = item.entry.getData();
        fs.writeFileSync(targetPath, content);
      }
    }

    // Pass 4: Sanitize Selected HTML Entry
    const fullHtmlPath = path.join(tempDir, selectedHtmlPath);
    if (fs.existsSync(fullHtmlPath)) {
      const rawHtml = fs.readFileSync(fullHtmlPath, 'utf-8');
      if (Buffer.byteLength(rawHtml, 'utf-8') > limits.MAX_HTML_SIZE_BYTES) {
        const err = new Error(`Selected HTML entry exceeds size limit of ${limits.MAX_FILE_SIZE_MB}MB.`);
        err.code = 'ERR_FILE_TOO_LARGE';
        err.statusCode = 400;
        throw err;
      }
      const sanitized = sanitizeHtml(rawHtml, zipSanitizeOptions);
      fs.writeFileSync(fullHtmlPath, sanitized, 'utf-8');
    }

    return {
      tempDir,
      selectedHtmlRelativePath: selectedHtmlPath
    };
  } catch (err) {
    // Clean up tempDir if extraction or sanitization fails
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch (e) {}
    throw err;
  }
}

module.exports = {
  extractZipPackage,
  zipSanitizeOptions
};
