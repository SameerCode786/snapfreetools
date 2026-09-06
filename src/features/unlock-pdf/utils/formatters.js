/**
 * Formats file bytes to human readable format (KB, MB).
 */
export const formatFileSize = (bytes) => {
  if (bytes === undefined || bytes === null || isNaN(bytes) || bytes === 0) {
    return "0 B";
  }
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Sanitizes base filename for clean output download names.
 */
export const sanitizeFilename = (filename) => {
  if (!filename) return "document";
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return (
    nameWithoutExt
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "document"
  );
};
