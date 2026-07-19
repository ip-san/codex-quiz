# アーキテクチャ

Codex Quizは、React + TypeScript + Viteで構成したブラウザ完結型PWAです。サーバーやログインを必要とせず、問題データと学習履歴を端末内で扱います。

## 全体像

```mermaid
flowchart LR
  D["src/data.ts\n問題・カテゴリ"] --> A["App.tsx\n画面とセッション"]
  G["src/diagrams.ts\n図解データ"] --> A
  A --> C["Quiz UI\n出題・解説・検索"]
  A <--> L["localStorage\n進捗・SRS・再開"]
  V["quizValidation.ts\nコンテンツ検証"] --> D
  T["Vitest / TypeScript / Biome"] --> B["Vite build"]
  B --> P["Service Worker付きPWA"]
  P --> H["GitHub Pages"]
```

## 主なモジュール

| ファイル | 責務 |
|---|---|
| `src/data.ts` | 型、カテゴリ、学習目標、問題データ |
| `src/App.tsx` | 画面遷移、クイズ進行、検索、入出力、URL共有 |
| `src/domain/choiceOrder.ts` | 選択肢と正解位置のランダム化 |
| `src/domain/progressData.ts` | 保存データの解釈と検証 |
| `src/domain/spacedRepetition.ts` | 正誤に基づく次回復習日の計算 |
| `src/diagrams.ts` | 問題IDに対応する図解定義 |
| `src/components/DiagramRenderer.tsx` | terminal / flow / comparison / configの表示 |
| `src/quizValidation.ts` | 問題データの機械検査 |
| `src/scenarios.ts` | 将来のシナリオ学習用データ。現時点ではUI未接続 |

現状は機能の多くを `App.tsx` が統括しています。機能境界は存在しますが、画面単位の分割は今後の課題です。ロードマップ上の理想構造を現状として説明しない方針です。

## クイズのデータフロー

```mermaid
sequenceDiagram
  participant U as User
  participant A as App
  participant Q as Quiz data
  participant S as localStorage

  U->>A: モードを選択
  A->>Q: 条件に合う問題を抽出
  A->>A: 選択肢をランダム化
  U->>A: 回答
  A->>S: 正答数・回答数・SRSを保存
  A-->>U: 正誤、解説、図解、公式出典
```

正解位置の暗記を防ぐため、問題データの `answer` は表示前に選択肢と一緒に並べ替えます。保存時は問題IDを安定キーとして使います。

## 保存とプライバシー

学習履歴、ブックマーク、SRS、途中セッションはブラウザの `localStorage` に保存します。外部分析サービスやバックエンドへ送信しません。JSONエクスポートは端末移行用で、インポート時に構造を検証します。

この方式は簡単でオフラインに強い一方、ブラウザデータ削除で履歴が失われ、複数端末で自動同期されません。

## PWAと配信

Viteの本番成果物 `dist/` にmanifestとService Workerを含めます。`main`へのpushで品質ゲートを通過した成果物をGitHub Pagesへ配信します。

```mermaid
flowchart TD
  M[mainへpush] --> Q[npm run check]
  Q -->|成功| B[Vite build]
  Q -->|失敗| X[配信停止]
  B --> A[Pages artifact]
  A --> P[GitHub Pages]
  P --> S[Service Workerが更新を取得]
```

初回だけリポジトリ設定でPagesのSourceをGitHub Actionsにする必要があります。詳細は[プロジェクトREADME](../README.md#github-pagesへのデプロイ)を参照してください。

## 信頼境界

- 問題の事実根拠はOpenAI公式Codexドキュメントを優先します。
- 外部URLは表示用の出典であり、アプリ実行中に内容を取得しません。
- インポートデータは信用せず、期待するキーと値を検証します。
- PWAは静的配信であり、秘密情報をリポジトリやビルド成果物へ含めません。
