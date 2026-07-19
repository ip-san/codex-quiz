# クイズ管理

クイズ追加の目的は問題数を増やすことではなく、公式ドキュメントの重要な機能を、利用場面と失敗回避まで含めて学べるようにすることです。

## 追加前の設計

1. [コンテンツ・カバレッジ](CONTENT_COVERAGE.md)で不足領域を選ぶ。
2. OpenAI公式Codexドキュメントの該当ページを読む。
3. ページの見出しをそのまま問題にせず、「利用者ができるようになる判断」を1つ定める。
4. 既存問題を検索し、同じ事実の言い換えでないことを確認する。
5. シナリオ、正解、現実的な誤解、解説、出典を一組として作る。

良い学習目標の例は「Worktreeという名称を覚える」ではなく、「進行中のLocal変更を壊さず並列作業するときWorktreeを選べる」です。

## 現在のデータ形式

```ts
type Quiz = {
  id: string;
  category: Category;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  source: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  value?: "practical" | "neutral" | "trivia";
  topic?: string;
  referenceUrl?: string;
  verifiedAt?: string;
};
```

古い問題との段階的互換性のため高度なメタデータは型上optionalですが、新規問題では `difficulty`、`value`、`topic`、`referenceUrl`、`verifiedAt`を必須として扱います。不正解別 `wrongFeedback` は次のスキーマ移行で追加予定です。

## フィールド規則

| フィールド | 規則 |
|---|---|
| `id` | 英小文字の接頭辞 + 2桁以上の連番。一度公開したIDを再利用しない |
| `category` | `basics`, `prompting`, `agents`, `security`, `config`, `extend`, `session`, `workflow`, `surfaces` |
| `question` | 1つの判断だけを問い、全角 `？` で終える |
| `choices` | 4つ。同じ文体と粒度で、冗談と分かる誤答を避ける |
| `answer` | 0始まりの正解位置。表示時にはランダム化される |
| `explanation` | なぜ正しいか、いつ使うか、混同しやすい機能との違いを書く |
| `source` | 人が識別できる公式ページ名 |
| `topic` | `worktree.handoff` のような安定した監査キー |
| `referenceUrl` | `learn.chatgpt.com` または `developers.openai.com` の該当ページ |
| `verifiedAt` | 公式資料を最後に確認した `YYYY-MM-DD` |

## 問題の品質チェック

### 採用しやすい問題

- 状況を提示し、Codexの機能や安全な操作を選ばせる。
- 似た機能の境界を問う。例: resumeとfork、LocalとWorktree。
- よくある失敗を避ける。例: Cloud secretの利用フェーズ。
- 回答後の解説だけ読んでも実務に持ち帰れる。

### 書き直す問題

- フラグ名、ファイル名、数字だけを暗記させる。
- 正解だけ極端に長い、具体的、コード書式付きである。
- 誤答が存在しない機能や明らかな冗談である。
- 公式資料に根拠がなく、推測や一時的なUIだけに依存する。
- 既存問題と同じ知識を別の言葉で聞くだけである。

## 図解の選び方

| 図解 | 適する内容 | 例 |
|---|---|---|
| terminal | コマンドと結果の対応 | `/compact`、`codex review` |
| flow | 3段階以上の処理や状態遷移 | Cloudのsetup → agent → result |
| comparison | 3項目以上の使い分け | Local / Worktree / Cloud |
| config | 設定の階層や配置 | `.worktreeinclude`、AGENTS.md |

図解は `src/diagrams.ts` で問題IDへ紐付けます。文章の単なる再掲ではなく、順序、分岐、包含、比較のいずれかを明確にしてください。

## 追加後の検証

```bash
npm run quiz:check
npm run check
```

最後にブラウザで、問題文、ランダム化後の正解、全選択肢、解説、図解、公式リンクを確認します。カテゴリ件数だけで完了判定せず、カバレッジ表の「次の重点」が解消されたかを更新します。
