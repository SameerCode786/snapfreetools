/**
 * Frontend Validation Utilities for HTML to PDF Converter
 */

export const MAX_HTML_SIZE_MB = 10;
export const MAX_HTML_SIZE_BYTES = MAX_HTML_SIZE_MB * 1024 * 1024;
export const ALLOWED_EXTENSIONS = ['.html', '.htm'];

export const MAX_ZIP_SIZE_MB = 25;
export const MAX_ZIP_SIZE_BYTES = MAX_ZIP_SIZE_MB * 1024 * 1024;
export const ALLOWED_ZIP_EXTENSIONS = ['.zip'];

const MARGIN_REGEX = /^\d+(\.\d+)?(mm|cm|in|px)?$/i;

/**
 * Validate URL Mode Input
 * @param {string} url 
 * @returns {{ valid: boolean, error?: string, sanitizedUrl?: string }}
 */
export function validateUrlInput(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return { valid: false, error: 'Please enter a webpage URL.' };
  }

  const trimmed = url.trim();

  // Reject explicit user credentials in raw URL input
  if (/@/.test(trimmed)) {
    return { valid: false, error: 'Embedded user credentials in URLs are not permitted.' };
  }

  let parsed;
  try {
    const hasScheme = /^[a-z0-9+-.]+:\/\//i.test(trimmed);
    const withProtocol = hasScheme ? trimmed : `https://${trimmed}`;
    parsed = new URL(withProtocol);
  } catch (e) {
    return { valid: false, error: 'Please enter a valid URL (e.g. https://example.com).' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS web addresses are supported.' };
  }

  if (parsed.username || parsed.password) {
    return { valid: false, error: 'Embedded user credentials in URLs are not permitted.' };
  }

  if (!parsed.hostname || parsed.hostname.length < 3 || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
    return { valid: false, error: 'Please enter a valid domain name.' };
  }

  return { valid: true, sanitizedUrl: parsed.toString() };
}

/**
 * Validate HTML Paste Input
 * @param {string} htmlContent 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePasteInput(htmlContent) {
  if (!htmlContent || typeof htmlContent !== 'string' || htmlContent.trim() === '') {
    return { valid: false, error: 'Please paste or enter HTML markup to convert.' };
  }

  const encoder = new TextEncoder();
  const byteLength = encoder.encode(htmlContent).length;

  if (byteLength > MAX_HTML_SIZE_BYTES) {
    return {
      valid: false,
      error: `HTML content size (${(byteLength / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${MAX_HTML_SIZE_MB}MB.`
    };
  }

  return { valid: true };
}

/**
 * Validate Uploaded File Input
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateUploadFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select an HTML file to upload.' };
  }

  const filename = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_EXTENSIONS.some(ext => filename.endsWith(ext));

  if (!hasValidExt) {
    return { valid: false, error: 'Invalid file type. Only .html and .htm files are supported.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty.' };
  }

  if (file.size > MAX_HTML_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${MAX_HTML_SIZE_MB}MB.`
    };
  }

  return { valid: true };
}

/**
 * Validate Uploaded ZIP File Input
 * @param {File} file 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateZipFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select a ZIP file to upload.' };
  }

  const filename = (file.name || '').toLowerCase();
  const hasValidExt = ALLOWED_ZIP_EXTENSIONS.some(ext => filename.endsWith(ext));

  if (!hasValidExt) {
    return { valid: false, error: 'Invalid file type. Only .zip files are supported in ZIP package mode.' };
  }

  if (file.size === 0) {
    return { valid: false, error: 'The selected ZIP file is empty.' };
  }

  if (file.size > MAX_ZIP_SIZE_BYTES) {
    return {
      valid: false,
      error: `ZIP file size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum limit of ${MAX_ZIP_SIZE_MB}MB.`
    };
  }

  return { valid: true };
}

/**
 * Validate PDF options settings object against backend schema
 * @param {Object} settings 
 * @returns {{ valid: boolean, error?: string }}
 */
export function validatePdfSettings(settings = {}) {
  const allowedSizes = ['A4', 'Letter', 'Legal', 'A3', 'A5', 'OneLongPage'];
  if (settings.pageSize && !allowedSizes.includes(settings.pageSize)) {
    return { valid: false, error: 'Invalid page size selection.' };
  }

  const allowedScreenSizes = ['your_screen', 'desktop_hd', 'desktop', 'tablet', 'mobile'];
  if (settings.screenSize && !allowedScreenSizes.includes(settings.screenSize)) {
    return { valid: false, error: 'Invalid screen size selection.' };
  }

  if (settings.screenSize === 'your_screen' && settings.customScreenWidth !== undefined) {
    if (typeof settings.customScreenWidth !== 'number' || !Number.isInteger(settings.customScreenWidth) || settings.customScreenWidth < 320 || settings.customScreenWidth > 2560) {
      return { valid: false, error: 'Custom screen width must be an integer between 320 and 2560.' };
    }
  }

  const allowedMarginPresets = ['none', 'small', 'big', 'custom'];
  if (settings.marginPreset && !allowedMarginPresets.includes(settings.marginPreset)) {
    return { valid: false, error: 'Invalid margin preset selection.' };
  }

  const allowedOrientations = ['portrait', 'landscape'];
  if (settings.orientation && !allowedOrientations.includes(settings.orientation)) {
    return { valid: false, error: 'Invalid page orientation selection.' };
  }

  const allowedMediaTypes = ['print', 'screen'];
  if (settings.mediaType && !allowedMediaTypes.includes(settings.mediaType)) {
    return { valid: false, error: 'Invalid media type selection.' };
  }

  if (typeof settings.scale === 'number') {
    if (!Number.isFinite(settings.scale) || settings.scale < 0.1 || settings.scale > 2.0) {
      return { valid: false, error: 'Scale must be between 0.1 and 2.0.' };
    }
  }

  for (const marginKey of ['marginTop', 'marginRight', 'marginBottom', 'marginLeft']) {
    if (settings[marginKey] && !MARGIN_REGEX.test(settings[marginKey])) {
      return { valid: false, error: `Invalid margin format for ${marginKey}.` };
    }
  }

  return { valid: true };
}

/**
 * Sanitize filename for PDF download
 * @param {string} inputName 
 * @param {string} defaultName 
 * @returns {string}
 */
export function sanitizeDownloadFilename(inputName, defaultName = 'html-to-pdf.pdf') {
  if (!inputName || typeof inputName !== 'string') return defaultName;

  let clean = inputName
    .replace(/^https?:\/\//i, '')
    .replace(/\.\./g, '')
    .replace(/[^a-zA-Z0-9.\-_]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!clean) return defaultName;

  if (!clean.toLowerCase().endsWith('.pdf')) {
    clean += '.pdf';
  }

  return clean;
}
