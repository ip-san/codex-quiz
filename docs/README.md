# Codex Quiz ドキュメント

このディレクトリは、Codex Quizを使う人、問題を編集する人、アプリを開発する人のための運用資料です。実装済みの仕様と将来計画を混同しないよう、計画はロードマップへ分離しています。

## 読書ガイド

### クイズを使ってCodexを学ぶ

1. [プロジェクトREADME](../README.md) — 機能、起動方法、公開URL
2. [コンテンツ・カバレッジ](CONTENT_COVERAGE.md) — 何を学べて、何が未対応か

### 問題を追加・改善する

1. [クイズ管理](QUIZ_MANAGEMENT.md) — 問題設計、データ形式、追加手順
2. [コンテンツ品質基準](CONTENT_QUALITY.md) — 実務価値、誤答、出典の判断基準
3. [品質運用](QUALITY_OPERATIONS.md) — 検証、公式仕様の更新監査

### アプリを開発する

1. [開発ガイド](DEVELOPMENT.md) — セットアップ、コマンド、変更手順
2. [アーキテクチャ](ARCHITECTURE.md) — データ、画面、保存、配信の関係
3. [設計判断](DECISIONS.md) — なぜ現在の方式を選んだか
4. [追いつきロードマップ](PARITY_ROADMAP.md) — 実装済みと今後の優先順位

## 文書の責務

| 文書 | 更新するタイミング |
|---|---|
| `README.md` | 利用者に見える機能、起動方法、公開方法が変わったとき |
| `CONTENT_COVERAGE.md` | 公式トピックの対応状況が変わったとき |
| `QUIZ_MANAGEMENT.md` | 問題スキーマや追加手順が変わったとき |
| `CONTENT_QUALITY.md` | 採用基準やコンテンツlint規則が変わったとき |
| `QUALITY_OPERATIONS.md` | CI、品質ゲート、定期監査が変わったとき |
| `ARCHITECTURE.md` | 主要コンポーネント、保存方式、デプロイ構成が変わったとき |
| `DECISIONS.md` | 後から理由を知る必要がある設計判断を行ったとき |
| `PARITY_ROADMAP.md` | Claude版との差分や優先順位が変わったとき |

文書内の相対リンクは `npm run docs:check` で検査します。実装予定の機能を現在の機能として記載しないことも、ドキュメント品質の一部です。
