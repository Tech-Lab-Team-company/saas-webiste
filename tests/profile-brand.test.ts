import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { resolveStudentIdentity } from "../utils/studentIdentity.ts";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("profile identity uses the student's first name and initial", () => {
  assert.deepEqual(
    resolveStudentIdentity({ name: "Ahmed Gamal" }),
    { fullName: "Ahmed Gamal", firstName: "Ahmed", initial: "A" },
  );

  assert.deepEqual(
    resolveStudentIdentity({
      name: "أحمد جمال",
      firstName: "أحمد",
      lastName: "جمال",
    }),
    { fullName: "أحمد جمال", firstName: "أحمد", initial: "أ" },
  );
});

test("profile identity removes a phone accidentally appended to the name", () => {
  assert.deepEqual(
    resolveStudentIdentity({ name: "Carly +1 (801) 289-4467" }),
    { fullName: "Carly", firstName: "Carly", initial: "C" },
  );
  assert.deepEqual(resolveStudentIdentity(null), {
    fullName: "",
    firstName: "",
    initial: "",
  });
});

test("profile brand is dynamic and has a professional fallback", async () => {
  const sidebar = await readSource("components/Profile/ProfileSidebar.vue");

  assert.doesNotMatch(sidebar, />ES</u);
  assert.match(sidebar, /studentIdentity\.initial/u);
  assert.match(sidebar, /مرحبًا، \{\{ studentIdentity\.firstName \}\}/u);
  assert.match(sidebar, /v-else class="pi pi-user"/u);
  assert.match(sidebar, /studentIdentity\.fullName \|\| "الطالب"/u);
});

test("tablet and mobile profile navigation is compact and avoids horizontal scrolling", async () => {
  const [sidebar, styles] = await Promise.all([
    readSource("components/Profile/ProfileSidebar.vue"),
    readSource("assets/style/profile-redesign/profile.scss"),
  ]);

  assert.match(sidebar, />قائمة الحساب</u);
  assert.match(sidebar, /أنت الآن في/u);
  assert.match(sidebar, /:aria-expanded="isMobileNavigationOpen"/u);
  assert.match(sidebar, /'is-mobile-open': isMobileNavigationOpen/u);
  assert.match(styles, /@media \(max-width: 820px\)/u);
  assert.match(styles, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/u);
  assert.match(styles, /\.profile-options\.is-mobile-open/u);
  assert.doesNotMatch(styles, /\.profile-options \{[\s\S]{0,180}overflow-x: auto/u);
});

test("student dashboard switches to one column at the shared tablet breakpoint", async () => {
  const dashboard = await readSource("pages/student-dashboard.vue");

  assert.match(
    dashboard,
    /@media \(max-width: 820px\) \{[\s\S]*?\.continue-panel \{[\s\S]*?grid-template-columns: 1fr;/u,
  );
  assert.match(
    dashboard,
    /@media \(max-width: 820px\) \{[\s\S]*?\.course-grid,[\s\S]*?grid-template-columns: 1fr;/u,
  );
});

test("profile dashboard fills intermediate viewports without an empty side gutter", async () => {
  const styles = await readSource("assets/style/profile-redesign/profile.scss");

  assert.match(styles, /\.app-route-view:has\(\.profile-redesign-page\)/u);
  assert.match(styles, /body:has\(\.profile-redesign-page\) \{[\s\S]*?width: 100%/u);
  assert.match(
    styles,
    /\.profile-redesign-page \.prfile-home\.profile-dashboard \{[\s\S]*?max-width: none/u,
  );
  assert.match(
    styles,
    /\.profile-dashboard-sidebar\.profile-sidebar-container \{[\s\S]*?width: 100%;[\s\S]*?margin: 0;/u,
  );
  assert.match(
    styles,
    /@media \(max-width: 980px\) \{[\s\S]*?\.profile-redesign-page \.prfile-home\.profile-dashboard \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\) 230px;/u,
  );
  assert.match(styles, /overflow-x: clip/u);
});
