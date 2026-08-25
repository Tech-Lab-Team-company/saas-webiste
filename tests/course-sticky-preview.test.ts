import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("course video players report their real playback state", async () => {
  const [youtube, nativeVideo, videoBridge] = await Promise.all([
    readSource("components/CourseDetails/Youtube.vue"),
    readSource("components/CourseDetails/NormalVedio.vue"),
    readSource("components/CourseDetails/CourseVideo.vue"),
  ]);

  for (const player of [youtube, nativeVideo]) {
    assert.match(player, /playbackStateChange/u);
    assert.match(player, /@vmPlay=/u);
    assert.match(player, /@vmPausedChange=/u);
    assert.match(player, /@vmPlaybackEnded=/u);
    assert.match(player, /emit\('playbackStateChange', false\)/u);
  }

  assert.match(videoBridge, /@playback-state-change="reportPlaybackState"/u);
  assert.match(videoBridge, /onBeforeUnmount\(\(\) => reportPlaybackState\(false\)\)/u);
});

test("youtube course video starts from one explicit click", async () => {
  const youtube = await readSource("components/CourseDetails/Youtube.vue");

  assert.match(youtube, /ref="playerInstance"/u);
  assert.match(youtube, /@click\.stop="playVideo"/u);
  assert.match(youtube, /await playerInstance\.value\?\.play\?\.\(\)/u);
  assert.doesNotMatch(youtube, /@click="handlePlayerClick"/u);
  assert.doesNotMatch(youtube, /<ScrubberControl\s+@click=/u);
});

test("pausing YouTube on touch screens does not mount a play overlay under the same tap", async () => {
  const youtube = await readSource("components/CourseDetails/Youtube.vue");

  assert.match(youtube, /const isPlayerPaused = ref\(true\)/u);
  assert.match(youtube, /const showStartOverlay = ref\(true\)/u);
  assert.match(
    youtube,
    /const onPausedChange = \(event: CustomEvent<boolean>\) => \{[\s\S]*?isPlayerPaused\.value = event\.detail;[\s\S]*?emit\('playbackStateChange', !event\.detail\);/u,
  );
  assert.doesNotMatch(
    youtube,
    /const onPausedChange = \(event: CustomEvent<boolean>\) => \{[\s\S]{0,160}?showStartOverlay\.value/u,
  );
  assert.match(youtube, /v-if="showStartOverlay && !isPlayerLoading"/u);
});

test("course preview is sticky only while playing on small and medium screens", async () => {
  const [tabs, styles, layout] = await Promise.all([
    readSource("components/CourseDetails/CourseTabs.vue"),
    readSource("assets/style/course-details-redesign/course-tabs.scss"),
    readSource("layouts/course-details.vue"),
  ]);

  assert.match(tabs, /'is-playing': isCourseVideoPlaying/u);
  assert.match(tabs, /@playback-state-change="handleCourseVideoPlaybackState"/u);
  assert.match(
    styles,
    /@media \(max-width: 980px\) \{[\s\S]*\.course-viewer\.is-playing \{[\s\S]*position: sticky;[\s\S]*top: var\(--course-header-offset, 80px\);/u,
  );
  assert.match(layout, /new ResizeObserver\(syncCourseHeaderOffset\)/u);
  assert.match(layout, /getBoundingClientRect\(\)\.height\) \+ 8/u);
  assert.match(layout, /'--course-header-offset': `\$\{courseHeaderOffset\}px`/u);
  assert.match(
    styles,
    /\.course-viewer\.is-playing :deep\(\.course-video-text\) \{[\s\S]*display: none;/u,
  );
  assert.doesNotMatch(
    styles.slice(0, styles.indexOf("@media (max-width: 980px)")),
    /\.course-viewer\.is-playing/u,
  );
});
