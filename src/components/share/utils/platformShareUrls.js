/**
 * Helper to construct clean production domain canonical URL.
 */
export function getCanonicalToolUrl(customSlugOrUrl) {
  const BASE_DOMAIN = "https://www.snapfreetools.com";

  if (!customSlugOrUrl) {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      return `${BASE_DOMAIN}${pathname.endsWith("/") ? pathname.slice(0, -1) : pathname}`;
    }
    return BASE_DOMAIN;
  }

  if (customSlugOrUrl.startsWith("http://") || customSlugOrUrl.startsWith("https://")) {
    return customSlugOrUrl;
  }

  const cleanSlug = customSlugOrUrl.startsWith("/") ? customSlugOrUrl : `/${customSlugOrUrl}`;
  return `${BASE_DOMAIN}${cleanSlug}`;
}

/**
 * Builds external social platform share URLs.
 */
export function buildPlatformShareUrl(platformId, { url, shareText, title }) {
  const targetUrl = getCanonicalToolUrl(url);

  switch (platformId) {
    case "whatsapp":
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText}\n\n${targetUrl}`)}`;

    case "twitter":
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(targetUrl)}`;

    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;

    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;

    case "email":
      return `mailto:?subject=${encodeURIComponent(title || "Check out this free tool")}&body=${encodeURIComponent(`${shareText}\n\n${targetUrl}`)}`;

    default:
      return null;
  }
}
