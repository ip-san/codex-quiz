# Codex Quiz

Codexの基本と実践を、短い4択クイズで学ぶPWAです。OpenAIの公式Codexマニュアルを事実確認の基準とし、Claude Code Quizと同等水準の学習体験と品質基盤を目指しています。外部APIやログインは必要ありません。

**ブラウザ版:** https://ip-san.github.io/codex-quiz/

## 現在の機能

- 9カテゴリ・240問（公式カバレッジ優先で継続拡充中）
- ランダム10問とカテゴリ別学習
- 回答直後の解説
- 実務価値の高い134問で、選んだ誤答に応じた具体的なfeedback（全問題へ段階的に移行中）
- ブラウザ内への問題別回答履歴・正答率の保存
- 苦手問題だけを抽出した復習モード
- カテゴリごとの達成状況
- 学習データのリセット
- クイズ中の問題ブックマーク
- キーワード検索・カテゴリ絞り込み対応の解説リーダー
- SRS（間隔反復）による問題別の次回復習スケジュール
- 復習期限が来た問題を3問で確認する60秒チェック
- 学習履歴・SRS・ブックマークのJSONエクスポート／検証付きインポート
- 問題、カテゴリ、解説リーダー、進捗画面のURL共有
- 回答位置・スコア・解説表示を保持する途中セッション再開
- 数字キー、Enter、B、Escによるキーボード操作
- 9チャプターの全体像学習パス
- 解説を先に学ぶ「読んでから解く」モード
- 全問題を途中採点なしで解く実力テスト
- スマートフォン対応
- インストール可能なPWAとオフラインキャッシュ

## 開発

```bash
npm install
npm run dev
```

本番ビルドは `npm run build`、型チェックは `npm run typecheck` で実行します。

## 品質ゲート

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

`npm run test:e2e` ではChromium上の主要導線に加え、home・quiz・reader・progressをaxe-coreで検査し、WCAG 2.1 A/AA違反を検出します。

`npm run lighthouse:check` では本番ビルドをローカル配信し、Performance 80、Accessibility 95、Best Practices 90、SEO 80を最低スコアとして検査します。

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
