import type { ReactNode } from "react";

type PanelProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, children, className = "" }: PanelProps) {
  return (
    <section className={`panel ${className}`}>
      <header className="panel-title">
        <span>&gt;_ {title}</span>
        <span>- □ ×</span>
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
