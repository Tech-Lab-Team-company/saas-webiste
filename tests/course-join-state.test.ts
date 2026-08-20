import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("a successful course join updates the pending state and refreshes course details", async () => {
  const courseCard = await readSource("components/CourseDetails/CourseCard.vue");

  assert.match(
    courseCard,
    /if \(coursesPaymentController\.isDataSuccess\(\)\) \{\s*Status\.value = 1;\s*emit\("Changestatus"\);/u,
  );
  assert.doesNotMatch(courseCard, /if \(Status\.value\) \{\s*emit\("Changestatus"\);/u);
  assert.match(courseCard, /طلب الانضمام قيد المراجعة/u);
});
