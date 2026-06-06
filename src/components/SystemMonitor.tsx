import { Activity, Cpu, Database, HardDrive, Server, Shield } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Panel } from './Panel';

export function SystemMonitor() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 950);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(
    () => [
      { label: 'CORE_0', value: 74 + ((tick * 7) % 18) },
      { label: 'CORE_1', value: 42 + ((tick * 9) % 28) },
      { label: 'CORE_2', value: 58 + ((tick * 5) % 22) },
    ],
    [tick]
  );

  const memory = 38 + ((tick * 6) % 22);

  return (
    <Panel title="SYSTEM_MONITOR" className="monitor-panel">
      <p className="panel-label icon-label">
        <Cpu size={14} /> CPU_LOAD
      </p>
      <div className="metric-list">
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <span>{metric.label}</span>
            <span className="bar" aria-hidden="true">
              <span style={{ width: `${metric.value}%` }} />
            </span>
            <strong>{metric.value}%</strong>
          </div>
        ))}
      </div>
      <p className="panel-label icon-label">
        <HardDrive size={14} /> MEMORY
      </p>
      <div className="metric">
        <span>RAM</span>
        <span className="bar" aria-hidden="true">
          <span style={{ width: `${memory}%` }} />
        </span>
        <strong>{memory}%</strong>
      </div>
      <p className="panel-label icon-label">
        <Database size={14} /> STORAGE_SYNC
      </p>
      <div className="micro-log">
        <p>
          <Activity size={12} /> scanning routes...
        </p>
        <p>
          <Server size={12} /> optimizing interface...
        </p>
        <p>
          <Shield size={12} /> rendering stable [true]
        </p>
      </div>
    </Panel>
  );
}
