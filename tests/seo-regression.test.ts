import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { collectPublicCoursePages, findMissingCourseIds } from "../utils/courseCatalog.ts";
import { resolveCourseSeo, resolveHomepageSeo } from "../utils/seoText.ts";
import { buildAbsoluteSiteUrl } from "../utils/siteUrl.ts";

const readSource = (path: string) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("homepage API metadata is authoritative when present", () => {
  const seo = resolveHomepageSeo({
    metaTitle: "API title",
    metaDescription: "API description",
    heroTitle: "Hero title",
    heroDescription: "Hero description",
    brandName: "Brand",
    siteDescription: "Site fallback",
  });

  assert.deepEqual(seo, {
    title: "API title",
    description: "API description",
  });
});

test("homepage description falls back to hero copy, then site copy", () => {
  assert.equal(resolveHomepageSeo({
    heroTitle: "Hero heading",
    heroDescription: "<p>Hero description</p>",
    siteDescription: "Site description",
  }).description, "Hero description");

  assert.equal(resolveHomepageSeo({
    siteDescription: "Site description",
  }).description, "Site description");
});

test("course SEO is unique and strips markup from descriptions", () => {
  const seo = resolveCourseSeo({
    title: "Course 3327",
    description: "<p>Learn <strong>physics</strong>&nbsp;well</p>",
    fallbackTitle: "Global title",
    fallbackDescription: "Global description",
  });

  assert.deepEqual(seo, {
    title: "Course 3327",
    description: "Learn physics well",
  });
});

test("public URL builder uses SITE_URL origin and normalizes slashes", () => {
  assert.equal(
    buildAbsoluteSiteUrl("https://web.mr-eslamsalama.com/", "//books//17"),
    "https://web.mr-eslamsalama.com/books/17",
  );
  assert.equal(
    buildAbsoluteSiteUrl("https://web.mr-eslamsalama.com", "/"),
    "https://web.mr-eslamsalama.com/",
  );
});

test("sitemap course collection consumes every page and detects omissions", async () => {
  const requestedPages: number[] = [];
  const courses = await collectPublicCoursePages(async (page) => {
    requestedPages.push(page);
    return {
      courses: page === 1 ? [{ id: 10 }, { id: 11 }] : [{ id: 11 }, { id: 12 }],
      lastPage: 2,
    };
  });

  assert.deepEqual(requestedPages, [1, 2]);
  assert.deepEqual(courses.map(({ id }) => id), [10, 11, 12]);
  assert.deepEqual(
    findMissingCourseIds(courses, ["/course/10", "/course/11", "/course/12"]),
    [],
  );
  assert.deepEqual(findMissingCourseIds(courses, ["/course/10"]), [11, 12]);
});

test("book, blog, payment, and sitemap keep tenant and public URLs separate", async () => {
  const [book, blog, payment, sitemap, homeApi, coursePage, courseTabs] = await Promise.all([
    readSource("pages/books/[id].vue"),
    readSource("pages/blogs/[slug].vue"),
    readSource("components/CourseDetails/PaymentDialog.vue"),
    readSource("server/routes/sitemap.xml.ts"),
    readSource("features/HomePageFeature/api/homePageApi.ts"),
    readSource("pages/course/[id]/index.vue"),
    readSource("components/CourseDetails/CourseTabs.vue"),
  ]);

  for (const source of [book, blog, payment, coursePage]) {
    assert.doesNotMatch(source, /https:\/\/\$\{(?:webDomain|getWebDomain\(\)|webLink)/u);
  }
  assert.match(book, /buildSiteUrl\(route\.path\)/u);
  assert.match(blog, /buildSiteUrl\(route\.path\)/u);
  assert.match(payment, /buildSiteUrl\(/u);
  assert.doesNotMatch(payment, /getWebDomain/u);
  assert.match(homeApi, /"web-domain": this\.webDomain/u);
  assert.match(sitemap, /fetchPublicCourseCatalog/u);
  assert.match(sitemap, /path: `\/course\/\$\{course\.id\}`/u);
  assert.match(coursePage, /await fetchCourseDetails/u);
  assert.match(coursePage, /rel: "canonical", href: courseUrl\.value/u);
  assert.match(coursePage, /"@type": "Course"/u);
  assert.doesNotMatch(courseTabs, /onMounted\(\(\) => \{\s*FetchCourseDetails/u);
});

test("course API converts the legacy model instance to an SSR-safe plain object", async () => {
  const courseApi = await readSource(
    "features/FetchCourseDetails/Data/api_services/course_details_api_services.ts",
  );

  assert.match(courseApi, /return \{ \.\.\.CourseDetailsModel\.fromMap\(response\.data\) \}/u);
});
