import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  DEFAULT_APP_THEME,
  resolveAppTheme,
} from "../composables/useAppTheme.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("application theme defaults to light and only accepts an explicit dark value", () => {
  assert.equal(DEFAULT_APP_THEME, "light");
  assert.equal(resolveAppTheme(undefined), "light");
  assert.equal(resolveAppTheme(null), "light");
  assert.equal(resolveAppTheme("system"), "light");
  assert.equal(resolveAppTheme("dark"), "dark");
});

test("theme persistence never changes automatically from the operating system", async () => {
  const [appTheme, alternateTheme, appRoot] = await Promise.all([
    readSource("composables/useAppTheme.ts"),
    readSource("pages/eduhub-nuxt-home/composables/useColorTheme.ts"),
    readSource("app.vue"),
  ]);

  assert.doesNotMatch(appTheme, /matchMedia|prefers-color-scheme/u);
  assert.match(appTheme, /default: \(\) => DEFAULT_APP_THEME/u);
  assert.match(appTheme, /path: "\/"/u);
  assert.match(appTheme, /themeCookie\.value = nextTheme/u);
  assert.match(alternateTheme, /useCookie<ColorTheme>\('app-theme'/u);
  assert.doesNotMatch(alternateTheme, /edu-theme/u);
  assert.match(appRoot, /"data-theme": theme\.value/u);
});
