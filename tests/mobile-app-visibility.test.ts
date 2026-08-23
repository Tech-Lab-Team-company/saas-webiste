import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("mobile app visibility follows the web-status feature flag", async () => {
  const [mapper, home, books, appPage, header, footer] = await Promise.all([
    readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
    readSource("components/home/v2/HomeV2.vue"),
    readSource("pages/books/index.vue"),
    readSource("pages/app.vue"),
    readSource("components/home/v2/sections/HomeHeaderSection.vue"),
    readSource("components/home/v2/sections/HomeFooterSection.vue"),
  ]);

  assert.match(mapper, /enabled: toBooleanFlag\(settings\.have_mobile_app\)/u);
  assert.match(home, /v-if="props\.home\.site\.app\.enabled"/u);
  assert.match(books, /v-if="site\.app\.enabled"/u);
  assert.match(appPage, /v-if="site\.app\.enabled"/u);
  assert.match(header, /props\.site\.app\.enabled/u);
  assert.match(footer, /v-if="site\.app\.enabled"/u);
});
