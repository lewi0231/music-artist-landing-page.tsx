"use client";

import { cn } from "@/lib/utils";
import { cubicBezier, motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function WordsPullUp({
  text,
  delay = 0,
  className = "",
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const wordVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        delay,
        duration: 0.7,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
      },
    },
  };

  return (
    <div className="relative" ref={ref}>
      <motion.div
        className="relative"
        animate={isInView ? "animate" : ""}
        initial="initial"
        variants={containerVariants}
      >
        <div className="overflow-hidden">
          <motion.div
            className={cn(className, "pb-2")}
            style={
              {
                // lineHeight: 1.25,
              }
            }
            variants={wordVariants}
          >
            {text}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
