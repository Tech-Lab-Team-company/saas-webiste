import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  TeacherTypeEnum,
  resolveTeacherType,
  supportsTeacherDirectory,
} from "../features/HomePageFeature/types/teacherType.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("web status cache is isolated by tenant domain", async () => {
  const [app, settingStore, mapper] = await Promise.all([
    readSource("app.vue"),
    readSource("stores/setting.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
  ]);

  assert.match(app, /`web-status:\$\{webDomain \|\| "default"\}`/u);
  assert.match(app, /if \(webStatus\.value\) SettingStore\.setSetting\(webStatus\.value\)/u);
  assert.match(app, /else SettingStore\.clearSetting\(\)/u);
  assert.doesNotMatch(settingStore, /persist:\s*true/u);
  assert.match(mapper, /value\.replace\(\/\\r\\n\?\/gu, '\\n'\)\.trim\(\)/u);
});

test("web-status teacher types expose the correct center capabilities", () => {
  assert.equal(resolveTeacherType(1), TeacherTypeEnum.CENTER);
  assert.equal(resolveTeacherType("2"), TeacherTypeEnum.TEACHER);
  assert.equal(resolveTeacherType(3), TeacherTypeEnum.CENTER_TEACHER);
  assert.equal(resolveTeacherType(9), null);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.CENTER), true);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.TEACHER), false);
  assert.equal(supportsTeacherDirectory(TeacherTypeEnum.CENTER_TEACHER), true);
});

test("center mode loads both education taxonomy and the public catalog fallback", async () => {
  const [homePage, mapper] = await Promise.all([
    readSource("features/HomePageFeature/composables/useHomePage.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
  ]);

  assert.match(homePage, /supportsTeacherDirectory\(setting\.value\?\.type\)/u);
  assert.doesNotMatch(homePage, /has_general/u);
  assert.match(homePage, /api\.fetchStages\(\)/u);
  assert.match(homePage, /api\.fetchPublicCourseCatalog\(1, 9\)/u);
  assert.match(mapper, /teacherType: resolveTeacherType\(settings\.type\)/u);
  assert.match(mapper, /hasTeacherDirectory: supportsTeacherDirectory\(settings\.type\)/u);
});

test("center course UI prefers stages and falls back to the public catalog", async () => {
  const [section, card] = await Promise.all([
    readSource("components/home/v2/sections/HomeCoursesSection.vue"),
    readSource("components/home/v2/HomeCourseCard.vue"),
  ]);

  assert.match(section, /v-if="!isGeneralMode" class="home-course-picker"/u);
  assert.match(section, /props\.courses\.data\.taxonomyStatus !== "success"/u);
  assert.match(section, /كورسات المدرسين/u);
  assert.match(card, /course\.teacher\?\.name \|\| course\.sourceSubject/u);
});

test("centers load a branded teacher directory from fetch_teachers", async () => {
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
  assert.match(directory, /supportsTeacherDirectory\(setting\.value\?\.type\)/u);
  assert.match(directory, /hasTeacherDirectory \? mapHomeTeachers\(await api\.fetchTeachers\(\)\) : \[\]/u);
  assert.match(page, /مدرسونا/u);
  assert.match(page, /var\(--home-v2-blue\)/u);
  assert.match(header, /label: "المدرسون", to: "\/teachers"/u);
  assert.match(sitemap, /path: "\/teachers"/u);
  assert.match(sitemap, /path: `\/teachers\/\$\{teacher\.id\}`/u);
});

test("teacher cards open API-backed teacher detail pages", async () => {
  const [api, mapper, cards, detailsPage] = await Promise.all([
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
    readSource("components/home/v2/sections/HomeTeachersSection.vue"),
    readSource("pages/teachers/[id].vue"),
  ]);

  assert.match(api, /async fetchTeacherDetails\(teacherId: number\)/u);
  assert.match(api, /teacher_id: teacherId/u);
  assert.match(mapper, /export const mapHomeTeacher =/u);
  assert.match(cards, /:to="`\/teachers\/\$\{teacher\.id\}`"/u);
  assert.match(detailsPage, /api\.fetchTeacherDetails\(teacherId\)/u);
  assert.match(detailsPage, /mapHomeTeacher/u);
});
