import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  categories,
  categoryLearning,
  hydrateWrongFeedback,
  quizzes,
  type Category,
  type Difficulty,
  type Quiz,
} from "./data";
import { orderChoices } from "./domain/choiceOrder";
import { selectBalancedExam } from "./domain/examSelection";
import { overviewQuestionIds, selectOverviewQuestions } from "./domain/overviewPath";
import { scenarios } from "./domain/scenarios";
import { DiagramRenderer } from "./components/DiagramRenderer";
import type { ReaderState } from "./components/ReaderScreen";
import { quizDiagrams } from "./diagrams";
import {
  emptyProgress,
  parseProgressExport,
  serializeProgress,
  type SavedProgress,
  type SessionRecord,
} from "./domain/progressData";
import { getReviewLabel, isReviewDue, scheduleReview, type QuestionProgress } from "./domain/spacedRepetition";
import { removeStoredItem, writeStoredJson } from "./domain/storage";

type Screen = "home" | "quiz" | "result" | "reader" | "progress" | "studyPath";
const MobileMenu = lazy(() => import("./components/MobileMenu"));
const FirstVisitGuide = lazy(() => import("./components/FirstVisitGuide"));
const StudyPath = lazy(() => import("./components/StudyPath"));
const ReaderScreen = lazy(() => import("./components/ReaderScreen"));
const shouldShowFirstVisitGuide = () => {
  try {
    return !localStorage.getItem("codex-quiz-intro-seen") && readProgress().answered === 0 && !readResumeSession();
  } catch {
    return false;
  }
};
type QuizMode = "normal" | "study" | "studyPath" | "exam" | "overview" | "scenario";
const CATEGORY_COUNT = Object.keys(categories).length;
const difficultyOptions: Array<{ key: Difficulty; label: string; description: string }> = [
  { key: "beginner", label: "入門", description: "基本を確認" },
  { key: "intermediate", label: "実践", description: "判断を深める" },
  { key: "advanced", label: "発展", description: "応用に挑戦" },
];
const STORAGE_SAVE_WARNING =
  "端末への保存に失敗しました。学習結果や再開状態が残らない可能性があります。ページを閉じる前に進捗画面からバックアップしてください。";

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
    if (!Number.isInteger(value.index) || value.index < 0 || value.index >= value.ids.length) return null;
    if (
      !Number.isInteger(value.score) ||
      value.score < 0 ||
      value.score > value.index + (value.selected === null ? 0 : 1)
    )
      return null;
    if (typeof value.label !== "string" || !value.label.trim()) return null;
    if (value.category !== null && !Object.hasOwn(categories, value.category)) return null;
    if (
      value.mode !== undefined &&
      !["normal", "study", "studyPath", "exam", "overview", "scenario"].includes(value.mode)
    )
      return null;
    if (value.selected !== null && (!Number.isInteger(value.selected) || value.selected < 0 || value.selected > 3))
      return null;
    if (new Set(value.ids).size !== value.ids.length) return null;
    if (value.ids.some((id) => !quizzes.some((quiz) => quiz.id === id))) return null;
    return value;
  } catch {
    return null;
  }
};

