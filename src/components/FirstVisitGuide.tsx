import { useState } from "react";

type Props = { onComplete: (startOverview: boolean) => void };

export default function FirstVisitGuide({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  return (
    <main className="first-visit">
      <header className="first-visit-header">
        <strong>
          ⌁ <span>Codex Quiz</span>
        </strong>
        <button onClick={() => onComplete(false)}>スキップしてメニューへ</button>
      </header>
      <div className="first-visit-body">
        <div className="first-visit-steps" role="status" aria-label="チュートリアルの進捗">
          {step + 1} / 2
        </div>
        {step === 0 ? (
          <section aria-labelledby="intro-title">
            <p className="first-visit-kicker">WELCOME</p>
            <h1 id="intro-title">Codexを、使える知識に。</h1>
            <p>このアプリでは、実際の仕事で迷う場面をクイズにしました。答えを選んだら、理由と公式資料を確かめます。</p>
            <div className="first-visit-visual">
              <span>
                <b>01</b> 状況を読む
              </span>
              <i>→</i>
              <span>
                <b>02</b> 判断する
              </span>
              <i>→</i>
              <span>
                <b>03</b> 理由を確かめる
              </span>
            </div>
            <button className="primary" onClick={() => setStep(1)}>
              学び方を見る <span>→</span>
            </button>
          </section>
        ) : (
          <section aria-labelledby="intro-title">
            <p className="first-visit-kicker">YOUR PATH</p>
            <h1 id="intro-title">まず、全体の地図から。</h1>
            <p>9分野から2問ずつ、計18問。解きながら使いどころを見渡し、その後は気になる分野を深掘りできます。</p>
            <ol className="first-visit-path">
              <li>18問で全体像をつかむ</li>
              <li>解説で判断の理由を確かめる</li>
              <li>苦手な分野を後日もう一度</li>
            </ol>
            <p className="first-visit-note">
              ターミナル表示は学習用で、コマンドは実行されません。進捗はこのブラウザに保存されます。
            </p>
            <div className="first-visit-actions">
              <button className="secondary" onClick={() => setStep(0)}>
                戻る
              </button>
              <button className="primary" onClick={() => onComplete(true)}>
                18問で始める <span>→</span>
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
