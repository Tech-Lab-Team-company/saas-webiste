import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import SessionsModel from "../features/FetchCourseDetails/Data/models/sessions_model.ts";

test("SessionsModel.fromMap correctly parses security_data", () => {
  const rawSession = {
    id: 46564,
    lesson_id: 0,
    title: "اسم الفيديو En",
    text: "",
    type: 1,
    link: "https://youtu.be/rZ0LsKOPD_E",
    is_paid: true,
    exam: null,
    has_exam: false,
    start_date: null,
    end_date: null,
    secure: 0,
    web_show_video: true,
    security_data: {
      secure: 0,
      is_flipbook: 0,
      code_duration: 10,
      is_fixed: 0,
      show_video_code: 1,
      code_font_size: 17,
      open_pdf_type: 0,
      download_option: 0,
      can_download_offline: 0,
      can_save_to_device: 0,
      long_video: false,
    },
  };

  const model = SessionsModel.fromMap(rawSession);
  assert.equal(model.id, 46564);
  assert.ok(model.security_data);
  assert.equal(model.security_data?.show_video_code, 1);
  assert.equal(model.security_data?.code_font_size, 17);
  assert.equal(model.security_data?.is_fixed, 0);
  assert.equal(model.security_data?.code_duration, 10);
});

test("MediaWatermark handles show_video_code, is_fixed, code_font_size, and code_duration", async () => {
  const watermarkVue = await readFile(
    new URL("../components/CourseDetails/MediaWatermark.vue", import.meta.url),
    "utf8",
  );

  // Checks props definition includes securityData
  assert.match(watermarkVue, /securityData\?:/u);

  // Checks show_video_code logic
  assert.match(watermarkVue, /show_video_code/u);

  // Checks is_fixed logic
  assert.match(watermarkVue, /is_fixed/u);

  // Checks code_font_size logic
  assert.match(watermarkVue, /code_font_size/u);
  assert.match(watermarkVue, /--course-watermark-font-size/u);

  // Checks code_duration logic and timer
  assert.match(watermarkVue, /code_duration/u);
  assert.match(watermarkVue, /isDurationVisible/u);

  // Checks fixed grid and dynamic floating styles
  assert.match(watermarkVue, /course-media-watermark--fixed/u);
  assert.match(watermarkVue, /course-media-watermark--dynamic/u);
  assert.match(watermarkVue, /watermark-pill/u);
});

test("Youtube and NormalVedio pass securityData to CourseDetailsMediaWatermark", async () => {
  const youtubeVue = await readFile(
    new URL("../components/CourseDetails/Youtube.vue", import.meta.url),
    "utf8",
  );
  assert.match(
    youtubeVue,
    /<CourseDetailsMediaWatermark\s+:course-id="courseId"\s+:security-data="securityData"/u,
  );

  const normalVideoVue = await readFile(
    new URL("../components/CourseDetails/NormalVedio.vue", import.meta.url),
    "utf8",
  );
  assert.match(
    normalVideoVue,
    /<CourseDetailsMediaWatermark\s+:course-id="courseId"\s+:security-data="securityData"/u,
  );
});

test("CourseVideo forwards currentSecurityData to players and watermark", async () => {
  const courseVideoVue = await readFile(
    new URL("../components/CourseDetails/CourseVideo.vue", import.meta.url),
    "utf8",
  );

  assert.match(courseVideoVue, /currentSecurityData/u);
  assert.match(courseVideoVue, /:security-data="currentSecurityData"/u);
});

test("CourseTabs and Stage components emit and preserve securityData on session selection", async () => {
  const courseTabsVue = await readFile(
    new URL("../components/CourseDetails/CourseTabs.vue", import.meta.url),
    "utf8",
  );
  assert.match(courseTabsVue, /securityData:\s*null/u);

  const stageOneVue = await readFile(
    new URL("../components/CourseDetails/TabsContent/CourseContentStageOne.vue", import.meta.url),
    "utf8",
  );
  assert.match(stageOneVue, /session\?\.security_data/u);

  const stageTwoVue = await readFile(
    new URL("../components/CourseDetails/TabsContent/CourseContentStageTwo.vue", import.meta.url),
    "utf8",
  );
  assert.match(stageTwoVue, /session\?\.security_data/u);

  const stageThreeVue = await readFile(
    new URL("../components/CourseDetails/TabsContent/CourseContent.vue", import.meta.url),
    "utf8",
  );
  assert.match(stageThreeVue, /session\?\.security_data/u);
});
