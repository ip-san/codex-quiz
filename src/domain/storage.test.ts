import { expect, it } from "vitest";
import { removeStoredItem, writeStoredJson } from "./storage";

it("writes JSON and removes stored values", () => {
  const values = new Map<string, string>();
  const storage = {
    setItem: (key: string, value: string) => values.set(key, value),
    removeItem: (key: string) => values.delete(key),
  };
  expect(writeStoredJson("progress", { answered: 1 }, storage)).toBe(true);
  expect(values.get("progress")).toBe('{"answered":1}');
  expect(removeStoredItem("progress", storage)).toBe(true);
  expect(values.has("progress")).toBe(false);
});

it("reports storage errors instead of throwing during a quiz", () => {
  const storage = {
    setItem: () => {
      throw new Error("storage blocked");
    },
    removeItem: () => {
      throw new Error("storage blocked");
    },
  };
  expect(writeStoredJson("progress", { answered: 1 }, storage)).toBe(false);
  expect(removeStoredItem("progress", storage)).toBe(false);
});
