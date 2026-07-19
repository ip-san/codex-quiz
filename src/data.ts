export type Category = "basics" | "prompting" | "agents" | "security" | "config" | "extend";
export type Difficulty = "beginner" | "intermediate" | "advanced";

export type Quiz = {
  id: string;
  category: Category;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
  source: string;
};

export const categories: Record<Category, { label: string; icon: string; description: string }> = {
  basics: { label: "基本操作", icon: "⌘", description: "Codexの入口と作業の進め方" },
  prompting: { label: "プロンプト", icon: "✦", description: "伝わる依頼とコンテキスト" },
  agents: { label: "AGENTS.md", icon: "A", description: "リポジトリの永続的な指示" },
  security: { label: "権限と安全", icon: "◇", description: "承認とサンドボックス" },
  config: { label: "設定", icon: "⚙", description: "config.tomlと動作の調整" },
  extend: { label: "拡張", icon: "+", description: "Skills・MCP・自動化" },
};

export const categoryLearning: Record<Category, { chapter: number; difficulty: Difficulty; goal: string }> = {
  basics: { chapter: 1, difficulty: "beginner", goal: "Codexの入口と、安全な作業の進め方をつかむ" },
  prompting: { chapter: 2, difficulty: "beginner", goal: "目標・文脈・制約・完了条件を伝えられる" },
  agents: { chapter: 3, difficulty: "intermediate", goal: "AGENTS.mdでチームのルールを永続化する" },
  security: { chapter: 4, difficulty: "intermediate", goal: "承認とサンドボックスを適切に選べる" },
  config: { chapter: 5, difficulty: "intermediate", goal: "個人設定とプロジェクト設定を使い分ける" },
  extend: { chapter: 6, difficulty: "advanced", goal: "Skills、MCP、PluginでCodexを拡張する" },
};

