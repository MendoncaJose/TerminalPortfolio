import { useState } from "react";
import { BootSequence } from "./components/BootSequence";
import { DashboardLayout } from "./components/DashboardLayout";
import { IntroScreen } from "./components/IntroScreen";
import type { Phase } from "./types";

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");

  return (
    <>
      <div className="crt-overlay" aria-hidden="true" />
      {phase === "intro" && <IntroScreen onStart={() => setPhase("booting")} />}
      {phase === "booting" && <BootSequence onDone={() => setPhase("dashboard")} />}
      {phase === "dashboard" && <DashboardLayout />}
    </>
  );
}
