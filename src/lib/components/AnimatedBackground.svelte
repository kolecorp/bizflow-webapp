<script lang="ts">
  import { onMount } from "svelte";

  let mouseX = 0;
  let mouseY = 0;
  let particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    scale: number;
  }[] = [];
  let canvas: HTMLCanvasElement;
  let animationFrameId: number;

  const PARTICLE_COUNT = 12;
  const PARTICLE_SPEED = 0.02;

  function initParticles() {
    particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * (canvas?.width || window.innerWidth),
      y: Math.random() * (canvas?.height || window.innerHeight),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      scale: Math.random() * 0.5 + 0.5,
    }));
  }

  function drawFrame() {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear with slight fade
    ctx.fillStyle = "rgba(255, 255, 255, 0.02)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach((p, i) => {
      // Attraction to mouse
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 300) {
        p.vx += (dx / distance) * PARTICLE_SPEED;
        p.vy += (dy / distance) * PARTICLE_SPEED;
      }

      // Friction
      p.vx *= 0.98;
      p.vy *= 0.98;

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle with glow
      const gradient = ctx.createRadialGradient(
        p.x,
        p.y,
        0,
        p.x,
        p.y,
        40 * p.scale,
      );
      gradient.addColorStop(0, "rgba(139, 92, 246, 0.6)");
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)");
      gradient.addColorStop(1, "rgba(99, 102, 241, 0)");

      ctx.fillStyle = gradient;
      ctx.fillRect(
        p.x - 40 * p.scale,
        p.y - 40 * p.scale,
        80 * p.scale,
        80 * p.scale,
      );

      // Connection lines
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const d = Math.sqrt(Math.pow(p.x - p2.x, 2) + Math.pow(p.y - p2.y, 2));
        if (d < 200) {
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - d / 200)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }
    });

    animationFrameId = requestAnimationFrame(drawFrame);
  }

  function handleMouseMove(e: MouseEvent) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleResize() {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  }

  onMount(() => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
      drawFrame();

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationFrameId);
      };
    }
  });
</script>

<canvas
  bind:this={canvas}
  class="fixed inset-0 pointer-events-none"
  style="mix-blend-mode: screen; opacity: 0.5;"
></canvas>
