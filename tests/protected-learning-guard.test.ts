import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  hasDeveloperToolsViewportGap,
  isProtectedLearningPath,
  supportsReliableDeveloperToolsViewportDetection,
} from "../utils/protectedLearningRoute.ts";

test("application content protection is mounted by the root app", async () => {
  const app = await readFile(new URL("../app.vue", import.meta.url), "utf8");

  assert.match(
    app,
    /const \{ protectionNotice, protectionNoticeKey \} =\s*useAppContentProtection\(\)/u,
  );
});

test("only dynamic course and exam routes are protected", () => {
  assert.equal(isProtectedLearningPath("/course"), false);
  assert.equal(isProtectedLearningPath("/course/3250"), true);
  assert.equal(isProtectedLearningPath("/course/3250/81"), true);
  assert.equal(isProtectedLearningPath("/course/3250/timer?exam=81"), true);
  assert.equal(isProtectedLearningPath("/books/12"), false);
});

test("the student-dashboard course view keeps the same content protection as the public course page", () => {
  assert.equal(isProtectedLearningPath("/student-dashboard/course/3250"), true);
  assert.equal(isProtectedLearningPath("/student-dashboard"), false);
  assert.equal(isProtectedLearningPath("/student-dashboard/course"), false);
});

test("developer tools viewport detection handles side and bottom docks", () => {
  const normalWindow = {
    innerWidth: 1280,
    innerHeight: 820,
    outerWidth: 1280,
    outerHeight: 920,
  };
  const sideDock = { ...normalWindow, innerWidth: 900 };
  const bottomDock = { ...normalWindow, innerHeight: 520 };

  assert.equal(hasDeveloperToolsViewportGap(normalWindow, 170), false);
  assert.equal(hasDeveloperToolsViewportGap(sideDock, 170), true);
  assert.equal(hasDeveloperToolsViewportGap(bottomDock, 170), true);
});

test("responsive device emulation still detects the desktop viewport gap", () => {
  assert.equal(
    hasDeveloperToolsViewportGap(
      {
        innerWidth: 1571,
        innerHeight: 1001,
        outerWidth: 1920,
        outerHeight: 1080,
      },
      170,
    ),
    true,
  );
});

test("developer tools viewport detection is disabled on phones and tablets", () => {
  assert.equal(
    supportsReliableDeveloperToolsViewportDetection({
      maxTouchPoints: 0,
      coarsePointer: false,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Mobile/15E148",
    }),
    false,
  );
  assert.equal(
    supportsReliableDeveloperToolsViewportDetection({
      maxTouchPoints: 5,
      coarsePointer: false,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15",
    }),
    false,
  );
  assert.equal(
    supportsReliableDeveloperToolsViewportDetection({
      maxTouchPoints: 0,
      coarsePointer: true,
      userAgent: "Mozilla/5.0 (Linux; Android 15; Tablet) Mobile",
    }),
    false,
  );
});

test("developer tools viewport detection remains enabled on desktop browsers", () => {
  assert.equal(
    supportsReliableDeveloperToolsViewportDetection({
      maxTouchPoints: 0,
      coarsePointer: false,
      userAgent: "Mozilla/5.0 (X11; Linux x86_64) Chrome/140 Safari/537.36",
    }),
    true,
  );
});

test("learning guard confirms desktop signals and ignores ordinary mobile blur", async () => {
  const guard = await readFile(
    new URL("../composables/useProtectedLearningGuard.ts", import.meta.url),
    "utf8",
  );

  assert.match(guard, /supportsReliableDeveloperToolsViewportDetection/u);
  assert.match(
    guard,
    /consecutiveOpenChecks >= config\.developerToolsOpenChecks/u,
  );
  assert.match(
    guard,
    /config\.blockProtectedWindowBlur &&\s*document\.hidden/u,
  );
});

test("invalid or unavailable browser dimensions do not block content", () => {
  assert.equal(
    hasDeveloperToolsViewportGap(
      { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
      170,
    ),
    false,
  );
});
