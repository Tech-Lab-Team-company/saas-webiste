import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("a successful course join updates the pending state and refreshes course details", async () => {
  const courseCard = await readSource("components/CourseDetails/CourseCard.vue");

  assert.match(courseCard, /url: ApiNames\.Instance\.buy_product/u);
  assert.match(courseCard, /course_id: courseId/u);
  assert.match(courseCard, /subscription_type: 5/u);
  assert.match(courseCard, /if \(failed\) \{[\s\S]*throw new Error/u);
  assert.match(courseCard, /Status\.value = 1;\s*emit\("Changestatus"\);/u);
  assert.doesNotMatch(courseCard, /if \(Status\.value\) \{\s*emit\("Changestatus"\);/u);
  assert.doesNotMatch(courseCard, /CoursesPaymentController|join_course/u);
  assert.match(courseCard, /طلب الانضمام قيد المراجعة/u);
});
