import { Battery, Clock, Terminal, Wifi } from "lucide-react";
import { useEffect, useState } from "react";

export function HeaderStatusBar() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="topbar">
      <div className="brand-mark"><Terminal size={24} /></div>
      <div>
        <strong>JOSE_TERMINAL_V2</strong>
        <span>SYSTEM INTERFACE // CONNECTED</span>
      </div>
      <div className="network-status">
        <span><Wifi size={14} /> NET: ONLINE</span>
        <span><Battery size={14} /> PWR: 100%</span>
        <time><Clock size={14} /> {time.toLocaleTimeString("pt-PT")}</time>
      </div>
    </div>
  );
}
