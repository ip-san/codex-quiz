# Codex Quiz

Codexの基本と実践を、短い4択クイズで学ぶPWAです。OpenAIの公式Codexマニュアルを事実確認の基準とし、Claude Code Quizと同等水準の学習体験と品質基盤を目指しています。外部APIやログインは必要ありません。

**ブラウザ版:** https://ip-san.github.io/codex-quiz/

## 現在の機能

- 9カテゴリ・263問（公式カバレッジ優先で継続拡充中）
- [網羅性監査](docs/COVERAGE_AUDIT.md)で仕様差分・重複・不足候補を追跡（全問の最新仕様照合は継続中）
- 問題数・カテゴリ数・チャプター総数はクイズデータから自動集計
- ランダム10問とカテゴリ別学習
- 回答直後の解説
- 初回は開いて表示する学び方ガイド（いつでも再閲覧可能）
- 結果画面で苦手復習・期限到来の復習・進捗確認を案内する「次のおすすめ」
- 全263問で、選んだ誤答に応じた具体的なfeedback（クイズ開始時に遅延読込み）
- 全263問に難易度・実務価値・topic・公式reference・検証日を付与
- 263個の一意なtopic識別子を検査し、意味の重複は内容レビューで確認
- 最小対応幅320pxでクイズ・ホーム・解説・進捗の横overflowを回帰検査
- ブラウザ内への問題別回答履歴・正答率の保存
- 苦手問題だけを抽出した復習モード
- カテゴリごとの達成状況
- 進捗画面で各チャプターの回答済み・残り・一巡状態を確認し、学習へ移動
- 学習データのリセット
- クイズ中の問題ブックマーク
- キーワード検索・カテゴリ絞り込み対応の解説リーダー
- 解説リーダーで苦手問題・復習時期が来た問題を絞り込み、復習前に解説を確認
- 解説カードからその1問に挑戦し、公式資料を別タブで参照
- SRS（間隔反復）による問題別の次回復習スケジュール
- 復習期限が来た問題を3問で確認する60秒チェック
- 学習履歴・SRS・ブックマークのJSONエクスポート／検証付きインポート
- 実ファイルの書き出し・再読込み、不正ファイル拒否・置換キャンセルをブラウザで回帰検査
- 問題、カテゴリ、解説リーダー、進捗画面のURL共有
- 回答位置・スコア・解説表示を保持する途中セッション再開
- 保存セッションの位置・スコア・選択肢・モードを検証し、不正な再開データを除外
- 保存進捗の構造を検証し、破損データは復旧用の別キーへ退避して起動
- 結果画面から同じ出題範囲・学習モードで再挑戦
- 数字キー、Enter、B、Escによるキーボード操作
- 9チャプターの全体像学習パス
- 実務の順序で学ぶ15の実践シナリオ（各3問、途中再開・順序を保った再挑戦）。不具合修正・引き継ぎ・並列作業・CI連携・Hook検査・最小権限・会話の再開と切り替え・チーム指示の不適用診断・定期タスク運用・Cloud環境の診断・App Server移行・MCP接続の復旧・worktreeの環境復旧・長期Goalの安全な進行・GitHubレビューの復旧と修正依頼を学習
- 解説を先に学ぶ「読んでから解く」モード
- 9カテゴリから均等にランダム抽出した100問を途中採点なしで解く実力テスト
- 58問の図解（31件の再生・コピー可能なterminal操作例を含む）
- スマートフォン対応
- インストール可能なPWAとオフラインキャッシュ（Android / iOSホーム画面対応）
- キャッシュ更新は本アプリの領域に限定し、未取得の画像・スクリプトへHTMLを返さない

## 開発

Node.js 22.19以上が必要です（Lighthouse 13の実行要件）。依存更新時は `npm audit` と通常の品質・ブラウザ検査を実施します。

```bash
npm install
npm run dev
```

本番ビルドは `npm run build`、型チェックは `npm run typecheck` で実行します。

## 品質ゲート

`npm run test:pwa` は本番ビルドを実ブラウザで開き、worker再登録時の旧キャッシュ整理、他アプリのキャッシュ保持、取得済み問題のオフライン再開、再接続後の進捗を検査します。初回アクセス前や未取得データのオフライン利用は保証しません。

```bash
npm run check
```

次の検査を順番に実行します。

- TypeScript型チェック
- Biome lint（警告も失敗扱い）
- フォーマット検査
- Vitestユニットテスト
- TypeScript型カバレッジ95%以上
- Vite本番ビルド
- 本番JavaScript bundleのサイズ上限検査

`npm run quiz:check` では、問題ID、カテゴリ、4択、正解インデックス、問題・選択肢の重複、解説長、公式出典を検査します。GitHub Actionsでもpush・Pull Requestごとに同じ品質ゲートを実行します。

`npm run test:e2e` ではChromium上の主要導線に加え、home・quiz・chapter・result・reader・progressをaxe-coreで検査し、WCAG 2.1 A/AA違反を検出します。

`npm run lighthouse:check` では本番ビルドをローカル配信し、Performance 80、Accessibility 95、Best Practices 90、SEO 80を最低スコアとして検査します。

LighthouseのChrome起動に必要なchrome-launcherは開発依存として明示しています。ローカル実行には対応するChromeも必要です。

## GitHub Pagesへのデプロイ

`main`ブランチへpushすると、`.github/workflows/deploy-pages.yml` が品質ゲートと本番ビルドを実行し、成功した `dist/` をGitHub Pagesへ公開します。手動実行はGitHub Actionsの「Deploy GitHub Pages」から行えます。

workflowは初回デプロイ時にGitHub Pagesの有効化も試みます。組織やリポジトリのポリシーで自動有効化が許可されない場合は、GitHubリポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。

## 出題カテゴリ

- 基本操作
- プロンプト
- AGENTS.md
- 権限と安全
- 設定
- Skills・MCP・Pluginによる拡張
- セッション・コンテキスト管理
- レビュー・Worktree・並列作業
- App・IDE・CLI・Cloudの使い分け

Codexは更新されるため、公開前および問題追加時には公式ドキュメントとの再照合が必要です。本アプリはOpenAIの公式製品ではありません。

## ドキュメント

目的別の読書順と全資料は [docs/README.md](docs/README.md) にまとめています。

- 問題を追加・改善する: [クイズ管理](docs/QUIZ_MANAGEMENT.md)
- 品質基準と公式仕様の追跡: [品質運用](docs/QUALITY_OPERATIONS.md)
- 実装の全体像: [アーキテクチャ](docs/ARCHITECTURE.md)
- 開発環境とコマンド: [開発ガイド](docs/DEVELOPMENT.md)
