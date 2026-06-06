import { useEffect, useState } from "react";
import { bootLines } from "../data";

type BootSequenceProps = {
  onDone: () => void;
};

export function BootSequence({ onDone }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const lineTimer = window.setInterval(() => {
      setVisibleLines((current) => {
        if (current.length >= bootLines.length) {
          window.clearInterval(lineTimer);
          return current;
        }
        return [...current, bootLines[current.length]];
      });
    }, 260);

    const progressTimer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + Math.ceil(Math.random() * 8), 100);
        if (next >= 100) {
          window.clearInterval(progressTimer);
          window.setTimeout(onDone, 520);
        }
        return next;
      });
    }, 115);

    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(progressTimer);
    };
  }, [onDone]);

  return (
    <section className="boot-screen" aria-label="Boot sequence">
      <div className="boot-terminal">
        <p className="prompt">system@portfolio:~$ boot --profile jose_mendonca</p>
        <div className="boot-list" aria-live="polite">
          {visibleLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="progress-row">
          <span>[LOAD]</span>
          <span className="progress-track" aria-hidden="true">
            <span className="progress-fill" style={{ width: `${progress}%` }} />
          </span>
          <span>{String(progress).padStart(3, "0")}%</span>
        </div>
      </div>
    </section>
  );
}
