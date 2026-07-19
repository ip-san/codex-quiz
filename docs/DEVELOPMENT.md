# 開発ガイド

## 必要な環境

- Node.js 22
- npm
- Git

```bash
git clone https://github.com/ip-san/codex-quiz.git
cd codex-quiz
npm ci
npm run dev
```

開発サーバーが表示したURLをブラウザで開きます。既定は `http://localhost:5173/` です。

## コマンド

| コマンド | 用途 |
|---|---|
| `npm run dev` | Vite開発サーバー |
| `npm run test` | Vitestを1回実行 |
| `npm run test:watch` | テストの監視実行 |
| `npm run typecheck` | TypeScriptの型検査 |
| `npm run lint` | Biome lint。警告も失敗 |
| `npm run format` | `src/`をBiomeで整形 |
| `npm run quiz:check` | 問題データ検証 |
| `npm run docs:check` | 文書内のローカルリンク検証 |
| `npm run check` | push前に必要な全品質ゲート |
| `npm run build` | `dist/`へ本番ビルド |
| `npm run preview` | 本番ビルドをローカル表示 |

## ディレクトリ

```text
codex-quiz/
├── .github/workflows/   # CIとGitHub Pages
├── docs/                # 設計・コンテンツ・運用文書
├── public/              # PWA manifest、アイコン、Service Worker
├── scripts/             # リポジトリ品質検査
├── src/
│   ├── components/      # 再利用UI
│   ├── domain/          # 純粋な学習ロジック
│   ├── App.tsx          # アプリケーション画面
│   ├── data.ts          # クイズデータ
│   └── diagrams.ts      # 解説用図解
└── vite.config.ts
```

## 変更の進め方

1. 変更対象と関連テストを確認する。
2. コンテンツ変更なら[クイズ管理](QUIZ_MANAGEMENT.md)に従って公式資料を確認する。
3. 実装し、利用者から見える変更ならREADMEや関連文書も更新する。
4. `npm run check` を実行する。
5. ブラウザでモバイル幅とデスクトップ幅を確認する。

### 問題を追加する

`src/data.ts`へ追加し、必要なら `src/diagrams.ts` に同じ問題IDの図解を定義します。ID、メタデータ、問題設計の規則は[クイズ管理](QUIZ_MANAGEMENT.md)を参照してください。

### 図解を追加する

`terminal` はコマンドの入出力、`flow` は順序や分岐、`comparison` は使い分け、`config` は設定ファイルの構造に使います。装飾目的ではなく、文章だけでは関係を把握しにくい問題へ追加します。

### テストを追加する

副作用のないロジックは `src/domain/` に置き、隣接する `*.test.ts` で検証します。問題データ全体に適用する不変条件は `quizValidation.ts` とそのテストへ追加します。

## デバッグ

- 変更が反映されない: 開発サーバーを再起動し、PWAの古いService Workerやキャッシュを削除する。
- Pagesでアセットが見つからない: `vite.config.ts` の相対 `base` と `dist/` を確認する。
- 保存データで画面が壊れる: JSONエクスポート後にサイトデータを消し、再現性を確認する。
- CIだけ失敗する: Node.js 22で `npm ci && npm run check` を再現する。
