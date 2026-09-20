import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const handlers = {};
const deleted = [];
const writes = [];
const shell = new Response("shell");
let online = false;
const cache = {
  match: async (key) => key === "./index.html" ? shell : undefined,
  put: async (key) => { writes.push(key); },
};
runInNewContext(readFileSync(new URL("../public/sw.js", import.meta.url), "utf8"), {
  URL, Response,
  self: {
    addEventListener: (name, handler) => { handlers[name] = handler; },
    location: { origin: "https://example.test" },
    registration: { scope: "https://example.test/quiz/" },
    clients: { claim: async () => {} },
  },
  caches: {
    keys: async () => ["other-app-v1", "codex-quiz-v2", "codex-quiz-v3"],
    delete: async (key) => { deleted.push(key); },
    open: async () => cache,
  },
  fetch: async () => {
    if (!online) throw new Error("offline");
    return new Response("missing", { status: 404 });
  },
});
let activation;
handlers.activate({ waitUntil: (work) => { activation = work; } });
await activation;
assert.deepEqual(deleted, ["codex-quiz-v2"]);

async function request(path, mode = "cors") {
  let response;
  const pending = [];
  handlers.fetch({
    request: { method: "GET", url: path, mode },
    respondWith: (work) => { response = work; },
    waitUntil: (work) => { pending.push(work); },
  });
  const result = await response;
  await Promise.all(pending);
  return result;
}
assert.equal(await request("https://elsewhere.test/image.png"), undefined);
assert.equal(await request("https://example.test/other/app.js"), undefined);
assert.equal(await request("https://example.test/quiz/?q=basic-01", "navigate"), shell);
assert.equal((await request("https://example.test/quiz/missing.js")).type, "error");
online = true;
assert.equal((await request("https://example.test/quiz/missing.js")).status, 404);
assert.equal(writes.length, 0);
console.log("Service worker cache isolation and offline fallback: OK");
