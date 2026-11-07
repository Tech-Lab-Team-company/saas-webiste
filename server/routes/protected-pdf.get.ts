import { lookup } from "node:dns/promises";

// Fetches a course/book PDF for ProtectedPdfViewer when the file host does not
// allow cross-origin reads. Private addresses are refused so the route cannot
// reach internal services; NUXT_PROTECTED_PDF_HOSTS lists hosts to trust as-is.
const MAX_REDIRECTS = 3;
const PDF_CONTENT_TYPES = ["application/pdf", "application/octet-stream", "binary/octet-stream"];

const trustedHosts = () =>
  String(process.env.NUXT_PROTECTED_PDF_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

const isPrivateAddress = (rawAddress: string) => {
  const address = rawAddress.toLowerCase().replace(/^::ffff:/, "");
  if (address.includes(":")) {
    return address === "::1" || address === "::" || /^(fc|fd|fe[89ab])/.test(address);
  }

  const [first = 0, second = 0] = address.split(".").map(Number);
  return (
    first === 0 ||
    first === 10 ||
    first === 127 ||
    (first === 100 && second >= 64 && second <= 127) ||
    (first === 169 && second === 254) ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

const assertAllowedUrl = async (url: URL) => {
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw createError({ statusCode: 400, statusMessage: "Unsupported file URL" });
  }
  if (trustedHosts().includes(url.hostname.toLowerCase())) return;

  const addresses = await lookup(url.hostname, { all: true }).catch(() => []);
  if (!addresses.length || addresses.some(({ address }) => isPrivateAddress(address))) {
    throw createError({ statusCode: 403, statusMessage: "File host is not allowed" });
  }
};

const fetchFile = async (startUrl: URL) => {
  let url = startUrl;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertAllowedUrl(url);
    const response = await fetch(url, { redirect: "manual" });
    const location = response.headers.get("location");
    if (response.status < 300 || response.status >= 400 || !location) return response;
    url = new URL(location, url);
  }
  throw createError({ statusCode: 502, statusMessage: "Too many redirects" });
};

export default defineEventHandler(async (event) => {
  const fetchSite = getRequestHeader(event, "sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin") {
    throw createError({ statusCode: 403, statusMessage: "Cross-site request refused" });
  }

  let fileUrl: URL;
  try {
    fileUrl = new URL(String(getQuery(event).url || ""));
  } catch {
    throw createError({ statusCode: 400, statusMessage: "Invalid file URL" });
  }

  const response = await fetchFile(fileUrl);
  if (!response.ok || !response.body) {
    throw createError({ statusCode: 502, statusMessage: `File request failed: ${response.status}` });
  }

  const contentType = (response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
  if (!PDF_CONTENT_TYPES.includes(contentType)) {
    throw createError({ statusCode: 415, statusMessage: "File is not a PDF" });
  }

  setResponseHeaders(event, {
    "Content-Type": "application/pdf",
    "Cache-Control": "private, no-store",
    "X-Robots-Tag": "noindex, nofollow, noarchive",
  });
  const contentLength = response.headers.get("content-length");
  if (contentLength) setResponseHeader(event, "Content-Length", contentLength);

  return sendStream(event, response.body);
});
