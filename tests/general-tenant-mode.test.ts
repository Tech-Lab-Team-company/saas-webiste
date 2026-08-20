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

test("general tenants load a branded teacher directory from fetch_teachers", async () => {
  const [api, directory, page, header, sitemap] = await Promise.all([
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource(
      "features/HomePageFeature/composables/useTeacherDirectory.ts",
    ),
    readSource("pages/teachers.vue"),
    readSource("components/home/v2/sections/HomeHeaderSection.vue"),
    readSource("server/routes/sitemap.xml.ts"),
  ]);

  assert.match(api, /async fetchTeachers\(\): Promise<unknown>/u);
  assert.match(api, /method: "GET"/u);
  assert.match(directory, /isGeneral \? mapHomeTeachers\(await api\.fetchTeachers\(\)\) : \[\]/u);
  assert.match(page, /مدرسونا/u);
  assert.match(page, /var\(--home-v2-blue\)/u);
  assert.match(header, /label: "المدرسون", to: "\/teachers"/u);
  assert.match(sitemap, /path: "\/teachers"/u);
});
