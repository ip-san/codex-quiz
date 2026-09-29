import { categoryLearning, quizzes, type Category, type Quiz } from "../data";

// A short map of the product, not a substitute for completing every category.
export const overviewQuestionIds = [
  "basic-02",
  "basic-03",
  "prompt-01",
  "prompt-18",
  "agents-01",
  "agents-04",
  "safe-03",
  "safe-09",
  "config-02",
  "config-14",
  "extend-02",
  "extend-05",
  "session-05",
  "session-21",
  "workflow-01",
  "workflow-03",
  "surfaces-01",
  "surfaces-02",
] as const;

export const selectOverviewQuestions = (): Quiz[] => {
  const byId = new Map(quizzes.map((quiz) => [quiz.id, quiz]));
  return overviewQuestionIds.map((id) => byId.get(id)).filter((quiz): quiz is Quiz => Boolean(quiz));
};

export const overviewCategoryOrder: Category[] = Object.keys(categoryLearning)
  .map((category) => category as Category)
  .sort((a, b) => categoryLearning[a].chapter - categoryLearning[b].chapter);
