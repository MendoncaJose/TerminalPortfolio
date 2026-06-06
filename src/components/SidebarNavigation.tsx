import { navItems } from "../data";
import type { Section } from "../types";
import { Panel } from "./Panel";
import { SystemMonitor } from "./SystemMonitor";

type SidebarNavigationProps = {
  active: Section;
  onChange: (section: Section) => void;
};

export function SidebarNavigation({ active, onChange }: SidebarNavigationProps) {
  return (
    <aside className="sidebar">
      <Panel title="NAVIGATION">
        <nav className="nav-stack" aria-label="Portfolio navigation">
          {navItems.map((item) => (
            <button
              className={active === item.id ? "active" : ""}
              key={item.id}
              onClick={() => onChange(item.id)}
              type="button"
            >
              <span className="nav-play">▶</span>
              [ {item.label} ]
            </button>
          ))}
        </nav>
      </Panel>
      <SystemMonitor />
    </aside>
  );
}
