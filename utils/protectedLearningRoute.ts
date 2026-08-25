export interface BrowserViewportMetrics {
  innerWidth: number;
  innerHeight: number;
  outerWidth: number;
  outerHeight: number;
}

export interface BrowserInputCapabilities {
  maxTouchPoints: number;
  coarsePointer: boolean;
  userAgent: string;
}

const MOBILE_BROWSER_PATTERN =
  /Android|iPhone|iPad|iPod|Mobile|Tablet|Silk|Kindle/u;

export const isProtectedLearningPath = (path: string) => {
  const pathname = path.split(/[?#]/u, 1)[0] || "";
  return /^\/course\/[^/]+(?:\/[^/]+)?\/?$/u.test(pathname);
};

export const hasDeveloperToolsViewportGap = (
  metrics: BrowserViewportMetrics,
  threshold: number,
) => {
  const values = [
    metrics.innerWidth,
    metrics.innerHeight,
    metrics.outerWidth,
    metrics.outerHeight,
    threshold,
  ];

  if (!values.every(Number.isFinite) || threshold <= 0) return false;
  if (metrics.outerWidth <= 0 || metrics.outerHeight <= 0) return false;

  const widthGap = Math.max(0, metrics.outerWidth - metrics.innerWidth);
  const heightGap = Math.max(0, metrics.outerHeight - metrics.innerHeight);

  return widthGap >= threshold || heightGap >= threshold;
};

export const supportsReliableDeveloperToolsViewportDetection = (
  capabilities: BrowserInputCapabilities,
) => {
  if (!Number.isFinite(capabilities.maxTouchPoints)) return false;

  const isTouchDevice = capabilities.maxTouchPoints > 0;
  const isMobileBrowser = MOBILE_BROWSER_PATTERN.test(capabilities.userAgent);

  return !isTouchDevice && !capabilities.coarsePointer && !isMobileBrowser;
};
