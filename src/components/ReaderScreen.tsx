import type { ReactNode } from "react";
import { categories, quizzes, type Category } from "../data";
import { quizDiagrams } from "../diagrams";
import type { SavedProgress } from "../domain/progressData";
import { isReviewDue } from "../domain/spacedRepetition";
import { DiagramRenderer } from "./DiagramRenderer";

export type ReaderState = {
  query: string;
  category: Category | "all";
  bookmarksOnly: boolean;
  review: "all" | "weak" | "due";
  visibleCount: number;
  expandedId: string | null;
};

export const initialReaderState: ReaderState = {
  query: "",
  category: "all",
  bookmarksOnly: false,
  review: "all",
  visibleCount: 20,
  expandedId: null,
};

type Props = {
  state: ReaderState;
  onChange: (patch: Partial<ReaderState>) => void;
  progress: SavedProgress;
  onBookmark: (questionId: string) => void;
  onClose: () => void;
  logo: ReactNode;
  storageAlert: ReactNode;
};

export default function ReaderScreen({ state, onChange, progress, onBookmark, onClose, logo, storageAlert }: Props) {
  const weakQuestions = quizzes.filter((quiz) => {
    const history = progress.questions[quiz.id];
    return history && (!history.lastCorrect || history.correct / history.attempts < 0.7);
  });
  const dueQuestions = quizzes.filter((quiz) => isReviewDue(progress.questions[quiz.id]));
  const readerQuestions = quizzes.filter((quiz) => {
    const query = state.query.trim().toLowerCase();
    const matchesQuery =
      query.length < 2 ||
      [quiz.question, quiz.explanation, quiz.choices.join(" "), categories[quiz.category].label].some((text) =>
        text.toLowerCase().includes(query),
      );
    const matchesCategory = state.category === "all" || quiz.category === state.category;
    const matchesBookmark = !state.bookmarksOnly || progress.bookmarks.includes(quiz.id);
    const matchesReview =
      state.review === "all" ||
      (state.review === "weak" ? weakQuestions : dueQuestions).some((item) => item.id === quiz.id);
    return matchesQuery && matchesCategory && matchesBookmark && matchesReview;
  });
  const visibleReaderQuestions = readerQuestions.slice(0, state.visibleCount);
  const changeFilter = (patch: Partial<ReaderState>) => onChange({ ...patch, visibleCount: 20, expandedId: null });

  return (
    <main className="reader-page">
      {storageAlert}
      <header className="reader-header">
        <button className="brand brand-button" onClick={onClose}>
          {logo}
          <b>Codex Quiz</b>
        </button>
        <button className="reader-close" onClick={onClose}>
          閉じる ×
        </button>
      </header>
      <section className="reader-intro">
        <p className="eyebrow">解説リーダー</p>
        <h1>知識を探して、読み返す。</h1>
        <p>全{quizzes.length}問の答えと解説を、キーワードやカテゴリから横断検索できます。</p>
      </section>
      <section className="reader-controls">
        <label className="search-box">
          <span>⌕</span>
          <input
            value={state.query}
            onChange={(event) => changeFilter({ query: event.target.value })}
            placeholder="例: AGENTS.md, MCP, sandbox"
            aria-label="問題を検索"
          />
          {state.query && (
            <button onClick={() => changeFilter({ query: "" })} aria-label="検索をクリア">
              ×
            </button>
          )}
        </label>
        <select
          value={state.category}
          onChange={(event) => changeFilter({ category: event.target.value as Category | "all" })}
          aria-label="カテゴリで絞り込み"
        >
          <option value="all">すべてのカテゴリ</option>
          {Object.entries(categories).map(([key, category]) => (
            <option key={key} value={key}>
              {category.label}
            </option>
          ))}
        </select>
        <button
          className={`filter-button ${state.bookmarksOnly ? "active" : ""}`}
          aria-pressed={state.bookmarksOnly}
          onClick={() => changeFilter({ bookmarksOnly: !state.bookmarksOnly })}
        >
          ★ 保存済み {progress.bookmarks.length}
        </button>
        <select
          aria-label="復習対象で絞り込み"
          value={state.review}
          onChange={(event) => changeFilter({ review: event.target.value as ReaderState["review"] })}
        >
          <option value="all">すべての学習状態</option>
          <option value="weak">苦手問題（{weakQuestions.length}問）</option>
          <option value="due">復習時期が来た問題（{dueQuestions.length}問）</option>
        </select>
      </section>
      <section className="reader-results">
        <p className="reader-count" role="status">
          {visibleReaderQuestions.length} / {readerQuestions.length}件を表示
        </p>
        <div className="reader-list">
          {visibleReaderQuestions.map((quiz) => (
            <article className="reader-card" key={quiz.id}>
              <div className="reader-card-top">
                <span className="reader-category">
                  {categories[quiz.category].icon} {categories[quiz.category].label}
                </span>
                <button
                  className={progress.bookmarks.includes(quiz.id) ? "active" : ""}
                  onClick={() => onBookmark(quiz.id)}
                  aria-label="ブックマークを切り替え"
                >
                  {progress.bookmarks.includes(quiz.id) ? "★" : "☆"}
                </button>
              </div>
              <h2>{quiz.question}</h2>
              <button
                className="reader-expand"
                aria-expanded={state.expandedId === quiz.id}
                onClick={() => onChange({ expandedId: state.expandedId === quiz.id ? null : quiz.id })}
              >
                {state.expandedId === quiz.id ? "解説を閉じる" : "解説を見る"}{" "}
                <span aria-hidden="true">{state.expandedId === quiz.id ? "−" : "+"}</span>
              </button>
              {state.expandedId === quiz.id && (
                <div className="reader-detail">
                  <div className="reader-answer">
                    <small>正解</small>
                    <strong>{quiz.choices[quiz.answer]}</strong>
                  </div>
                  <p>{quiz.explanation}</p>
                  <DiagramRenderer diagrams={quizDiagrams[quiz.id] ?? []} />
                  <div className="reader-source">OpenAI公式 — {quiz.source}</div>
                  <div className="reader-card-actions">
                    <a href={`?q=${encodeURIComponent(quiz.id)}`}>この問題を解く →</a>
                    {quiz.referenceUrl && (
                      <a href={quiz.referenceUrl} target="_blank" rel="noopener noreferrer">
                        公式資料を読む（別タブ）
                      </a>
                    )}
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
        {state.visibleCount < readerQuestions.length && (
          <button className="reader-more secondary" onClick={() => onChange({ visibleCount: state.visibleCount + 20 })}>
            さらに20件を見る
          </button>
        )}
        {readerQuestions.length === 0 && (
          <div className="empty-reader">
            <strong>該当する解説がありません</strong>
            <p>検索語やフィルターを変更してください。</p>
            <button className="secondary" onClick={() => onChange(initialReaderState)}>
              絞り込みをすべて解除
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
