// Reads the device UUID from the Flutter Desktop host through
// the flutter_inappwebview JavaScript bridge (`getDeviceIdentifiers` handler).
// Normal browsers have no bridge, so the UUID resolves to null without errors.

const LOG_PREFIX = "[DeviceUuid]";
const PLATFORM_READY_TIMEOUT_MS = 3000;
const HANDLER_TIMEOUT_MS = 5000;

type FlutterBridge = {
  callHandler?: (handlerName: string, ...args: unknown[]) => Promise<unknown>;
};

let cachedUuid: string | null = null;
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

const requestUuidFromFlutter = async (): Promise<string | null> => {
  if (!getBridge()) {
    console.log(`${LOG_PREFIX} Flutter WebView bridge not available`);
    return null;
  }

  if (!(await waitForPlatformReady())) {
    console.log(`${LOG_PREFIX} Flutter WebView bridge not available`);
    return null;
  }

  console.log(`${LOG_PREFIX} Flutter WebView bridge available`);
  console.log(`${LOG_PREFIX} Requesting UUID from Flutter`);

  try {
    const result = await Promise.race([
      getBridge()!.callHandler!("getDeviceIdentifiers"),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error("getDeviceIdentifiers handler timed out")),
          HANDLER_TIMEOUT_MS,
        ),
      ),
    ]);

    const deviceUuid = result && typeof result === "object" && "deviceUuid" in result
      && typeof result.deviceUuid === "string" ? result.deviceUuid.trim() : "";
    console.log(`${LOG_PREFIX} Received UUID: ${deviceUuid ? "(available)" : "(empty)"}`);
    return deviceUuid || null;
  } catch (error) {
    console.warn(`${LOG_PREFIX} Failed to get UUID`, error);
    return null;
  }
};

// Returns the cached UUID when known; otherwise asks Flutter again, so a login
// attempt retries if the mount-time request had not resolved a value yet.
export async function getDeviceUuid(): Promise<string | null> {
  if (!import.meta.client) return null;
  if (cachedUuid) return cachedUuid;

  if (!pendingRequest) {
    pendingRequest = requestUuidFromFlutter().finally(() => {
      pendingRequest = null;
    });
  }

  cachedUuid = await pendingRequest;
  return cachedUuid;
}
