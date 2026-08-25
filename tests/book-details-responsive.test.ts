import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readSource = (path: string) =>
  readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("book cover is centered when the hero becomes a single column", async () => {
  const source = await readFile(
    new URL("../pages/books/[id].vue", import.meta.url),
    "utf8",
  );

  assert.match(
    source,
    /@media \(max-width: 850px\) \{[\s\S]*?\.book-details-page__hero-grid \{[\s\S]*?grid-template-columns: 1fr;[\s\S]*?\.book-details-page__cover \{[\s\S]*?justify-self: center;/u,
  );
});

test("book details use the account endpoint outside the homepage flow", async () => {
  const [apiNames, api, page, homeBooks, mapper, model, nuxtConfig] =
    await Promise.all([
      readSource("base/core/networkStructure/apiNames.ts"),
      readSource("features/HomePageFeature/api/homePageApi.ts"),
      readSource("pages/books/[id].vue"),
      readSource("components/home/v2/sections/HomeBooksSection.vue"),
      readSource("features/HomePageFeature/mappers/homePageMapper.ts"),
      readSource("features/HomePageFeature/models/HomePageViewModel.ts"),
      readSource("nuxt.config.ts"),
    ]);

  assert.match(apiNames, /fetch_book_details = this\.baseUrl \+ "fetch_book_details"/u);
  assert.match(
    api,
    /fetchBookDetails\([\s\S]*ApiNames\.Instance\.fetch_book_details/u,
  );
  assert.match(
    api,
    /fetchHomeBookDetails\([\s\S]*ApiNames\.Instance\.fetch_home_websection_book_details/u,
  );
  assert.match(api, /Authorization: `Bearer \$\{normalizedAccessToken\}`/u);
  assert.match(page, /route\.query\.source === "home"/u);
  assert.match(page, /api\.fetchHomeBookDetails\(bookId\.value\)/u);
  assert.match(
    page,
    /api\.fetchBookDetails\(bookId\.value, accessToken\.value\)/u,
  );
  assert.match(homeBooks, /query: \{ source: 'home' \}/u);
  assert.match(
    mapper,
    /mapBookDetails\(isRecord\(value\.book\) \? value\.book : value\)/u,
  );
  assert.match(model, /ACCEPTED = 1/u);
  assert.match(model, /PENDING = 2/u);
  assert.match(page, /orderStatus === BookOrderStatusEnum\.ACCEPTED/u);
  assert.match(page, /orderStatus === BookOrderStatusEnum\.PENDING/u);
  assert.match(page, /طلب الشراء قيد المراجعة/u);
  assert.match(
    nuxtConfig,
    /'\/books\/\*\*': \{[\s\S]*swr: false,[\s\S]*'Cache-Control': 'private, no-store'/u,
  );
});
