export type OrderedChoice = { text: string; originalIndex: number };

export function orderChoices(choices: string[], random: () => number = Math.random): OrderedChoice[] {
  const ordered = choices.map((text, originalIndex) => ({ text, originalIndex }));
  for (let index = ordered.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  }
  return ordered;
}
