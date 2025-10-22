import { useEffect, useRef, useState } from "react";

// Smoothing factor for cursor movement
const SPEED = 0.17;

export function useCursor(cursorRef: React.RefObject<HTMLElement | null>) {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  //   Ref to track isPointer for use in animation loop
  const isPointerRef = useRef(false);

  // Track actual mouse position
  const mousePosition = useRef({ x: 0, y: 0 });

  // Track smoothed circle position
  const circlePosition = useRef({ x: 0, y: 0 });

  // Track scale and angle for transforms
  const scale = useRef(0);
  const angle = useRef(0);

  useEffect(() => {
    let animationFrameId: number;

    // Animation loop - runs continuously via requestAnimationFrame
    const animate = () => {
      if (!cursorRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Smooth cursor position following
      circlePosition.current.x +=
        (mousePosition.current.x - circlePosition.current.x) * SPEED;
      circlePosition.current.y +=
        (mousePosition.current.y - circlePosition.current.y) * SPEED;

      // Calculate velocity as distance between smoothed position and actual mouse
      // This increases when moving fast as the circle lags behind
      const dx = mousePosition.current.x - circlePosition.current.x;
      const dy = mousePosition.current.y - circlePosition.current.y;
      const velocity = Math.sqrt(dx * dx + dy * dy);

      // Calculate scale based on velocity
      const scaleValue = Math.min((velocity / 100) * 0.75, 0.8);
      scale.current += (scaleValue - scale.current) * SPEED;

      // Calculate rotation angle (only when moving fast enough to reduce shakiness)
      if (velocity > 20) {
        angle.current = (Math.atan2(dy, dx) * 180) / Math.PI;
      }

      if (velocity < 20) {
        scale.current *= 0.95;
      }

      const hoverScale = isPointerRef.current ? 1.25 : 1;

      // Apply transforms directly to the DOM element
      const transform = `
        translate(${circlePosition.current.x}px, ${circlePosition.current.y}px) 
        scale(${(1 + scale.current) * hoverScale}, ${
        (1 - scale.current) * hoverScale
      }) 
        rotate(${angle.current}deg)
      `;

      cursorRef.current.style.transform = transform;
      cursorRef.current.style.transition = "transform .03s ease-in-out 0s";

      // Continue the animation loop

      animationFrameId = requestAnimationFrame(animate);
    };

    // Update mouse position on move
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Make visible when mouse moves (React will bail out if already true)
      setIsVisible(true);

      // Check if element is clickable
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.getAttribute("role") === "button" ||
        window.getComputedStyle(target).cursor === "pointer";

      isPointerRef.current = isClickable;
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener(
        "mouseleave",
        handleMouseLeave
      );
    };
  }, [cursorRef]);

  return { isPointer, isVisible };
}
