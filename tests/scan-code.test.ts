import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("authenticated students can redeem a course code from every page", async () => {
  const [app, component, apiNames, service, params] = await Promise.all([
    readSource("app.vue"),
    readSource("components/Qr/QrCodeRedeemer.vue"),
    readSource("base/core/networkStructure/apiNames.ts"),
    readSource("features/ScanCode/Data/api_services/scan_code_api_service.ts"),
    readSource("features/ScanCode/Core/Params/scan_code_params.ts"),
  ]);

  assert.match(app, /<LazyQrCodeRedeemer/u);
  assert.match(app, /userStore\.user && !isProtectedContentBlocked/u);
  assert.match(apiNames, /buy_product = this\.baseUrl \+ "v3\/buy_product"/u);
  assert.match(service, /url: ApiNames\.Instance\.buy_product/u);
  assert.match(service, /auth: true/u);
  assert.match(params, /QR_SUBSCRIPTION_TYPE = 3/u);
  assert.match(params, /code: this\.code\.trim\(\)/u);
  assert.match(params, /subscription_type: ScanCodeParams\.QR_SUBSCRIPTION_TYPE/u);
  assert.match(component, /aria-label="إدخال كود الكورس"/u);
  assert.match(component, /معاك كود؟/u);
  assert.match(component, /اضغط هنا لتفعيل المحتوى/u);
  assert.match(component, /setTimeout\(hideHint, 5000\)/u);
  assert.match(component, /card_qr__hint--visible/u);
  assert.match(component, /animation:qr-button-pulse/u);
  assert.doesNotMatch(component, /\.card_qr__hint \{ display:none/u);
  assert.match(component, /@submit\.prevent="submitCode"/u);
  assert.match(component, /await refreshNuxtData\(\)/u);
  assert.match(component, /width:60px/u);
  assert.match(component, /\.card_qr \{ position:fixed/u);
  assert.match(component, /\.scan_qr \{ display:contents/u);
  assert.match(component, /width: 'min\(29rem, calc\(100vw - 24px\)\)'/u);
  assert.match(component, /فعّل كود المحتوى/u);
  assert.match(component, /--app-accent/u);
  assert.match(component, /--app-accent-secondary/u);
  assert.match(component, /--app-surface-raised/u);
  assert.match(component, /aria-labelledby="qr-code-title"/u);
  assert.match(component, /env\(safe-area-inset-bottom\)/u);
});
