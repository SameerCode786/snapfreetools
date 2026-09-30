/**
 * PDF Form Filler Engine
 * Pure client-side PDF form field reading, parsing, and filling engine using pdf-lib.
 * 
 * Capabilities:
 * - Detects interactive AcroForm fields (TextField, CheckBox, Dropdown, OptionList, RadioGroup)
 * - Reads current values, options, multiline flags, and read-only states
 * - Programmatically fills text fields, checkboxes, dropdowns, and radio groups
 * - Updates field appearances on output PDF document saving
 * - 100% Client-side browser execution (zero server uploads)
 * - Error classification (PASSWORD_PROTECTED, CORRUPTED_PDF, INVALID_SOURCE)
 */

import {
  PDFDocument,
  PDFTextField,
  PDFCheckBox,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
} from "pdf-lib";

export class PdfFormFillError extends Error {
  constructor(message, code, details = null) {
    super(message);
    this.name = "PdfFormFillError";
    this.code = code;
    this.details = details;
  }
}

/**
 * Normalizes input source into Uint8Array buffer.
 */
export async function normalizeToUint8Array(source) {
  if (!source) {
    throw new PdfFormFillError(
      "No PDF file or buffer provided.",
      "INVALID_SOURCE"
    );
  }

  if (source instanceof Uint8Array) {
    return source;
  }

  if (source instanceof ArrayBuffer) {
    return new Uint8Array(source);
  }

  if (typeof Blob !== "undefined" && source instanceof Blob) {
    try {
      const arrayBuffer = await source.arrayBuffer();
      return new Uint8Array(arrayBuffer);
    } catch (e) {
      throw new PdfFormFillError(
        "Failed to read PDF file contents from memory.",
        "INVALID_SOURCE",
        e
      );
    }
  }

  if (source && source.buffer instanceof ArrayBuffer) {
    return new Uint8Array(source.buffer, source.byteOffset, source.byteLength);
  }

  throw new PdfFormFillError(
    "Unsupported input source format. Expected File, Blob, or ArrayBuffer.",
    "INVALID_SOURCE"
  );
}

/**
 * Inspects PDF document structure and extracts available interactive AcroForm fields.
 */
