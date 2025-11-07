"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, MotionValue, useInView, useTransform } from "framer-motion";
import { useRef } from "react";
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

// SoundCloud Widget API types
declare global {
  interface Window {
    SC?: {
      Widget: (iframe: HTMLIFrameElement) => {
        toggle: () => void;
        play: () => void;
        pause: () => void;
        bind: (event: string, callback: () => void) => void;
      };
    };
  }
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
  const trackRef = useRef(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const isInView = useInView(trackRef, {
    once: true,
    margin: "400px 0px 0px 0px",
  });

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

  // Handle track click
  const handleTrackClick = () => {
    const iframe = iframeRef.current;

    console.debug("Track clicked:", {
      hasIframe: !!iframe,
      hasWindowSC: typeof window.SC !== "undefined",
      windowSC: window.SC,
    });

    if (!iframe) {
      console.warn("No iframe reference");
      return;
    }

    if (typeof window.SC === "undefined") {
      console.warn("Souncloud API not loaded yet");
      return;
    }

    try {
      const widget = window.SC.Widget(iframe);
      console.log("Widget created:", widget);
      widget.toggle();
    } catch (error) {
      console.error("Error creating soundcloud widget or toggling", error);
    }
  };

  const positioning =
    isMobile && config.mobile ? config.mobile : config.desktop;

  return (
    <motion.div
      ref={trackRef}
      style={{
        y,
        scale,
        x: config.parallax.x ? x : undefined,
      }}
      className={`absolute ${positioning.top} ${
        positioning.left || positioning.right || ""
      } ${positioning.width} group cursor-pointer`}
    >
      <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
        {isInView && (
          <iframe
            ref={iframeRef}
            data-pointer
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
              track.url
            )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
            width="100%"
            height={positioning.height}
            frameBorder="no"
            scrolling="no"
          />
        )}
        <div
          className="absolute inset-0 cursor-pointer"
          data-pointer
          onClick={handleTrackClick}
        />
      </div>
    </motion.div>
  );
}
