"use client";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";

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

// Track configuration - centralized, easy to adjust
interface TrackConfig {
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

  // Refs for iframe widgets
  const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({});

  // Responsive multiplier - reduce parallax intensity on mobile
  const parallaxMultiplier = isMobile ? 0.3 : 1;

  // Fade out texture when parallax section is in view
  const textureOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.15, 0, 0, 0.15]
  );

  useEffect(() => {
    const unsubscribe = textureOpacity.on("change", (latest) => {
      document.documentElement.style.setProperty(
        "--texture-opacity",
        latest.toString()
      );
    });

    return () => unsubscribe();
  }, [textureOpacity]);

  // Handle track click
  const handleTrackClick = (index: number) => {
    const iframe = iframeRefs.current[index];
    if (iframe && window.SC) {
      const widget = window.SC.Widget(iframe);
      widget.toggle();
    }
  };

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

  // Helper to generate input range matching output array length
  const getInputRange = (outputArray: number[], defaultRange?: number[]) => {
    if (defaultRange && defaultRange.length === outputArray.length) {
      return defaultRange;
    }
    // Generate evenly spaced range based on output length
    if (outputArray.length === 2) return [0, 1];
    if (outputArray.length === 3) return [0, 0.5, 1];
    if (outputArray.length === 4) return [0, 0.33, 0.67, 1];
    return [0, 1]; // fallback
  };

  // Generate all track transforms upfront - created individually at top level to follow hooks rules
  // Track 0
  const track0YOutput = (trackConfigs[0]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track0Y = useTransform(
    scrollYProgress,
    getInputRange(track0YOutput, trackConfigs[0]?.parallax.inputRange),
    track0YOutput
  );
  const track0ScaleOutput = trackConfigs[0]?.parallax.scale || [1, 1];
  const track0Scale = useTransform(
    scrollYProgress,
    getInputRange(track0ScaleOutput, trackConfigs[0]?.parallax.inputRange),
    track0ScaleOutput
  );
  const track0XOutput = trackConfigs[0]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track0X = useTransform(
    scrollYProgress,
    getInputRange(track0XOutput, trackConfigs[0]?.parallax.inputRange),
    track0XOutput
  );

  // Track 1
  const track1YOutput = (trackConfigs[1]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track1Y = useTransform(
    scrollYProgress,
    getInputRange(track1YOutput, trackConfigs[1]?.parallax.inputRange),
    track1YOutput
  );
  const track1ScaleOutput = trackConfigs[1]?.parallax.scale || [1, 1];
  const track1Scale = useTransform(
    scrollYProgress,
    getInputRange(track1ScaleOutput, trackConfigs[1]?.parallax.inputRange),
    track1ScaleOutput
  );
  const track1XOutput = trackConfigs[1]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track1X = useTransform(
    scrollYProgress,
    getInputRange(track1XOutput, trackConfigs[1]?.parallax.inputRange),
    track1XOutput
  );

  // Track 2
  const track2YOutput = (trackConfigs[2]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track2Y = useTransform(
    scrollYProgress,
    getInputRange(track2YOutput, trackConfigs[2]?.parallax.inputRange),
    track2YOutput
  );
  const track2ScaleOutput = trackConfigs[2]?.parallax.scale || [1, 1];
  const track2Scale = useTransform(
    scrollYProgress,
    getInputRange(track2ScaleOutput, trackConfigs[2]?.parallax.inputRange),
    track2ScaleOutput
  );
  const track2XOutput = trackConfigs[2]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track2X = useTransform(
    scrollYProgress,
    getInputRange(track2XOutput, trackConfigs[2]?.parallax.inputRange),
    track2XOutput
  );

  // Track 3
  const track3YOutput = (trackConfigs[3]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track3Y = useTransform(
    scrollYProgress,
    getInputRange(track3YOutput, trackConfigs[3]?.parallax.inputRange),
    track3YOutput
  );
  const track3ScaleOutput = trackConfigs[3]?.parallax.scale || [1, 1];
  const track3Scale = useTransform(
    scrollYProgress,
    getInputRange(track3ScaleOutput, trackConfigs[3]?.parallax.inputRange),
    track3ScaleOutput
  );
  const track3XOutput = trackConfigs[3]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track3X = useTransform(
    scrollYProgress,
    getInputRange(track3XOutput, trackConfigs[3]?.parallax.inputRange),
    track3XOutput
  );

  // Track 4
  const track4YOutput = (trackConfigs[4]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track4Y = useTransform(
    scrollYProgress,
    getInputRange(track4YOutput, trackConfigs[4]?.parallax.inputRange),
    track4YOutput
  );
  const track4ScaleOutput = trackConfigs[4]?.parallax.scale || [1, 1];
  const track4Scale = useTransform(
    scrollYProgress,
    getInputRange(track4ScaleOutput, trackConfigs[4]?.parallax.inputRange),
    track4ScaleOutput
  );
  const track4XOutput = trackConfigs[4]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track4X = useTransform(
    scrollYProgress,
    getInputRange(track4XOutput, trackConfigs[4]?.parallax.inputRange),
    track4XOutput
  );

  // Track 5
  const track5YOutput = (trackConfigs[5]?.parallax.y || [0, 0]).map(
    (v) => v * parallaxMultiplier
  );
  const track5Y = useTransform(
    scrollYProgress,
    getInputRange(track5YOutput, trackConfigs[5]?.parallax.inputRange),
    track5YOutput
  );
  const track5ScaleOutput = trackConfigs[5]?.parallax.scale || [1, 1];
  const track5Scale = useTransform(
    scrollYProgress,
    getInputRange(track5ScaleOutput, trackConfigs[5]?.parallax.inputRange),
    track5ScaleOutput
  );
  const track5XOutput = trackConfigs[5]?.parallax.x?.map(
    (v) => v * parallaxMultiplier
  ) || [0, 0];
  const track5X = useTransform(
    scrollYProgress,
    getInputRange(track5XOutput, trackConfigs[5]?.parallax.inputRange),
    track5XOutput
  );

  const trackTransforms = [
    { y: track0Y, scale: track0Scale, x: track0X },
    { y: track1Y, scale: track1Scale, x: track1X },
    { y: track2Y, scale: track2Scale, x: track2X },
    { y: track3Y, scale: track3Scale, x: track3X },
    { y: track4Y, scale: track4Scale, x: track4X },
    { y: track5Y, scale: track5Scale, x: track5X },
  ];

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
          className="opacity-28 object-contain"
        />
      </motion.div>

      {/* Track cards - rendered from config */}
      {tracks.map((track, index) => {
        if (!track) return null;

        const config = trackConfigs[index];
        if (!config) return null;

        const positioning =
          isMobile && config.mobile ? config.mobile : config.desktop;
        const transforms = trackTransforms[index];

        return (
          <motion.div
            key={index}
            style={{
              y: transforms.y,
              scale: transforms.scale,
              x: config.parallax.x ? transforms.x : undefined,
            }}
            className={`absolute ${positioning.top} ${
              positioning.left || positioning.right || ""
            } ${positioning.width} group cursor-pointer`}
          >
            <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
              <iframe
                ref={(el) => {
                  iframeRefs.current[index] = el;
                }}
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                  track.url
                )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
                width="100%"
                height={positioning.height}
                frameBorder="no"
                scrolling="no"
              />
              <div
                className="absolute inset-0 cursor-pointer"
                onClick={() => handleTrackClick(index)}
              />
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}
