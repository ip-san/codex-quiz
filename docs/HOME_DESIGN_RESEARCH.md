# トップページ設計の調査（2026-09-29）

目的はクイズアプリの外見を模倣することではなく、学習者が次の行動を迷わず選べる情報設計をCodex Quizへ適用すること。

| 公式資料 | 観察した設計 | Codex Quizでの判断 |
| --- | --- | --- |
| [Duolingo: Home Screen Redesign](https://blog.duolingo.com/new-duolingo-home-screen-design/) | 学習を一本道にし、復習をその経路へ組み込む。 | 全体像モードを初回の推奨にし、復習待ちがあれば先に案内する。長い一本道の強制や連続日数の競争は採用しない。 |
| [Quizlet: Learn](https://quizlet.com/features/learn) | 短い練習と、つまずきに合わせた復習を強調する。 | 途中再開・復習・10問練習をホームの優先行動にする。既存の進捗だけで判断し、実装していない個人化は謳わない。 |
| [Khan Academy: Learning Dashboard](https://blog.khanacademy.org/introducingthe-learning-dashboard/) | 次に取り組む課題と進捗をホームで示す。 | 未学習／途中再開／復習待ち／苦手あり／通常練習の順に、主アクションを1つ表示。回答済みなら進捗をすぐ見られる位置へ置く。 |
| [Brilliant: Practice](https://brilliant.org/math/practice/) | 暗記より、段階的に考えて解く過程を前面に出す。 | 「状況を読む→判断する→理由を確かめる」を冒頭で簡潔に示す。実際のCLI操作を装う表示にはしない。 |

対象は各社の公開資料・公開ページであり、ログイン後の非公開UIやA/Bテスト結果を実測したものではない。上記はCodex Quizに適用する際の設計上の推論。端末間同期やAIによる推薦は実装していないため、ホームでも約束しない。
