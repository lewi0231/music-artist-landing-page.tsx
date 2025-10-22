"use client";

import { cubicBezier, motion } from "framer-motion";

export default function TitlePullUp({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) {
  const words = text.split(" ");

  const containerVariants = {
    initial: {},
    animate: {
      transition: {
        delayChildren: delay,
        staggerChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    initial: { y: "100%" },
    animate: {
      y: 0,
      transition: {
        duration: 0.75,
        ease: cubicBezier(0.25, 0.1, 0.25, 1),
      },
    },
  };

  return (
    <div className="relative">
      <motion.div
        className=" relative"
        animate="animate"
        initial="initial"
        variants={containerVariants}
      >
        {words.map((word, index) => {
          return (
            <div key={index} className="overflow-hidden">
              <motion.div
                className="sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] text-start tracking-narrow bg-clip-text text-transparent bg-[url('/seabirds-background.jpg')] bg-cover bg-center -ml-2 transition-all duration-500"
                style={{
                  lineHeight: 1,
                }}
                variants={wordVariants}
              >
                {word}
              </motion.div>
            </div>
          );
        })}

        <div className="overflow-hidden">
          <motion.div
            className="sm:text-[7rem] md:text-[9rem] lg:text-[11rem] xl:text-[13rem] text-start tracking-narrow bg-clip-text text-transparent bg-[url('/seabirds-background.jpg')] bg-cover bg-center -ml-2 transition-all duration-500"
            style={{
              lineHeight: 1,
            }}
            variants={wordVariants}
          >
            ▼
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
