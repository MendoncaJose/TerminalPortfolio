import { useEffect, useRef } from 'react';

export function MatrixIntro() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dense Matrix character set: half-width katakana plus numbers.
    // Keeping this local avoids extra assets and keeps the intro instant.
    const chars = 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789:-;!#/(){[]}?|*-+=§';

    // One drop per column. Each value is the vertical row currently being drawn.
    let drops: number[] = [];
    let columns = 0;

    const fontSize = 13;
    const columnWidth = 10;

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;

      // Render at device-pixel ratio for crisp text on high-density screens.
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      // Smaller columns create the filled look from the reference image.
      columns = Math.floor(window.innerWidth / columnWidth);
      drops = Array.from({ length: columns }, () => Math.floor(Math.random() * 80));

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const draw = () => {
      // Low alpha black paint creates the fading trail. Lower alpha = longer trails.
      ctx.fillStyle = 'rgba(0, 0, 0, 0.035)';
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px JetBrains Mono, monospace`;

      for (let i = 0; i < columns; i += 1) {
        const text = chars[Math.floor(Math.random() * chars.length)] || '';

        // All-green palette: a few brighter heads, no rainbow/amber.
        ctx.fillStyle = i % 9 === 0 ? '#9cff9a' : '#00ff66';
        ctx.fillText(text, i * columnWidth, drops[i] * fontSize);

        // Random reset keeps the rain organic instead of restarting in a straight line.
        if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.02) {
          drops[i] = 0;
        }

        drops[i] += 1;
      }
    };

    resize();
    const timer = window.setInterval(draw, 30);
    window.addEventListener('resize', resize);

    return () => {
      window.clearInterval(timer);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-canvas" />;
}
