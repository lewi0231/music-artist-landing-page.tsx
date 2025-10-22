"use client";

import { useCursor } from "@/hooks/use-custom-cursor";
import { cn } from "@/lib/utils";
import { useRef } from "react";

// Custom cursor component using CSS class
export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const { isPointer, isVisible } = useCursor(cursorRef);

  return (
    <div
      ref={cursorRef}
      className={cn(
        "circle z-100",
        isPointer ? "animate-pulse bg-black/75 " : "",
        isVisible ? "opacity-100" : "opacity-0"
      )}
    />
  );
}
