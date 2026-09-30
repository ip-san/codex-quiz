import { categoryLearning, quizzes, type Category, type Quiz } from "../data";
import { overviewQuestionIds } from "./overviewPath";

const difficultyRank = { beginner: 0, intermediate: 1, advanced: 2 } as const;

// Reuse the category map's two anchor questions, then add distinct practical questions.
export const selectStudyPathQuestions = (category: Category): Quiz[] => {
  const pool = quizzes.filter((quiz) => quiz.category === category && quiz.value !== "trivia");
  const anchors = overviewQuestionIds
    .map((id) => pool.find((quiz) => quiz.id === id))
    .filter((quiz): quiz is Quiz => Boolean(quiz));
  const remainder = pool
    .filter((quiz) => !anchors.some((anchor) => anchor.id === quiz.id))
    .sort(
      (a, b) =>
        difficultyRank[a.difficulty ?? categoryLearning[category].difficulty] -
        difficultyRank[b.difficulty ?? categoryLearning[category].difficulty],
    );
  return [...anchors, ...remainder].slice(0, 5);
};
