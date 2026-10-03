import { createHash } from "node:crypto";

const officialHosts = new Set(["learn.chatgpt.com", "developers.openai.com"]);

export function canonicalPageUrl(referenceUrl) {
  const url = new URL(referenceUrl);
  if (!officialHosts.has(url.hostname)) throw new Error(`Not an official OpenAI docs URL: ${referenceUrl}`);
  url.hash = "";
  return url.href;
}

export function markdownUrl(pageUrl) {
  const url = new URL(pageUrl);
  if (!url.pathname.endsWith(".md")) url.pathname += ".md";
  return url.href;
}

export function contentHash(markdown) {
  const normalized = markdown.replace(/\r\n?/g, "\n").trim();
  return createHash("sha256").update(normalized).digest("hex");
}

export function groupQuestionsBySource(quizzes) {
  const sources = new Map();
  for (const quiz of quizzes) {
    const url = canonicalPageUrl(quiz.referenceUrl);
    sources.set(url, [...(sources.get(url) ?? []), quiz]);
  }
  return new Map([...sources].sort(([a], [b]) => a.localeCompare(b)));
}

export function prioritizeQuestions(quizzes) {
  return [...quizzes].sort(
    (a, b) => Number(b.value === "practical") - Number(a.value === "practical")
      || a.verifiedAt.localeCompare(b.verifiedAt)
      || a.id.localeCompare(b.id),
  );
}

export function classifySources(bySource, known, current) {
  const changed = [...bySource].filter(([url]) => known.has(url) && known.get(url) !== current.get(url));
  const newSources = [...bySource].filter(([url]) => !known.has(url));
  const removed = [...known.keys()].filter((url) => !bySource.has(url));
  return { changed, newSources, removed };
}
