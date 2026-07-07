'use client';

import { useEffect, useRef } from 'react';

export default function Petals() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let W = 0;
    let H = 0;
    let petals = [];
    const maxPetals = 28;
    let running = true;
    let rafId = null;

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      W = canvas.width = window.innerWidth * dpr;
      H = canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
    }

    function createPetal(dpr) {
      return {
        x: Math.random() * W,
        y: -50 * dpr - Math.random() * H,
        r: (5 + Math.random() * 6) * dpr,
        angle: Math.random() * Math.PI * 2,
        spinSpeed: Math.random() * 0.02 - 0.01,
        speedY: (1.2 + Math.random() * 1.5) * dpr,
        speedX: (0.4 + Math.random() * 0.8) * dpr * (Math.random() < 0.5 ? -1 : 1),
        swingSpeed: 0.01 + Math.random() * 0.02,
        swingPhase: Math.random() * Math.PI * 2,
        swingWidth: (20 + Math.random() * 30) * dpr,
        scaleX: 1,
        scaleY: 1,
        scaleSpeedX: 0.02 + Math.random() * 0.03,
        scalePhaseX: Math.random() * Math.PI * 2,
      };
    }

    const dpr = window.devicePixelRatio || 1;
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < maxPetals; i++) {
      petals.push(createPetal(dpr));
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      const currentDpr = window.devicePixelRatio || 1;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.swingPhase += p.swingSpeed;
        const drift = Math.sin(p.swingPhase) * p.swingWidth;
        const curX = p.x + drift;

        p.scalePhaseX += p.scaleSpeedX;
        p.scaleX = Math.sin(p.scalePhaseX);
        p.angle += p.spinSpeed;

        ctx.save();
        ctx.translate(curX, p.y);
        ctx.rotate(p.angle);
        ctx.scale(p.scaleX, 1);
        ctx.beginPath();
        ctx.moveTo(0, -p.r);
        ctx.bezierCurveTo(p.r * 0.6, -p.r * 0.8, p.r * 0.8, p.r * 0.3, 0, p.r);
        ctx.bezierCurveTo(-p.r * 0.8, p.r * 0.3, -p.r * 0.6, -p.r * 0.8, 0, -p.r);
        ctx.closePath();

        const grad = ctx.createLinearGradient(0, -p.r, 0, p.r);
        grad.addColorStop(0, '#FFE5EC');
        grad.addColorStop(0.4, '#FFC2D1');
        grad.addColorStop(1, '#FF758F');
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();

        if (p.y > H + 50) {
          Object.assign(p, createPetal(currentDpr));
          p.y = -50 * currentDpr;
        }
      });

      rafId = requestAnimationFrame(draw);
    }

    rafId = requestAnimationFrame(draw);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        if (!running) {
          running = true;
          rafId = requestAnimationFrame(draw);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return <canvas id="petals-canvas" ref={canvasRef} />;
}
