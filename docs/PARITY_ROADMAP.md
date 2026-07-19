# Claude Code Quiz → Codex Quiz 機能移植ロードマップ

Codex QuizはUIの複製ではなく、OpenAI公式Codexマニュアルを事実確認の基準として、Claude Code Quizと同等の学習体験・保守性・品質ゲートを実現する。

## 2026-07-19 比較監査からの導入

Claude版の成熟したcontent quality gateを参考にし、Claude固有のカテゴリや用語は転用せず、Codex版へID prefixとcategoryの対応、空choice、正解へのwrongFeedback混入、topic命名、verifiedAt形式の検査を追加した。今後はE2E・a11y・bundle制限をCodex版の構成に合わせて段階導入する。

## 実装済み

- レスポンシブPWA、オフラインキャッシュ
- ランダム・カテゴリ・苦手・60秒復習
- 問題別履歴、SRS、ブックマーク、解説リーダー
- 検索、カテゴリフィルター、URL共有
- 進捗、カテゴリ習熟度、連続学習、セッション履歴
- セッション再開、データのエクスポート／インポート
- キーボード操作
- 問題バリデーション（ID・カテゴリ・choice・feedback・metadata）、Vitest、Biome、型カバレッジ、CI
- 本番entry bundleのraw・gzip上限検査
- server-renderによるlandmark・操作名検査、クイズ進捗・回答結果のARIA対応
- Chromium E2Eによるhome・回答focus・URL共有・deep link検査

## 開発中

- 全体像学習パスとチャプター
- 読んでから解くモード
- 実力テスト
- 難易度別出題
- Codex固有問題の大幅拡充

## 次段階

- 初回チュートリアル、チャプター修了状態、修了証
- 実践シナリオ
- 日次目標、XP、習熟レベル、学習推奨
- ダークモード、テーマ設定、通知、PWA更新UI
- browser E2Eへのaxe統合、Visual Regression、Lighthouse
- 問題の公式ドキュメント差分監査と自動品質ループ
- Electron版とCodex利用履歴レコメンド

## 問題品質の方針

1. OpenAI公式Codexマニュアルを一次情報とする。
2. 出典名を全問題へ付ける。
3. 構造検査と重複検査をCIで必須にする。
4. 更新されやすいコマンド、機能成熟度、モデル名、提供条件は定期監査する。
5. Claude固有の知識を名称置換だけで流用しない。

詳細は [CONTENT_QUALITY.md](CONTENT_QUALITY.md) を参照する。

詳細な採用基準とClaude版から移植する品質検査は [CONTENT_QUALITY.md](CONTENT_QUALITY.md) を参照する。
