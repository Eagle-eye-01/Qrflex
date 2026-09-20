import React, { useEffect, useRef } from 'react';

interface ProceduralGradientProps {
  darkMode: boolean;
}

export const ProceduralGradient: React.FC<ProceduralGradientProps> = ({ darkMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Resize canvas to window dimensions with downsampling for ultra-high 60fps performance
    const handleResize = () => {
      canvas.width = Math.floor(window.innerWidth / 2);
      canvas.height = Math.floor(window.innerHeight / 2);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      time += 0.008;
      const { width, height } = canvas;

      // Base background fill
      ctx.fillStyle = darkMode ? '#08090d' : '#f8fafc';
      ctx.fillRect(0, 0, width, height);

      // Gradient color points based on theme
      const blobs = darkMode
        ? [
            {
              x: width * (0.3 + 0.25 * Math.sin(time * 0.7)),
              y: height * (0.35 + 0.2 * Math.cos(time * 0.5)),
              r: width * 0.55,
              color1: 'rgba(228, 255, 26, 0.12)', // Volt
              color2: 'rgba(228, 255, 26, 0)',
            },
            {
              x: width * (0.75 + 0.2 * Math.cos(time * 0.6)),
              y: height * (0.65 + 0.25 * Math.sin(time * 0.8)),
              r: width * 0.6,
              color1: 'rgba(0, 255, 136, 0.14)', // Matrix Green
              color2: 'rgba(0, 255, 136, 0)',
            },
            {
              x: width * (0.5 + 0.3 * Math.sin(time * 0.4 + 2)),
              y: height * (0.8 + 0.2 * Math.cos(time * 0.6 + 1)),
              r: width * 0.65,
              color1: 'rgba(168, 85, 247, 0.15)', // Cyber Purple
              color2: 'rgba(168, 85, 247, 0)',
            },
            {
              x: width * (0.2 + 0.2 * Math.cos(time * 0.5 + 3)),
              y: height * (0.7 + 0.25 * Math.sin(time * 0.7 + 2)),
              r: width * 0.5,
              color1: 'rgba(59, 130, 246, 0.12)', // Blue
              color2: 'rgba(59, 130, 246, 0)',
            },
          ]
        : [
            {
              x: width * (0.3 + 0.25 * Math.sin(time * 0.7)),
              y: height * (0.35 + 0.2 * Math.cos(time * 0.5)),
              r: width * 0.55,
              color1: 'rgba(228, 255, 26, 0.18)', // Soft Volt
              color2: 'rgba(255, 255, 255, 0)',
            },
            {
              x: width * (0.75 + 0.2 * Math.cos(time * 0.6)),
              y: height * (0.65 + 0.25 * Math.sin(time * 0.8)),
              r: width * 0.6,
              color1: 'rgba(16, 185, 129, 0.15)', // Mint
              color2: 'rgba(255, 255, 255, 0)',
            },
            {
              x: width * (0.5 + 0.3 * Math.sin(time * 0.4 + 2)),
              y: height * (0.8 + 0.2 * Math.cos(time * 0.6 + 1)),
              r: width * 0.65,
              color1: 'rgba(168, 85, 247, 0.12)', // Soft Violet
              color2: 'rgba(255, 255, 255, 0)',
            },
          ];

      // Draw each procedural blob
      blobs.forEach(({ x, y, r, color1, color2 }) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 filter blur-[70px] sm:blur-[90px] opacity-90 transition-opacity duration-700"
      style={{ willChange: 'transform' }}
    />
  );
};
