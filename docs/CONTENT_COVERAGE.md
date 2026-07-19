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

## 2026-07-19 不正解別feedback移行 第3回

AGENTS.mdの配置・階層・初期化・読込・override、承認mode、sandbox、最小権限、追加write directory、reviewの基本動作を扱う10問へfeedbackを追加し、移行済みは25問になった。誤答した設定名の訂正だけでなく、権限を広げすぎないこと、作業を失わないこと、指示を再読込する手順を説明する。

## 2026-07-19 不正解別feedback移行 第4回

CLI surface、Plan、実装後の検証、非対話実行、session再開、user・project config、設定対象、one-off override、profileを扱う10問へfeedbackと追跡metadataを追加し、移行済みは35問になった。うち`codex exec`と`codex resume`の2問は名称暗記から、CI連携・前日のcontext継続を判断するscenario型へ書き換えた。

## 2026-07-19 不正解別feedback移行 第5回

CLI review・fork・Cloud差分適用・completion・doctorと、model override・strict config・working directory・feature override・local providerの10問をscenario型へ書き換え、feedbackと追跡metadataを追加した。移行済みは45問。公式領域の監査では主要topicに既存問題があるため問題数は210問を維持し、未移行50問の改善を優先する。

## 2026-07-19 高価値カバレッジ追加 第1回

公式マニュアルとの深度比較で不足していたCodex Security 6問、SDK・app-server 4問を追加し、210問から220問へ拡充した。threat model改善、validated finding、patchと人間review、scoped scan、SDK thread、app-server transport認証、experimental API、structured outputを扱う。全問をscenario型とし、不正解別feedbackと全追跡metadataを追加した。

## 2026-07-19 高価値カバレッジ追加 第2回

企業・チーム運用で事故を防ぐ10問を追加し、220問から230問へ拡充した。workspace-write内のprotected pathとgitdir pointer、granular approval、auto-reviewの対象・fail-closed・managed policy、shell environment policyとsecret filter、requirements.toml、networkとfilesystem policyの分離をscenario型で扱う。全問へ不正解別feedbackと追跡metadataを付与した。

## 2026-07-19 高価値カバレッジ追加 第3回

障害切り分け・認証・観測性・network最小権限の10問を追加し、230問から240問へ拡充した。network proxyのenablementとdomain/local rule、企業CA、CIのAPI key scope、OTel privacy、login・exec diagnostics、MCP OAuth callback、write tool approvalをscenario型で扱う。全問へ不正解別feedbackと追跡metadataを付与した。

## 2026-07-19 不正解別feedback移行 第6回

既存の高価値9問を強化し、移行済みを75問から84問へ増やした。認証status、headless login、keyring保存、MCP transport・OAuth・server instructions、Skillのprogressive disclosure・最小構成・暗黙triggerを対象とし、誤答ごとに権限境界と次の安全な確認手順を説明する。認証方式選択は既に移行済みだったため重複追加していない。

## 2026-07-19 不正解別feedback移行 第7回

既存の高価値10問を強化し、移行済みを84問から94問へ増やした。managed worktreeのdetached HEAD・cleanup limit・snapshot restore・permanent運用、platform別local environment、browser profile・annotation・content trust、Appshot scope、Remote host availabilityを対象とし、誤答から復旧と最小権限の判断へつなげた。

## 2026-07-19 不正解別feedback移行 第8回

既存の高価値10問を強化し、移行済みを94問から104問へ増やした。Memoryを必須規則にしない判断、web/local storeの分離、chat control、background timing、共有前review、Goalの定義・具体化・pause/resume・permission境界、integrated terminalのscopeを対象とし、長期作業でcontextや権限を誤解しないためのfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第9回

既存の高価値10問を強化し、移行済みを104問から114問へ増やした。Linearへの委譲・repository選択・local MCP、Slackへの委譲・長いthread・Enterprise posting、integrated terminal context・Action、diff inline comment、App Git controlを対象とし、secret露出、破壊的操作、context不足を避けるfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第10回

既存の高価値10問を強化し、移行済みを114問から124問へ増やした。compact・resume・fork、subagentによるcontext整理、主threadの情報衛生、Worktreeの並列実行・setup・Handoff、LocalとCloudの選択を対象とし、data損失、差分混在、context欠落を避けるfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第11回

既存の高価値10問を強化し、移行済みを124問から134問へ増やした。Cloud secret・agent network・IDE surface、workspace-writeのnetwork分離、MCP destructive annotation、approval scope、AGENTS.mdのbyte上限・fallback・global/project分離・反復指摘の規則化を対象とし、secret露出と過剰権限を避けるfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第12回

既存の高価値10問を強化し、移行済みを134問から144問へ増やした。status・side chat・follow-up queue・archive・goal、GitHub reviewのtrigger・P0/P1優先度・階層別guidance・修正依頼、scheduled taskのprompt事前testを対象とし、context喪失、review noise、未検証の無人実行を避けるfeedbackを追加した。

## 2026-07-19 feedback遅延読込み

残り96問の移行でも初期bundle上限を維持できるよう、不正解別feedbackを問題本文から独立したchunkへ分離した。クイズ開始時に読込み、回答直後の表示は維持しつつ、初期JavaScriptを426.1 KiBから376.5 KiB、gzipを126.5 KiBから110.4 KiBへ削減した。品質検査では144問のfeedbackを問題へ結合して従来どおり全choiceを検証する。

## 2026-07-19 不正解別feedback移行 第13回

既存の高価値10問を強化し、移行済みを144問から154問へ増やした。Scheduledの管理surface・local実行条件・unattended権限、IDEの設定layer・WSL・context・review delivery、feedback報告、Windows/WSLのCodex home分離、doctor診断を対象とした。旧`/ide-context`問題は現行`/ide`を使うscenarioへ書き直した。

## 2026-07-19 アクセシビリティ品質ゲート

問題内容を増やさず、home・quiz・reader・progressの4画面へaxe-coreによるWCAG 2.1 A/AA検査を追加した。補助文字、カテゴリ表示、操作ボタン、図解キャプションのコントラストを改善し、主要導線4件と合わせてChromium E2E 8件で継続検査する。

## 2026-07-19 Lighthouse品質ゲート

本番ビルドへLighthouseの最低スコア検査を追加した。Performance 80、Accessibility 95、Best Practices 90、SEO 80を下回る退行をGitHub Actionsで検出し、問題数ではなく学習画面の配信品質を継続的に守る。
