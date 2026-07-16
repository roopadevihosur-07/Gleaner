'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  type: 'depot' | 'agency';
  pulse: number;
  pulseSpeed: number;
  draw: (ctx: CanvasRenderingContext2D, time: number) => void;
}

interface Truck {
  startNode: Node;
  endNode: Node;
  progress: number;
  speed: number;
  index: number;
  update: () => void;
  getPosition: () => { x: number; y: number };
  draw: (ctx: CanvasRenderingContext2D) => void;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let time = 0;
    const nodes: Node[] = [];
    const trucks: Truck[] = [];

    // Create Node class
    class NodeClass implements Node {
      x: number;
      y: number;
      type: 'depot' | 'agency';
      pulse: number;
      pulseSpeed: number;

      constructor(x: number, y: number, type: 'depot' | 'agency' = 'agency') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      draw(ctx: CanvasRenderingContext2D, time: number) {
        const pulse = Math.sin(time * this.pulseSpeed + this.pulse) * 3 + 8;

        if (this.type === 'depot') {
          ctx.fillStyle = `rgba(0, 122, 252, ${0.6 + Math.sin(time * 0.01 + this.pulse) * 0.3})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, pulse + 4, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(0, 122, 252, 0.3)`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, pulse * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(34, 138, 86, ${0.5 + Math.sin(time * 0.01 + this.pulse) * 0.3})`;
          ctx.beginPath();
          ctx.arc(this.x, this.y, pulse, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // Create Truck class
    class TruckClass implements Truck {
      startNode: Node;
      endNode: Node;
      progress: number;
      speed: number;
      index: number;

      constructor(startNode: Node, endNode: Node, speed = 0.0015) {
        this.startNode = startNode;
        this.endNode = endNode;
        this.progress = Math.random() * 0.5;
        this.speed = speed + Math.random() * 0.0005;
        this.index = Math.random();
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) this.progress -= 1;
      }

      getPosition() {
        const x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
        const y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
        return { x, y };
      }

      draw(ctx: CanvasRenderingContext2D) {
        const pos = this.getPosition();
        const angle = Math.atan2(
          this.endNode.y - this.startNode.y,
          this.endNode.x - this.startNode.x
        );

        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.rotate(angle);

        ctx.fillStyle = 'rgba(0, 122, 252, 0.8)';
        ctx.fillRect(0, -4, 12, 8);

        ctx.fillStyle = 'rgba(0, 122, 254, 0.6)';
        ctx.fillRect(10, -5, 10, 10);

        ctx.restore();
      }
    }

    // Initialize
    function init() {
      nodes.length = 0;
      trucks.length = 0;

      const depot = new NodeClass(canvas.width * 0.3, canvas.height * 0.5, 'depot');
      nodes.push(depot);

      const agencyCount = 6;
      for (let i = 0; i < agencyCount; i++) {
        const angle = (i / agencyCount) * Math.PI * 2;
        const distance = Math.min(canvas.width, canvas.height) * 0.25;
        const x = canvas.width * 0.5 + Math.cos(angle) * distance;
        const y = canvas.height * 0.5 + Math.sin(angle) * distance;
        nodes.push(new NodeClass(x, y, 'agency'));
      }

      for (let i = 1; i < nodes.length; i++) {
        trucks.push(new TruckClass(depot, nodes[i]));
        trucks.push(new TruckClass(nodes[i], depot));
      }
    }

    // Connection line
    function drawConnection(
      ctx: CanvasRenderingContext2D,
      from: Node,
      to: Node,
      time: number
    ) {
      const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      const pulseAmount = Math.sin(time * 0.01) * 0.3 + 0.5;

      gradient.addColorStop(0, `rgba(0, 122, 252, 0)`);
      gradient.addColorStop(0.5, `rgba(0, 122, 252, ${0.2 * pulseAmount})`);
      gradient.addColorStop(1, `rgba(34, 138, 86, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }

    // Animation loop
    function animate() {
      ctx.fillStyle = 'rgba(14, 16, 18, 0.3)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time++;

      const depot = nodes[0];
      for (let i = 1; i < nodes.length; i++) {
        drawConnection(ctx, depot, nodes[i], time);
      }

      for (let node of nodes) {
        node.draw(ctx, time);
      }

      for (let truck of trucks) {
        truck.update();
        truck.draw(ctx);
      }

      requestAnimationFrame(animate);
    }

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'none',
        filter: 'blur(0.8px)',
        opacity: 0.7,
      }}
    />
  );
}
