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
      <button className="start-button" onClick={handleStart} type="button">
        <span className="start-kicker">jose@portfolio:~$ ./start</span>
        <strong>CLICK TO START</strong>
        <span className="start-subline">[ SYSTEM_AWAITS_INPUT ]</span>
      </button>
    </section>
  );
}
