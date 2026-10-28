import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { stripTypeScriptTypes } from "node:module";
import { runInNewContext } from "node:vm";
import test from "node:test";
import LoginParams from "../features/LoginFeature/Core/Params/login_params.ts";

const uuid = "123e4567-e89b-12d3-a456-426614174000";
const readSource = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

async function bridgeHarness(bridge?: object, client = true) {
  const events = new EventTarget();
  const window = Object.assign(events, { flutter_inappwebview: bridge });
  const timers = new Map<number, () => void>();
  let nextTimer = 0;
  const source = stripTypeScriptTypes(await readSource("utils/deviceUuid.ts"))
    .replace("import.meta.client", String(client))
    .replace("export async function", "async function");
  const getDeviceUuid = runInNewContext(`${source}\ngetDeviceUuid`, {
    window,
    console: { log() {}, warn() {} },
    setTimeout(callback: () => void) { timers.set(++nextTimer, callback); return nextTimer; },
    clearTimeout(id: number) { timers.delete(id); },
  });
  return { getDeviceUuid, window, timers };
}

test("Flutter UUID becomes the exact login payload, with no MAC key or value", async () => {
  const calls: string[] = [];
  const { getDeviceUuid } = await bridgeHarness({
    async callHandler(name: string) {
      calls.push(name);
      return { deviceUuid: ` ${uuid} `, macAddress: "AA:BB:CC:DD:EE:FF" };
    },
  });
  const [first, second] = await Promise.all([getDeviceUuid(), getDeviceUuid()]);
  assert.equal(first, uuid);
  assert.equal(second, uuid);
  assert.equal(await getDeviceUuid(), uuid);
  assert.deepEqual(calls, ["getDeviceIdentifiers"]);
  const payload = new LoginParams("0123456789", "password", first).toMap();
  assert.deepEqual(payload, { credentials: "0123456789", password: "password", deviceUuid: uuid });
  assert.equal(Object.hasOwn(payload, "macAddress"), false);
  assert.equal(Object.hasOwn(payload, "mac_address"), false);
});

test("missing and invalid UUIDs never fall back to a MAC and are retried", async () => {
  for (const result of [null, undefined, "AA:BB", {}, { macAddress: "AA:BB" }, { deviceUuid: "  " }, { deviceUuid: 123 }]) {
    let calls = 0;
    const { getDeviceUuid } = await bridgeHarness({ async callHandler() { calls++; return calls === 1 ? result : { deviceUuid: uuid }; } });
    const missing = await getDeviceUuid();
    assert.equal(missing, null);
    assert.deepEqual(new LoginParams("phone", "secret", missing).toMap(), { credentials: "phone", password: "secret" });
    assert.equal(await getDeviceUuid(), uuid);
  }
});

test("ordinary browsers, SSR and bridge errors retain optional identifier behavior", async () => {
  assert.equal(await (await bridgeHarness()).getDeviceUuid(), null);
  assert.equal(await (await bridgeHarness({ callHandler() { throw new Error("must not run"); } }, false)).getDeviceUuid(), null);
  const { getDeviceUuid } = await bridgeHarness({ async callHandler() { throw new Error("unavailable"); } });
  assert.equal(await getDeviceUuid(), null);
  assert.deepEqual(new LoginParams("phone", "secret").toMap(), { credentials: "phone", password: "secret" });
});

test("bridge readiness and handler timeouts resolve without blocking login", async () => {
  const ready = await bridgeHarness({});
  const request = ready.getDeviceUuid();
  ready.window.flutter_inappwebview = { async callHandler() { return { deviceUuid: uuid }; } };
  ready.window.dispatchEvent(new Event("flutterInAppWebViewPlatformReady"));
  assert.equal(await request, uuid);

  const unavailable = await bridgeHarness({});
  const waiting = unavailable.getDeviceUuid();
  for (const callback of unavailable.timers.values()) callback();
  assert.equal(await waiting, null);

  const timeout = await bridgeHarness({ callHandler() { return new Promise(() => {}); } });
  const pending = timeout.getDeviceUuid();
  await Promise.resolve();
  for (const callback of timeout.timers.values()) callback();
  assert.equal(await pending, null);
});

test("every login entry point retrieves UUID and the POST path preserves the DTO payload", async () => {
  for (const path of ["components/Login/LoginData.vue", ...["LoginFeature", "ChangePasswordFeature", "VerifyCodePasswordFeature", "VerifyCodeFeature"].map(name => `features/${name}/presentation/components/LoginForm.vue`)]) {
    const source = await readSource(path);
    assert.match(source, /await getDeviceUuid\(\)/u);
    assert.doesNotMatch(source, /macAddress|mac_address|getDeviceMac/u);
  }
  const api = await readSource("features/LoginFeature/Data/api_services/login_api_service.ts");
  assert.match(api, /type: CrudType.POST/u);
  assert.match(api, /auth: false/u);
  const service = await readSource("base/Data/ApiService/api_service_interface.ts");
  assert.match(service, /case CrudType.POST:[\s\S]*?data: params\?\.toMap\(\) \?\? \{\}/u);
  const network = await readSource("base/core/networkStructure/networking/network_service.ts");
  assert.match(network, /this\.axiosInstance\.post\(url, data,/u);
  assert.doesNotMatch(api + service + network, /macAddress|mac_address/u);
});
