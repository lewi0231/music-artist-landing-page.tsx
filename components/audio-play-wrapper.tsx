"use client";
import React, { useRef, useState } from "react";

export default function AudioPlayWrapper({
  children,
  audioSrc,
}: {
  children: React.ReactNode;
  audioSrc: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!audioSrc?.startsWith("/")) return;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative group">
      {children}
      <button
        onClick={togglePlay}
        className="absolute cursor-pointer inset-0 flex h-full items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity text-3xl"
      >
        {/* <div className="w-16 h-16 bg-transparent  flex items-center justify-center z-10 text-2xl">
        </div> */}
        {isPlaying ? "⏸" : "▶"}
      </button>
      <audio ref={audioRef} src={audioSrc} />
    </div>
  );
}
