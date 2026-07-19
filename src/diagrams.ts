export type DiagramData =
  | { type: "terminal"; label: string; lines: Array<{ kind: "command" | "output" | "info"; text: string }> }
  | { type: "flow"; label: string; steps: Array<{ text: string; sub?: string }> }
  | { type: "comparison"; label: string; columns: Array<{ heading: string; items: string[] }> }
  | { type: "config"; label: string; filepath: string; lines: Array<{ text: string; highlight?: boolean }> };

export const quizDiagrams: Record<string, DiagramData[]> = {
  "session-01": [
    {
      type: "terminal",
      label: "長いセッションを圧縮",
      lines: [
        { kind: "command", text: "/compact" },
        { kind: "output", text: "Summarizing conversation…" },
        { kind: "info", text: "決定・制約・進捗を要約してコンテキストを確保" },
      ],
    },
  ],
  "workflow-01": [
    {
      type: "terminal",
      label: "未コミット変更をレビュー",
      lines: [
        { kind: "command", text: "/review" },
        { kind: "output", text: "Review uncommitted changes" },
        { kind: "info", text: "staged + unstaged + untracked を確認" },
      ],
    },
  ],
  "workflow-03": [
    {
      type: "comparison",
      label: "作業場所の使い分け",
      columns: [
        { heading: "Local", items: ["現在のcheckout", "手元の変更へ直接作業"] },
        { heading: "Worktree", items: ["独立したcheckout", "別タスクを安全に並列実行"] },
      ],
    },
  ],
  "workflow-04": [
    {
      type: "config",
      label: "ignoredファイルをworktreeへコピー",
      filepath: ".worktreeinclude",
      lines: [
        { text: ".env", highlight: true },
        { text: ".env.local", highlight: true },
        { text: "config/secrets.json" },
      ],
    },
  ],
  "workflow-11": [
    {
      type: "comparison",
      label: "Scheduled taskの文脈を選ぶ",
      columns: [
        { heading: "Chat内", items: ["既存の会話を継続", "追跡・再確認向き"] },
        { heading: "Standalone", items: ["runごとに新規chat", "独立した定期監査向き"] },
      ],
    },
  ],
  "surfaces-02": [
    {
      type: "flow",
      label: "Cloud taskの流れ",
      steps: [
        { text: "Container", sub: "repoをcheckout" },
        { text: "Setup", sub: "依存関係を準備" },
        { text: "Agent", sub: "変更と検証" },
        { text: "Diff / PR", sub: "結果をレビュー" },
      ],
    },
  ],
  "surfaces-09": [
    {
      type: "comparison",
      label: "IDE拡張の設定レイヤー",
      columns: [
        { heading: "config.toml", items: ["model・reasoning", "sandbox・MCP"] },
        { heading: "chatgpt.*", items: ["sidebar・入力", "queue・review表示"] },
      ],
    },
  ],
  "extend-13": [
    {
      type: "flow",
      label: "ツール実行を挟むHook",
      steps: [
        { text: "PreToolUse", sub: "実行前にポリシー検査" },
        { text: "Tool", sub: "Bashなどを実行" },
        { text: "PostToolUse", sub: "結果を品質検査" },
      ],
    },
  ],
  "agents-02": [
    {
      type: "flow",
      label: "指示の適用順",
      steps: [
        { text: "Global", sub: "~/.codex" },
        { text: "Repo root", sub: "共有ルール" },
        { text: "Current dir", sub: "近い指示が優先" },
      ],
    },
  ],
};
