"use client";
import { useGravityAnimation } from "@/hooks/use-gravity-animation";
import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";

export default function AudioPlayWrapper({
  children,
  audioSrc,
}: {
  children: React.ReactNode;
  audioSrc: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the gravity animation hook
  useGravityAnimation(canvasRef, isPlaying, isFullScreen);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsFullScreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
      } else {
        audioRef.current.play();
        setIsFullScreen(true);
        if (containerRef.current) {
          containerRef.current.requestFullscreen?.();
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  if (!audioSrc?.startsWith("/")) return;

  return (
    <div className="relative group" ref={containerRef}>
      <div
        className={cn(
          "transition-opacity duration-1000",
          isPlaying ? "opacity-20" : "opacity-100"
        )}
      >
        {children}
      </div>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-1000 pointer-events-auto",
          isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />
      {/* Play button - visible only when not playing */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute cursor-pointer inset-0 flex h-full items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-3xl z-10"
        >
          ▶
        </button>
      )}
      {/* Pause button - always visible when playing */}
      {isPlaying && (
        <button
          onClick={togglePlay}
          className="absolute cursor-pointer top-4 right-4 w-12 h-12 flex items-center justify-center bg-black/50 rounded-full hover:bg-black/70 transition-opacity text-2xl z-20 backdrop-blur-sm"
        >
          ⏸
        </button>
      )}
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
}
