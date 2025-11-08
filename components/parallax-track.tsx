"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, MotionValue, useTransform } from "framer-motion";
import type { TrackConfig } from "./parallax-section";

interface Track {
  title: string;
  platform: "spotify" | "soundcloud";
  url: string;
  embedId?: string;
  artwork?: string;
}

interface ParallaxTrackProps {
  track: Track;
  config: TrackConfig;
  scrollYProgress: MotionValue<number>;
  parallaxMultiplier: number;
  index: number;
}

// Helper to generate input range matching output array length
const getInputRange = (outputArray: number[], defaultRange?: number[]) => {
  if (defaultRange && defaultRange.length === outputArray.length) {
    return defaultRange;
  }
  if (outputArray.length === 2) return [0, 1];
  if (outputArray.length === 3) return [0, 0.5, 1];
  if (outputArray.length === 4) return [0, 0.33, 0.67, 1];
  return [0, 1];
};

export default function ParallaxTrack({
  track,
  config,
  scrollYProgress,
  parallaxMultiplier,
}: ParallaxTrackProps) {
  const isMobile = useIsMobile();

  // Calculate transforms based on config
  const yOutput = config.parallax.y.map((v) => v * parallaxMultiplier);
  const y = useTransform(
    scrollYProgress,
    getInputRange(yOutput, config.parallax.inputRange),
    yOutput
  );

  const scaleOutput = config.parallax.scale;
  const scale = useTransform(
    scrollYProgress,
    getInputRange(scaleOutput, config.parallax.inputRange),
    scaleOutput
  );

  const xOutput = config.parallax.x?.map((v) => v * parallaxMultiplier) || [
    0, 0,
  ];
  const x = useTransform(
    scrollYProgress,
    getInputRange(xOutput, config.parallax.inputRange),
    xOutput
  );

  const positioning =
    isMobile && config.mobile ? config.mobile : config.desktop;

  const cardHeight = Number(positioning.height ?? 300);

  return (
    <motion.div
      style={{
        y,
        scale,
        x: config.parallax.x ? x : undefined,
      }}
      className={`absolute ${positioning.top} ${
        positioning.left || positioning.right || ""
      } ${positioning.width}`}
    >
      <div
        className="relative flex h-full w-full items-stretch overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/50 shadow-2xl backdrop-blur"
        style={{ minHeight: cardHeight }}
      >
        <a
          href={track.url}
          target="_blank"
          rel="noreferrer"
          data-pointer
          className="flex w-full flex-1 flex-col items-center justify-center gap-3 px-6 py-8 text-center transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900"
          aria-label={`Open ${track.title} on ${track.platform}`}
        >
          <span className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
            {track.platform}
          </span>
          <span className="text-2xl font-semibold text-white sm:text-3xl">
            {track.title}
          </span>
          <span className="text-xs text-white/50">
            Opens in a new SoundCloud tab
          </span>
        </a>
      </div>
    </motion.div>
  );
}
