/**
 * API Client Utility for HTML to PDF Converter
 */

const ERROR_MAP = {
  ERR_SSRF_BLOCKED: 'This URL cannot be converted because access to private or restricted network destinations is not allowed.',
  ERR_TOO_MANY_REDIRECTS: 'The webpage redirected too many times (exceeded limit of 3 redirects). Please verify the target URL.',
  ERR_QUEUE_TIMEOUT: 'The conversion server queue timed out due to high load. Please try again in a few moments.',
  ERR_SERVER_BUSY: 'The server is currently busy processing other requests. Please try again shortly.',
  ERR_RENDER_TIMEOUT: 'The webpage took too long to render. Please check if the site is reachable.',
  ERR_UNSUPPORTED_EXTENSION: 'Only .html, .htm, and .zip files are supported.',
  ERR_FILE_TOO_LARGE: 'The HTML content or file exceeds the maximum size limit.',
  ERR_INVALID_URL: 'Please enter a valid, accessible HTTP or HTTPS web address.',
  ERR_UNSUPPORTED_SCHEME: 'Only HTTP and HTTPS URLs are supported.',
  ERR_EMPTY_FILE: 'The selected file is empty.',
  ERR_INVALID_REQUEST: 'Invalid conversion request payload or settings.',
  ERR_ZIP_REQUIRED: 'Please select a ZIP file to upload.',
  ERR_ZIP_INVALID: 'The uploaded ZIP file is invalid or corrupted.',
  ERR_ZIP_TOO_LARGE: 'ZIP file exceeds the maximum 25MB size limit.',
  ERR_ZIP_TOO_MANY_ENTRIES: 'ZIP package contains too many files (maximum 100 entries allowed).',
  ERR_ZIP_EXTRACTED_SIZE_LIMIT: 'ZIP package uncompressed content exceeds the 100MB size limit.',
  ERR_ZIP_FILE_TOO_LARGE: 'An individual file inside the ZIP exceeds the 25MB limit.',
  ERR_ZIP_NO_HTML: 'Your ZIP file does not contain index.html or index.htm.',
  ERR_ZIP_UNSAFE_PATH: 'This ZIP contains unsafe file paths and cannot be processed.',
  ERR_ZIP_UNSUPPORTED_FILE: 'This ZIP contains an unsupported or disallowed file type.',
  ERR_ZIP_RENDER_FAILED: 'Failed to render PDF from the provided ZIP package.',
  ERR_ZIP_TIMEOUT: 'ZIP package conversion timed out.',
  ERR_ZIP_ASSET_BLOCKED: 'An asset request inside the ZIP was blocked for security reasons.'
};

/**
 * Get configured backend API base URL
 */
function getApiEndpoint() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
  const baseUrl = envUrl ? envUrl.replace(/\/$/, '') : 'http://localhost:5000';
  return `${baseUrl}/api/v1/convert/html-to-pdf`;
}

/**
 * Send conversion request to backend API
 * @param {Object} params
 * @param {'url' | 'html_paste' | 'html_upload' | 'zip'} params.mode
 * @param {string} [params.url]
 * @param {string} [params.htmlContent]
 * @param {File} [params.file]
 * @param {Object} [params.settings]
 * @param {AbortSignal} [params.signal]
 * @returns {Promise<Blob>} PDF Blob
 */
export async function convertHtmlToPdf({ mode, url, htmlContent, file, settings = {}, signal }) {
  const endpoint = getApiEndpoint();

  let requestOptions = {
    method: 'POST',
    signal
  };

  if (mode === 'html_upload' || mode === 'zip') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', mode);
    if (settings && Object.keys(settings).length > 0) {
      formData.append('settings', JSON.stringify(settings));
    }
    // Note: Do NOT set Content-Type header manually for FormData
    requestOptions.body = formData;
  } else {
    const payload = {
      mode,
      settings
    };
    if (mode === 'url') payload.url = url;
    if (mode === 'html_paste') payload.htmlContent = htmlContent;

    requestOptions.headers = {
      'Content-Type': 'application/json'
    };
    requestOptions.body = JSON.stringify(payload);
  }

  try {
    const response = await fetch(endpoint, requestOptions);

    if (!response.ok) {
      let errorData = null;
      try {
        errorData = await response.json();
      } catch (e) {
        // Response was not JSON
      }

      const code = errorData?.code;
      const rawMessage = errorData?.message;

      const friendlyMessage = (code && ERROR_MAP[code]) 
        ? ERROR_MAP[code]
        : (rawMessage || `Conversion failed with status ${response.status}.`);

      const err = new Error(friendlyMessage);
      err.code = code || `ERR_HTTP_${response.status}`;
      err.status = response.status;
      throw err;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/pdf')) {
      const err = new Error('Server returned invalid response format (expected PDF).');
      err.code = 'ERR_INVALID_RESPONSE';
      throw err;
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      const err = new Error('Received empty PDF output from server.');
      err.code = 'ERR_EMPTY_OUTPUT';
      throw err;
    }

    return blob;
  } catch (error) {
    if (error.name === 'AbortError') {
      const err = new Error('Conversion was cancelled.');
      err.code = 'CANCELLED';
      throw err;
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      const err = new Error('Unable to connect to conversion server. Please check your network connection.');
      err.code = 'ERR_NETWORK_FAILURE';
      throw err;
    }

    throw error;
  }
}
