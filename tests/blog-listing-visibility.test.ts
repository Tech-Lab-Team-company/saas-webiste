import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("blog cards reveal on scroll without hiding the section heading", async () => {
  const page = await readSource("pages/blogs/index.vue");

  assert.match(page, /blogSectionObserver = new IntersectionObserver/u);
  assert.match(page, /blogSectionObserver\.observe\(articleGrid\)/u);
  assert.match(page, /rootMargin: "0px 0px -22% 0px"/u);
  assert.match(page, /gsap\.set\(headingItems, \{ y: 18 \}\)/u);
  assert.doesNotMatch(page, /gsap\.set\(headingItems, \{ autoAlpha: 0/u);
  assert.match(page, /setTimeout\(revealArticles, 7000\)/u);
  assert.match(page, /class="blog-listing__hero-action"/u);
  assert.match(page, /استعرض المقالات/u);
  assert.match(page, /<div v-if="blogs\.length" class="blog-listing__grid">/u);
  assert.match(page, /\.blog-listing__main \{\s*padding: 46px 0 100px;/u);
});
