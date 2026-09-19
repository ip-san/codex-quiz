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
] as const;
