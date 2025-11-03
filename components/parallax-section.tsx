"use client";
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

export default function ParallaxSection({ tracks }: ParallaxSectionProps) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Refs for iframe widgets
  const iframeRefs = useRef<{ [key: number]: HTMLIFrameElement | null }>({});

  // Fade out texture when parallax section is in view
  const textureOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.15, 0, 0, 0.15]
  );

  useEffect(() => {
    // Update CSS variable based on scroll progress
    const unsubscribe = textureOpacity.on("change", (latest) => {
      document.documentElement.style.setProperty(
        "--texture-opacity",
        latest.toString()
      );
    });

    return () => unsubscribe();
  }, [textureOpacity]);

  // Load SoundCloud Widget API
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://w.soundcloud.com/player/api.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Handle track click
  const handleTrackClick = (index: number) => {
    const iframe = iframeRefs.current[index];
    if (iframe && window.SC) {
      const widget = window.SC.Widget(iframe);
      widget.toggle();
    }
  };

  // Keep background layer transforms for albatross image
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 10]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.5, 0.8, 1],
    [0, 0, 1, 0, 0]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 0.8, 1],
    [4, 0.5, 1.3, 2.5]
  );

  // Different parallax speeds and scales for each track
  const yTrack1 = useTransform(scrollYProgress, [0, 1], [0, 500]); // slow
  const scaleTrack1 = useTransform(scrollYProgress, [0, 1], [1, 2]);

  const yTrack2 = useTransform(scrollYProgress, [0, 1], [0, 400]); // medium
  const scaleTrack2 = useTransform(scrollYProgress, [0, 1], [2, 1]);

  const yTrack3 = useTransform(scrollYProgress, [0, 1], [0, 650]); // fast
  const scaleTrack3 = useTransform(scrollYProgress, [0, 1], [1.5, 0.5]);

  const yTrack4 = useTransform(scrollYProgress, [0, 1], [0, -1000]); // opposite
  const scaleTrack4 = useTransform(scrollYProgress, [0, 1], [1, 1.3]);

  const yTrack5 = useTransform(scrollYProgress, [0, 0.2, 1], [0, 400, 700]); // opposite
  const scaleTrack5 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 1.3]);

  const yTrack6 = useTransform(scrollYProgress, [0, 1], [0, -300]); // opposite
  const scaleTrack6 = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [1, 0.9, 1.8, 2]
  );

  return (
    <section
      ref={ref}
      className="relative h-[200vh] overflow-hidden opacity-75"
    >
      {/* <AnimatedSeparator /> */}
      {/* Background layer - albatross letters */}
      <motion.div
        style={{ y: y2, opacity, scale }}
        className="absolute inset-0"
      >
        <Image
          src="/albatross_letters.png"
          alt="Background"
          fill
          className="opacity-28 object-contain"
        />
      </motion.div>

      {/* Track cards positioned at different locations with parallax */}
      {tracks[0] && (
        <motion.div
          style={{ y: yTrack1, scale: scaleTrack1, x: yTrack3 }}
          className="absolute top-1/12 left-1/12 w-[300px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={(el) => {
                iframeRefs.current[0] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[0].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="300"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(0)}
            />
          </div>
        </motion.div>
      )}

      {tracks[1] && (
        <motion.div
          style={{ y: yTrack2, scale: scaleTrack2, x: yTrack1 }}
          className="absolute left-1/2 top-1/2  w-[250px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={(el) => {
                iframeRefs.current[1] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[1].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="250"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(1)}
            />
          </div>
        </motion.div>
      )}

      {tracks[2] && (
        <motion.div
          style={{ y: yTrack3, scale: scaleTrack3, x: yTrack4 }}
          className="absolute top-1/4 right-1/12  w-[300px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={(el) => {
                iframeRefs.current[2] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[2].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="300"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(2)}
            />
          </div>
        </motion.div>
      )}

      {tracks[3] && (
        <motion.div
          style={{ y: yTrack4, scale: scaleTrack4, x: yTrack3 }}
          className="absolute top-3/4 left-1/6  w-[280px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={(el) => {
                iframeRefs.current[3] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[3].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="280"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(3)}
            />
          </div>
        </motion.div>
      )}
      {tracks[4] && (
        <motion.div
          style={{ y: yTrack5, scale: scaleTrack5, x: yTrack2 }}
          className="absolute top-1/3 left-1/4  w-[280px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl ">
            <iframe
              ref={(el) => {
                iframeRefs.current[4] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[4].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="280"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(4)}
            />
          </div>
        </motion.div>
      )}
      {tracks[5] && (
        <motion.div
          style={{ y: yTrack6, scale: scaleTrack6, x: yTrack5 }}
          className="absolute top-1/6 left-1/6  w-[280px] group cursor-pointer"
        >
          <div className="block relative rounded-2xl overflow-hidden shadow-2xl">
            <iframe
              ref={(el) => {
                iframeRefs.current[5] = el;
              }}
              src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                tracks[5].url
              )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&visual=false`}
              width="100%"
              height="280"
              frameBorder="no"
              scrolling="no"
            />
            <div
              className="absolute inset-0 cursor-pointer"
              onClick={() => handleTrackClick(5)}
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
