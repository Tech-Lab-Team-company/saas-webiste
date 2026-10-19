// Reads the physical device MAC address from the Flutter Desktop host through
// the flutter_inappwebview JavaScript bridge (`getDeviceMac` handler).
// Normal browsers have no bridge, so the MAC resolves to null without errors.

const LOG_PREFIX = "[DeviceMac]";
const PLATFORM_READY_TIMEOUT_MS = 3000;
const HANDLER_TIMEOUT_MS = 5000;

type FlutterBridge = {
  callHandler?: (handlerName: string, ...args: unknown[]) => Promise<unknown>;
};

let cachedMac: string | null = null;
let pendingRequest: Promise<string | null> | null = null;

const getBridge = (): FlutterBridge | undefined =>
  (window as any).flutter_inappwebview;

const hasCallHandler = (): boolean =>
  typeof getBridge()?.callHandler === "function";

// The bridge object can exist before `callHandler` is usable; the plugin
// dispatches `flutterInAppWebViewPlatformReady` once it is.
const waitForPlatformReady = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (hasCallHandler()) {
      resolve(true);
      return;
    }

    const onReady = () => {
      clearTimeout(timer);
      resolve(hasCallHandler());
    };
    const timer = setTimeout(() => {
      window.removeEventListener("flutterInAppWebViewPlatformReady", onReady);
      resolve(hasCallHandler());
    }, PLATFORM_READY_TIMEOUT_MS);

    window.addEventListener("flutterInAppWebViewPlatformReady", onReady, {
      once: true,
    });
  });

const requestMacFromFlutter = async (): Promise<string | null> => {
  if (!getBridge()) {
    console.log(`${LOG_PREFIX} Flutter WebView bridge not available`);
    return null;
  }

  if (!(await waitForPlatformReady())) {
    console.log(`${LOG_PREFIX} Flutter WebView bridge not available`);
    return null;
  }

  console.log(`${LOG_PREFIX} Flutter WebView bridge available`);
  console.log(`${LOG_PREFIX} Requesting MAC from Flutter`);

  try {
    const result = await Promise.race([
      getBridge()!.callHandler!("getDeviceMac"),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("getDeviceMac handler timed out")),
          HANDLER_TIMEOUT_MS,
        ),
      ),
    ]);

    const mac = typeof result === "string" ? result.trim() : "";
    console.log(`${LOG_PREFIX} Received MAC: ${mac || "(empty)"}`);
    return mac || null;
  } catch (error) {
    console.warn(`${LOG_PREFIX} Failed to get MAC`, error);
    return null;
  }
};

// Returns the cached MAC when known; otherwise asks Flutter again, so a login
// attempt retries if the mount-time request had not resolved a value yet.
export async function getDeviceMac(): Promise<string | null> {
  if (!import.meta.client) return null;
  if (cachedMac) return cachedMac;

  if (!pendingRequest) {
    pendingRequest = requestMacFromFlutter().finally(() => {
      pendingRequest = null;
    });
  }

  cachedMac = await pendingRequest;
  return cachedMac;
}
