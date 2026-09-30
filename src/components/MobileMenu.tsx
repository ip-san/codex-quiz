type Props = { onNavigate: (screen: "reader" | "progress") => void; onIntro: () => void };

export default function MobileMenu({ onNavigate, onIntro }: Props) {
  const close = (target: HTMLElement, restoreFocus = true) => {
    const menu = target.closest("details");
    menu?.removeAttribute("open");
    if (restoreFocus) menu?.querySelector("summary")?.focus();
  };
  const jump = (target: HTMLElement, hash: string) => {
    window.location.hash = hash;
    close(target, false);
  };

  return (
    <details
      className="mobile-nav"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close(event.currentTarget);
        }
      }}
    >
      <summary>
        <span className="menu-glyph" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>{" "}
        メニュー
      </summary>
      <button
        className="mobile-nav-backdrop"
        aria-label="メニューを閉じる"
        onClick={(event) => close(event.currentTarget)}
      />
      <div className="mobile-nav-panel">
        <div className="mobile-nav-header">
          <div>
            <strong>Codex Quiz</strong>
            <small>学びたい場所へ</small>
          </div>
          <button aria-label="メニューを閉じる" onClick={(event) => close(event.currentTarget)}>
            ×
          </button>
        </div>
        <p className="mobile-nav-section">学ぶ</p>
        <button
          aria-label="はじめての方へ"
          onClick={(event) => {
            close(event.currentTarget, false);
            onIntro();
          }}
        >
          はじめての方へ <small>学び方を短く確認する</small>
        </button>
        <button aria-label="実践シナリオ" onClick={(event) => jump(event.currentTarget, "scenario-heading")}>
          実践シナリオ <small>仕事の流れで判断を練習</small>
        </button>
        <button aria-label="学習モード" onClick={(event) => jump(event.currentTarget, "learning-modes")}>
          学習モード <small>目標に合わせて問題を選ぶ</small>
        </button>
        <button aria-label="カテゴリ" onClick={(event) => jump(event.currentTarget, "categories")}>
          カテゴリ <small>分野ごとに知識を深める</small>
        </button>
        <p className="mobile-nav-section">記録と資料</p>
        <button aria-label="進捗を見る" onClick={() => onNavigate("progress")}>
          進捗を見る <small>習得状況と復習を確認</small>
        </button>
        <button aria-label="解説を読む" onClick={() => onNavigate("reader")}>
          解説を読む <small>問題と解説を探す</small>
        </button>
        <div className="mobile-nav-footer">OPENAI公式資料にもとづく非公式学習アプリ</div>
      </div>
    </details>
  );
}
