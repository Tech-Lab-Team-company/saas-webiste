import assert from "node:assert/strict";
import test from "node:test";

import {
  hasDeveloperToolsViewportGap,
  isProtectedLearningPath,
} from "../utils/protectedLearningRoute.ts";

test("only dynamic course and exam routes are protected", () => {
  assert.equal(isProtectedLearningPath("/course"), false);
  assert.equal(isProtectedLearningPath("/course/3250"), true);
  assert.equal(isProtectedLearningPath("/course/3250/81"), true);
  assert.equal(isProtectedLearningPath("/course/3250/timer?exam=81"), true);
  assert.equal(isProtectedLearningPath("/books/12"), false);
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

test("invalid or unavailable browser dimensions do not block content", () => {
  assert.equal(
    hasDeveloperToolsViewportGap(
      { innerWidth: 0, innerHeight: 0, outerWidth: 0, outerHeight: 0 },
      170,
    ),
    false,
  );
});
