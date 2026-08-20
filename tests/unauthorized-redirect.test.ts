import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("authenticated 401 responses clear the session and redirect to login", async () => {
  const source = await readFile(
    new URL("../base/Data/ApiService/api_service_interface.ts", import.meta.url),
    "utf8",
  );

  assert.match(source, /case 401:[\s\S]*if \(auth && import\.meta\.client\)/u);
  assert.match(source, /userStore\.logout\(\)/u);
  assert.match(source, /path: "\/loginhome"/u);
  assert.match(source, /query: \{ redirect \}/u);
});
