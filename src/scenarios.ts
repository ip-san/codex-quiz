export type Scenario = {
  id: string;
  title: string;
  subtitle: string;
  situation: string;
  outcome: string;
  duration: string;
  questionIds: string[];
  accent: string;
};

export const scenarios: Scenario[] = [
  {
    id: "safe-refactor",
    title: "止められない認証機能を直す",
    subtitle: "安全な変更と検証",
    situation:
      "本番で使われている認証処理に不具合が見つかった。巨大なリポジトリで影響範囲を見極め、既存動作を壊さず修正する必要がある。",
    outcome: "明確な完了条件、適切な権限、テストとレビューを組み合わせた依頼ができる。",
    duration: "約4分",
    questionIds: ["prompt-01", "prompt-05", "safe-01", "safe-03", "basic-03"],
    accent: "#ed6a3a",
  },
  {
    id: "team-standards",
    title: "チームの開発ルールを定着させる",
    subtitle: "AGENTS.mdと設定",
    situation:
      "メンバーごとにビルド方法やレビュー品質が異なり、同じ指示を毎回繰り返している。リポジトリ全体と一部ディレクトリで異なるルールもある。",
    outcome: "AGENTS.mdの階層、override、プロジェクト設定を使い分けられる。",
    duration: "約4分",
    questionIds: ["agents-01", "agents-02", "agents-04", "agents-05", "config-01"],
    accent: "#8cac45",
  },
  {
    id: "extend-codex",
    title: "繰り返す調査を自動化する",
    subtitle: "Skills・MCP・Plugins",
    situation:
      "毎週同じ手順で外部サービスを調査し、決まった形式のレポートを作っている。手順の再利用と外部データへの安全な接続が必要だ。",
    outcome: "Skill、MCP、Pluginの役割を判断し、適切な拡張方法を選べる。",
    duration: "約3分",
    questionIds: ["extend-01", "extend-02", "extend-03", "extend-04", "extend-05"],
    accent: "#6986c7",
  },
];
