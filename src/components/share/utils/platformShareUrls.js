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
 * Builds external social platform share URLs without duplicate URLs.
 */
export function buildPlatformShareUrl(platformId, { url, shareText, title }) {
  const targetUrl = getCanonicalToolUrl(url);

  switch (platformId) {
    case "whatsapp":
      // shareText already contains URL once
      return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

    case "twitter": {
      // Strip standalone targetUrl from text so Twitter's &url= parameter native append creates zero duplicates
      const cleanTextForTwitter = shareText
        .replace(targetUrl, "")
        .replace(/\n\s*\n\s*\n/g, "\n\n")
        .trim();
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(cleanTextForTwitter)}&url=${encodeURIComponent(targetUrl)}`;
    }

    case "facebook":
      // Facebook Sharer uses OG metadata for title/description/image; strictly requires u parameter
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(targetUrl)}`;

    case "linkedin":
      // LinkedIn Sharer uses OG metadata for title/description/image; strictly requires url parameter
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(targetUrl)}`;

    case "email":
      // shareText already contains formatted body
      return `mailto:?subject=${encodeURIComponent(title || "Check out this free tool")}&body=${encodeURIComponent(shareText)}`;

    default:
      return null;
  }
}
