"use client";
import { useEffect, useRef } from "react";

// Vector class for 2D physics calculations
class Vector {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  subtract(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  multiply(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const mag = this.magnitude();
    if (mag !== 0) {
      this.x /= mag;
      this.y /= mag;
    }
    return this;
  }

  limit(max: number) {
    if (this.magnitude() > max) {
      this.normalize().multiply(max);
    }
    return this;
  }

  dist(v: Vector) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

// Particle class - represents a single moving point
class Particle {
  pos: Vector;
  prevPos: Vector;
  velocity: Vector;

  constructor(x: number, y: number) {
    this.pos = new Vector(x, y);
    this.prevPos = new Vector(x, y);
    this.velocity = new Vector(0, 0);
  }

  update(gravityPoints: GravityPoint[], interference: boolean) {
    const force = new Vector(0, 0);

    // Apply gravity from each gravity point
    for (const gp of gravityPoints) {
      const dx = gp.pos.x - this.pos.x;
      const dy = gp.pos.y - this.pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < gp.radius && distance > 0) {
        const strength = gp.strength / (distance * distance + 1);
        const normalized = new Vector(dx / distance, dy / distance);
        force.add(normalized.multiply(strength));
      }
    }

    this.velocity.add(force);
    this.velocity.multiply(0.98); // Damping
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    this.pos.add(this.velocity);

    // Interaction between gravity points (optional)
    if (interference) {
      for (const gp of gravityPoints) {
        for (const otherGP of gravityPoints) {
          if (gp !== otherGP) {
            const dist = gp.pos.dist(otherGP.pos);
            if (dist < 100 && dist > 0) {
              const repulsion = new Vector(
                gp.pos.x - otherGP.pos.x,
                gp.pos.y - otherGP.pos.y
              ).normalize();
              repulsion.multiply(0.5 / (dist * dist + 1));
              gp.pos.add(repulsion);
            }
          }
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// Gravity Point class - the interactive gravity sources
class GravityPoint {
  pos: Vector;
  strength: number;
  radius: number;

  constructor(x: number, y: number, strength = 50, radius = 200) {
    this.pos = new Vector(x, y);
    this.strength = strength;
    this.radius = radius;
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Draw outer circle (influence area)
    const gradient = ctx.createRadialGradient(
      this.pos.x,
      this.pos.y,
      0,
      this.pos.x,
      this.pos.y,
      this.radius
    );
    gradient.addColorStop(0, "rgba(255, 255, 255, 0.2)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw center point
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.fill();
  }
}

export function useGravityAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isPlaying: boolean,
  isFullScreen: boolean
) {
  const animationRef = useRef<number | null>(null);
  const gravityPointsRef = useRef<GravityPoint[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const interferenceRef = useRef(true);

  const initAnimation = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Create particles
    const particleCount = 200;
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      particlesRef.current.push(new Particle(x, y));
    }

    // Create initial gravity point
    gravityPointsRef.current = [
      new GravityPoint(canvas.width / 2, canvas.height / 2),
    ];
  };

  const startAnimation = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const animate = () => {
      if (!isPlaying || !canvasRef.current || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Fill with black background when playing
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (const particle of particlesRef.current) {
        particle.update(gravityPointsRef.current, interferenceRef.current);
        particle.draw(ctx);
      }

      // Draw gravity points
      for (const gp of gravityPointsRef.current) {
        gp.draw(ctx);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  // Initialize animation and click handlers
  useEffect(() => {
    if (isPlaying && canvasRef.current) {
      initAnimation();
      startAnimation();

      // Add click handler to create new gravity points
      const handleClick = (e: MouseEvent) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gravityPointsRef.current.push(new GravityPoint(x, y));

        // Limit number of gravity points
        if (gravityPointsRef.current.length > 8) {
          gravityPointsRef.current.shift();
        }
      };

      const canvas = canvasRef.current;
      canvas.addEventListener("click", handleClick);

      return () => {
        canvas.removeEventListener("click", handleClick);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return undefined;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, isFullScreen]);
}
