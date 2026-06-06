import { MatrixIntro } from "./MatrixIntro";
import { playBootBeep } from "../utils/audio";

type IntroScreenProps = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
  const handleStart = () => {
    playBootBeep();
    onStart();
  };

  return (
    <section className="intro-screen" aria-label="Matrix intro">
      <MatrixIntro />
      <button className="start-hud" onClick={handleStart} type="button">
        <span className="hud-scanline" aria-hidden="true" />
        <span className="hud-kicker">MATRIX_STREAM_ACTIVE</span>
        <strong>SIGNAL DETECTED</strong>
        <span className="hud-action">CLICK TO START</span>
        <span className="hud-footer">[ AUTH_HANDSHAKE_PENDING ]</span>
      </button>
    </section>
  );
}
