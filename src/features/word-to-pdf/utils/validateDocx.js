import { MAX_FILE_SIZE_BYTES, ERROR_MESSAGES } from "../constants";

export async function validateDocxFile(file) {
  if (!file) {
    throw new Error("No file selected.");
  }

  const nameLower = file.name.toLowerCase();

  // 1. Extension check
  if (nameLower.endsWith(".doc")) {
    throw new Error(ERROR_MESSAGES.LEGACY_DOC_NOT_SUPPORTED);
  }

  if (!nameLower.endsWith(".docx")) {
    throw new Error(ERROR_MESSAGES.INVALID_EXTENSION);
  }

  // 2. Size limit
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(ERROR_MESSAGES.FILE_TOO_LARGE);
  }

  // 3. Header magic number check (ZIP signature: PK\x03\x04)
  const headerSlice = file.slice(0, 4);
  const headerBuffer = await headerSlice.arrayBuffer();
  const bytes = new Uint8Array(headerBuffer);

  if (bytes.length < 4 || bytes[0] !== 0x50 || bytes[1] !== 0x4B || bytes[2] !== 0x03 || bytes[3] !== 0x04) {
    throw new Error(ERROR_MESSAGES.CORRUPTED_DOCX);
  }

  // 4. JSZip archive inspection for OpenXML entries
  try {
    const JSZip = (await import("jszip")).default;
    const fileBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(fileBuffer);

    const hasContentTypes = Object.keys(zip.files).some(
      (name) => name.toLowerCase() === "[content_types].xml"
    );
    const hasWordDocument = Object.keys(zip.files).some(
      (name) => name.toLowerCase() === "word/document.xml"
    );

    if (!hasContentTypes || !hasWordDocument) {
      throw new Error(ERROR_MESSAGES.INVALID_STRUCTURE);
    }
  } catch (err) {
    if (err.message && err.message.includes("encrypted")) {
      throw new Error(ERROR_MESSAGES.PASSWORD_PROTECTED);
    }
    if (err.message && Object.values(ERROR_MESSAGES).includes(err.message)) {
      throw err;
    }
    throw new Error(ERROR_MESSAGES.CORRUPTED_DOCX);
  }

  return true;
}
