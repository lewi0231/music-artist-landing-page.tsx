"use client";

import { cn } from "@/lib/utils";
import { cubicBezier, motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function ImagePullUpWrapper({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
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

  const imageVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        delay,
        duration: 1,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
      },
    },
  };

  return (
    <div className="relative" ref={ref}>
      <motion.div
        className="space-y-10 relative"
        animate={isInView ? "animate" : ""}
        initial="initial"
        variants={containerVariants}
      >
        <div className="overflow-hidden">
          <motion.div className={cn(className)} variants={imageVariants}>
            {children}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
