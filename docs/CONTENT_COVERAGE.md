# 公式ドキュメント・カバレッジ

## 2026-10-04 作業directoryとlocal providerのCLI判断

config-08/10を現行の[Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)と[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)へ照合。作業開始地点を決める`--cd`と書き込み範囲を足す`--add-dir`、local実行を選ぶ`--oss`と今回のproviderを決める`--local-provider`を区別する問題へ改稿した。誤答別feedbackとterminal図2件を追加。既存ID・264問を維持し、旧回答の成績には旧文面が混在する。

## 2026-10-04 設定の優先順位と未信頼projectを再確認

config-11/12/13を現行の[Config basics](https://learn.chatgpt.com/docs/config-file/config-basic)と[Advanced Configuration](https://learn.chatgpt.com/docs/config-file/config-advanced#project-config-files-codexconfigtoml)に照合。CLI flag、project、profile、userの衝突、trusted monorepoの近いdirectory、untrusted projectでskipするconfig・hooks・rulesを、実際の状況から選ぶ問題へ改稿。全誤答別feedbackとuntrustedの比較図を追加した。既存IDと264問は維持。管理者のrequirementsによる制約は通常の設定値の優先順位とは別であり、この3問だけで全条件を網羅しない。

## 2026-10-04 一時設定と未知field検出の3問を再確認

config-04/06/07を現行の[Advanced Configuration](https://learn.chatgpt.com/docs/config-file/config-advanced#one-off-overrides-from-the-cli)と[Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)へ照合。任意keyの一時上書き、model専用flag、未知fieldの起動時エラーを、実際に混同しやすいprofile・model・search・診断reportと区別する問題へ改稿し、全誤答別説明も対応させた。図解はない。既存IDと264問を維持し、旧回答履歴に改稿前の成績が残る。

## 2026-10-04 TLSとログ診断の3問を再確認

basic-19、config-21、config-22を現行の[Authentication](https://learn.chatgpt.com/docs/auth)と[Environment variables](https://learn.chatgpt.com/docs/config-file/environment-variables#diagnostics)に照合。企業TLS proxyでのCA bundle指定、直接実行したlogin専用log、非対話`codex exec`のinline出力を、症状から選ぶ問題へ改稿した。既存の誤答別feedbackはconfig-21/22で選択肢と説明がずれていたため全件修正。3問に図解はない。264問の総数は維持し、未確認の古い設問は残る。

## 2026-10-03 認証の4問を現行仕様へ再確認

basic-15/16/17/18を現行の[Authentication](https://learn.chatgpt.com/docs/auth)へ照合。ChatGPT利用枠とPlatform従量課金、認証状態の確認、headless環境でのdevice code認証、`keyring`・`auto`・`file`・`ephemeral`の違いを、実務で選ぶ場面へ改稿した。誤答別説明と既存の比較・terminal図も更新。特に、device codeが使えない場合は自分の認証キャッシュの安全な転送やSSH転送も公式の代替策であり、従来の図の「コピーしない」は不正確だったため訂正した。問題数は264問のまま。旧IDの過去成績は改稿前の設問を含む。残る旧認証問題の全面監査は未完了。

## 2026-10-03 古いCLI基本操作の3問を再確認

確認日の古い実務問題からbasic-08/10/11を選び、現行の[Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)と[Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)へ照合。`codex apply`、`codex doctor`、`codex exec --ephemeral`の正解は維持し、架空commandの消去法ではなく、実在するCloud閲覧・認証状態確認・設定検査・出力形式・権限設定との使い分けを問うようにした。全誤答別説明を更新し、既存のterminal図3件も内容を照合して維持した。問題IDと264問の総数は変更せず、旧設問の成績は過去履歴に残る。残る確認日が古い設問の監査は未完了。

## 2026-10-03 公式資料の変更から再確認候補を絞る

全264問が参照する公式資料55ページのMarkdown本文の指紋を初期保存し、`content:sources`で変化したページに紐づく問題だけを表示できるようにした。実務問題と確認日の古い問題を先に示す。URLの節アンカーは同じページへまとめるが、CLI/IDEなどqueryで変わる本文は別に扱う。初回取得でprompt-12の旧資料URLが404と分かったため、正解と誤答説明を現行の[Customization](https://learn.chatgpt.com/docs/customization/overview)で照合して参照先と確認日を更新した。本文の指紋は正しさの証拠ではなく、節単位の影響や全問題の事実確認は人が行う。問題数は264問のまま。

## 2026-10-03 選択肢だけで答えが分かる2問を改善

`content:distractors`の上位候補からagents-10とsafe-24を選んだ。正解だけが長く、他の選択肢が無関係だったため、同じ場面で実際に迷い得る判断へ修正。前者は対象subdirectoryを作業場所にした指示読み込み元の確認を[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、後者はCodex Security Cloudの将来のスキャンへ効くThreat model更新を[公式資料](https://learn.chatgpt.com/docs/security/threat-model)で再確認した。正解・誤答別説明を合わせて更新し、agents-10の既存terminal図も照合した。IDと問題数は維持するため、過去の回答履歴には旧設問の成績が含まれる。残る選択肢候補の監査は未完了。

## 2026-10-03 Cloudの旧仕様を現行環境へ更新

旧[Codex Cloud (Legacy)](https://learn.chatgpt.com/docs/environments/cloud-environment)に依存していたsurfaces-03/04/18/19/20を、現行の[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments)に照合して改稿。setup限定secret、agent phaseの既定network、maintenance script、cache無効化を一般的な現行仕様として教えるのをやめた。代わりにNetwork secretと通常の環境変数の使い分け、接続先と認証の切り分け、toolの準備と再公開、既存タスクと新しいタスクの状態差、repository refreshを問う。各問の選択肢・誤答別説明とCloudシナリオ・図解を合わせて変更。既存IDを使うため過去の回答履歴は旧内容を含む。264問・15コースを維持し、Cloudの全機能を網羅したとは主張しない。

## 2026-10-01 重複と選択肢の見た目を確認する一覧

Claude版の編集者向け検査を参考に、日本語の問題文と正解の類似候補を示す`content:overlap`、正解だけが長い・コード書式になっている候補を示す`content:distractors`を追加。初回実行では類似候補3組、選択肢候補81件を出した。3組は別の判断を問うと見られ、機械的な削除はしていない。81件も誤りの確定数ではない。問題・正解・出典・264問の総数は変更せず、今後の個別監査の入口とする。

## 2026-10-01 公式出典と図解の検査を強化

Claude版の品質検査を比較し、Codex版で不足していた図解の空欄・手順不足・途中切れの検査を通常のテストへ追加。公式出典の到達確認はネットワークを使う任意の`npm run content:links`として追加し、56種類のURLを検査した。見つかった404の2件（surfaces-14、safe-29）は現行の[Windows app](https://learn.chatgpt.com/docs/windows/windows-app)と[Codex Security scans](https://learn.chatgpt.com/docs/security/plugin/scans)へ更新し、正解と誤答の説明も公式資料で再確認した。これはリンク先の存在と対象2問の確認であり、全264問の事実監査や節アンカーの検証を完了した意味ではない。問題数・正解は変更していない。

## 2026-10-01 初回18問の解説を読みやすく調整

全体像モードの18問について、正解後の説明を短い文へ整理し、選んだ不正解への説明も選択肢に即して見直した。「何を選ぶか」「なぜか」「どんなときに使うか」が一度で分かることを優先した。safe-09は不正解別feedbackが実際の選択肢と対応していなかったため修正。basic-02/03の無効になった公式参照先を現行の[Prompting](https://learn.chatgpt.com/docs/prompting)へ、surfaces-02の参照先を現行の[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments)へ更新した。問題数・正解・学習目標は変えていない。残り246問の文章が同じ水準へ改稿済みという意味ではない。

## 2026-09-30 10回の横断監査

9カテゴリにまたがる古い設問を10件選び、現在の公式資料と照合した。新規学習目標よりも、架空command・無関係な選択肢・旧式のnetwork設定による誤学習の解消が優先と判断し、増問せず264問を維持した。各回の選定理由と対象は[学習目標・網羅性監査](COVERAGE_AUDIT.md)に記録した。問題文、正解、全誤答別feedbackを更新し、既存のterminal図4件を再照合した。特にsafe-11は旧`sandbox_workspace_write.network_access`の暗記から、現行permission profileでfilesystem境界とnetwork許可を分離する判断へ変更した。全264問の再確認やCodex全機能の完全網羅は未達である。

## 2026-09-30 Site toolsとMCPの使い分け

公式[Site tools（WebMCP）](https://learn.chatgpt.com/docs/webmcp)を確認。組み込みブラウザで開いたページが提供する操作を、同じページとログイン状態で使う判断は既存263問に見当たらなかったため、extend-47を追加した。別途接続するMCP serverとの適用範囲、ページを離れるとSite toolsが使えなくなる場合、サイト由来の指示を信頼しない点を、正解・全誤答別feedback・比較図で確認。回答直後の解説にも公式資料へのリンクを表示し、根拠へ移れるようにした。264問・9カテゴリ・15コース・図解付き62問となった。Site toolsの提供有無や利用条件はページ・環境に依存し、Codexの全機能の網羅を意味しない。

## 2026-09-30 読んでから解く導線

既存の全体像パスで使う各分野の中核2問を先頭に、同分野の実務問題を加えた5問を先に読む方式へ変更。読んだ5問を同じ順序で確認し、復習時にも同じ範囲を維持する。問題文・正解・出典・263問の総数は変更していないため、新たな公式資料のカバレッジ拡大や事実監査を意味しない。

## 2026-09-29 スマホの学習導線

問題内容や収録数は変えず、幅540px以下のホームに折りたたみ式メニューを追加。実践シナリオ・学習モード・カテゴリへのページ内移動と進捗・解説をまとめ、15件の実践シナリオは最初の3件だけ表示して残りを展開可能にした。主導線の全体像18問とランダム10問は隠さない。320px幅の操作・移動・展開をブラウザ検査へ追加。公式仕様の新たな監査を意味しない。

## 2026-09-29 CLI会話の再開と分岐

basic-05/07を公式[Developer commands](https://learn.chatgpt.com/docs/developer-commands)で再確認。`codex resume`は保存済みinteractive sessionを同じchatで続け、`codex fork`は履歴を引き継ぐ新chatへ分けて元のtranscriptを残す。旧設問の架空commandを誤答にした名称暗記から、resume・fork・新規chat・Git branchの違いを判断する場面へ変更。正解・全誤答feedbackと既存terminal図を照合し、図は現行記述と一致するため変更なし。ID・263問・図解数を維持し、旧回答の学習履歴は残る。

## 2026-09-29 個人指示とチームのレビュー規則

再確認キュー上位のagents-13/14を公式[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)と[Customization](https://learn.chatgpt.com/docs/customization/overview)で照合。個人のglobal指示とrepositoryで共有するbuild手順の分離、および対象serviceに近いCode Review RulesとCI検査の組み合わせへ改善した。全選択肢と不正解別feedbackを更新。図解なし。IDと過去の学習履歴は維持し、263問全体の正確性を認定するものではない。

## 2026-09-29 実務問題の再確認キュー

`npm run content:queue`で最終確認日が古い実務問題20件を抽出する。日付順は誤答・重要度の確定順位ではなく、人手監査の入口。basic-20は公式[環境変数](https://learn.chatgpt.com/docs/config-file/environment-variables#authentication-and-network)で`CODEX_API_KEY`の非対話実行とrepository-controlled codeがある場合のinline指定を再確認し、正解・3つの誤答解説を照合。図解なし。参照先・確認日・説明の過度な「専用」表現を更新した。263問全体の鮮度確認は未完了。

## 2026-09-29 難易度別10問練習

問題内容を増やさず、既存のdifficulty metadataで入門・実践・発展の各10問を分野横断で選べるようにした。100問実力テストのカテゴリ巡回抽出を再利用するが、こちらは回答直後に解説が出る通常練習。既存のセッション形式を使い、再開・再挑戦時も10問の範囲を維持する。全263問・15コース・61問の図解を維持。難易度は学習支援の分類で、実際の技能認定ではない。

## 2026-09-29 Claude版との比較と指示階層の図解

[機能移植ロードマップ](PARITY_ROADMAP.md)へ、現行の問題・図解・内容鮮度・実力テスト・付加機能・Desktop機能の差と優先順位を記録した。全体像パスのagents-01に、個人のCodex home→repository root→下位directoryの指示chainを示すhierarchy図を追加。[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)の探索・連結・近いdirectoryの優先を照合した。正解や選択肢は変えず、図解付き61問、全263問・15コースを維持。図解形式が増えたことだけで学習品質の同等性を認定しない。

## 2026-09-29 動きを抑える設定への対応

flow図は従来CSSのtransitionだけ停止し、自動の段階送りが残っていた。`prefers-reduced-motion: reduce`では自動送りを止め、ボタンで一段ずつ進む動作へ変更した。端末設定の切替時にも進行中の自動送りを止める。ブラウザ回帰検査で一定時間後も段階が変わらず、次の押下でだけ進むことを確認。問題データは変更していない。

## 2026-09-29 キーボード操作の競合修正

図解の再生ボタンにフォーカスしてEnterを押すと、ボタン操作に加えてクイズ全体の「Enterで次へ」が発動する問題をブラウザで再現した。ボタン・リンク・入力欄など操作要素上では全体ショートカットを実行しないよう変更し、同じ操作で問題が飛ばない回帰検査を追加。問題データ・正解・出典は変更していない。axeだけでは検出できない操作上の問題として扱う。

## 2026-09-29 axeの状態別検査

問題内容は変えず、既存のaxe-core + Playwright検査を6画面から回答後の正解・不正解feedback、flow再生中、320px幅のスマホ表示へ拡張した。WCAG 2.1 A/AA tagを検査し、単独実行用`npm run test:a11y`を追加。新しい検査で見つかったfeedback内の復習時期・出典のコントラスト不足を修正。自動検査はキーボード操作・読み上げ・理解しやすさの手動評価を代替しない。

## 2026-09-29 MCPの情報経路を可視化

全体像パスのextend-02に外部サービス→MCP接続→Codex toolのflow図を追加し、段階再生で説明できるようにした。公式[MCP](https://learn.chatgpt.com/docs/extend/mcp)に基づき、認証は必要なserverで行うと明示した。問題本文・正解は変更せず、図解付き60問、terminal操作例31件、全263問を維持。外部サービスが無条件に利用可能になることや、すべてのtoolが自動実行されることを示す図ではない。

## 2026-09-29 手順図の段階表示

flow図解に再生操作と現在段階の強調を追加した。図の全文は再生前も再生中も読め、動きを抑える端末設定では強調のtransitionを停止する。全体像パスのsafe-03に、最小限のworkspace範囲→範囲外操作の必要性確認→限定的な承認を示す図を追加。[Permissions](https://learn.chatgpt.com/docs/permissions)で権限profileの対象、[Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)で既存図の対象を照合した。問題本文・正解は維持し、図解付きは59問、terminal例は31件、問題は263問。権限設定のすべてをこの3段階だけで説明するものではない。

## 2026-09-29 全体像パスの拡張2問

extend-02/05を公式[Model Context Protocol](https://learn.chatgpt.com/docs/extend/mcp)と[Build skills](https://learn.chatgpt.com/docs/build-skills)へ照合。MCPの名称暗記と明らかに無関係な誤答を、外部の最新データを得るための接続と、今回使うSkillの明示指定を区別する場面型に改善した。全誤答feedbackと検証日を更新。両問に図解なし。問題ID、263問・15コースは維持し、旧設問の成績は残る。18問全体の最新仕様監査を完了した意味ではない。

## 2026-09-29 全体像の導入パス

ホームに依頼→境界→作業→検証→継続の5段階マップを追加し、初心者ガイドの最初の案内も18問へ統一した。問題本文は変えず、既存9カテゴリの関係を示す学習用の整理である。

18問完了時の案内は9章の進捗へ接続し、各カテゴリの残り問題へ進める。通常のクイズ結果の復習案内は維持する。

ホームの主ボタンは18問へ変更し、ランダム10問は併置した。

全体像モードを全263問の章順実行から、9カテゴリそれぞれの基本判断と次の実務判断を選んだ18問へ変更。依頼、チーム指示、権限、設定、拡張、会話、レビュー、実行場所を短く横断し、各章の導入後にカテゴリ別で全問へ進める。既存問題だけを再利用し本文や正解は変更しない。進捗保存形式と問題IDは維持し、開始済みの旧263問セッションも保存済みIDで再開できる。公式[Prompting](https://learn.chatgpt.com/docs/prompting)、[Permissions](https://learn.chatgpt.com/docs/permissions)、[Code review](https://learn.chatgpt.com/docs/code-review)の実務フローを構成の参考にした。18問の事実を今回すべて再検証したという意味ではない。

## 2026-09-29 Auto-review対象外操作の診断

safe-33を公式[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)へ照合し、許可済みnetwork先への重要commandが審査されない場合の判断へ変更。Auto-reviewは承認要求がある操作だけを審査し、sandbox内の通常操作を自動で追加検査しない。対象commandには`decision = "prompt"`、機密性の高いMCP toolには`approval_mode = "prompt"`を設定する選択を説明した。全誤答解説・検証日を更新。図解なし、263問・15コースを維持する。

## 2026-09-29 権限profileの保護継承

safe-02を公式[Permissions](https://learn.chatgpt.com/docs/permissions)へ照合し、`:workspace`を継承して既定の`.codex`保護を維持しつつdenyを追加する実務判断へ置換した。空のfilesystem ruleは保護の継承を意味せず、`:danger-full-access`は継承元にできない。全誤答解説と検証日を更新。図解なし。263問・15コースを維持する。

## 2026-09-29 shell環境変数設定の部分監査

config-16/17の正解・全誤答解説を公式[Advanced Configuration](https://learn.chatgpt.com/docs/config-file/config-advanced#shell-environment-policy)へ照合。旧`include_only`/`exclude`配列と新しい`filters`を同じlayerで併用すると設定が拒否される移行判断、および`ignore_default_excludes`の既定値trueではKEY・SECRET・TOKEN名の自動除外が行われない点へ更新した。該当2問に図解なし。263問・15コースを維持する。

## 2026-09-29 公開前品質ゲートの接続

問題内容を変えず、GitHub Pagesの公開を共通Quality Gateの全job成功後に限定した。Pull Requestは同じ検査を独立実行し、`main` push時の重複した検査runを廃止。ブラウザE2E・PWA・Lighthouseが失敗した版は公開しない。

## 2026-09-29 端末保存の失敗時ガード

問題内容は変更せず、学習セッションと進捗の保存・削除処理を共通化した。ブラウザ保存領域の書き込み失敗時はクイズを続けながら警告し、削除・インポート失敗時は既存データを画面上で置き換えない。保存拒否を模擬したブラウザ検査を追加した。

## 2026-09-28 クイズ開始処理の保守性

通常・苦手復習・期限到来・実践コース・学習モード・再挑戦の開始処理を共通化した。問題本文、正解、出典、再開データの形式は変更していない。全15コースの順序と再開を含むブラウザ検査で動作を確認する。

品質検査のLighthouseは初回基準未達時に2回追加計測し、中央値で判定する。初回の失敗を隠さないよう各計測値も出力し、中央値が未達なら従来どおり失敗させる。

## 2026-09-28 名前付き設定の移行

config-05を公式[Advanced Configuration](https://learn.chatgpt.com/docs/config-file/config-advanced#profiles)の現行profile形式と照合。flag名を選ぶ暗記問題から、Codex 0.134.0以降に旧`[profiles.name]`が読まれない問題の復旧へ置換し、正解・全誤答解説・検証日を更新した。増問なし。

## 2026-09-28 URL復元の安定化

画面初期化時に共有URLを読んで画面へ反映する前に、初期のホーム画面をURLへ書き戻す競合を修正。進捗画面を再読み込みするブラウザ検査で発見し、URLが保持されることを検査に追加した。問題・学習データ形式には変更なし。

## 2026-09-28 承認Hookの対象範囲

extend-18を公式[Hooks](https://learn.chatgpt.com/docs/hooks)のPermissionRequest節で確認し、承認不要の操作が検査から漏れる場合の診断へ変更した。正解・全誤答解説・検証日を更新。Pluginの配置は他の既存問題で継続して扱う。263問・15コースを維持する。

## 2026-09-28 network ruleの適用条件

safe-36を公式[Agent approvals & security](https://learn.chatgpt.com/docs/agent-approvals-security#network-isolation)に基づき、許可domainの設定だけではcommand通信を制限できない場合の診断へ変更。正解・全誤答解説と検証日を更新し、local commandのproxyとweb search・MCPを混同しない説明を補った。263問・15コースを維持する。

## 2026-09-28 全カテゴリの優先度監査と初回runの点検

[網羅性監査](COVERAGE_AUDIT.md)に9カテゴリの問題数・検証日の分布・次の確認先を記録した。これは学習目標の棚卸しで、全263問の最新仕様照合ではない。公式[Scheduled tasks](https://learn.chatgpt.com/docs/automations)に基づき、surfaces-08を一般的な権限設計から「初回の数回で範囲外の結果が出た場合の調整」へ改善。誤答別feedbackと検証日を更新し、263問・15コースを維持する。

## 2026-09-28 Hookの二段階の信頼

extend-11/12を公式[Hooks](https://learn.chatgpt.com/docs/hooks)のWhere Codex looks for hooksとReview and trust hooksへ照合。project設定layerの信頼と非managed Hookの定義hashに対する信頼を区別し、読み込み不成立・変更後のskipを診断する問題へ改善した。正解・全誤答解説と検証日を更新。対象に図解なし。263問・15コースを維持する。

## 2026-09-28 Hookの順序依存と重複実行

extend-15/16を公式[Hooks](https://learn.chatgpt.com/docs/hooks)のRuntime behaviorとWhere Codex looks for hooksで再確認。別Hookの開始は拒否で防げないことと、user/projectの定義は置換されず集約されることを失敗診断として出題し、全誤答解説・検証日を更新。対象2問に既存図解なし。263問・15コースを維持する。

## 2026-09-28 Hookの制御と副作用

extend-13/14/17を公式[Hooks](https://learn.chatgpt.com/docs/hooks)で照合。事前拒否には同期検査と対応する拒否出力が必要であること、PostToolUseは実行済みの副作用を戻さないこと、async検査は呼出元の操作を制御できないことを説明した。extend-14/17は名称・handler列挙から失敗時の判断へ変更し、誤答別解説とextend-13の既存図解も更新。263問・15コース・図解58問を維持する。

## 2026-09-28 管理者設定の適用条件

config-18の正解・誤答解説を公式[Configuration Reference](https://learn.chatgpt.com/docs/config-file/config-reference#requirementstoml)で確認し、permission-profile allowlistの対応条件を解説へ追記。0.138.0以降が必要で、0.137.0以前は新しい管理項目を無視することを明記した。設定配布と保護の有効化を混同しないための補足で、従来の管理者制約を回避しないという学習目標は維持。既存図解なし。263問・15コースを維持する。

## 2026-09-28 権限プロファイル移行

config-03を一般的な設定項目の列挙から、default_permissionsが効かない際の旧sandbox指定の診断へ変更。[Permissions](https://learn.chatgpt.com/docs/permissions)で正解と全誤答解説を照合し、betaである点とmanaged allowed_permission_profilesの例外を明記。対象に既存図解なし。問題IDを保持するため過去の学習履歴は旧内容を含む。263問・15コースを維持する。

## 2026-09-27 権限モード5問を監査

safe-39〜43の正解と全誤答解説を[Permission modes](https://learn.chatgpt.com/docs/permission-modes)で再確認。設定での有効化は選択ではない、Auto-reviewはsandboxを広げない、通常はAsk for approvalから始める、組織制約を回避しない、CLIの確認入口という5目標を確認した。参照URLと検証日を更新し、safe-42の不自然な誤答とsafe-43の名称暗記型の文面を改善。対象5問に図解なし。263問・15コースを維持する。

## 2026-09-27 既知の出典不一致と重複を整理

safe-10はSecurity製品への不適切な出典を除き、[Auto-review](https://learn.chatgpt.com/docs/sandboxing/auto-review)の明示的拒否後の対応へ具体化。agents-11/12は[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)を根拠に、結合上限とfallbackの選択順へ変更。prompt-15は[Prompting](https://learn.chatgpt.com/docs/prompting#do-a-local-code-review)に基づく修正後の再レビューへ変更した。4問の全選択肢・誤答別解説を更新し検証日を記録。対象4問に図解はない。263問・15コース・既存IDを維持し、学習データは削除しない。既存IDの過去正答率は旧内容を含む点に留意する。

## 2026-09-21 GitHubレビューの復旧

「GitHubレビューを動かし指摘の修正を依頼する」を追加し全15コース。workflow-06/08/09の正解・誤答解説を公式[GitHub](https://learn.chatgpt.com/docs/third-party/github)のTroubleshoot code review、Customize what Codex reviews、Act on review findingsへ照合。起動名暗記を未反応時の状況判断へ変更し、不自然な誤答を改善した。検証日を更新。対象3問には図解なし。問題数263問を維持する。

## 2026-09-21 長期Goalの進行管理

「長期作業の完了条件と中断を管理する」を追加して全14コース。workflow-22/24/23を成功条件の具体化→権限境界の維持→接続断前のpauseの順に配置した。公式[Long-running work](https://learn.chatgpt.com/docs/long-running-work)で正解と誤答別解説を確認し、3問の検証日を更新。pause操作の問題はDesktop Appに範囲を明示した。対象3問に図解はなく、263問・図解58問を維持する。

## 2026-09-21 worktreeの環境復旧

「worktreeで不足する設定を安全に補う」を追加して全13コース。workflow-04/26/27を依存準備→ignored条件→作成方法の適用範囲の順で学ぶ。公式[Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)のGetting startedとCopy ignored local filesを読み、正解・誤答別解説・workflow-04の設定図を照合。workflow-04はlocal managed worktreeに対象を限定し、図にも対象と最小限のコピーを明記した。3問の検証日を更新し、263問・図解58問は維持。

## 2026-09-21 古い連携方式の移行

「古いCodex連携を安全に移行する」を追加し全12コース。extend-08を廃止済みmcp-serverの起動暗記からApp Serverへの移行判断へ変更。extend-42の誤答解説と選択肢の不一致も修正し、WebSocketの実験的・本番非サポートという制約を明記した。extend-43を含む3問を公式[CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)と[App Server](https://learn.chatgpt.com/docs/app-server)で照合。既存263問を維持し検証日を更新。対象3問には図解なし。

## 2026-09-21 MCP接続の復旧

「登録したMCPが使えない原因を調べる」を追加し全11コース。extend-19、surfaces-15、extend-22を共有config→IDEの再読込み→OAuth認証の順で学習する。公式[MCP](https://learn.chatgpt.com/docs/extend/mcp)で正解・誤答解説と既存terminal例を照合し検証日を更新。OAuth問題を登録後の未認証という状況判断へ改善。既存263問を維持し全コースのブラウザ検査へ含める。

## 2026-09-21 Cloud環境の診断

「Cloud環境の設定と依存関係を切り分ける」を追加し全10コース。surfaces-18/03/19の正解・誤答解説と既存のsetup比較図を公式[Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environment)で確認し検証日を更新。通常の環境変数の永続化とsecretのsetup限定を混同しないよう解説を補強した。全263問を維持し、全コースのブラウザ回帰検査へ含める。

## 2026-09-21 定期タスクの安全な運用

workflow-12/10、surfaces-07を使った「定期タスクを安全に運用する」を追加し全9コース。公式[Scheduled tasks](https://learn.chatgpt.com/docs/automations)で試運転、worktreeによる変更の分離、端末・app・projectの実行条件を確認し検証日を更新。worktreeが必ずbranchを作ると誤解しないよう誤答解説も修正。全263問を維持し、全コースの再開・完走・再挑戦を検査する。

## 2026-09-21 チーム指示の不適用診断

「チームの指示が反映されない原因を調べる」を追加し全8コース。agents-10/15/04で対象directoryの読み込み元、同階層の優先順位、変更後の再読込みを順に確認する。公式[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)で3問の正解・誤答解説とagents-10のterminal例を照合し検証日を更新。既存263問を維持し、全シナリオ共通のブラウザ検査へ含める。

## 2026-09-21 会話の再開と切り替え

「中断した会話を探して作業を切り替える」を追加して全7コース。session-21/24/25で検索directory、履歴を残すfork、新しいcontextを作るnewを順に判断する。公式[Developer commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)で正解・誤答解説・既存terminal図解を照合し3問の検証日を更新。問題数263問・図解数は維持。全コースの再開・完走・再挑戦テストへ自動的に含まれる。

## 2026-09-21 最小権限の実践シナリオ

「権限を広げすぎずに作業を進める」を追加し全6コースとした。safe-09/07/04でworkspace-write、on-request、追加writable rootを順に判断する。公式[Sandbox](https://learn.chatgpt.com/docs/sandboxing)と[CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli)で再確認し3問の検証日を更新。既存問題を活用し全263問を維持する。全コース共通の再開・完走・再挑戦テストの対象にも含める。

## 2026-09-20 実践シナリオを5コースへ拡充

CI連携（basic-04/12/13）とHook検査（extend-12/13/14）を各3問で追加。既存問題を利用し全263問を維持する。[Non-interactive mode](https://learn.chatgpt.com/docs/non-interactive-mode)と[Hooks](https://learn.chatgpt.com/docs/hooks)で6問を再確認し、検証日を更新。Hookの事後検査が操作を取り消さない点を解説へ追記した。全5コースで途中再開・完走・再挑戦の出題順をブラウザ検査する。

## 2026-09-20 全問棚卸しと仕様差分の修正

[網羅性監査](COVERAGE_AUDIT.md)を開始。全263問の題材・出典を棚卸しし、承認policyとHookの古い内容2問、sandboxの出典4問を修正した。問題数は維持。重複・不足候補と未確認範囲を分離して記録し、全問の事実再検証完了とは扱わない。

## 2026-09-20 実践シナリオ9問の最終照合

prompt-18/19/20は[Prompting](https://learn.chatgpt.com/docs/prompting)、workflow-01は[Code review](https://learn.chatgpt.com/docs/code-review)、agents-01は[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、safe-01は[Sandbox](https://learn.chatgpt.com/docs/sandboxing)、workflow-03/05/25は[Worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)で再検証した。

全9問の正解を確認しverifiedAtを更新。safe-01は参照先の内容が変わっていたためsandboxページへ修正。workflow-01の「変更前」を「コミット前」に修正し、workflow-05にhandoffのflow図を追加した。全263問・図解58問・terminal例31件。今回の再照合対象はシナリオ9問であり、全263問を同日に再検証したとは扱わない。

## 2026-09-20 本番PWAのブラウザ回帰検査

開発サーバーとは別に本番ビルドのservice workerを使う検査を追加。再登録時の旧キャッシュ削除と他アプリのキャッシュ保持、取得済みの誤答解説を含むオフライン再開、再接続後の進捗維持を検査する。問題内容は変更しない。

## 2026-09-20 学習データ移行のブラウザ検証

問題数は263問のまま。JSONを実際にダウンロードして再インポートし、SRS・ブックマーク・履歴が再読込後も一致する検査を追加。不正なファイルと置換キャンセルで既存データを維持することも確認する。インポート時は保存成功後に画面の状態を切り替える。

## 2026-09-20 依存関係の安全性確認

問題内容・263問の構成は維持。Lighthouse 13.5とVitest 4.1.11を含む修正版へ依存関係を更新し、npm auditおよび本番依存のみの監査で警告0件を確認した。監査結果は確認時点のものであり、将来の安全性を保証するものではない。

## 2026-09-20 PWAキャッシュの安全性

問題内容は変更せず、キャッシュ削除を本アプリの名前に限定。外部URLと別アプリの取得を横取りせず、成功レスポンスだけを保存する。オフラインのHTML代替は画面遷移に限定し、存在しないスクリプトへHTMLを返さない。pwa:checkへ回帰検査を追加。

## 2026-09-20 公開品質検査の再開

問題データは変更せず、Lighthouseが直接利用するchrome-launcherを開発依存へ追加。ローカル検査はPerformance 99、Accessibility 100、Best Practices 100、SEO 100。CI失敗の原因確定とは区別し、再実行結果を確認する。

既存ロックと同じchrome-launcher 1.2.1に揃えた再検査でも96/100/96/100で基準を通過。失敗の調査に使えるよう、SEO以外も含む未達auditの名称をログへ出すよう改善した。WindowsではChrome一時フォルダ削除の権限警告が残る。

## 実践シナリオの導入

既存問題を不具合修正・リポジトリ引き継ぎ・並列作業の3コースへ整理。各3問を固定順で出題し、既存の解説・結果・保存再開を利用する。問題内容や正解は変更せず、各コースの公式仕様再監査はRELEASE_PLANのR5で行う。

## 保存進捗の破損対策

保存進捗にもインポートと同じ構造検証を適用。破損したJSONや不正な履歴は画面のクラッシュを避け、保存可能な場合はcodex-quiz-progress-recoveryへ元データを退避する。4モードの未回答再開とホーム往復の検査を追加。問題内容は変更していない。

## 保存セッションの検証強化

問題数は263問を維持。再開データの位置・スコア・選択肢・カテゴリ・モード・重複IDを検証し、不正な保存値は元データを削除せず再開対象から除外する。4モードの回答後再開と回答数の二重加算防止をブラウザ検査に追加。復習開始時のstudy表示状態もリセットする。

## 公開開発計画とチャプター進捗

必須範囲をRELEASE_PLAN.mdへ固定。問題数は263問を維持し、進捗画面に章ごとの回答済み・残りと学習ボタンを追加。全問への回答を「一巡済み」とし、正答率や習熟認定とは明確に区別する。

## 2026-09-19 解説から実践・出典への導線

解説カードに「この問題を解く」と「公式資料を読む」を追加した。既存の問題共有URLとreferenceUrlを利用し、復習対象の解説から1問の確認へ直接進める。公式資料は別タブで開く。問題内容・問題数は変更していない。

## 2026-09-19 復習前の解説確認

263問の内容は維持し、解説リーダーに苦手問題・復習時期が来た問題のフィルターを追加。検索・カテゴリ・ブックマークと組み合わせて対象を確認できる。該当なしの場合はすべての絞り込みを解除でき、表示件数の変更は支援技術にも通知する。

## 2026-09-19 セッション操作例の補強

公式[Developer commands](https://learn.chatgpt.com/docs/developer-commands)で再確認し、session-24の会話分岐とsession-25の新規会話開始にterminal図解を追加した。CLI内の入力とshellコマンドを区別し、説明は実際の出力を装わず補足情報として表示する。問題数は263問のまま、図解57問・terminal例31件となった。

## 2026-09-19 学習導線の改善

問題数は263問を維持。ホームに初心者向け学び方ガイドを追加し、解説を読んでから10問へ進めるようにした。結果画面では苦手問題、復習期限到来、進捗確認の順で次の行動を案内する。操作例が実際のコマンド実行ではないことと、学習データがブラウザ単位で保存されることも明示した。

## 2026-09-19 実務scenario拡充・第4弾

公式[Git worktrees](https://learn.chatgpt.com/docs/environments/git-worktrees)を確認し、3問を追加して263問とした。未commit変更を引き継ぐ開始状態、.worktreeincludeがignoredファイルだけを対象とする点、local managed worktreeとCLIで作成したworktreeの適用範囲を扱う。既存のsetup・handoff問題との重複を避け、設定ファイルが渡らない原因を判断するscenarioに絞った。全問に誤答別feedbackと追跡metadataを付与した。

## 2026-09-19 実務scenario拡充・第3弾

公式[Developer commands](https://learn.chatgpt.com/docs/developer-commands)を確認し、セッション管理へ5問を追加して260問とした。resumeのdirectory検索範囲、再開先directoryの選択、明示的な`--cd`の優先順位、fork後の会話IDと履歴、新しいcontextを作る`/new`とcompactの使い分けを扱う。全問に誤答別feedbackと追跡metadataを付与。`codex resume --last`と`codex resume --all`の違いを示すterminal図解を追加し、図解55問・terminal例29件となった。

| 領域 | 実務価値 | 状態 | 次の重点 |
|---|---:|---|---|
| Prompting・完了条件 | 最重要 | 実務フローあり | 既存問題のscenario品質改善 |
| AGENTS.md | 最重要 | 実務フローあり | 指示chainの監査を実装済み |
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

## 2026-07-19 不正解別feedback移行 第14回

既存の高価値10問を強化し、移行済みを154問から164問へ増やした。project Hookの配置・trust、PreToolUse・PostToolUse、並列実行、複数source、Plugin同梱、MCP shared config・Streamable HTTP OAuth・CLI loginに加え、`codex exec`のephemeral sessionとJSONL event出力を対象とした。Hookの二重副作用、未review command、transport・出力形式の選択ミスを避けるfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第15回

既存の高価値10問を強化し、移行済みを164問から174問へ増やした。`codex exec`のstructured output、app-serverのinterface選択、CIでのAPI key最小scopeと、Codex GitHub Actionのdrop-sudo・prompt injection・read-only境界・checkout・prompt source・final-message・autofix完了条件を対象とした。secret漏えい、未信頼入力の実行、sandboxとrunner privilegeの混同を避けるfeedbackを追加した。

## 2026-07-19 不正解別feedback移行 第16回

既存の高価値10問を強化し、移行済みを174問から184問へ増やした。configのCLI・project階層precedence、untrusted project、`/debug-config`、plaintext TUI logと、Rulesの最も制限的なdecision、inline test、`execpolicy check`、複合shell分割、project trustを対象とした。設定layerの誤認、広すぎるallow、safe commandへ危険commandを連結する迂回を防ぐfeedbackを追加した。

## 2026-07-19 公開前PWA仕上げ

Android向け192 / 512px icon、maskable icon、iOS向け180px apple-touch-iconを追加し、manifestとoffline app shellへ組み込んだ。manifestの必須field、icon fileの実在・PNG寸法・purpose、iOS icon参照を継続検査する`pwa:check`を品質ゲートへ追加した。

## 2026-07-19 公開メタデータ仕上げ

検索向けcanonical・robots.txt・sitemapと、SNS共有向けOpen Graph・Twitter Card・1200x630 preview imageを追加した。LighthouseはSEO未達audit名も表示するようにし、公開metadataとpreview assetの欠落を`pwa:check`で継続検査する。

## 2026-07-20 terminal操作図の拡充

Claude版の図解密度と操作感を参考にしつつ、Codex公式仕様のCLI・slash commandだけを採用した。ephemeral exec、output schema、認証確認・device auth、status・side chat、config診断・debug log、Rule検査、MCP OAuthの10問へterminal操作例を追加し、terminal図を3件から13件へ拡充した。全terminal図へ順次表示、再生、commandコピーを追加し、question ID整合性と操作導線をunit / E2Eで継続検査する。

## 2026-07-20 実力テストの出題設計

全240問の一括出題を、9カテゴリから均等にランダム抽出する100問へ変更した。各カテゴリ11問を基本に残り1問をランダムなカテゴリへ配分し、カテゴリ内の選択と最終出題順も毎回shuffleする。100問の一意性、カテゴリ間の出題数差が最大1問であること、session保存をunit / E2Eで検査する。

## 2026-07-19 アクセシビリティ品質ゲート

問題内容を増やさず、home・quiz・reader・progressの4画面へaxe-coreによるWCAG 2.1 A/AA検査を追加した。補助文字、カテゴリ表示、操作ボタン、図解キャプションのコントラストを改善し、主要導線4件と合わせてChromium E2E 8件で継続検査する。

## 2026-07-26 基本CLI操作のterminal図解

実務の入口になる `/init`、`codex exec`、`codex resume`、`codex review`、`codex fork`、`codex apply`、`codex completion`、`codex doctor` の8問へterminal操作例を追加した。terminal図は13件から21件、図解付き問題は37問から45問へ拡充した。名称暗記だった `/init` は、repository用AGENTS.mdの叩き台を作るscenarioへ更新し、公式reference・難易度・実務価値・topic・検証日も付与した。

archive、長期Goal、Subagent切替、Memory制御、IDE context、feedbackの6問にも操作例を追加し、terminal図を27件、図解付き問題を51問へ拡充した。公式マニュアルのsurface別command表を照合し、IDE extensionの古い `/ide` 表記を現行の `/ide-context` へ修正した。

## 2026-07-26 不正解別feedback移行 第17回

既存の高価値10問を強化し、移行済みを184問から194問へ増やした。repository Skillのscope・script・implicit invocation、Pluginの配布単位・manifest・directory構造・marketplace・install cache、Remote hostのnetwork公開、Scheduled taskのbackground worktreeを対象とした。再現性不足、credential漏えい、app-serverのpublic露出、進行中作業との競合を避けるfeedbackを追加した。

## 2026-07-26 不正解別feedback移行 第18回

既存の高価値10問を強化し、移行済みを194問から204問へ増やした。Steer / Queue、反復失敗のAGENTS.md規則化、重要boundary、最終検証、曖昧要件のinterview、単一・複数画像のcontextと、Subagentの並列化対象・token cost・thread切替を対象とした。未検証情報の断定、曖昧な全面rewrite、画像の誤解釈、競合しやすい並列writeを避けるfeedbackを追加した。

## 2026-07-26 不正解別feedback移行 第19回

既存の高価値10問を強化し、移行済みを204問から214問へ増やした。Subagentのpermission継承、Plugin / MCPとComputer Useの選択、localhostのbuilt-in browser、Cloud setup shell・maintenance・cache invalidation、Local environmentのsetup・actions、Importの非破壊性とinstruction移行を対象とした。過剰権限、壊れやすい座標操作、Cloud / browser cacheの混同、既存setupの誤削除を避けるfeedbackを追加した。

## 2026-07-27 不正解別feedback移行 第20回

既存10問を強化し、移行済みを214問から224問へ増やした。Import後の認証・security review、global AGENTS.md・override・32 KiB上限・fallback filename、sandbox bypass・sandbox mode・approval policy、Hookの用途を対象とした。credential公開、instruction precedenceの誤解、初見repositoryや本番環境でのsandbox回避、Hookと通常promptの混同を避けるfeedbackを追加した。

## 2026-07-27 不正解別feedback移行 完了

残る16問を強化し、全240問への不正解別feedback移行を完了した。Skill・Plugin・MCPの基礎commandと構成、Promptの出力・context・曖昧要件・最終確認・process指定、Hook handlerを対象とした。公式マニュアルから消えた`agents.max_depth`問題は、現行の`agents.max_concurrent_threads_per_session`を選ぶ実務scenarioへ置き換えた。全問題で誤答ごとの理由と正しい判断基準を表示し、件数・ID・正解への誤設定・16文字以上の内容を継続検査する。

## 2026-07-27 追跡metadata移行 第1回

不足39問のうちExtend 9問とPrompt 1問へdifficulty・value・topic・公式referenceUrl・verifiedAtを追加し、追跡可能な問題を201問から211問へ増やした。`codex mcp`、`codex plugin`、`codex plugin marketplace`、`codex mcp-server`とSkill明示指定は、名称だけを問う形式から、管理・配布・agent連携の目的に応じて操作を選ぶscenarioへ書き換えた。

## 2026-07-27 追跡metadata移行 第2回

Prompting 9問とAGENTS.md基礎1問へ全追跡metadataを追加し、移行済みを211問から221問へ増やした。Goal・Context・Output・Boundary、result-first、関連context、外部送信禁止、done criteria、曖昧要件のinterview、最終check、process constraintを、抽象的な用語説明から実装・調査・共有時の判断scenarioへ書き換えた。

## 2026-07-27 追跡metadata移行 完了

残るAGENTS.md 7問、承認・sandbox 11問、Hook 1問へ全追跡metadataを追加し、全240問の移行を完了した。nested guidance、override、global guidance、32 KiB上限、fallback filename、session再読込み、approvalとsandboxの責務分離、最小権限、追加writable root、bypass境界、read-only・workspace-writeの選択、破壊的操作、PreToolUse Hookを、名称暗記から実務上の判断scenarioへ書き換えた。

## 2026-07-27 AGENTS.md意味重複の解消

session再読込みを重ねて問う2問のうち1問を、monorepoの対象subdirectoryでactiveなinstruction chainを検証するscenarioへ置き換えた。公式manualの`--cd`によるnested override確認手順をterminal図として追加し、図解付き問題を52問、再生・コピー可能なterminal操作例を28件へ拡充した。

## 2026-07-28 意味重複の継続監査

`codex doctor`を同じ状況で問う2問のうち1問を、IDEでMCP server追加後にRestart extensionとOAuth Authenticateを行う復旧scenarioへ置き換えた。Promptingの最終確認2問も、完了条件の監査と未検証情報の報告という別の学習目標へtopicを分離した。今後の意味重複を早期検出するため、全240問でtopicが一意であることを品質検査へ追加した。

## 2026-07-28 正解後ボタンのresponsive修正

正解時の短いfeedbackで次問ボタンの`float`が枠の高さから外れ、表示が崩れる問題を修正した。ボタンを通常flowのまま右寄せし、540px以下では従来どおり全幅表示する。最小対応幅320pxの実ブラウザでterminal図解付きfeedbackまで確認し、ボタンの四辺がfeedback枠内に収まることとpage全体に横overflowがないことを測るE2Eを追加した。

ホーム・解説リーダー・進捗画面も320px幅の実ブラウザで監査し、横overflowがないことを確認した。3画面のdeep linkを巡回してdocument幅を検査するresponsive E2Eを追加し、クイズ画面だけでなく主要4画面の最小幅を継続保証する。

## 2026-07-28 ホーム統計のデータ連動

ホームの学習カテゴリ数が過去の6カテゴリで固定され、現在の9カテゴリと不一致だった表示bugを修正した。問題数と同様にカテゴリ定義から動的算出し、実データ拡充時に表示だけが古くならないようstatic render testを追加した。

## 2026-07-28 カテゴリ表示の一元化

チャプター進行表示、全体学習カード、実力テスト説明に残っていたカテゴリ総数の固定値を、カテゴリ定義からの自動算出へ統一した。カテゴリ追加時に複数画面の表示が食い違う退行を防ぐ。実力テストの100問は公開仕様として固定し、9カテゴリから均等に抽出する既存ロジックを維持する。

## 2026-07-28 再挑戦時の出題範囲維持

結果画面の再挑戦が、完了した内容にかかわらずランダム10問を開始していた不整合を修正した。カテゴリ学習、実力テスト、読んでから解く、全体像学習、復習、共有問題の出題セットとモードを維持して先頭から再開する。共有1問の完了後も1問セッションと共有URLが保たれることをE2Eで検査する。あわせて長い英数字を含む解説カードが320px幅でgridを押し広げる問題を修正し、overflow診断で該当要素を表示できるようにした。

## 2026-09-18 アクセシビリティ検査範囲の拡張

axe-coreによるWCAG 2.1 A/AA検査を、既存のhome・quiz・reader・progressに加えて、全体像モードのchapter introductionとセッション完了後のresultへ拡張した。新規検査で見つかった結果スコアの分母表示のコントラスト不足を修正した。表示条件のある主要画面も実際の操作で到達して検査し、公開導線6画面のアクセシビリティ退行をCIで検出する。

## 2026-09-19 実務scenario拡充・第1弾

240問から250問へ拡充した。OpenAI公式の現行PermissionsとAGENTS.md guideを再確認し、AGENTS.mdの1階層1file・空file skip・project root不在時・review規則のscope・`CODEX_HOME` profileを5問、permission modeの有効化と選択・automatic reviewとsandboxの分離・推奨初期mode・organization requirements・CLIの`/permissions`を5問追加した。全問を実務scenario型とし、選択肢別feedback、一意topic、難易度、実務価値、公式reference、検証日を同時に付与した。

## 2026-07-19 Lighthouse品質ゲート

本番ビルドへLighthouseの最低スコア検査を追加した。Performance 80、Accessibility 95、Best Practices 90、SEO 80を下回る退行をGitHub Actionsで検出し、問題数ではなく学習画面の配信品質を継続的に守る。

## 2026-09-19 実務scenario拡充・第2弾

公式[Prompting Codex](https://learn.chatgpt.com/docs/prompting)を確認し、プロンプト分野へ5問追加して255問にした。再現手順によるbug修正、処理経路と根拠ファイル、関数単位の境界値テスト、画像に見えないUI動作、互換性を保つ段階的refactorを扱う。全追加問題へ誤答別feedbackと追跡metadataを付与し、flow・comparison図解を2問へ追加した。図解付き問題は54問。topic識別子の一意性だけでは意味重複を保証できないため、READMEの検査説明も実態へ合わせた。
