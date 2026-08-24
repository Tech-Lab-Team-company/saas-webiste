import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("stage two curriculum uses clear accordion actions and semantic lesson rows", async () => {
  const [curriculum, curriculumStyles, courseTabs, courseTabsStyles] =
    await Promise.all([
      readSource("components/CourseDetails/TabsContent/CourseContentStageTwo.vue"),
      readSource("assets/style/course-details-redesign/course-content-stage-two.scss"),
      readSource("components/CourseDetails/CourseTabs.vue"),
      readSource("assets/style/course-details-redesign/course-tabs.scss"),
    ]);

  assert.match(curriculum, /<small>القسم<\/small>/u);
  assert.match(curriculum, /formatContentCount/u);
  assert.match(curriculum, /pi pi-list/u);
  assert.match(curriculum, /عرض المحتوى/u);
  assert.match(curriculum, /إخفاء المحتوى/u);
  assert.match(curriculum, /class="course-body-details" type="button"/u);
  assert.match(curriculum, /getTypeMeta\(session\?\.type\)\.label/u);
  assert.doesNotMatch(curriculum, /pi pi-play-circle/u);
  assert.doesNotMatch(
    curriculum,
    /<AccordionContent[^>]*v-for=/u,
  );

  assert.match(
    curriculumStyles,
    /grid-template-columns: 58px minmax\(0, 1fr\) auto;/u,
  );
  assert.match(curriculumStyles, /\.accordion-toggle-label/u);
  assert.match(curriculumStyles, /@media \(max-width: 576px\)/u);

  assert.match(courseTabs, /محتوى الكورس خطوة بخطوة/u);
  assert.match(courseTabs, /افتح كل قسم لاستعراض الدروس والملفات المتاحة/u);
  assert.match(courseTabs, /pi pi-info-circle/u);
  assert.match(courseTabsStyles, /\.platform-key > span/u);
});
