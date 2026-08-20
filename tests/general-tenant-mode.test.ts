import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("web status cache is isolated by tenant domain", async () => {
  const app = await readSource("app.vue");

  assert.match(app, /`web-status:\$\{webDomain \|\| "default"\}`/u);
  assert.match(app, /else SettingStore\.clearSetting\(\)/u);
});

test("general tenants skip education taxonomy and load the public catalog", async () => {
  const homePage = await readSource(
    "features/HomePageFeature/composables/useHomePage.ts",
  );

  assert.match(homePage, /Number\(setting\.value\?\.has_general\) === 1/u);
  assert.match(
    homePage,
    /if \(tenantMode === 'general'\) return \{ stages: \[\], tabs: \[\] \}/u,
  );
  assert.match(homePage, /api\.fetchPublicCourseCatalog\(1, 9\)/u);
});

test("general course UI does not require stages and identifies course teachers", async () => {
  const [section, card] = await Promise.all([
    readSource("components/home/v2/sections/HomeCoursesSection.vue"),
    readSource("components/home/v2/HomeCourseCard.vue"),
  ]);

  assert.match(section, /v-if="!isGeneralMode" class="home-course-picker"/u);
  assert.match(section, /كورسات المدرسين/u);
  assert.match(card, /course\.teacher\?\.name \|\| course\.sourceSubject/u);
});
