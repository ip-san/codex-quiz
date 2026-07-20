import { useState } from "react";
import type { DiagramData } from "../diagrams";

type TerminalDiagramData = Extract<DiagramData, { type: "terminal" }>;

function TerminalDiagram({ diagram }: { diagram: TerminalDiagramData }) {
  const [replayKey, setReplayKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const commands = diagram.lines.filter((line) => line.kind === "command").map((line) => line.text);

  const copyCommands = async () => {
    if (commands.length === 0) return;
    try {
      await navigator.clipboard.writeText(commands.join("\n"));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="diagram-terminal">
      <header>
        <i />
        <i />
        <i />
        <span>codex</span>
        <button type="button" onClick={() => setReplayKey((key) => key + 1)} aria-label="操作例を再生">
          ↻ <b>再生</b>
        </button>
        {commands.length > 0 && (
          <button type="button" onClick={copyCommands} aria-label="コマンドをコピー">
            {copied ? "✓" : "⧉"} <b>{copied ? "コピー済み" : "コピー"}</b>
          </button>
        )}
      </header>
      <div key={replayKey}>
        {diagram.lines.map((line, lineIndex) => (
          <p className={line.kind} key={`${line.kind}-${line.text}`} style={{ animationDelay: `${lineIndex * 140}ms` }}>
            {line.kind === "command" && <b>›</b>}
            {line.text}
          </p>
        ))}
      </div>
    </div>
  );
}

export function DiagramRenderer({ diagrams }: { diagrams: DiagramData[] }) {
  if (diagrams.length === 0) return null;
  return (
    <div className="diagrams">
      {diagrams.map((diagram) => (
        <figure className={`diagram diagram-${diagram.type}`} key={`${diagram.type}-${diagram.label}`}>
          <figcaption>{diagram.label}</figcaption>
          {diagram.type === "terminal" && <TerminalDiagram diagram={diagram} />}
          {diagram.type === "flow" && (
            <div className="diagram-flow">
              {diagram.steps.map((step, stepIndex) => (
                <div key={step.text}>
                  <span>{step.text}</span>
                  {step.sub && <small>{step.sub}</small>}
                  {stepIndex < diagram.steps.length - 1 && <b>→</b>}
                </div>
              ))}
            </div>
          )}
          {diagram.type === "comparison" && (
            <div className="diagram-comparison">
              {diagram.columns.map((column) => (
                <div key={column.heading}>
                  <strong>{column.heading}</strong>
                  {column.items.map((item) => (
                    <span key={item}>✓ {item}</span>
                  ))}
                </div>
              ))}
            </div>
          )}
          {diagram.type === "config" && (
            <div className="diagram-config">
              <header>{diagram.filepath}</header>
              {diagram.lines.map((line) => (
                <code className={line.highlight ? "highlight" : ""} key={line.text}>
                  {line.text}
                </code>
              ))}
            </div>
          )}
        </figure>
      ))}
    </div>
  );
}
