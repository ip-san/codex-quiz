import type { Category, Quiz } from "../data";

const shuffleWith = <T>(items: T[], random: () => number) => {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }
  return shuffled;
};

export const selectBalancedExam = (pool: Quiz[], limit = 100, random: () => number = Math.random) => {
  const grouped = pool.reduce<Partial<Record<Category, Quiz[]>>>((groups, quiz) => {
    const categoryQuizzes = groups[quiz.category] ?? [];
    categoryQuizzes.push(quiz);
    groups[quiz.category] = categoryQuizzes;
    return groups;
  }, {});
  const categoryOrder = shuffleWith(Object.keys(grouped) as Category[], random);
  const categoryPools = new Map(
    categoryOrder.map((category) => [category, shuffleWith(grouped[category] ?? [], random)]),
  );
  const selected: Quiz[] = [];

  while (selected.length < Math.min(limit, pool.length)) {
    let added = false;
    for (const category of categoryOrder) {
      const quiz = categoryPools.get(category)?.pop();
      if (quiz) {
        selected.push(quiz);
        added = true;
      }
      if (selected.length === Math.min(limit, pool.length)) break;
    }
    if (!added) break;
  }

  return shuffleWith(selected, random);
};
