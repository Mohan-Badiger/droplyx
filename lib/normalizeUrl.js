export const normalizeUrl = (url) => {
  try {
    const parsed = new URL(url);

    // remove all query parameters (ref, pid, etc.)
    parsed.search = "";

    // remove hash
    parsed.hash = "";

    // remove trailing slash from clean URL string
    let clean = parsed.toString().replace(/\/$/, "");

    return clean;
  } catch {
    // If not a valid standalone URL, return raw
    return url;
  }
};
