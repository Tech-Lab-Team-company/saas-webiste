import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("no page file collides with a same-named subdirectory, which would silently swallow that directory's nested child routes", async () => {
  const pagesDir = new URL("../pages/", import.meta.url);
  const entries = await readdir(pagesDir, { withFileTypes: true });
  const fileNames = new Set(
    entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".vue"))
      .map((entry) => entry.name.replace(/\.vue$/u, "")),
  );
  const dirNames = new Set(
    entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name),
  );

  const collisions = [...fileNames].filter((name) => dirNames.has(name));

  assert.deepEqual(
    collisions,
    [],
    "A page file with the same name as a sibling directory becomes that directory's parent route in Nuxt. " +
      "Without a <NuxtPage/> outlet, every route under the directory silently renders the parent page instead.",
  );
});

test("the student dashboard home and the dashboard course route are independent, sibling pages", async () => {
  const [dashboardHome, dashboardCourse] = await Promise.all([
    readSource("pages/student-dashboard/index.vue"),
    readSource("pages/student-dashboard/course/[id].vue"),
  ]);

  assert.match(dashboardHome, /name: "student-dashboard"/u);
  assert.doesNotMatch(dashboardHome, /<NuxtPage/u);

  assert.match(dashboardCourse, /name: "student-dashboard-course-id"/u);
  assert.match(dashboardCourse, /layout: "student-dashboard"/u);
  assert.match(dashboardCourse, /middleware: \["verified-student"\]/u);
  assert.match(dashboardCourse, /useCourseDetailsData\(/u);
  assert.match(dashboardCourse, /<CourseDetailsCourseTabs/u);
});