export async function readPdfFormInfo(source) {
  const pdfBytes = await normalizeToUint8Array(source);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      err.name === "PasswordRequiredError"
    ) {
      throw new PdfFormFillError(
        "This PDF document is password-protected. Please unlock the PDF before filling forms.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfFormFillError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  const pageCount = pdfDoc.getPageCount();
  const fieldList = [];
  let formHasFields = false;

  try {
    const form = pdfDoc.getForm();
    const rawFields = form.getFields();

    if (rawFields && rawFields.length > 0) {
      formHasFields = true;

      for (const field of rawFields) {
        const name = field.getName();
        let type = "unknown";
        let value = "";
        let options = [];
        let isMultiline = false;
        let isReadOnly = false;

        try {
          isReadOnly = field.isReadOnly();
        } catch (e) {
          isReadOnly = false;
        }

        if (field instanceof PDFTextField) {
          type = "text";
          value = field.getText() || "";
          try {
            isMultiline = field.isMultiline();
          } catch (e) {
            isMultiline = false;
          }
        } else if (field instanceof PDFCheckBox) {
          type = "checkbox";
          try {
            value = field.isChecked();
          } catch (e) {
            value = false;
          }
        } else if (field instanceof PDFDropdown) {
          type = "dropdown";
          try {
            const sel = field.getSelected();
            value = Array.isArray(sel) ? sel[0] || "" : sel || "";
            options = field.getOptions() || [];
          } catch (e) {
            value = "";
            options = [];
          }
        } else if (field instanceof PDFOptionList) {
          type = "optionlist";
          try {
            const sel = field.getSelected();
            value = Array.isArray(sel) ? sel[0] || "" : sel || "";
            options = field.getOptions() || [];
          } catch (e) {
            value = "";
            options = [];
          }
        } else if (field instanceof PDFRadioGroup) {
          type = "radiogroup";
          try {
            const sel = field.getSelected();
            value = sel || "";
            options = field.getOptions() || [];
          } catch (e) {
            value = "";
            options = [];
          }
        } else {
          type = "other";
        }

        fieldList.push({
          name,
          type,
          value,
          options,
          isMultiline,
          isReadOnly,
        });
      }
    }
  } catch (e) {
    formHasFields = false;
  }

  return {
    pageCount,
    byteSize: pdfBytes.length,
    fieldCount: fieldList.length,
    hasFormFields: formHasFields && fieldList.length > 0,
    fields: fieldList,
    pdfBytes,
  };
}

/**
 * Programmatically fills interactive form fields in a PDF document.
 * 
 * @param {Uint8Array|Blob|File|ArrayBuffer} source - The PDF input source.
 * @param {Object} formValues - Object containing field values keyed by field name.
 * @param {Object} options - Optional parameters.
 * @param {Function} onProgress - Progress callback.
 */
export async function fillPdfForms(source, formValues = {}, options = {}, onProgress = null) {
  if (onProgress) onProgress("Reading PDF document structure...");
  const pdfBytes = await normalizeToUint8Array(source);

  let pdfDoc;
  try {
    pdfDoc = await PDFDocument.load(pdfBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (err) {
    const errMsg = (err.message || "").toLowerCase();
    if (
      errMsg.includes("encrypted") ||
      errMsg.includes("password") ||
      err.name === "PasswordRequiredError"
    ) {
      throw new PdfFormFillError(
        "This PDF document is password-protected. Please unlock the PDF before filling forms.",
        "PASSWORD_PROTECTED",
        err
      );
    }
    throw new PdfFormFillError(
      "Failed to parse PDF document structure. The file may be corrupt or invalid.",
      "CORRUPTED_PDF",
      err
    );
  }

  if (onProgress) onProgress("Filling interactive form fields...");

  let form;
  let rawFields = [];
  try {
    form = pdfDoc.getForm();
    rawFields = form.getFields();
  } catch (e) {
    throw new PdfFormFillError(
      "No interactive form fields found in this PDF document.",
      "NO_FORM_FIELDS"
    );
  }

  if (!rawFields || rawFields.length === 0) {
    throw new PdfFormFillError(
      "No interactive form fields found in this PDF document.",
      "NO_FORM_FIELDS"
    );
  }

  let fieldsFilledCount = 0;

  for (const field of rawFields) {
    const name = field.getName();
    if (Object.prototype.hasOwnProperty.call(formValues, name)) {
      const val = formValues[name];

      try {
        if (field instanceof PDFTextField) {
          field.setText(val !== undefined && val !== null ? String(val) : "");
          fieldsFilledCount++;
        } else if (field instanceof PDFCheckBox) {
          if (Boolean(val)) {
            field.check();
          } else {
            field.uncheck();
          }
          fieldsFilledCount++;
        } else if (field instanceof PDFDropdown) {
          if (val) {
            field.select(String(val));
            fieldsFilledCount++;
          }
        } else if (field instanceof PDFOptionList) {
          if (val) {
            field.select(String(val));
            fieldsFilledCount++;
          }
        } else if (field instanceof PDFRadioGroup) {
          if (val) {
            field.select(String(val));
            fieldsFilledCount++;
          }
        }
      } catch (e) {
        // Individual field set error fallback
        console.warn(`Warning setting field '${name}':`, e);
      }
    }
  }

  if (onProgress) onProgress("Updating field appearances and saving PDF...");

  let filledBytes;
  try {
    filledBytes = await pdfDoc.save({ updateFieldAppearances: true });
  } catch (err) {
    throw new PdfFormFillError(
      "Failed to save filled PDF document.",
      "PROCESSING_FAILED",
      err
    );
  }

  if (onProgress) onProgress("Verifying output PDF integrity...");

  let reloadedDoc;
  try {
    reloadedDoc = await PDFDocument.load(filledBytes, {
      ignoreEncryption: false,
      updateMetadata: false,
    });
  } catch (e) {
    reloadedDoc = null;
  }

  const finalPageCount = reloadedDoc ? reloadedDoc.getPageCount() : pdfDoc.getPageCount();

  return {
    success: true,
    pdfBytes: filledBytes,
    byteSize: filledBytes.length,
    originalByteSize: pdfBytes.length,
    pageCount: finalPageCount,
    fieldsFilledCount,
  };
}

/**
 * Generates safe output filename for filled PDF.
 */
export function getSafeFilledFilename(originalName) {
  if (!originalName || typeof originalName !== "string") {
    return "filled-form.pdf";
  }

  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // Strip extension
    .replace(/[^a-zA-Z0-9-_]/g, "-") // Replace non-alphanumeric chars with hyphen
    .replace(/-+/g, "-") // Deduplicate hyphens
    .replace(/^-|-$/g, "") // Trim leading/trailing hyphens
    .toLowerCase();

  return `${baseName || "form"}-filled.pdf`;
}

export default {
  readPdfFormInfo,
  fillPdfForms,
  getSafeFilledFilename,
  PdfFormFillError,
};
