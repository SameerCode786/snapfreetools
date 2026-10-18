module.exports = {
  MAX_HTML_SIZE_BYTES: process.env.HTML_TO_PDF_MAX_HTML_SIZE_BYTES 
    ? parseInt(process.env.HTML_TO_PDF_MAX_HTML_SIZE_BYTES, 10) 
    : 10 * 1024 * 1024, // 10 MB
  MAX_FILE_SIZE_MB: process.env.HTML_TO_PDF_MAX_FILE_SIZE_MB 
    ? parseInt(process.env.HTML_TO_PDF_MAX_FILE_SIZE_MB, 10) 
    : 10,
  TIMEOUT_MS: process.env.HTML_TO_PDF_TIMEOUT_MS 
    ? parseInt(process.env.HTML_TO_PDF_TIMEOUT_MS, 10) 
    : 25000, // 25s total rendering timeout
  NAV_TIMEOUT_MS: process.env.HTML_TO_PDF_NAV_TIMEOUT_MS 
    ? parseInt(process.env.HTML_TO_PDF_NAV_TIMEOUT_MS, 10) 
    : 15000, // 15s page navigation timeout
  RATE_LIMIT_WINDOW_MINUTES: process.env.HTML_TO_PDF_RATE_LIMIT_WINDOW_MINUTES 
    ? parseInt(process.env.HTML_TO_PDF_RATE_LIMIT_WINDOW_MINUTES, 10) 
    : 15,
  RATE_LIMIT_MAX_REQUESTS: process.env.HTML_TO_PDF_RATE_LIMIT_MAX_REQUESTS 
    ? parseInt(process.env.HTML_TO_PDF_RATE_LIMIT_MAX_REQUESTS, 10) 
    : 5,
  MAX_CONCURRENT_JOBS: process.env.HTML_TO_PDF_MAX_CONCURRENT_JOBS 
    ? parseInt(process.env.HTML_TO_PDF_MAX_CONCURRENT_JOBS, 10) 
    : 3,
  MAX_QUEUE_SIZE: process.env.HTML_TO_PDF_MAX_QUEUE_SIZE 
    ? parseInt(process.env.HTML_TO_PDF_MAX_QUEUE_SIZE, 10) 
    : 10,
  QUEUE_TIMEOUT_MS: process.env.HTML_TO_PDF_QUEUE_TIMEOUT_MS 
    ? parseInt(process.env.HTML_TO_PDF_QUEUE_TIMEOUT_MS, 10) 
    : 15000,
  ALLOWED_FILE_EXTENSIONS: ['.html', '.htm', '.zip'],
  MAX_ZIP_SIZE_BYTES: process.env.HTML_TO_PDF_MAX_ZIP_SIZE_BYTES
    ? parseInt(process.env.HTML_TO_PDF_MAX_ZIP_SIZE_BYTES, 10)
    : 25 * 1024 * 1024, // 25 MB
  MAX_ZIP_EXTRACTED_BYTES: 100 * 1024 * 1024, // 100 MB
  MAX_ZIP_ENTRY_COUNT: 100,
  MAX_ZIP_SINGLE_FILE_BYTES: 25 * 1024 * 1024, // 25 MB
  ALLOWED_ASSET_EXTENSIONS: [
    '.html', '.htm', '.css',
    '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp',
    '.woff', '.woff2', '.ttf', '.otf', '.json'
  ]
};
