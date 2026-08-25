import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

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
