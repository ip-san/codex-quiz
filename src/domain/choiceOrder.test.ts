import { describe, expect, it } from "vitest";
import { orderChoices } from "./choiceOrder";

describe("choice ordering", () => {
  it("keeps original indices while changing display order", () => {
    const ordered = orderChoices(["A", "B", "C", "D"], () => 0);
    expect(ordered.map((choice) => choice.text)).toEqual(["B", "C", "D", "A"]);
    expect(ordered.find((choice) => choice.text === "A")?.originalIndex).toBe(0);
  });

  it("does not mutate source choices", () => {
    const choices = ["A", "B", "C", "D"];
    orderChoices(choices, () => 0.5);
    expect(choices).toEqual(["A", "B", "C", "D"]);
  });
});
