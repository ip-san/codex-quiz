# 公式ドキュメント・カバレッジ

| 領域 | 実務価値 | 状態 | 次の重点 |
|---|---:|---|---|
| Prompting・完了条件 | 最重要 | 基礎あり | 大規模変更と失敗時の依頼 |
| AGENTS.md | 最重要 | 実務フローあり | monorepo別の検証規則 |
| 承認・sandbox | 最重要 | 実務フローあり | granular approval policy |
| Review | 最重要 | 実務フローあり | CI連携とレビュー失敗の診断 |
| Session・context | 高 | 実務フローあり | memoriesと長期goalの運用 |
| Worktree | 高 | 実務フローあり | conflict発生時の復旧 |
| App・IDE・CLI・Cloud | 高 | 基礎あり | remote control |
| Skills・MCP | 高 | 実務フローあり | tool approvalの詳細 |
| Hooks・Plugins | 中〜高 | 基礎あり | managed hooksとplugin policy |
| Automations | 中〜高 | 基礎あり | 複数projectと失敗runの運用 |
| Troubleshooting | 中 | 着手 | app/IDE/Cloud別の診断 |

「着手」は、公式URL・topic・value・verifiedAtを持つ問題が存在する状態。問題数だけで完了とせず、主要な判断と失敗回避を説明できるまで追加する。

## 2026-07-19 拡充内容

75問から105問へ拡充した。追加した30問の内訳は、Scheduled tasks 6問、Hooks 8問、IDE・surface・診断 7問、セッション管理 5問、GitHubレビュー運用 4問。全追加問題に公式URL、topic、実務価値、難易度、確認日を付与している。

## 2026-07-19 第2回拡充

105問から125問へ拡充した。追加した20問は、権限・network 4問、AGENTS.md運用 4問、MCP・Skills 6問、Worktree運用 4問、Computer Useの使い分け 2問。名称暗記よりも、設定不備の診断、最小権限、surface間の差、作業を失わない判断を優先した。
