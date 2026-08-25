import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("mobile-only dialog uses compact responsive store badges", async () => {
  const dialog = await readFile(
    new URL("../components/CourseDetails/AppOnlyContentDialog.vue", import.meta.url),
    "utf8",
  );

  assert.match(dialog, /width: 'min\(25rem, calc\(100vw - 1\.5rem\)\)'/u);
  assert.match(dialog, /app-only-dialog__store--apple/u);
  assert.match(dialog, /app-only-dialog__store--google/u);
  assert.match(dialog, /\.app-only-dialog__store--apple img \{[\s\S]*?width: 154px;[\s\S]*?height: 46px;/u);
  assert.match(dialog, /\.app-only-dialog__store--google img \{[\s\S]*?width: 180px;[\s\S]*?max-width: none;/u);
  assert.match(dialog, /@media \(max-width: 390px\)/u);
});
