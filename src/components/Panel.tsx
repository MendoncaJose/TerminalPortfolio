import type { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, children, className = '' }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-title">
        <span>&gt;_ {title}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Minus size={11} />
          <Square size={11} />
          <X size={11} />
        </span>
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
