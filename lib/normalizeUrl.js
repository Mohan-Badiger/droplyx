export const normalizeUrl = (url) => {
  try {
    const parsed = new URL(url);

    // Flipkart requires the 'pid' (Product ID) parameter to identify variants/items.
    const isFlipkart = parsed.hostname.includes("flipkart.com");
    const preservedPid = isFlipkart ? parsed.searchParams.get("pid") : null;

    // Clear hash
    parsed.hash = "";

    // Clear all query params
    parsed.search = "";

    // Restore critical query params if present
    if (preservedPid) {
      parsed.searchParams.set("pid", preservedPid);
    }

    // Remove trailing slash
    return parsed.toString().replace(/\/$/, "");
  } catch {
    // If not a valid standalone URL, return raw
    return url;
  }
};
