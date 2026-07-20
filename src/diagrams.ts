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
  "basic-15": [
    {
      type: "comparison",
      label: "Codexの認証を選ぶ",
      columns: [
        { heading: "ChatGPT", items: ["subscription access", "workspace policy"] },
        { heading: "API key", items: ["usage-based", "Platform org policy"] },
      ],
    },
  ],
  "extend-30": [
    {
      type: "flow",
      label: "Workflowを育てて配布",
      steps: [
        { text: "Skill", sub: "手順・scriptを作る" },
        { text: "Test", sub: "triggerと結果を改善" },
        { text: "Plugin", sub: "Skill・MCPをbundle" },
        { text: "Marketplace", sub: "teamへ配布" },
      ],
    },
  ],
  "extend-32": [
    {
      type: "config",
      label: "Pluginのdirectory構造",
      filepath: "my-plugin/",
      lines: [
        { text: ".codex-plugin/plugin.json", highlight: true },
        { text: "skills/" },
        { text: "hooks/" },
        { text: ".mcp.json" },
        { text: "assets/" },
      ],
    },
  ],
  "surfaces-33": [
    {
      type: "flow",
      label: "Import後の仕上げ",
      steps: [
        { text: "Import", sub: "選択したsetupを追加" },
        { text: "Review", sub: "権限・Hook・path" },
        { text: "Finish", sub: "MCP・Pluginを再認証" },
        { text: "Test", sub: "projectで動作確認" },
      ],
    },
  ],
  "session-16": [
    {
      type: "comparison",
      label: "指示と記憶の役割",
      columns: [
        { heading: "AGENTS.md", items: ["必須のteam規則", "Gitでreview・共有"] },
        { heading: "Memories", items: ["過去作業のhelpful recall", "生成・利用をchatで制御"] },
      ],
    },
  ],
  "workflow-21": [
    {
      type: "flow",
      label: "検証可能なGoal",
      steps: [
        { text: "Outcome", sub: "完成する結果" },
        { text: "Constraints", sub: "守る境界" },
        { text: "Verification", sub: "test・measurement" },
        { text: "Done", sub: "自分で完了確認" },
      ],
    },
  ],
  "extend-35": [
    {
      type: "flow",
      label: "LinearからCodexへ委譲",
      steps: [
        { text: "Issue", sub: "assign / @Codex" },
        { text: "Cloud chat", sub: "environmentで作業" },
        { text: "Progress", sub: "Activityへ更新" },
        { text: "Result", sub: "summary・chat・PR" },
      ],
    },
  ],
  "extend-38": [
    {
      type: "flow",
      label: "SlackからCodexへ委譲",
      steps: [
        { text: "Thread", sub: "contextを要約" },
        { text: "@Codex", sub: "repoを明示" },
        { text: "Cloud chat", sub: "変更と検証" },
        { text: "Reply", sub: "結果またはchat link" },
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
  "basic-11": [
    {
      type: "terminal",
      label: "履歴を残さない一回限りの実行",
      lines: [
        { kind: "command", text: 'codex exec --ephemeral "triage this repository"' },
        { kind: "output", text: "Repositoryを調査して結果を返す" },
        { kind: "info", text: "session rollout fileはdiskへ保存しない" },
      ],
    },
  ],
  "basic-13": [
    {
      type: "terminal",
      label: "最終回答をJSON Schemaへ固定",
      lines: [
        { kind: "command", text: 'codex exec "summarize failures" --output-schema ./schema.json' },
        { kind: "output", text: '{"summary":"...","severity":"high"}' },
        { kind: "info", text: "後続jobはfieldと型を前提に処理できる" },
      ],
    },
  ],
  "basic-16": [
    {
      type: "terminal",
      label: "現在の認証方法を確認",
      lines: [
        { kind: "command", text: "codex login status" },
        { kind: "output", text: "Signed in with ChatGPT" },
        { kind: "info", text: "共有前にtoken自体は表示しない" },
      ],
    },
  ],
  "basic-17": [
    {
      type: "terminal",
      label: "headless環境でdevice code認証",
      lines: [
        { kind: "command", text: "codex login --device-auth" },
        { kind: "output", text: "Open the verification URL and enter the code" },
        { kind: "info", text: "credential fileを別端末からcopyしない" },
      ],
    },
  ],
  "session-06": [
    {
      type: "terminal",
      label: "長いsessionの状態を確認",
      lines: [
        { kind: "command", text: "/status" },
        { kind: "output", text: "Chat ID · context usage · rate limits" },
        { kind: "info", text: "compactや分岐の時期を判断" },
      ],
    },
  ],
  "session-07": [
    {
      type: "terminal",
      label: "主作業を保ったまま一時質問",
      lines: [
        { kind: "command", text: "/side" },
        { kind: "output", text: "Ephemeral side chat started" },
        { kind: "info", text: "main transcriptを中断せず疑問を調査" },
      ],
    },
  ],
  "config-14": [
    {
      type: "terminal",
      label: "設定layerと制約を診断",
      lines: [
        { kind: "command", text: "/debug-config" },
        { kind: "output", text: "CLI → project → profile → user → system" },
        { kind: "info", text: "requirementsによる制約も同時に確認" },
      ],
    },
  ],
  "config-15": [
    {
      type: "terminal",
      label: "対話CLIのdebug logを取得",
      lines: [
        { kind: "command", text: "RUST_LOG=debug codex -c log_dir=./.codex-log" },
        { kind: "output", text: "./.codex-log/codex-tui.log" },
        { kind: "info", text: "共有前にsecretや機密pathを確認" },
      ],
    },
  ],
  "safe-21": [
    {
      type: "terminal",
      label: "Ruleをsession適用前にtest",
      lines: [
        {
          kind: "command",
          text: "codex execpolicy check --pretty --rules ~/.codex/rules/default.rules -- gh pr view 42",
        },
        { kind: "output", text: '{"decision":"prompt","matchedRules":[...]}' },
        { kind: "info", text: "strictest decisionと一致Ruleを確認" },
      ],
    },
  ],
  "extend-22": [
    {
      type: "terminal",
      label: "登録済みMCP serverへOAuth login",
      lines: [
        { kind: "command", text: "codex mcp login linear" },
        { kind: "output", text: "Complete authorization in your browser" },
        { kind: "command", text: "codex mcp list" },
        { kind: "info", text: "server名ごとに接続状態を確認" },
      ],
    },
  ],
};
