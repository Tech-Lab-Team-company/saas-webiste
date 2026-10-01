import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Youtube.vue handles Space key for play/pause and prevents page scrolling", async () => {
  const content = await readFile(
    new URL("../components/CourseDetails/Youtube.vue", import.meta.url),
    "utf8",
  );

  // Checks keyboard listener attachment and detachment
  assert.match(content, /window\.addEventListener\('keydown',\s*handleGlobalKeydown\)/u);
  assert.match(content, /window\.removeEventListener\('keydown',\s*handleGlobalKeydown\)/u);

  // Checks prevention of default browser scroll behavior
  assert.match(content, /event\.preventDefault\(\)/u);

  // Checks interactive element exclusion (inputs, textarea, editable)
  assert.match(content, /isInteractiveTarget/u);

  // Checks pause and toggle functions
  assert.match(content, /pauseVideo/u);
  assert.match(content, /togglePlayPause/u);
});

test("NormalVedio.vue handles Space key for play/pause and prevents page scrolling", async () => {
  const content = await readFile(
    new URL("../components/CourseDetails/NormalVedio.vue", import.meta.url),
    "utf8",
  );

  // Checks keyboard listener attachment and detachment
  assert.match(content, /window\.addEventListener\('keydown',\s*handleGlobalKeydown\)/u);
  assert.match(content, /window\.removeEventListener\('keydown',\s*handleGlobalKeydown\)/u);

  // Checks prevention of default browser scroll behavior
  assert.match(content, /event\.preventDefault\(\)/u);

  // Checks interactive element exclusion
  assert.match(content, /isInteractiveTarget/u);

  // Checks pause and toggle functions
  assert.match(content, /playVideo/u);
  assert.match(content, /pauseVideo/u);
  assert.match(content, /togglePlayPause/u);
});

test("AudioPlayer.vue handles Space key for audio toggle and prevents page scrolling", async () => {
  const content = await readFile(
    new URL("../components/CourseDetails/TabsContent/AudioPlayer.vue", import.meta.url),
    "utf8",
  );

  assert.match(content, /window\.addEventListener\('keydown',\s*handleGlobalKeydown\)/u);
  assert.match(content, /window\.removeEventListener\('keydown',\s*handleGlobalKeydown\)/u);
  assert.match(content, /event\.preventDefault\(\)/u);
  assert.match(content, /togglePlay/u);
  assert.match(content, /<audio[\s\S]*controls[\s\S]*preload="auto"/u);
  assert.doesNotMatch(content, /WaveSurfer/u);
  assert.doesNotMatch(content, /audio\s*\{\s*display:\s*none/u);
});

test("course media protection does not pause localhost development playback", async () => {
  const content = await readFile(
    new URL("../composables/useCourseProtectionConfig.ts", import.meta.url),
    "utf8",
  );

  assert.match(content, /developerToolsGuard:\s*!import\.meta\.dev/u);
});
