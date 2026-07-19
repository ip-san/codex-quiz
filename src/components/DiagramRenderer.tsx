import type { DiagramData } from "../diagrams";

export function DiagramRenderer({ diagrams }: { diagrams: DiagramData[] }) {
  if (diagrams.length === 0) return null;
  return (
    <div className="diagrams">
      {diagrams.map((diagram) => (
        <figure className={`diagram diagram-${diagram.type}`} key={`${diagram.type}-${diagram.label}`}>
          <figcaption>{diagram.label}</figcaption>
          {diagram.type === "terminal" && (
            <div className="diagram-terminal">
              <header>
                <i />
                <i />
                <i />
                <span>codex</span>
              </header>
              <div>
                {diagram.lines.map((line) => (
                  <p className={line.kind} key={`${line.kind}-${line.text}`}>
                    {line.kind === "command" && <b>›</b>}
                    {line.text}
                  </p>
                ))}
              </div>
            </div>
          )}
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
