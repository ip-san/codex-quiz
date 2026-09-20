export const scenarios = [
  {
    id: "bugfix",
    title: "不具合を再現して修正を確かめる",
    description: "設定が保存されない不具合を担当。再現条件を伝え、テストとレビューで確認します。",
    ids: ["prompt-18", "prompt-20", "workflow-01"],
    steps: ["再現条件を伝える", "テストの範囲を決める", "変更をレビューする"],
  },
  {
    id: "onboarding",
    title: "初めてのリポジトリで作業する",
    description: "引き継いだプロジェクトを調べ、チームの規則と権限を確認してから作業します。",
    ids: ["prompt-19", "agents-01", "safe-01"],
    steps: ["処理の流れを調べる", "チームの規則を確認する", "承認とアクセス範囲を区別する"],
  },
  {
    id: "parallel",
    title: "作業を分けて変更を受け渡す",
    description: "手元の作業を保ちながら別の修正を進め、開始状態と受け渡し方法を選びます。",
    ids: ["workflow-03", "workflow-25", "workflow-05"],
    steps: ["作業場所を分ける", "引き継ぐ変更を選ぶ", "手元へ受け渡す"],
  },
  {
    id: "ci-output",
    title: "CIでCodexの結果を自動処理する",
    description: "対話なしで調査を実行し、進行状況を追跡して、最終結果を後続ジョブへ渡します。",
    ids: ["basic-04", "basic-12", "basic-13"],
    steps: ["非対話で実行する", "実行イベントを読み取る", "最終結果の形式を決める"],
  },
  {
    id: "hook-checks",
    title: "Hookで実行前後を検査する",
    description: "チームの検査Hookを更新。定義を確認し、危険な操作の事前検査と実行結果の確認を分けます。",
    ids: ["extend-12", "extend-13", "extend-14"],
    steps: ["変更した定義を確認する", "実行前に検査する", "実行後の結果を確認する"],
  },
] as const;