const readProgress = (): SavedProgress => {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem("codex-quiz-progress");
    if (raw === null) return emptyProgress;
    const stored: unknown = JSON.parse(raw);
    if (!stored || typeof stored !== "object" || Array.isArray(stored)) throw new Error("Invalid saved progress");
    return parseProgressExport(
      JSON.stringify({
        format: "codex-quiz-progress",
        version: 1,
        data: { ...emptyProgress, ...stored },
      }),
    );
  } catch {
    if (raw !== null) {
      try {
        localStorage.setItem("codex-quiz-progress-recovery", raw);
      } catch {
        // Storage may be unavailable; never delete the original saved data.
      }
    }
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
  const [routeReady, setRouteReady] = useState(false);
  const [showFirstVisitGuide, setShowFirstVisitGuide] = useState(shouldShowFirstVisitGuide);
  const [progress, setProgress] = useState<SavedProgress>(readProgress);
  const [session, setSession] = useState<Quiz[]>([]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [readerState, setReaderState] = useState<ReaderState>({
    query: "",
    category: "all",
    bookmarksOnly: false,
    review: "all",
    visibleCount: 20,
    expandedId: null,
  });
  const [sessionLabel, setSessionLabel] = useState("ランダム10問");
  const [sessionCategory, setSessionCategory] = useState<Category | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const [dataMessage, setDataMessage] = useState("");
  const [storageWarning, setStorageWarning] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);
  const [resumableSession, setResumableSession] = useState<ResumeSession | null>(readResumeSession);
  const [quizMode, setQuizMode] = useState<QuizMode>("normal");
  const [studyPhase, setStudyPhase] = useState(false);
  const [showChapterIntro, setShowChapterIntro] = useState(false);
  const [showAllScenarios, setShowAllScenarios] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [, setFeedbackRevision] = useState(0);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const finishFirstVisitGuide = (startOverview: boolean) => {
    try {
      localStorage.setItem("codex-quiz-intro-seen", "1");
    } catch {
      // The guide still closes when browser storage is unavailable.
    }
    setShowFirstVisitGuide(false);
    if (startOverview) startMode("overview");
  };

  useEffect(() => {
    if (screen !== "quiz") return;
    let active = true;
    void hydrateWrongFeedback().then(() => {
      if (active) setFeedbackRevision((revision) => revision + 1);
    });
    return () => {
      active = false;
    };
  }, [screen]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get("view");
    const questionId = params.get("q");
    const category = params.get("category") as Category | null;
    if (view === "reader" || view === "progress") {
      setScreen(view);
      setRouteReady(true);
      return;
    }
    const sharedQuestion = quizzes.find((quiz) => quiz.id === questionId);
    if (sharedQuestion) {
      setSession([sharedQuestion]);
      setSessionLabel("共有された問題");
      setScreen("quiz");
      setRouteReady(true);
      return;
    }
    if (category && category in categories) {
      setSession(shuffle(quizzes.filter((quiz) => quiz.category === category)));
      setSessionCategory(category);
      setSessionLabel(categories[category].label);
      setScreen("quiz");
    }
    setRouteReady(true);
  }, []);

  const activeQuestionId = session[index]?.id;

  useEffect(() => {
    if (!routeReady) return;
    const params = new URLSearchParams();
    if (screen === "reader" || screen === "progress") params.set("view", screen);
    if (screen === "quiz" && sessionLabel === "共有された問題" && activeQuestionId) {
      params.set("q", activeQuestionId);
    } else if (screen === "quiz" && sessionCategory) {
      params.set("category", sessionCategory);
    }
    const search = params.size ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState(null, "", search);
  }, [activeQuestionId, routeReady, screen, sessionCategory, sessionLabel]);

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

  const saveProgress = (next: SavedProgress) => {
    setProgress(next);
    if (!writeStoredJson("codex-quiz-progress", next)) {
      setStorageWarning(STORAGE_SAVE_WARNING);
    }
  };

  const saveSession = (resume: ResumeSession) => {
    setResumableSession(resume);
    if (!writeStoredJson("codex-quiz-session", resume)) {
      setStorageWarning(STORAGE_SAVE_WARNING);
    }
  };

  const storageAlert = storageWarning && (
    <p className="storage-warning" role="alert">
      {storageWarning}
    </p>
  );

  const beginSession = (nextSession: Quiz[], label: string, mode: QuizMode, category: Category | null = null) => {
    const resume: ResumeSession = {
      ids: nextSession.map((quiz) => quiz.id),
      index: 0,
      score: 0,
      label,
      category,
      selected: null,
      mode,
    };
    setSession(nextSession);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setSessionLabel(label);
    setSessionCategory(category);
    setQuizMode(mode);
    setStudyPhase(mode === "study");
    setShowChapterIntro(mode === "overview");
    saveSession(resume);
    setScreen("quiz");
    window.scrollTo(0, 0);
  };

  const start = (category?: Category) => {
    const pool = category ? quizzes.filter((quiz) => quiz.category === category) : quizzes;
    const nextSession = shuffle(pool).slice(0, category ? pool.length : 10);
    const label = category ? categories[category].label : "ランダム10問";
    beginSession(nextSession, label, "normal", category ?? null);
  };

  const startWeak = () => {
    beginSession(shuffle(weakQuestions), "苦手問題の復習", "normal");
  };

  const startDifficulty = (difficulty: Difficulty, label: string) => {
    const pool = quizzes.filter((quiz) => quiz.difficulty === difficulty);
    beginSession(selectBalancedExam(pool, 10), `${label}10問`, "normal");
  };

  const startDue = () => {
    beginSession(shuffle(dueQuestions).slice(0, 3), "60秒チェック", "normal");
  };

  const startScenario = (scenario: (typeof scenarios)[number]) => {
    const nextSession = scenario.ids
      .map((id) => quizzes.find((quiz) => quiz.id === id))
      .filter((quiz): quiz is Quiz => Boolean(quiz));
    if (nextSession.length !== scenario.ids.length) return;
    beginSession(nextSession, scenario.title, "scenario");
  };

  const startMode = (mode: "exam" | "overview") => {
    const nextSession = mode === "overview" ? selectOverviewQuestions() : selectBalancedExam(quizzes);
    const label = mode === "overview" ? "全体像をつかむ18問" : "実力テスト";
    beginSession(nextSession, label, mode);
  };

  const startStudyPath = (category: Category, questions: Quiz[]) => {
    beginSession(questions, `読んでから解く · ${categories[category].label}`, "studyPath");
  };

  const restartSession = () => {
    const nextSession =
      quizMode === "overview" || quizMode === "scenario" || quizMode === "studyPath" ? session : shuffle(session);
    beginSession(nextSession, sessionLabel, quizMode, sessionCategory);
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
    saveProgress(next);
    const resume = {
      ids: session.map((quiz) => quiz.id),
      index,
      score: score + (correct ? 1 : 0),
      label: sessionLabel,
      category: sessionCategory,
      selected: choice,
      mode: quizMode,
    };
    saveSession(resume);
  };

  const resetProgress = () => {
    if (!window.confirm("これまでの回答履歴と正答率をリセットしますか？")) return;
    if (removeStoredItem("codex-quiz-progress")) setProgress(emptyProgress);
    else setStorageWarning("学習データを削除できませんでした。端末の保存設定を確認してください。");
  };

  const toggleBookmark = (questionId: string) => {
    const bookmarks = progress.bookmarks.includes(questionId)
      ? progress.bookmarks.filter((id) => id !== questionId)
      : [...progress.bookmarks, questionId];
    const next = { ...progress, bookmarks };
    saveProgress(next);
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
      if (!writeStoredJson("codex-quiz-progress", imported)) throw new Error("学習データを端末に保存できませんでした");
      setProgress(imported);
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
      saveProgress(nextProgress);
      if (!removeStoredItem("codex-quiz-session")) {
        setStorageWarning(
          "完了したセッションを端末から削除できませんでした。再読み込み後の再開状態に注意してください。",
        );
      }
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
      saveSession(resume);
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
    setShowChapterIntro(false);
    setScreen("quiz");
  };

  const discardResume = () => {
    if (removeStoredItem("codex-quiz-session")) setResumableSession(null);
    else setStorageWarning("学習セッションを端末から削除できませんでした。端末の保存設定を確認してください。");
  };

  useEffect(() => {
    if (screen !== "quiz" || !question) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("button, a, input, textarea, select, [contenteditable='true']")
      )
        return;
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

  if (routeReady && screen === "home" && showFirstVisitGuide) {
    return (
      <Suspense fallback={<main className="first-visit-loading">Codex Quiz</main>}>
        <FirstVisitGuide onComplete={finishFirstVisitGuide} />
      </Suspense>
    );
  }

  if (screen === "studyPath") {
    return (
      <Suspense fallback={<main className="first-visit-loading">学習パスを準備中</main>}>
        <StudyPath onBack={() => setScreen("home")} onStart={startStudyPath} />
      </Suspense>
    );
  }

  if (screen === "quiz" && question && quizMode === "overview" && showChapterIntro) {
    const learning = categoryLearning[question.category];
    return (
      <main className="chapter-page">
        {storageAlert}
        <div className="chapter-card">
          <span className="chapter-number">
            CHAPTER {learning.chapter} / {CATEGORY_COUNT}
          </span>
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
        {storageAlert}
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
          {quizMode === "scenario" && (
            <p className="eyebrow">
              {sessionLabel} · STEP {index + 1}/{session.length} ·{" "}
              {scenarios.find((course) => course.title === sessionLabel)?.steps[index]}
            </p>
          )}
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
        {storageAlert}
        <div className="result-card">
          <Logo />
          <p className="eyebrow result-label">学習を完了</p>
          <h1>{percent >= 80 ? "すばらしい！" : percent >= 60 ? "いい調子です" : "ここから伸びます"}</h1>
          <div className="score-ring" style={{ "--score": `${percent * 3.6}deg` } as React.CSSProperties}>
            <div>
              <strong>{score}</strong>
              <span>/ {session.length}</span>
            </div>
          </div>
          <p>正答率 {percent}%</p>
          <section className="learning-guide" aria-labelledby="next-step-heading">
            <h2 id="next-step-heading">次のおすすめ</h2>
            <p>
              {quizMode === "overview"
                ? "全体像をつかみました。9章の学習状況を見て、気になる分野の残りの問題へ進みましょう。"
                : weakQuestions.length > 0
                  ? "間違えた問題は、解説を確認してもう一度。正答率が低い問題もまとめて復習できます。"
                  : dueQuestions.length > 0
                    ? "復習の時期が来た問題があります。短いチェックで記憶を確かめましょう。"
                    : "今日はここで終えても大丈夫。進捗で学習の成果と、次に学ぶカテゴリを確認できます。"}
            </p>
            <button
              className="secondary"
              onClick={
                quizMode === "overview"
                  ? () => setScreen("progress")
                  : weakQuestions.length > 0
                    ? startWeak
                    : dueQuestions.length > 0
                      ? startDue
                      : () => setScreen("progress")
              }
            >
              {quizMode === "overview"
                ? "9章の学習状況を見る"
                : weakQuestions.length > 0
                  ? "苦手問題を復習する"
                  : dueQuestions.length > 0
                    ? "60秒チェックへ"
                    : "学習の成果を見る"}
            </button>
          </section>
          <div className="result-actions">
            <button className="primary" onClick={restartSession}>
              同じ内容でもう一度
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
      <Suspense fallback={<main className="reader-page" aria-busy="true" />}>
        <ReaderScreen
          state={readerState}
          onChange={(patch) => setReaderState((current) => ({ ...current, ...patch }))}
          progress={progress}
          onBookmark={toggleBookmark}
          onClose={() => setScreen("home")}
          logo={<Logo />}
          storageAlert={storageAlert}
        />
      </Suspense>
    );
  }

  if (screen === "progress") {
    const bestScore = progress.history.length
      ? Math.max(...progress.history.map((record) => Math.round((record.score / record.total) * 100)))
      : 0;
    return (
      <main className="dashboard-page">
        {storageAlert}
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
              <p className="eyebrow">学習の記録</p>
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
            </div>
            <div>
              <span>通算正答率</span>
              <strong>{accuracy}%</strong>
            </div>
            <div>
              <span>完了セッション</span>
              <strong>{progress.history.length}</strong>
            </div>
            <div>
              <span>ベストスコア</span>
              <strong>{bestScore}%</strong>
            </div>
          </div>
          <div className="dashboard-grid">
            <section className="mastery-panel" aria-labelledby="chapter-progress-heading">
              <h2 id="chapter-progress-heading">チャプターの学習状況</h2>
              <p>各章の全問に1回以上回答すると「一巡済み」です。正答率や習熟とは別の目安です。</p>
              {categoryCounts.map(({ key, count }) => {
                const answered = quizzes.filter(
                  (quiz) => quiz.category === key && (progress.questions[quiz.id]?.attempts ?? 0) > 0,
                ).length;
                return (
                  <div className="learning-guide" key={key}>
                    <h3>
                      第{categoryLearning[key].chapter}章 · {categories[key].label}
                    </h3>
                    <p>
                      {answered === count ? "一巡済み" : answered === 0 ? "未着手" : "学習中"} · 回答済み {answered}/
                      {count}問 · 残り {count - answered}問
                    </p>
                    <button className="secondary" onClick={() => start(key)}>
                      {answered === count ? "この章を復習する" : "この章を学ぶ"}
                    </button>
                  </div>
                );
              })}
            </section>
            <section className="mastery-panel">
              <div className="panel-title">
                <div>
                  <p className="eyebrow">習熟度</p>
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
                  <p className="eyebrow">学習履歴</p>
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
          <details className="data-panel">
            <summary>
              <span>
                <b>学習データの管理</b>
                <small>バックアップと復元</small>
              </span>
              <i aria-hidden="true">⌄</i>
            </summary>
            <p>SRS、ブックマーク、回答履歴をJSONファイルでバックアップできます。</p>
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
          </details>
        </section>
      </main>
    );
  }

  return (
    <main>
      {storageAlert}
      <nav className="home-nav" aria-label="メインナビゲーション">
        <div className="brand">
          <Logo />
          <b>Codex Quiz</b>
        </div>
        <div className="nav-actions">
          <button onClick={() => setShowFirstVisitGuide(true)}>はじめての方へ</button>
          <button onClick={() => setScreen("progress")}>進捗</button>
          <button onClick={() => setScreen("reader")}>
            解説を読む {progress.bookmarks.length > 0 && <span>{progress.bookmarks.length}</span>}
          </button>
          <div className="nav-badge">
            <span className="status-dot" /> {quizzes.length}問を収録
          </div>
        </div>
        <Suspense fallback={null}>
          <MobileMenu onNavigate={setScreen} onIntro={() => setShowFirstVisitGuide(true)} />
        </Suspense>
      </nav>
      <section className="hero">
        <div className="next-step-card">
          <div className="next-step-heading">
            <span className="next-step-icon" aria-hidden="true">
              ↗
            </span>
            <span>あなたの次の一歩</span>
          </div>
          {resumableSession ? (
            <>
              <p className="next-step-kicker">途中から再開</p>
              <h1>前回の続きから</h1>
              <p>
                {resumableSession.label} · {resumableSession.index + 1}/{resumableSession.ids.length}問目
              </p>
              <button className="primary" onClick={resumeQuiz}>
                再開する <span>→</span>
              </button>
              <button className="next-step-discard" onClick={discardResume}>
                保存した途中経過を破棄
              </button>
            </>
          ) : dueQuestions.length > 0 ? (
            <>
              <p className="next-step-kicker">復習のタイミング · {dueQuestions.length}問</p>
              <h1>3問だけ、思い出す。</h1>
              <p>前に解いた知識を、短い復習で確かめましょう。</p>
              <button className="primary" onClick={startDue}>
                60秒チェック <span>→</span>
              </button>
            </>
          ) : weakQuestions.length > 0 ? (
            <>
              <p className="next-step-kicker">苦手を復習 · {weakQuestions.length}問</p>
              <h1>迷った問題から、もう一度。</h1>
              <p>間違えた理由を見直して、次の判断につなげます。</p>
              <button className="primary" onClick={startWeak}>
                苦手問題を復習 <span>→</span>
              </button>
            </>
          ) : progress.answered > 0 ? (
            <>
              <p className="next-step-kicker">今日の練習</p>
              <h1>次の10問に進もう。</h1>
              <p>分野を横断して、実務の判断を少しずつ磨きます。</p>
              <button className="primary" onClick={() => start()}>
                10問の練習を始める <span>→</span>
              </button>
            </>
          ) : (
            <>
              <p className="next-step-kicker">はじめての方へ · 18問</p>
              <h1>最初は、全体の地図から。</h1>
              <p>9分野から2問ずつ。解きながらCodexの使いどころをつかめます。</p>
              <button className="primary" onClick={() => startMode("overview")}>
                まず全体像を18問でつかむ <span>→</span>
              </button>
            </>
          )}
          <div className="next-step-secondary">
            <button onClick={() => start()}>ランダム10問を始める</button>
            <button onClick={() => setScreen("reader")}>解説から読む</button>
          </div>
        </div>
      </section>
      {progress.answered > 0 && (
        <section className="home-progress" aria-label="現在の学習状況">
          <div>
            <strong>{progress.answered}</strong>
            <span>これまでの回答</span>
          </div>
          <div>
            <strong>{accuracy}%</strong>
            <span>通算正答率</span>
          </div>
          <div>
            <strong>{dueQuestions.length}</strong>
            <span>復習待ちの問題</span>
          </div>
          <button onClick={() => setScreen("progress")}>
            詳しい進捗を見る <span aria-hidden="true">→</span>
          </button>
        </section>
      )}
      <section className="mode-section" id="learning-modes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">学習メニュー</p>
            <h2>目的に合わせて学ぶ</h2>
          </div>
          <p>基礎からの学習、知識を先に読む練習、本番形式の確認。</p>
        </div>
        <div className="mode-grid">
          <button className="mode-card featured" onClick={() => startMode("overview")}>
            <span>01</span>
            <div>
              <small>
                {CATEGORY_COUNT}分野 · {overviewQuestionIds.length}問
              </small>
              <h3>全体像モード</h3>
              <p>9分野から各2問。まず全体の地図をつかみ、気になる章を深掘りする。</p>
            </div>
            <b>→</b>
          </button>
          <button className="mode-card" onClick={() => setScreen("studyPath")}>
            <span>02</span>
            <div>
              <small>分野を選ぶ · 5問</small>
              <h3>読んでから解く</h3>
              <p>一つの分野の判断理由を読んでから、同じ5問で理解を確かめる。</p>
            </div>
            <b>→</b>
          </button>
          <button className="mode-card" onClick={() => startMode("exam")}>
            <span>03</span>
            <div>
              <small>100問</small>
              <h3>実力テスト</h3>
              <p>{CATEGORY_COUNT}カテゴリからバランスよく100問。途中で正解を表示せず実力を確認。</p>
            </div>
            <b>→</b>
          </button>
        </div>
        <div className="difficulty-practice">
          <div>
            <h3>難易度から10問練習</h3>
            <p>全分野から、今の自分に合う深さを選べます。</p>
          </div>
          <div className="difficulty-options">
            {difficultyOptions.map((option) => (
              <button key={option.key} onClick={() => startDifficulty(option.key, option.label)}>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </button>
            ))}
          </div>
        </div>
      </section>
      <section className="journey-section" aria-labelledby="journey-heading">
        <p className="eyebrow">全体像</p>
        <h2 id="journey-heading">Codexで仕事を進める5つの段階</h2>
        <p>まず流れをつかみ、必要な分野だけ深掘りできます。</p>
        <p className="journey-hint">横にスワイプして5段階を見る →</p>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: 横スクロール領域をキーボードでも操作できるようにする */}
        <section className="journey-scroll" tabIndex={0} aria-label="Codexで仕事を進める5つの段階">
          <ol className="journey-map">
            <li>
              <span>01</span>
              <h3>依頼する</h3>
              <p>目的・文脈・完了条件を伝える</p>
              <small>基本操作・プロンプト</small>
            </li>
            <li>
              <span>02</span>
              <h3>境界を決める</h3>
              <p>チームの指示と権限を確認する</p>
              <small>AGENTS.md・権限・設定</small>
            </li>
            <li>
              <span>03</span>
              <h3>作業する</h3>
              <p>環境と必要な連携を選ぶ</p>
              <small>利用環境・拡張</small>
            </li>
            <li>
              <span>04</span>
              <h3>確かめる</h3>
              <p>テストと差分レビューで検証する</p>
              <small>実務フロー</small>
            </li>
            <li>
              <span>05</span>
              <h3>続ける</h3>
              <p>会話を再開し、学びを次に生かす</p>
              <small>セッション</small>
            </li>
          </ol>
        </section>
      </section>
      <section className="mode-section" aria-labelledby="scenario-heading">
        <h2 id="scenario-heading">実践シナリオ</h2>
        <p>各3問。実務の順序で判断を練習します。実際のコード操作は行いません。</p>
        <div className={`mode-grid scenario-grid${showAllScenarios ? " is-expanded" : ""}`}>
          {scenarios.map((scenario) => (
            <div className="learning-guide" key={scenario.id}>
              <h3>{scenario.title}</h3>
              <p>{scenario.description}</p>
              <ol>
                {scenario.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <button className="secondary" onClick={() => startScenario(scenario)}>
                {scenario.title}を始める
              </button>
            </div>
          ))}
        </div>
        <button
          className="scenario-more"
          onClick={() => setShowAllScenarios((value) => !value)}
          aria-expanded={showAllScenarios}
        >
          {showAllScenarios ? "シナリオを閉じる" : `すべてのシナリオを見る（全${scenarios.length}件）`}
        </button>
      </section>
      <section className="category-section" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">分野から選ぶ</p>
            <h2>カテゴリから学ぶ</h2>
          </div>
          <p>気になる分野を選んで、カテゴリ単位で集中トレーニング。</p>
        </div>
        <div className={`category-grid${showAllCategories ? " is-expanded" : ""}`}>
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
        <button
          className="category-more"
          onClick={() => setShowAllCategories((value) => !value)}
          aria-expanded={showAllCategories}
        >
          {showAllCategories ? "カテゴリを閉じる" : `すべてのカテゴリを見る（全${CATEGORY_COUNT}分野）`}
        </button>
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
