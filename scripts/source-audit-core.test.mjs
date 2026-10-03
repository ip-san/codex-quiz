import assert from "node:assert/strict";
import test from "node:test";
import { canonicalPageUrl, classifySources, contentHash, groupQuestionsBySource, markdownUrl, prioritizeQuestions } from "./source-audit-core.mjs";

test("keeps surface variants distinct while sharing section anchors", () => {
  const cli = canonicalPageUrl("https://learn.chatgpt.com/docs/developer-commands?surface=cli#review");
  const ide = canonicalPageUrl("https://learn.chatgpt.com/docs/developer-commands?surface=ide#review");
  assert.equal(cli, "https://learn.chatgpt.com/docs/developer-commands?surface=cli");
  assert.notEqual(cli, ide);
  assert.equal(markdownUrl(cli), "https://learn.chatgpt.com/docs/developer-commands.md?surface=cli");
});

test("rejects non-official sources and normalizes line endings", () => {
  assert.throws(() => canonicalPageUrl("https://example.com/docs/agents-md"));
  assert.equal(contentHash("first\r\nsecond\r\n"), contentHash("first\nsecond"));
  assert.notEqual(contentHash("first"), contentHash("changed"));
});

test("groups dependent questions and puts practical, older checks first", () => {
  const url = "https://learn.chatgpt.com/docs/permissions";
  const quizzes = [
    { id: "a", referenceUrl: `${url}#one`, value: "reference", verifiedAt: "2026-01-01" },
    { id: "c", referenceUrl: `${url}#two`, value: "practical", verifiedAt: "2026-09-01" },
    { id: "b", referenceUrl: url, value: "practical", verifiedAt: "2026-07-01" },
  ];
  const sources = groupQuestionsBySource(quizzes);
  assert.equal(sources.size, 1);
  assert.deepEqual(prioritizeQuestions(sources.get(url)).map(({ id }) => id), ["b", "c", "a"]);
});

test("separates changed, new and unused sources without treating unchanged pages as changes", () => {
  const source = "https://learn.chatgpt.com/docs/permissions";
  const fresh = "https://learn.chatgpt.com/docs/prompting";
  const old = "https://learn.chatgpt.com/docs/obsolete";
  const bySource = new Map([[source, [{ id: "a" }]], [fresh, [{ id: "b" }]]]);
  const known = new Map([[source, "before"], [old, "old"]]);
  const current = new Map([[source, "after"], [fresh, "new"]]);
  const result = classifySources(bySource, known, current);
  assert.deepEqual(result.changed.map(([url]) => url), [source]);
  assert.deepEqual(result.newSources.map(([url]) => url), [fresh]);
  assert.deepEqual(result.removed, [old]);
  assert.equal(classifySources(bySource, known, new Map([[source, "before"], [fresh, "new"]])).changed.length, 0);
});
