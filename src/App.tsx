import { useEffect, useMemo, useRef, useState } from "react";
import { categories, categoryLearning, quizzes, type Category, type Quiz } from "./data";
import { orderChoices } from "./domain/choiceOrder";
import { DiagramRenderer } from "./components/DiagramRenderer";
import { quizDiagrams } from "./diagrams";
import {
  emptyProgress,
  parseProgressExport,
  serializeProgress,
  type SavedProgress,
  type SessionRecord,
} from "./domain/progressData";
import { getReviewLabel, isReviewDue, scheduleReview, type QuestionProgress } from "./domain/spacedRepetition";

type Screen = "home" | "quiz" | "result" | "reader" | "progress";
type QuizMode = "normal" | "study" | "exam" | "overview";
type ResumeSession = {
  ids: string[];
  index: number;
  score: number;
  label: string;
  category: Category | null;
  selected: number | null;
  mode?: QuizMode;
};

const readResumeSession = (): ResumeSession | null => {
  try {
    const value = JSON.parse(localStorage.getItem("codex-quiz-session") ?? "null") as ResumeSession | null;
    if (!value || !Array.isArray(value.ids) || value.ids.length === 0) return null;
    if (value.index < 0 || value.index >= value.ids.length) return null;
    if (value.ids.some((id) => !quizzes.some((quiz) => quiz.id === id))) return null;
    return value;
  } catch {
    return null;
  }
};

const readProgress = (): SavedProgress => {
  try {
    const stored = JSON.parse(localStorage.getItem("codex-quiz-progress") ?? "") as Partial<SavedProgress>;
    return {
      answered: stored.answered ?? 0,
      correct: stored.correct ?? 0,
      questions: stored.questions ?? {},
      bookmarks: stored.bookmarks ?? [],
      history: stored.history ?? [],
    };
  } catch {
    return emptyProgress;
  }
};

const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

const dateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const calculateStreak = (history: SessionRecord[]) => {
  const studied = new Set(history.map((record) => dateKey(new Date(record.completedAt))));
  const cursor = new Date();
  if (!studied.has(dateKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (studied.has(dateKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
};

function Logo() {
  return (
    <div className="logo-mark" aria-hidden="true">
      <span>⌁</span>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgress] = useState<SavedProgress>(readProgress);
  const [session, setSession] = useState<Quiz[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [readerQuery, setReaderQuery] = useState("");
  const [readerCategory, setReaderCategory] = useState<Category | "all">("all");
  const [bookmarksOnly, setBookmarksOnly] = useState(false);
  const [sessionLabel, setSessionLabel] = useState("ランダム10問");
  const [sessionCategory, setSessionCategory] = useState<Category | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [dataMessage, setDataMessage] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const [resumableSession, setResumableSession] = useState<ResumeSession | null>(readResumeSession);
  const [quizMode, setQuizMode] = useState<QuizMode>("normal");
  const [studyPhase, setStudyPhase] = useState(false);
  const [showChapterIntro, setShowChapterIntro] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const questionId = params.get("q");
    const category = params.get("category") as Category | null;
    if (view === "reader" || view === "progress") {
      setScreen(view);
      return;
    }
    const sharedQuestion = quizzes.find((quiz) => quiz.id === questionId);
    if (sharedQuestion) {
      setSession([sharedQuestion]);
      setSessionLabel("共有された問題");
      setScreen("quiz");
      return;
    }
    if (category && category in categories) {
      setSession(shuffle(quizzes.filter((quiz) => quiz.category === category)));
      setSessionCategory(category);
      setSessionLabel(categories[category].label);
      setScreen("quiz");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (screen === "reader" || screen === "progress") params.set("view", screen);
    if (screen === "quiz" && sessionCategory) params.set("category", sessionCategory);
    const search = params.size ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, "", search);
  }, [screen, sessionCategory]);

  const question = session[index];
  const displayedChoices = useMemo(() => (question ? orderChoices(question.choices) : []), [question]);
  const accuracy = progress.answered ? Math.round((progress.correct / progress.answered) * 100) : 0;
  const categoryCounts = useMemo(
    () =>
      Object.keys(categories).map((key) => {
        const category = key as Category;
        const categoryQuizzes = quizzes.filter((quiz) => quiz.category === category);
        const completed = categoryQuizzes.filter((quiz) => progress.questions[quiz.id]?.lastCorrect).length;
        return { key: category, count: categoryQuizzes.length, completed };
      }),
    [progress],
  );
  const weakQuestions = quizzes.filter((quiz) => {
    const history = progress.questions[quiz.id];
    return history && (!history.lastCorrect || history.correct / history.attempts < 0.7);
  });
  const dueQuestions = quizzes.filter((quiz) => isReviewDue(progress.questions[quiz.id]));
  const readerQuestions = quizzes.filter((quiz) => {
    const query = readerQuery.trim().toLowerCase();
    const matchesQuery =
      query.length < 2 ||
      [quiz.question, quiz.explanation, quiz.choices.join(" "), categories[quiz.category].label].some((text) =>
        text.toLowerCase().includes(query),
      );
    const matchesCategory = readerCategory === "all" || quiz.category === readerCategory;
    const matchesBookmark = !bookmarksOnly || progress.bookmarks.includes(quiz.id);
    return matchesQuery && matchesCategory && matchesBookmark;
  });
  const streak = calculateStreak(progress.history);
  const categoryStats = Object.keys(categories).map((key) => {
    const category = key as Category;
    const ids = quizzes.filter((quiz) => quiz.category === category).map((quiz) => quiz.id);
    const records = ids
      .map((id) => progress.questions[id])
      .filter((record): record is QuestionProgress => Boolean(record));
    const attempts = records.reduce((sum, record) => sum + record.attempts, 0);
    const correct = records.reduce((sum, record) => sum + record.correct, 0);
    return { category, attempts, accuracy: attempts ? Math.round((correct / attempts) * 100) : 0 };
  });

  const start = (category?: Category) => {
    const pool = category ? quizzes.filter((quiz) => quiz.category === category) : quizzes;
    const nextSession = shuffle(pool).slice(0, category ? pool.length : 10);
    const label = category ? categories[category].label : "ランダム10問";
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSessionLabel(label);
    setSessionCategory(category ?? null);
    setQuizMode("normal");
    setStudyPhase(false);
    setScreen("quiz");
    const resume = {
      ids: nextSession.map((quiz) => quiz.id),
      index: 0,
      score: 0,
      label,
      category: category ?? null,
      selected: null,
      mode: "normal" as const,
    };
    localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
    setResumableSession(resume);
    window.scrollTo(0, 0);
  };

  const startWeak = () => {
    const nextSession = shuffle(weakQuestions);
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSessionLabel("苦手問題の復習");
    setSessionCategory(null);
    setQuizMode("normal");
    setScreen("quiz");
    const resume = {
      ids: nextSession.map((quiz) => quiz.id),
      index: 0,
      score: 0,
      label: "苦手問題の復習",
      category: null,
      selected: null,
      mode: "normal" as const,
    };
    localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
    setResumableSession(resume);
    window.scrollTo(0, 0);
  };

  const startDue = () => {
    const nextSession = shuffle(dueQuestions).slice(0, 3);
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSessionLabel("60秒チェック");
    setSessionCategory(null);
    setQuizMode("normal");
    setScreen("quiz");
    const resume = {
      ids: nextSession.map((quiz) => quiz.id),
      index: 0,
      score: 0,
      label: "60秒チェック",
      category: null,
      selected: null,
      mode: "normal" as const,
    };
    localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
    setResumableSession(resume);
    window.scrollTo(0, 0);
  };

  const startMode = (mode: Exclude<QuizMode, "normal">) => {
    const nextSession =
      mode === "overview"
        ? [...quizzes].sort((a, b) => categoryLearning[a.category].chapter - categoryLearning[b.category].chapter)
        : shuffle(quizzes).slice(0, mode === "exam" ? quizzes.length : 10);
    const label = mode === "overview" ? "全体像学習パス" : mode === "study" ? "読んでから解く" : "実力テスト";
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSessionLabel(label);
    setSessionCategory(null);
    setQuizMode(mode);
    setStudyPhase(mode === "study");
    setShowChapterIntro(mode === "overview");
    setScreen("quiz");
    const resume = {
      ids: nextSession.map((quiz) => quiz.id),
      index: 0,
      score: 0,
      label,
      category: null,
      selected: null,
      mode,
    };
    localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
    setResumableSession(resume);
    window.scrollTo(0, 0);
  };

  const answer = (choice: number) => {
    if (selected !== null) return;
    const correct = choice === question.answer;
    setSelected(choice);
    if (correct) setScore((value) => value + 1);
    const previous = progress.questions[question.id];
    const next = {
      answered: progress.answered + 1,
      correct: progress.correct + (correct ? 1 : 0),
      bookmarks: progress.bookmarks,
      history: progress.history,
      questions: {
        ...progress.questions,
        [question.id]: scheduleReview(previous, correct),
      },
    };
    setProgress(next);
    localStorage.setItem("codex-quiz-progress", JSON.stringify(next));
    const resume = {
      ids: session.map((quiz) => quiz.id),
      index,
      score: score + (correct ? 1 : 0),
      label: sessionLabel,
      category: sessionCategory,
      selected: choice,
      mode: quizMode,
    };
    localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
    setResumableSession(resume);
  };

  const resetProgress = () => {
    if (!window.confirm("これまでの回答履歴と正答率をリセットしますか？")) return;
    localStorage.removeItem("codex-quiz-progress");
    setProgress(emptyProgress);
  };

  const toggleBookmark = (questionId: string) => {
    const bookmarks = progress.bookmarks.includes(questionId)
      ? progress.bookmarks.filter((id) => id !== questionId)
      : [...progress.bookmarks, questionId];
    const next = { ...progress, bookmarks };
    setProgress(next);
    localStorage.setItem("codex-quiz-progress", JSON.stringify(next));
  };

  const exportProgress = () => {
    const blob = new Blob([serializeProgress(progress)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `codex-quiz-progress-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setDataMessage("学習データを書き出しました");
  };

  const shareQuestion = async (quiz: Quiz) => {
    const url = new URL(window.location.href);
    url.search = "";
    url.searchParams.set("q", quiz.id);
    try {
      if (navigator.share) await navigator.share({ title: "Codex Quiz", text: quiz.question, url: url.toString() });
      else await navigator.clipboard.writeText(url.toString());
      setShareMessage("共有URLをコピーしました");
    } catch {
      setShareMessage("");
    }
  };

  const importProgress = async (file: File | undefined) => {
    if (!file) return;
    try {
      const imported = parseProgressExport(await file.text());
      if (!window.confirm("現在の学習データを、選択したファイルの内容で置き換えますか？")) return;
      setProgress(imported);
      localStorage.setItem("codex-quiz-progress", JSON.stringify(imported));
      setDataMessage("学習データを読み込みました");
    } catch (error) {
      setDataMessage(error instanceof Error ? error.message : "学習データを読み込めませんでした");
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
    }
  };

  const next = () => {
    if (index + 1 >= session.length) {
      const record: SessionRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        completedAt: new Date().toISOString(),
        score,
        total: session.length,
        label: sessionLabel,
      };
      const nextProgress = { ...progress, history: [record, ...progress.history].slice(0, 50) };
      setProgress(nextProgress);
      localStorage.setItem("codex-quiz-progress", JSON.stringify(nextProgress));
      localStorage.removeItem("codex-quiz-session");
      setResumableSession(null);
      setScreen("result");
    } else {
      setIndex((value) => value + 1);
      setSelected(null);
      setStudyPhase(quizMode === "study");
      if (quizMode === "overview" && session[index + 1]?.category !== question.category) setShowChapterIntro(true);
      const resume = {
        ids: session.map((quiz) => quiz.id),
        index: index + 1,
        score,
        label: sessionLabel,
        category: sessionCategory,
        selected: null,
        mode: quizMode,
      };
      localStorage.setItem("codex-quiz-session", JSON.stringify(resume));
      setResumableSession(resume);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resumeQuiz = () => {
    if (!resumableSession) return;
    const restored = resumableSession.ids
      .map((id) => quizzes.find((quiz) => quiz.id === id))
      .filter((quiz): quiz is Quiz => Boolean(quiz));
    if (restored.length !== resumableSession.ids.length) return;
    setSession(restored);
    setIndex(resumableSession.index);
    setScore(resumableSession.score);
    setSelected(resumableSession.selected);
    setSessionLabel(resumableSession.label);
    setSessionCategory(resumableSession.category);
    setQuizMode(resumableSession.mode ?? "normal");
    setStudyPhase((resumableSession.mode ?? "normal") === "study" && resumableSession.selected === null);
    setScreen("quiz");
  };

  const discardResume = () => {
    localStorage.removeItem("codex-quiz-session");
    setResumableSession(null);
  };

  useEffect(() => {
    if (screen !== "quiz" || !question) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (selected === null && ["1", "2", "3", "4"].includes(event.key)) {
        const displayedIndex = Number(event.key) - 1;
        const originalIndex = displayedChoices[displayedIndex]?.originalIndex;
        if (originalIndex !== undefined) answer(originalIndex);
      } else if (selected !== null && event.key === "Enter") {
        next();
      } else if (event.key.toLowerCase() === "b") {
        toggleBookmark(question.id);
      } else if (event.key === "Escape") {
        setScreen("home");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (selected !== null) feedbackRef.current?.focus();
  }, [selected]);

  if (screen === "quiz" && question && quizMode === "overview" && showChapterIntro) {
    const learning = categoryLearning[question.category];
    return (
      <main className="chapter-page">
        <div className="chapter-card">
          <span className="chapter-number">CHAPTER {learning.chapter} / 9</span>
          <div className="chapter-icon">{categories[question.category].icon}</div>
          <p className="eyebrow">{categories[question.category].label}</p>
          <h1>{learning.goal}</h1>
          <p>
            {categories[question.category].description}を、公式情報に基づく
            {session.filter((quiz) => quiz.category === question.category).length}問で学びます。
          </p>
          <button className="primary" onClick={() => setShowChapterIntro(false)}>
            チャプターを始める <span>→</span>
          </button>
          <button className="chapter-exit" onClick={() => setScreen("home")}>
            学習パスを終了
          </button>
        </div>
      </main>
    );
  }

  if (screen === "quiz" && question) {
    return (
      <main className="quiz-shell">
        <header className="quiz-header">
          <button className="brand brand-button" onClick={() => setScreen("home")} aria-label="ホームへ戻る">
            <Logo />
            <b>Codex Quiz</b>
          </button>
          <div className="quiz-header-meta">
            <span className="key-hint">1–4 回答 · Enter 次へ · B 保存</span>
            <span className="question-count">
              {index + 1} / {session.length}
            </span>
          </div>
        </header>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="クイズの進捗"
          aria-valuemin={1}
          aria-valuemax={session.length}
          aria-valuenow={index + 1}
          aria-valuetext={`${session.length}問中${index + 1}問目`}
        >
          <span style={{ width: `${((index + 1) / session.length) * 100}%` }} />
        </div>
        <section className="question-card">
          <div className="question-tools">
            <div className="eyebrow">
              <span>{categories[question.category].icon}</span>
              {categories[question.category].label}
            </div>
            <div className="question-actions">
              <button onClick={() => void shareQuestion(question)}>↗ 共有</button>
              <button
                className={`bookmark-button ${progress.bookmarks.includes(question.id) ? "active" : ""}`}
                onClick={() => toggleBookmark(question.id)}
                aria-label={progress.bookmarks.includes(question.id) ? "ブックマークを解除" : "ブックマークに追加"}
              >
                {progress.bookmarks.includes(question.id) ? "★ 保存済み" : "☆ 後で読む"}
              </button>
            </div>
          </div>
          {shareMessage && (
            <span className="share-message" role="status">
              {shareMessage}
            </span>
          )}
          {quizMode === "study" && studyPhase ? (
            <div className="study-first">
              <span>READ FIRST</span>
              <h1>{question.explanation}</h1>
              <DiagramRenderer diagrams={quizDiagrams[question.id] ?? []} />
              <div>
                <small>この知識のポイント</small>
                <strong>{question.choices[question.answer]}</strong>
              </div>
              <button className="primary" onClick={() => setStudyPhase(false)}>
                理解したら問題へ <span>→</span>
              </button>
            </div>
          ) : (
            <>
              <h1 id="question-title">{question.question}</h1>
              <fieldset
                className="choices"
                aria-labelledby="question-title"
                style={{ margin: 0, padding: 0, border: 0, minWidth: 0 }}
              >
                {displayedChoices.map((choice, choiceIndex) => {
                  let state = "";
                  if (quizMode !== "exam") {
                    if (selected !== null && choice.originalIndex === question.answer) state = "correct";
                    else if (selected === choice.originalIndex) state = "wrong";
                  } else if (selected === choice.originalIndex) state = "exam-selected";
                  return (
                    <button
                      className={`choice ${state}`}
                      key={choice.originalIndex}
                      onClick={() => answer(choice.originalIndex)}
                      disabled={selected !== null}
                      aria-pressed={selected === choice.originalIndex}
                    >
                      <span className="choice-letter">{String.fromCharCode(65 + choiceIndex)}</span>
                      <span>{choice.text}</span>
                      {state === "correct" && <b className="choice-result">✓</b>}
                      {state === "wrong" && <b className="choice-result">×</b>}
                    </button>
                  );
                })}
              </fieldset>
              {selected !== null && (
                <div
                  ref={feedbackRef}
                  className={`feedback ${quizMode === "exam" ? "is-exam" : selected === question.answer ? "is-correct" : "is-wrong"}`}
                  role="status"
                  aria-live="polite"
                  tabIndex={-1}
                >
                  <strong>
                    {quizMode === "exam"
                      ? "回答を記録しました"
                      : selected === question.answer
                        ? "正解です"
                        : "惜しい！"}
                  </strong>
                  {quizMode !== "exam" && (
                    <>
                      {selected !== question.answer && question.wrongFeedback?.[selected] && (
                        <p className="wrong-feedback">
                          <b>この選択肢が違う理由</b>
                          {question.wrongFeedback[selected]}
                        </p>
                      )}
                      <p>{question.explanation}</p>
                      <DiagramRenderer diagrams={quizDiagrams[question.id] ?? []} />
                      <span className="review-schedule">↻ {getReviewLabel(progress.questions[question.id])}</span>
                      <small>出典: OpenAI公式 — {question.source}</small>
                    </>
                  )}
                  <button className="primary next-button" onClick={next}>
                    {index + 1 === session.length ? "結果を見る" : "次の問題へ"}
                    <span>→</span>
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </main>
    );
  }

  if (screen === "result") {
    const percent = Math.round((score / session.length) * 100);
    return (
      <main className="result-page">
        <div className="result-card">
          <Logo />
          <p className="eyebrow result-label">SESSION COMPLETE</p>
          <h1>{percent >= 80 ? "すばらしい！" : percent >= 60 ? "いい調子です" : "ここから伸びます"}</h1>
          <div className="score-ring" style={{ "--score": `${percent * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{score}</strong>
              <span>/ {session.length}</span>
            </div>
          </div>
          <p>正答率 {percent}%</p>
          <div className="result-actions">
            <button className="primary" onClick={() => start()}>
              もう一度挑戦
            </button>
            <button className="secondary" onClick={() => setScreen("home")}>
              ホームへ
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (screen === "reader") {
    return (
      <main className="reader-page">
        <header className="reader-header">
          <button className="brand brand-button" onClick={() => setScreen("home")}>
            <Logo />
            <b>Codex Quiz</b>
          </button>
          <button className="reader-close" onClick={() => setScreen("home")}>
            閉じる ×
          </button>
        </header>
        <section className="reader-intro">
          <p className="eyebrow">EXPLANATION READER</p>
          <h1>知識を探して、読み返す。</h1>
          <p>全{quizzes.length}問の答えと解説を、キーワードやカテゴリから横断検索できます。</p>
        </section>
        <section className="reader-controls">
          <label className="search-box">
            <span>⌕</span>
            <input
              value={readerQuery}
              onChange={(event) => setReaderQuery(event.target.value)}
              placeholder="例: AGENTS.md, MCP, sandbox"
              aria-label="問題を検索"
            />
            {readerQuery && (
              <button onClick={() => setReaderQuery("")} aria-label="検索をクリア">
                ×
              </button>
            )}
          </label>
          <select
            value={readerCategory}
            onChange={(event) => setReaderCategory(event.target.value as Category | "all")}
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
            className={`filter-button ${bookmarksOnly ? "active" : ""}`}
            onClick={() => setBookmarksOnly((value) => !value)}
          >
            ★ 保存済み {progress.bookmarks.length}
          </button>
        </section>
        <section className="reader-results">
          <p className="reader-count">{readerQuestions.length}件を表示</p>
          <div className="reader-list">
            {readerQuestions.map((quiz) => (
              <article className="reader-card" key={quiz.id}>
                <div className="reader-card-top">
                  <span className="reader-category">
                    {categories[quiz.category].icon} {categories[quiz.category].label}
                  </span>
                  <button
                    className={progress.bookmarks.includes(quiz.id) ? "active" : ""}
                    onClick={() => toggleBookmark(quiz.id)}
                    aria-label="ブックマークを切り替え"
                  >
                    {progress.bookmarks.includes(quiz.id) ? "★" : "☆"}
                  </button>
                </div>
                <h2>{quiz.question}</h2>
                <div className="reader-answer">
                  <small>正解</small>
                  <strong>{quiz.choices[quiz.answer]}</strong>
                </div>
                <p>{quiz.explanation}</p>
                <DiagramRenderer diagrams={quizDiagrams[quiz.id] ?? []} />
                <div className="reader-source">OpenAI公式 — {quiz.source}</div>
              </article>
            ))}
          </div>
          {readerQuestions.length === 0 && (
            <div className="empty-reader">
              <strong>該当する解説がありません</strong>
              <p>検索語やフィルターを変更してください。</p>
            </div>
          )}
        </section>
      </main>
    );
  }

  if (screen === "progress") {
    const bestScore = progress.history.length
      ? Math.max(...progress.history.map((record) => Math.round((record.score / record.total) * 100)))
      : 0;
    return (
      <main className="dashboard-page">
        <header className="reader-header">
          <button className="brand brand-button" onClick={() => setScreen("home")}>
            <Logo />
            <b>Codex Quiz</b>
          </button>
          <button className="reader-close" onClick={() => setScreen("home")}>
            閉じる ×
          </button>
        </header>
        <section className="dashboard-wrap">
          <div className="dashboard-title">
            <div>
              <p className="eyebrow">YOUR PROGRESS</p>
              <h1>学習の現在地</h1>
              <p>積み重ねた回答から、得意と次に学ぶ分野を確認できます。</p>
            </div>
            <div className="streak-card">
              <span>連続学習</span>
              <strong>
                {streak}
                <small>日</small>
              </strong>
            </div>
          </div>
          <div className="dashboard-stats">
            <div>
              <span>総回答数</span>
              <strong>{progress.answered}</strong>
              <small>answers</small>
            </div>
            <div>
              <span>通算正答率</span>
              <strong>{accuracy}%</strong>
              <small>accuracy</small>
            </div>
            <div>
              <span>完了セッション</span>
              <strong>{progress.history.length}</strong>
              <small>sessions</small>
            </div>
            <div>
              <span>ベストスコア</span>
              <strong>{bestScore}%</strong>
              <small>personal best</small>
            </div>
          </div>
          <div className="dashboard-grid">
            <section className="mastery-panel">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">MASTERY</p>
                  <h2>カテゴリ別の正答率</h2>
                </div>
                <small>全回答から集計</small>
              </div>
              <div className="mastery-list">
                {categoryStats.map(({ category, attempts, accuracy: categoryAccuracy }) => (
                  <div className="mastery-row" key={category}>
                    <span className="mastery-icon">{categories[category].icon}</span>
                    <div>
                      <strong>{categories[category].label}</strong>
                      <span className="mastery-track">
                        <i style={{ width: `${categoryAccuracy}%` }} />
                      </span>
                    </div>
                    <b>{attempts ? `${categoryAccuracy}%` : "—"}</b>
                  </div>
                ))}
              </div>
            </section>
            <section className="history-panel">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">RECENT SESSIONS</p>
                  <h2>最近の学習</h2>
                </div>
              </div>
              {progress.history.length > 0 ? (
                <div className="history-list">
                  {progress.history.slice(0, 8).map((record) => (
                    <div className="history-row" key={record.id}>
                      <div>
                        <strong>{record.label}</strong>
                        <small>
                          {new Intl.DateTimeFormat("ja-JP", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(record.completedAt))}
                        </small>
                      </div>
                      <span className={record.score / record.total >= 0.8 ? "high" : ""}>
                        {record.score}/{record.total}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-history">
                  <span>◌</span>
                  <strong>まだ履歴がありません</strong>
                  <p>クイズを最後まで解くと、ここに記録されます。</p>
                  <button className="primary" onClick={() => start()}>
                    10問を始める
                  </button>
                </div>
              )}
            </section>
          </div>
          <section className="data-panel">
            <div>
              <p className="eyebrow">DATA PORTABILITY</p>
              <h2>学習データの管理</h2>
              <p>SRS、ブックマーク、回答履歴をJSONファイルでバックアップできます。</p>
            </div>
            <div className="data-actions">
              <button className="secondary" onClick={exportProgress}>
                ↓ エクスポート
              </button>
              <button className="secondary" onClick={() => importInputRef.current?.click()}>
                ↑ インポート
              </button>
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                onChange={(event) => void importProgress(event.target.files?.[0])}
              />
            </div>
            {dataMessage && (
              <p className="data-message" role="status">
                {dataMessage}
              </p>
            )}
          </section>
        </section>
      </main>
    );
  }

  return (
    <main>
      <nav aria-label="メインナビゲーション">
        <div className="brand">
          <Logo />
          <b>Codex Quiz</b>
        </div>
        <div className="nav-actions">
          <button onClick={() => setScreen("progress")}>進捗</button>
          <button onClick={() => setScreen("reader")}>
            解説を読む {progress.bookmarks.length > 0 && <span>{progress.bookmarks.length}</span>}
          </button>
          <div className="nav-badge">
            <span className="status-dot" /> {quizzes.length} questions
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <div className="pill">LEARN CODEX, ONE QUESTION AT A TIME</div>
          <h1>
            Codexを、
            <br />
            <em>使える知識</em>に。
          </h1>
          <p>
            公式ドキュメントに基づく短いクイズで、
            <br className="desktop" />
            AIコーディングの基本と実践を身につけよう。
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={() => start()}>
              ランダム10問を始める <span>→</span>
            </button>
            <a href="#categories">カテゴリから選ぶ</a>
          </div>
        </div>
        <div className="terminal-card" aria-hidden="true">
          <div className="terminal-top">
            <span />
            <span />
            <span />
            <small>codex — quiz</small>
          </div>
          <div className="terminal-body">
            <p>
              <i>›</i> codex
            </p>
            <p className="muted">╭─────────────────────────────╮</p>
            <p className="muted">
              │ <b>Codex</b> coding agent ready&nbsp;&nbsp; │
            </p>
            <p className="muted">╰─────────────────────────────╯</p>
            <p className="prompt">
              <i>›</i> 今日のクイズを始めよう
            </p>
            <p className="typing">
              問題を準備しています<span>▋</span>
            </p>
          </div>
        </div>
      </section>
      {resumableSession && (
        <section className="resume-banner">
          <div>
            <p className="eyebrow">CONTINUE</p>
            <h2>前回の続きから</h2>
            <p>
              {resumableSession.label} · {resumableSession.index + 1}/{resumableSession.ids.length}問目
            </p>
          </div>
          <div>
            <button className="primary" onClick={resumeQuiz}>
              再開する <span>→</span>
            </button>
            <button onClick={discardResume}>破棄</button>
          </div>
        </section>
      )}
      <section className="stats">
        <div>
          <strong>{quizzes.length}</strong>
          <span>公式準拠の問題</span>
        </div>
        <div>
          <strong>6</strong>
          <span>学習カテゴリ</span>
        </div>
        <div>
          <strong>{progress.answered}</strong>
          <span>これまでの回答</span>
        </div>
        <div>
          <strong>{accuracy}%</strong>
          <span>通算正答率</span>
        </div>
      </section>
      <section className="mode-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">LEARNING MODES</p>
            <h2>目的に合わせて学ぶ</h2>
          </div>
          <p>基礎からの学習、知識を先に読む練習、本番形式の確認。</p>
        </div>
        <div className="mode-grid">
          <button className="mode-card featured" onClick={() => startMode("overview")}>
            <span>01</span>
            <div>
              <small>9 CHAPTERS</small>
              <h3>全体像モード</h3>
              <p>基本から拡張まで、順番にCodexの全体像をつかむ。</p>
            </div>
            <b>→</b>
          </button>
          <button className="mode-card" onClick={() => startMode("study")}>
            <span>02</span>
            <div>
              <small>READ FIRST</small>
              <h3>読んでから解く</h3>
              <p>解説と正解を理解してから、同じ知識を思い出す。</p>
            </div>
            <b>→</b>
          </button>
          <button className="mode-card" onClick={() => startMode("exam")}>
            <span>03</span>
            <div>
              <small>{quizzes.length} QUESTIONS</small>
              <h3>実力テスト</h3>
              <p>途中で正解を表示せず、現在の理解度をまとめて確認。</p>
            </div>
            <b>→</b>
          </button>
        </div>
      </section>
      {dueQuestions.length > 0 && (
        <section className="due-banner">
          <div className="due-clock">↻</div>
          <div>
            <p className="eyebrow">SPACED REPETITION</p>
            <h2>今日の復習が届いています</h2>
            <p>記憶が薄れるタイミングの問題を、3問だけ確認しましょう。</p>
          </div>
          <strong>
            {dueQuestions.length}
            <small>問</small>
          </strong>
          <button className="primary" onClick={startDue}>
            60秒チェック <span>→</span>
          </button>
        </section>
      )}
      {weakQuestions.length > 0 && (
        <section className="review-banner">
          <div>
            <p className="eyebrow">REVIEW</p>
            <h2>苦手を、次の得意に。</h2>
            <p>
              正答率が低い、または直近で間違えた問題が <strong>{weakQuestions.length}問</strong> あります。
            </p>
          </div>
          <button className="primary" onClick={startWeak}>
            苦手問題を復習 <span>→</span>
          </button>
        </section>
      )}
      <section className="category-section" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CHOOSE A TOPIC</p>
            <h2>カテゴリから学ぶ</h2>
          </div>
          <p>気になる分野を選んで、カテゴリ単位で集中トレーニング。</p>
        </div>
        <div className="category-grid">
          {categoryCounts.map(({ key, count, completed }) => (
            <button className="category-card" key={key} onClick={() => start(key)}>
              <span className="category-icon">{categories[key].icon}</span>
              <span className="category-text">
                <strong>{categories[key].label}</strong>
                <small>{categories[key].description}</small>
                <span className="mini-progress">
                  <i style={{ width: `${(completed / count) * 100}%` }} />
                </span>
              </span>
              <span className="category-meta">
                {completed}/{count} <b>↗</b>
              </span>
            </button>
          ))}
        </div>
      </section>
      <footer>
        <div className="brand">
          <Logo />
          <b>Codex Quiz</b>
        </div>
        <div className="footer-actions">
          <p>OpenAI公式ドキュメントをもとに制作した非公式学習アプリ</p>
          {progress.answered > 0 && <button onClick={resetProgress}>学習データをリセット</button>}
        </div>
      </footer>
    </main>
  );
}

export default App;
