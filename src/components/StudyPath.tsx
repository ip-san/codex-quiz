import { useState } from "react";
import { categories, categoryLearning, type Category, type Quiz } from "../data";
import { selectStudyPathQuestions } from "../domain/studyPath";
import { overviewCategoryOrder } from "../domain/overviewPath";
import { DiagramRenderer } from "./DiagramRenderer";
import { quizDiagrams } from "../diagrams";

type Props = { onBack: () => void; onStart: (category: Category, questions: Quiz[]) => void };

const readableExplanation = (value: string) =>
  value
    .replace(/\{\{diagram:\d+\}\}/g, "")
    .replace(/\*\*/g, "")
    .trim();

export default function StudyPath({ onBack, onStart }: Props) {
  const [category, setCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(0);
  const questions = category ? selectStudyPathQuestions(category) : [];
  const current = questions[page];

  return (
    <main className="study-path-page">
      <header className="study-path-header">
        <button
          onClick={
            category
              ? () => {
                  setCategory(null);
                  setPage(0);
                }
              : onBack
          }
        >
          ← {category ? "分野を選び直す" : "学習メニューへ"}
        </button>
        <strong>Codex Quiz</strong>
      </header>
      <div className="study-path-wrap">
        {!category ? (
          <>
            <p className="eyebrow">READ, THEN PRACTICE</p>
            <h1>一つの分野を読んでから、解く。</h1>
            <p className="study-path-lead">
              分野を選び、5つの実務判断の理由を読みます。読み終えた同じ5問で、理解を確かめましょう。
            </p>
            <div className="study-path-categories">
              {overviewCategoryOrder.map((key) => (
                <button
                  key={key}
                  onClick={() => {
                    setCategory(key);
                    setPage(0);
                  }}
                >
                  <span>{String(categoryLearning[key].chapter).padStart(2, "0")}</span>
                  <strong>{categories[key].label}</strong>
                  <small>{categoryLearning[key].goal}</small>
                  <b aria-hidden="true">→</b>
                </button>
              ))}
            </div>
          </>
        ) : current ? (
          <>
            <p className="eyebrow">
              第{categoryLearning[category].chapter}章 · {categories[category].label} · 読む {page + 1}/
              {questions.length}
            </p>
            <h1>{categoryLearning[category].goal}</h1>
            <div
              className="study-path-progress"
              role="progressbar"
              aria-label="読む進捗"
              aria-valuemin={1}
              aria-valuemax={questions.length}
              aria-valuenow={page + 1}
            >
              <span style={{ width: `${((page + 1) / questions.length) * 100}%` }} />
            </div>
            <article className="study-path-card">
              <small>実務での問い</small>
              <h2>{current.question}</h2>
              <div className="study-path-answer">
                <span>判断の要点</span>
                <strong>{current.choices[current.answer]}</strong>
              </div>
              <p>{readableExplanation(current.explanation)}</p>
              <DiagramRenderer diagrams={quizDiagrams[current.id] ?? []} />
              {current.referenceUrl && (
                <a href={current.referenceUrl} target="_blank" rel="noopener noreferrer">
                  OpenAI公式資料を読む（別タブ） ↗
                </a>
              )}
            </article>
            <div className="study-path-actions">
              {page > 0 && (
                <button className="secondary" onClick={() => setPage((value) => value - 1)}>
                  前の要点
                </button>
              )}
              {page < questions.length - 1 ? (
                <button className="primary" onClick={() => setPage((value) => value + 1)}>
                  次の要点 <span>→</span>
                </button>
              ) : (
                <button className="primary" onClick={() => onStart(category, questions)}>
                  同じ5問で確かめる <span>→</span>
                </button>
              )}
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
