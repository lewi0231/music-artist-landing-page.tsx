"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import AnimatedSeparator from "./animated-separator";

interface Track {
  title: string;
  platform: "spotify" | "soundcloud";
  url: string;
  embedId?: string; // For SoundCloud track IDs
}

interface MusicSliderProps {
  tracks: Track[];
  sectionIndex: string;
  weirdIdentifier: string;
}

export default function MusicSlider({
  tracks,
  sectionIndex,
  weirdIdentifier,
}: MusicSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTrack = () => {
    setCurrentIndex((prev) => (prev + 1) % tracks.length);
  };

  const prevTrack = () => {
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const currentTrack = tracks[currentIndex];

  return (
    <section className="mb-40">
      <AnimatedSeparator />
      <div className="relative pt-10">
        {/* Top row: Section index and player */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 flex flex-col items-start">
            <div className="text-8xl font-mono font-light leading-20">
              {sectionIndex}
            </div>
            <div className="grid grid-cols-3 h-full w-full">
              <div className="col-span-1 flex items-end">
                <div className="-rotate-90 whitespace-nowrap text-sm font-thin my-4">
                  {weirdIdentifier}
                </div>
              </div>
              <div className="col-span-1 text-5xl flex items-end justify-end">
                &#x21B3;
              </div>
            </div>
          </div>

          {/* Music Player Container */}
          <div className="col-span-3">
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-2xl overflow-hidden bg-foreground/5 p-4"
                >
                  {currentTrack.platform === "spotify" ? (
                    <iframe
                      src={`https://open.spotify.com/embed/track/${currentTrack.url}?utm_source=generator&theme=0`}
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded-lg"
                    />
                  ) : (
                    <iframe
                      src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                        currentTrack.url
                      )}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
                      width="100%"
                      height="352"
                      frameBorder="no"
                      scrolling="no"
                      className="rounded-lg"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation arrows */}
              <button
                onClick={prevTrack}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 text-4xl hover:scale-110 transition-transform"
                aria-label="Previous track"
              >
                ←
              </button>
              <button
                onClick={nextTrack}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 text-4xl hover:scale-110 transition-transform"
                aria-label="Next track"
              >
                →
              </button>
            </div>

            {/* Track indicator */}
            <div className="mt-4 flex justify-center gap-2">
              {tracks.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-foreground"
                      : "w-2 bg-foreground/30"
                  }`}
                  aria-label={`Go to track ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row: Title */}
        <div className="grid grid-cols-5 gap-4 mt-4">
          <div className="col-span-2"></div>
          <div className="col-span-3 text-6xl flex items-end">
            {currentTrack.title}
          </div>
        </div>
      </div>
    </section>
  );
}
