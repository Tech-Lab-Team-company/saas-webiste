import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("feedback dialog keeps a simple centered structure", async () => {
  const dialog = await readSource(
    "base/persention/Dialogs/MainDialogs/MainDialog.vue",
  );

  assert.match(dialog, /width: min\(390px, calc\(100vw - 32px\)\)/u);
  assert.match(dialog, /position: fixed;[\s\S]*inset: 0;[\s\S]*margin: auto/u);
  assert.match(dialog, /display: grid !important;[\s\S]*justify-items: center/u);
  assert.match(dialog, /text-align: center/u);
  assert.match(dialog, /background: var\(--app-surface, #fff\) !important/u);
  assert.match(dialog, /background: var\(--dialog-accent\) !important/u);
  assert.doesNotMatch(dialog, /dialog-status/u);
  assert.doesNotMatch(dialog, /dialog-visual-ring/u);
  assert.doesNotMatch(dialog, /ستُغلق هذه الرسالة/u);
});

test("dialog service scopes content and clears stale images", async () => {
  const service = await readSource(
    "base/persention/Dialogs/dialog_service.ts",
  );

  assert.match(service, /dialog\?\.querySelector\(`\.dialog-title`\)/u);
  assert.match(service, /image\.removeAttribute\('src'\)/u);
  assert.match(service, /visual\.hidden = !hasImage/u);
});
