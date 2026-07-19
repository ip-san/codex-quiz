import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

const storage = new Map<string, string>();

beforeEach(() => {
  storage.clear();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
    },
  });
});

describe("accessibility landmarks", () => {
  it("renders a named navigation landmark and main content", () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain('<nav aria-label="メインナビゲーション">');
    expect(html).toContain("<main>");
  });

  it("gives primary navigation buttons accessible text", () => {
    const html = renderToStaticMarkup(<App />);
    expect(html).toContain(">進捗</button>");
    expect(html).toContain("解説を読む");
    expect(html).toContain("ランダム10問を始める");
  });
});
