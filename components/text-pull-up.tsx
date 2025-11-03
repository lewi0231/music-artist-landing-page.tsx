"use client";

import { cubicBezier, motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function TextPullUp({ children }: { children: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const text = children.split(" ");

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        staggerChildren: 0.02,
        duration: 3,
      },
    },
  };

  const wordVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        // delay,
        duration: 0.3,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
      },
    },
  };

  return (
    <div className="relative" ref={ref}>
      <motion.div
        className="relative flex flex-wrap"
        animate={isInView ? "animate" : ""}
        initial="initial"
        variants={containerVariants}
      >
        {text.map((word, index) => (
          <span
            key={index}
            className="overflow-hidden mr-[.25rem] inline-block"
          >
            <motion.span className={"inline-block"} variants={wordVariants}>
              {word}
            </motion.span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