export const quizzes: Quiz[] = [
  { id: "basic-01", category: "basics", question: "ターミナルからCodexを使うための主な製品は？", choices: ["Codex CLI", "Responses API", "Canvas", "DALL·E"], answer: 0, explanation: "Codex CLIは、ローカルのリポジトリをターミナルから扱うためのCodexクライアントです。", source: "Codex quickstart" },
  { id: "basic-02", category: "basics", question: "複雑で曖昧なタスクに着手する前の推奨アプローチは？", choices: ["確認せず全ファイルを書き換える", "Planモードで要件を整理する", "必ず新規リポジトリを作る", "テストを削除する"], answer: 1, explanation: "難しいタスクでは、Planモードでコンテキストを集め、要件を明確にしてから実装する方法が推奨されています。", source: "Codex best practices" },
  { id: "basic-03", category: "basics", question: "Codexに変更を依頼した後、信頼性を高める行動は？", choices: ["出力をそのまま本番へ送る", "テスト・型チェック・差分レビューを行う", "会話をすぐ削除する", "モデル名を毎回変更する"], answer: 1, explanation: "変更後は関連テストやlintを実行し、要件どおりか差分をレビューするのが基本です。", source: "Codex best practices" },
  { id: "prompt-01", category: "prompting", question: "大きなタスクの依頼に含めると効果的な4要素は？", choices: ["目標・背景・制約・完了条件", "予算・住所・時刻・署名", "モデル・温度・乱数・画像", "ブランチ・タグ・Issue・PR"], answer: 0, explanation: "Goal、Context、Constraints、Done whenを示すと、スコープと成功条件が明確になります。", source: "Codex best practices" },
  { id: "prompt-02", category: "prompting", question: "良い依頼の書き出しとして最も適切なのは？", choices: ["実現したい結果を先に伝える", "全手順を一語ずつ固定する", "背景だけを書いて結果は伏せる", "曖昧な代名詞だけを使う"], answer: 0, explanation: "まず必要な結果を伝え、結果を左右する背景・出力形式・境界条件を追加します。", source: "Prompting Codex" },
  { id: "prompt-03", category: "prompting", question: "コンテキストとして渡す情報の選び方は？", choices: ["リポジトリ全体を毎回貼る", "結果を変えうる関連情報に絞る", "エラーは省略する", "ファイル名を隠す"], answer: 1, explanation: "関連ファイル、エラー、仕様など、結果に影響する情報を具体的に示すのが有効です。", source: "Prompting Codex" },
  { id: "agents-01", category: "agents", question: "リポジトリで繰り返し使う開発ルールを置く最適な場所は？", choices: ["AGENTS.md", "package-lock.json", ".gitignore", "スクリーンショット"], answer: 0, explanation: "AGENTS.mdは、ビルド方法、規約、検証手順などの永続的なガイダンスをCodexへ伝えます。", source: "AGENTS.md guide" },
  { id: "agents-02", category: "agents", question: "ルートとサブディレクトリにAGENTS.mdがある場合、優先されるのは？", choices: ["常にルート", "作業場所に近いファイル", "更新日時が古いファイル", "ファイルサイズが大きい方"], answer: 1, explanation: "Codexはルートから作業ディレクトリへ指示を連結し、より近い階層の指示が後から適用されます。", source: "AGENTS.md guide" },
  { id: "agents-03", category: "agents", question: "CLIでAGENTS.mdの雛形を作るクイックスタートコマンドは？", choices: ["/init", "/reset", "/deploy", "/export"], answer: 0, explanation: "/initで現在のリポジトリ向けのAGENTS.md雛形を作れます。内容は実際の開発方法に合わせて編集します。", source: "Codex best practices" },
  { id: "safe-01", category: "security", question: "Codexの「承認モード」が制御するものは？", choices: ["どのモデルを使うか", "コマンド実行時にいつ許可を求めるか", "コードの文字コード", "Gitのコミット名"], answer: 1, explanation: "承認モードは、操作を実行する前にユーザーの許可が必要になる条件を決めます。", source: "Codex configuration" },
  { id: "safe-02", category: "security", question: "サンドボックスモードが主に制御するものは？", choices: ["アクセスできるファイルや書き込み範囲", "回答の言語", "エディタの配色", "クイズの難易度"], answer: 0, explanation: "サンドボックスは、ファイルシステムやネットワークなど、エージェントがアクセス可能な範囲を制限します。", source: "Codex security" },
  { id: "safe-03", category: "security", question: "初めてCodexを使う場合の権限設定として推奨される考え方は？", choices: ["最初から全権限を与える", "既定の制限から始め、必要に応じて緩める", "承認をすべて無効にする", "システム全体を書き込み可能にする"], answer: 1, explanation: "まず既定の権限を使い、信頼できるリポジトリや必要な操作に限って段階的に調整します。", source: "Codex best practices" },
  { id: "config-01", category: "config", question: "リポジトリ固有のCodex設定を置く場所は？", choices: [".codex/config.toml", ".git/config", "src/config.ts", "README.lock"], answer: 0, explanation: "プロジェクト固有の設定にはリポジトリ内の.codex/config.tomlを使います。", source: "Codex configuration" },
  { id: "config-02", category: "config", question: "個人のデフォルト設定を複数リポジトリで共有する主な場所は？", choices: ["~/.codex/config.toml", "各リポジトリのindex.html", "/tmp/config.json", "GitHub Issue"], answer: 0, explanation: "個人の既定値は~/.codex/config.tomlに置き、プロジェクト固有の設定と分離します。", source: "Codex configuration" },
  { id: "config-03", category: "config", question: "設定で調整できる項目の組み合わせとして正しいものは？", choices: ["モデル・推論レベル・サンドボックス・MCP", "CPU温度・画面解像度・Wi-Fi名", "GitHubの株価・天気・時刻", "HTMLタグ・CSS色だけ"], answer: 0, explanation: "config.tomlではモデル、推論、権限、MCP、機能フラグなどの動作を調整できます。", source: "Codex configuration" },
  { id: "extend-01", category: "extend", question: "繰り返し行う作業手順を再利用可能にする仕組みは？", choices: ["Skill", "Cookie", "Viewport", "Commit hash"], answer: 0, explanation: "Skillは、専門知識や手順、参照資料、スクリプトをまとめた再利用可能なワークフローです。", source: "Codex skills" },
  { id: "extend-02", category: "extend", question: "Codexを外部サービスやライブデータへ接続する標準的な仕組みは？", choices: ["MCP", "CSS Modules", "WebAssemblyだけ", "Git tag"], answer: 0, explanation: "MCPサーバーやアプリコネクタを使うことで、外部データや操作をツールとしてCodexへ提供できます。", source: "Codex MCP" },
  { id: "extend-03", category: "extend", question: "SkillとPluginの使い分けとして適切なのは？", choices: ["個別の再利用手順はSkill、配布可能な機能一式はPlugin", "どちらも画像形式", "SkillはOS、PluginはCPU", "完全に同じで区別はない"], answer: 0, explanation: "Skillは再利用ワークフロー、PluginはSkills・MCP・Hooksなどを共有・配布できるバンドルです。", source: "Codex plugins" },
  { id: "basic-04", category: "basics", question: "Codexを非対話で実行するCLIサブコマンドは？", choices: ["codex exec", "codex paint", "codex mount", "codex serve-html"], answer: 0, explanation: "codex execはCodexを非対話で実行し、結果を標準出力またはJSONLとして扱えるコマンドです。", source: "Codex CLI command reference" },
  { id: "basic-05", category: "basics", question: "以前の対話セッションを続けるためのCLIサブコマンドは？", choices: ["codex resume", "codex rewind", "codex replay-file", "codex restore-git"], answer: 0, explanation: "codex resumeは保存されたセッションをIDで指定するか、直近の対話を選んで継続するために使います。", source: "Codex CLI command reference" },
  { id: "prompt-04", category: "prompting", question: "実際の送信や削除を避けたい依頼で明示すべきものは？", choices: ["境界条件として下書きだけ作ると伝える", "モデルへ判断を完全に委ねる", "対象の名前を省略する", "完了条件を書かない"], answer: 0, explanation: "外部へ影響する操作では、下書きのみ、送信しないなど重要な境界条件を明示すると意図しない実行を防げます。", source: "Prompting Codex" },
  { id: "prompt-05", category: "prompting", question: "高品質な実装依頼の完了条件として適切なのは？", choices: ["関連テストと型チェックが成功する", "コード行数が必ず増える", "質問を一切しない", "すべてのファイルを変更する"], answer: 0, explanation: "テスト成功や不具合の再現停止など、確認可能な状態を完了条件にすると実装結果を評価しやすくなります。", source: "Codex best practices" },
  { id: "agents-04", category: "agents", question: "AGENTS.mdの探索が通常行われるタイミングは？", choices: ["Codexの実行またはTUIセッション開始時", "ファイル保存のたび", "Git commitのたび", "OS再起動時だけ"], answer: 0, explanation: "Codexは作業開始時に指示チェーンを構築します。TUIでは通常、起動したセッションごとに一度読み込みます。", source: "AGENTS.md guide" },
  { id: "agents-05", category: "agents", question: "同じ階層にAGENTS.override.mdがある場合の扱いは？", choices: ["通常のAGENTS.mdより先に選ばれる", "常に無視される", "両方がランダムに選ばれる", "画像として読み込まれる"], answer: 0, explanation: "各階層ではAGENTS.override.mdが先に確認され、存在する場合は通常のAGENTS.mdに代わる指示として使われます。", source: "AGENTS.md guide" },
  { id: "safe-04", category: "security", question: "メインworkspace以外へ追加の書き込み権限を与えるCLIフラグは？", choices: ["--add-dir", "--write-everywhere", "--mount-root", "--disable-git"], answer: 0, explanation: "--add-dirはメインworkspaceに加えて指定ディレクトリへの書き込みアクセスを付与し、複数回指定できます。", source: "Codex CLI command reference" },
  { id: "safe-05", category: "security", question: "--dangerously-bypass-approvals-and-sandboxを使うべき環境は？", choices: ["外部で十分に隔離・防御された環境だけ", "初めて開く任意のリポジトリ", "個人PCのルートディレクトリ", "本番サーバーへ直接接続した状態"], answer: 0, explanation: "このフラグは承認とサンドボックスを回避するため、外部の仕組みで十分に防御された環境に限定すべきです。", source: "Codex CLI command reference" },
  { id: "config-04", category: "config", question: "CLIの-c key=valueオプションは何に使う？", choices: ["その実行だけ設定値を上書きする", "Gitコミットを作成する", "設定ファイルを削除する", "CSS変数を定義する"], answer: 0, explanation: "-cまたは--configはkey=valueで設定を渡し、config.tomlの既定値より優先してその呼び出しに適用します。", source: "Codex CLI command reference" },
  { id: "config-05", category: "config", question: "CLIで名前付き設定プロファイルを選ぶフラグは？", choices: ["--profile または -p", "--persona または -u", "--preset-css", "--branch-profile"], answer: 0, explanation: "--profileまたは-pは、CODEX_HOME内にある名前付きのprofile設定を基本設定へ重ねるために使います。", source: "Codex CLI command reference" },
  { id: "extend-04", category: "extend", question: "MCPサーバーの追加・一覧・削除・認証に使うCLIサブコマンドは？", choices: ["codex mcp", "codex bridge-css", "codex api-only", "codex socket-file"], answer: 0, explanation: "安定版のcodex mcpサブコマンドは、MCPサーバーの一覧、追加、削除、認証を管理するために使います。", source: "Codex CLI command reference" },
  { id: "extend-05", category: "extend", question: "CodexでSkillを明示的に指定するときに使える表記は？", choices: ["$を付けたSkill名", "HTMLのscriptタグ", "Gitのcommit hashだけ", "CSSのクラスセレクター"], answer: 0, explanation: "Codexではドル記号を付けたSkill名で明示的に選択できます。目的に一致すれば暗黙に選ばれる場合もあります。", source: "Codex Skills & Plugins" },
  { id: "basic-06", category: "basics", question: "未コミット変更やブランチ差分をレビューするCLIサブコマンドは？", choices: ["codex review", "codex inspect-css", "codex audit-disk", "codex diff-only"], answer: 0, explanation: "codex reviewは未コミット変更、基準ブランチとの差分、コミット、独自の指示を対象に非対話レビューを実行します。", source: "Codex CLI command reference" },
  { id: "basic-07", category: "basics", question: "元の対話を残して別の会話へ分岐するCLIサブコマンドは？", choices: ["codex fork", "codex split-file", "codex clone-model", "codex branch-git"], answer: 0, explanation: "codex forkは以前の対話内容を引き継いだ新しいチャットを作り、元のセッションを変更せずに分岐できます。", source: "Codex CLI command reference" },
  { id: "basic-08", category: "basics", question: "Codex cloudで生成された最新差分をローカルへ適用するコマンドは？", choices: ["codex apply", "codex merge-cloud", "codex download-code", "codex sync-all"], answer: 0, explanation: "codex applyはアクセス可能なCodex cloudチャットが生成した最新差分を、ローカルの作業ツリーへ適用します。", source: "Codex CLI command reference" },
  { id: "basic-09", category: "basics", question: "シェル補完スクリプトを生成するCLIサブコマンドは？", choices: ["codex completion", "codex autocomplete-ui", "codex shell-init-only", "codex hint"], answer: 0, explanation: "codex completionはBash、Zsh、Fish、PowerShell向けのシェル補完スクリプトを生成する安定版コマンドです。", source: "Codex CLI command reference" },
  { id: "basic-10", category: "basics", question: "ローカル環境の設定や認証などの診断レポートを作るコマンドは？", choices: ["codex doctor", "codex repair-all", "codex health-css", "codex diagnose-git-only"], answer: 0, explanation: "codex doctorはインストール、設定、認証、ランタイム、Git、ターミナルなどの問題を診断するレポートを生成します。", source: "Codex CLI command reference" },
  { id: "prompt-06", category: "prompting", question: "実装結果の形式が重要な場合に依頼へ含めるべきものは？", choices: ["必要な出力形式と利用目的", "無関係な長い会話履歴", "秘密情報の一覧", "曖昧な形容詞だけ"], answer: 0, explanation: "結果をどこでどう使うかと必要な形式を伝えると、長さや詳細度を実際の用途に合わせやすくなります。", source: "Prompting Codex" },
  { id: "prompt-07", category: "prompting", question: "大規模リポジトリで結果の信頼性を高めるコンテキストは？", choices: ["関連ファイル・仕様・エラー", "無関係な全社ニュース", "モデルへ見せない制約", "空の添付ファイル"], answer: 0, explanation: "対象ファイル、設計資料、再現エラーなど結果を変えうる情報へ絞って渡すと、調査と実装の精度が高まります。", source: "Prompting Codex" },
  { id: "prompt-08", category: "prompting", question: "要件が曖昧で説明しにくい場合の有効な依頼は？", choices: ["実装前に質問して要件を具体化してもらう", "推測だけで本番へ反映してもらう", "すべての制約を削除する", "テストを実行しないよう頼む"], answer: 0, explanation: "Codexにインタビューや計画を先に依頼すると、曖昧な要求を具体化し、重要な判断を実装前に確認できます。", source: "Codex best practices" },
  { id: "prompt-09", category: "prompting", question: "重要な作業で最後に依頼すると有効なことは？", choices: ["完了条件を満たしたか最終確認する", "差分を確認せず送信する", "ログをすべて削除する", "成功条件を変更する"], answer: 0, explanation: "重要な作業では、テスト、所有者、期限など指定した完了条件をすべて満たしたか最終確認させると有効です。", source: "Prompting Codex" },
  { id: "prompt-10", category: "prompting", question: "プロンプトの手順を細かく固定すべきなのはどんな場合？", choices: ["手順そのものが要件として重要な場合", "結果だけが重要なすべての依頼", "常に例外なく固定する", "Codexへ自由度を与えたい場合"], answer: 0, explanation: "通常は必要な結果を先に伝えますが、監査や承認順序などプロセス自体が要件なら手順も明示します。", source: "Prompting Codex" },
  { id: "agents-06", category: "agents", question: "個人の全リポジトリ向けAGENTS.mdを置く標準的な場所は？", choices: ["~/.codex/AGENTS.md", "各プロジェクトのdist", "/tmp/AGENTS.md", "node_modules/AGENTS.md"], answer: 0, explanation: "グローバルな個人指示は通常~/.codex/AGENTS.mdへ置き、各リポジトリの指示より前に読み込まれます。", source: "AGENTS.md guide" },
  { id: "agents-07", category: "agents", question: "グローバル階層でAGENTS.override.mdが存在するとどうなる？", choices: ["通常のAGENTS.mdの代わりに使われる", "両方が必ず連結される", "プロジェクト設定が削除される", "Git管理が無効になる"], answer: 0, explanation: "グローバル階層ではoverrideがあればそれを選び、なければ通常のAGENTS.mdを使うため、両方は同時に採用しません。", source: "AGENTS.md guide" },
  { id: "agents-08", category: "agents", question: "プロジェクト指示の既定合計サイズ上限は？", choices: ["32 KiB", "32 bytes", "1 GiB", "上限なし"], answer: 0, explanation: "Codexは結合したプロジェクト指示が既定の32 KiBへ達すると追加を停止し、設定で上限を調整できます。", source: "AGENTS.md guide" },
  { id: "agents-09", category: "agents", question: "AGENTS.md以外の指示ファイル名を認識させる設定は？", choices: ["project_doc_fallback_filenames", "git_instruction_aliases", "readme_as_system", "agent_file_glob_all"], answer: 0, explanation: "project_doc_fallback_filenamesへ代替名を登録すると、各階層でoverrideやAGENTS.mdの後に候補として確認されます。", source: "AGENTS.md guide" },
  { id: "agents-10", category: "agents", question: "AGENTS.mdを変更したのに現在のTUIへ反映されない場合は？", choices: ["新しいセッションを開始する", "OSを再インストールする", "Git履歴を削除する", "ファイルを画像化する"], answer: 0, explanation: "指示チェーンはTUIセッション開始時に構築されるため、変更後はCodexを再起動するか新しいセッションを開始します。", source: "AGENTS.md guide" },
  { id: "safe-06", category: "security", question: "Codex CLIのサンドボックス値として文書化されている組み合わせは？", choices: ["read-only・workspace-write・danger-full-access", "low・medium・high", "local・remote・hybrid", "safe・fast・turbo"], answer: 0, explanation: "--sandboxではread-only、workspace-write、danger-full-accessのいずれかを選び、コマンドのアクセス範囲を制御します。", source: "Codex CLI command reference" },
  { id: "safe-07", category: "security", question: "CLIの承認ポリシーとして文書化されている値は？", choices: ["untrusted・on-request・never", "yes・noだけ", "slow・fast・auto", "local・cloudだけ"], answer: 0, explanation: "--ask-for-approvalではuntrusted、on-request、neverを指定し、いつ人の承認を求めるかを制御します。", source: "Codex CLI command reference" },
  { id: "safe-08", category: "security", question: "read-onlyサンドボックスの基本的な目的は？", choices: ["書き込みを許さず調査中心に制限する", "全ネットワークを必ず開放する", "管理者権限を付与する", "Git履歴を自動削除する"], answer: 0, explanation: "read-onlyはファイルへの書き込みを許可せず、コードや設定の読み取り・調査を中心とする作業に適しています。", source: "Codex sandbox configuration" },
  { id: "safe-09", category: "security", question: "workspace-writeが主に許可する範囲は？", choices: ["指定されたworkspace内への書き込み", "OS全体への無制限書き込み", "すべての外部サービス操作", "本番DBの自動変更"], answer: 0, explanation: "workspace-writeは作業対象として許可されたworkspace内の変更を可能にし、その他の場所へのアクセスは制限します。", source: "Codex sandbox configuration" },
  { id: "safe-10", category: "security", question: "危険な操作を依頼するときの適切な進め方は？", choices: ["対象を確認し必要な承認を得てから実行する", "対象を確認せず再帰削除する", "安全制約を常に解除する", "結果をユーザーへ知らせない"], answer: 0, explanation: "削除や外部への書き込みなど影響の大きい操作では、対象範囲を確認し、必要な承認を得てから限定的に実行します。", source: "Codex security guidance" },
  { id: "config-06", category: "config", question: "一度のCLI実行だけモデルを上書きするフラグは？", choices: ["--model または -m", "--engine-css", "--agent-name", "--runtime-only"], answer: 0, explanation: "--modelまたは-mは、設定ファイルに保存されたモデル選択をそのCLI呼び出しに限って上書きします。", source: "Codex CLI command reference" },
  { id: "config-07", category: "config", question: "未認識のconfig.toml項目をエラーにするCLIフラグは？", choices: ["--strict-config", "--fail-css", "--validate-git", "--config-readonly"], answer: 0, explanation: "--strict-configを使うと、そのCodexバージョンが認識しない設定項目を黙って無視せずエラーとして扱います。", source: "Codex CLI command reference" },
  { id: "config-08", category: "config", question: "CLI起動前に作業ディレクトリを指定するフラグは？", choices: ["--cd または -C", "--cwd-only-x", "--root-git", "--folder-open"], answer: 0, explanation: "--cdまたは-Cで、Codexが依頼を処理し始める前の作業ディレクトリを明示的に設定できます。", source: "Codex CLI command reference" },
  { id: "config-09", category: "config", question: "一時的に機能フラグを有効化するCLIオプションは？", choices: ["--enable", "--feature-install", "--turn-on-css", "--flag-write"], answer: 0, explanation: "--enableは指定した機能フラグを強制的に有効化し、内部的にはfeatures設定の上書きへ変換されます。", source: "Codex CLI command reference" },
  { id: "config-10", category: "config", question: "ローカルのオープンソースモデルプロバイダーを選ぶフラグは？", choices: ["--local-provider", "--offline-model-path-only", "--vendor", "--local-css"], answer: 0, explanation: "--ossと組み合わせる--local-providerでは、LM StudioまたはOllamaをローカルプロバイダーとして選択できます。", source: "Codex CLI command reference" },
  { id: "extend-06", category: "extend", question: "Pluginをインストール・一覧・削除するCLIサブコマンドは？", choices: ["codex plugin", "codex addon-css", "codex bundle-only", "codex extension-file"], answer: 0, explanation: "安定版のcodex pluginサブコマンドは、設定されたマーケットプレイス由来のPluginをインストール、一覧、削除します。", source: "Codex CLI command reference" },
  { id: "extend-07", category: "extend", question: "Pluginマーケットプレイスを管理するコマンド体系は？", choices: ["codex plugin marketplace", "codex store git", "codex registry-css", "codex plugin-source-file-only"], answer: 0, explanation: "codex plugin marketplaceはGitまたはローカル由来のマーケットプレイスを追加、一覧、更新、削除します。", source: "Codex CLI command reference" },
  { id: "extend-08", category: "extend", question: "Codex自身を別エージェント向けMCPサーバーとして動かすコマンドは？", choices: ["codex mcp-server", "codex mcp add-self", "codex server-html", "codex agent-port"], answer: 0, explanation: "codex mcp-serverはCodex自身をstdio上のMCPサーバーとして起動し、別のエージェントから利用できるようにします。", source: "Codex CLI command reference" },
  { id: "extend-09", category: "extend", question: "Skillに含められるものとして適切な組み合わせは？", choices: ["手順・テンプレート・例・スクリプト", "実行ファイルだけ", "画像一枚だけ", "モデル名だけ"], answer: 0, explanation: "Skillは作業手順に加え、テンプレート、例、スキーマ、スクリプトなどの支援リソースをまとめられます。", source: "Codex Skills & Plugins" },
  { id: "extend-10", category: "extend", question: "Hookが適している用途は？", choices: ["ツール実行などライフサイクル上の機械的な検査", "一度だけの文章要約", "クイズの配色選択", "GitHubの株価確認"], answer: 0, explanation: "Hookはツール呼び出しやコマンド、ファイル編集などのライフサイクルに検査や強制処理を組み込む用途に適しています。", source: "Codex hooks" },
];
