"use client";

import { cubicBezier, motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedSeparator() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: "100%",
      transition: { duration: 1, ease: cubicBezier(0.25, 0.1, 0.25, 1) },
    },
  };

  return (
    <div ref={ref} className="w-full overflow-hidden">
      <motion.div
        className="h-px bg-foreground"
        variants={lineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      />
    </div>
  );
}
