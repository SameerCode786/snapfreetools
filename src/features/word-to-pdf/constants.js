export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_PAGES_DESKTOP = 20;
export const MAX_PAGES_MOBILE = 15;

export const STAGES = {
  IDLE: "idle",
  LOADING_ENGINE: "Loading conversion engine...",
  READING_FILE: "Reading Word document...",
  PREPARING_PAGES: "Preparing page layout...",
  CONVERTING_PAGE: "Converting page",
  COMPILING_PDF: "Compiling PDF document...",
  COMPLETED: "completed",
  ERROR: "error",
  CANCELLED: "cancelled"
};

export const ERROR_MESSAGES = {
  INVALID_EXTENSION: "Invalid file type. Only Microsoft Word (.docx) documents are supported.",
  LEGACY_DOC_NOT_SUPPORTED: "Legacy binary .doc files are not supported. Please save your file as .docx in Microsoft Word and try again.",
  FILE_TOO_LARGE: "File is too large. Maximum supported size is 10MB.",
  CORRUPTED_DOCX: "The document appears to be corrupted or invalid.",
  INVALID_STRUCTURE: "The file is not a valid OpenXML Word document (missing word/document.xml).",
  PASSWORD_PROTECTED: "Password-protected documents cannot be converted in the browser.",
  TOO_MANY_PAGES: "This document contains too many pages for safe browser-based conversion. Please use a document under 20 pages.",
  MOBILE_TOO_MANY_PAGES: "This document contains too many pages for mobile conversion. Please use a document under 15 pages or switch to desktop.",
  CANVAS_FAILED: "Browser canvas allocation failed. Your device may be low on memory.",
  CONVERSION_FAILED: "An unexpected error occurred during conversion. Please try again."
};
