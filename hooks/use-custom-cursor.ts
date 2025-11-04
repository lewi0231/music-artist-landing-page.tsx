import { useEffect, useRef, useState } from "react";

// Smoothing factor for cursor movement
const SPEED = 0.15;

// Check if device is mobile/touch device
const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error - legacy check
    navigator.msMaxTouchPoints > 0
  );
};

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

  // Track if mouse is moving (for throttling)
  const isMoving = useRef(false);
  const lastMoveTime = useRef(0);

  useEffect(() => {
    // Disable custom cursor on mobile devices to reduce main thread work
    if (isMobileDevice()) {
      return;
    }

    let animationFrameId: number;
    let lastUpdateTime = 0;
    const throttleMs = 16; // ~60fps

    // Animation loop - runs continuously via requestAnimationFrame
    const animate = (currentTime: number) => {
      if (!cursorRef.current) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Throttle updates when not moving significantly
      const timeSinceLastUpdate = currentTime - lastUpdateTime;
      if (!isMoving.current && timeSinceLastUpdate < throttleMs * 2) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      lastUpdateTime = currentTime;

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

      // Calculate stretch direction based on movement angle
      const stretchAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const stretchX = Math.cos((stretchAngle * Math.PI) / 180) * scale.current;
      const stretchY = Math.sin((stretchAngle * Math.PI) / 180) * scale.current;

      // Apply transforms directly to the DOM element
      const transform = `translate(${circlePosition.current.x}px, ${
        circlePosition.current.y
      }px) scale(${(1 + Math.abs(stretchX)) * hoverScale}, ${
        (1 + Math.abs(stretchY)) * hoverScale
      }) rotate(${angle.current}deg)`;

      if (cursorRef.current) {
        cursorRef.current.style.transform = transform;
        cursorRef.current.style.willChange = "transform";
      }

      // Continue the animation loop
      animationFrameId = requestAnimationFrame(animate);
    };

    // Update mouse position on move
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Track movement for throttling
      if (now - lastMoveTime.current > 50) {
        isMoving.current = true;
        setTimeout(() => {
          isMoving.current = false;
        }, 100);
      }
      lastMoveTime.current = now;

      // Make visible when mouse moves (React will bail out if already true)
      setIsVisible(true);

      // Check if element is clickable
      const target = e.target as HTMLElement;
      const isClickable =
        target.hasAttribute("data-pointer") ||
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.tagName === "IFRAME" ||
        target.getAttribute("role") === "button" ||
        target.closest("[data-pointer]") !== null;

      isPointerRef.current = isClickable;
      setIsPointer(isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);

    // Start animation loop
    animationFrameId = requestAnimationFrame(animate);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [cursorRef]);

  return { isPointer, isVisible };
}
