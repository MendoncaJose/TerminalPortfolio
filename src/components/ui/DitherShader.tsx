import { useCallback, useEffect, useRef, useState } from "react";

type DitheringMode = "bayer" | "halftone" | "noise" | "crosshatch";
type ColorMode = "original" | "grayscale" | "duotone" | "custom";

type DitherShaderProps = {
  src: string;
  gridSize?: number;
  ditherMode?: DitheringMode;
  colorMode?: ColorMode;
  invert?: boolean;
  pixelRatio?: number;
  primaryColor?: string;
  secondaryColor?: string;
  customPalette?: string[];
  brightness?: number;
  contrast?: number;
  backgroundColor?: string;
  objectFit?: "cover" | "contain" | "fill" | "none";
  threshold?: number;
  animated?: boolean;
  animationSpeed?: number;
  className?: string;
};

const BAYER_MATRIX_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

const BAYER_MATRIX_8X8 = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

function parseColor(color: string): [number, number, number] {
  if (color.startsWith("#")) {
    const hex = color.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16),
        parseInt(hex[1] + hex[1], 16),
        parseInt(hex[2] + hex[2], 16),
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16),
      parseInt(hex.slice(2, 4), 16),
      parseInt(hex.slice(4, 6), 16),
    ];
  }

  return [0, 0, 0];
}

function getLuminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function DitherShader({
  src,
  gridSize = 3,
  ditherMode = "bayer",
  colorMode = "duotone",
  invert = false,
  pixelRatio = 1,
  primaryColor = "#020602",
  secondaryColor = "#33ff00",
  customPalette = ["#020602", "#33ff00"],
  brightness = 0,
  contrast = 1,
  backgroundColor = "#020602",
  objectFit = "cover",
  threshold = 0.5,
  animated = false,
  animationSpeed = 0.02,
  className = "",
}: DitherShaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef(0);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageDataRef = useRef<ImageData | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const parsedPrimaryColor = parseColor(primaryColor);
  const parsedSecondaryColor = parseColor(secondaryColor);
  const parsedCustomPalette = customPalette.map(parseColor);

  const applyDithering = useCallback(
    (ctx: CanvasRenderingContext2D, displayWidth: number, displayHeight: number, time = 0) => {
      if (!canvasRef.current || !imageDataRef.current) return;

      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, displayWidth, displayHeight);
      } else {
        ctx.clearRect(0, 0, displayWidth, displayHeight);
      }

      const sourceData = imageDataRef.current.data;
      const sourceWidth = imageDataRef.current.width;
      const sourceHeight = imageDataRef.current.height;
      const effectivePixelSize = Math.max(1, Math.floor(gridSize * pixelRatio));
      const matrixSize = gridSize <= 4 ? 4 : 8;
      const bayerMatrix = gridSize <= 4 ? BAYER_MATRIX_4X4 : BAYER_MATRIX_8X8;
      const matrixScale = matrixSize === 4 ? 16 : 64;

      for (let y = 0; y < displayHeight; y += effectivePixelSize) {
        for (let x = 0; x < displayWidth; x += effectivePixelSize) {
          const srcX = Math.floor((x / displayWidth) * sourceWidth);
          const srcY = Math.floor((y / displayHeight) * sourceHeight);
          const srcIdx = (srcY * sourceWidth + srcX) * 4;

          let r = sourceData[srcIdx] || 0;
          let g = sourceData[srcIdx + 1] || 0;
          let b = sourceData[srcIdx + 2] || 0;
          const a = sourceData[srcIdx + 3] || 0;
          if (a < 10) continue;

          r = clamp((r - 128) * contrast + 128 + brightness * 255, 0, 255);
          g = clamp((g - 128) * contrast + 128 + brightness * 255, 0, 255);
          b = clamp((b - 128) * contrast + 128 + brightness * 255, 0, 255);

          const luminance = getLuminance(r, g, b) / 255;
          const matrixX = Math.floor(x / gridSize) % matrixSize;
          const matrixY = Math.floor(y / gridSize) % matrixSize;
          let ditherThreshold: number;

          if (ditherMode === "halftone") {
            const angle = Math.PI / 4;
            const scale = gridSize * 2;
            const rotX = x * Math.cos(angle) + y * Math.sin(angle);
            const rotY = -x * Math.sin(angle) + y * Math.cos(angle);
            ditherThreshold = (Math.sin(rotX / scale) + Math.sin(rotY / scale) + 2) / 4;
          } else if (ditherMode === "noise") {
            const noiseVal = Math.sin(x * 12.9898 + y * 78.233 + time * 100) * 43758.5453;
            ditherThreshold = noiseVal - Math.floor(noiseVal);
          } else if (ditherMode === "crosshatch") {
            const line1 = (x + y) % (gridSize * 2) < gridSize ? 1 : 0;
            const line2 = (x - y + gridSize * 4) % (gridSize * 2) < gridSize ? 1 : 0;
            ditherThreshold = (line1 + line2) / 2;
          } else {
            ditherThreshold = bayerMatrix[matrixY][matrixX] / matrixScale;
          }

          ditherThreshold = ditherThreshold * (1 - threshold) + threshold * 0.5;

          let outputColor: [number, number, number];
          if (colorMode === "grayscale") {
            outputColor = luminance < ditherThreshold ? [0, 0, 0] : [255, 255, 255];
          } else if (colorMode === "duotone") {
            outputColor = luminance < ditherThreshold ? parsedPrimaryColor : parsedSecondaryColor;
          } else if (colorMode === "custom") {
            if (parsedCustomPalette.length === 2) {
              outputColor = luminance < ditherThreshold ? parsedCustomPalette[0] : parsedCustomPalette[1];
            } else {
              const adjusted = luminance + (ditherThreshold - 0.5) * 0.5;
              const paletteIndex = Math.floor(clamp(adjusted, 0, 1) * (parsedCustomPalette.length - 1));
              outputColor = parsedCustomPalette[paletteIndex];
            }
          } else {
            const ditherAmount = ditherThreshold - 0.5;
            const levels = 4;
            outputColor = [
              Math.round(clamp(r + ditherAmount * 64, 0, 255) / (255 / levels)) * (255 / levels),
              Math.round(clamp(g + ditherAmount * 64, 0, 255) / (255 / levels)) * (255 / levels),
              Math.round(clamp(b + ditherAmount * 64, 0, 255) / (255 / levels)) * (255 / levels),
            ];
          }

          if (invert) {
            outputColor = [255 - outputColor[0], 255 - outputColor[1], 255 - outputColor[2]];
          }

          ctx.fillStyle = `rgb(${outputColor[0]}, ${outputColor[1]}, ${outputColor[2]})`;
          ctx.fillRect(x, y, effectivePixelSize, effectivePixelSize);
        }
      }
    },
    [
      animated,
      backgroundColor,
      brightness,
      colorMode,
      contrast,
      customPalette,
      ditherMode,
      gridSize,
      invert,
      pixelRatio,
      primaryColor,
      secondaryColor,
      threshold,
    ],
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setDimensions({ width, height });
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return;

    let isCancelled = false;

    const processImage = (img: HTMLImageElement) => {
      if (isCancelled) return;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = dimensions.width;
      const displayHeight = dimensions.height;
      canvas.width = Math.floor(displayWidth * dpr);
      canvas.height = Math.floor(displayHeight * dpr);

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      const offscreen = document.createElement("canvas");
      const iw = img.naturalWidth || displayWidth;
      const ih = img.naturalHeight || displayHeight;
      let dw = displayWidth;
      let dh = displayHeight;
      let dx = 0;
      let dy = 0;

      if (objectFit === "cover") {
        const scale = Math.max(displayWidth / iw, displayHeight / ih);
        dw = Math.ceil(iw * scale);
        dh = Math.ceil(ih * scale);
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      } else if (objectFit === "contain") {
        const scale = Math.min(displayWidth / iw, displayHeight / ih);
        dw = Math.ceil(iw * scale);
        dh = Math.ceil(ih * scale);
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      } else if (objectFit === "none") {
        dw = iw;
        dh = ih;
        dx = Math.floor((displayWidth - dw) / 2);
        dy = Math.floor((displayHeight - dh) / 2);
      }

      offscreen.width = displayWidth;
      offscreen.height = displayHeight;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      offCtx.drawImage(img, dx, dy, dw, dh);
      imageDataRef.current = offCtx.getImageData(0, 0, displayWidth, displayHeight);
      applyDithering(ctx, displayWidth, displayHeight, 0);

      if (animated) {
        const animate = () => {
          if (isCancelled) return;
          timeRef.current += animationSpeed;
          applyDithering(ctx, displayWidth, displayHeight, timeRef.current);
          animationRef.current = requestAnimationFrame(animate);
        };
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    if (imageRef.current?.complete) {
      processImage(imageRef.current);
    } else {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageRef.current = img;
        processImage(img);
      };
    }

    return () => {
      isCancelled = true;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [animationSpeed, animated, applyDithering, dimensions, objectFit, src]);

  return (
    <div ref={containerRef} className={`dither-shader ${className}`}>
      <canvas ref={canvasRef} aria-label="Dithered profile image" role="img" />
    </div>
  );
}
