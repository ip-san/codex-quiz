# 公式ドキュメント・カバレッジ

| 領域 | 実務価値 | 状態 | 次の重点 |
|---|---:|---|---|
| Prompting・完了条件 | 最重要 | 実務フローあり | 既存問題のscenario品質改善 |
| AGENTS.md | 最重要 | 実務フローあり | monorepo別の検証規則 |
| 承認・sandbox | 最重要 | 実務フローあり | granular approval policy |
| Review | 最重要 | 実務フローあり | CI連携とレビュー失敗の診断 |
| Session・context | 高 | 実務フローあり | memoriesと長期goalの運用 |
| Worktree | 高 | 実務フローあり | conflict発生時の復旧 |
| App・IDE・CLI・Cloud | 高 | 実務フローあり | remote control |
| Skills・MCP | 高 | 実務フローあり | tool approvalの詳細 |
| Hooks・Plugins | 中〜高 | 基礎あり | managed hooksとplugin policy |
| Automations | 中〜高 | 実務フローあり | 複数projectの運用 |
| Troubleshooting | 中 | 基礎あり | 実利用で多い症状から補強 |
| Subagents | 高 | 実務フローあり | custom agent設計 |
| Rules・execpolicy | 高 | 実務フローあり | organization policyとの統合 |
| Local environments | 高 | 基礎あり | team共有時のmigration |
| Browser・Appshots | 中〜高 | 基礎あり | Developer modeの安全運用 |
| Remote connections | 中〜高 | 基礎あり | SSH handoffと復旧 |
| Authentication | 高 | 基礎あり | managed workspaceの制約 |
| Skill authoring | 高 | 実務フローあり | dependencyと評価方法 |
| Plugin distribution | 中〜高 | 基礎あり | versioningと公開審査 |
| Image inputs | 中 | 基礎あり | visual regression運用 |
| Import | 中〜高 | 基礎あり | 移行後の互換性監査 |
| Memories・長期Goal | 高 | 実務フローあり | 実利用による調整 |
| Integrated terminal・Git | 高 | 基礎あり | conflict解消 |
| Linear・Slack | 中〜高 | 基礎あり | 障害時の再接続 |

「着手」は、公式URL・topic・value・verifiedAtを持つ問題が存在する状態。問題数だけで完了とせず、主要な判断と失敗回避を説明できるまで追加する。

## 2026-07-19 拡充内容

75問から105問へ拡充した。追加した30問の内訳は、Scheduled tasks 6問、Hooks 8問、IDE・surface・診断 7問、セッション管理 5問、GitHubレビュー運用 4問。全追加問題に公式URL、topic、実務価値、難易度、確認日を付与している。

## 2026-07-19 第2回拡充

105問から125問へ拡充した。追加した20問は、権限・network 4問、AGENTS.md運用 4問、MCP・Skills 6問、Worktree運用 4問、Computer Useの使い分け 2問。名称暗記よりも、設定不備の診断、最小権限、surface間の差、作業を失わない判断を優先した。

## 2026-07-19 第3回拡充

125問から140問へ拡充した。追加した15問は、非対話実行・app-server 4問、CIのsecret・権限 4問、GitHub Actionと失敗修復 4問、Cloud setup・cache 3問。CIへCodexを組み込む際に、構造化出力を扱い、入力とsecretを保護し、失敗を再現して最小修正を検証できることを学習目標にした。

## 2026-07-19 第4回拡充

140問から150問へ拡充した。追加した10問は、実行中のsteer/queue、失敗のretrospective、boundaryと最終確認、config precedence、untrusted project、設定診断とlog取得。公式主要領域の判断問題が揃ったため、問題数の追加はいったん停止し、今後は旧問題のscenario化、不正解別feedback、実利用で判明した弱点の改善を優先する。

## 2026-07-19 第5回拡充

150問で網羅とみなすのは早いと再評価し、170問へ拡充した。追加した20問は、Subagents 5問、Rules・execpolicy 5問、Local environments 3問、Browser・Appshots 4問、Remote connections 3問。公式ドキュメントの主要な利用者向け領域をカバレッジ表へ明示し、未対応を問題数ではなく学習目標単位で追跡する。

## 2026-07-19 第6回拡充

170問から190問へ拡充した。追加した20問は、認証4問、Skill設計6問、Plugin配布4問、画像入力2問、他agentからのImport 4問。導入方法だけでなく、credential保護、暗黙trigger、配布scope、移行後の権限・認証reviewまでを学習対象にした。

## 2026-07-19 第7回拡充

190問から210問へ拡充した。追加した20問は、Memories 5問、長期Goal 4問、integrated terminal・App Git操作 5問、Linear・Slack連携 6問。継続的な作業context、検証可能な長期目標、App内でのreview、issue・threadからCloud taskへつなぐ流れを補完した。

## 2026-07-19 不正解別feedback移行 第2回

実務価値の高い10問へ不正解別feedbackを追加し、移行済みは15問になった。対象はpromptの4要素、context、境界、完了条件、AGENTS.mdの再読込、read-only・workspace-write、危険操作、未commit差分のreview。誤答ごとに「なぜ違うか」と「次に何を確認するか」を示し、名称暗記ではなく安全な実務判断の修正を優先した。
