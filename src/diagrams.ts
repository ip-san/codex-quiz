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
  "safe-12": [
    {
      type: "comparison",
      label: "ネットワーク制御は別々",
      columns: [
        { heading: "Web search", items: ["cached / live / disabled", "検索toolだけを制御"] },
        { heading: "Shell", items: ["sandbox network_access", "commandの外部接続"] },
      ],
    },
  ],
  "extend-20": [
    {
      type: "comparison",
      label: "MCPを使う場所",
      columns: [
        { heading: "Local host", items: ["App・CLI・IDE", "config.tomlを共有"] },
        { heading: "ChatGPT web", items: ["Work mode", "Pluginのremote tools"] },
      ],
    },
  ],
  "workflow-15": [
    {
      type: "flow",
      label: "Managed worktreeの整理",
      steps: [
        { text: "Archive chat", sub: "整理を開始" },
        { text: "Snapshot", sub: "作業状態を保存" },
        { text: "Delete worktree", sub: "diskを解放" },
        { text: "Restore", sub: "chat再開時に復元可能" },
      ],
    },
  ],
  "basic-12": [
    {
      type: "terminal",
      label: "非対話runをevent streamで処理",
      lines: [
        { kind: "command", text: 'codex exec --json "run checks"' },
        { kind: "output", text: '{"type":"thread.started", ...}' },
        { kind: "output", text: '{"type":"turn.completed", ...}' },
        { kind: "info", text: "stdoutは一行一eventのJSONL" },
      ],
    },
  ],
  "safe-15": [
    {
      type: "comparison",
      label: "CI secretのscope",
      columns: [
        { heading: "Job全体", items: ["buildやhookから見える", "露出範囲が広い"] },
        { heading: "単一command", items: ["codex execだけ", "必要時だけ渡す"] },
      ],
    },
  ],
  "surfaces-18": [
    {
      type: "flow",
      label: "Cloud environmentのphase",
      steps: [
        { text: "Setup shell", sub: "依存導入・secret利用" },
        { text: "Cache", sub: "準備済みcontainer" },
        { text: "Agent shell", sub: "別sessionで変更・検証" },
      ],
    },
  ],
  "session-11": [
    {
      type: "flow",
      label: "Main threadをノイズから守る",
      steps: [
        { text: "Main", sub: "要件・判断を保持" },
        { text: "Subagents", sub: "探索・test・triage" },
        { text: "Summaries", sub: "要点だけを集約" },
      ],
    },
  ],
  "safe-19": [
    {
      type: "comparison",
      label: "Rule decisionの強さ",
      columns: [
        { heading: "allow", items: ["sandbox外で許可", "promptなし"] },
        { heading: "prompt", items: ["実行前に確認", "毎回判断"] },
        { heading: "forbidden", items: ["実行をblock", "最も強い"] },
      ],
    },
  ],
  "surfaces-25": [
    {
      type: "flow",
      label: "Browserで視覚bugを直す",
      steps: [
        { text: "Open state", sub: "routeと状態を指定" },
        { text: "Annotate", sub: "対象要素へ期待を書く" },
        { text: "Fix", sub: "scopeを限定" },
        { text: "Recheck", sub: "同じ状態で検証" },
      ],
    },
  ],
  "surfaces-28": [
    {
      type: "comparison",
      label: "Remoteの役割分担",
      columns: [
        { heading: "Phone", items: ["prompt・follow-up", "approval・確認"] },
        { heading: "Host", items: ["repo・shell", "MCP・Skills・browser"] },
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
