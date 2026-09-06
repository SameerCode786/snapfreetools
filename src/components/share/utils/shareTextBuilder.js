import { getCanonicalToolUrl } from "./platformShareUrls";

/**
 * Builds clean structured share text for tools and results.
 */
export function buildToolShareText(toolName, customUrl) {
  const url = getCanonicalToolUrl(customUrl);
  return `Check out this free ${toolName} on SnapFreeTools:\n\n${url}`;
}

export function buildResultShareText({ toolName, toolUrl, result, customFormatter }) {
  const url = getCanonicalToolUrl(toolUrl);

  if (typeof customFormatter === "function") {
    const formatted = customFormatter(result);
    if (formatted) return formatted;
  }

  let text = `Check out this free ${toolName} on SnapFreeTools:\n\n${url}\n\nMy Result:\n`;

  if (typeof result === "string") {
    text += `• ${result}\n`;
  } else if (result && typeof result === "object") {
    if (result.summary && Array.isArray(result.summary)) {
      result.summary.forEach((item) => {
        if (item.label && item.value !== undefined) {
          text += `• ${item.label}: ${item.value}\n`;
        }
      });
    } else if (result.summary && typeof result.summary === "string") {
      text += `• ${result.summary}\n`;
    } else {
      // Key-value object fallback
      Object.entries(result).forEach(([key, val]) => {
        if (key !== "isEmpty" && key !== "type" && typeof val !== "object" && val !== null) {
          const readableKey = key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());
          text += `• ${readableKey}: ${val}\n`;
        }
      });
    }
  }

  text += `\nTry it yourself!`;
  return text;
}
