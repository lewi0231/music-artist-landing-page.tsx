"use client";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import ParallaxTrack from "./parallax-track";

interface Track {
  title: string;
  platform: "spotify" | "soundcloud";
  url: string;
  embedId?: string;
  artwork?: string;
}

interface ParallaxSectionProps {
  tracks: Track[];
}

// Track configuration - centralized, easy to adjust
export interface TrackConfig {
  // Desktop positioning
  desktop: {
    top: string;
    left?: string;
    right?: string;
    width: string;
    height: string;
  };
  // Mobile positioning (optional, falls back to desktop if not provided)
  mobile?: {
    top: string;
    left?: string;
    right?: string;
    width: string;
    height: string;
  };
  // Parallax transforms - values will be multiplied by responsive factor
  parallax: {
    y: number[]; // scroll progress to y offset (2-4 values)
    scale: number[]; // scroll progress to scale (2-4 values)
    x?: number[]; // optional horizontal movement (2-4 values)
    // Parallax input ranges (when to start/end animation) - must match length of y/scale/x
    inputRange?: number[];
  };
}

const trackConfigs: TrackConfig[] = [
  {
    desktop: {
      top: "top-[8.33%]",
      left: "left-[8.33%]",
      width: "w-[300px]",
      height: "300",
    },
    mobile: {
      top: "top-[10%]",
      left: "left-[5%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, 500],
      scale: [1, 2],
      x: [0, 650],
      inputRange: [0, 1],
    },
  },
  {
    desktop: {
      top: "top-1/2",
      left: "left-1/2",
      width: "w-[250px]",
      height: "250",
    },
    mobile: {
      top: "top-[25%]",
      left: "left-[10%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, 400],
      scale: [2, 1],
      x: [0, 500],
      inputRange: [0, 1],
    },
  },
  {
    desktop: {
      top: "top-1/4",
      right: "right-[8.33%]",
      width: "w-[300px]",
      height: "300",
    },
    mobile: {
      top: "top-[40%]",
      left: "left-[30%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, 650],
      scale: [1.5, 0.5],
      x: [0, -1000],
      inputRange: [0, 1],
    },
  },
  {
    desktop: {
      top: "top-3/4",
      left: "left-[16.67%]",
      width: "w-[280px]",
      height: "280",
    },
    mobile: {
      top: "top-[55%]",
      left: "left-[5%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, -1000],
      scale: [1, 1.3],
      x: [0, 650],
      inputRange: [0, 1],
    },
  },
  {
    desktop: {
      top: "top-1/3",
      left: "left-1/4",
      width: "w-[280px]",
      height: "280",
    },
    mobile: {
      top: "top-[70%]",
      left: "left-[5%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, 0.2, 1],
      scale: [0, 0.5, 1],
      x: [0, 400],
      inputRange: [0, 0.5, 1],
    },
  },
  {
    desktop: {
      top: "top-[16.67%]",
      left: "left-[16.67%]",
      width: "w-[280px]",
      height: "280",
    },
    mobile: {
      top: "top-[85%]",
      left: "left-[5%]",
      width: "w-[200px]",
      height: "200",
    },
    parallax: {
      y: [0, 1],
      scale: [0, 0.3, 0.6, 1],
      x: [0, -300],
      inputRange: [0, 0.3, 0.6, 1],
    },
  },
];

export default function ParallaxSection({ tracks }: ParallaxSectionProps) {
  const ref = useRef(null);
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Responsive multiplier - reduce parallax intensity on mobile
  const parallaxMultiplier = isMobile ? 0.3 : 1;

  // Fade out texture when parallax section is in view
  const textureOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.15, 0, 0, 0.15]
  );

  useEffect(() => {
    let rafId: number | null = null;
    let lastValue = 0.15;

    const updateOpacity = (value: number) => {
      // Throttle updates to reduce forced reflows, especially on mobile
      if (Math.abs(value - lastValue) > 0.01) {
        document.documentElement.style.setProperty(
          "--texture-opacity",
          value.toString()
        );
        lastValue = value;
      }
    };

    const handleChange = () => {
      if (rafId !== null) return; // Already queued

      rafId = requestAnimationFrame(() => {
        const latest = textureOpacity.get();
        updateOpacity(latest);
        rafId = null;
      });
    };

    const unsubscribe = textureOpacity.on("change", handleChange);

    return () => {
      unsubscribe();
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [textureOpacity]);

  // Background layer transforms for albatross image
  const y2 = useTransform(
    scrollYProgress,
    [0, 1],
    [0, 10 * parallaxMultiplier]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.8, 1],
    [0, 0, 1, 0, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 0.8, 1],
    isMobile ? [2, 0.8, 1.1, 1.8] : [4, 0.5, 1.3, 2.5]
  );

  return (
    <section
      ref={ref}
      className="relative h-[200vh] overflow-hidden opacity-75"
    >
      {/* Background layer - albatross letters */}
      <motion.div
        style={{ y: y2, opacity, scale }}
        className="absolute inset-0"
      >
        <Image
          src="/albatross_letters.png"
          alt="Albatross Background Image Made from Letters"
          fill
          sizes="100vw"
          quality={70}
          loading="lazy"
          className="opacity-28 object-contain"
        />
      </motion.div>

      {/* Track cards - rendered from config */}
      {tracks.map((track, index) => {
        if (!track) return null;

        const config = trackConfigs[index];
        if (!config) return null;

        return (
          <ParallaxTrack
            key={index}
            track={track}
            config={config}
            scrollYProgress={scrollYProgress}
            parallaxMultiplier={parallaxMultiplier}
            index={index}
          />
        );
      })}
    </section>
  );
}
