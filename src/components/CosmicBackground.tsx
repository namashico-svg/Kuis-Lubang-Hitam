import React, { useEffect, useRef, useState } from "react";

export default function CosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle mouse move for parallax coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const targetX = (clientX - window.innerWidth / 2) / 50;
      const targetY = (clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x: targetX, y: targetY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Canvas starfield and floating dust animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const fillCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    fillCanvas();
    window.addEventListener("resize", fillCanvas);

    // Dynamic objects
    const stars: Array<{ x: number; y: number; size: number; alpha: number; speed: number }> = [];
    const particles: Array<{ x: number; y: number; size: number; alpha: number; speedX: number; speedY: number; color: string }> = [];

    // Create stars
    const maxStars = 120;
    for (let i = 0; i < maxStars; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
      });
    }

    // Create floating nebula dust particles
    const maxParticles = 40;
    const colors = ["rgba(6, 182, 212, ", "rgba(124, 58, 237, ", "rgba(30, 58, 138, "];
    for (let i = 0; i < maxParticles; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        speedY: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background dim space stars
      stars.forEach((star) => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
          star.speed = -star.speed;
        }
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, Math.min(1, star.alpha))})`;
        // Apply parallax offset
        const xOffset = star.size * mousePosition.x * 0.5;
        const yOffset = star.size * mousePosition.y * 0.5;
        ctx.beginPath();
        ctx.arc(star.x + xOffset, star.y + yOffset, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating gas particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around bounds
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        ctx.fillStyle = `${p.color}${p.alpha})`;
        const pOffset = p.size * mousePosition.x * 0.4;
        const yOffset = p.size * mousePosition.y * 0.4;
        ctx.beginPath();
        ctx.arc(p.x + pOffset, p.y + yOffset, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", fillCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePosition]);

  return (
    <div id="cosmic-bg" className="fixed inset-0 overflow-hidden bg-[#050816] pointer-events-none z-0">
      {/* Deep nebula space gradients */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-[0.25] animate-pulse pointer-events-none transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, #7C3AED 0%, transparent 70%)",
          left: `calc(15% + ${mousePosition.x * 2}px)`,
          top: `calc(10% + ${mousePosition.y * 2}px)`,
          animationDuration: "8s"
        }}
      />
      <div 
        className="absolute w-[800px] h-[800px] rounded-full filter blur-[150px] opacity-[0.2] pointer-events-none transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 75%)",
          right: `calc(10% - ${mousePosition.x * 3}px)`,
          bottom: `calc(15% - ${mousePosition.y * 3}px)`,
          animationDuration: "12s"
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full filter blur-[100px] opacity-[0.15] pointer-events-none transition-all duration-1000"
        style={{
          background: "radial-gradient(circle, #1E3A8A 0%, transparent 70%)",
          left: `calc(50% + ${mousePosition.x * 1.5}px)`,
          top: `calc(60% + ${mousePosition.y * 1.5}px)`,
          animationDuration: "10s"
        }}
      />

      {/* Decorative center cosmic warp (background black hole) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] transform scale-150 animate-[spin_100s_linear_infinite]">
        <div className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full border border-dashed border-cyan-500 opacity-60">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] md:w-[350px] md:h-[350px] rounded-full border border-dashed border-purple-500 opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50px] h-[50px] md:w-[120px] md:h-[120px] rounded-full bg-black shadow-[0_0_80px_rgba(124,58,237,0.7)]"></div>
        </div>
      </div>

      {/* Dynamic Starfield & Floating particles canvas */}
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
